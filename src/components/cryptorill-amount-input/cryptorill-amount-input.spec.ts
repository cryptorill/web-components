import { newSpecPage } from '@stencil/core/testing';
import { CryptorillAmountInput } from './cryptorill-amount-input';

describe('cryptorill-amount-input', () => {
  it('renders with default values', async () => {
    const page = await newSpecPage({
      components: [CryptorillAmountInput],
      html: '<cryptorill-amount-input></cryptorill-amount-input>',
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.cryptorill-amount-input')).toBeTruthy();
  });

  it('renders with symbol', async () => {
    const page = await newSpecPage({
      components: [CryptorillAmountInput],
      html: '<cryptorill-amount-input symbol="ETH"></cryptorill-amount-input>',
    });

    const symbol = page.root?.shadowRoot?.querySelector('.cr-amount-input__symbol');
    expect(symbol?.textContent).toBe('ETH');
  });

  it('shows max button when available balance is provided', async () => {
    const page = await newSpecPage({
      components: [CryptorillAmountInput],
      html: '<cryptorill-amount-input available-balance="10.5" symbol="BTC"></cryptorill-amount-input>',
    });

    const maxBtn = page.root?.shadowRoot?.querySelector('.cr-amount-input__max-btn');
    expect(maxBtn).toBeTruthy();

    const balance = page.root?.shadowRoot?.querySelector('.cr-amount-input__balance');
    expect(balance?.textContent).toContain('10.5');
  });

  it('applies theme classes correctly', async () => {
    const page = await newSpecPage({
      components: [CryptorillAmountInput],
      html: '<cryptorill-amount-input theme="light"></cryptorill-amount-input>',
    });

    const inputElement = page.root?.shadowRoot?.querySelector('.cryptorill-amount-input');
    expect(inputElement?.classList.contains('cr-amount-input--theme-light')).toBe(true);
  });

  it('shows disabled state', async () => {
    const page = await newSpecPage({
      components: [CryptorillAmountInput],
      html: '<cryptorill-amount-input disabled="true"></cryptorill-amount-input>',
    });

    const inputElement = page.root?.shadowRoot?.querySelector('.cryptorill-amount-input');
    expect(inputElement?.classList.contains('cr-amount-input--disabled')).toBe(true);

    const input = page.root?.shadowRoot?.querySelector('.cr-amount-input__field');
    expect(input?.hasAttribute('disabled')).toBe(true);
  });

  it('emits valueChange event on input', async () => {
    const page = await newSpecPage({
      components: [CryptorillAmountInput],
      html: '<cryptorill-amount-input></cryptorill-amount-input>',
    });

    const valueChangeSpy = jest.fn();
    page.root?.addEventListener('valueChange', valueChangeSpy);

    const input = page.root?.shadowRoot?.querySelector('.cr-amount-input__field');
    if (input) {
      (input as HTMLInputElement).value = '1.5';
      input.dispatchEvent(new Event('input'));
    }

    expect(valueChangeSpy).toHaveBeenCalled();
  });

  it('displays custom label', async () => {
    const page = await newSpecPage({
      components: [CryptorillAmountInput],
      html: '<cryptorill-amount-input label="Send Amount"></cryptorill-amount-input>',
    });

    const label = page.root?.shadowRoot?.querySelector('.cr-amount-input__label');
    expect(label?.textContent).toContain('Send Amount');
  });
});
