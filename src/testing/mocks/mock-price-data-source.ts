/**
 * Mock implementation of IPriceDataSource for testing
 */
import { IPriceDataSource, CryptoPrice } from '../../core/interfaces/data-source.interface';
import { HistoricalPriceData, HistoricalPriceQuery } from '../../core/types/historical-price';

export class MockPriceDataSource implements IPriceDataSource {
  /** Map of symbol to CryptoPrice */
  prices: Map<string, CryptoPrice> = new Map();

  /** Whether the mock should simulate failures */
  shouldFail: boolean = false;

  /** Artificial delay in milliseconds for async operations */
  delay: number = 0;

  /** Historical price data storage */
  historicalData: Map<string, HistoricalPriceData> = new Map();

  /**
   * Set a price for a symbol
   * @param symbol - Cryptocurrency symbol
   * @param price - CryptoPrice object, price string, or price with dayChange
   * @param dayChange - Optional 24h price change percentage (e.g., "2.5" or "-1.2")
   */
  setPrice(symbol: string, price: CryptoPrice | string, dayChange?: string): void {
    if (typeof price === 'string') {
      this.prices.set(symbol.toLowerCase(), {
        id: symbol.toLowerCase(),
        name: symbol.toUpperCase(),
        symbol: symbol.toUpperCase(),
        price: price,
        dayChange: dayChange,
      });
    } else {
      this.prices.set(symbol.toLowerCase(), price);
    }
  }

  /**
   * Set historical data for a pair
   * @param pair - Cryptocurrency pair (e.g., 'btcusdt')
   * @param data - Historical price data points
   */
  setHistoricalData(pair: string, data: HistoricalPriceData): void {
    this.historicalData.set(pair.toLowerCase(), data);
  }

  /**
   * Set whether subsequent calls should fail
   * @param value - True to make calls fail
   */
  setShouldFail(value: boolean): void {
    this.shouldFail = value;
  }

  /**
   * Set artificial delay for async operations
   * @param ms - Delay in milliseconds
   */
  setDelay(ms: number): void {
    this.delay = ms;
  }

  /**
   * Clear all configured prices and historical data
   */
  clear(): void {
    this.prices.clear();
    this.historicalData.clear();
  }

  /**
   * Fetch price for a single symbol
   * @param symbol - Cryptocurrency symbol
   * @returns Promise resolving to CryptoPrice
   */
  async fetchPrice(symbol: string): Promise<CryptoPrice> {
    if (this.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.delay));
    }

    if (this.shouldFail) {
      throw new Error(`Failed to fetch price for ${symbol}`);
    }

    const price = this.prices.get(symbol.toLowerCase());
    if (!price) {
      throw new Error(`Price not found for ${symbol}`);
    }

    return price;
  }

  /**
   * Fetch prices for multiple symbols
   * @param symbols - Array of cryptocurrency symbols
   * @returns Promise resolving to array of CryptoPrice objects
   */
  async fetchPrices(symbols: string[]): Promise<CryptoPrice[]> {
    if (this.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.delay));
    }

    if (this.shouldFail) {
      throw new Error('Failed to fetch prices');
    }

    const results: CryptoPrice[] = [];
    for (const symbol of symbols) {
      const price = this.prices.get(symbol.toLowerCase());
      if (price) {
        results.push(price);
      }
    }

    return results;
  }

  /**
   * Get current price for a symbol (alias for fetchPrice)
   * @param symbol - Cryptocurrency symbol
   * @returns Promise resolving to CryptoPrice
   */
  async getCurrentPrice(symbol: string): Promise<CryptoPrice> {
    return this.fetchPrice(symbol);
  }

  /**
   * Get prices for multiple symbols (alias for fetchPrices)
   * @param symbols - Array of cryptocurrency symbols
   * @returns Promise resolving to array of CryptoPrice objects
   */
  async getPrices(symbols: string[]): Promise<CryptoPrice[]> {
    return this.fetchPrices(symbols);
  }

  /** Whether subscribe should behave synchronously (for tests) */
  subscribeSync: boolean = false;

  /**
   * Subscribe to price updates (mock implementation)
   * @param symbol - Cryptocurrency symbol
   * @param interval - Refresh interval in milliseconds
   * @param callback - Callback to receive price updates
   * @param errorCallback - Optional callback for errors
   * @returns Consumer ID
   */
  subscribe?(symbol: string, _: number, callback: (price: CryptoPrice) => void, errorCallback?: (error: Error) => void): string {
    const consumerId = `mock_consumer_${Date.now()}`;

    // Handle error case first
    if (this.shouldFail) {
      if (this.subscribeSync) {
        errorCallback?.(new Error(`Failed to fetch price for ${symbol}`));
      } else {
        setTimeout(() => errorCallback?.(new Error(`Failed to fetch price for ${symbol}`)), 0);
      }
      return consumerId;
    }

    // Check if price exists
    const price = this.prices.get(symbol.toLowerCase());
    if (!price) {
      if (this.subscribeSync) {
        errorCallback?.(new Error(`Price not found for ${symbol}`));
      } else {
        setTimeout(() => errorCallback?.(new Error(`Price not found for ${symbol}`)), 0);
      }
      return consumerId;
    }

    // Call callback with price
    if (this.subscribeSync) {
      // Sync mode for tests - call immediately
      callback(price);
    } else {
      // Async mode - call after a tick (like real implementation)
      setTimeout(() => callback(price), 0);
    }
    return consumerId;
  }

  /**
   * Unsubscribe from price updates (mock implementation)
   * @param symbol - Cryptocurrency symbol
   * @param consumerId - Consumer ID returned from subscribe
   */
  unsubscribe?(_: string, __: string): void {
    // No-op for mock
  }

  /**
   * Get cached price (mock implementation)
   * @param symbol - Cryptocurrency symbol
   * @returns Cached price or null
   */
  getPrice?(symbol: string): CryptoPrice | null {
    return this.prices.get(symbol.toLowerCase()) ?? null;
  }

  /**
   * Fetch historical prices for a cryptocurrency pair (mock implementation)
   * @param query - Query parameters including pair and optional limit
   * @returns Promise resolving to HistoricalPriceData with timestamped price points
   */
  async fetchHistoricalPrices(query: HistoricalPriceQuery): Promise<HistoricalPriceData> {
    if (this.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.delay));
    }

    if (this.shouldFail) {
      throw new Error(`Failed to fetch historical prices for ${query.pair}`);
    }

    const cached = this.historicalData.get(query.pair.toLowerCase());
    if (cached) {
      return cached;
    }

    // Return default empty data if not configured
    return {
      pair: query.pair,
      data: [],
    };
  }
}
