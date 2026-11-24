import { IPriceDataSource, CryptoPrice } from '../interfaces/data-source.interface';
import { ILogger } from '../interfaces/logger.interface';
import { container } from '../di/container';
import { LOGGER_TOKEN } from '../di/tokens';
import { PRICE_DATA_SOURCE_TOKEN } from '../di/tokens';
import { HistoricalPriceData, HistoricalPriceQuery } from '../types/historical-price';

/**
 * Cache entry for a price
 */
interface PriceCacheEntry {
  price: CryptoPrice;
  timestamp: number;
}

/**
 * Consumer info for a symbol-pair
 */
interface ConsumerInfo {
  id: string;
  interval: number;
  callback: (price: CryptoPrice) => void;
  errorCallback?: (error: Error) => void;
}

/**
 * Symbol-pair cache configuration
 */
interface SymbolPairConfig {
  cache: PriceCacheEntry | null;
  consumers: Map<string, ConsumerInfo>;
  refreshTimerId: ReturnType<typeof setInterval> | null;
  currentInterval: number;
  isLoading: boolean;
  loadingPromise: Promise<CryptoPrice> | null;
}

/**
 * Historical price cache entry
 */
interface HistoricalPriceCacheEntry {
  data: HistoricalPriceData;
  timestamp: number;
  query: HistoricalPriceQuery;
}

/**
 * Cached Price DataSource
 * Wraps IPriceDataSource to provide caching with per-symbol-pair refresh intervals.
 * Uses the lowest interval among all consumers for each symbol-pair.
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles caching and interval management
 * - Open/Closed: Extends functionality without modifying original DataSource
 * - Liskov Substitution: Implements same interface as IPriceDataSource
 * - Interface Segregation: Only exposes what's needed
 * - Dependency Inversion: Depends on IPriceDataSource abstraction
 */
export class CachedPriceDataSource implements IPriceDataSource {
  private readonly wrappedDataSource: IPriceDataSource;
  private readonly logger: ILogger;
  private readonly symbolPairCache: Map<string, SymbolPairConfig> = new Map();
  private readonly historicalPriceCache: Map<string, HistoricalPriceCacheEntry> = new Map();
  private readonly defaultInterval: number = 30000; // 30 seconds default
  private readonly historicalCacheDuration: number = 60000; // 1 minute for historical data
  private consumerIdCounter: number = 0;

  /**
   * Create a new CachedPriceDataSource
   * @param wrappedDataSource - The underlying data source to wrap
   * @param logger - Logger instance
   */
  constructor(wrappedDataSource?: IPriceDataSource, logger?: ILogger) {
    this.wrappedDataSource = wrappedDataSource ?? container.resolve<IPriceDataSource>(PRICE_DATA_SOURCE_TOKEN);
    this.logger = logger ?? container.resolve<ILogger>(LOGGER_TOKEN);
  }

  /**
   * Fetch prices for multiple symbols
   * Reads from cache if available, otherwise fetches from underlying source
   * @param symbols - Array of cryptocurrency symbols (e.g., ['BTC', 'ETH'])
   * @returns Promise resolving to array of CryptoPrice objects
   */
  async fetchPrices(symbols: string[]): Promise<CryptoPrice[]> {
    this.logger.debug('CachedPriceDataSource: fetchPrices called', { symbols });

    const results: CryptoPrice[] = [];
    const symbolsToFetch: string[] = [];

    // Check cache for each symbol
    for (const symbol of symbols) {
      const normalizedSymbol = this.normalizeSymbol(symbol);
      const cacheEntry = this.getCacheEntry(normalizedSymbol);

      if (cacheEntry && this.isCacheValid(cacheEntry)) {
        this.logger.debug('CachedPriceDataSource: Cache hit', { symbol: normalizedSymbol });
        results.push(cacheEntry.price);
      } else {
        symbolsToFetch.push(normalizedSymbol);
      }
    }

    // Fetch missing symbols from underlying source
    if (symbolsToFetch.length > 0) {
      this.logger.debug('CachedPriceDataSource: Fetching from source', { symbols: symbolsToFetch });
      const fetchedPrices = await this.wrappedDataSource.fetchPrices(symbolsToFetch);

      // Update cache with fetched prices
      for (const price of fetchedPrices) {
        this.setCacheEntry(price.symbol, price);
        results.push(price);
      }
    }

    return results;
  }

