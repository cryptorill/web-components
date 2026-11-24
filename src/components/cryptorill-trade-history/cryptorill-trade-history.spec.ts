import { newSpecPage } from '@stencil/core/testing';
import { CryptorillTradeHistory } from './cryptorill-trade-history';

describe('cryptorill-trade-history', () => {
  it('renders with default values', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradeHistory],
      html: '<cryptorill-trade-history></cryptorill-trade-history>',
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.cryptorill-trade-history')).toBeTruthy();
  });

  it('renders empty state when no trades', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradeHistory],
      html: '<cryptorill-trade-history></cryptorill-trade-history>',
    });

    const emptyElement = page.root?.shadowRoot?.querySelector('.cr-trade-history__empty');
    expect(emptyElement).toBeTruthy();
  });

  it('renders trades correctly', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradeHistory],
      html: '<cryptorill-trade-history></cryptorill-trade-history>',
    });

    const trades = [
      { price: 45000, amount: 0.5, side: 'buy' as const, time: new Date() },
      { price: 45100, amount: 0.3, side: 'sell' as const, time: new Date() },
    ];

    if (page.root) {
      (page.root as any).trades = trades;
    }
    await page.waitForChanges();

    const rows = page.root?.shadowRoot?.querySelectorAll('.cr-trade-history__row');
    expect(rows?.length).toBe(2);
  });

  it('applies buy/sell color classes', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradeHistory],
      html: '<cryptorill-trade-history></cryptorill-trade-history>',
    });

    const trades = [{ price: 45000, amount: 0.5, side: 'buy' as const, time: new Date() }];

    if (page.root) {
      (page.root as any).trades = trades;
    }
    await page.waitForChanges();

    const row = page.root?.shadowRoot?.querySelector('.cr-trade-history__row');
    expect(row?.classList.contains('cr-trade-history__row--buy')).toBe(true);
  });

  it('applies theme classes correctly', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradeHistory],
      html: '<cryptorill-trade-history theme="light"></cryptorill-trade-history>',
    });

    const historyElement = page.root?.shadowRoot?.querySelector('.cryptorill-trade-history');
    expect(historyElement?.classList.contains('cr-trade-history--theme-light')).toBe(true);
  });

  it('displays trading pair symbol', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradeHistory],
      html: '<cryptorill-trade-history pair-symbol="ETH/USDT"></cryptorill-trade-history>',
    });

    const pairElement = page.root?.shadowRoot?.querySelector('.cr-trade-history__pair');
    expect(pairElement?.textContent).toBe('ETH/USDT');
  });
});
