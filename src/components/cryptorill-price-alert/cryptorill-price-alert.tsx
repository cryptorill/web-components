import { Component, Host, h, Prop, State, Event, EventEmitter, Watch } from '@stencil/core';

/**
 * Cryptorill Price Alert Component
 * Displays price alert configuration and status
 */

@Component({
  tag: 'cryptorill-price-alert',
  styleUrl: 'cryptorill-price-alert.css',
  shadow: true,
})
export class CryptorillPriceAlert {
  /**
   * Asset symbol (e.g., 'BTC', 'ETH')
   */
  @Prop() symbol: string = '';

  /**
   * Current market price
   */
  @Prop() currentPrice: number = 0;

  /**
   * Alert trigger target price
   */
  @Prop() targetPrice: number = 0;

  /**
   * Trigger condition: 'above' | 'below'
   */
  @Prop() condition: 'above' | 'below' = 'above';

  /**
   * Alert active state
   */
  @Prop() isActive: boolean = false;

  /**
   * Theme variant: 'dark' | 'light' | 'gradient'
   */
  @Prop() theme: 'dark' | 'light' | 'gradient' = 'dark';

  @State() internalActive: boolean = this.isActive;

  /**
   * Emitted when alert is toggled
   */
  @Event({ bubbles: true, composed: true }) toggleAlert!: EventEmitter<boolean>;

  componentWillLoad() {
    this.internalActive = this.isActive;
  }

  @Watch('isActive')
  watchActiveHandler(newValue: boolean) {
    this.internalActive = newValue;
  }

  private handleToggle(): void {
    this.internalActive = !this.internalActive;
    this.toggleAlert.emit(this.internalActive);
  }

  private get progressPercent(): number {
    if (this.targetPrice === 0) return 0;
    const progress = (this.currentPrice / this.targetPrice) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }

  private get formattedCurrentPrice(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(this.currentPrice);
  }

  private get formattedTargetPrice(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(this.targetPrice);
  }

  private get remainingPercent(): number {
    return Math.abs(((this.targetPrice - this.currentPrice) / this.currentPrice) * 100);
  }

  render() {
    const themeClass = `cr-price-alert--theme-${this.theme}`;
    const activeClass = this.internalActive ? 'cr-price-alert--active' : '';

    return (
      <Host>
        <div class={`cryptorill-price-alert ${themeClass} ${activeClass}`}>
          <div class="cr-price-alert__header">
            <div class="cr-price-alert__asset">
              <span class="cr-price-alert__symbol">{this.symbol.toUpperCase()}</span>
              <span class="cr-price-alert__current-price">{this.formattedCurrentPrice}</span>
            </div>

            <button
              class={`cr-price-alert__toggle ${this.internalActive ? 'cr-price-alert__toggle--active' : ''}`}
              onClick={() => this.handleToggle()}
              aria-label={this.internalActive ? 'Disable alert' : 'Enable alert'}
            >
              <span class="cr-price-alert__toggle-track">
                <span class="cr-price-alert__toggle-thumb"></span>
              </span>
              <span class="cr-price-alert__toggle-label">{this.internalActive ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          <div class="cr-price-alert__body">
            <div class="cr-price-alert__target">
              <span class="cr-price-alert__target-label">Alert when {this.condition}</span>
              <span class="cr-price-alert__target-price">{this.formattedTargetPrice}</span>
            </div>

            <div class="cr-price-alert__progress">
              <div class="cr-price-alert__progress-bar">
                <div class="cr-price-alert__progress-fill" style={{ width: `${this.progressPercent}%` }}></div>
              </div>
              <div class="cr-price-alert__progress-labels">
                <span class="cr-price-alert__progress-start">0%</span>
                <span class="cr-price-alert__progress-current">
                  {this.remainingPercent.toFixed(1)}% {this.condition === 'above' ? 'below' : 'above'} target
                </span>
                <span class="cr-price-alert__progress-end">100%</span>
              </div>
            </div>
          </div>

          {this.internalActive && (
            <div class="cr-price-alert__status">
              <span class="cr-price-alert__status-icon">🔔</span>
              <span class="cr-price-alert__status-text">
                Alert is active. You will be notified when price goes {this.condition} {this.formattedTargetPrice}.
              </span>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
