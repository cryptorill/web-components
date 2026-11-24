import { newSpecPage } from '@stencil/core/testing';
import { CryptorillOrderBook } from './cryptorill-order-book';
import { CryptorillOrderRow } from '../cryptorill-order-row/cryptorill-order-row';

describe('cryptorill-order-book', () => {
  const mockBids = [
    { price: 45000, amount: 1.5, total: 67500 },
    { price: 44950, amount: 2.0, total: 89900 },
    { price: 44900, amount: 0.8, total: 35920 },
  ];

  const mockAsks = [
    { price: 45100, amount: 0.5, total: 22550 },
    { price: 45150, amount: 1.2, total: 54180 },
    { price: 45200, amount: 3.0, total: 135600 },
  ];

  it('renders with default values', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderBook],
      html: '<cryptorill-order-book></cryptorill-order-book>',
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.cryptorill-order-book')).toBeTruthy();
  });

  it('displays the title', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderBook],
      html: '<cryptorill-order-book book-title="BTC/USDT Order Book"></cryptorill-order-book>',
    });

    expect(page.root?.shadowRoot?.textContent).toContain('BTC/USDT Order Book');
  });

  it('renders bid order rows', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderBook],
      html: `<cryptorill-order-book bids='${JSON.stringify(mockBids)}'></cryptorill-order-book>`,
    });

    const bidRows = page.root?.shadowRoot?.querySelectorAll('.cr-order-book__section--bids cryptorill-order-row');
    expect(bidRows?.length).toBe(3);
  });

  it('renders ask order rows', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderBook],
      html: `<cryptorill-order-book asks='${JSON.stringify(mockAsks)}'></cryptorill-order-book>`,
    });

    const askRows = page.root?.shadowRoot?.querySelectorAll('.cr-order-book__section--asks cryptorill-order-row');
    expect(askRows?.length).toBe(3);
  });

  it('passes correct props to order rows', async () => {
    const bids = [{ price: 45000, amount: 1.5, total: 67500 }];
    const page = await newSpecPage({
      components: [CryptorillOrderBook, CryptorillOrderRow],
      html: `<cryptorill-order-book
        bids='${JSON.stringify(bids)}'
        currency="USD"
        crypto-symbol="BTC"
        theme="dark"
      ></cryptorill-order-book>`,
    });

    // Check that order row element exists
    const bidRow = page.root?.shadowRoot?.querySelector('.cr-order-book__section--bids cryptorill-order-row');
    expect(bidRow).toBeTruthy();

    // Check props passed via JSX by accessing component instance
    const bidRowInstance = bidRow as unknown as CryptorillOrderRow;
    expect(bidRowInstance.type).toBe('bid');
    expect(bidRowInstance.price).toBe(45000);
    expect(bidRowInstance.amount).toBe(1.5);
    expect(bidRowInstance.total).toBe(67500);
    expect(bidRowInstance.currency).toBe('USD');
    expect(bidRowInstance.cryptoSymbol).toBe('BTC');
    expect(bidRowInstance.theme).toBe('dark');
  });

  it('displays spread indicator when both bids and asks exist', async () => {
    const bids = [{ price: 45000, amount: 1, total: 45000 }];
    const asks = [{ price: 45100, amount: 1, total: 45100 }];
    const page = await newSpecPage({
      components: [CryptorillOrderBook],
      html: `<cryptorill-order-book
        bids='${JSON.stringify(bids)}'
        asks='${JSON.stringify(asks)}'
      ></cryptorill-order-book>`,
    });

    const spreadSection = page.root?.shadowRoot?.querySelector('.cr-order-book__spread');
    expect(spreadSection).toBeTruthy();

    const spreadValue = page.root?.shadowRoot?.querySelector('.cr-order-book__spread-value');
    expect(spreadValue?.textContent).toContain('100');
  });

  it('does not display spread when only bids exist', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderBook],
      html: `<cryptorill-order-book bids='${JSON.stringify(mockBids)}'></cryptorill-order-book>`,
    });

    const spreadSection = page.root?.shadowRoot?.querySelector('.cr-order-book__spread');
    expect(spreadSection).toBeFalsy();
  });

  it('does not display spread when only asks exist', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderBook],
      html: `<cryptorill-order-book asks='${JSON.stringify(mockAsks)}'></cryptorill-order-book>`,
    });

    const spreadSection = page.root?.shadowRoot?.querySelector('.cr-order-book__spread');
    expect(spreadSection).toBeFalsy();
  });

  it('shows empty state when no orders', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderBook],
      html: '<cryptorill-order-book></cryptorill-order-book>',
    });

    const emptyState = page.root?.shadowRoot?.querySelector('.cr-order-book__empty');
    expect(emptyState).toBeTruthy();
    expect(emptyState?.textContent).toContain('No orders available');
  });

  it('does not show empty state when orders exist', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderBook],
      html: `<cryptorill-order-book bids='${JSON.stringify(mockBids)}'></cryptorill-order-book>`,
    });

    const emptyState = page.root?.shadowRoot?.querySelector('.cr-order-book__empty');
    expect(emptyState).toBeFalsy();
  });

  it('displays grouping indicator when grouping is set', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderBook],
      html: '<cryptorill-order-book grouping="10"></cryptorill-order-book>',
    });

    const groupingIndicator = page.root?.shadowRoot?.querySelector('.cr-order-book__grouping');
    expect(groupingIndicator).toBeTruthy();
    expect(groupingIndicator?.textContent).toContain('Grouped by 10');
  });

  it('does not display grouping indicator when grouping is 0', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderBook],
      html: '<cryptorill-order-book></cryptorill-order-book>',
    });

    const groupingIndicator = page.root?.shadowRoot?.querySelector('.cr-order-book__grouping');
    expect(groupingIndicator).toBeFalsy();
  });

  it('applies theme classes correctly - dark', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderBook],
      html: '<cryptorill-order-book theme="dark"></cryptorill-order-book>',
    });

    const bookElement = page.root?.shadowRoot?.querySelector('.cryptorill-order-book');
    expect(bookElement?.classList.contains('cr-order-book--theme-dark')).toBe(true);
  });

  it('applies theme classes correctly - light', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderBook],
      html: '<cryptorill-order-book theme="light"></cryptorill-order-book>',
    });

    const bookElement = page.root?.shadowRoot?.querySelector('.cryptorill-order-book');
    expect(bookElement?.classList.contains('cr-order-book--theme-light')).toBe(true);
  });

  it('applies theme classes correctly - gradient', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderBook],
      html: '<cryptorill-order-book theme="gradient"></cryptorill-order-book>',
    });

    const bookElement = page.root?.shadowRoot?.querySelector('.cryptorill-order-book');
    expect(bookElement?.classList.contains('cr-order-book--theme-gradient')).toBe(true);
  });

  it('displays column headers', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderBook],
      html: '<cryptorill-order-book currency="USD" crypto-symbol="BTC"></cryptorill-order-book>',
    });

    const columnHeaders = page.root?.shadowRoot?.querySelector('.cr-order-book__column-headers');
    expect(columnHeaders).toBeTruthy();

    const headerCells = page.root?.shadowRoot?.querySelectorAll('.cr-order-book__header-cell');
    expect(headerCells?.length).toBe(3);
  });

  it('groups orders when grouping is enabled', async () => {
    const orders = [
      { price: 45005, amount: 1, total: 45005 },
      { price: 45008, amount: 1, total: 45008 },
      { price: 44995, amount: 1, total: 44995 },
    ];

    const page = await newSpecPage({
      components: [CryptorillOrderBook],
      html: `<cryptorill-order-book grouping="10" bids='${JSON.stringify(orders)}'></cryptorill-order-book>`,
    });

    // Should group 45005 and 45008 together (grouped to 45000)
    const bidRows = page.root?.shadowRoot?.querySelectorAll('.cr-order-book__section--bids cryptorill-order-row');
    expect(bidRows?.length).toBeLessThanOrEqual(2);
  });

  it('calculates depth percentage correctly', async () => {
    const bids = [{ price: 45000, amount: 1, total: 50000 }];
    const page = await newSpecPage({
      components: [CryptorillOrderBook, CryptorillOrderRow],
      html: `<cryptorill-order-book max-depth="100000" bids='${JSON.stringify(bids)}'></cryptorill-order-book>`,
    });

    const bidRow = page.root?.shadowRoot?.querySelector('.cr-order-book__section--bids cryptorill-order-row');
    expect(bidRow).toBeTruthy();

    // Access depthPercent property directly
    const bidRowInstance = bidRow as unknown as CryptorillOrderRow;
    expect(bidRowInstance.depthPercent).toBe(50);
  });

  it('uses calculated max depth when maxDepth is 0', async () => {
    const bids = [
      { price: 45000, amount: 1, total: 50000 },
      { price: 44900, amount: 2, total: 100000 },
    ];
    const page = await newSpecPage({
      components: [CryptorillOrderBook, CryptorillOrderRow],
      html: `<cryptorill-order-book bids='${JSON.stringify(bids)}'></cryptorill-order-book>`,
    });

    const bidRows = page.root?.shadowRoot?.querySelectorAll('.cr-order-book__section--bids cryptorill-order-row');
    expect(bidRows?.length).toBe(2);

    // First row should have 50% depth (50000 / 100000 max)
    const firstRowInstance = bidRows?.[0] as unknown as CryptorillOrderRow;
    expect(firstRowInstance.depthPercent).toBe(50);
  });
});
