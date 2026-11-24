import { Component, Host, h, Prop, State, Event, EventEmitter } from '@stencil/core';

/**
 * Cryptorill Gas Estimator Component
 * Displays gas fee options with different speed levels
 */

export interface GasPrice {
  slow: number;
  standard: number;
  fast: number;
}

@Component({
  tag: 'cryptorill-gas-estimator',
  styleUrl: 'cryptorill-gas-estimator.css',
  shadow: true,
})
export class CryptorillGasEstimator {
  /**
   * Blockchain network (e.g., 'ethereum', 'polygon', 'bsc')
   */
  @Prop() network: string = 'ethereum';

  /**
   * Estimated gas limit
   */
  @Prop() gasLimit: number = 21000;

  /**
   * Gas prices for different speeds (can be GasPrice object or JSON string)
   */
  @Prop() prices: GasPrice | string = { slow: 20, standard: 30, fast: 50 };

  /**
   * Selected speed option
   */
  @Prop({ mutable: true }) selected: 'slow' | 'standard' | 'fast' = 'standard';

  /**
   * Display currency
   */
  @Prop() currency: string = 'USD';

  /**
   * Theme variant: 'dark' | 'light' | 'gradient'
   */
  @Prop() theme: 'dark' | 'light' | 'gradient' = 'dark';

  /**
   * Native token price in USD (for calculation)
   */
  @Prop() tokenPrice: number = 2000;

  /**
   * Native token symbol
   */
  @Prop() tokenSymbol: string = 'ETH';

  @State() selectedSpeed: 'slow' | 'standard' | 'fast' = this.selected;

  /**
   * Emitted when speed selection changes
   */
  @Event({ bubbles: true, composed: true }) speedChange!: EventEmitter<'slow' | 'standard' | 'fast'>;

  componentWillLoad() {
    this.selectedSpeed = this.selected;
  }

  private get parsedPrices(): GasPrice {
    if (typeof this.prices === 'string') {
      try {
        return JSON.parse(this.prices);
      } catch (e) {
        return { slow: 20, standard: 30, fast: 50 };
      }
    }
    return this.prices;
  }

  private calculateFee(gweiPrice: number): number {
    // Convert gwei to ETH: gwei * gasLimit / 10^9
    const ethFee = (gweiPrice * this.gasLimit) / 1e9;
    return ethFee * this.tokenPrice;
  }

  private formatFee(fee: number): string {
    // Show more decimal places for small values (e.g., Polygon)
    if (fee < 0.01) {
      return fee.toFixed(4);
    }
    return fee.toFixed(2);
  }

  private handleSpeedSelect(speed: 'slow' | 'standard' | 'fast'): void {
    this.selectedSpeed = speed;
    this.speedChange.emit(speed);
  }

  private getSpeedLabel(speed: 'slow' | 'standard' | 'fast'): string {
    const labels: Record<string, string> = {
      slow: 'Slow',
      standard: 'Standard',
      fast: 'Fast',
    };
    return labels[speed];
  }

  private getSpeedTime(speed: 'slow' | 'standard' | 'fast'): string {
    const times: Record<string, string> = {
      slow: '~5 min',
      standard: '~2 min',
      fast: '~30 sec',
    };
    return times[speed];
  }

  private getNetworkIcon(): string {
    const icons: Record<string, string> = {
      ethereum: '◆',
      polygon: '⬡',
      bsc: 'B',
      arbitrum: 'A',
      optimism: 'O',
      avalanche: 'A',
    };
    return icons[this.network.toLowerCase()] || '◆';
  }

  render() {
    const themeClass = `cr-gas-estimator--theme-${this.theme}`;

    return (
      <Host>
        <div class={`cryptorill-gas-estimator ${themeClass}`}>
          <div class="cr-gas-estimator__header">
            <div class="cr-gas-estimator__network">
              <span class="cr-gas-estimator__network-icon">{this.getNetworkIcon()}</span>
              <span class="cr-gas-estimator__network-name">{this.network.charAt(0).toUpperCase() + this.network.slice(1)}</span>
            </div>
            <span class="cr-gas-estimator__gas-limit">Gas Limit: {this.gasLimit.toLocaleString()}</span>
          </div>

          <div class="cr-gas-estimator__options">
            {(['slow', 'standard', 'fast'] as const).map(speed => {
              const fee = this.calculateFee(this.parsedPrices[speed]);
              const isSelected = this.selectedSpeed === speed;

              return (
                <button key={speed} class={`cr-gas-estimator__option ${isSelected ? 'cr-gas-estimator__option--selected' : ''}`} onClick={() => this.handleSpeedSelect(speed)}>
                  <div class="cr-gas-estimator__option-header">
                    <span class="cr-gas-estimator__option-label">{this.getSpeedLabel(speed)}</span>
                    <span class="cr-gas-estimator__option-time">{this.getSpeedTime(speed)}</span>
                  </div>
                  <div class="cr-gas-estimator__option-price">
                    <span class="cr-gas-estimator__fee">${this.formatFee(fee)}</span>
                    <span class="cr-gas-estimator__gwei">{this.parsedPrices[speed]} Gwei</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div class="cr-gas-estimator__total">
            <span class="cr-gas-estimator__total-label">Estimated Fee:</span>
            <span class="cr-gas-estimator__total-value">
              ${this.formatFee(this.calculateFee(this.parsedPrices[this.selectedSpeed]))} {this.currency}
            </span>
          </div>
        </div>
      </Host>
    );
  }
}
