import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';

test.describe('cryptorill-sparkline', () => {
  test('renders with default values', async ({ page }) => {
    await page.goto('/components/cryptorill-sparkline/test/cryptorill-sparkline.e2e.html');

    const component = page.locator('cryptorill-sparkline');
    await expect(component).toBeTruthy();

    const container = component.locator('.cryptorill-sparkline');
    await expect(container).toBeTruthy();
  });

  test('renders canvas element', async ({ page }) => {
    await page.goto('/components/cryptorill-sparkline/test/cryptorill-sparkline.e2e.html');

    const component = page.locator('cryptorill-sparkline');
    const canvas = component.locator('canvas');
    await expect(canvas).toBeTruthy();
  });

  test('sets correct canvas dimensions', async ({ page }) => {
    await page.goto('/components/cryptorill-sparkline/test/cryptorill-sparkline.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-sparkline')!;
      component.width = 400;
      component.height = 100;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-sparkline');
    const canvas = component.locator('canvas');
    await expect(canvas).toHaveAttribute('width', '400');
    await expect(canvas).toHaveAttribute('height', '100');
  });

  test('uses default dimensions when not specified', async ({ page }) => {
    await page.goto('/components/cryptorill-sparkline/test/cryptorill-sparkline.e2e.html');

    const component = page.locator('cryptorill-sparkline');
    const canvas = component.locator('canvas');
    await expect(canvas).toHaveAttribute('width', '300');
    await expect(canvas).toHaveAttribute('height', '60');
  });

  test('renders with provided data', async ({ page }) => {
    await page.goto('/components/cryptorill-sparkline/test/cryptorill-sparkline.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-sparkline')!;
      component.data = '[10, 20, 30, 40, 50]';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-sparkline');
    const canvas = component.locator('canvas');
    await expect(canvas).toBeTruthy();
  });
});
