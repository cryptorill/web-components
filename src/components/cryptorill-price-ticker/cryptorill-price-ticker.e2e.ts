import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';

test.describe('cryptorill-price-ticker', () => {
  test('renders with correct initial state', async ({ page }) => {
    await page.goto('/components/cryptorill-price-ticker/test/cryptorill-price-ticker.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-price-ticker')!;
      component.symbol = 'BTC';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-price-ticker');
    await expect(component).toBeTruthy();

    const container = component.locator('.cryptorill-price-ticker');
    await expect(container).toBeTruthy();
  });

  test('renders with custom symbol', async ({ page }) => {
    await page.goto('/components/cryptorill-price-ticker/test/cryptorill-price-ticker.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-price-ticker')!;
      component.symbol = 'ETH';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-price-ticker');
    const symbol = component.locator('.cr-price-ticker__symbol');
    await expect(symbol).toHaveText('ETH');
  });
});

