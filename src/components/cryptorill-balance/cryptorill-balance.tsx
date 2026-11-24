import { Component, Host, h, Prop } from '@stencil/core';

/**
 * Cryptorill Balance Component
 * Displays wallet balance with multiple currency formats and optional fiat equivalent
 */

@Component({
  tag: 'cryptorill-balance',
  styleUrl: 'cryptorill-balance.css',
  shadow: true,
})
export class CryptorillBalance {
  /**
   * Balance amount
   */
  @Prop() amount: number = 0;

  /**
   * Currency symbol (e.g., 'BTC', 'ETH', 'USDT')
   */
  @Prop() symbol: string = 'USD';

  /**
   * Number of decimal places to display
   */
  @Prop() decimals: number = 2;

  /**
   * Show fiat equivalent value
   */
  @Prop() showFiat: boolean = false;

  /**
   * Fiat conversion value
   */
  @Prop() fiatValue: number = 0;

  /**
   * Fiat currency code (e.g., 'USD', 'EUR')
   */
  @Prop() fiatCurrency: string = 'USD';

  /**
   * Theme variant: 'dark' | 'light' | 'gradient'
   */
  @Prop() theme: 'dark' | 'light' | 'gradient' = 'dark';

  /**
   * Size variant: 'small' | 'medium' | 'large'
   */
  @Prop() size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * Label text (e.g., 'Available Balance', 'Total Balance')
   */
  @Prop() label: string = 'Balance';

  /**
   * Show currency symbol prefix
   */
  @Prop() showSymbol: boolean = true;

  private get formattedBalance(): string {
    const formatted = this.amount.toLocaleString('en-US', {
      minimumFractionDigits: this.decimals,
      maximumFractionDigits: this.decimals,
    });
    return this.showSymbol ? `${formatted} ${this.symbol}` : formatted;
  }

  private get formattedFiat(): string {
    if (!this.showFiat) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.fiatCurrency,
    }).format(this.fiatValue);
  }

  render() {
    const themeClass = `cr-balance--theme-${this.theme}`;
    const sizeClass = `cr-balance--size-${this.size}`;

    return (
      <Host>
        <div class={`cryptorill-balance ${themeClass} ${sizeClass}`}>
          <span class="cr-balance__label">{this.label}</span>

          <div class="cr-balance__amount-wrapper">
            <span class="cr-balance__amount">{this.formattedBalance}</span>
            {this.showFiat && <span class="cr-balance__fiat">≈ {this.formattedFiat}</span>}
          </div>
        </div>
      </Host>
    );
  }
}
