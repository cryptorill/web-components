/**
 * Dependency Injection Tokens
 * Used to identify and register services in the DI container
 */

/**
 * Symbol for IPriceDataSource service
 */
export const PRICE_DATA_SOURCE_TOKEN = Symbol('IPriceDataSource');

/**
 * Symbol for ILogger service
 */
export const LOGGER_TOKEN = Symbol('ILogger');

/**
 * Symbol for IAppConfiguration service
 */
export const CONFIG_TOKEN = Symbol('IAppConfiguration');

/**
 * Symbol for IPollingService service
 */
export const POLLING_SERVICE_TOKEN = Symbol('IPollingService');

/**
 * Symbol for ICoinMetadataService service
 */
export const COIN_METADATA_SERVICE_TOKEN = Symbol('ICoinMetadataService');

/**
 * Symbol for IHttpClient service
 */
export const HTTP_CLIENT_TOKEN = Symbol('IHttpClient');

/**
 * Symbol for IErrorHandler service
 */
export const ERROR_HANDLER_TOKEN = Symbol('IErrorHandler');

/**
 * Symbol for IRetryService service
 */
export const RETRY_SERVICE_TOKEN = Symbol('IRetryService');

/**
 * Symbol for IPriceFormatter service
 */
export const PRICE_FORMATTER_TOKEN = Symbol('IPriceFormatter');
