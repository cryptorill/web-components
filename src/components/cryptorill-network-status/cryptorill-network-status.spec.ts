import { newSpecPage } from '@stencil/core/testing';
import { CryptorillNetworkStatus } from './cryptorill-network-status';

describe('cryptorill-network-status', () => {
  it('renders with default values', async () => {
    const page = await newSpecPage({
      components: [CryptorillNetworkStatus],
      html: '<cryptorill-network-status></cryptorill-network-status>',
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.cryptorill-network-status')).toBeTruthy();
  });

  it('renders with network name', async () => {
    const page = await newSpecPage({
      components: [CryptorillNetworkStatus],
      html: '<cryptorill-network-status network="Polygon"></cryptorill-network-status>',
    });

    const networkName = page.root?.shadowRoot?.querySelector('.cr-network-status__network-name');
    expect(networkName?.textContent).toBe('Polygon');
  });

  it('displays correct status indicator', async () => {
    const page = await newSpecPage({
      components: [CryptorillNetworkStatus],
      html: '<cryptorill-network-status status="offline"></cryptorill-network-status>',
    });

    const indicator = page.root?.shadowRoot?.querySelector('.cr-network-status__indicator');
    expect(indicator?.classList.contains('cr-network-status__indicator--offline')).toBe(true);

    const statusLabel = page.root?.shadowRoot?.querySelector('.cr-network-status__indicator-label');
    expect(statusLabel?.textContent).toBe('Offline');
  });

  it('displays block height when provided', async () => {
    const page = await newSpecPage({
      components: [CryptorillNetworkStatus],
      html: '<cryptorill-network-status block-height="12345678"></cryptorill-network-status>',
    });

    const metrics = page.root?.shadowRoot?.querySelectorAll('.cr-network-status__metric-value');
    expect(metrics?.[0]?.textContent).toContain('12,345,678');
  });

  it('applies theme classes correctly', async () => {
    const page = await newSpecPage({
      components: [CryptorillNetworkStatus],
      html: '<cryptorill-network-status theme="light"></cryptorill-network-status>',
    });

    const statusElement = page.root?.shadowRoot?.querySelector('.cryptorill-network-status');
    expect(statusElement?.classList.contains('cr-network-status--theme-light')).toBe(true);
  });

  it('hides details when showDetails is false', async () => {
    const page = await newSpecPage({
      components: [CryptorillNetworkStatus],
      html: '<cryptorill-network-status show-details="false"></cryptorill-network-status>',
    });

    const metrics = page.root?.shadowRoot?.querySelector('.cr-network-status__metrics');
    expect(metrics).toBeFalsy();
  });
});
