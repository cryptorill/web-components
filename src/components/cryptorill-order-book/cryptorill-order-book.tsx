import { Component, Host, h, Prop, State } from '@stencil/core';

/**
 * Order interface for order book entries
 */
export interface Order {
  price: number;
  amount: number;
  total: number;
}

/**
 * Cryptorill Order Book Component
 * Two-column layout with asks (sell orders, red) on top, bids (buy orders, green) on bottom
 *
 * Dependencies:
 * - cryptorill-order-row
 */

@Component({
  tag: 'cryptorill-order-book',
  styleUrl: 'cryptorill-order-book.css',
  shadow: true,
})
export class CryptorillOrderBook {
  private _bids: Order[] = [];
  private _asks: Order[] = [];

  /**
   * Array of bid orders (buy orders)
   */
  @Prop()
  get bids(): Order[] {
    return this._bids;
  }
  set bids(value: Order[] | string) {
    this._bids = this.parseOrders(value);
  }

  /**
   * Array of ask orders (sell orders)
   */
  @Prop()
  get asks(): Order[] {
    return this._asks;
  }
  set asks(value: Order[] | string) {
    this._asks = this.parseOrders(value);
  }

  private parseOrders(value: Order[] | string): Order[] {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return value || [];
  }

  /**
   * Maximum depth for calculating depth percentages
   */
  @Prop() maxDepth: number = 0;

  /**
   * Price grouping increment (0 = no grouping)
   */
  @Prop() grouping: number = 0;

  /**
   * Theme variant: 'dark' | 'light' | 'gradient'
   */
  @Prop() theme: 'dark' | 'light' | 'gradient' = 'dark';

  /**
   * Title of the order book
   */
  @Prop() bookTitle: string = 'Order Book';

  /**
   * Currency code for formatting
   */
  @Prop() currency: string = 'USD';

  /**
   * Cryptocurrency symbol for amount formatting
   */
  @Prop() cryptoSymbol: string = 'BTC';

  @State() private hoveredRow: number | null = null;

  private get calculatedMaxDepth(): number {
    if (this.maxDepth > 0) {
      return this.maxDepth;
    }

    const maxBid = this.bids.length > 0 ? Math.max(...this.bids.map(b => b.total)) : 0;
    const maxAsk = this.asks.length > 0 ? Math.max(...this.asks.map(a => a.total)) : 0;

    return Math.max(maxBid, maxAsk, 1);
  }

  private get groupedBids(): Order[] {
    if (this.grouping <= 0) {
      return this.bids;
    }
    return this.groupOrders(this.bids, this.grouping);
  }

  private get groupedAsks(): Order[] {
    if (this.grouping <= 0) {
      return this.asks;
    }
    return this.groupOrders(this.asks, this.grouping);
  }

  private groupOrders(orders: Order[], groupSize: number): Order[] {
    const grouped = new Map<number, Order>();

    orders.forEach(order => {
      const groupedPrice = Math.floor(order.price / groupSize) * groupSize;

      if (grouped.has(groupedPrice)) {
        const existing = grouped.get(groupedPrice)!;
        existing.amount += order.amount;
        existing.total += order.total;
      } else {
        grouped.set(groupedPrice, {
          price: groupedPrice,
          amount: order.amount,
          total: order.total,
        });
      }
    });

    return Array.from(grouped.values()).sort((a, b) => b.price - a.price);
  }

  private getDepthPercent(total: number): number {
    return (total / this.calculatedMaxDepth) * 100;
  }

  private handleRowHover(index: number | null) {
    this.hoveredRow = index;
  }

  render() {
    const themeClass = `cr-order-book--theme-${this.theme}`;

    return (
      <Host>
        <div class={`cryptorill-order-book ${themeClass}`}>
          {/* Header */}
          <div class="cr-order-book__header">
            <h3 class="cr-order-book__title">{this.bookTitle}</h3>
            {this.grouping > 0 && <span class="cr-order-book__grouping">Grouped by {this.grouping}</span>}
          </div>

          {/* Column Headers */}
          <div class="cr-order-book__column-headers">
            <span class="cr-order-book__header-cell cr-order-book__header-cell--price">Price ({this.currency})</span>
            <span class="cr-order-book__header-cell cr-order-book__header-cell--amount">Amount ({this.cryptoSymbol})</span>
            <span class="cr-order-book__header-cell cr-order-book__header-cell--total">Total</span>
          </div>

          {/* Asks (Sell Orders) - Displayed in reverse order (lowest ask at bottom) */}
          <div class="cr-order-book__section cr-order-book__section--asks">
            {[...this.groupedAsks].reverse().map((ask, index) => (
              <cryptorill-order-row
                type="ask"
                price={ask.price}
                amount={ask.amount}
                total={ask.total}
                depthPercent={this.getDepthPercent(ask.total)}
                theme={this.theme}
                currency={this.currency}
                cryptoSymbol={this.cryptoSymbol}
                class={this.hoveredRow === index ? 'cr-order-book__row--hovered' : ''}
                onMouseEnter={() => this.handleRowHover(index)}
                onMouseLeave={() => this.handleRowHover(null)}
              />
            ))}
          </div>

          {/* Spread Indicator */}
          {this.groupedAsks.length > 0 && this.groupedBids.length > 0 && (
            <div class="cr-order-book__spread">
              <span class="cr-order-book__spread-label">Spread</span>
              <span class="cr-order-book__spread-value">
                {Math.abs(this.groupedAsks[0].price - this.groupedBids[0].price).toFixed(2)} {this.currency}
              </span>
              <span class="cr-order-book__spread-percent">
                ({((Math.abs(this.groupedAsks[0].price - this.groupedBids[0].price) / this.groupedAsks[0].price) * 100).toFixed(3)}%)
              </span>
            </div>
          )}

          {/* Bids (Buy Orders) */}
          <div class="cr-order-book__section cr-order-book__section--bids">
            {this.groupedBids.map((bid, index) => (
              <cryptorill-order-row
                type="bid"
                price={bid.price}
                amount={bid.amount}
                total={bid.total}
                depthPercent={this.getDepthPercent(bid.total)}
                theme={this.theme}
                currency={this.currency}
                cryptoSymbol={this.cryptoSymbol}
                class={this.hoveredRow === index + 1000 ? 'cr-order-book__row--hovered' : ''}
                onMouseEnter={() => this.handleRowHover(index + 1000)}
                onMouseLeave={() => this.handleRowHover(null)}
              />
            ))}
          </div>

          {/* Empty State */}
          {this.groupedAsks.length === 0 && this.groupedBids.length === 0 && (
            <div class="cr-order-book__empty">
              <span class="cr-order-book__empty-text">No orders available</span>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
