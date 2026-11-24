import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';

test.describe('cryptorill-price-alert', () => {
  test('renders with default values', async ({ page }) => {
    await page.goto('/components/cryptorill-price-alert/test/cryptorill-price-alert.e2e.html');

    const component = page.locator('cryptorill-price-alert');
    await expect(component).toBeTruthy();

    const container = component.locator('.cryptorill-price-alert');
    await expect(container).toBeTruthy();
  });

  test('renders with symbol and prices', async ({ page }) => {
    await page.goto('/components/cryptorill-price-alert/test/cryptorill-price-alert.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-price-alert')!;
      component.symbol = 'BTC';
      component.currentPrice = 45000;
      component.targetPrice = 50000;
      component.condition = 'above';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-price-alert');
    const symbol = component.locator('.cr-price-alert__symbol');
    await expect(symbol).toHaveText('BTC');

    const targetPrice = component.locator('.cr-price-alert__target-price');
    await expect(targetPrice).toContainText('$50,000');
  });

  test('shows active state when isActive is true', async ({ page }) => {
    await page.goto('/components/cryptorill-price-alert/test/cryptorill-price-alert.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-price-alert')!;
      component.isActive = true;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-price-alert');
    const alertElement = component.locator('.cryptorill-price-alert');
    await expect(alertElement).toHaveClass(/cr-price-alert--active/);
  });

  test('applies theme classes correctly', async ({ page }) => {
    await page.goto('/components/cryptorill-price-alert/test/cryptorill-price-alert.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-price-alert')!;
      component.theme = 'light';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-price-alert');
    const alertElement = component.locator('.cryptorill-price-alert');
    await expect(alertElement).toHaveClass(/cr-price-alert--theme-light/);
  });
});
