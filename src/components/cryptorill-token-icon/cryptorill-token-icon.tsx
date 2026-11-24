import { Component, Host, h, Prop, State } from '@stencil/core';

/**
 * Cryptorill Token Icon Component
 * Displays a cryptocurrency icon with fallback to generated initials
 */

@Component({
  tag: 'cryptorill-token-icon',
  styleUrl: 'cryptorill-token-icon.css',
  shadow: true,
})
export class CryptorillTokenIcon {
  /**
   * Cryptocurrency symbol (e.g., 'BTC', 'ETH')
   */
  @Prop() symbol: string = '';

  /**
   * Size variant: 'sm' | 'md' | 'lg'
   */
  @Prop() size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * Optional source URL for the icon image
   */
  @Prop() src: string | undefined;

  /**
   * Optional custom fallback text (defaults to first 2 characters of symbol)
   */
  @Prop() fallback: string | undefined;

  /**
   * Theme variant: 'dark' | 'light' | 'gradient'
   */
  @Prop() theme: 'dark' | 'light' | 'gradient' = 'dark';

  @State() imageError: boolean = false;

  private get displayFallback(): string {
    if (this.fallback) {
      return this.fallback.toUpperCase();
    }
    return this.symbol.slice(0, 2).toUpperCase();
  }

  private get initials(): string {
    return this.displayFallback;
  }

  private get backgroundColor(): string {
    // Generate a consistent color based on the symbol
    const colors = [
      '#f7931a', // Bitcoin orange
      '#627eea', // Ethereum blue
      '#26a17b', // Tether green
      '#345d9d', // BNB blue
      '#2775ca', // USDC blue
      '#23292f', // XRP black
      '#0033ad', // Cardano blue
      '#8247e5', // Polygon purple
      '#ff007a', // Uniswap pink
      '#2ab677', // Solana green
      '#15bdff', // Avalanche blue
      '#e84142', // Avalanche red
    ];

    if (!this.symbol) {
      return '#64748b';
    }

    let hash = 0;
    for (let i = 0; i < this.symbol.length; i++) {
      hash = this.symbol.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  }

  private handleImageError = (): void => {
    this.imageError = true;
  };

  render() {
    const sizeClass = `cr-token-icon--${this.size}`;
    const themeClass = `cr-token-icon--theme-${this.theme}`;
    const hasImage = this.src && !this.imageError;

    return (
      <Host>
        <div
          class={`cryptorill-token-icon ${sizeClass} ${themeClass}`}
          style={!hasImage ? { backgroundColor: this.backgroundColor } : undefined}
          role="img"
          aria-label={`${this.symbol} icon`}
        >
          {hasImage ? (
            <img class="cr-token-icon__image" src={this.src} alt={this.symbol} onError={this.handleImageError} />
          ) : (
            <span class="cr-token-icon__initials">{this.initials}</span>
          )}
        </div>
      </Host>
    );
  }
}
