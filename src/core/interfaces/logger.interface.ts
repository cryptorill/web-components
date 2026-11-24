/**
 * Logger interface for application logging
 * Provides abstraction over console logging for testability
 * and production configuration
 */
export interface ILogger {
  /**
   * Log debug message
   * @param message - Log message
   * @param args - Additional arguments to log
   */
  debug(message: string, ...args: unknown[]): void;

  /**
   * Log info message
   * @param message - Log message
   * @param args - Additional arguments to log
   */
  info(message: string, ...args: unknown[]): void;

  /**
   * Log warning message
   * @param message - Log message
   * @param args - Additional arguments to log
   */
  warn(message: string, ...args: unknown[]): void;

  /**
   * Log error message
   * @param message - Log message
   * @param error - Optional Error object
   * @param args - Additional arguments to log
   */
  error(message: string, error?: Error, ...args: unknown[]): void;
}
