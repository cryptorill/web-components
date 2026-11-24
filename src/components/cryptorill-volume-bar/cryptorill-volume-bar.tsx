import { Component, Host, h, Prop } from '@stencil/core';
import { priceFormatterService } from '../../core/services/price-formatter.service';

/**
 * Cryptorill Volume Bar Component
 * Visual volume indicator with bar representation
 */

@Component({
  tag: 'cryptorill-volume-bar',
  styleUrl: 'cryptorill-volume-bar.css',
  shadow: true,
})
export class CryptorillVolumeBar {
  /**
   * Volume value to display
   */
  @Prop() volume: number = 0;

  /**
   * Maximum volume for percentage calculation
   */
  @Prop() maxVolume: number = 0;

  /**
   * Optional label to display
   */
  @Prop() label: string | undefined;

  /**
   * Currency code for formatting (default: 'USD')
   */
  @Prop() currency: string = 'USD';

  /**
   * Theme variant: 'dark' | 'light' | 'gradient'
   */
  @Prop() theme: 'dark' | 'light' | 'gradient' = 'dark';

  private get percentage(): number {
    if (this.maxVolume <= 0) return 0;
    const pct = (this.volume / this.maxVolume) * 100;
    return Math.min(Math.max(pct, 0), 100);
  }

  private get formattedVolume(): string {
    return priceFormatterService.format(this.volume, {
      currency: this.currency,
      compact: this.volume >= 1000000,
    });
  }

  private get formattedCurrency(): string {
    return this.currency.toUpperCase();
  }

  render() {
    const themeClass = `cr-volume-bar--theme-${this.theme}`;
    const hasLabel = !!this.label;

    return (
      <Host>
        <div class={`cryptorill-volume-bar ${themeClass}`}>
          {hasLabel && (
            <div class="cr-volume-bar__header">
              <span class="cr-volume-bar__label">{this.label}</span>
              <span class="cr-volume-bar__value">
                {this.formattedVolume} {this.formattedCurrency}
              </span>
            </div>
          )}
          <div class="cr-volume-bar__track">
            <div
              class="cr-volume-bar__fill"
              style={{ width: `${this.percentage}%` }}
              role="progressbar"
              aria-valuenow={this.volume}
              aria-valuemin={0}
              aria-valuemax={this.maxVolume}
              aria-label={`Volume: ${this.formattedVolume} ${this.formattedCurrency}`}
            />
          </div>
          {!hasLabel && (
            <div class="cr-volume-bar__footer">
              <span class="cr-volume-bar__value">
                {this.formattedVolume} {this.formattedCurrency}
              </span>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
