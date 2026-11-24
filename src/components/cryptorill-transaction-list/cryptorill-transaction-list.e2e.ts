import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';

test.describe('cryptorill-transaction-list', () => {
  test('renders with default values', async ({ page }) => {
    await page.goto('/components/cryptorill-transaction-list/test/cryptorill-transaction-list.e2e.html');

    const component = page.locator('cryptorill-transaction-list');
    await expect(component).toBeTruthy();

    const container = component.locator('.cryptorill-transaction-list');
    await expect(container).toBeTruthy();
  });

  test('renders with transactions', async ({ page }) => {
    await page.goto('/components/cryptorill-transaction-list/test/cryptorill-transaction-list.e2e.html');

    const transactions = [
      { id: '1', type: 'send', amount: '1.5', symbol: 'ETH', status: 'confirmed' },
      { id: '2', type: 'receive', amount: '0.5', symbol: 'BTC', status: 'pending' },
    ];

    await page.evaluate(txns => {
      const component = document.querySelector('cryptorill-transaction-list')!;
      component.transactions = JSON.stringify(txns);
    }, transactions);

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-transaction-list');
    const items = component.locator('cryptorill-transaction-item');
    await expect(items).toHaveCount(2);
  });
});

