import { expect } from '@playwright/test';
import { test } from '@stencil/playwright';

test.describe('cryptorill-amount-input', () => {
  test('renders with default values', async ({ page }) => {
    await page.goto('/components/cryptorill-amount-input/test/cryptorill-amount-input.e2e.html');

    const component = page.locator('cryptorill-amount-input');
    expect(component).toBeTruthy();

    const container = component.locator('.cryptorill-amount-input');
    expect(container).toBeTruthy();
  });

  test('renders with symbol', async ({ page }) => {
    await page.goto('/components/cryptorill-amount-input/test/cryptorill-amount-input.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-amount-input')!;
      component.symbol = 'ETH';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-amount-input');
    const symbol = component.locator('.cr-amount-input__symbol');
    await expect(symbol).toHaveText('ETH');
  });

  test('shows max button when available balance is provided', async ({ page }) => {
    await page.goto('/components/cryptorill-amount-input/test/cryptorill-amount-input.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-amount-input')!;
      component.availableBalance = 10.5;
      component.symbol = 'BTC';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-amount-input');
    const maxBtn = component.locator('.cr-amount-input__max-btn');
    await expect(maxBtn).toBeTruthy();

    const balance = component.locator('.cr-amount-input__balance');
    await expect(balance).toContainText('10.5');
  });

  test('applies theme classes correctly', async ({ page }) => {
    await page.goto('/components/cryptorill-amount-input/test/cryptorill-amount-input.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-amount-input')!;
      component.theme = 'light';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-amount-input');
    const inputElement = component.locator('.cryptorill-amount-input');
    await expect(inputElement).toHaveClass(/cr-amount-input--theme-light/);
  });

  test('shows disabled state', async ({ page }) => {
    await page.goto('/components/cryptorill-amount-input/test/cryptorill-amount-input.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-amount-input')!;
      component.disabled = true;
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-amount-input');
    const inputElement = component.locator('.cryptorill-amount-input');
    await expect(inputElement).toHaveClass(/cr-amount-input--disabled/);

    const input = component.locator('.cr-amount-input__field');
    await expect(input).toBeDisabled();
  });

  test('emits valueChange event on input', async ({ page }) => {
    await page.goto('/components/cryptorill-amount-input/test/cryptorill-amount-input.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-amount-input')!;
      component.addEventListener('valueChange', () => {
        (window as unknown as { eventFired: boolean }).eventFired = true;
      });
    });

    const component = page.locator('cryptorill-amount-input');
    const input = component.locator('.cr-amount-input__field');

    await input.fill('1.5');

    await page.waitForTimeout(100);

    const fired = await page.evaluate(() => (window as unknown as { eventFired: boolean }).eventFired);
    expect(fired).toBe(true);
  });

  test('displays custom label', async ({ page }) => {
    await page.goto('/components/cryptorill-amount-input/test/cryptorill-amount-input.e2e.html');

    await page.evaluate(() => {
      const component = document.querySelector('cryptorill-amount-input')!;
      component.label = 'Send Amount';
    });

    await page.waitForTimeout(100);

    const component = page.locator('cryptorill-amount-input');
    const label = component.locator('.cr-amount-input__label');
    await expect(label).toContainText('Send Amount');
  });
});
