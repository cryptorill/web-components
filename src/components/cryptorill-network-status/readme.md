# cryptorill-network-status

<!-- Auto Generated Below -->


## Overview

Cryptorill Network Status Component
Displays blockchain network status with health indicators

## Properties

| Property      | Attribute      | Description                                         | Type                                  | Default      |
| ------------- | -------------- | --------------------------------------------------- | ------------------------------------- | ------------ |
| `blockHeight` | `block-height` | Current block height                                | `number`                              | `0`          |
| `lastBlock`   | --             | Timestamp of last block                             | `Date`                                | `new Date()` |
| `latency`     | `latency`      | Network latency in milliseconds                     | `number`                              | `0`          |
| `network`     | `network`      | Network name (e.g., 'Ethereum', 'Polygon')          | `string`                              | `'Ethereum'` |
| `showDetails` | `show-details` | Show detailed metrics                               | `boolean`                             | `true`       |
| `status`      | `status`       | Network status: 'online' \| 'degraded' \| 'offline' | `"degraded" \| "offline" \| "online"` | `'online'`   |
| `theme`       | `theme`        | Theme variant: 'dark' \| 'light' \| 'gradient'      | `"dark" \| "gradient" \| "light"`     | `'dark'`     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
