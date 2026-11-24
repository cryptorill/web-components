import { IPriceFormatter, PriceFormatOptions } from '../interfaces/price-formatter.interface';

/**
 * Default format options
 */
const DEFAULT_OPTIONS: Required<PriceFormatOptions> = {
  currency: 'USD',
  locale: 'en-US',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  compact: false,
};

/**
 * Service for formatting prices with locale support
 * Uses Intl.NumberFormat for consistent, locale-aware formatting
 */
export class PriceFormatterService implements IPriceFormatter {
  /**
   * Format a price value according to the specified options
   * @param price - The price value to format
   * @param options - Formatting options
   * @returns Formatted price string
   */
  format(price: number, options?: PriceFormatOptions): string {
    if (isNaN(price)) {
      return '---';
    }

    if (price === 0) {
      return '0.00';
    }

    const opts = { ...DEFAULT_OPTIONS, ...options };
    const isNegative = price < 0;
    const absPrice = Math.abs(price);

    // Build Intl.NumberFormat options
    const formatOptions: Intl.NumberFormatOptions = {
      style: 'decimal',
      currency: opts.currency,
      minimumFractionDigits: opts.minimumFractionDigits,
      maximumFractionDigits: opts.maximumFractionDigits,
    };

    // Handle compact notation
    if (opts.compact) {
      formatOptions.notation = 'compact';
      formatOptions.compactDisplay = 'short';
    }

    // Auto-adjust fraction digits for small prices when not explicitly set
    if (absPrice < 1 && !options?.minimumFractionDigits && !options?.maximumFractionDigits) {
      formatOptions.style = 'decimal';
      if (absPrice < 0.0001) {
        formatOptions.maximumFractionDigits = 8;
        formatOptions.minimumFractionDigits = 8;
      } else if (absPrice < 0.01) {
        formatOptions.maximumFractionDigits = 6;
        formatOptions.minimumFractionDigits = 6;
      } else {
        formatOptions.maximumFractionDigits = 4;
        formatOptions.minimumFractionDigits = 4;
      }
    }

    const formatted = new Intl.NumberFormat(opts.locale, formatOptions).format(absPrice);

    return isNegative ? `-${formatted}` : formatted;
  }
}

/**
 * Singleton instance of the price formatter service
 */
export const priceFormatterService = new PriceFormatterService();
