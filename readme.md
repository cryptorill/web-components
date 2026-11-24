# @cryptorill/web-components

[![CI](https://github.com/cryptorill/web-components/actions/workflows/ci.yml/badge.svg)](https://github.com/cryptorill/web-components/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@cryptorill/web-components.svg)](https://www.npmjs.com/package/@cryptorill/web-components)
[![license](https://img.shields.io/badge/license-see%20LICENSE-blue.svg)](https://github.com/cryptorill/web-components/blob/main/LICENSE)

Framework-agnostic Web Components for cryptocurrency prices, markets, portfolios, and transactions. Built with [Stencil](https://stenciljs.com), the package ships standards-based custom elements that work in plain HTML, React, Vue, Angular, Svelte, or any other framework.

## Highlights

- **Standards-based** — custom elements with Shadow DOM and no framework runtime requirement.
- **20 ready-made components** — from atomic price displays to composite market cards, order books, and transaction lists.
- **Three loading strategies** — lazy loader, all-components registration, or side-effect-free tree-shakeable imports.
- **Themeable** — `dark`, `light`, and `gradient` variants plus per-component CSS custom properties.
- **Typed** — TypeScript declarations and JSX types are included.
- **Framework wrappers** — React, Angular, and Vue proxies can be generated with the Stencil output targets used by this repository.

## Components

| Component                     | Description                                                                 |
| ----------------------------- | --------------------------------------------------------------------------- |
| `cryptorill-amount-input`     | Crypto amount input with formatting, validation, and a max button.          |
| `cryptorill-balance`          | Wallet balance with multiple currency formats and optional fiat equivalent. |
| `cryptorill-gas-estimator`    | Gas fee estimates for slow, standard, and fast transaction speeds.          |
| `cryptorill-market-card`      | Composite market card with price, change, range, volume, and market cap.    |
| `cryptorill-network-status`   | Blockchain network status with health indicators.                           |
| `cryptorill-order-book`       | Two-column order book with asks and bids.                                   |
| `cryptorill-order-row`        | Single order book row with price, amount, total, and depth bar.             |
| `cryptorill-percentage-bar`   | Horizontal bar for percentage allocation or dominance.                      |
| `cryptorill-portfolio-item`   | Portfolio position with holdings, value, P&L, and allocation.               |
| `cryptorill-price`            | Price display with currency symbol and flash animation on changes.          |
| `cryptorill-price-alert`      | Price alert configuration and status display.                               |
| `cryptorill-price-diff`       | Price change percentage with arrow and color coding.                        |
| `cryptorill-price-ticker`     | Composite ticker with price, change, and sparkline for a single asset.      |
| `cryptorill-sparkline`        | Canvas-based sparkline chart for historical price data.                     |
| `cryptorill-token-icon`       | Token icon with a generated-initials fallback.                              |
| `cryptorill-trade-history`    | Recent trades list with time, price, and amount.                            |
| `cryptorill-trading-pair`     | Trading pair with base/quote icons, price, change, and optional spread.     |
| `cryptorill-transaction-item` | Single transaction row with type, status, counterparty, amount, and fee.    |
| `cryptorill-transaction-list` | Transaction list with filtering and status indicators.                      |
| `cryptorill-volume-bar`       | Visual volume indicator with a bar representation.                          |

## Installation

```bash
npm install @cryptorill/web-components
```

```bash
bun add @cryptorill/web-components
```

```bash
pnpm add @cryptorill/web-components
```

```bash
yarn add @cryptorill/web-components
```

The package has no runtime dependencies. You only need a browser with Custom Elements v1 support (all current evergreen browsers).

## Quick start

### Plain HTML / CDN

Load the CDN bundle, which registers every component and lazily downloads component code on demand:

```html
<script type="module" src="https://unpkg.com/@cryptorill/web-components@1"></script>

<cryptorill-price-ticker symbol="BTC" name="Bitcoin" theme="dark"></cryptorill-price-ticker>
```

Pin an exact version in production:

```html
<script type="module" src="https://unpkg.com/@cryptorill/web-components@1.0.0"></script>
```

### Bundlers — register everything

```ts
// Registers all components; individual component code is lazy-loaded.
import '@cryptorill/web-components/register';

// Now use any component in your markup:
// <cryptorill-price value="67432.18" currency="$"></cryptorill-price>
```

### Bundlers — tree-shakeable imports

For ESM consumers the package root is side-effect-free. Import and call only the `defineCustomElement*` functions you need:

```ts
import { defineCustomElementCryptorillPrice, defineCustomElementCryptorillSparkline } from '@cryptorill/web-components';

defineCustomElementCryptorillPrice();
defineCustomElementCryptorillSparkline();
```

This is the recommended approach when bundle size matters: unused components are removed by the bundler.

### Bundlers — per-component auto-registration

Each component also ships as a standalone module that registers itself on import:

```ts
import '@cryptorill/web-components/components/cryptorill-market-card';
```

### Lazy loader

```ts
import { defineCustomElements } from '@cryptorill/web-components/loader';

defineCustomElements();
```

The loader is the smallest entry point and is useful when components are used dynamically or only on some routes.

### Global styles

The loader injects the package stylesheet automatically. With tree-shakeable or per-component imports you can import it explicitly:

```ts
import '@cryptorill/web-components/styles.css';
```

## Usage examples

```html
<!-- Atomic price display -->
<cryptorill-price value="67432.18" currency="$" size="large" theme="dark"></cryptorill-price>

<!-- Price change indicator -->
<cryptorill-price-diff value="-2.41" label="24h"></cryptorill-price-diff>

<!-- Composite market card -->
<cryptorill-market-card symbol="BTC" name="Bitcoin" price="67432.18" change24h="2.41" theme="dark"></cryptorill-market-card>

<!-- Amount input with events -->
<cryptorill-amount-input symbol="ETH" available-balance="2.5" decimals="6"></cryptorill-amount-input>

<script>
  const input = document.querySelector('cryptorill-amount-input');
  input.addEventListener('valueChange', event => console.log('Amount:', event.detail));
  input.addEventListener('validation', event => console.log('Validation:', event.detail));
</script>
```

Component-specific properties, events, and CSS custom properties are documented in each component's generated `readme.md` under [`src/components`](https://github.com/cryptorill/web-components/tree/main/src/components).

## Using with frameworks

### React

React 19 renders custom elements correctly out of the box. For older React versions, use a `ref` to set properties and attach event listeners, or generate typed wrappers with the React output target configured in [`stencil.config.ts`](https://github.com/cryptorill/web-components/blob/main/stencil.config.ts).

### Vue

Tell the Vue compiler that `cryptorill-*` tags are custom elements:

```ts
// vite.config.ts
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('cryptorill-'),
        },
      },
    }),
  ],
});
```

### Angular

Add `CUSTOM_ELEMENTS_SCHEMA` to the module or standalone component that uses the elements:

```ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';

@Component({
  selector: 'app-market',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<cryptorill-price value="67432.18"></cryptorill-price>`,
})
export class MarketComponent {}
```

## Theming

Every component exposes `theme="dark" | "light" | "gradient"`. You can also override the CSS custom properties that a component defines on `:host`:

```css
cryptorill-price {
  --cryptorill-price-positive: #16a34a;
  --cryptorill-price-negative: #dc2626;
  --cryptorill-price-font-mono: 'IBM Plex Mono', monospace;
}

cryptorill-amount-input {
  --cryptorill-amount-input-bg: rgba(15, 23, 42, 0.95);
  --cryptorill-amount-input-border: rgba(148, 163, 184, 0.3);
}
```

CSS custom property names follow the `--cryptorill-<component>-<token>` pattern. They are part of the public API: renaming or removing a documented token is a breaking change.

## Package entry points

| Import                                        | Purpose                                                             |
| --------------------------------------------- | ------------------------------------------------------------------- |
| `@cryptorill/web-components`                  | Side-effect-free tree-shakeable barrel with `defineCustomElement*`. |
| `@cryptorill/web-components/register`         | Registers all components (lazy-loads component code).               |
| `@cryptorill/web-components/loader`           | Lazy loader with `defineCustomElements()`.                          |
| `@cryptorill/web-components/components/*`     | Auto-registering per-component modules.                             |
| `@cryptorill/web-components/tree-shakeable/*` | Individual side-effect-free component modules.                      |
| `@cryptorill/web-components/styles.css`       | Global stylesheet.                                                  |
| `@cryptorill/web-components/dist/*`           | Raw distribution files for advanced use cases.                      |

The tree-shakeable and per-component entries are ESM-only. CommonJS consumers can use `require('@cryptorill/web-components')` (registers all components) or `require('@cryptorill/web-components/loader')`.

## TypeScript

Type declarations are bundled and referenced from the package `exports` map. No separate `@types` package is required.

## Versioning and releases

This package follows [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html):

- **MAJOR** — breaking changes to components, attributes/properties, events, CSS custom properties, or export paths;
- **MINOR** — backwards-compatible features and new components;
- **PATCH** — backwards-compatible fixes and internal changes.

Releases are prepared with [Changesets](https://github.com/changesets/changesets) and published to npm from GitHub Actions using [trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC), with provenance generated automatically. The full process, including the semver rules and repository setup, is documented in [`docs/releasing.md`](https://github.com/cryptorill/web-components/blob/main/docs/releasing.md).

## Development

```bash
bun install
bun run start        # dev server with watch mode
bun run build        # production build into dist/ and loader/
bun run test:unit    # unit tests
bun run test:e2e     # Playwright end-to-end tests
bun run changeset    # describe a change for the next release
```

Architecture and testing notes live in [`docs/architecture.md`](https://github.com/cryptorill/web-components/blob/main/docs/architecture.md) and [`docs/testing-guide.md`](https://github.com/cryptorill/web-components/blob/main/docs/testing-guide.md).

## License

This project uses a **dual license**:

- Free for individuals, non-profits, and commercial entities with annual gross revenue **below $1,000,000 USD**.
- Commercial entities at or above **$1,000,000 USD** annual gross revenue must obtain a paid commercial license.

See [`LICENSE`](https://github.com/cryptorill/web-components/blob/main/LICENSE) for the complete terms. For commercial licensing, contact **dev@cryptorill.com**.
