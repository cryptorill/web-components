import { ILogger } from '../interfaces/logger.interface';

/**
 * Console-based logger implementation
 * Uses console methods for logging with log level filtering
 */
export class ConsoleLogger implements ILogger {
  private logLevel: 'debug' | 'info' | 'warn' | 'error';

  /**
   * Create a new ConsoleLogger
   * @param logLevel - Minimum log level to output (default: 'debug')
   */
  constructor(logLevel: 'debug' | 'info' | 'warn' | 'error' = 'debug') {
    this.logLevel = logLevel;
  }

  /**
   * Check if a log level should be output
   */
  private shouldLog(level: 'debug' | 'info' | 'warn' | 'error'): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, error?: Error, ...args: unknown[]): void {
    if (this.shouldLog('error')) {
      if (error) {
        console.error(`[ERROR] ${message}`, error, ...args);
      } else {
        console.error(`[ERROR] ${message}`, ...args);
      }
    }
  }
}

/**
 * Singleton instance for development use
 */
export const consoleLogger = new ConsoleLogger();
