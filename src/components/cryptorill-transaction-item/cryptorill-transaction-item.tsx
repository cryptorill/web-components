import { Component, Host, h, Prop } from '@stencil/core';

/**
 * Cryptorill Transaction Item Component
 * Displays an individual transaction row with type, amount, status and timestamp
 */

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'stake';
  symbol: string;
  amount: number;
  to?: string;
  from?: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  fee?: number;
}

@Component({
  tag: 'cryptorill-transaction-item',
  styleUrl: 'cryptorill-transaction-item.css',
  shadow: true,
})
export class CryptorillTransactionItem {
  /**
   * Transaction type: 'send' | 'receive' | 'swap' | 'stake'
   */
  @Prop() type: 'send' | 'receive' | 'swap' | 'stake' = 'send';

  /**
   * Asset symbol (e.g., 'BTC', 'ETH')
   */
  @Prop() symbol: string = '';

  /**
   * Transaction amount
   */
  @Prop() amount: number = 0;

  /**
   * Transaction status: 'pending' | 'confirmed' | 'failed'
   */
  @Prop() status: 'pending' | 'confirmed' | 'failed' = 'pending';

  /**
   * Transaction timestamp (Date object or ISO string)
   */
  @Prop() timestamp: Date | string = new Date();

  /**
   * Counterparty address (to/from)
   */
  @Prop() counterparty: string = '';

  /**
   * Theme variant: 'dark' | 'light' | 'gradient'
   */
  @Prop() theme: 'dark' | 'light' | 'gradient' = 'dark';

  /**
   * Optional transaction fee
   */
  @Prop() fee: number | undefined;

  private get typeIcon(): string {
    const icons: Record<string, string> = {
      send: '↑',
      receive: '↓',
      swap: '⇄',
      stake: '🔒',
    };
    return icons[this.type] || '•';
  }

  private get typeLabel(): string {
    const labels: Record<string, string> = {
      send: 'Sent',
      receive: 'Received',
      swap: 'Swapped',
      stake: 'Staked',
    };
    return labels[this.type] || this.type;
  }

  private get statusIcon(): string {
    const icons: Record<string, string> = {
      pending: '⏳',
      confirmed: '✓',
      failed: '✕',
    };
    return icons[this.status] || '•';
  }

  private get formattedAmount(): string {
    const prefix = this.type === 'receive' ? '+' : this.type === 'send' ? '-' : '';
    return `${prefix}${this.amount.toLocaleString()} ${this.symbol}`;
  }

  private get parsedTimestamp(): Date {
    if (typeof this.timestamp === 'string') {
      return new Date(this.timestamp);
    }
    return this.timestamp;
  }

  private get formattedTime(): string {
    const ts = this.parsedTimestamp;
    const now = new Date();
    const diff = now.getTime() - ts.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return ts.toLocaleDateString();
  }

  private truncateAddress(address: string): string {
    if (!address || address.length < 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  render() {
    const themeClass = `cr-transaction-item--theme-${this.theme}`;
    const statusClass = `cr-transaction-item--status-${this.status}`;

    return (
      <Host>
        <div class={`cryptorill-transaction-item ${themeClass} ${statusClass}`}>
          <div class="cr-transaction-item__icon-wrapper">
            <span class={`cr-transaction-item__icon cr-transaction-item__icon--${this.type}`}>{this.typeIcon}</span>
          </div>

          <div class="cr-transaction-item__details">
            <div class="cr-transaction-item__header">
              <span class="cr-transaction-item__type">{this.typeLabel}</span>
              <span class="cr-transaction-item__time">{this.formattedTime}</span>
            </div>

            <div class="cr-transaction-item__info">
              <span class="cr-transaction-item__counterparty">{this.truncateAddress(this.counterparty)}</span>
              {this.fee !== undefined && (
                <span class="cr-transaction-item__fee">
                  Fee: {this.fee} {this.symbol}
                </span>
              )}
            </div>
          </div>

          <div class="cr-transaction-item__amount-section">
            <span class={`cr-transaction-item__amount cr-transaction-item__amount--${this.type}`}>{this.formattedAmount}</span>
            <span class={`cr-transaction-item__status cr-transaction-item__status--${this.status}`}>
              <span class="cr-transaction-item__status-icon">{this.statusIcon}</span>
              <span class="cr-transaction-item__status-text">{this.status}</span>
            </span>
          </div>
        </div>
      </Host>
    );
  }
}
