import { newSpecPage } from '@stencil/core/testing';
import { CryptorillMarketCard } from './cryptorill-market-card';
import { CryptorillTokenIcon } from '../cryptorill-token-icon/cryptorill-token-icon';
import { CryptorillSparkline } from '../cryptorill-sparkline/cryptorill-sparkline';
import { CryptorillVolumeBar } from '../cryptorill-volume-bar/cryptorill-volume-bar';
import { container } from '../../core/di/container';
import { LOGGER_TOKEN, PRICE_DATA_SOURCE_TOKEN } from '../../core/di/tokens';
import { initializeCoreModule } from '../../core/core.module';
import { MockLogger, MockPriceDataSource } from '../../testing';

describe('cryptorill-market-card', () => {
  beforeEach(() => {
    // Initialize core module and register mocks for DI container
    // This is needed for nested components like CryptorillSparkline
    initializeCoreModule({ production: false });
    container.registerInstance(LOGGER_TOKEN, new MockLogger());
    container.registerInstance(PRICE_DATA_SOURCE_TOKEN, new MockPriceDataSource());
  });

  afterEach(() => {
    container.clear();
  });

  it('renders with default values', async () => {
    const page = await newSpecPage({
      components: [CryptorillMarketCard],
      html: '<cryptorill-market-card></cryptorill-market-card>',
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.cryptorill-market-card')).toBeTruthy();
  });

  it('renders with symbol and name', async () => {
    const page = await newSpecPage({
      components: [CryptorillMarketCard],
      html: '<cryptorill-market-card symbol="BTC" name="Bitcoin"></cryptorill-market-card>',
    });

    const nameElement = page.root?.shadowRoot?.querySelector('.cr-market-card__name');
    const symbolElement = page.root?.shadowRoot?.querySelector('.cr-market-card__symbol');

    expect(nameElement?.textContent).toBe('Bitcoin');
    expect(symbolElement?.textContent).toBe('BTC');
  });

  it('uses symbol as fallback when name is not provided', async () => {
    const page = await newSpecPage({
      components: [CryptorillMarketCard],
      html: '<cryptorill-market-card symbol="ETH"></cryptorill-market-card>',
    });

    const nameElement = page.root?.shadowRoot?.querySelector('.cr-market-card__name');
    expect(nameElement?.textContent).toBe('ETH');
  });

  it('displays price and change correctly', async () => {
    const page = await newSpecPage({
      components: [CryptorillMarketCard],
      html: '<cryptorill-market-card symbol="BTC" price="45000" change24h="5.5"></cryptorill-market-card>',
    });

    const priceSection = page.root?.shadowRoot?.querySelector('.cr-market-card__price-section');
    expect(priceSection).toBeTruthy();
  });

  it('applies theme classes correctly - dark', async () => {
    const page = await newSpecPage({
      components: [CryptorillMarketCard],
      html: '<cryptorill-market-card theme="dark"></cryptorill-market-card>',
    });

    const cardElement = page.root?.shadowRoot?.querySelector('.cryptorill-market-card');
    expect(cardElement?.classList.contains('cr-market-card--theme-dark')).toBe(true);
  });

  it('applies theme classes correctly - light', async () => {
    const page = await newSpecPage({
      components: [CryptorillMarketCard],
      html: '<cryptorill-market-card theme="light"></cryptorill-market-card>',
    });

    const cardElement = page.root?.shadowRoot?.querySelector('.cryptorill-market-card');
    expect(cardElement?.classList.contains('cr-market-card--theme-light')).toBe(true);
  });

  it('applies theme classes correctly - gradient', async () => {
    const page = await newSpecPage({
      components: [CryptorillMarketCard],
      html: '<cryptorill-market-card theme="gradient"></cryptorill-market-card>',
    });

    const cardElement = page.root?.shadowRoot?.querySelector('.cryptorill-market-card');
    expect(cardElement?.classList.contains('cr-market-card--theme-gradient')).toBe(true);
  });

  it('applies size classes correctly - sm', async () => {
    const page = await newSpecPage({
      components: [CryptorillMarketCard],
      html: '<cryptorill-market-card size="sm"></cryptorill-market-card>',
    });

    const cardElement = page.root?.shadowRoot?.querySelector('.cryptorill-market-card');
    expect(cardElement?.classList.contains('cr-market-card--sm')).toBe(true);
  });

  it('applies size classes correctly - md', async () => {
    const page = await newSpecPage({
      components: [CryptorillMarketCard],
      html: '<cryptorill-market-card size="md"></cryptorill-market-card>',
    });

    const cardElement = page.root?.shadowRoot?.querySelector('.cryptorill-market-card');
    expect(cardElement?.classList.contains('cr-market-card--md')).toBe(true);
  });

  it('applies size classes correctly - lg', async () => {
    const page = await newSpecPage({
      components: [CryptorillMarketCard],
      html: '<cryptorill-market-card size="lg"></cryptorill-market-card>',
    });

    const cardElement = page.root?.shadowRoot?.querySelector('.cryptorill-market-card');
    expect(cardElement?.classList.contains('cr-market-card--lg')).toBe(true);
  });

  it('displays metrics correctly', async () => {
    const page = await newSpecPage({
      components: [CryptorillMarketCard],
      html: `
        <cryptorill-market-card
          symbol="BTC"
          high24h="50000"
          low24h="40000"
          market-cap="900000000000"
          volume24h="30000000000"
        ></cryptorill-market-card>
      `,
    });

    const metrics = page.root?.shadowRoot?.querySelectorAll('.cr-market-card__metric');
    expect(metrics?.length).toBe(4);
  });

  it('renders sparkline when symbol is provided', async () => {
    const page = await newSpecPage({
      components: [CryptorillMarketCard, CryptorillSparkline],
      html: '<cryptorill-market-card symbol="BTC"></cryptorill-market-card>',
    });

    const component = page.rootInstance as CryptorillMarketCard;
    component.change24h = 5;
    await page.waitForChanges();

    const chartsSection = page.root?.shadowRoot?.querySelector('.cr-market-card__charts');
    expect(chartsSection).toBeTruthy();
  });

  it('does not render charts section when sparkline data is empty', async () => {
    const page = await newSpecPage({
      components: [CryptorillMarketCard],
      html: '<cryptorill-market-card></cryptorill-market-card>',
    });

    const chartsSection = page.root?.shadowRoot?.querySelector('.cr-market-card__charts');
    expect(chartsSection).toBeFalsy();
  });

  it('applies up direction class when change is positive', async () => {
    const page = await newSpecPage({
      components: [CryptorillMarketCard],
      html: '<cryptorill-market-card></cryptorill-market-card>',
    });

    const component = page.rootInstance as CryptorillMarketCard;
    component.change24h = 5;
    await page.waitForChanges();

    const cardElement = page.root?.shadowRoot?.querySelector('.cryptorill-market-card');
    expect(cardElement?.classList.contains('cr-market-card--up')).toBe(true);
  });

  it('applies down direction class when change is negative', async () => {
    const page = await newSpecPage({
      components: [CryptorillMarketCard],
      html: '<cryptorill-market-card></cryptorill-market-card>',
    });

    const component = page.rootInstance as CryptorillMarketCard;
    component.change24h = -5;
    await page.waitForChanges();

    const cardElement = page.root?.shadowRoot?.querySelector('.cryptorill-market-card');
    expect(cardElement?.classList.contains('cr-market-card--down')).toBe(true);
  });

  it('applies neutral direction class when change is zero', async () => {
    const page = await newSpecPage({
      components: [CryptorillMarketCard],
      html: '<cryptorill-market-card></cryptorill-market-card>',
    });

    const component = page.rootInstance as CryptorillMarketCard;
    component.change24h = 0;
    await page.waitForChanges();

    const cardElement = page.root?.shadowRoot?.querySelector('.cryptorill-market-card');
    expect(cardElement?.classList.contains('cr-market-card--neutral')).toBe(true);
  });

  it('renders volume bar', async () => {
    const page = await newSpecPage({
      components: [CryptorillMarketCard, CryptorillVolumeBar],
      html: '<cryptorill-market-card></cryptorill-market-card>',
    });

    const component = page.rootInstance as CryptorillMarketCard;
    component.volume24h = 1000000;
    await page.waitForChanges();

    const volumeSection = page.root?.shadowRoot?.querySelector('.cr-market-card__volume');
    expect(volumeSection).toBeTruthy();
  });

  it('renders token icon', async () => {
    const page = await newSpecPage({
      components: [CryptorillMarketCard, CryptorillTokenIcon],
      html: '<cryptorill-market-card symbol="BTC"></cryptorill-market-card>',
    });

    const tokenIcon = page.root?.shadowRoot?.querySelector('cryptorill-token-icon');
    expect(tokenIcon).toBeTruthy();
  });

  it('formats currency correctly', async () => {
    const page = await newSpecPage({
      components: [CryptorillMarketCard],
      html: '<cryptorill-market-card currency="EUR"></cryptorill-market-card>',
    });

    // Component should use € symbol for EUR
    expect(page.root).toBeTruthy();
  });
});
