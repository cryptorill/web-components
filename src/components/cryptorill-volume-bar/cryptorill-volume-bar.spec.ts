import { newSpecPage } from '@stencil/core/testing';
import { CryptorillVolumeBar } from './cryptorill-volume-bar';

describe('cryptorill-volume-bar', () => {
  it('renders with default values', async () => {
    const page = await newSpecPage({
      components: [CryptorillVolumeBar],
      html: '<cryptorill-volume-bar></cryptorill-volume-bar>',
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.cryptorill-volume-bar')).toBeTruthy();
  });

  it('renders volume bar with correct percentage', async () => {
    const page = await newSpecPage({
      components: [CryptorillVolumeBar],
      html: '<cryptorill-volume-bar volume="500" max-volume="1000"></cryptorill-volume-bar>',
    });

    const fillElement = page.root?.shadowRoot?.querySelector('.cr-volume-bar__fill');
    expect(fillElement).toBeTruthy();
    expect(fillElement?.getAttribute('style')).toBe('width: 50%;');
  });

  it('caps percentage at 100%', async () => {
    const page = await newSpecPage({
      components: [CryptorillVolumeBar],
      html: '<cryptorill-volume-bar volume="1500" max-volume="1000"></cryptorill-volume-bar>',
    });

    const fillElement = page.root?.shadowRoot?.querySelector('.cr-volume-bar__fill');
    expect(fillElement?.getAttribute('style')).toBe('width: 100%;');
  });

  it('shows 0% when volume is 0', async () => {
    const page = await newSpecPage({
      components: [CryptorillVolumeBar],
      html: '<cryptorill-volume-bar volume="0" max-volume="1000"></cryptorill-volume-bar>',
    });

    const fillElement = page.root?.shadowRoot?.querySelector('.cr-volume-bar__fill');
    expect(fillElement?.getAttribute('style')).toBe('width: 0%;');
  });

  it('displays label when provided', async () => {
    const page = await newSpecPage({
      components: [CryptorillVolumeBar],
      html: '<cryptorill-volume-bar volume="500" max-volume="1000" label="24h Volume"></cryptorill-volume-bar>',
    });

    const labelElement = page.root?.shadowRoot?.querySelector('.cr-volume-bar__label');
    expect(labelElement).toBeTruthy();
    expect(labelElement?.textContent).toBe('24h Volume');
  });

  it('displays formatted volume value', async () => {
    const page = await newSpecPage({
      components: [CryptorillVolumeBar],
      html: '<cryptorill-volume-bar volume="1234567.89" max-volume="2000000" label="Volume"></cryptorill-volume-bar>',
    });

    const valueElement = page.root?.shadowRoot?.querySelector('.cr-volume-bar__value');
    expect(valueElement).toBeTruthy();
    expect(valueElement?.textContent).toContain('USD');
  });

  it('applies theme classes correctly - dark', async () => {
    const page = await newSpecPage({
      components: [CryptorillVolumeBar],
      html: '<cryptorill-volume-bar theme="dark"></cryptorill-volume-bar>',
    });

    const barElement = page.root?.shadowRoot?.querySelector('.cryptorill-volume-bar');
    expect(barElement?.classList.contains('cr-volume-bar--theme-dark')).toBe(true);
  });

  it('applies theme classes correctly - light', async () => {
    const page = await newSpecPage({
      components: [CryptorillVolumeBar],
      html: '<cryptorill-volume-bar theme="light"></cryptorill-volume-bar>',
    });

    const barElement = page.root?.shadowRoot?.querySelector('.cryptorill-volume-bar');
    expect(barElement?.classList.contains('cr-volume-bar--theme-light')).toBe(true);
  });

  it('applies theme classes correctly - gradient', async () => {
    const page = await newSpecPage({
      components: [CryptorillVolumeBar],
      html: '<cryptorill-volume-bar theme="gradient"></cryptorill-volume-bar>',
    });

    const barElement = page.root?.shadowRoot?.querySelector('.cryptorill-volume-bar');
    expect(barElement?.classList.contains('cr-volume-bar--theme-gradient')).toBe(true);
  });

  it('has correct ARIA attributes', async () => {
    const page = await newSpecPage({
      components: [CryptorillVolumeBar],
      html: '<cryptorill-volume-bar volume="500" max-volume="1000"></cryptorill-volume-bar>',
    });

    const fillElement = page.root?.shadowRoot?.querySelector('.cr-volume-bar__fill');
    expect(fillElement?.getAttribute('role')).toBe('progressbar');
    expect(fillElement?.getAttribute('aria-valuenow')).toBe('500');
    expect(fillElement?.getAttribute('aria-valuemin')).toBe('0');
    expect(fillElement?.getAttribute('aria-valuemax')).toBe('1000');
  });

  it('handles zero max volume gracefully', async () => {
    const page = await newSpecPage({
      components: [CryptorillVolumeBar],
      html: '<cryptorill-volume-bar volume="500" max-volume="0"></cryptorill-volume-bar>',
    });

    const fillElement = page.root?.shadowRoot?.querySelector('.cr-volume-bar__fill');
    expect(fillElement?.getAttribute('style')).toBe('width: 0%;');
  });

  it('uses custom currency', async () => {
    const page = await newSpecPage({
      components: [CryptorillVolumeBar],
      html: '<cryptorill-volume-bar volume="500" max-volume="1000" currency="EUR" label="Volume"></cryptorill-volume-bar>',
    });

    const valueElement = page.root?.shadowRoot?.querySelector('.cr-volume-bar__value');
    expect(valueElement?.textContent).toContain('EUR');
  });

  it('shows value in footer when no label is provided', async () => {
    const page = await newSpecPage({
      components: [CryptorillVolumeBar],
      html: '<cryptorill-volume-bar volume="500" max-volume="1000"></cryptorill-volume-bar>',
    });

    const footerElement = page.root?.shadowRoot?.querySelector('.cr-volume-bar__footer');
    expect(footerElement).toBeTruthy();

    const headerElement = page.root?.shadowRoot?.querySelector('.cr-volume-bar__header');
    expect(headerElement).toBeFalsy();
  });

  it('handles negative volume gracefully', async () => {
    const page = await newSpecPage({
      components: [CryptorillVolumeBar],
      html: '<cryptorill-volume-bar volume="-100" max-volume="1000"></cryptorill-volume-bar>',
    });

    const fillElement = page.root?.shadowRoot?.querySelector('.cr-volume-bar__fill');
    expect(fillElement?.getAttribute('style')).toBe('width: 0%;');
  });
});