  /**
   * Fetch price for a single symbol
   * Reads from cache if available, otherwise fetches from underlying source
   * @param symbol - Cryptocurrency symbol (e.g., 'BTC')
   * @returns Promise resolving to CryptoPrice object
   */
  async fetchPrice(symbol: string): Promise<CryptoPrice> {
    const normalizedSymbol = this.normalizeSymbol(symbol);
    this.logger.debug('CachedPriceDataSource: fetchPrice called', { symbol: normalizedSymbol });

    const cacheEntry = this.getCacheEntry(normalizedSymbol);

    if (cacheEntry && this.isCacheValid(cacheEntry)) {
      this.logger.debug('CachedPriceDataSource: Cache hit', { symbol: normalizedSymbol });
      return cacheEntry.price;
    }

    this.logger.debug('CachedPriceDataSource: Cache miss, fetching from source', { symbol: normalizedSymbol });
    const price = await this.wrappedDataSource.fetchPrice(normalizedSymbol);
    this.setCacheEntry(normalizedSymbol, price);

    return price;
  }

  /**
   * Subscribe to price updates for a symbol with a specific interval
   * The refresh interval will be the lowest among all subscribers for that symbol
   * @param symbol - Cryptocurrency symbol
   * @param interval - Refresh interval in milliseconds
   * @param callback - Callback to receive price updates
   * @param errorCallback - Optional callback for errors
   * @returns Consumer ID that can be used to unsubscribe
   */
  subscribe(symbol: string, interval: number, callback: (price: CryptoPrice) => void, errorCallback?: (error: Error) => void): string {
    const normalizedSymbol = this.normalizeSymbol(symbol);
    const consumerId = `consumer_${++this.consumerIdCounter}`;

    this.logger.debug('CachedPriceDataSource: New subscription', { symbol: normalizedSymbol, interval, consumerId });

    // Get or create symbol pair config
    let config = this.symbolPairCache.get(normalizedSymbol);
    const isFirstConsumer = !config || config.consumers.size === 0;
    if (!config) {
      config = {
        cache: null,
        consumers: new Map(),
        refreshTimerId: null,
        currentInterval: interval,
        isLoading: false,
        loadingPromise: null,
      };
      this.symbolPairCache.set(normalizedSymbol, config);
    }

    // Add consumer
    config.consumers.set(consumerId, {
      id: consumerId,
      interval,
      callback,
      errorCallback,
    });

    // Update interval to lowest among all consumers
    // For the first consumer, force start the refresh timer
    if (isFirstConsumer) {
      this.restartRefresh(normalizedSymbol, config);
    } else {
      this.updateRefreshInterval(normalizedSymbol, config);
    }

    // If we have a valid cached price, immediately notify the new consumer
    if (config.cache && this.isCacheValid(config.cache)) {
      setTimeout(() => callback(config!.cache!.price), 0);
    } else if (config.isLoading && config.loadingPromise) {
      // Another component is already loading - wait for it
      config.loadingPromise
        .then(price => {
          callback(price);
        })
        .catch(() => {
          // If loading fails, try to fetch again
          this.fetchInitialPrice(normalizedSymbol, config!, callback);
        });
    } else {
      // No cache and not loading - fetch initial price
      this.fetchInitialPrice(normalizedSymbol, config, callback);
    }

    return consumerId;
  }

  /**
   * Unsubscribe from price updates
   * @param symbol - Cryptocurrency symbol
   * @param consumerId - Consumer ID returned from subscribe
   */
  unsubscribe(symbol: string, consumerId: string): void {
    const normalizedSymbol = this.normalizeSymbol(symbol);
    const config = this.symbolPairCache.get(normalizedSymbol);

    if (!config) {
      this.logger.warn('CachedPriceDataSource: No subscription found', { symbol: normalizedSymbol, consumerId });
      return;
    }

    this.logger.debug('CachedPriceDataSource: Unsubscribing', { symbol: normalizedSymbol, consumerId });

    config.consumers.delete(consumerId);

    // If no more consumers, stop refresh and clean up
    if (config.consumers.size === 0) {
      this.stopRefresh(normalizedSymbol, config);
      this.symbolPairCache.delete(normalizedSymbol);
    } else {
      // Update interval to lowest among remaining consumers
      this.updateRefreshInterval(normalizedSymbol, config);
    }
  }

  /**
   * Force refresh cache for a specific symbol
   * @param symbol - Cryptocurrency symbol
   */
  async refresh(symbol: string): Promise<void> {
    const normalizedSymbol = this.normalizeSymbol(symbol);
    this.logger.debug('CachedPriceDataSource: Force refresh', { symbol: normalizedSymbol });

    try {
      const price = await this.wrappedDataSource.fetchPrice(normalizedSymbol);
      this.setCacheEntry(normalizedSymbol, price);

      // Notify all consumers
      const config = this.symbolPairCache.get(normalizedSymbol);
      if (config) {
        for (const consumer of config.consumers.values()) {
          consumer.callback(price);
        }
      }
    } catch (error) {
      this.logger.error('CachedPriceDataSource: Error refreshing price', error instanceof Error ? error : undefined);
    }
  }

