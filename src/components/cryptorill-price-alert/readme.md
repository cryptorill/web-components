# cryptorill-price-alert

<!-- Auto Generated Below -->


## Overview

Cryptorill Price Alert Component
Displays price alert configuration and status

## Properties

| Property       | Attribute       | Description                                    | Type                              | Default   |
| -------------- | --------------- | ---------------------------------------------- | --------------------------------- | --------- |
| `condition`    | `condition`     | Trigger condition: 'above' \| 'below'          | `"above" \| "below"`              | `'above'` |
| `currentPrice` | `current-price` | Current market price                           | `number`                          | `0`       |
| `isActive`     | `is-active`     | Alert active state                             | `boolean`                         | `false`   |
| `symbol`       | `symbol`        | Asset symbol (e.g., 'BTC', 'ETH')              | `string`                          | `''`      |
| `targetPrice`  | `target-price`  | Alert trigger target price                     | `number`                          | `0`       |
| `theme`        | `theme`         | Theme variant: 'dark' \| 'light' \| 'gradient' | `"dark" \| "gradient" \| "light"` | `'dark'`  |


## Events

| Event         | Description                   | Type                   |
| ------------- | ----------------------------- | ---------------------- |
| `toggleAlert` | Emitted when alert is toggled | `CustomEvent<boolean>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
