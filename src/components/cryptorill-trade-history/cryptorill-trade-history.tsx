import { Component, Host, h, Prop } from '@stencil/core';

/**
 * Cryptorill Trade History Component
 * Displays recent trades with price, amount, and side (buy/sell)
 */

export interface Trade {
  price: number;
  amount: number;
  side: 'buy' | 'sell';
  time: Date;
}

@Component({
  tag: 'cryptorill-trade-history',
  styleUrl: 'cryptorill-trade-history.css',
  shadow: true,
})
export class CryptorillTradeHistory {
  /**
   * Array of trades to display (can be Trade[] or JSON string)
   */
  @Prop() trades: Trade[] | string = [];

  /**
   * Maximum number of trades to show
   */
  @Prop() maxItems: number = 20;

  /**
   * Show timestamp for each trade
   */
  @Prop() showTime: boolean = true;

  /**
   * Theme variant: 'dark' | 'light' | 'gradient'
   */
  @Prop() theme: 'dark' | 'light' | 'gradient' = 'dark';

  /**
   * Trading pair symbol (e.g., 'BTC/USDT')
   */
  @Prop() pairSymbol: string = 'BTC/USDT';

  /**
   * Currency symbol for price display
   */
  @Prop() currency: string = '$';

  private get parsedTrades(): Trade[] {
    if (typeof this.trades === 'string') {
      try {
        return JSON.parse(this.trades);
      } catch (e) {
        return [];
      }
    }
    return this.trades || [];
  }

  private get displayedTrades(): Trade[] {
    return this.parsedTrades.slice(0, this.maxItems);
  }

  private formatTime(date: Date | string): string {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }

  private formatNumber(num: number, decimals: number = 2): string {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  render() {
    const themeClass = `cr-trade-history--theme-${this.theme}`;
    const hasTrades = this.parsedTrades.length > 0;

    return (
      <Host>
        <div class={`cryptorill-trade-history ${themeClass}`}>
          <div class="cr-trade-history__header">
            <h3 class="cr-trade-history__title">Recent Trades</h3>
            <span class="cr-trade-history__pair">{this.pairSymbol}</span>
          </div>

          <div class="cr-trade-history__table-header">
            <span class="cr-trade-history__col cr-trade-history__col--time">Time</span>
            <span class="cr-trade-history__col cr-trade-history__col--price">Price</span>
            <span class="cr-trade-history__col cr-trade-history__col--amount">Amount</span>
          </div>

          <div class="cr-trade-history__list">
            {!hasTrades ? (
              <div class="cr-trade-history__empty">
                <span class="cr-trade-history__empty-text">No recent trades</span>
              </div>
            ) : (
              this.displayedTrades.map((trade, index) => (
                <div key={index} class={`cr-trade-history__row cr-trade-history__row--${trade.side}`}>
                  {this.showTime && <span class="cr-trade-history__cell cr-trade-history__cell--time">{this.formatTime(trade.time)}</span>}
                  <span class="cr-trade-history__cell cr-trade-history__cell--price">
                    {this.currency}
                    {this.formatNumber(trade.price)}
                  </span>
                  <span class="cr-trade-history__cell cr-trade-history__cell--amount">{this.formatNumber(trade.amount, 4)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </Host>
    );
  }
}
