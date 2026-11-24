import { newSpecPage } from '@stencil/core/testing';
import { CryptorillBalance } from './cryptorill-balance';

describe('cryptorill-balance', () => {
  it('renders with default values', async () => {
    const page = await newSpecPage({
      components: [CryptorillBalance],
      html: '<cryptorill-balance></cryptorill-balance>',
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.cryptorill-balance')).toBeTruthy();
  });

  it('renders with balance amount and symbol', async () => {
    const page = await newSpecPage({
      components: [CryptorillBalance],
      html: `
        <cryptorill-balance
          amount="1.5"
          symbol="ETH"
          decimals="4"
        ></cryptorill-balance>
      `,
    });

    const amountElement = page.root?.shadowRoot?.querySelector('.cr-balance__amount');
    expect(amountElement?.textContent).toContain('1.5');
    expect(amountElement?.textContent).toContain('ETH');
  });

  it('shows fiat equivalent when showFiat is true', async () => {
    const page = await newSpecPage({
      components: [CryptorillBalance],
      html: `
        <cryptorill-balance
          amount="1"
          symbol="BTC"
          show-fiat="true"
          fiat-value="45000"
          fiat-currency="USD"
        ></cryptorill-balance>
      `,
    });

    const fiatElement = page.root?.shadowRoot?.querySelector('.cr-balance__fiat');
    expect(fiatElement).toBeTruthy();
    expect(fiatElement?.textContent).toContain('$');
  });

  it('applies size classes correctly', async () => {
    const page = await newSpecPage({
      components: [CryptorillBalance],
      html: '<cryptorill-balance size="large"></cryptorill-balance>',
    });

    const balanceElement = page.root?.shadowRoot?.querySelector('.cryptorill-balance');
    expect(balanceElement?.classList.contains('cr-balance--size-large')).toBe(true);
  });

  it('applies theme classes correctly', async () => {
    const page = await newSpecPage({
      components: [CryptorillBalance],
      html: '<cryptorill-balance theme="light"></cryptorill-balance>',
    });

    const balanceElement = page.root?.shadowRoot?.querySelector('.cryptorill-balance');
    expect(balanceElement?.classList.contains('cr-balance--theme-light')).toBe(true);
  });

  it('displays custom label', async () => {
    const page = await newSpecPage({
      components: [CryptorillBalance],
      html: '<cryptorill-balance label="Available Balance"></cryptorill-balance>',
    });

    const labelElement = page.root?.shadowRoot?.querySelector('.cr-balance__label');
    expect(labelElement?.textContent).toBe('Available Balance');
  });
});
