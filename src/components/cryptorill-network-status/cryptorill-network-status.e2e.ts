import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';

test.describe('cryptorill-network-status', () => {
  test('renders with default values', async ({ page }) => {
    await page.goto('/components/cryptorill-network-status/test/cryptorill-network-status.e2e.html');

    const component = page.locator('cryptorill-network-status');
    await expect(component).toBeTruthy();

    const container = component.locator('.cryptorill-network-status');
    await expect(container).toBeTruthy();
  });

  test('renders with network name', async ({ page }) => {
    await page.goto('/components/cryptorill-network-status/test/cryptorill-network-status.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-network-status')!;
      component.network = 'Polygon';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-network-status');
    const networkName = component.locator('.cr-network-status__network-name');
    await expect(networkName).toHaveText('Polygon');
  });

  test('displays correct status indicator', async ({ page }) => {
    await page.goto('/components/cryptorill-network-status/test/cryptorill-network-status.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-network-status')!;
      component.status = 'offline';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-network-status');
    const indicator = component.locator('.cr-network-status__indicator');
    await expect(indicator).toHaveClass(/cr-network-status__indicator--offline/);

    const statusLabel = component.locator('.cr-network-status__indicator-label');
    await expect(statusLabel).toHaveText('Offline');
  });

  test('displays block height when provided', async ({ page }) => {
    await page.goto('/components/cryptorill-network-status/test/cryptorill-network-status.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-network-status')!;
      component.blockHeight = 12345678;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-network-status');
    const metrics = component.locator('.cr-network-status__metric-value');
    const firstMetric = await metrics.first();
    await expect(firstMetric).toContainText('12,345,678');
  });

  test('applies theme classes correctly', async ({ page }) => {
    await page.goto('/components/cryptorill-network-status/test/cryptorill-network-status.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-network-status')!;
      component.theme = 'light';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-network-status');
    const statusElement = component.locator('.cryptorill-network-status');
    await expect(statusElement).toHaveClass(/cr-network-status--theme-light/);
  });
});
