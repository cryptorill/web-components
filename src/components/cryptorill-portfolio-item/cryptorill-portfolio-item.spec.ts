import { newSpecPage } from '@stencil/core/testing';
import { CryptorillPortfolioItem } from './cryptorill-portfolio-item';

describe('cryptorill-portfolio-item', () => {
  it('renders with default values', async () => {
    const page = await newSpecPage({
      components: [CryptorillPortfolioItem],
      html: '<cryptorill-portfolio-item></cryptorill-portfolio-item>',
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.cryptorill-portfolio-item')).toBeTruthy();
  });

  it('renders with portfolio data', async () => {
    const page = await newSpecPage({
      components: [CryptorillPortfolioItem],
      html: `
        <cryptorill-portfolio-item
          symbol="BTC"
          name="Bitcoin"
          balance="0.5"
          price="45000"
          avg-buy-price="40000"
          allocation="25"
          pnl="12.5"
        ></cryptorill-portfolio-item>
      `,
    });

    const symbolElement = page.root?.shadowRoot?.querySelector('.cr-portfolio-item__symbol');
    expect(symbolElement?.textContent).toBe('BTC');

    const nameElement = page.root?.shadowRoot?.querySelector('.cr-portfolio-item__name');
    expect(nameElement?.textContent).toBe('Bitcoin');
  });

  it('calculates total value from balance and price', async () => {
    const page = await newSpecPage({
      components: [CryptorillPortfolioItem],
      html: `
        <cryptorill-portfolio-item
          balance="2"
          price="3000"
        ></cryptorill-portfolio-item>
      `,
    });

    const valueElement = page.root?.shadowRoot?.querySelector('.cr-portfolio-item__value');
    expect(valueElement?.textContent).toContain('6,000');
  });

  it('applies size classes correctly', async () => {
    const page = await newSpecPage({
      components: [CryptorillPortfolioItem],
      html: '<cryptorill-portfolio-item size="compact"></cryptorill-portfolio-item>',
    });

    const itemElement = page.root?.shadowRoot?.querySelector('.cryptorill-portfolio-item');
    expect(itemElement?.classList.contains('cr-portfolio-item--size-compact')).toBe(true);
  });

  it('applies theme classes correctly', async () => {
    const page = await newSpecPage({
      components: [CryptorillPortfolioItem],
      html: '<cryptorill-portfolio-item theme="light"></cryptorill-portfolio-item>',
    });

    const itemElement = page.root?.shadowRoot?.querySelector('.cryptorill-portfolio-item');
    expect(itemElement?.classList.contains('cr-portfolio-item--theme-light')).toBe(true);
  });

  it('shows full details in full size mode', async () => {
    const page = await newSpecPage({
      components: [CryptorillPortfolioItem],
      html: '<cryptorill-portfolio-item size="full"></cryptorill-portfolio-item>',
    });

    const allocationElement = page.root?.shadowRoot?.querySelector('.cr-portfolio-item__allocation');
    expect(allocationElement).toBeTruthy();
  });
});
