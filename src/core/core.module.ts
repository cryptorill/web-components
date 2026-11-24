import { container } from './di/container';
import {
  LOGGER_TOKEN,
  CONFIG_TOKEN,
  HTTP_CLIENT_TOKEN,
  PRICE_DATA_SOURCE_TOKEN,
  COIN_METADATA_SERVICE_TOKEN,
  POLLING_SERVICE_TOKEN,
  ERROR_HANDLER_TOKEN,
  RETRY_SERVICE_TOKEN,
  PRICE_FORMATTER_TOKEN,
} from './di/tokens';
import { ConsoleLogger } from './services/console-logger.service';
import { NoopLogger } from './services/noop-logger.service';
import { createConfigurationFromEnv } from './services/configuration.service';
import { FetchHttpClient } from './services/fetch-http-client.service';
import { CoinMetadataService } from './services/coin-metadata.service';
import { PollingService } from './services/polling.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { RetryService } from './services/retry.service';
import { PriceFormatterService } from './services/price-formatter.service';
import { CachedPriceDataSource } from './services/cached-price-datasource';
import { CryptoRillCryptoPriceDataSource } from '../datasources/cryptorill.datasource';
import { ILogger } from './interfaces/logger.interface';
import { IAppConfiguration } from './interfaces/configuration.interface';
import { IHttpClient } from './interfaces/http-client.interface';

/**
 * Core module configuration options
 */
export interface CoreModuleConfig {
  /** Whether to use production mode (noop logger) */
  production?: boolean;
  /** Custom logger implementation */
  logger?: ILogger;
  /** Custom configuration */
  config?: IAppConfiguration;
  /** Log level for console logger */
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * Initialize the core module with dependency injection
 * Registers all core services in the DI container
 * @param config - Module configuration options
 */
export function initializeCoreModule(config: CoreModuleConfig = {}): void {
  // Register logger
  if (config.logger) {
    container.registerInstance(LOGGER_TOKEN, config.logger);
  } else if (config.production) {
    container.registerSingleton(LOGGER_TOKEN, () => new NoopLogger());
  } else {
    container.registerSingleton(LOGGER_TOKEN, () => new ConsoleLogger(config.logLevel ?? 'debug'));
  }

  // Register configuration
  if (config.config) {
    container.registerInstance(CONFIG_TOKEN, config.config);
  } else {
    container.registerSingleton(CONFIG_TOKEN, () => createConfigurationFromEnv());
  }

  // Register HTTP client with dependencies
  container.registerSingleton(HTTP_CLIENT_TOKEN, () => {
    const logger = container.resolve<ILogger>(LOGGER_TOKEN);
    return new FetchHttpClient('', logger, 10000);
  });

  // Register coin metadata service
  container.registerSingleton(COIN_METADATA_SERVICE_TOKEN, () => new CoinMetadataService());

  // Register price data source with dependencies
  // Wrapped with CachedPriceDataSource for caching with per-symbol-pair refresh intervals
  container.registerSingleton(PRICE_DATA_SOURCE_TOKEN, () => {
    const httpClient = container.resolve<IHttpClient>(HTTP_CLIENT_TOKEN);
    const appConfig = container.resolve<IAppConfiguration>(CONFIG_TOKEN);
    const logger = container.resolve<ILogger>(LOGGER_TOKEN);
    const underlyingDataSource = new CryptoRillCryptoPriceDataSource(httpClient, appConfig, logger);
    return new CachedPriceDataSource(underlyingDataSource, logger);
  });

  // Register polling service factory
  container.registerTransient(POLLING_SERVICE_TOKEN, () => {
    const logger = container.resolve<ILogger>(LOGGER_TOKEN);
    return new PollingService({ interval: 30000 }, logger);
  });

  // Register error handler service
  container.registerSingleton(ERROR_HANDLER_TOKEN, () => {
    const logger = container.resolve<ILogger>(LOGGER_TOKEN);
    return new ErrorHandlerService(logger);
  });

  // Register retry service
  container.registerSingleton(RETRY_SERVICE_TOKEN, () => {
    const logger = container.resolve<ILogger>(LOGGER_TOKEN);
    return new RetryService(logger);
  });

  // Register price formatter service
  container.registerSingleton(PRICE_FORMATTER_TOKEN, () => new PriceFormatterService());
}

/**
 * Check if core module is initialized
 * @returns True if all required services are registered
 */
export function isCoreModuleInitialized(): boolean {
  return (
    container.has(LOGGER_TOKEN) &&
    container.has(CONFIG_TOKEN) &&
    container.has(HTTP_CLIENT_TOKEN) &&
    container.has(COIN_METADATA_SERVICE_TOKEN) &&
    container.has(PRICE_DATA_SOURCE_TOKEN) &&
    container.has(ERROR_HANDLER_TOKEN) &&
    container.has(RETRY_SERVICE_TOKEN) &&
    container.has(PRICE_FORMATTER_TOKEN)
  );
}

/**
 * Reset the core module (useful for testing)
 * Clears all service registrations
 */
export function resetCoreModule(): void {
  container.clear();
}
