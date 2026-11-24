import { Component, Host, h, Prop } from '@stencil/core';
import { Transaction } from '../cryptorill-transaction-item/cryptorill-transaction-item';

/**
 * Cryptorill Transaction List Component
 * Displays a list of transactions with optional filtering and status indicators
 */

@Component({
  tag: 'cryptorill-transaction-list',
  styleUrl: 'cryptorill-transaction-list.css',
  shadow: true,
})
export class CryptorillTransactionList {
  /**
   * Array of transactions to display (can be Transaction[] or JSON string)
   */
  @Prop() transactions: Transaction[] | string = [];

  /**
   * Maximum number of items to display
   */
  @Prop() maxItems: number = 10;

  /**
   * Show transaction type icon
   */
  @Prop() showIcon: boolean = true;

  /**
   * Theme variant: 'dark' | 'light' | 'gradient'
   */
  @Prop() theme: 'dark' | 'light' | 'gradient' = 'dark';

  /**
   * Title for the list
   */
  @Prop() listTitle: string = 'Recent Transactions';

  /**
   * Empty state message
   */
  @Prop() emptyMessage: string = 'No transactions found';

  private get parsedTransactions(): Transaction[] {
    if (typeof this.transactions === 'string') {
      try {
        return JSON.parse(this.transactions);
      } catch (e) {
        return [];
      }
    }
    return (this.transactions as Transaction[]) || [];
  }

  private get displayedTransactions(): Transaction[] {
    return this.parsedTransactions.slice(0, this.maxItems);
  }

  private formatTimestamp(timestamp: Date | string): Date {
    return timestamp instanceof Date ? timestamp : new Date(timestamp);
  }

  render() {
    const themeClass = `cr-transaction-list--theme-${this.theme}`;
    const transactions = this.parsedTransactions;
    const hasTransactions = transactions.length > 0;

    return (
      <Host>
        <div class={`cryptorill-transaction-list ${themeClass}`}>
          <div class="cr-transaction-list__header">
            <h3 class="cr-transaction-list__title">{this.listTitle}</h3>
            {hasTransactions && <span class="cr-transaction-list__count">{transactions.length} total</span>}
          </div>

          <div class="cr-transaction-list__content">
            {!hasTransactions ? (
              <div class="cr-transaction-list__empty">
                <span class="cr-transaction-list__empty-icon">📋</span>
                <span class="cr-transaction-list__empty-text">{this.emptyMessage}</span>
              </div>
            ) : (
              <div class="cr-transaction-list__items">
                {this.displayedTransactions.map(transaction => (
                  <cryptorill-transaction-item
                    type={transaction.type}
                    symbol={transaction.symbol}
                    amount={transaction.amount}
                    status={transaction.status}
                    timestamp={this.formatTimestamp(transaction.timestamp)}
                    counterparty={transaction.to || transaction.from || ''}
                    fee={transaction.fee}
                    theme={this.theme}
                  ></cryptorill-transaction-item>
                ))}
              </div>
            )}
          </div>

          {transactions.length > this.maxItems && (
            <div class="cr-transaction-list__footer">
              <button class="cr-transaction-list__view-all">View all {transactions.length} transactions →</button>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
