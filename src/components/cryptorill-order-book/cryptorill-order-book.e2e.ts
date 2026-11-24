import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';

test.describe('cryptorill-order-book', () => {
  test('renders with default values', async ({ page }) => {
    await page.goto('/components/cryptorill-order-book/test/cryptorill-order-book.e2e.html');

    const component = page.locator('cryptorill-order-book');
    await expect(component).toBeTruthy();

    const container = component.locator('.cryptorill-order-book');
    await expect(container).toBeTruthy();
  });

  test('displays the title', async ({ page }) => {
    await page.goto('/components/cryptorill-order-book/test/cryptorill-order-book.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-order-book')!;
      component.bookTitle = 'BTC/USDT Order Book';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-order-book');
    const container = component.locator('.cryptorill-order-book');
    await expect(container).toContainText('BTC/USDT Order Book');
  });

  test('renders bid order rows', async ({ page }) => {
    await page.goto('/components/cryptorill-order-book/test/cryptorill-order-book.e2e.html');

    const bids = [
      { price: 45000, amount: 1.5, total: 67500 },
      { price: 44950, amount: 2.0, total: 89900 },
    ];

    await page.evaluate(bids => {
      const component = document.querySelector('cryptorill-order-book')!;
      component.bids = bids;
    }, bids);

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-order-book');
    const bidRows = component.locator('.cr-order-book__section--bids cryptorill-order-row');
    await expect(bidRows).toHaveCount(2);
  });
});
