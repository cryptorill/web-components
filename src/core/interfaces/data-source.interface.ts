import { CryptoPrice } from '../types/crypto-price';
import { HistoricalPriceData, HistoricalPriceQuery } from '../types/historical-price';

/**
 * Interface for price data sources
 * Abstraction for fetching cryptocurrency price data
 */
export interface IPriceDataSource {
  /**
   * Fetch prices for multiple symbols
   * @param symbols - Array of cryptocurrency symbols (e.g., ['BTC', 'ETH'])
   * @returns Promise resolving to array of CryptoPrice objects
   */
  fetchPrices(symbols: string[]): Promise<CryptoPrice[]>;

  /**
   * Fetch price for a single symbol
   * @param symbol - Cryptocurrency symbol (e.g., 'BTC')
   * @returns Promise resolving to CryptoPrice object
   */
  fetchPrice(symbol: string): Promise<CryptoPrice>;

  /**
   * Subscribe to price updates for a symbol with a specific interval
   * The refresh interval will be the lowest among all subscribers for that symbol
   * @param symbol - Cryptocurrency symbol
   * @param interval - Refresh interval in milliseconds
   * @param callback - Callback to receive price updates
   * @param errorCallback - Optional callback for errors
   * @returns Consumer ID that can be used to unsubscribe
   */
  subscribe?(symbol: string, interval: number, callback: (price: CryptoPrice) => void, errorCallback?: (error: Error) => void): string;

  /**
   * Unsubscribe from price updates
   * @param symbol - Cryptocurrency symbol
   * @param consumerId - Consumer ID returned from subscribe
   */
  unsubscribe?(symbol: string, consumerId: string): void;

  /**
   * Get current cached price for a symbol (synchronous)
   * @param symbol - Cryptocurrency symbol
   * @returns Cached price or null if not cached
   */
  getPrice?(symbol: string): CryptoPrice | null;

  /**
   * Fetch historical prices for a cryptocurrency pair
   * @param query - Query parameters including pair and optional limit
   * @returns Promise resolving to HistoricalPriceData with timestamped price points
   */
  fetchHistoricalPrices(query: HistoricalPriceQuery): Promise<HistoricalPriceData>;
}

// Re-export types for convenience
export { CryptoPrice } from '../types/crypto-price';
export { HistoricalPriceData, HistoricalPriceQuery, HistoricalPricePoint, HistoricalPriceBatchResponse } from '../types/historical-price';
