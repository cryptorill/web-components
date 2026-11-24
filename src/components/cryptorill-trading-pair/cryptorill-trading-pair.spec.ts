import { newSpecPage } from '@stencil/core/testing';
import { CryptorillTradingPair } from './cryptorill-trading-pair';

describe('cryptorill-trading-pair', () => {
  it('renders with default values', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradingPair],
      html: '<cryptorill-trading-pair></cryptorill-trading-pair>',
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.cryptorill-trading-pair')).toBeTruthy();
  });

  it('renders with base and quote symbols', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradingPair],
      html: '<cryptorill-trading-pair base-symbol="BTC" quote-symbol="USDT"></cryptorill-trading-pair>',
    });

    const baseElement = page.root?.shadowRoot?.querySelector('.cr-trading-pair__base');
    const quoteElement = page.root?.shadowRoot?.querySelector('.cr-trading-pair__quote');

    expect(baseElement?.textContent).toBe('BTC');
    expect(quoteElement?.textContent).toBe('USDT');
  });

  it('renders token icons with correct symbols', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradingPair],
      html: '<cryptorill-trading-pair base-symbol="ETH" quote-symbol="BTC"></cryptorill-trading-pair>',
    });

    const tokenIcons = page.root?.shadowRoot?.querySelectorAll('cryptorill-token-icon');
    expect(tokenIcons?.length).toBe(2);
    expect(tokenIcons?.[0]?.getAttribute('symbol')).toBe('ETH');
    expect(tokenIcons?.[1]?.getAttribute('symbol')).toBe('BTC');
  });

  it('displays price using cryptorill-price component', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradingPair],
      html: '<cryptorill-trading-pair></cryptorill-trading-pair>',
    });

    const component = page.rootInstance as CryptorillTradingPair;
    component.price = 45000.5;
    await page.waitForChanges();

    const priceComponent = page.root?.shadowRoot?.querySelector('cryptorill-price');
    expect(priceComponent).toBeTruthy();
    expect(priceComponent?.getAttribute('value')).toBe('45000.5');
  });

  it('displays price diff using cryptorill-price-diff component', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradingPair],
      html: '<cryptorill-trading-pair></cryptorill-trading-pair>',
    });

    const component = page.rootInstance as CryptorillTradingPair;
    component.change24h = 5.5;
    await page.waitForChanges();

    const priceDiffComponent = page.root?.shadowRoot?.querySelector('cryptorill-price-diff');
    expect(priceDiffComponent).toBeTruthy();
    expect(priceDiffComponent?.getAttribute('value')).toBe('5.5');
  });

  it('shows spread when showSpread is true and spread > 0', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradingPair],
      html: '<cryptorill-trading-pair spread="0.025" show-spread="true"></cryptorill-trading-pair>',
    });

    const spreadSection = page.root?.shadowRoot?.querySelector('.cr-trading-pair__spread');
    expect(spreadSection).toBeTruthy();

    const spreadValue = page.root?.shadowRoot?.querySelector('.cr-trading-pair__spread-value');
    expect(spreadValue?.textContent).toBe('0.025%');
  });

  it('hides spread when showSpread is false', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradingPair],
      html: '<cryptorill-trading-pair spread="0.025" show-spread="false"></cryptorill-trading-pair>',
    });

    const spreadSection = page.root?.shadowRoot?.querySelector('.cr-trading-pair__spread');
    expect(spreadSection).toBeFalsy();
  });

  it('hides spread when spread is 0', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradingPair],
      html: '<cryptorill-trading-pair spread="0" show-spread="true"></cryptorill-trading-pair>',
    });

    const spreadSection = page.root?.shadowRoot?.querySelector('.cr-trading-pair__spread');
    expect(spreadSection).toBeFalsy();
  });

  it('applies theme classes correctly - dark', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradingPair],
      html: '<cryptorill-trading-pair theme="dark"></cryptorill-trading-pair>',
    });

    const pairElement = page.root?.shadowRoot?.querySelector('.cryptorill-trading-pair');
    expect(pairElement?.classList.contains('cr-trading-pair--theme-dark')).toBe(true);
  });

  it('applies theme classes correctly - light', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradingPair],
      html: '<cryptorill-trading-pair theme="light"></cryptorill-trading-pair>',
    });

    const pairElement = page.root?.shadowRoot?.querySelector('.cryptorill-trading-pair');
    expect(pairElement?.classList.contains('cr-trading-pair--theme-light')).toBe(true);
  });

  it('applies theme classes correctly - gradient', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradingPair],
      html: '<cryptorill-trading-pair theme="gradient"></cryptorill-trading-pair>',
    });

    const pairElement = page.root?.shadowRoot?.querySelector('.cryptorill-trading-pair');
    expect(pairElement?.classList.contains('cr-trading-pair--theme-gradient')).toBe(true);
  });

  it('applies size classes correctly - sm', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradingPair],
      html: '<cryptorill-trading-pair size="sm"></cryptorill-trading-pair>',
    });

    const pairElement = page.root?.shadowRoot?.querySelector('.cryptorill-trading-pair');
    expect(pairElement?.classList.contains('cr-trading-pair--sm')).toBe(true);
  });

  it('applies size classes correctly - md', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradingPair],
      html: '<cryptorill-trading-pair size="md"></cryptorill-trading-pair>',
    });

    const pairElement = page.root?.shadowRoot?.querySelector('.cryptorill-trading-pair');
    expect(pairElement?.classList.contains('cr-trading-pair--md')).toBe(true);
  });

  it('applies size classes correctly - lg', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradingPair],
      html: '<cryptorill-trading-pair size="lg"></cryptorill-trading-pair>',
    });

    const pairElement = page.root?.shadowRoot?.querySelector('.cryptorill-trading-pair');
    expect(pairElement?.classList.contains('cr-trading-pair--lg')).toBe(true);
  });

  it('applies up direction class when change is positive', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradingPair],
      html: '<cryptorill-trading-pair change24h="5"></cryptorill-trading-pair>',
    });

    const pairElement = page.root?.shadowRoot?.querySelector('.cryptorill-trading-pair');
    expect(pairElement?.classList.contains('cr-trading-pair--up')).toBe(true);
  });

  it('applies down direction class when change is negative', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradingPair],
      html: '<cryptorill-trading-pair></cryptorill-trading-pair>',
    });

    const component = page.rootInstance as CryptorillTradingPair;
    component.change24h = -5;
    await page.waitForChanges();

    const pairElement = page.root?.shadowRoot?.querySelector('.cryptorill-trading-pair');
    expect(pairElement?.classList.contains('cr-trading-pair--down')).toBe(true);
  });

  it('applies up direction class when change is zero', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradingPair],
      html: '<cryptorill-trading-pair change24h="0"></cryptorill-trading-pair>',
    });

    const pairElement = page.root?.shadowRoot?.querySelector('.cryptorill-trading-pair');
    expect(pairElement?.classList.contains('cr-trading-pair--up')).toBe(true);
  });

  it('formats spread to 3 decimal places', async () => {
    const page = await newSpecPage({
      components: [CryptorillTradingPair],
      html: '<cryptorill-trading-pair spread="0.123456" show-spread="true"></cryptorill-trading-pair>',
    });

    const spreadValue = page.root?.shadowRoot?.querySelector('.cr-trading-pair__spread-value');
    expect(spreadValue?.textContent).toBe('0.123%');
  });
});
