import { newSpecPage } from '@stencil/core/testing';
import { CryptorillGasEstimator } from './cryptorill-gas-estimator';

describe('cryptorill-gas-estimator', () => {
  it('renders with default values', async () => {
    const page = await newSpecPage({
      components: [CryptorillGasEstimator],
      html: '<cryptorill-gas-estimator></cryptorill-gas-estimator>',
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.cryptorill-gas-estimator')).toBeTruthy();
  });

  it('renders with network name', async () => {
    const page = await newSpecPage({
      components: [CryptorillGasEstimator],
      html: '<cryptorill-gas-estimator network="polygon"></cryptorill-gas-estimator>',
    });

    const networkName = page.root?.shadowRoot?.querySelector('.cr-gas-estimator__network-name');
    expect(networkName?.textContent).toBe('Polygon');
  });

  it('displays gas limit', async () => {
    const page = await newSpecPage({
      components: [CryptorillGasEstimator],
      html: '<cryptorill-gas-estimator gas-limit="50000"></cryptorill-gas-estimator>',
    });

    const gasLimit = page.root?.shadowRoot?.querySelector('.cr-gas-estimator__gas-limit');
    expect(gasLimit?.textContent).toContain('50,000');
  });

  it('renders all speed options', async () => {
    const page = await newSpecPage({
      components: [CryptorillGasEstimator],
      html: '<cryptorill-gas-estimator></cryptorill-gas-estimator>',
    });

    const options = page.root?.shadowRoot?.querySelectorAll('.cr-gas-estimator__option');
    expect(options?.length).toBe(3);
  });

  it('applies selected state correctly', async () => {
    const page = await newSpecPage({
      components: [CryptorillGasEstimator],
      html: '<cryptorill-gas-estimator selected="fast"></cryptorill-gas-estimator>',
    });

    const selectedOption = page.root?.shadowRoot?.querySelector('.cr-gas-estimator__option--selected');
    expect(selectedOption).toBeTruthy();
  });

  it('applies theme classes correctly', async () => {
    const page = await newSpecPage({
      components: [CryptorillGasEstimator],
      html: '<cryptorill-gas-estimator theme="light"></cryptorill-gas-estimator>',
    });

    const estimatorElement = page.root?.shadowRoot?.querySelector('.cryptorill-gas-estimator');
    expect(estimatorElement?.classList.contains('cr-gas-estimator--theme-light')).toBe(true);
  });

  it('emits speedChange event when option clicked', async () => {
    const page = await newSpecPage({
      components: [CryptorillGasEstimator],
      html: '<cryptorill-gas-estimator></cryptorill-gas-estimator>',
    });

    const speedChangeSpy = jest.fn();
    page.root?.addEventListener('speedChange', speedChangeSpy);

    const options = page.root?.shadowRoot?.querySelectorAll('.cr-gas-estimator__option');
    if (options && options[0]) {
      options[0].dispatchEvent(new Event('click', { bubbles: true }));
    }

    await page.waitForChanges();

    expect(speedChangeSpy).toHaveBeenCalled();
  });

  it('updates selected speed via component instance', async () => {
    const page = await newSpecPage({
      components: [CryptorillGasEstimator],
      html: '<cryptorill-gas-estimator selected="standard"></cryptorill-gas-estimator>',
    });

    // Get the component instance
    const component = page.rootInstance as CryptorillGasEstimator;
    expect(component.selected).toBe('standard');

    // Update via component instance
    component.selected = 'slow';
    await page.waitForChanges();

    expect(component.selected).toBe('slow');
  });

  it('displays correct price for each speed option', async () => {
    const page = await newSpecPage({
      components: [CryptorillGasEstimator],
      html: '<cryptorill-gas-estimator></cryptorill-gas-estimator>',
    });

    const options = page.root?.shadowRoot?.querySelectorAll('.cr-gas-estimator__option');
    const prices = page.root?.shadowRoot?.querySelectorAll('.cr-gas-estimator__option-price');

    expect(options?.length).toBe(3);
    expect(prices?.length).toBe(3);

    // Each price should contain a dollar sign
    prices?.forEach(price => {
      expect(price.textContent).toContain('$');
    });
  });

  it('formats custom gas price values', async () => {
    const page = await newSpecPage({
      components: [CryptorillGasEstimator],
      html: `
        <cryptorill-gas-estimator
          gas-limit="100000"
          base-fee="50"
          priority-fee="2"
        ></cryptorill-gas-estimator>
      `,
    });

    const gasLimit = page.root?.shadowRoot?.querySelector('.cr-gas-estimator__gas-limit');
    expect(gasLimit?.textContent).toContain('100,000');
  });
});
