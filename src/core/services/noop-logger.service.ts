import { ILogger } from '../interfaces/logger.interface';

/**
 * No-op logger implementation
 * Used in production or when logging should be disabled
 * All methods do nothing - zero performance impact
 */
export class NoopLogger implements ILogger {
  debug(_message: string, ..._args: unknown[]): void {
    // No operation
  }

  info(_message: string, ..._args: unknown[]): void {
    // No operation
  }

  warn(_message: string, ..._args: unknown[]): void {
    // No operation
  }

  error(_message: string, _error?: Error, ..._args: unknown[]): void {
    // No operation
  }
}

/**
 * Singleton instance for production use
 */
export const noopLogger = new NoopLogger();
