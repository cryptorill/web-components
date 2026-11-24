import { newSpecPage } from '@stencil/core/testing';
import { CryptorillOrderRow } from './cryptorill-order-row';

describe('cryptorill-order-row', () => {
  it('renders with default values', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderRow],
      html: '<cryptorill-order-row></cryptorill-order-row>',
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.cryptorill-order-row')).toBeTruthy();
  });

  it('renders bid order correctly', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderRow],
      html: `
        <cryptorill-order-row
          type="bid"
          price="45000"
          amount="1.5"
          total="67500"
        ></cryptorill-order-row>
      `,
    });

    const rowElement = page.root?.shadowRoot?.querySelector('.cryptorill-order-row');
    expect(rowElement?.classList.contains('cr-order-row--bid')).toBe(true);

    const priceElement = page.root?.shadowRoot?.querySelector('.cr-order-row__price');
    expect(priceElement?.classList.contains('cr-order-row__price--bid')).toBe(true);
  });

  it('renders ask order correctly', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderRow],
      html: `
        <cryptorill-order-row
          type="ask"
          price="45100"
          amount="0.8"
          total="36080"
        ></cryptorill-order-row>
      `,
    });

    const rowElement = page.root?.shadowRoot?.querySelector('.cryptorill-order-row');
    expect(rowElement?.classList.contains('cr-order-row--ask')).toBe(true);

    const priceElement = page.root?.shadowRoot?.querySelector('.cr-order-row__price');
    expect(priceElement?.classList.contains('cr-order-row__price--ask')).toBe(true);
  });

  it('renders depth bar with correct width', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderRow],
      html: '<cryptorill-order-row depth-percent="50"></cryptorill-order-row>',
    });

    const depthBar = page.root?.shadowRoot?.querySelector('.cr-order-row__depth-bar') as HTMLElement;
    expect(depthBar).toBeTruthy();
    expect(depthBar?.style.width).toBe('50%');
  });

  it('limits depth percent to 100', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderRow],
      html: '<cryptorill-order-row depth-percent="150"></cryptorill-order-row>',
    });

    const depthBar = page.root?.shadowRoot?.querySelector('.cr-order-row__depth-bar') as HTMLElement;
    expect(depthBar?.style.width).toBe('100%');
  });

  it('limits depth percent to minimum 0', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderRow],
      html: '<cryptorill-order-row depth-percent="-10"></cryptorill-order-row>',
    });

    const depthBar = page.root?.shadowRoot?.querySelector('.cr-order-row__depth-bar') as HTMLElement;
    expect(depthBar?.style.width).toBe('0%');
  });

  it('displays price with currency symbol', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderRow],
      html: '<cryptorill-order-row price="45000" currency="USD"></cryptorill-order-row>',
    });

    const priceElement = page.root?.shadowRoot?.querySelector('.cr-order-row__price');
    expect(priceElement?.textContent).toContain('$');
    expect(priceElement?.textContent).toContain('45,000');
  });

  it('displays amount with crypto symbol', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderRow],
      html: '<cryptorill-order-row amount="1.5" crypto-symbol="BTC"></cryptorill-order-row>',
    });

    const amountValue = page.root?.shadowRoot?.querySelector('.cr-order-row__amount-value');
    const amountSymbol = page.root?.shadowRoot?.querySelector('.cr-order-row__amount-symbol');

    expect(amountValue?.textContent).toContain('1.5');
    expect(amountSymbol?.textContent).toBe('BTC');
  });

  it('formats large amounts with K suffix', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderRow],
      html: '<cryptorill-order-row amount="1500"></cryptorill-order-row>',
    });

    const amountValue = page.root?.shadowRoot?.querySelector('.cr-order-row__amount-value');
    expect(amountValue?.textContent).toBe('1.50K');
  });

  it('formats very large amounts with M suffix', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderRow],
      html: '<cryptorill-order-row amount="2500000"></cryptorill-order-row>',
    });

    const amountValue = page.root?.shadowRoot?.querySelector('.cr-order-row__amount-value');
    expect(amountValue?.textContent).toBe('2.50M');
  });

  it('displays total with currency symbol', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderRow],
      html: '<cryptorill-order-row total="67500" currency="USD"></cryptorill-order-row>',
    });

    const totalElement = page.root?.shadowRoot?.querySelector('.cr-order-row__total');
    expect(totalElement?.textContent).toContain('$');
  });

  it('applies theme classes correctly - dark', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderRow],
      html: '<cryptorill-order-row theme="dark"></cryptorill-order-row>',
    });

    const rowElement = page.root?.shadowRoot?.querySelector('.cryptorill-order-row');
    expect(rowElement?.classList.contains('cr-order-row--theme-dark')).toBe(true);
  });

  it('applies theme classes correctly - light', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderRow],
      html: '<cryptorill-order-row theme="light"></cryptorill-order-row>',
    });

    const rowElement = page.root?.shadowRoot?.querySelector('.cryptorill-order-row');
    expect(rowElement?.classList.contains('cr-order-row--theme-light')).toBe(true);
  });

  it('applies theme classes correctly - gradient', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderRow],
      html: '<cryptorill-order-row theme="gradient"></cryptorill-order-row>',
    });

    const rowElement = page.root?.shadowRoot?.querySelector('.cryptorill-order-row');
    expect(rowElement?.classList.contains('cr-order-row--theme-gradient')).toBe(true);
  });

  it('renders three grid cells', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderRow],
      html: '<cryptorill-order-row></cryptorill-order-row>',
    });

    const cells = page.root?.shadowRoot?.querySelectorAll('.cr-order-row__cell');
    expect(cells?.length).toBe(3);
  });

  it('uses EUR currency symbol', async () => {
    const page = await newSpecPage({
      components: [CryptorillOrderRow],
      html: '<cryptorill-order-row price="40000" currency="EUR"></cryptorill-order-row>',
    });

    const priceElement = page.root?.shadowRoot?.querySelector('.cr-order-row__price');
    expect(priceElement?.textContent).toContain('€');
  });
});
