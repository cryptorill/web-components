import { Component, Host, h, Prop } from '@stencil/core';
import { CryptoPrice } from '../../core/interfaces/data-source.interface';

/**
 * Cryptorill Trading Pair Component
 * Displays trading pair with base/quote icons, price, change, and optional spread
 *
 * Dependencies:
 * - cryptorill-token-icon
 * - cryptorill-price
 * - cryptorill-price-diff
 */

@Component({
  tag: 'cryptorill-trading-pair',
  styleUrl: 'cryptorill-trading-pair.css',
  shadow: true,
})
export class CryptorillTradingPair {
  /**
   * Base asset symbol (e.g., "BTC")
   */
  @Prop() baseSymbol: string = '';

  /**
   * Quote asset symbol (e.g., "USDT")
   */
  @Prop() quoteSymbol: string = '';

  /**
   * Current price (numeric value)
   */
  @Prop({ mutable: true }) price: number = 0;

  /**
   * CryptoPrice object from datasource (alternative to price/change24h props)
   * If provided, price and change24h will be derived from this object
   */
  @Prop() cryptoPrice: CryptoPrice | null = null;

  /**
   * 24h percentage change (overridden by cryptoPrice.dayChange if cryptoPrice is provided)
   */
  @Prop({ mutable: true }) change24h: number = 0;

  /**
   * Computed price value - uses cryptoPrice.price if available, otherwise falls back to price prop
   */
  private get computedPrice(): number {
    if (this.cryptoPrice?.price) {
      return parseFloat(this.cryptoPrice.price);
    }
    return this.price;
  }

  /**
   * Computed 24h change - uses cryptoPrice.dayChange if available, otherwise falls back to change24h prop
   */
  private get computedChange24h(): number {
    if (this.cryptoPrice?.dayChange) {
      return parseFloat(this.cryptoPrice.dayChange);
    }
    return this.change24h;
  }

  /**
   * Bid-ask spread percentage
   */
  @Prop() spread: number = 0;

  /**
   * Show spread indicator
   */
  @Prop() showSpread: boolean = true;

  /**
   * Theme variant: 'dark' | 'light' | 'gradient'
   */
  @Prop() theme: 'dark' | 'light' | 'gradient' = 'dark';

  /**
   * Size variant: 'sm' | 'md' | 'lg'
   */
  @Prop() size: 'sm' | 'md' | 'lg' = 'md';

  private get iconSize(): 'sm' | 'md' | 'lg' {
    switch (this.size) {
      case 'sm':
        return 'sm';
      case 'lg':
        return 'lg';
      default:
        return 'md';
    }
  }

  private get priceSize(): 'small' | 'medium' | 'large' {
    switch (this.size) {
      case 'sm':
        return 'small';
      case 'lg':
        return 'large';
      default:
        return 'medium';
    }
  }

  private get formattedSpread(): string {
    return `${this.spread.toFixed(3)}%`;
  }

  render() {
    const sizeClass = `cr-trading-pair--${this.size}`;
    const themeClass = `cr-trading-pair--theme-${this.theme}`;
    const directionClass = this.computedChange24h >= 0 ? 'cr-trading-pair--up' : 'cr-trading-pair--down';

    return (
      <Host>
        <div class={`cryptorill-trading-pair ${sizeClass} ${themeClass} ${directionClass}`}>
          {/* Icons Section */}
          <div class="cr-trading-pair__icons">
            <div class="cr-trading-pair__base-icon">
              <cryptorill-token-icon symbol={this.baseSymbol} size={this.iconSize} theme={this.theme} />
            </div>
            <div class="cr-trading-pair__quote-icon">
              <cryptorill-token-icon symbol={this.quoteSymbol} size={this.iconSize} theme={this.theme} />
            </div>
          </div>

          {/* Pair Name */}
          <div class="cr-trading-pair__name">
            <span class="cr-trading-pair__base">{this.baseSymbol}</span>
            <span class="cr-trading-pair__separator">/</span>
            <span class="cr-trading-pair__quote">{this.quoteSymbol}</span>
          </div>

          {/* Price Section */}
          <div class="cr-trading-pair__price-section">
            <cryptorill-price value={this.computedPrice} size={this.priceSize} theme={this.theme} />
            <cryptorill-price-diff value={this.computedChange24h} showLabel={false} size={this.priceSize} theme={this.theme} />
          </div>

          {/* Spread Indicator */}
          {this.showSpread && this.spread > 0 && (
            <div class="cr-trading-pair__spread">
              <span class="cr-trading-pair__spread-label">Spread</span>
              <span class="cr-trading-pair__spread-value">{this.formattedSpread}</span>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
