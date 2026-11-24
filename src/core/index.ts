/**
 * CryptoRill Core Module - Public API
 *
 * This module provides the core infrastructure for CryptoRill web components,
 * including dependency injection, services, interfaces, and utilities for
 * fetching and displaying cryptocurrency price data.
 *
 * @example
 * ```typescript
 * import { initializeCoreModule, container, LOGGER_TOKEN } from '@cryptorill/core';
 *
 * // Initialize the core module
 * initializeCoreModule({ production: false });
 *
 * // Resolve services from the container
 * const logger = container.resolve(LOGGER_TOKEN);
 * logger.info('Core module initialized');
 * ```
 *
 * @module @cryptorill/core
 */

// =============================================================================
// Types - Core data types
// =============================================================================

/**
 * {@link CryptoPrice} - Unified cryptocurrency price type
 * {@link isCryptoPrice} - Type guard for runtime validation
 */
export { CryptoPrice, isCryptoPrice } from './types/crypto-price';

// =============================================================================
// Interfaces - Core abstractions for the CryptoRill ecosystem
// =============================================================================

/**
 * {@link IPriceDataSource} - Interface for price data sources
 */
export { IPriceDataSource } from './interfaces/data-source.interface';

/**
 * {@link ILogger} - Interface for application logging
 */
export { ILogger } from './interfaces/logger.interface';

/**
 * {@link IAppConfiguration} - Application configuration interface
 * {@link PartialAppConfiguration} - Partial configuration for overrides
 */
export { IAppConfiguration, PartialAppConfiguration } from './interfaces/configuration.interface';

/**
 * {@link IHttpClient} - HTTP client interface
 * {@link HttpRequestConfig} - HTTP request configuration
 * {@link HttpResponse} - HTTP response wrapper
 */
export { IHttpClient, HttpRequestConfig, HttpResponse } from './interfaces/http-client.interface';

/**
 * {@link ICoinMetadataService} - Interface for coin metadata service
 * {@link CoinMetadata} - Coin metadata data structure
 */
export { ICoinMetadataService, CoinMetadata } from './interfaces/coin-metadata.interface';

/**
 * {@link IPollingService} - Interface for polling service
 * {@link PollingServiceOptions} - Polling service configuration options
 */
export { IPollingService, PollingServiceOptions } from './interfaces/polling-service.interface';

/**
 * {@link IPriceFormatter} - Interface for price formatting service
 * {@link PriceFormatOptions} - Price formatting options
 */
export { IPriceFormatter, PriceFormatOptions } from './interfaces/price-formatter.interface';

// =============================================================================
// Dependency Injection - Container and Injection Tokens
// =============================================================================

export { DIContainer, container } from './di/container';

/**
 * DI Injection Tokens - Symbols used to register and resolve services
 */
export {
  PRICE_DATA_SOURCE_TOKEN,
  LOGGER_TOKEN,
  CONFIG_TOKEN,
  POLLING_SERVICE_TOKEN,
  COIN_METADATA_SERVICE_TOKEN,
  HTTP_CLIENT_TOKEN,
  ERROR_HANDLER_TOKEN,
  RETRY_SERVICE_TOKEN,
  PRICE_FORMATTER_TOKEN,
} from './di/tokens';

// =============================================================================
// Services - Concrete implementations of core interfaces
// =============================================================================

export { ConsoleLogger, consoleLogger } from './services/console-logger.service';
export { NoopLogger, noopLogger } from './services/noop-logger.service';
export { ConfigurationService, configurationService, createConfigurationFromEnv } from './services/configuration.service';
export { FetchHttpClient, HttpError, createFetchHttpClient } from './services/fetch-http-client.service';
export { CoinMetadataService, coinMetadataService } from './services/coin-metadata.service';
export { PollingService, createPollingService } from './services/polling.service';
export { ErrorHandlerService, IErrorHandler } from './services/error-handler.service';
export { RetryService, IRetryService, RetryOptions } from './services/retry.service';
export { PriceFormatterService, priceFormatterService } from './services/price-formatter.service';

// =============================================================================
// Errors - Unified error handling
// =============================================================================

/**
 * {@link PriceError} - Unified error class for all price-related errors
 * {@link PriceErrorCode} - Error code type
 * {@link createNetworkError} - Factory for network errors
 * {@link createValidationError} - Factory for validation errors
 * {@link createNotFoundError} - Factory for not found errors
 */
export { PriceError, PriceErrorCode, createNetworkError, createValidationError, createNotFoundError } from './errors/price.error';

// =============================================================================
// Mappers - Data transformation utilities
// =============================================================================

export { CryptoPriceMapper } from './mappers/crypto-price.mapper';

// =============================================================================
// Module Initialization
// =============================================================================

export { initializeCoreModule, isCoreModuleInitialized, resetCoreModule, CoreModuleConfig } from './core.module';
