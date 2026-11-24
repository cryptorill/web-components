import { Component, Host, h, Prop } from '@stencil/core';
import { priceFormatterService } from '../../core/services/price-formatter.service';

/**
 * Cryptorill Order Row Component
 * Single order book row with price, amount, total, and depth visualization bar
 */

@Component({
  tag: 'cryptorill-order-row',
  styleUrl: 'cryptorill-order-row.css',
  shadow: true,
})
export class CryptorillOrderRow {
  /**
   * Order price
   */
  @Prop() price: number = 0;

  /**
   * Order amount
   */
  @Prop() amount: number = 0;

  /**
   * Order total (price * amount)
   */
  @Prop() total: number = 0;

  /**
   * Order type: 'bid' (buy) or 'ask' (sell)
   */
  @Prop() type: 'bid' | 'ask' = 'bid';

  /**
   * Depth percentage for visualization bar (0-100)
   */
  @Prop() depthPercent: number = 0;

  /**
   * Theme variant: 'dark' | 'light' | 'gradient'
   */
  @Prop() theme: 'dark' | 'light' | 'gradient' = 'dark';

  /**
   * Currency code for formatting (default: 'USD')
   */
  @Prop() currency: string = 'USD';

  /**
   * Cryptocurrency symbol for amount formatting
   */
  @Prop() cryptoSymbol: string = '';

  private get currencySymbol(): string {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CNY: '¥',
    };
    return symbols[this.currency.toUpperCase()] || this.currency;
  }

  private get formattedPrice(): string {
    return priceFormatterService.format(this.price, {
      currency: this.currency,
    });
  }

  private get formattedAmount(): string {
    if (this.amount >= 1000000) {
      return `${(this.amount / 1000000).toFixed(2)}M`;
    } else if (this.amount >= 1000) {
      return `${(this.amount / 1000).toFixed(2)}K`;
    }
    return this.amount.toFixed(this.amount < 1 ? 4 : 2);
  }

  private get formattedTotal(): string {
    return priceFormatterService.format(this.total, {
      currency: this.currency,
      compact: this.total >= 1000000,
    });
  }

  render() {
    const typeClass = `cr-order-row--${this.type}`;
    const themeClass = `cr-order-row--theme-${this.theme}`;
    const depthStyle = { width: `${Math.min(Math.max(this.depthPercent, 0), 100)}%` };

    return (
      <Host>
        <div class={`cryptorill-order-row ${typeClass} ${themeClass}`}>
          {/* Depth Bar Background */}
          <div class={`cr-order-row__depth-bar cr-order-row__depth-bar--${this.type}`} style={depthStyle} />

          {/* Price */}
          <div class={`cr-order-row__cell cr-order-row__price cr-order-row__price--${this.type}`}>
            {this.currencySymbol}
            {this.formattedPrice}
          </div>

          {/* Amount */}
          <div class="cr-order-row__cell cr-order-row__amount">
            <span class="cr-order-row__amount-value">{this.formattedAmount}</span>
            {this.cryptoSymbol && <span class="cr-order-row__amount-symbol">{this.cryptoSymbol}</span>}
          </div>

          {/* Total */}
          <div class="cr-order-row__cell cr-order-row__total">
            {this.currencySymbol}
            {this.formattedTotal}
          </div>
        </div>
      </Host>
    );
  }
}
