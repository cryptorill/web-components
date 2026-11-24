import { Component, Host, h, Prop } from '@stencil/core';

/**
 * Cryptorill Price Diff Component
 * Displays price change percentage with visual indicators (arrow, color coding)
 */

@Component({
  tag: 'cryptorill-price-diff',
  styleUrl: 'cryptorill-price-diff.css',
  shadow: true,
})
export class CryptorillPriceDiff {
  /**
   * The percentage value (positive or negative)
   */
  @Prop() value: number = 0;

  /**
   * Label to display after the percentage (e.g., "24h")
   */
  @Prop() label: string = '24h';

  /**
   * Show the label
   */
  @Prop() showLabel: boolean = true;

  /**
   * Size variant: 'small' | 'medium' | 'large'
   */
  @Prop() size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * Theme variant: 'dark' | 'light' | 'gradient'
   */
  @Prop() theme: 'dark' | 'light' | 'gradient' = 'dark';

  private get isPositive(): boolean {
    return this.value >= 0;
  }

  private get arrowSymbol(): string {
    return this.isPositive ? '▲' : '▼';
  }

  private get formattedPercentage(): string {
    return `${Math.abs(this.value).toFixed(2)}%`;
  }

  render() {
    const sizeClass = `cr-price-diff--${this.size}`;
    const themeClass = `cr-price-diff--theme-${this.theme}`;
    const directionClass = this.isPositive ? 'cr-price-diff--positive' : 'cr-price-diff--negative';

    return (
      <Host>
        <div class={`cryptorill-price-diff ${sizeClass} ${themeClass} ${directionClass}`}>
          <span class="cr-price-diff__arrow">{this.arrowSymbol}</span>
          <span class="cr-price-diff__percentage">{this.formattedPercentage}</span>
          {this.showLabel && <span class="cr-price-diff__label">{this.label}</span>}
        </div>
      </Host>
    );
  }
}
