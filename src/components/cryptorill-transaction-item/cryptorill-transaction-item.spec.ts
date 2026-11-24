import { newSpecPage } from '@stencil/core/testing';
import { CryptorillTransactionItem } from './cryptorill-transaction-item';

describe('cryptorill-transaction-item', () => {
  it('renders with default values', async () => {
    const page = await newSpecPage({
      components: [CryptorillTransactionItem],
      html: '<cryptorill-transaction-item></cryptorill-transaction-item>',
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.cryptorill-transaction-item')).toBeTruthy();
  });

  it('renders with transaction details', async () => {
    const page = await newSpecPage({
      components: [CryptorillTransactionItem],
      html: `
        <cryptorill-transaction-item
          type="send"
          symbol="ETH"
          amount="1.5"
          status="confirmed"
          counterparty="0x1234...5678"
        ></cryptorill-transaction-item>
      `,
    });

    const typeElement = page.root?.shadowRoot?.querySelector('.cr-transaction-item__type');
    expect(typeElement?.textContent).toBe('Sent');

    const amountElement = page.root?.shadowRoot?.querySelector('.cr-transaction-item__amount');
    expect(amountElement?.textContent).toContain('1.5');
    expect(amountElement?.textContent).toContain('ETH');
  });

  it('applies theme classes correctly', async () => {
    const page = await newSpecPage({
      components: [CryptorillTransactionItem],
      html: '<cryptorill-transaction-item theme="light"></cryptorill-transaction-item>',
    });

    const itemElement = page.root?.shadowRoot?.querySelector('.cryptorill-transaction-item');
    expect(itemElement?.classList.contains('cr-transaction-item--theme-light')).toBe(true);
  });

  it('displays correct status styling', async () => {
    const page = await newSpecPage({
      components: [CryptorillTransactionItem],
      html: '<cryptorill-transaction-item status="pending"></cryptorill-transaction-item>',
    });

    const itemElement = page.root?.shadowRoot?.querySelector('.cryptorill-transaction-item');
    expect(itemElement?.classList.contains('cr-transaction-item--status-pending')).toBe(true);

    const statusElement = page.root?.shadowRoot?.querySelector('.cr-transaction-item__status');
    expect(statusElement?.classList.contains('cr-transaction-item__status--pending')).toBe(true);
  });

  it('truncates long counterparty addresses', async () => {
    const page = await newSpecPage({
      components: [CryptorillTransactionItem],
      html: `
        <cryptorill-transaction-item
          counterparty="0x1234567890123456789012345678901234567890"
        ></cryptorill-transaction-item>
      `,
    });

    const counterpartyElement = page.root?.shadowRoot?.querySelector('.cr-transaction-item__counterparty');
    expect(counterpartyElement?.textContent).toContain('...');
  });
});
