import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';

test.describe('cryptorill-trade-history', () => {
  test('renders with default values', async ({ page }) => {
    await page.goto('/components/cryptorill-trade-history/test/cryptorill-trade-history.e2e.html');

    const component = page.locator('cryptorill-trade-history');
    await expect(component).toBeTruthy();

    const container = component.locator('.cryptorill-trade-history');
    await expect(container).toBeTruthy();
  });

  test('renders with trades data', async ({ page }) => {
    await page.goto('/components/cryptorill-trade-history/test/cryptorill-trade-history.e2e.html');

    const trades = [
      { id: '1', price: '45000', amount: '1.5', side: 'buy', timestamp: Date.now() },
      { id: '2', price: '45100', amount: '0.8', side: 'sell', timestamp: Date.now() },
    ];

    await page.evaluate(trades => {
      const component = document.querySelector('cryptorill-trade-history')!;
      component.trades = JSON.stringify(trades);
    }, trades);

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-trade-history');
    const tradeItems = component.locator('.cr-trade-history__row');
    await expect(tradeItems).toHaveCount(2);
  });
});
