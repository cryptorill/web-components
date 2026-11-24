import { newSpecPage } from '@stencil/core/testing';
import { CryptorillTokenIcon } from './cryptorill-token-icon';

describe('cryptorill-token-icon', () => {
  it('renders with default values', async () => {
    const page = await newSpecPage({
      components: [CryptorillTokenIcon],
      html: '<cryptorill-token-icon></cryptorill-token-icon>',
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.cryptorill-token-icon')).toBeTruthy();
  });

  it('renders with symbol and displays initials', async () => {
    const page = await newSpecPage({
      components: [CryptorillTokenIcon],
      html: '<cryptorill-token-icon symbol="BTC"></cryptorill-token-icon>',
    });

    const initialsElement = page.root?.shadowRoot?.querySelector('.cr-token-icon__initials');
    expect(initialsElement).toBeTruthy();
    expect(initialsElement?.textContent).toBe('BT');
  });

  it('displays custom fallback text', async () => {
    const page = await newSpecPage({
      components: [CryptorillTokenIcon],
      html: '<cryptorill-token-icon symbol="BTC" fallback="XBT"></cryptorill-token-icon>',
    });

    const initialsElement = page.root?.shadowRoot?.querySelector('.cr-token-icon__initials');
    expect(initialsElement?.textContent).toBe('XBT');
  });

  it('applies size classes correctly - sm', async () => {
    const page = await newSpecPage({
      components: [CryptorillTokenIcon],
      html: '<cryptorill-token-icon symbol="BTC" size="sm"></cryptorill-token-icon>',
    });

    const iconElement = page.root?.shadowRoot?.querySelector('.cryptorill-token-icon');
    expect(iconElement?.classList.contains('cr-token-icon--sm')).toBe(true);
  });

  it('applies size classes correctly - md', async () => {
    const page = await newSpecPage({
      components: [CryptorillTokenIcon],
      html: '<cryptorill-token-icon symbol="BTC" size="md"></cryptorill-token-icon>',
    });

    const iconElement = page.root?.shadowRoot?.querySelector('.cryptorill-token-icon');
    expect(iconElement?.classList.contains('cr-token-icon--md')).toBe(true);
  });

  it('applies size classes correctly - lg', async () => {
    const page = await newSpecPage({
      components: [CryptorillTokenIcon],
      html: '<cryptorill-token-icon symbol="BTC" size="lg"></cryptorill-token-icon>',
    });

    const iconElement = page.root?.shadowRoot?.querySelector('.cryptorill-token-icon');
    expect(iconElement?.classList.contains('cr-token-icon--lg')).toBe(true);
  });

  it('applies theme classes correctly - dark', async () => {
    const page = await newSpecPage({
      components: [CryptorillTokenIcon],
      html: '<cryptorill-token-icon symbol="BTC" theme="dark"></cryptorill-token-icon>',
    });

    const iconElement = page.root?.shadowRoot?.querySelector('.cryptorill-token-icon');
    expect(iconElement?.classList.contains('cr-token-icon--theme-dark')).toBe(true);
  });

  it('applies theme classes correctly - light', async () => {
    const page = await newSpecPage({
      components: [CryptorillTokenIcon],
      html: '<cryptorill-token-icon symbol="BTC" theme="light"></cryptorill-token-icon>',
    });

    const iconElement = page.root?.shadowRoot?.querySelector('.cryptorill-token-icon');
    expect(iconElement?.classList.contains('cr-token-icon--theme-light')).toBe(true);
  });

  it('applies theme classes correctly - gradient', async () => {
    const page = await newSpecPage({
      components: [CryptorillTokenIcon],
      html: '<cryptorill-token-icon symbol="BTC" theme="gradient"></cryptorill-token-icon>',
    });

    const iconElement = page.root?.shadowRoot?.querySelector('.cryptorill-token-icon');
    expect(iconElement?.classList.contains('cr-token-icon--theme-gradient')).toBe(true);
  });

  it('renders image when src is provided', async () => {
    const page = await newSpecPage({
      components: [CryptorillTokenIcon],
      html: '<cryptorill-token-icon symbol="BTC" src="https://example.com/btc.png"></cryptorill-token-icon>',
    });

    const imageElement = page.root?.shadowRoot?.querySelector('.cr-token-icon__image');
    expect(imageElement).toBeTruthy();
    expect(imageElement?.getAttribute('src')).toBe('https://example.com/btc.png');
  });

  it('displays initials when image fails to load', async () => {
    const page = await newSpecPage({
      components: [CryptorillTokenIcon],
      html: '<cryptorill-token-icon symbol="BTC" src="invalid-url"></cryptorill-token-icon>',
    });

    const imageElement = page.root?.shadowRoot?.querySelector('.cr-token-icon__image') as HTMLImageElement;
    expect(imageElement).toBeTruthy();

    // Simulate image error
    imageElement.dispatchEvent(new Event('error'));
    await page.waitForChanges();

    const initialsElement = page.root?.shadowRoot?.querySelector('.cr-token-icon__initials');
    expect(initialsElement).toBeTruthy();
    expect(initialsElement?.textContent).toBe('BT');
  });

  it('has correct aria-label', async () => {
    const page = await newSpecPage({
      components: [CryptorillTokenIcon],
      html: '<cryptorill-token-icon symbol="ETH"></cryptorill-token-icon>',
    });

    const iconElement = page.root?.shadowRoot?.querySelector('.cryptorill-token-icon');
    expect(iconElement?.getAttribute('aria-label')).toBe('ETH icon');
  });

  it('handles empty symbol gracefully', async () => {
    const page = await newSpecPage({
      components: [CryptorillTokenIcon],
      html: '<cryptorill-token-icon></cryptorill-token-icon>',
    });

    const initialsElement = page.root?.shadowRoot?.querySelector('.cr-token-icon__initials');
    expect(initialsElement?.textContent).toBe('');
  });

  it('converts symbol to uppercase initials', async () => {
    const page = await newSpecPage({
      components: [CryptorillTokenIcon],
      html: '<cryptorill-token-icon symbol="btc"></cryptorill-token-icon>',
    });

    const initialsElement = page.root?.shadowRoot?.querySelector('.cr-token-icon__initials');
    expect(initialsElement?.textContent).toBe('BT');
  });
});
