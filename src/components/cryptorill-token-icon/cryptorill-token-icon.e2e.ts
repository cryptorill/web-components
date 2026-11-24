import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';

test.describe('cryptorill-token-icon', () => {
  test('renders with default values', async ({ page }) => {
    await page.goto('/components/cryptorill-token-icon/test/cryptorill-token-icon.e2e.html');

    const component = page.locator('cryptorill-token-icon');
    await expect(component).toBeTruthy();

    const container = component.locator('.cryptorill-token-icon');
    await expect(container).toBeTruthy();
  });

  test('renders with symbol and displays initials', async ({ page }) => {
    await page.goto('/components/cryptorill-token-icon/test/cryptorill-token-icon.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-token-icon')!;
      component.symbol = 'BTC';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-token-icon');
    const initialsElement = component.locator('.cr-token-icon__initials');
    await expect(initialsElement).toHaveText('BT');
  });

  test('displays custom fallback text', async ({ page }) => {
    await page.goto('/components/cryptorill-token-icon/test/cryptorill-token-icon.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-token-icon')!;
      component.symbol = 'BTC';
      component.fallback = 'XBT';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-token-icon');
    const initialsElement = component.locator('.cr-token-icon__initials');
    await expect(initialsElement).toHaveText('XBT');
  });

  test('applies size classes correctly - sm', async ({ page }) => {
    await page.goto('/components/cryptorill-token-icon/test/cryptorill-token-icon.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-token-icon')!;
      component.symbol = 'BTC';
      component.size = 'sm';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-token-icon');
    const iconElement = component.locator('.cryptorill-token-icon');
    await expect(iconElement).toHaveClass(/cr-token-icon--sm/);
  });

  test('applies size classes correctly - md', async ({ page }) => {
    await page.goto('/components/cryptorill-token-icon/test/cryptorill-token-icon.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-token-icon')!;
      component.symbol = 'BTC';
      component.size = 'md';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-token-icon');
    const iconElement = component.locator('.cryptorill-token-icon');
    await expect(iconElement).toHaveClass(/cr-token-icon--md/);
  });

  test('applies size classes correctly - lg', async ({ page }) => {
    await page.goto('/components/cryptorill-token-icon/test/cryptorill-token-icon.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-token-icon')!;
      component.symbol = 'BTC';
      component.size = 'lg';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-token-icon');
    const iconElement = component.locator('.cryptorill-token-icon');
    await expect(iconElement).toHaveClass(/cr-token-icon--lg/);
  });
});

