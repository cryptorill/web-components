/**
 * Query parameters for historical price requests
 */
export interface HistoricalPriceQuery {
  /** The cryptocurrency pair to query (e.g., "btcusdt") */
  pair: string;

  /** Number of data points to retrieve (default: 24) */
  limit?: number;
}

/**
 * Individual historical price point with timestamp
 */
export interface HistoricalPricePoint {
  /** Unix timestamp in milliseconds */
  timestamp: number;

  /** Price value at the given timestamp */
  price: string;
}

/**
 * Response containing historical price data for a cryptocurrency pair
 */
export interface HistoricalPriceData {
  /** The cryptocurrency pair */
  pair: string;

  /** Array of historical price data points with timestamps */
  data: HistoricalPricePoint[];
}

/**
 * Batch response wrapper for multiple historical price requests
 */
export interface HistoricalPriceBatchResponse {
  /** Array of historical price data */
  data: HistoricalPriceData[];

  /** Response timestamp */
  timestamp: number;
}
