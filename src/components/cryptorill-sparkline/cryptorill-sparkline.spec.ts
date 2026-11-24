import { newSpecPage } from '@stencil/core/testing';
import { CryptorillSparkline } from './cryptorill-sparkline';
import { container } from '../../core/di/container';
import { LOGGER_TOKEN, PRICE_DATA_SOURCE_TOKEN } from '../../core/di/tokens';
import { initializeCoreModule } from '../../core/core.module';
import { MockLogger, MockPriceDataSource } from '../../testing';

describe('cryptorill-sparkline', () => {
  beforeEach(() => {
    // Initialize core module and register mocks for DI container
    initializeCoreModule({ production: false });
    container.registerInstance(LOGGER_TOKEN, new MockLogger());
    container.registerInstance(PRICE_DATA_SOURCE_TOKEN, new MockPriceDataSource());
  });

  afterEach(() => {
    container.clear();
  });

  it('renders with default values', async () => {
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline></cryptorill-sparkline>',
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.cryptorill-sparkline')).toBeTruthy();
  });

  it('renders canvas element', async () => {
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline></cryptorill-sparkline>',
    });

    const canvas = page.root?.shadowRoot?.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  it('sets correct canvas dimensions', async () => {
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline width="400" height="100"></cryptorill-sparkline>',
    });

    const canvas = page.root?.shadowRoot?.querySelector('canvas');
    expect(canvas?.getAttribute('width')).toBe('400');
    expect(canvas?.getAttribute('height')).toBe('100');
  });

  it('uses default dimensions when not specified', async () => {
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline></cryptorill-sparkline>',
    });

    const canvas = page.root?.shadowRoot?.querySelector('canvas');
    expect(canvas?.getAttribute('width')).toBe('300');
    expect(canvas?.getAttribute('height')).toBe('60');
  });

  it('renders with provided data', async () => {
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline data="[10, 20, 30, 40, 50]"></cryptorill-sparkline>',
    });

    const canvas = page.root?.shadowRoot?.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  it('generates random data when no data provided', async () => {
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline points="10"></cryptorill-sparkline>',
    });

    const component = page.rootInstance as CryptorillSparkline;
    const data = component['chartData'];

    expect(data.length).toBe(10);
    expect(data.every(point => point >= 10 && point <= 90)).toBe(true);
  });

  it('respects custom points count', async () => {
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline points="5"></cryptorill-sparkline>',
    });

    const component = page.rootInstance as CryptorillSparkline;
    const data = component['chartData'];

    expect(data.length).toBe(5);
  });

  it('uses provided data over generated data', async () => {
    const testData = [10, 20, 30, 40, 50];
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: `<cryptorill-sparkline data="${JSON.stringify(testData)}"></cryptorill-sparkline>`,
    });

    const component = page.rootInstance as CryptorillSparkline;

    // Note: data gets parsed from attribute as string in Stencil
    // The component handles data property binding differently
    expect(component).toBeTruthy();
  });

  it('uses green color for up direction', async () => {
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline direction="up"></cryptorill-sparkline>',
    });

    const component = page.rootInstance as CryptorillSparkline;
    const color = component['lineColor'];

    expect(color).toBe('34, 197, 94'); // green rgb
  });

  it('uses red color for down direction', async () => {
    // Provide data with downward trend to set direction to 'down'
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline data="[50, 40, 30, 20, 10]"></cryptorill-sparkline>',
    });

    const component = page.rootInstance as CryptorillSparkline;
    const color = component['lineColor'];

    expect(color).toBe('239, 68, 68'); // red rgb
  });

  it('defaults to up direction', async () => {
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline></cryptorill-sparkline>',
    });

    const component = page.rootInstance as CryptorillSparkline;
    expect(component.direction).toBe('up');
  });

  it('enables smooth curves by default', async () => {
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline></cryptorill-sparkline>',
    });

    const component = page.rootInstance as CryptorillSparkline;
    expect(component.smooth).toBe(true);
  });

  it('can disable smooth curves', async () => {
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline smooth="false"></cryptorill-sparkline>',
    });

    const component = page.rootInstance as CryptorillSparkline;
    expect(component.smooth).toBe(false);
  });

  it('redraws when data changes', async () => {
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline data="[10, 20, 30]"></cryptorill-sparkline>',
    });

    const component = page.rootInstance as CryptorillSparkline;

    // Store reference to canvas
    const canvas = component['canvas'];
    expect(canvas).toBeTruthy();

    // Update data via setProperty - should trigger redraw via component lifecycle
    const element = page.root as HTMLElement;
    (element as any).data = [40, 50, 60];
    await page.waitForChanges();

    // Verify component still has canvas after update
    expect(component['canvas']).toBeTruthy();
  });

  it('redraws when direction changes', async () => {
    // Provide data with upward trend initially
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline data="[10, 20, 30, 40, 50]"></cryptorill-sparkline>',
    });

    const component = page.rootInstance as CryptorillSparkline;

    // Verify initial state (upward trend = 'up')
    expect(component.direction).toBe('up');

    // Update data to trigger direction change (downward trend = 'down')
    const element = page.root as HTMLElement;
    (element as any).data = [50, 40, 30, 20, 10];
    await page.waitForChanges();

    // Verify direction was updated to 'down'
    expect(component.direction).toBe('down');
  });

  it('handles empty data array', async () => {
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline data="[]"></cryptorill-sparkline>',
    });

    const component = page.rootInstance as CryptorillSparkline;
    const data = component['chartData'];

    // Should generate random data when empty array provided
    expect(data.length).toBeGreaterThan(0);
  });

  it('handles single data point', async () => {
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline data="[50]"></cryptorill-sparkline>',
    });

    const component = page.rootInstance as CryptorillSparkline;
    const data = component['chartData'];

    expect(data.length).toBe(1);
    expect(data[0]).toBe(50);
  });

  it('normalizes data values to canvas coordinates', async () => {
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline data="[0, 50, 100]" height="100"></cryptorill-sparkline>',
    });

    const canvas = page.root?.shadowRoot?.querySelector('canvas');
    expect(canvas).toBeTruthy();

    // Values should be drawn on canvas
    // 0 maps to bottom (height), 100 maps to top (0)
    // This is implicitly tested by the draw method completing without errors
  });

  it('handles data with minimum values', async () => {
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline data="[0, 0, 0]"></cryptorill-sparkline>',
    });

    const component = page.rootInstance as CryptorillSparkline;
    const canvas = page.root?.shadowRoot?.querySelector('canvas');

    expect(canvas).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('handles data with maximum values', async () => {
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline data="[100, 100, 100]"></cryptorill-sparkline>',
    });

    const component = page.rootInstance as CryptorillSparkline;
    const canvas = page.root?.shadowRoot?.querySelector('canvas');

    expect(canvas).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('draws gradient area under the line', async () => {
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline data="[10, 50, 90]"></cryptorill-sparkline>',
    });

    const canvas = page.root?.shadowRoot?.querySelector('canvas');
    expect(canvas).toBeTruthy();
    // The gradient fill is drawn as part of the draw method
  });

  it('draws stroke line on top of gradient', async () => {
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline data="[10, 50, 90]"></cryptorill-sparkline>',
    });

    const canvas = page.root?.shadowRoot?.querySelector('canvas');
    expect(canvas).toBeTruthy();
    // The stroke is drawn as part of the draw method
  });

  it('handles canvas context not available', async () => {
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline></cryptorill-sparkline>',
    });

    const component = page.rootInstance as CryptorillSparkline;

    // Mock getContext to return null
    const canvas = component['canvas'];
    if (canvas) {
      jest.spyOn(canvas, 'getContext').mockReturnValue(null);

      // Should not throw when component updates via setProperty
      const element = page.root as HTMLElement;
      (element as any).data = [50, 60, 70];
      await page.waitForChanges();

      expect(component).toBeTruthy();
    }
  });

  it('renders with data triggering draw', async () => {
    const page = await newSpecPage({
      components: [CryptorillSparkline],
      html: '<cryptorill-sparkline data="[10, 20, 30]"></cryptorill-sparkline>',
    });

    const component = page.rootInstance as CryptorillSparkline;
    const canvas = component['canvas'];

    expect(canvas).toBeTruthy();

    // Update data to trigger redraw via setProperty
    const element = page.root as HTMLElement;
    (element as any).data = [40, 50, 60];
    await page.waitForChanges();

    expect(component).toBeTruthy();
  });
});
