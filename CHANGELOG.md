# Changelog

All notable changes to `@cryptorill/web-components` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Releases are prepared with [Changesets](https://github.com/changesets/changesets); see [`docs/releasing.md`](docs/releasing.md).

## 1.0.0 — 2026-11-14

### Added

- Initial public release under the `@cryptorill/web-components` scope.
- Framework-agnostic custom elements built with Stencil:
  - `cryptorill-amount-input`
  - `cryptorill-balance`
  - `cryptorill-gas-estimator`
  - `cryptorill-market-card`
  - `cryptorill-network-status`
  - `cryptorill-order-book`
  - `cryptorill-order-row`
  - `cryptorill-percentage-bar`
  - `cryptorill-portfolio-item`
  - `cryptorill-price`
  - `cryptorill-price-alert`
  - `cryptorill-price-diff`
  - `cryptorill-price-ticker`
  - `cryptorill-sparkline`
  - `cryptorill-token-icon`
  - `cryptorill-trade-history`
  - `cryptorill-trading-pair`
  - `cryptorill-transaction-item`
  - `cryptorill-transaction-list`
  - `cryptorill-volume-bar`
- Lazy-loading loader entry (`@cryptorill/web-components/loader`).
- All-components registration entry (`@cryptorill/web-components/register`).
- Side-effect-free tree-shakeable root entry with `defineCustomElement*` functions.
- Auto-registering per-component entries (`@cryptorill/web-components/components/*`).
- TypeScript declarations, lazy-loading distribution, collection manifest, and CDN bundles.
- Changesets-based semantic versioning and automated npm publishing with provenance.
