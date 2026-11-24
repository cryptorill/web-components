import { newSpecPage } from '@stencil/core/testing';
import { CryptorillPriceAlert } from './cryptorill-price-alert';

describe('cryptorill-price-alert', () => {
  it('renders with default values', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceAlert],
      html: '<cryptorill-price-alert></cryptorill-price-alert>',
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.cryptorill-price-alert')).toBeTruthy();
  });

  it('renders with symbol and prices', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceAlert],
      html: `
        <cryptorill-price-alert
          symbol="BTC"
          current-price="45000"
          target-price="50000"
          condition="above"
        ></cryptorill-price-alert>
      `,
    });

    const symbol = page.root?.shadowRoot?.querySelector('.cr-price-alert__symbol');
    expect(symbol?.textContent).toBe('BTC');

    const targetPrice = page.root?.shadowRoot?.querySelector('.cr-price-alert__target-price');
    expect(targetPrice?.textContent).toContain('$50,000');
  });

  it('shows active state when isActive is true', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceAlert],
      html: '<cryptorill-price-alert is-active="true"></cryptorill-price-alert>',
    });

    const alertElement = page.root?.shadowRoot?.querySelector('.cryptorill-price-alert');
    expect(alertElement?.classList.contains('cr-price-alert--active')).toBe(true);

    const toggle = page.root?.shadowRoot?.querySelector('.cr-price-alert__toggle');
    expect(toggle?.classList.contains('cr-price-alert__toggle--active')).toBe(true);
  });

  it('applies theme classes correctly', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceAlert],
      html: '<cryptorill-price-alert theme="light"></cryptorill-price-alert>',
    });

    const alertElement = page.root?.shadowRoot?.querySelector('.cryptorill-price-alert');
    expect(alertElement?.classList.contains('cr-price-alert--theme-light')).toBe(true);
  });

  it('emits toggleAlert event when toggle clicked', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceAlert],
      html: '<cryptorill-price-alert></cryptorill-price-alert>',
    });

    const toggleSpy = jest.fn();
    page.root?.addEventListener('toggleAlert', toggleSpy);

    const toggle = page.root?.shadowRoot?.querySelector('.cr-price-alert__toggle');
    toggle?.dispatchEvent(new Event('click'));

    expect(toggleSpy).toHaveBeenCalled();
  });

  it('displays condition text correctly', async () => {
    const page = await newSpecPage({
      components: [CryptorillPriceAlert],
      html: '<cryptorill-price-alert condition="below"></cryptorill-price-alert>',
    });

    const conditionLabel = page.root?.shadowRoot?.querySelector('.cr-price-alert__target-label');
    expect(conditionLabel?.textContent).toContain('below');
  });
});
