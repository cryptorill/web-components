import { Component, Host, h, Prop, State, Watch, Fragment, forceUpdate } from '@stencil/core';
import { container } from '../../core/di/container';
import { PRICE_DATA_SOURCE_TOKEN, COIN_METADATA_SERVICE_TOKEN, LOGGER_TOKEN } from '../../core/di/tokens';
import { IPriceDataSource, CryptoPrice } from '../../core/interfaces/data-source.interface';
import { ICoinMetadataService } from '../../core/interfaces/coin-metadata.interface';
import { ILogger } from '../../core/interfaces/logger.interface';
import { initializeCoreModule, isCoreModuleInitialized } from '../../core/core.module';

/**
 * Cryptorill Price Ticker Component
 * A modern, single-asset crypto price display with 2025/2026 design aesthetics
 * Features glassmorphism, dark mode, micro-interactions, and real-time indicators
 *
 * This is a composite component that uses:
 * - <cryptorill-price> for price display
 * - <cryptorill-price-diff> for price change indicator
 * - <cryptorill-sparkline> for the trend chart
 */

@Component({
  tag: 'cryptorill-price-ticker',
  styleUrl: 'cryptorill-price-ticker.css',
  shadow: true,
})
export class CryptorillPriceTicker {
  private dataSource!: IPriceDataSource;
  private coinMetadataService!: ICoinMetadataService;
  private logger!: ILogger;
  private consumerId: string | null = null;

  /**
   * Crypto symbol to display (e.g., "BTC", "ETH", "SOL")
   */
  @Prop() symbol: string = 'BTC';

  /**
   * Full name of the cryptocurrency (e.g., "Bitcoin", "Ethereum")
   * If not provided, will use metadata service or display symbol only
   */
  @Prop() name: string = '';

  /**
   * Refresh interval in milliseconds. Default is 30000 (30 seconds).
   */
  @Prop() interval: number = 30000;

  /**
   * Theme variant: 'dark' | 'light' | 'gradient'
   */
  @Prop() theme: 'dark' | 'light' | 'gradient' = 'dark';

  /**
   * Size variant: 'small' | 'medium' | 'large'
   */
  @Prop() size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * Show sparkline chart
   */
  @Prop() showSparkline: boolean = true;

  @State() price: CryptoPrice | null = null;
  @State() loading: boolean = false;
  @State() error: string | null = null;
  @State() isLive: boolean = true;

  componentWillLoad(): void {
    // Initialize core module if not already initialized
    if (!isCoreModuleInitialized()) {
      initializeCoreModule();
    }

    // Resolve services from DI container
    this.dataSource = container.resolve(PRICE_DATA_SOURCE_TOKEN);
    this.coinMetadataService = container.resolve(COIN_METADATA_SERVICE_TOKEN);
    this.logger = container.resolve(LOGGER_TOKEN);

    this.logger.debug('CryptorillPriceTicker: Component will load', { symbol: this.symbol, interval: this.interval });

    // Use subscription mechanism for cached price updates
    this.subscribeToPriceUpdates();
  }

  disconnectedCallback(): void {
    this.logger.debug('CryptorillPriceTicker: Component disconnected, unsubscribing');
    this.unsubscribeFromPriceUpdates();
  }

  @Watch('symbol')
  handleSymbolChange(): void {
    this.unsubscribeFromPriceUpdates();
    this.subscribeToPriceUpdates();
  }

  @Watch('interval')
  handleIntervalChange(): void {
    // Re-subscribe with new interval
    this.unsubscribeFromPriceUpdates();
    this.subscribeToPriceUpdates();
  }

  private subscribeToPriceUpdates(): void {
    // Handle empty symbol case
    if (!this.symbol || this.symbol.trim() === '') {
      this.error = 'No symbol provided';
      this.loading = false;
      return;
    }

    if (this.interval <= 0) {
      return;
    }

    const symbolWithPair = this.symbol.trim().toLowerCase() + 'usdt';

    // Check if dataSource supports subscription
    if (typeof this.dataSource.subscribe === 'function') {
      // Set loading state before subscribing
      this.loading = !this.price;
      this.error = null;
      this.logger.debug('CryptorillPriceTicker: Fetching price', { symbol: symbolWithPair });
      this.consumerId = this.dataSource.subscribe(
        symbolWithPair,
        this.interval,
        price => {
          this.price = price;
          this.loading = false;
          this.error = null;
          this.logger.debug('CryptorillPriceTicker: Price updated via subscription', { price });
          // Force update to ensure re-render after async callback
          forceUpdate(this);
        },
        error => {
          // Handle error in subscription - preserve specific error messages
          this.loading = false;
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          if (errorMessage.includes('not found')) {
            this.error = 'Price not found';
          } else {
            this.error = 'Failed to fetch price';
          }
          this.logger.error('CryptorillPriceTicker: Error fetching price', error instanceof Error ? error : undefined);
          forceUpdate(this);
        },
      );
      this.logger.debug('CryptorillPriceTicker: Subscribed to price updates', { symbol: symbolWithPair, consumerId: this.consumerId });
    } else {
      // Fallback to direct fetch for non-cached data sources
      this.fetchData();
    }
  }

