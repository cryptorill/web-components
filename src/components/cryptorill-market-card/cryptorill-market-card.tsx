import { Component, Host, h, Prop } from '@stencil/core';
import { priceFormatterService } from '../../core/services/price-formatter.service';
import { CryptoPrice } from '../../core/interfaces/data-source.interface';

/**
 * Cryptorill Market Card Component
 * Comprehensive market data card displaying all key metrics for a cryptocurrency
 *
 * Composite Structure:
 * - cryptorill-token-icon
 * - cryptorill-price
 * - cryptorill-price-diff
 * - cryptorill-sparkline
 * - cryptorill-volume-bar
 */

@Component({
  tag: 'cryptorill-market-card',
  styleUrl: 'cryptorill-market-card.css',
  shadow: true,
})
export class CryptorillMarketCard {
  /**
   * Trading pair symbol (e.g., "BTC", "ETH")
   */
  @Prop({ mutable: true }) symbol: string = '';

  /**
   * Full cryptocurrency name
   */
  @Prop() name: string = '';

  /**
   * Current price (numeric value)
   */
  @Prop() price: number = 0;

  /**
   * CryptoPrice object from datasource (alternative to individual props)
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
   * 24h trading volume
   */
  @Prop({ mutable: true }) volume24h: number = 0;

  /**
   * Market capitalization
   */
  @Prop() marketCap: number = 0;

  /**
   * 24h high price
   */
  @Prop() high24h: number = 0;

  /**
   * 24h low price
   */
  @Prop() low24h: number = 0;

  /**
   * Theme variant: 'dark' | 'light' | 'gradient'
   */
  @Prop() theme: 'dark' | 'light' | 'gradient' = 'dark';

  /**
   * Size variant: 'sm' | 'md' | 'lg'
   */
  @Prop() size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * Currency code for formatting (default: 'USD')
   */
  @Prop() currency: string = 'USD';

  private get displayName(): string {
    return this.name || this.symbol;
  }

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

  private get formattedVolume(): string {
    return priceFormatterService.format(this.volume24h, {
      currency: this.currency,
      compact: this.volume24h >= 1000000,
    });
  }

  private get formattedMarketCap(): string {
    return priceFormatterService.format(this.marketCap, {
      currency: this.currency,
      compact: this.marketCap >= 1000000,
    });
  }

  private get formattedHigh(): string {
    return priceFormatterService.format(this.high24h, {
      currency: this.currency,
    });
  }

  private get formattedLow(): string {
    return priceFormatterService.format(this.low24h, {
      currency: this.currency,
    });
  }

  private get direction(): 'up' | 'down' | 'neutral' {
    if (this.computedChange24h > 0) return 'up';
    if (this.computedChange24h < 0) return 'down';
    return 'neutral';
  }

  private get maxVolume(): number {
    return Math.max(this.volume24h, 1000000);
  }

  render() {
    const sizeClass = `cr-market-card--${this.size}`;
    const themeClass = `cr-market-card--theme-${this.theme}`;
    const directionClass = `cr-market-card--${this.direction}`;

    return (
      <Host>
        <div class={`cryptorill-market-card ${sizeClass} ${themeClass} ${directionClass}`}>
          {/* Header with Icon, Name, Symbol */}
          <div class="cr-market-card__header">
            <cryptorill-token-icon symbol={this.symbol} size={this.size === 'lg' ? 'lg' : this.size === 'sm' ? 'sm' : 'md'} theme={this.theme} />
            <div class="cr-market-card__title">
              <span class="cr-market-card__name">{this.displayName}</span>
              <span class="cr-market-card__symbol">{this.symbol}</span>
            </div>
          </div>

          {/* Price Section */}
          <div class="cr-market-card__price-section">
            <cryptorill-price
              value={this.computedPrice}
              currency={this.currencySymbol}
              size={this.size === 'lg' ? 'large' : this.size === 'sm' ? 'small' : 'medium'}
              theme={this.theme}
            />
            <cryptorill-price-diff
              value={this.computedChange24h}
              showLabel={true}
              size={this.size === 'lg' ? 'large' : this.size === 'sm' ? 'small' : 'medium'}
              theme={this.theme}
            />
          </div>

          {/* Charts Section */}
          {this.symbol && (
            <div class="cr-market-card__charts">
              <div class="cr-market-card__sparkline">
                <cryptorill-sparkline
                  pair={this.symbol.toLowerCase() + 'usdt'}
                  width={this.size === 'lg' ? 280 : this.size === 'sm' ? 140 : 200}
                  height={this.size === 'lg' ? 60 : this.size === 'sm' ? 30 : 45}
                  theme={this.theme}
                />
              </div>
            </div>
          )}

          {/* Metrics Grid */}
          <div class="cr-market-card__metrics">
            <div class="cr-market-card__metric">
              <span class="cr-market-card__metric-label">24h High</span>
              <span class="cr-market-card__metric-value cr-market-card__metric-value--high">
                {this.currencySymbol}
                {this.formattedHigh}
              </span>
            </div>
            <div class="cr-market-card__metric">
              <span class="cr-market-card__metric-label">24h Low</span>
              <span class="cr-market-card__metric-value cr-market-card__metric-value--low">
                {this.currencySymbol}
                {this.formattedLow}
              </span>
            </div>
            <div class="cr-market-card__metric">
              <span class="cr-market-card__metric-label">Market Cap</span>
              <span class="cr-market-card__metric-value">
                {this.currencySymbol}
                {this.formattedMarketCap}
              </span>
            </div>
            <div class="cr-market-card__metric">
              <span class="cr-market-card__metric-label">24h Volume</span>
              <span class="cr-market-card__metric-value">
                {this.currencySymbol}
                {this.formattedVolume}
              </span>
            </div>
          </div>

          {/* Volume Bar */}
          <div class="cr-market-card__volume">
            <cryptorill-volume-bar volume={this.volume24h} maxVolume={this.maxVolume} label="24h Volume" currency={this.currency} theme={this.theme} />
          </div>
        </div>
      </Host>
    );
  }
}
