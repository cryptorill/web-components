import { newSpecPage } from '@stencil/core/testing';
import { CryptorillTransactionList } from './cryptorill-transaction-list';

describe('cryptorill-transaction-list', () => {
  it('renders with default values', async () => {
    const page = await newSpecPage({
      components: [CryptorillTransactionList],
      html: '<cryptorill-transaction-list></cryptorill-transaction-list>',
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.cryptorill-transaction-list')).toBeTruthy();
  });

  it('renders empty state when no transactions', async () => {
    const page = await newSpecPage({
      components: [CryptorillTransactionList],
      html: '<cryptorill-transaction-list></cryptorill-transaction-list>',
    });

    const emptyElement = page.root?.shadowRoot?.querySelector('.cr-transaction-list__empty');
    expect(emptyElement).toBeTruthy();
  });

  it('renders transactions when provided', async () => {
    const transactions = [
      { id: '1', type: 'send' as const, symbol: 'ETH', amount: 1.5, status: 'confirmed' as const, timestamp: new Date(), to: '0x123' },
      { id: '2', type: 'receive' as const, symbol: 'BTC', amount: 0.5, status: 'confirmed' as const, timestamp: new Date(), from: '0x456' },
    ];

    const page = await newSpecPage({
      components: [CryptorillTransactionList],
      html: `<cryptorill-transaction-list></cryptorill-transaction-list>`,
    });

    if (page.root) {
      (page.root as any).transactions = transactions;
    }
    await page.waitForChanges();

    const itemsElement = page.root?.shadowRoot?.querySelector('.cr-transaction-list__items');
    expect(itemsElement).toBeTruthy();
  });

  it('respects maxItems limit', async () => {
    const transactions = Array(10)
      .fill(null)
      .map((_, i) => ({
        id: `${i}`,
        type: 'send' as const,
        symbol: 'ETH',
        amount: 1,
        status: 'confirmed' as const,
        timestamp: new Date(),
        to: '0x123',
      }));

    const page = await newSpecPage({
      components: [CryptorillTransactionList],
      html: '<cryptorill-transaction-list max-items="5"></cryptorill-transaction-list>',
    });

    if (page.root) {
      (page.root as any).transactions = transactions;
    }
    await page.waitForChanges();

    const transactionItems = page.root?.shadowRoot?.querySelectorAll('cryptorill-transaction-item');
    expect(transactionItems?.length).toBeLessThanOrEqual(5);
  });

  it('shows view all button when transactions exceed maxItems', async () => {
    const transactions = Array(10)
      .fill(null)
      .map((_, i) => ({
        id: `${i}`,
        type: 'send' as const,
        symbol: 'ETH',
        amount: 1,
        status: 'confirmed' as const,
        timestamp: new Date(),
        to: '0x123',
      }));

    const page = await newSpecPage({
      components: [CryptorillTransactionList],
      html: '<cryptorill-transaction-list max-items="5"></cryptorill-transaction-list>',
    });

    if (page.root) {
      (page.root as any).transactions = transactions;
    }
    await page.waitForChanges();

    const viewAllButton = page.root?.shadowRoot?.querySelector('.cr-transaction-list__view-all');
    expect(viewAllButton).toBeTruthy();
  });
});
