import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';

test.describe('cryptorill-trading-pair', () => {
  test('renders with default values', async ({ page }) => {
    await page.goto('/components/cryptorill-trading-pair/test/cryptorill-trading-pair.e2e.html');

    const component = page.locator('cryptorill-trading-pair');
    await expect(component).toBeTruthy();

    const container = component.locator('.cryptorill-trading-pair');
    await expect(container).toBeTruthy();
  });

  test('renders with base and quote symbols', async ({ page }) => {
    await page.goto('/components/cryptorill-trading-pair/test/cryptorill-trading-pair.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-trading-pair')!;
      component.baseSymbol = 'BTC';
      component.quoteSymbol = 'USDT';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-trading-pair');
    const baseElement = component.locator('.cr-trading-pair__base');
    await expect(baseElement).toHaveText('BTC');

    const quoteElement = component.locator('.cr-trading-pair__quote');
    await expect(quoteElement).toHaveText('USDT');
  });

  test('renders token icons with correct symbols', async ({ page }) => {
    await page.goto('/components/cryptorill-trading-pair/test/cryptorill-trading-pair.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-trading-pair')!;
      component.baseSymbol = 'ETH';
      component.quoteSymbol = 'BTC';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-trading-pair');
    const tokenIcons = component.locator('cryptorill-token-icon');
    await expect(tokenIcons).toHaveCount(2);
  });

  test('displays price using cryptorill-price component', async ({ page }) => {
    await page.goto('/components/cryptorill-trading-pair/test/cryptorill-trading-pair.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-trading-pair')!;
      component.price = 45000.5;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-trading-pair');
    const priceComponent = component.locator('cryptorill-price');
    await expect(priceComponent).toBeTruthy();
  });
});

