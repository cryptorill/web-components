import { Component, Host, h, Prop } from '@stencil/core';

/**
 * Cryptorill Network Status Component
 * Displays blockchain network status with health indicators
 */

@Component({
  tag: 'cryptorill-network-status',
  styleUrl: 'cryptorill-network-status.css',
  shadow: true,
})
export class CryptorillNetworkStatus {
  /**
   * Network name (e.g., 'Ethereum', 'Polygon')
   */
  @Prop() network: string = 'Ethereum';

  /**
   * Network status: 'online' | 'degraded' | 'offline'
   */
  @Prop() status: 'online' | 'degraded' | 'offline' = 'online';

  /**
   * Current block height
   */
  @Prop() blockHeight: number = 0;

  /**
   * Network latency in milliseconds
   */
  @Prop() latency: number = 0;

  /**
   * Timestamp of last block
   */
  @Prop() lastBlock: Date = new Date();

  /**
   * Theme variant: 'dark' | 'light' | 'gradient'
   */
  @Prop() theme: 'dark' | 'light' | 'gradient' = 'dark';

  /**
   * Show detailed metrics
   */
  @Prop() showDetails: boolean = true;

  private get statusLabel(): string {
    const labels: Record<string, string> = {
      online: 'Operational',
      degraded: 'Degraded',
      offline: 'Offline',
    };
    return labels[this.status];
  }

  private get statusIcon(): string {
    const icons: Record<string, string> = {
      online: '●',
      degraded: '◐',
      offline: '○',
    };
    return icons[this.status];
  }

  private get networkIcon(): string {
    const icons: Record<string, string> = {
      ethereum: '◆',
      polygon: '⬡',
      bsc: 'B',
      arbitrum: 'A',
      optimism: 'O',
      avalanche: '🔺',
      solana: '◎',
    };
    return icons[this.network.toLowerCase()] || '🌐';
  }

  private formatLatency(): string {
    if (this.latency < 100) return `${this.latency}ms`;
    if (this.latency < 1000) return `${this.latency}ms`;
    return `${(this.latency / 1000).toFixed(1)}s`;
  }

  private getTimeSinceLastBlock(): string {
    const now = new Date().getTime();
    const last = this.lastBlock instanceof Date ? this.lastBlock.getTime() : new Date(this.lastBlock).getTime();
    const diff = now - last;
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  }

  render() {
    const themeClass = `cr-network-status--theme-${this.theme}`;
    const statusClass = `cr-network-status--${this.status}`;

    return (
      <Host>
        <div class={`cryptorill-network-status ${themeClass} ${statusClass}`}>
          <div class="cr-network-status__header">
            <div class="cr-network-status__network">
              <span class="cr-network-status__network-icon">{this.networkIcon}</span>
              <span class="cr-network-status__network-name">{this.network}</span>
            </div>

            <div class={`cr-network-status__indicator cr-network-status__indicator--${this.status}`}>
              <span class="cr-network-status__indicator-icon">{this.statusIcon}</span>
              <span class="cr-network-status__indicator-label">{this.statusLabel}</span>
            </div>
          </div>

          {this.showDetails && (
            <div class="cr-network-status__metrics">
              <div class="cr-network-status__metric">
                <span class="cr-network-status__metric-label">Block Height</span>
                <span class="cr-network-status__metric-value">{this.blockHeight > 0 ? this.blockHeight.toLocaleString() : '—'}</span>
              </div>

              <div class="cr-network-status__metric">
                <span class="cr-network-status__metric-label">Latency</span>
                <span class="cr-network-status__metric-value">{this.latency > 0 ? this.formatLatency() : '—'}</span>
              </div>

              <div class="cr-network-status__metric">
                <span class="cr-network-status__metric-label">Last Block</span>
                <span class="cr-network-status__metric-value">{this.getTimeSinceLastBlock()}</span>
              </div>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
