# cryptorill-gas-estimator

<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                             | Type                              | Default                                |
| ------------- | -------------- | ----------------------------------------------------------------------- | --------------------------------- | -------------------------------------- |
| `currency`    | `currency`     | Display currency                                                        | `string`                          | `'USD'`                                |
| `gasLimit`    | `gas-limit`    | Estimated gas limit                                                     | `number`                          | `21000`                                |
| `network`     | `network`      | Blockchain network (e.g., 'ethereum', 'polygon', 'bsc')                 | `string`                          | `'ethereum'`                           |
| `prices`      | `prices`       | Gas prices for different speeds (can be GasPrice object or JSON string) | `GasPrice \| string`              | `{ slow: 20, standard: 30, fast: 50 }` |
| `selected`    | `selected`     | Selected speed option                                                   | `"fast" \| "slow" \| "standard"`  | `'standard'`                           |
| `theme`       | `theme`        | Theme variant: 'dark' \| 'light' \| 'gradient'                          | `"dark" \| "gradient" \| "light"` | `'dark'`                               |
| `tokenPrice`  | `token-price`  | Native token price in USD (for calculation)                             | `number`                          | `2000`                                 |
| `tokenSymbol` | `token-symbol` | Native token symbol                                                     | `string`                          | `'ETH'`                                |


## Events

| Event         | Description                          | Type                                          |
| ------------- | ------------------------------------ | --------------------------------------------- |
| `speedChange` | Emitted when speed selection changes | `CustomEvent<"fast" \| "slow" \| "standard">` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
