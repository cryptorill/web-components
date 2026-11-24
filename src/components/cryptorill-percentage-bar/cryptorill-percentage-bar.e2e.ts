import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';

test.describe('cryptorill-percentage-bar', () => {
  test('renders with default values', async ({ page }) => {
    await page.goto('/components/cryptorill-percentage-bar/test/cryptorill-percentage-bar.e2e.html');

    const component = page.locator('cryptorill-percentage-bar');
    await expect(component).toBeTruthy();

    const container = component.locator('.cryptorill-percentage-bar');
    await expect(container).toBeTruthy();
  });

  test('renders percentage bar with correct percentage', async ({ page }) => {
    await page.goto('/components/cryptorill-percentage-bar/test/cryptorill-percentage-bar.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-percentage-bar')!;
      component.value = 50;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-percentage-bar');
    const fillElement = component.locator('.cr-percentage-bar__fill');
    await expect(fillElement).toBeTruthy();
    await expect(fillElement).toHaveAttribute('style', /width: 50%/);
  });

  test('calculates percentage correctly with custom maxValue', async ({ page }) => {
    await page.goto('/components/cryptorill-percentage-bar/test/cryptorill-percentage-bar.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-percentage-bar')!;
      component.value = 25;
      component.maxValue = 200;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-percentage-bar');
    const fillElement = component.locator('.cr-percentage-bar__fill');
    await expect(fillElement).toHaveAttribute('style', /width: 12.5%/);
  });

  test('caps percentage at 100%', async ({ page }) => {
    await page.goto('/components/cryptorill-percentage-bar/test/cryptorill-percentage-bar.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-percentage-bar')!;
      component.value = 150;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-percentage-bar');
    const fillElement = component.locator('.cr-percentage-bar__fill');
    await expect(fillElement).toHaveAttribute('style', /width: 100%/);
  });

  test('shows 0% when value is 0', async ({ page }) => {
    await page.goto('/components/cryptorill-percentage-bar/test/cryptorill-percentage-bar.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-percentage-bar')!;
      component.value = 0;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-percentage-bar');
    const fillElement = component.locator('.cr-percentage-bar__fill');
    await expect(fillElement).toHaveAttribute('style', /width: 0%/);
  });

  test('displays label when provided', async ({ page }) => {
    await page.goto('/components/cryptorill-percentage-bar/test/cryptorill-percentage-bar.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-percentage-bar')!;
      component.value = 50;
      component.label = 'Market Dominance';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-percentage-bar');
    const labelElement = component.locator('.cr-percentage-bar__label');
    await expect(labelElement).toHaveText('Market Dominance');
  });
});