  /**
   * Get current cached price for a symbol (synchronous)
   * @param symbol - Cryptocurrency symbol
   * @returns Cached price or null if not cached
   */
  getPrice(symbol: string): CryptoPrice | null {
    const normalizedSymbol = this.normalizeSymbol(symbol);
    const cacheEntry = this.getCacheEntry(normalizedSymbol);

    if (cacheEntry && this.isCacheValid(cacheEntry)) {
      return cacheEntry.price;
    }

    return null;
  }

  /**
   * Clear cache for a specific symbol
   * @param symbol - Cryptocurrency symbol
   */
  clearCache(symbol?: string): void {
    if (symbol) {
      const normalizedSymbol = this.normalizeSymbol(symbol);
      const config = this.symbolPairCache.get(normalizedSymbol);
      if (config) {
        config.cache = null;
        this.logger.debug('CachedPriceDataSource: Cache cleared', { symbol: normalizedSymbol });
      }
    } else {
      // Clear all caches
      for (const config of this.symbolPairCache.values()) {
        config.cache = null;
      }
      this.logger.debug('CachedPriceDataSource: All caches cleared');
    }
  }

  /**
   * Get cache status for a symbol
   * @param symbol - Cryptocurrency symbol
   * @returns Object with cache status info
   */
  getCacheStatus(symbol: string): { cached: boolean; age: number | null; consumers: number; interval: number } {
    const normalizedSymbol = this.normalizeSymbol(symbol);
    const config = this.symbolPairCache.get(normalizedSymbol);

    if (!config || !config.cache) {
      return { cached: false, age: null, consumers: 0, interval: this.defaultInterval };
    }

    const age = Date.now() - config.cache.timestamp;
    return {
      cached: true,
      age,
      consumers: config.consumers.size,
      interval: config.currentInterval,
    };
  }

  /**
   * Fetch historical prices for a cryptocurrency pair
   * @param query - Query parameters including pair and optional limit
   * @returns Promise resolving to HistoricalPriceData with timestamped price points
   */
  async fetchHistoricalPrices(query: HistoricalPriceQuery): Promise<HistoricalPriceData> {
    const cacheKey = `${query.pair.toLowerCase()}:${query.limit ?? 25}`;
    this.logger.debug('CachedPriceDataSource: fetchHistoricalPrices called', { query, cacheKey });

    // Check cache first
    const cachedEntry = this.historicalPriceCache.get(cacheKey);
    if (cachedEntry && this.isHistoricalCacheValid(cachedEntry)) {
      this.logger.debug('CachedPriceDataSource: Historical cache hit', { cacheKey });
      return cachedEntry.data;
    }

    // Fetch from underlying source
    this.logger.debug('CachedPriceDataSource: Historical cache miss, fetching from source', { query });
    const historicalData = await this.wrappedDataSource.fetchHistoricalPrices(query);

    // Cache the result
    this.historicalPriceCache.set(cacheKey, {
      data: historicalData,
      timestamp: Date.now(),
      query,
    });

    return historicalData;
  }

  /**
   * Clear historical price cache for a specific pair and limit
   * @param pair - Cryptocurrency pair (e.g., 'btcusdt')
   * @param limit - Number of data points (optional)
   */
  clearHistoricalCache(pair: string, limit?: number): void {
    const normalizedPair = pair.toLowerCase();
    const cacheKey = `${normalizedPair}:${limit ?? 25}`;

    if (this.historicalPriceCache.has(cacheKey)) {
      this.historicalPriceCache.delete(cacheKey);
      this.logger.debug('CachedPriceDataSource: Historical cache cleared', { cacheKey });
    }
  }

  /**
   * Clear all historical price caches
   */
  clearAllHistoricalCaches(): void {
    this.historicalPriceCache.clear();
    this.logger.debug('CachedPriceDataSource: All historical caches cleared');
  }

  // Private methods

  private normalizeSymbol(symbol: string): string {
    return symbol.trim().toUpperCase();
  }

  private getCacheEntry(symbol: string): PriceCacheEntry | null {
    const config = this.symbolPairCache.get(symbol);
    return config?.cache ?? null;
  }

  private setCacheEntry(symbol: string, price: CryptoPrice): void {
    let config = this.symbolPairCache.get(symbol);
    if (!config) {
      config = {
        cache: null,
        consumers: new Map(),
        refreshTimerId: null,
        currentInterval: this.defaultInterval,
        isLoading: false,
        loadingPromise: null,
      };
      this.symbolPairCache.set(symbol, config);
    }

    config.cache = {
      price,
      timestamp: Date.now(),
    };

    // Clear loading state
    config.isLoading = false;
    config.loadingPromise = null;

    // Notify all consumers about the new price
    for (const consumer of config.consumers.values()) {
      consumer.callback(price);
    }
  }

