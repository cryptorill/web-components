import { newSpecPage } from '@stencil/core/testing';
import { CryptorillPriceTicker } from './cryptorill-price-ticker';
import { container } from '../../core/di/container';
import { MockPriceDataSource, MockLogger, flushPromises } from '../../testing';
import { PRICE_DATA_SOURCE_TOKEN, LOGGER_TOKEN, POLLING_SERVICE_TOKEN, COIN_METADATA_SERVICE_TOKEN } from '../../core/di/tokens';
import { PollingService } from '../../core/services/polling.service';
import { CoinMetadataService } from '../../core/services/coin-metadata.service';
import { initializeCoreModule } from '../../core/core.module';

describe('cryptorill-price-ticker', () => {
  let mockDataSource: MockPriceDataSource;
  let mockLogger: MockLogger;

  beforeEach(() => {
    // Initialize core module first to set up the container
    initializeCoreModule({ production: false });

    mockDataSource = new MockPriceDataSource();
    mockLogger = new MockLogger();

    // Enable sync mode for subscribe to match test expectations
    mockDataSource.subscribeSync = true;

    // Register mocks in DI container AFTER initialization
    container.registerInstance(PRICE_DATA_SOURCE_TOKEN, mockDataSource);
    container.registerInstance(LOGGER_TOKEN, mockLogger);
    container.registerInstance(POLLING_SERVICE_TOKEN, new PollingService({ interval: 1000, immediate: false }, mockLogger));
    container.registerInstance(COIN_METADATA_SERVICE_TOKEN, new CoinMetadataService());

    // Set default price for BTC
    mockDataSource.setPrice('btcusdt', {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: '45000.00',
    });
  });

  afterEach(() => {
    container.clear();
    mockDataSource.clear();
    mockLogger.clear();
  });

  it('renders with correct initial state', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceTicker],
      html: '<cryptorill-price-ticker symbol="BTC"></cryptorill-price-ticker>',
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.cryptorill-price-ticker')).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.cr-price-ticker__symbol')?.textContent).toBe('BTC');
  });

  it('renders with custom symbol', async () => {
    mockDataSource.setPrice('ethusdt', {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      price: '3200.50',
    });

    const page = await newSpecPage({
      components: [CryptorillPriceTicker],
      html: '<cryptorill-price-ticker symbol="ETH"></cryptorill-price-ticker>',
    });

    await flushPromises();

    expect(page.root?.shadowRoot?.querySelector('.cr-price-ticker__symbol')?.textContent).toBe('ETH');
  });

  it('displays loading state initially', async () => {
    mockDataSource.setDelay(100);
    // Disable sync mode to allow loading state to be shown
    mockDataSource.subscribeSync = false;

    const page = await newSpecPage({
      components: [CryptorillPriceTicker],
      html: '<cryptorill-price-ticker symbol="BTC"></cryptorill-price-ticker>',
    });

    // Should show skeleton while loading
    const skeleton = page.root?.shadowRoot?.querySelector('.cr-price-ticker__skeleton');
    expect(skeleton).toBeTruthy();
  });

  it('displays price after loading', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceTicker],
      html: '<cryptorill-price-ticker symbol="BTC"></cryptorill-price-ticker>',
    });

    await flushPromises();

    const priceElement = page.root?.shadowRoot?.querySelector('cryptorill-price');
    expect(priceElement).toBeTruthy();
  });

  it('updates price when data changes', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceTicker],
      html: '<cryptorill-price-ticker symbol="BTC"></cryptorill-price-ticker>',
    });

    await flushPromises();

    // Update the price
    mockDataSource.setPrice('btcusdt', {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: '46000.00',
    });

    // Trigger re-fetch
    const component = page.rootInstance as CryptorillPriceTicker;
    await component['fetchData']();
    await page.waitForChanges();

    expect(mockLogger.hasMessage('debug', 'Price fetched')).toBe(true);
  });

  it('handles error state when price fetch fails', async () => {
    mockDataSource.setShouldFail(true);

    const page = await newSpecPage({
      components: [CryptorillPriceTicker],
      html: '<cryptorill-price-ticker symbol="BTC"></cryptorill-price-ticker>',
    });

    await flushPromises();

    const errorElement = page.root?.shadowRoot?.querySelector('.cr-price-ticker__error');
    expect(errorElement).toBeTruthy();
    expect(errorElement?.textContent).toContain('Failed to fetch price');
  });

  it('handles error when price not found', async () => {
    // Clear all prices so nothing is found
    mockDataSource.clear();

    const page = await newSpecPage({
      components: [CryptorillPriceTicker],
      html: '<cryptorill-price-ticker symbol="XXX"></cryptorill-price-ticker>',
    });

    await flushPromises();

    const errorElement = page.root?.shadowRoot?.querySelector('.cr-price-ticker__error');
    expect(errorElement).toBeTruthy();
    expect(errorElement?.textContent).toContain('Price not found');
  });

  it('displays error for empty symbol', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceTicker],
      html: '<cryptorill-price-ticker symbol=""></cryptorill-price-ticker>',
    });

    await flushPromises();

    const errorElement = page.root?.shadowRoot?.querySelector('.cr-price-ticker__error');
    expect(errorElement).toBeTruthy();
    expect(errorElement?.textContent).toContain('No symbol provided');
  });

  it('applies theme classes correctly', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceTicker],
      html: '<cryptorill-price-ticker symbol="BTC" theme="light"></cryptorill-price-ticker>',
    });

    const ticker = page.root?.shadowRoot?.querySelector('.cryptorill-price-ticker');
    expect(ticker?.classList.contains('cr-price-ticker--theme-light')).toBe(true);
  });

  it('applies size classes correctly', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceTicker],
      html: '<cryptorill-price-ticker symbol="BTC" size="large"></cryptorill-price-ticker>',
    });

    const ticker = page.root?.shadowRoot?.querySelector('.cryptorill-price-ticker');
    expect(ticker?.classList.contains('cr-price-ticker--size-large')).toBe(true);
  });

  it('shows live indicator', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceTicker],
      html: '<cryptorill-price-ticker symbol="BTC"></cryptorill-price-ticker>',
    });

    const liveIndicator = page.root?.shadowRoot?.querySelector('.cr-price-ticker__live-indicator');
    expect(liveIndicator).toBeTruthy();
    expect(liveIndicator?.textContent).toContain('LIVE');
  });

  it('displays coin icon', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceTicker],
      html: '<cryptorill-price-ticker symbol="BTC"></cryptorill-price-ticker>',
    });

    await flushPromises();

    const icon = page.root?.shadowRoot?.querySelector('.cr-price-ticker__icon');
    expect(icon).toBeTruthy();
  });

  it('displays display name from metadata', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceTicker],
      html: '<cryptorill-price-ticker symbol="BTC"></cryptorill-price-ticker>',
    });

    await flushPromises();

    const nameElement = page.root?.shadowRoot?.querySelector('.cr-price-ticker__name');
    expect(nameElement?.textContent).toBe('Bitcoin');
  });

  it('displays custom name when provided', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceTicker],
      html: '<cryptorill-price-ticker symbol="BTC" name="Custom Bitcoin Name"></cryptorill-price-ticker>',
    });

    await flushPromises();

    const nameElement = page.root?.shadowRoot?.querySelector('.cr-price-ticker__name');
    expect(nameElement?.textContent).toBe('Custom Bitcoin Name');
  });

  it('shows sparkline when showSparkline is true', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceTicker],
      html: '<cryptorill-price-ticker symbol="BTC" show-sparkline="true"></cryptorill-price-ticker>',
    });

    await flushPromises();

    const sparkline = page.root?.shadowRoot?.querySelector('cryptorill-sparkline');
    expect(sparkline).toBeTruthy();
  });

  it('hides sparkline when showSparkline is false', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceTicker],
      html: '<cryptorill-price-ticker symbol="BTC" show-sparkline="false"></cryptorill-price-ticker>',
    });

    await flushPromises();

    const sparkline = page.root?.shadowRoot?.querySelector('cryptorill-sparkline');
    expect(sparkline).toBeFalsy();
  });

  it('displays price diff component', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceTicker],
      html: '<cryptorill-price-ticker symbol="BTC" change24h="5.5"></cryptorill-price-ticker>',
    });

    await flushPromises();

    const priceDiff = page.root?.shadowRoot?.querySelector('cryptorill-price-diff');
    expect(priceDiff).toBeTruthy();
  });

  it('passes correct change value to price-diff from dayChange', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceTicker],
      html: '<cryptorill-price-ticker symbol="BTC"></cryptorill-price-ticker>',
    });

    // Set the price with dayChange property
    const component = page.rootInstance as CryptorillPriceTicker;
    component.price = {
      id: 'btc',
      name: 'BTC',
      symbol: 'BTC',
      price: '50000',
      dayChange: '-3.25',
      timestamp: Date.now(),
    };
    await page.waitForChanges();

    const priceDiff = page.root?.shadowRoot?.querySelector('cryptorill-price-diff');
    expect(priceDiff?.getAttribute('value')).toBe('-3.25');
  });

  it('logs debug message on component load', async () => {
    await newSpecPage({
      components: [CryptorillPriceTicker],
      html: '<cryptorill-price-ticker symbol="BTC"></cryptorill-price-ticker>',
    });

    expect(mockLogger.hasMessage('debug', 'Component will load')).toBe(true);
  });

  it('logs debug message when fetching price', async () => {
    await newSpecPage({
      components: [CryptorillPriceTicker],
      html: '<cryptorill-price-ticker symbol="BTC"></cryptorill-price-ticker>',
    });

    await flushPromises();

    expect(mockLogger.hasMessage('debug', 'Fetching price')).toBe(true);
  });

  it('logs error message when price fetch fails', async () => {
    mockDataSource.setShouldFail(true);

    await newSpecPage({
      components: [CryptorillPriceTicker],
      html: '<cryptorill-price-ticker symbol="BTC"></cryptorill-price-ticker>',
    });

    await flushPromises();

    expect(mockLogger.hasMessage('error', 'Error fetching price')).toBe(true);
  });

  it('cleans up polling on disconnect', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceTicker],
      html: '<cryptorill-price-ticker symbol="BTC"></cryptorill-price-ticker>',
    });

    const component = page.rootInstance as CryptorillPriceTicker;

    // Trigger disconnect
    component.disconnectedCallback?.();

    expect(mockLogger.hasMessage('debug', 'stopping polling')).toBe(true);
  });
});
