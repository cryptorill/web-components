import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';

test.describe('cryptorill-market-card', () => {
  test('renders with default values', async ({ page }) => {
    await page.goto('/components/cryptorill-market-card/test/cryptorill-market-card.e2e.html');

    const component = page.locator('cryptorill-market-card');
    await expect(component).toBeTruthy();

    const container = component.locator('.cryptorill-market-card');
    await expect(container).toBeTruthy();
  });

  test('renders with symbol and name', async ({ page }) => {
    await page.goto('/components/cryptorill-market-card/test/cryptorill-market-card.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-market-card')!;
      component.symbol = 'BTC';
      component.name = 'Bitcoin';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-market-card');
    const nameElement = component.locator('.cr-market-card__name');
    await expect(nameElement).toHaveText('Bitcoin');

    const symbolElement = component.locator('.cr-market-card__symbol');
    await expect(symbolElement).toHaveText('BTC');
  });

  test('uses symbol as fallback when name is not provided', async ({ page }) => {
    await page.goto('/components/cryptorill-market-card/test/cryptorill-market-card.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-market-card')!;
      component.symbol = 'ETH';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-market-card');
    const nameElement = component.locator('.cr-market-card__name');
    await expect(nameElement).toHaveText('ETH');
  });
});

