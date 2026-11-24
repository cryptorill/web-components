import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';

test.describe('cryptorill-price', () => {
  test('renders with default values', async ({ page }) => {
    await page.goto('/components/cryptorill-price/test/cryptorill-price.e2e.html');

    const component = page.locator('cryptorill-price');
    await expect(component).toBeTruthy();

    const container = component.locator('.cryptorill-price');
    await expect(container).toBeTruthy();
  });

  test('renders price value correctly', async ({ page }) => {
    await page.goto('/components/cryptorill-price/test/cryptorill-price.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-price')!;
      component.value = '45000.00';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-price');
    const container = component.locator('.cryptorill-price');
    await expect(container).toContainText('$');
    await expect(container).toContainText('45,000.00');
  });

  test('renders with default currency symbol', async ({ page }) => {
    await page.goto('/components/cryptorill-price/test/cryptorill-price.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-price')!;
      component.value = '100';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-price');
    const currencyElement = component.locator('.cr-price__currency');
    await expect(currencyElement).toHaveText('$');
  });

  test('renders with custom currency symbol', async ({ page }) => {
    await page.goto('/components/cryptorill-price/test/cryptorill-price.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-price')!;
      component.value = '100';
      component.currency = '€';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-price');
    const currencyElement = component.locator('.cr-price__currency');
    await expect(currencyElement).toHaveText('€');
  });

  test('applies size classes correctly - small', async ({ page }) => {
    await page.goto('/components/cryptorill-price/test/cryptorill-price.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-price')!;
      component.value = '100';
      component.size = 'small';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-price');
    const priceElement = component.locator('.cryptorill-price');
    await expect(priceElement).toHaveClass(/cr-price--small/);
  });

  test('applies size classes correctly - medium', async ({ page }) => {
    await page.goto('/components/cryptorill-price/test/cryptorill-price.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-price')!;
      component.value = '100';
      component.size = 'medium';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-price');
    const priceElement = component.locator('.cryptorill-price');
    await expect(priceElement).toHaveClass(/cr-price--medium/);
  });

  test('applies size classes correctly - large', async ({ page }) => {
    await page.goto('/components/cryptorill-price/test/cryptorill-price.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-price')!;
      component.value = '100';
      component.size = 'large';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-price');
    const priceElement = component.locator('.cryptorill-price');
    await expect(priceElement).toHaveClass(/cr-price--large/);
  });

  test('formats large prices correctly', async ({ page }) => {
    await page.goto('/components/cryptorill-price/test/cryptorill-price.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-price')!;
      component.value = '1234567.89';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-price');
    const valueElement = component.locator('.cr-price__value');
    await expect(valueElement).toContainText('1,234,567.89');
  });

  test('formats small prices with more decimal places', async ({ page }) => {
    await page.goto('/components/cryptorill-price/test/cryptorill-price.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-price')!;
      component.value = '0.001234';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-price');
    const valueElement = component.locator('.cr-price__value');
    await expect(valueElement).toContainText('0.001234');
  });
});

