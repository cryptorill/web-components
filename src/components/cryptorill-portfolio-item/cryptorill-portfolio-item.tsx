import { Component, Host, h, Prop, Fragment } from '@stencil/core';

/**
 * Cryptorill Portfolio Item Component
 * Displays a portfolio position with holdings, value, P&L and allocation
 *
 * Composite Structure:
 * - cryptorill-token-icon
 * - cryptorill-price
 * - cryptorill-price-diff
 * - cryptorill-percentage-bar (allocation)
 * - cryptorill-sparkline
 */

@Component({
  tag: 'cryptorill-portfolio-item',
  styleUrl: 'cryptorill-portfolio-item.css',
  shadow: true,
})
export class CryptorillPortfolioItem {
  /**
   * Asset symbol (e.g., 'BTC', 'ETH')
   */
  @Prop() symbol: string = '';

  /**
   * Asset name (e.g., 'Bitcoin', 'Ethereum')
   */
  @Prop() name: string = '';

  /**
   * Holdings amount
   */
  @Prop() balance: number = 0;

  /**
   * Current price per unit
   */
  @Prop() price: number = 0;

  /**
   * Average buy price
   */
  @Prop() avgBuyPrice: number = 0;

  /**
   * Portfolio allocation percentage
   */
  @Prop() allocation: number = 0;

  /**
   * Total value (calculated if not provided)
   */
  @Prop() value: number | undefined;

  /**
   * Profit/loss percentage
   */
  @Prop() pnl: number = 0;

  /**
   * Theme variant: 'dark' | 'light' | 'gradient'
   */
  @Prop() theme: 'dark' | 'light' | 'gradient' = 'dark';

  /**
   * Size variant: 'compact' | 'full'
   */
  @Prop() size: 'compact' | 'full' = 'full';

  /**
   * Show mini chart
   */
  @Prop() showChart: boolean = true;

  /**
   * Chart data points
   */
  @Prop() chartData: number[] = [];

  private get totalValue(): number {
    return this.value !== undefined ? this.value : this.balance * this.price;
  }

  private get displayName(): string {
    return this.name || this.symbol;
  }

  render() {
    const themeClass = `cr-portfolio-item--theme-${this.theme}`;
    const sizeClass = `cr-portfolio-item--size-${this.size}`;

    return (
      <Host>
        <div class={`cryptorill-portfolio-item ${themeClass} ${sizeClass}`}>
          {/* Header with icon and basic info */}
          <div class="cr-portfolio-item__header">
            <cryptorill-token-icon symbol={this.symbol} size="md" theme={this.theme}></cryptorill-token-icon>

            <div class="cr-portfolio-item__info">
              <span class="cr-portfolio-item__symbol">{this.symbol.toUpperCase()}</span>
              <span class="cr-portfolio-item__name">{this.displayName}</span>
            </div>

            <div class="cr-portfolio-item__value-section">
              <span class="cr-portfolio-item__value">{this.totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
              <cryptorill-price-diff value={this.pnl} size="small" theme={this.theme}></cryptorill-price-diff>
            </div>
          </div>

          {/* Details section */}
          <div class="cr-portfolio-item__details">
            <div class="cr-portfolio-item__detail-row">
              <span class="cr-portfolio-item__label">Balance</span>
              <span class="cr-portfolio-item__balance">
                {this.balance.toLocaleString()} {this.symbol}
              </span>
            </div>

            <div class="cr-portfolio-item__detail-row">
              <span class="cr-portfolio-item__label">Price</span>
              <cryptorill-price value={this.price} currency="$" size="small" theme={this.theme}></cryptorill-price>
            </div>

            {this.size === 'full' && (
              <Fragment>
                <div class="cr-portfolio-item__detail-row">
                  <span class="cr-portfolio-item__label">Avg Buy</span>
                  <span class="cr-portfolio-item__avg-price">${this.avgBuyPrice.toLocaleString()}</span>
                </div>

                <div class="cr-portfolio-item__allocation">
                  <span class="cr-portfolio-item__label">Allocation</span>
                  <cryptorill-percentage-bar value={this.allocation} label={`${this.allocation.toFixed(1)}%`} show-value="true" theme={this.theme}></cryptorill-percentage-bar>
                </div>
              </Fragment>
            )}
          </div>

          {/* Sparkline chart */}
          {this.size === 'full' && this.showChart && (
            <div class="cr-portfolio-item__chart">
              <cryptorill-sparkline
                data={this.chartData.length > 0 ? this.chartData : [this.price * 0.9, this.price * 0.95, this.price, this.price * 1.02, this.price * 1.05]}
                width={200}
                height={40}
                theme={this.theme}
              ></cryptorill-sparkline>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
