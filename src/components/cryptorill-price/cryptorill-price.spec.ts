import { newSpecPage } from '@stencil/core/testing';
import { CryptorillPrice } from './cryptorill-price';

describe('cryptorill-price', () => {
  it('renders with default values', async () => {
    const page = await newSpecPage({
      components: [CryptorillPrice],
      html: '<cryptorill-price></cryptorill-price>',
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.cryptorill-price')).toBeTruthy();
  });

  it('renders price value correctly', async () => {
    const page = await newSpecPage({
      components: [CryptorillPrice],
      html: '<cryptorill-price value="45000.00"></cryptorill-price>',
    });

    expect(page.root?.shadowRoot?.textContent).toContain('$');
    expect(page.root?.shadowRoot?.textContent).toContain('45,000.00');
  });

  it('renders with default currency symbol', async () => {
    const page = await newSpecPage({
      components: [CryptorillPrice],
      html: '<cryptorill-price value="100"></cryptorill-price>',
    });

    const currencyElement = page.root?.shadowRoot?.querySelector('.cr-price__currency');
    expect(currencyElement?.textContent).toBe('$');
  });

  it('renders with custom currency symbol', async () => {
    const page = await newSpecPage({
      components: [CryptorillPrice],
      html: '<cryptorill-price value="100" currency="€"></cryptorill-price>',
    });

    const currencyElement = page.root?.shadowRoot?.querySelector('.cr-price__currency');
    expect(currencyElement?.textContent).toBe('€');
  });

  it('applies size classes correctly - small', async () => {
    const page = await newSpecPage({
      components: [CryptorillPrice],
      html: '<cryptorill-price value="100" size="small"></cryptorill-price>',
    });

    const priceElement = page.root?.shadowRoot?.querySelector('.cryptorill-price');
    expect(priceElement?.classList.contains('cr-price--small')).toBe(true);
  });

  it('applies size classes correctly - medium', async () => {
    const page = await newSpecPage({
      components: [CryptorillPrice],
      html: '<cryptorill-price value="100" size="medium"></cryptorill-price>',
    });

    const priceElement = page.root?.shadowRoot?.querySelector('.cryptorill-price');
    expect(priceElement?.classList.contains('cr-price--medium')).toBe(true);
  });

  it('applies size classes correctly - large', async () => {
    const page = await newSpecPage({
      components: [CryptorillPrice],
      html: '<cryptorill-price value="100" size="large"></cryptorill-price>',
    });

    const priceElement = page.root?.shadowRoot?.querySelector('.cryptorill-price');
    expect(priceElement?.classList.contains('cr-price--large')).toBe(true);
  });

  it('formats large prices correctly', async () => {
    const page = await newSpecPage({
      components: [CryptorillPrice],
      html: '<cryptorill-price value="1234567.89"></cryptorill-price>',
    });

    const valueElement = page.root?.shadowRoot?.querySelector('.cr-price__value');
    expect(valueElement?.textContent).toContain('1,234,567.89');
  });

  it('formats small prices with more decimal places', async () => {
    const page = await newSpecPage({
      components: [CryptorillPrice],
      html: '<cryptorill-price value="0.001234"></cryptorill-price>',
    });

    const valueElement = page.root?.shadowRoot?.querySelector('.cr-price__value');
    expect(valueElement?.textContent).toContain('0.001234');
  });

  it('formats very small prices with 8 decimal places', async () => {
    const page = await newSpecPage({
      components: [CryptorillPrice],
      html: '<cryptorill-price value="0.00001234"></cryptorill-price>',
    });

    const valueElement = page.root?.shadowRoot?.querySelector('.cr-price__value');
    expect(valueElement?.textContent).toBeTruthy();
    expect(valueElement?.textContent).toContain('0.00001234');
  });

  it('handles string price values', async () => {
    const page = await newSpecPage({
      components: [CryptorillPrice],
      html: '<cryptorill-price value="50000.50"></cryptorill-price>',
    });

    const valueElement = page.root?.shadowRoot?.querySelector('.cr-price__value');
    expect(valueElement?.textContent).toContain('50,000.50');
  });

  it('handles zero price', async () => {
    const page = await newSpecPage({
      components: [CryptorillPrice],
      html: '<cryptorill-price value="0"></cryptorill-price>',
    });

    const valueElement = page.root?.shadowRoot?.querySelector('.cr-price__value');
    expect(valueElement?.textContent).toContain('0.00');
  });

  it('handles negative prices', async () => {
    const page = await newSpecPage({
      components: [CryptorillPrice],
      html: '<cryptorill-price value="-100.50"></cryptorill-price>',
    });

    const valueElement = page.root?.shadowRoot?.querySelector('.cr-price__value');
    // The formatter adds currency symbol, so we check for the negative sign and value
    expect(valueElement?.textContent).toContain('-');
    expect(valueElement?.textContent).toContain('100.50');
  });

  it('triggers flash animation on price increase', async () => {
    const page = await newSpecPage({
      components: [CryptorillPrice],
      html: '<cryptorill-price value="100"></cryptorill-price>',
    });

    // Use component instance to update the value
    const component = page.rootInstance as CryptorillPrice;
    component.value = '150';
    await page.waitForChanges();

    const priceElement = page.root?.shadowRoot?.querySelector('.cryptorill-price');
    expect(priceElement?.classList.contains('cr-price--flash-up')).toBe(true);
  });

  it('triggers flash animation on price decrease', async () => {
    const page = await newSpecPage({
      components: [CryptorillPrice],
      html: '<cryptorill-price value="100"></cryptorill-price>',
    });

    // Use component instance to update the value
    const component = page.rootInstance as CryptorillPrice;
    component.value = '50';
    await page.waitForChanges();

    const priceElement = page.root?.shadowRoot?.querySelector('.cryptorill-price');
    expect(priceElement?.classList.contains('cr-price--flash-down')).toBe(true);
  });

  it('clears flash animation after timeout', async () => {
    const page = await newSpecPage({
      components: [CryptorillPrice],
      html: '<cryptorill-price value="100"></cryptorill-price>',
    });

    // Use component instance to update the value
    const component = page.rootInstance as CryptorillPrice;
    component.value = '150';
    await page.waitForChanges();

    const priceElement = page.root?.shadowRoot?.querySelector('.cryptorill-price');
    expect(priceElement?.classList.contains('cr-price--flash-up')).toBe(true);

    // Wait for the flash to clear (600ms + small buffer)
    await new Promise(resolve => setTimeout(resolve, 700));
    await page.waitForChanges();

    expect(priceElement?.classList.contains('cr-price--flash-up')).toBe(false);
  }, 10000);

  it('handles invalid price values gracefully', async () => {
    const page = await newSpecPage({
      components: [CryptorillPrice],
      html: '<cryptorill-price value="invalid"></cryptorill-price>',
    });

    const valueElement = page.root?.shadowRoot?.querySelector('.cr-price__value');
    expect(valueElement?.textContent).toBe('---');
  });

  it('handles numeric price input', async () => {
    const page = await newSpecPage({
      components: [CryptorillPrice],
      html: '<cryptorill-price></cryptorill-price>',
    });

    // Use component instance to update the value
    const component = page.rootInstance as CryptorillPrice;
    component.value = 1234.56;
    await page.waitForChanges();

    const valueElement = page.root?.shadowRoot?.querySelector('.cr-price__value');
    expect(valueElement?.textContent).toContain('1,234.56');
  });
});
