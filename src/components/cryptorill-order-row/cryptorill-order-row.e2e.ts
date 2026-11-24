import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';

test.describe('cryptorill-order-row', () => {
  test('renders with default values', async ({ page }) => {
    await page.goto('/components/cryptorill-order-row/test/cryptorill-order-row.e2e.html');

    const component = page.locator('cryptorill-order-row');
    await expect(component).toBeTruthy();

    const container = component.locator('.cryptorill-order-row');
    await expect(container).toBeTruthy();
  });

  test('renders bid order correctly', async ({ page }) => {
    await page.goto('/components/cryptorill-order-row/test/cryptorill-order-row.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-order-row')!;
      component.type = 'bid';
      component.price = 45000;
      component.amount = 1.5;
      component.total = 67500;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-order-row');
    const rowElement = component.locator('.cryptorill-order-row');
    await expect(rowElement).toHaveClass(/cr-order-row--bid/);
  });

  test('renders ask order correctly', async ({ page }) => {
    await page.goto('/components/cryptorill-order-row/test/cryptorill-order-row.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-order-row')!;
      component.type = 'ask';
      component.price = 45100;
      component.amount = 0.8;
      component.total = 36080;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-order-row');
    const rowElement = component.locator('.cryptorill-order-row');
    await expect(rowElement).toHaveClass(/cr-order-row--ask/);
  });

  test('renders depth bar with correct width', async ({ page }) => {
    await page.goto('/components/cryptorill-order-row/test/cryptorill-order-row.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-order-row')!;
      component.depthPercent = 50;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-order-row');
    const depthBar = component.locator('.cr-order-row__depth-bar');
    await expect(depthBar).toBeTruthy();
  });
});
