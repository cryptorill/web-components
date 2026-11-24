/**
 * Mock implementation of ILogger for testing
 */
import { ILogger } from '../../core/interfaces/logger.interface';

export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  meta?: unknown[];
  error?: Error;
}

export class MockLogger implements ILogger {
  /** Array of all logged messages */
  logs: LogEntry[] = [];

  /**
   * Log debug message
   * @param message - Log message
   * @param args - Additional arguments
   */
  debug(message: string, ...args: unknown[]): void {
    this.logs.push({ level: 'debug', message, meta: args });
  }

  /**
   * Log info message
   * @param message - Log message
   * @param args - Additional arguments
   */
  info(message: string, ...args: unknown[]): void {
    this.logs.push({ level: 'info', message, meta: args });
  }

  /**
   * Log warning message
   * @param message - Log message
   * @param args - Additional arguments
   */
  warn(message: string, ...args: unknown[]): void {
    this.logs.push({ level: 'warn', message, meta: args });
  }

  /**
   * Log error message
   * @param message - Log message
   * @param error - Optional Error object
   * @param args - Additional arguments
   */
  error(message: string, error?: Error, ...args: unknown[]): void {
    this.logs.push({ level: 'error', message, error, meta: args });
  }

  /**
   * Get all logged messages
   * @returns Array of log entries
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear all logs
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * Check if a message with given level and pattern exists
   * @param level - Log level to search for
   * @param pattern - String or RegExp to match against message
   * @returns True if matching log found
   */
  hasMessage(level: LogEntry['level'], pattern: string | RegExp): boolean {
    return this.logs.some(log => {
      if (log.level !== level) return false;
      if (typeof pattern === 'string') {
        return log.message.includes(pattern);
      }
      return pattern.test(log.message);
    });
  }

  /**
   * Get logs filtered by level
   * @param level - Log level to filter by
   * @returns Array of matching log entries
   */
  getLogsByLevel(level: LogEntry['level']): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Get the last log entry
   * @returns Last log entry or undefined
   */
  getLastLog(): LogEntry | undefined {
    return this.logs[this.logs.length - 1];
  }
}
