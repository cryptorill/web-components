import { Component, Host, h, Prop } from '@stencil/core';

/**
 * Cryptorill Percentage Bar Component
 * Horizontal bar showing percentage allocation/dominance
 */

@Component({
  tag: 'cryptorill-percentage-bar',
  styleUrl: 'cryptorill-percentage-bar.css',
  shadow: true,
})
export class CryptorillPercentageBar {
  /**
   * Current value to display
   */
  @Prop() value: number = 0;

  /**
   * Maximum value for percentage calculation (default: 100)
   */
  @Prop() maxValue: number = 100;

  /**
   * Optional label to display
   */
  @Prop() label: string | undefined;

  /**
   * Whether to show the percentage value
   */
  @Prop() showValue: boolean = true;

  /**
   * Optional custom color (hex, rgb, or css variable)
   */
  @Prop() color: string | undefined;

  /**
   * Theme variant: 'dark' | 'light' | 'gradient'
   */
  @Prop() theme: 'dark' | 'light' | 'gradient' = 'dark';

  private get percentage(): number {
    if (this.maxValue <= 0) return 0;
    const pct = (this.value / this.maxValue) * 100;
    return Math.min(Math.max(pct, 0), 100);
  }

  private get formattedPercentage(): string {
    return `${this.percentage.toFixed(1)}%`;
  }

  private get fillStyle(): Record<string, string> {
    const style: Record<string, string> = {
      width: `${this.percentage}%`,
    };

    if (this.color) {
      style.background = this.color;
    }

    return style;
  }

  render() {
    const themeClass = `cr-percentage-bar--theme-${this.theme}`;
    const hasLabel = !!this.label;

    return (
      <Host>
        <div class={`cryptorill-percentage-bar ${themeClass}`}>
          {(hasLabel || this.showValue) && (
            <div class="cr-percentage-bar__header">
              {hasLabel && <span class="cr-percentage-bar__label">{this.label}</span>}
              {this.showValue && <span class="cr-percentage-bar__value">{this.formattedPercentage}</span>}
            </div>
          )}
          <div class="cr-percentage-bar__track">
            <div
              class="cr-percentage-bar__fill"
              style={this.fillStyle}
              role="progressbar"
              aria-valuenow={this.value}
              aria-valuemin={0}
              aria-valuemax={this.maxValue}
              aria-label={`${this.label || 'Value'}: ${this.formattedPercentage}`}
            />
          </div>
        </div>
      </Host>
    );
  }
}
