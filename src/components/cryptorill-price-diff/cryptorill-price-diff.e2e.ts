import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';

test.describe('cryptorill-price-diff', () => {
  test('renders with default values', async ({ page }) => {
    await page.goto('/components/cryptorill-price-diff/test/cryptorill-price-diff.e2e.html');

    const component = page.locator('cryptorill-price-diff');
    await expect(component).toBeTruthy();

    const container = component.locator('.cryptorill-price-diff');
    await expect(container).toBeTruthy();
  });

  test('displays positive diff with up arrow', async ({ page }) => {
    await page.goto('/components/cryptorill-price-diff/test/cryptorill-price-diff.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-price-diff')!;
      component.value = 5.5;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-price-diff');
    const arrowElement = component.locator('.cr-price-diff__arrow');
    await expect(arrowElement).toHaveText('▲');

    const percentageElement = component.locator('.cr-price-diff__percentage');
    await expect(percentageElement).toHaveText('5.50%');
  });

  test('displays negative diff with down arrow', async ({ page }) => {
    await page.goto('/components/cryptorill-price-diff/test/cryptorill-price-diff.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-price-diff')!;
      component.value = -3.25;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-price-diff');
    const arrowElement = component.locator('.cr-price-diff__arrow');
    await expect(arrowElement).toHaveText('▼');

    const percentageElement = component.locator('.cr-price-diff__percentage');
    await expect(percentageElement).toHaveText('3.25%');
  });

  test('applies positive class for positive values', async ({ page }) => {
    await page.goto('/components/cryptorill-price-diff/test/cryptorill-price-diff.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-price-diff')!;
      component.value = 10;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-price-diff');
    const diffElement = component.locator('.cryptorill-price-diff');
    await expect(diffElement).toHaveClass(/cr-price-diff--positive/);
    await expect(diffElement).not.toHaveClass(/cr-price-diff--negative/);
  });

  test('applies negative class for negative values', async ({ page }) => {
    await page.goto('/components/cryptorill-price-diff/test/cryptorill-price-diff.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-price-diff')!;
      component.value = -10;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-price-diff');
    const diffElement = component.locator('.cryptorill-price-diff');
    await expect(diffElement).toHaveClass(/cr-price-diff--negative/);
    await expect(diffElement).not.toHaveClass(/cr-price-diff--positive/);
  });
});
