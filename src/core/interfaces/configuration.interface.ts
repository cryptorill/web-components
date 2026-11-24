/**
 * Application configuration interface
 * Centralizes all configurable aspects of the application
 */
export interface IAppConfiguration {
  /**
   * Base URL for the crypto price API
   */
  apiBaseUrl: string;

  /**
   * Default polling interval in milliseconds
   */
  defaultPollingInterval: number;

  /**
   * Default duration for price flash animation in milliseconds
   */
  defaultPriceFlashDuration: number;

  /**
   * Default number of sparkline points
   */
  defaultSparklinePoints: number;

  /**
   * Default trading pair suffix (e.g., 'USDT')
   */
  defaultTradingPair: string;
}

/**
 * Partial configuration for overriding defaults
 */
export type PartialAppConfiguration = Partial<IAppConfiguration>;
