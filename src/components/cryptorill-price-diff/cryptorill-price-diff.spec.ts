import { newSpecPage } from '@stencil/core/testing';
import { CryptorillPriceDiff } from './cryptorill-price-diff';

describe('cryptorill-price-diff', () => {
  it('renders with default values', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceDiff],
      html: '<cryptorill-price-diff></cryptorill-price-diff>',
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.cryptorill-price-diff')).toBeTruthy();
  });

  it('displays positive diff with up arrow', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceDiff],
      html: '<cryptorill-price-diff value="5.5"></cryptorill-price-diff>',
    });

    const arrowElement = page.root?.shadowRoot?.querySelector('.cr-price-diff__arrow');
    const percentageElement = page.root?.shadowRoot?.querySelector('.cr-price-diff__percentage');

    expect(arrowElement?.textContent).toBe('▲');
    expect(percentageElement?.textContent).toBe('5.50%');
  });

  it('displays negative diff with down arrow', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceDiff],
      html: '<cryptorill-price-diff value="-3.25"></cryptorill-price-diff>',
    });

    const arrowElement = page.root?.shadowRoot?.querySelector('.cr-price-diff__arrow');
    const percentageElement = page.root?.shadowRoot?.querySelector('.cr-price-diff__percentage');

    expect(arrowElement?.textContent).toBe('▼');
    expect(percentageElement?.textContent).toBe('3.25%');
  });

  it('applies positive class for positive values', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceDiff],
      html: '<cryptorill-price-diff value="10"></cryptorill-price-diff>',
    });

    const diffElement = page.root?.shadowRoot?.querySelector('.cryptorill-price-diff');
    expect(diffElement?.classList.contains('cr-price-diff--positive')).toBe(true);
    expect(diffElement?.classList.contains('cr-price-diff--negative')).toBe(false);
  });

  it('applies negative class for negative values', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceDiff],
      html: '<cryptorill-price-diff value="-10"></cryptorill-price-diff>',
    });

    const diffElement = page.root?.shadowRoot?.querySelector('.cryptorill-price-diff');
    expect(diffElement?.classList.contains('cr-price-diff--negative')).toBe(true);
    expect(diffElement?.classList.contains('cr-price-diff--positive')).toBe(false);
  });

  it('treats zero as positive', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceDiff],
      html: '<cryptorill-price-diff value="0"></cryptorill-price-diff>',
    });

    const arrowElement = page.root?.shadowRoot?.querySelector('.cr-price-diff__arrow');
    const diffElement = page.root?.shadowRoot?.querySelector('.cryptorill-price-diff');

    expect(arrowElement?.textContent).toBe('▲');
    expect(diffElement?.classList.contains('cr-price-diff--positive')).toBe(true);
  });

  it('formats percentage to 2 decimal places', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceDiff],
      html: '<cryptorill-price-diff value="7.12345"></cryptorill-price-diff>',
    });

    const percentageElement = page.root?.shadowRoot?.querySelector('.cr-price-diff__percentage');
    expect(percentageElement?.textContent).toBe('7.12%');
  });

  it('displays default label (24h)', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceDiff],
      html: '<cryptorill-price-diff value="5"></cryptorill-price-diff>',
    });

    const labelElement = page.root?.shadowRoot?.querySelector('.cr-price-diff__label');
    expect(labelElement?.textContent).toBe('24h');
  });

  it('displays custom label', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceDiff],
      html: '<cryptorill-price-diff value="5" label="7d"></cryptorill-price-diff>',
    });

    const labelElement = page.root?.shadowRoot?.querySelector('.cr-price-diff__label');
    expect(labelElement?.textContent).toBe('7d');
  });

  it('hides label when showLabel is false', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceDiff],
      html: '<cryptorill-price-diff value="5" show-label="false"></cryptorill-price-diff>',
    });

    const labelElement = page.root?.shadowRoot?.querySelector('.cr-price-diff__label');
    expect(labelElement).toBeFalsy();
  });

  it('shows label by default', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceDiff],
      html: '<cryptorill-price-diff value="5"></cryptorill-price-diff>',
    });

    const labelElement = page.root?.shadowRoot?.querySelector('.cr-price-diff__label');
    expect(labelElement).toBeTruthy();
  });

  it('applies small size class', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceDiff],
      html: '<cryptorill-price-diff value="5" size="small"></cryptorill-price-diff>',
    });

    const diffElement = page.root?.shadowRoot?.querySelector('.cryptorill-price-diff');
    expect(diffElement?.classList.contains('cr-price-diff--small')).toBe(true);
  });

  it('applies medium size class', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceDiff],
      html: '<cryptorill-price-diff value="5" size="medium"></cryptorill-price-diff>',
    });

    const diffElement = page.root?.shadowRoot?.querySelector('.cryptorill-price-diff');
    expect(diffElement?.classList.contains('cr-price-diff--medium')).toBe(true);
  });

  it('applies large size class', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceDiff],
      html: '<cryptorill-price-diff value="5" size="large"></cryptorill-price-diff>',
    });

    const diffElement = page.root?.shadowRoot?.querySelector('.cryptorill-price-diff');
    expect(diffElement?.classList.contains('cr-price-diff--large')).toBe(true);
  });

  it('handles very large positive values', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceDiff],
      html: '<cryptorill-price-diff value="999.99"></cryptorill-price-diff>',
    });

    const percentageElement = page.root?.shadowRoot?.querySelector('.cr-price-diff__percentage');
    expect(percentageElement?.textContent).toBe('999.99%');
    expect(percentageElement?.textContent).not.toContain('-');
  });

  it('handles very large negative values', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceDiff],
      html: '<cryptorill-price-diff value="-999.99"></cryptorill-price-diff>',
    });

    const percentageElement = page.root?.shadowRoot?.querySelector('.cr-price-diff__percentage');
    const arrowElement = page.root?.shadowRoot?.querySelector('.cr-price-diff__arrow');

    expect(percentageElement?.textContent).toBe('999.99%');
    expect(arrowElement?.textContent).toBe('▼');
  });

  it('handles small decimal values', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceDiff],
      html: '<cryptorill-price-diff value="0.01"></cryptorill-price-diff>',
    });

    const percentageElement = page.root?.shadowRoot?.querySelector('.cr-price-diff__percentage');
    expect(percentageElement?.textContent).toBe('0.01%');
  });

  it('handles small negative decimal values', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceDiff],
      html: '<cryptorill-price-diff value="-0.01"></cryptorill-price-diff>',
    });

    const percentageElement = page.root?.shadowRoot?.querySelector('.cr-price-diff__percentage');
    const arrowElement = page.root?.shadowRoot?.querySelector('.cr-price-diff__arrow');

    expect(percentageElement?.textContent).toBe('0.01%');
    expect(arrowElement?.textContent).toBe('▼');
  });

  it('updates when value prop changes', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceDiff],
      html: '<cryptorill-price-diff value="5"></cryptorill-price-diff>',
    });

    // Update via HTML attribute to trigger re-render
    const element = page.root as HTMLElement;
    element.setAttribute('value', '-10');
    await page.waitForChanges();

    const arrowElement = page.root?.shadowRoot?.querySelector('.cr-price-diff__arrow');
    const percentageElement = page.root?.shadowRoot?.querySelector('.cr-price-diff__percentage');

    expect(arrowElement?.textContent).toBe('▼');
    expect(percentageElement?.textContent).toBe('10.00%');
  });

  it('updates when label prop changes', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceDiff],
      html: '<cryptorill-price-diff value="5" label="1h"></cryptorill-price-diff>',
    });

    // Update via HTML attribute to trigger re-render
    const element = page.root as HTMLElement;
    element.setAttribute('label', '1d');
    await page.waitForChanges();

    const labelElement = page.root?.shadowRoot?.querySelector('.cr-price-diff__label');
    expect(labelElement?.textContent).toBe('1d');
  });
});
