/**
 * Options for price formatting
 */
export interface PriceFormatOptions {
  /** Currency code (default: 'USD') */
  currency?: string;
  /** Locale for formatting (default: 'en-US') */
  locale?: string;
  /** Minimum number of fraction digits */
  minimumFractionDigits?: number;
  /** Maximum number of fraction digits */
  maximumFractionDigits?: number;
  /** Use compact notation (e.g., 1.2M, 5K) */
  compact?: boolean;
}

/**
 * Interface for price formatting service
 * Provides locale-aware price formatting with various options
 */
export interface IPriceFormatter {
  /**
   * Format a price value according to the specified options
   * @param price - The price value to format
   * @param options - Formatting options
   * @returns Formatted price string
   */
  format(price: number, options?: PriceFormatOptions): string;
}
