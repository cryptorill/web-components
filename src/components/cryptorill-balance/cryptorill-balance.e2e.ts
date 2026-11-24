import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';

test.describe('cryptorill-balance', () => {
  test('renders with default values', async ({ page }) => {
    await page.goto('/components/cryptorill-balance/test/cryptorill-balance.e2e.html');

    const component = page.locator('cryptorill-balance');
    await expect(component).toBeTruthy();

    const container = component.locator('.cryptorill-balance');
    await expect(container).toBeTruthy();
  });

  test('renders with balance amount and symbol', async ({ page }) => {
    await page.goto('/components/cryptorill-balance/test/cryptorill-balance.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-balance')!;
      component.amount = 1.5;
      component.symbol = 'ETH';
      component.decimals = 4;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-balance');
    const amountElement = component.locator('.cr-balance__amount');
    await expect(amountElement).toContainText('1.5');
    await expect(amountElement).toContainText('ETH');
  });

  test('shows fiat equivalent when showFiat is true', async ({ page }) => {
    await page.goto('/components/cryptorill-balance/test/cryptorill-balance.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-balance')!;
      component.amount = 1;
      component.symbol = 'BTC';
      component.showFiat = true;
      component.fiatValue = 45000;
      component.fiatCurrency = 'USD';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-balance');
    const fiatElement = component.locator('.cr-balance__fiat');
    await expect(fiatElement).toBeTruthy();
    await expect(fiatElement).toContainText('$');
  });

  test('applies size classes correctly', async ({ page }) => {
    await page.goto('/components/cryptorill-balance/test/cryptorill-balance.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-balance')!;
      component.size = 'large';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-balance');
    const balanceElement = component.locator('.cryptorill-balance');
    await expect(balanceElement).toHaveClass(/cr-balance--size-large/);
  });

  test('hides symbol when showSymbol is false', async ({ page }) => {
    await page.goto('/components/cryptorill-balance/test/cryptorill-balance.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-balance')!;
      component.amount = 100;
      component.symbol = 'ETH';
      component.showSymbol = false;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-balance');
    const amountElement = component.locator('.cr-balance__amount');
    await expect(amountElement).not.toContainText('ETH');
  });
});
