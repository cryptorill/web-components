import { IAppConfiguration, PartialAppConfiguration } from '../interfaces/configuration.interface';

/**
 * Default configuration values
 */
const DEFAULT_CONFIGURATION: IAppConfiguration = {
  apiBaseUrl: 'https://cryptorill-consumer-api.husariasolutions.com/v1/price',
  defaultPollingInterval: 30000, // 30 seconds
  defaultPriceFlashDuration: 600, // 600ms
  defaultSparklinePoints: 20,
  defaultTradingPair: 'USDT',
};

/**
 * Configuration Service
 * Manages application configuration with support for environment-based overrides
 */
export class ConfigurationService implements IAppConfiguration {
  private config: IAppConfiguration;

  /**
   * Create a new ConfigurationService
   * @param overrides - Configuration overrides
   */
  constructor(overrides: PartialAppConfiguration = {}) {
    this.config = {
      ...DEFAULT_CONFIGURATION,
      ...overrides,
    };
  }

  /**
   * Get the API base URL
   */
  get apiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

  /**
   * Get the default polling interval in milliseconds
   */
  get defaultPollingInterval(): number {
    return this.config.defaultPollingInterval;
  }

  /**
   * Get the default price flash duration in milliseconds
   */
  get defaultPriceFlashDuration(): number {
    return this.config.defaultPriceFlashDuration;
  }

  /**
   * Get the default number of sparkline points
   */
  get defaultSparklinePoints(): number {
    return this.config.defaultSparklinePoints;
  }

  /**
   * Get the default trading pair suffix
   */
  get defaultTradingPair(): string {
    return this.config.defaultTradingPair;
  }

  /**
   * Update configuration with new values
   * @param overrides - Configuration overrides
   */
  update(overrides: PartialAppConfiguration): void {
    this.config = {
      ...this.config,
      ...overrides,
    };
  }

  /**
   * Get the full configuration object
   * @returns Current configuration
   */
  getConfig(): IAppConfiguration {
    return { ...this.config };
  }

  /**
   * Reset configuration to defaults
   */
  reset(): void {
    this.config = { ...DEFAULT_CONFIGURATION };
  }
}

/**
 * Singleton instance with default configuration
 */
export const configurationService = new ConfigurationService();

/**
 * Create configuration from environment variables
 * @returns ConfigurationService with environment-based settings
 */
export function createConfigurationFromEnv(): ConfigurationService {
  const overrides: PartialAppConfiguration = {};

  // Check for environment-specific configuration
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.CRYPTORILL_API_BASE_URL) {
      overrides.apiBaseUrl = process.env.CRYPTORILL_API_BASE_URL;
    }
    if (process.env.CRYPTORILL_POLLING_INTERVAL) {
      overrides.defaultPollingInterval = parseInt(process.env.CRYPTORILL_POLLING_INTERVAL, 10);
    }
    if (process.env.CRYPTORILL_PRICE_FLASH_DURATION) {
      overrides.defaultPriceFlashDuration = parseInt(process.env.CRYPTORILL_PRICE_FLASH_DURATION, 10);
    }
    if (process.env.CRYPTORILL_SPARKLINE_POINTS) {
      overrides.defaultSparklinePoints = parseInt(process.env.CRYPTORILL_SPARKLINE_POINTS, 10);
    }
    if (process.env.CRYPTORILL_TRADING_PAIR) {
      overrides.defaultTradingPair = process.env.CRYPTORILL_TRADING_PAIR;
    }
  }

  // Check for global configuration object (for browser environments)
  if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).__CRYPTORILL_CONFIG__) {
    const globalConfig = (window as unknown as Record<string, PartialAppConfiguration>).__CRYPTORILL_CONFIG__;
    Object.assign(overrides, globalConfig);
  }

  return new ConfigurationService(overrides);
}
