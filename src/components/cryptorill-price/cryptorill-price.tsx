import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import { priceFormatterService } from '../../core/services/price-formatter.service';

/**
 * Cryptorill Price Component
 * Displays a cryptocurrency price with currency symbol and flash animation on price changes
 */

@Component({
  tag: 'cryptorill-price',
  styleUrl: 'cryptorill-price.css',
  shadow: true,
})
export class CryptorillPrice {
  private previousPrice: number = 0;
  private flashTimeoutId: ReturnType<typeof setTimeout> | null = null;

  /**
   * The price value to display
   */
  @Prop({ mutable: true }) value: string | number = '0';

  /**
   * Currency symbol to display before the price (default: $)
   */
  @Prop() currency: string = '$';

  /**
   * Size variant: 'small' | 'medium' | 'large'
   */
  @Prop() size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * Theme variant: 'dark' | 'light' | 'gradient'
   */
  @Prop() theme: 'dark' | 'light' | 'gradient' = 'dark';

  @State() priceFlash: 'up' | 'down' | null = null;

  @Watch('value')
  handleValueChange(newValue: string | number, oldValue: string | number) {
    const newPriceValue = typeof newValue === 'string' ? parseFloat(newValue) : newValue;
    const oldPriceValue = typeof oldValue === 'string' ? parseFloat(oldValue) : oldValue;

    if (!isNaN(newPriceValue) && (this.previousPrice > 0 || oldPriceValue > 0)) {
      const previous = this.previousPrice > 0 ? this.previousPrice : oldPriceValue;
      if (newPriceValue > previous) {
        this.triggerFlash('up');
      } else if (newPriceValue < previous) {
        this.triggerFlash('down');
      }
    }

    this.previousPrice = isNaN(newPriceValue) ? 0 : newPriceValue;
  }

  componentWillLoad() {
    const val = typeof this.value === 'string' ? parseFloat(this.value) : this.value;
    this.previousPrice = isNaN(val) ? 0 : val;
  }

  disconnectedCallback() {
    if (this.flashTimeoutId) {
      clearTimeout(this.flashTimeoutId);
      this.flashTimeoutId = null;
    }
  }

  private triggerFlash(direction: 'up' | 'down') {
    // Clear any existing timeout to prevent multiple timers
    if (this.flashTimeoutId) {
      clearTimeout(this.flashTimeoutId);
    }

    this.priceFlash = direction;
    this.flashTimeoutId = setTimeout(() => {
      this.priceFlash = null;
      this.flashTimeoutId = null;
    }, 600);
  }

  private get formattedPrice(): string {
    const numValue = typeof this.value === 'string' ? parseFloat(this.value) : this.value;
    return priceFormatterService.format(numValue);
  }

  render() {
    const sizeClass = `cr-price--${this.size}`;
    const themeClass = `cr-price--theme-${this.theme}`;
    const flashClass = this.priceFlash ? `cr-price--flash-${this.priceFlash}` : '';

    return (
      <Host>
        <div class={`cryptorill-price ${sizeClass} ${themeClass} ${flashClass}`}>
          <span class="cr-price__currency">{this.currency}</span>
          <span class="cr-price__value">{this.formattedPrice}</span>
        </div>
      </Host>
    );
  }
}
