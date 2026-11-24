import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';

test.describe('cryptorill-volume-bar', () => {
  test('renders with default values', async ({ page }) => {
    await page.goto('/components/cryptorill-volume-bar/test/cryptorill-volume-bar.e2e.html');

    const component = page.locator('cryptorill-volume-bar');
    await expect(component).toBeTruthy();

    const container = component.locator('.cryptorill-volume-bar');
    await expect(container).toBeTruthy();
  });

  test('renders volume bar with correct percentage', async ({ page }) => {
    await page.goto('/components/cryptorill-volume-bar/test/cryptorill-volume-bar.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-volume-bar')!;
      component.volume = 500;
      component.maxVolume = 1000;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-volume-bar');
    const fillElement = component.locator('.cr-volume-bar__fill');
    await expect(fillElement).toBeTruthy();
    await expect(fillElement).toHaveAttribute('style', 'width: 50%;');
  });

  test('caps percentage at 100%', async ({ page }) => {
    await page.goto('/components/cryptorill-volume-bar/test/cryptorill-volume-bar.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-volume-bar')!;
      component.volume = 1500;
      component.maxVolume = 1000;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-volume-bar');
    const fillElement = component.locator('.cr-volume-bar__fill');
    await expect(fillElement).toHaveAttribute('style', 'width: 100%;');
  });

  test('shows 0% when volume is 0', async ({ page }) => {
    await page.goto('/components/cryptorill-volume-bar/test/cryptorill-volume-bar.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-volume-bar')!;
      component.volume = 0;
      component.maxVolume = 1000;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-volume-bar');
    const fillElement = component.locator('.cr-volume-bar__fill');
    await expect(fillElement).toHaveAttribute('style', 'width: 0%;');
  });

  test('displays label when provided', async ({ page }) => {
    await page.goto('/components/cryptorill-volume-bar/test/cryptorill-volume-bar.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-volume-bar')!;
      component.volume = 500;
      component.maxVolume = 1000;
      component.label = '24h Volume';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-volume-bar');
    const labelElement = component.locator('.cr-volume-bar__label');
    await expect(labelElement).toHaveText('24h Volume');
  });
});
