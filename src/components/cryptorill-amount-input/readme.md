# cryptorill-amount-input

<!-- Auto Generated Below -->


## Overview

Cryptorill Amount Input Component
Cryptocurrency amount input with formatting, validation, and max button

## Properties

| Property           | Attribute           | Description                                          | Type                              | Default    |
| ------------------ | ------------------- | ---------------------------------------------------- | --------------------------------- | ---------- |
| `availableBalance` | `available-balance` | Available balance (shown when max button is enabled) | `number`                          | `0`        |
| `decimals`         | `decimals`          | Maximum decimal places allowed                       | `number`                          | `8`        |
| `disabled`         | `disabled`          | Disable input                                        | `boolean`                         | `false`    |
| `label`            | `label`             | Input label                                          | `string`                          | `'Amount'` |
| `max`              | `max`               | Maximum allowed value                                | `number`                          | `Infinity` |
| `min`              | `min`               | Minimum allowed value                                | `number`                          | `0`        |
| `placeholder`      | `placeholder`       | Input placeholder text                               | `string`                          | `'0.00'`   |
| `showMaxButton`    | `show-max-button`   | Show max amount button                               | `boolean`                         | `true`     |
| `symbol`           | `symbol`            | Currency symbol (e.g., 'BTC', 'ETH')                 | `string`                          | `''`       |
| `theme`            | `theme`             | Theme variant: 'dark' \| 'light' \| 'gradient'       | `"dark" \| "gradient" \| "light"` | `'dark'`   |
| `value`            | `value`             | Input value                                          | `number`                          | `0`        |


## Events

| Event         | Description                     | Type                                                      |
| ------------- | ------------------------------- | --------------------------------------------------------- |
| `validation`  | Emitted when input is validated | `CustomEvent<{ valid: boolean; error: string \| null; }>` |
| `valueChange` | Emitted when value changes      | `CustomEvent<number>`                                     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
