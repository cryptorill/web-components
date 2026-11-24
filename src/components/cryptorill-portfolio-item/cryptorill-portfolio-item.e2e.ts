import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';

test.describe('cryptorill-portfolio-item', () => {
  test('renders with default values', async ({ page }) => {
    await page.goto('/components/cryptorill-portfolio-item/test/cryptorill-portfolio-item.e2e.html');

    const component = page.locator('cryptorill-portfolio-item');
    await expect(component).toBeTruthy();

    const container = component.locator('.cryptorill-portfolio-item');
    await expect(container).toBeTruthy();
  });

  test('renders with portfolio data', async ({ page }) => {
    await page.goto('/components/cryptorill-portfolio-item/test/cryptorill-portfolio-item.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-portfolio-item')!;
      component.symbol = 'BTC';
      component.name = 'Bitcoin';
      component.balance = 0.5;
      component.price = 45000;
      component.avgBuyPrice = 40000;
      component.allocation = 25;
      component.pnl = 12.5;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-portfolio-item');
    const symbolElement = component.locator('.cr-portfolio-item__symbol');
    await expect(symbolElement).toHaveText('BTC');

    const nameElement = component.locator('.cr-portfolio-item__name');
    await expect(nameElement).toHaveText('Bitcoin');
  });

  test('calculates total value from balance and price', async ({ page }) => {
    await page.goto('/components/cryptorill-portfolio-item/test/cryptorill-portfolio-item.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-portfolio-item')!;
      component.balance = 2;
      component.price = 3000;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-portfolio-item');
    const valueElement = component.locator('.cr-portfolio-item__value');
    await expect(valueElement).toContainText('6,000');
  });

  test('applies size classes correctly', async ({ page }) => {
    await page.goto('/components/cryptorill-portfolio-item/test/cryptorill-portfolio-item.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-portfolio-item')!;
      component.size = 'compact';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-portfolio-item');
    const itemElement = component.locator('.cryptorill-portfolio-item');
    await expect(itemElement).toHaveClass(/cr-portfolio-item--size-compact/);
  });
});