  private unsubscribeFromPriceUpdates(): void {
    if (this.consumerId) {
      const symbolWithPair = this.symbol.trim().toLowerCase() + 'usdt';
      if (typeof this.dataSource.unsubscribe === 'function') {
        this.dataSource.unsubscribe(symbolWithPair, this.consumerId);
      }
      this.logger.debug('CryptorillPriceTicker: stopping polling', { consumerId: this.consumerId });
      this.consumerId = null;
    }
  }

  private async fetchData(): Promise<void> {
    if (!this.symbol) {
      this.error = 'No symbol provided';
      return;
    }

    this.loading = !this.price;
    this.error = null;

    try {
      const symbolWithPair = this.symbol.trim().toLowerCase() + 'usdt';
      this.logger.debug('CryptorillPriceTicker: Fetching price', { symbol: symbolWithPair });

      const results = await this.dataSource.fetchPrices([symbolWithPair]);

      if (results.length > 0) {
        this.price = results[0];
        this.logger.debug('CryptorillPriceTicker: Price fetched', { price: this.price });
      } else {
        this.error = 'Price not found';
        this.logger.warn('CryptorillPriceTicker: Price not found', { symbol: this.symbol });
      }
    } catch (e) {
      this.error = 'Failed to fetch price';
      this.logger.error('CryptorillPriceTicker: Error fetching price', e instanceof Error ? e : undefined);
    } finally {
      this.loading = false;
    }
  }

  private getCoinIcon(): string {
    const upperSymbol = this.symbol.toUpperCase();
    const metadata = this.coinMetadataService.getMetadata(upperSymbol);
    if (metadata) {
      return metadata.icon;
    }
    return this.symbol.charAt(0).toUpperCase();
  }

  private getCoinGradient(): string {
    const upperSymbol = this.symbol.toUpperCase();
    const metadata = this.coinMetadataService.getMetadata(upperSymbol);
    if (metadata) {
      return metadata.gradient;
    }
    return 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)';
  }

  private get displayName(): string {
    if (this.name) return this.name;

    const upperSymbol = this.symbol.toUpperCase();
    return this.coinMetadataService.getDisplayName(upperSymbol);
  }

  /**
   * Computed 24h change percentage from the fetched price data
   * Falls back to 0 if dayChange is not available
   */
  private get change24h(): number {
    if (!this.price?.dayChange) return 0;
    return parseFloat(this.price.dayChange);
  }

  render() {
    const themeClass = `cr-price-ticker--theme-${this.theme}`;
    const sizeClass = `cr-price-ticker--size-${this.size}`;

    return (
      <Host>
        <div class={`cryptorill-price-ticker ${themeClass} ${sizeClass}`}>
          {/* Background glow effect */}
          <div class="cr-price-ticker__glow" style={{ background: this.getCoinGradient() }}></div>

          {/* Header with coin info */}
          <div class="cr-price-ticker__header">
            <div class="cr-price-ticker__icon" style={{ background: this.getCoinGradient() }}>
              <span>{this.getCoinIcon()}</span>
            </div>
            <div class="cr-price-ticker__info">
              <h3 class="cr-price-ticker__symbol">{this.symbol.toUpperCase()}</h3>
              <span class="cr-price-ticker__name">{this.displayName}</span>
            </div>
            <div class="cr-price-ticker__live-indicator">
              <span class={`cr-price-ticker__pulse ${this.isLive ? 'cr-price-ticker__pulse--active' : ''}`}></span>
              <span class="cr-price-ticker__live-text">LIVE</span>
            </div>
          </div>

          {/* Price display */}
          <div class="cr-price-ticker__price-section">
            {this.loading && !this.price ? (
              <div class="cr-price-ticker__skeleton">
                <div class="cr-price-ticker__skeleton-price"></div>
                <div class="cr-price-ticker__skeleton-change"></div>
              </div>
            ) : this.error ? (
              <div class="cr-price-ticker__error">
                <span class="cr-price-ticker__error-icon">⚠️</span>
                <span class="cr-price-ticker__error-text">{this.error}</span>
              </div>
            ) : this.price ? (
              <Fragment>
                <cryptorill-price value={this.price.price} currency="$" size={this.size} theme={this.theme}></cryptorill-price>
                <cryptorill-price-diff value={this.change24h} label="24h" size={this.size} theme={this.theme}></cryptorill-price-diff>
              </Fragment>
            ) : null}
          </div>

          {/* Sparkline chart */}
          {this.showSparkline && this.price && (
            <div class="cr-price-ticker__sparkline">
              <cryptorill-sparkline pair={this.symbol.toLowerCase() + 'usdt'} width={300} height={60} theme={this.theme}></cryptorill-sparkline>
            </div>
          )}

          {/* Footer with meta info */}
          <div class="cr-price-ticker__footer">
            <span class="cr-price-ticker__update-label">Real-time price</span>
            <span class="cr-price-ticker__exchange-label">via CryptoRill</span>
          </div>
        </div>
      </Host>
    );
  }
}
