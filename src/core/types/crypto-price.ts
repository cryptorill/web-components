/**
 * Unified CryptoPrice type
 * Represents cryptocurrency price data throughout the application
 * Replaces CryptoPriceDto, CryptoPriceModel, and CryptoPrice interface
 */
export interface CryptoPrice {
  /** Unique identifier for the cryptocurrency */
  id: string;
  /** Full name of the cryptocurrency (e.g., "Bitcoin") */
  name: string;
  /** Symbol of the cryptocurrency (e.g., "BTC") */
  symbol: string;
  /** Current price as a string to preserve precision */
  price: string;
  /** 24-hour price change percentage as a string (e.g., "2.5" or "-1.2") */
  dayChange?: string;
  /** Unix timestamp when the price was fetched */
  timestamp?: number;
  /** Trading pair if available (e.g., "BTCUSDT") */
  pair?: string;
}

/**
 * Type guard for runtime validation of CryptoPrice objects
 */
export function isCryptoPrice(obj: unknown): obj is CryptoPrice {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    typeof (obj as Record<string, unknown>).id === 'string' &&
    'symbol' in obj &&
    typeof (obj as Record<string, unknown>).symbol === 'string' &&
    'price' in obj &&
    typeof (obj as Record<string, unknown>).price === 'string'
  );
}

/**
 * API Response wrapper for batch price requests
 */
export interface CryptoPriceBatchResponse {
  /** Array of price data */
  data: CryptoPrice[];
  /** Response timestamp */
  timestamp: number;
}