  private isCacheValid(cacheEntry: PriceCacheEntry): boolean {
    const config = this.symbolPairCache.get(cacheEntry.price.symbol);
    if (!config || config.consumers.size === 0) {
      // No consumers, use default interval
      return Date.now() - cacheEntry.timestamp < this.defaultInterval;
    }

    // Use the current interval for this symbol
    return Date.now() - cacheEntry.timestamp < config.currentInterval;
  }

  private isHistoricalCacheValid(entry: HistoricalPriceCacheEntry): boolean {
    return Date.now() - entry.timestamp < this.historicalCacheDuration;
  }

  private updateRefreshInterval(symbol: string, config: SymbolPairConfig): void {
    // Find the lowest interval among all consumers
    let lowestInterval = this.defaultInterval;
    for (const consumer of config.consumers.values()) {
      if (consumer.interval < lowestInterval) {
        lowestInterval = consumer.interval;
      }
    }

    // If interval changed, restart the refresh timer
    if (config.currentInterval !== lowestInterval) {
      this.logger.debug('CachedPriceDataSource: Updating refresh interval', {
        symbol,
        oldInterval: config.currentInterval,
        newInterval: lowestInterval,
      });

      config.currentInterval = lowestInterval;
      this.restartRefresh(symbol, config);
    }
  }

  private restartRefresh(symbol: string, config: SymbolPairConfig): void {
    // Stop existing timer
    if (config.refreshTimerId) {
      clearInterval(config.refreshTimerId);
      config.refreshTimerId = null;
    }

    // Don't start if no consumers
    if (config.consumers.size === 0) {
      return;
    }

    // Start new timer with the lowest interval
    config.refreshTimerId = setInterval(async () => {
      await this.refresh(symbol);
    }, config.currentInterval);

    this.logger.debug('CachedPriceDataSource: Refresh timer started', {
      symbol,
      interval: config.currentInterval,
    });
  }

  private stopRefresh(symbol: string, config: SymbolPairConfig): void {
    if (config.refreshTimerId) {
      clearInterval(config.refreshTimerId);
      config.refreshTimerId = null;
      this.logger.debug('CachedPriceDataSource: Refresh timer stopped', { symbol });
    }
  }

  private async fetchInitialPrice(symbol: string, config: SymbolPairConfig, callback: (price: CryptoPrice) => void): Promise<void> {
    // Set loading state IMMEDIATELY to prevent duplicate fetches
    // This must be done synchronously before any async operations
    if (config.isLoading && config.loadingPromise) {
      this.logger.debug('CachedPriceDataSource: Fetch already in progress, waiting...', { symbol });
      try {
        const price = await config.loadingPromise;
        callback(price);
      } catch (error) {
        // If the existing fetch failed, try again
        this.logger.debug('CachedPriceDataSource: Existing fetch failed, retrying...', { symbol });
        config.isLoading = false;
        config.loadingPromise = null;
        await this.fetchInitialPriceRetry(symbol, config, callback);
      }
      return;
    }

    config.isLoading = true;

    // Create the promise
    const fetchPromise = this.wrappedDataSource.fetchPrice(symbol);
    config.loadingPromise = fetchPromise;

    try {
      this.logger.debug('CachedPriceDataSource: Fetching initial price', { symbol });
      const price = await fetchPromise;
      config.cache = {
        price,
        timestamp: Date.now(),
      };
      config.isLoading = false;
      config.loadingPromise = null;
      callback(price);
    } catch (error) {
      config.isLoading = false;
      config.loadingPromise = null;
      this.logger.error('CachedPriceDataSource: Error fetching initial price', error instanceof Error ? error : undefined);
    }
  }

  private async fetchInitialPriceRetry(symbol: string, config: SymbolPairConfig, callback: (price: CryptoPrice) => void): Promise<void> {
    config.isLoading = true;
    const fetchPromise = this.wrappedDataSource.fetchPrice(symbol);
    config.loadingPromise = fetchPromise;

    try {
      this.logger.debug('CachedPriceDataSource: Retrying fetch initial price', { symbol });
      const price = await fetchPromise;
      config.cache = {
        price,
        timestamp: Date.now(),
      };
      config.isLoading = false;
      config.loadingPromise = null;
      callback(price);
    } catch (error) {
      config.isLoading = false;
      config.loadingPromise = null;
      this.logger.error('CachedPriceDataSource: Error retrying fetch initial price', error instanceof Error ? error : undefined);
    }
  }
}
