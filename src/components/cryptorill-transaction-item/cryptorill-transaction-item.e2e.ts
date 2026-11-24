import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';

test.describe('cryptorill-transaction-item', () => {
  test('renders with default values', async ({ page }) => {
    await page.goto('/components/cryptorill-transaction-item/test/cryptorill-transaction-item.e2e.html');

    const component = page.locator('cryptorill-transaction-item');
    await expect(component).toBeTruthy();

    const container = component.locator('.cryptorill-transaction-item');
    await expect(container).toBeTruthy();
  });

  test('renders transaction details', async ({ page }) => {
    await page.goto('/components/cryptorill-transaction-item/test/cryptorill-transaction-item.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-transaction-item')!;
      component.type = 'send';
      component.amount = 1.5;
      component.symbol = 'ETH';
      component.status = 'confirmed';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-transaction-item');
    const amountElement = component.locator('.cr-transaction-item__amount');
    await expect(amountElement).toContainText('1.5');
    await expect(amountElement).toContainText('ETH');
  });
});
