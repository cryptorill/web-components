import { newSpecPage } from '@stencil/core/testing';
import { CryptorillPercentageBar } from './cryptorill-percentage-bar';

describe('cryptorill-percentage-bar', () => {
  it('renders with default values', async () => {
    const page = await newSpecPage({
      components: [CryptorillPercentageBar],
      html: '<cryptorill-percentage-bar></cryptorill-percentage-bar>',
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.cryptorill-percentage-bar')).toBeTruthy();
  });

  it('renders percentage bar with correct percentage', async () => {
    const page = await newSpecPage({
      components: [CryptorillPercentageBar],
      html: '<cryptorill-percentage-bar value="50"></cryptorill-percentage-bar>',
    });

    const fillElement = page.root?.shadowRoot?.querySelector('.cr-percentage-bar__fill');
    expect(fillElement).toBeTruthy();
    expect(fillElement?.getAttribute('style')).toContain('width: 50%');
  });

  it('calculates percentage correctly with custom maxValue', async () => {
    const page = await newSpecPage({
      components: [CryptorillPercentageBar],
      html: '<cryptorill-percentage-bar value="25" max-value="200"></cryptorill-percentage-bar>',
    });

    const fillElement = page.root?.shadowRoot?.querySelector('.cr-percentage-bar__fill');
    expect(fillElement?.getAttribute('style')).toContain('width: 12.5%');
  });

  it('caps percentage at 100%', async () => {
    const page = await newSpecPage({
      components: [CryptorillPercentageBar],
      html: '<cryptorill-percentage-bar value="150"></cryptorill-percentage-bar>',
    });

    const fillElement = page.root?.shadowRoot?.querySelector('.cr-percentage-bar__fill');
    expect(fillElement?.getAttribute('style')).toContain('width: 100%');
  });

  it('shows 0% when value is 0', async () => {
    const page = await newSpecPage({
      components: [CryptorillPercentageBar],
      html: '<cryptorill-percentage-bar value="0"></cryptorill-percentage-bar>',
    });

    const fillElement = page.root?.shadowRoot?.querySelector('.cr-percentage-bar__fill');
    expect(fillElement?.getAttribute('style')).toContain('width: 0%');
  });

  it('displays label when provided', async () => {
    const page = await newSpecPage({
      components: [CryptorillPercentageBar],
      html: '<cryptorill-percentage-bar value="50" label="Market Dominance"></cryptorill-percentage-bar>',
    });

    const labelElement = page.root?.shadowRoot?.querySelector('.cr-percentage-bar__label');
    expect(labelElement).toBeTruthy();
    expect(labelElement?.textContent).toBe('Market Dominance');
  });

  it('displays percentage value by default', async () => {
    const page = await newSpecPage({
      components: [CryptorillPercentageBar],
      html: '<cryptorill-percentage-bar value="75.5"></cryptorill-percentage-bar>',
    });

    const valueElement = page.root?.shadowRoot?.querySelector('.cr-percentage-bar__value');
    expect(valueElement).toBeTruthy();
    expect(valueElement?.textContent).toBe('75.5%');
  });

  it('hides percentage value when showValue is false', async () => {
    const page = await newSpecPage({
      components: [CryptorillPercentageBar],
      html: '<cryptorill-percentage-bar value="50" show-value="false"></cryptorill-percentage-bar>',
    });

    const valueElement = page.root?.shadowRoot?.querySelector('.cr-percentage-bar__value');
    expect(valueElement).toBeFalsy();
  });

  it('applies theme classes correctly - dark', async () => {
    const page = await newSpecPage({
      components: [CryptorillPercentageBar],
      html: '<cryptorill-percentage-bar theme="dark"></cryptorill-percentage-bar>',
    });

    const barElement = page.root?.shadowRoot?.querySelector('.cryptorill-percentage-bar');
    expect(barElement?.classList.contains('cr-percentage-bar--theme-dark')).toBe(true);
  });

  it('applies theme classes correctly - light', async () => {
    const page = await newSpecPage({
      components: [CryptorillPercentageBar],
      html: '<cryptorill-percentage-bar theme="light"></cryptorill-percentage-bar>',
    });

    const barElement = page.root?.shadowRoot?.querySelector('.cryptorill-percentage-bar');
    expect(barElement?.classList.contains('cr-percentage-bar--theme-light')).toBe(true);
  });

  it('applies theme classes correctly - gradient', async () => {
    const page = await newSpecPage({
      components: [CryptorillPercentageBar],
      html: '<cryptorill-percentage-bar theme="gradient"></cryptorill-percentage-bar>',
    });

    const barElement = page.root?.shadowRoot?.querySelector('.cryptorill-percentage-bar');
    expect(barElement?.classList.contains('cr-percentage-bar--theme-gradient')).toBe(true);
  });

  it('applies custom color', async () => {
    const page = await newSpecPage({
      components: [CryptorillPercentageBar],
      html: '<cryptorill-percentage-bar value="50" color="#ff0000"></cryptorill-percentage-bar>',
    });

    const fillElement = page.root?.shadowRoot?.querySelector('.cr-percentage-bar__fill');
    expect(fillElement?.getAttribute('style')).toContain('background: #ff0000');
  });

  it('has correct ARIA attributes', async () => {
    const page = await newSpecPage({
      components: [CryptorillPercentageBar],
      html: '<cryptorill-percentage-bar value="50" max-value="100" label="Completion"></cryptorill-percentage-bar>',
    });

    const fillElement = page.root?.shadowRoot?.querySelector('.cr-percentage-bar__fill');
    expect(fillElement?.getAttribute('role')).toBe('progressbar');
    expect(fillElement?.getAttribute('aria-valuenow')).toBe('50');
    expect(fillElement?.getAttribute('aria-valuemin')).toBe('0');
    expect(fillElement?.getAttribute('aria-valuemax')).toBe('100');
    expect(fillElement?.getAttribute('aria-label')).toBe('Completion: 50.0%');
  });

  it('handles zero max value gracefully', async () => {
    const page = await newSpecPage({
      components: [CryptorillPercentageBar],
      html: '<cryptorill-percentage-bar value="50" max-value="0"></cryptorill-percentage-bar>',
    });

    const fillElement = page.root?.shadowRoot?.querySelector('.cr-percentage-bar__fill');
    expect(fillElement?.getAttribute('style')).toContain('width: 0%');
  });

  it('handles negative values gracefully', async () => {
    const page = await newSpecPage({
      components: [CryptorillPercentageBar],
      html: '<cryptorill-percentage-bar value="-10"></cryptorill-percentage-bar>',
    });

    const fillElement = page.root?.shadowRoot?.querySelector('.cr-percentage-bar__fill');
    expect(fillElement?.getAttribute('style')).toContain('width: 0%');
  });

  it('formats percentage with one decimal place', async () => {
    const page = await newSpecPage({
      components: [CryptorillPercentageBar],
      html: '<cryptorill-percentage-bar value="33.333"></cryptorill-percentage-bar>',
    });

    const valueElement = page.root?.shadowRoot?.querySelector('.cr-percentage-bar__value');
    expect(valueElement?.textContent).toBe('33.3%');
  });
});
