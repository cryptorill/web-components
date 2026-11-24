import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';

test.describe('cryptorill-gas-estimator', () => {
  test('renders with default values', async ({ page }) => {
    await page.goto('/components/cryptorill-gas-estimator/test/cryptorill-gas-estimator.e2e.html');

    const component = page.locator('cryptorill-gas-estimator');
    await expect(component).toBeTruthy();

    const container = component.locator('.cryptorill-gas-estimator');
    await expect(container).toBeTruthy();
  });

  test('renders with network name', async ({ page }) => {
    await page.goto('/components/cryptorill-gas-estimator/test/cryptorill-gas-estimator.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-gas-estimator')!;
      component.network = 'polygon';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-gas-estimator');
    const networkName = component.locator('.cr-gas-estimator__network-name');
    await expect(networkName).toHaveText('Polygon');
  });

  test('displays gas limit', async ({ page }) => {
    await page.goto('/components/cryptorill-gas-estimator/test/cryptorill-gas-estimator.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-gas-estimator')!;
      component.gasLimit = 50000;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-gas-estimator');
    const gasLimit = component.locator('.cr-gas-estimator__gas-limit');
    await expect(gasLimit).toContainText('50,000');
  });

  test('renders all speed options', async ({ page }) => {
    await page.goto('/components/cryptorill-gas-estimator/test/cryptorill-gas-estimator.e2e.html');

    const component = page.locator('cryptorill-gas-estimator');
    const options = component.locator('.cr-gas-estimator__option');
    await expect(options).toHaveCount(3);
  });

  test('applies selected state correctly', async ({ page }) => {
    await page.goto('/components/cryptorill-gas-estimator/test/cryptorill-gas-estimator.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-gas-estimator')!;
      component.selected = 'fast';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-gas-estimator');
    const selectedOption = component.locator('.cr-gas-estimator__option--selected');
    await expect(selectedOption).toBeTruthy();
  });
});
