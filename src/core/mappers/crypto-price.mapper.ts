import { CryptoPrice } from '../types/crypto-price';

/**
 * API Response structure from CryptoRill API
 * Based on swagger.json PriceData schema
 */
interface PriceDataResponse {
  /** The current price of the cryptocurrency */
  price: string;
  /** The 24-hour price change percentage (nullable) */
  dayChange?: string | null;
}

/**
 * Mapper for converting API responses to CryptoPrice type
 * Simplified to only essential conversions
 */
export const CryptoPriceMapper = {
  /**
   * Convert raw API response to CryptoPrice
   * Used when API returns PriceData object with price and optional dayChange
   * @param symbol - Cryptocurrency symbol
   * @param response - Raw API response object containing price and optional dayChange
   * @returns CryptoPrice object
   */
  fromRawResponse(symbol: string, response: PriceDataResponse | string): CryptoPrice {
    const trimmedSymbol = symbol.trim().toUpperCase();

    // Handle both object response (new API) and string response (legacy)
    const price = typeof response === 'string' ? response : response.price;
    const dayChange = typeof response === 'string' ? undefined : (response.dayChange ?? undefined);

    return {
      id: trimmedSymbol.toLowerCase(),
      name: trimmedSymbol,
      symbol: trimmedSymbol,
      price,
      dayChange,
      timestamp: Date.now(),
    };
  },

  /**
   * Convert batch API response to array of CryptoPrice objects
   * @param data - Array of symbol/price pairs from API
   * @returns Array of CryptoPrice objects
   */
  fromBatchResponse(data: Array<{ symbol: string; price: string; dayChange?: string | null }>): CryptoPrice[] {
    return data.map(item =>
      this.fromRawResponse(item.symbol, {
        price: item.price,
        dayChange: item.dayChange,
      }),
    );
  },
};
