import { IPollingService, PollingServiceOptions } from '../interfaces/polling-service.interface';
import { ILogger } from '../interfaces/logger.interface';

/**
 * Default polling service implementation
 * Uses setInterval for periodic callback execution
 */
export class PollingService implements IPollingService {
  private timerId: ReturnType<typeof setInterval> | null = null;
  private callback: (() => void) | null = null;
  private readonly interval: number;
  private readonly immediate: boolean;
  private readonly logger: ILogger;

  /**
   * Creates a new PollingService
   * @param options - Configuration options for polling
   * @param logger - Logger instance for logging
   */
  constructor(options: PollingServiceOptions, logger: ILogger) {
    this.interval = options.interval;
    this.immediate = options.immediate ?? false;
    this.logger = logger;
  }

  /**
   * Start polling with the given callback
   * @param callback - Function to execute on each poll interval
   */
  start(callback: () => void): void {
    if (this.timerId !== null) {
      this.logger.warn('PollingService: Already running, stopping previous poll');
      this.stop();
    }

    this.callback = callback;

    this.logger.debug('PollingService: Starting polling with interval', this.interval);

    // Execute immediately if requested
    if (this.immediate) {
      try {
        callback();
      } catch (error) {
        this.logger.error('PollingService: Error in immediate callback', error instanceof Error ? error : undefined);
      }
    }

    // Set up interval
    this.timerId = setInterval(() => {
      if (this.callback) {
        try {
          this.callback();
        } catch (error) {
          this.logger.error('PollingService: Error in poll callback', error instanceof Error ? error : undefined);
        }
      }
    }, this.interval);
  }

  /**
   * Stop polling and clean up resources
   */
  stop(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
      this.logger.debug('PollingService: Polling stopped');
    }
    this.callback = null;
  }

  /**
   * Check if polling is currently running
   * @returns True if polling is active
   */
  isRunning(): boolean {
    return this.timerId !== null;
  }
}

/**
 * Factory function to create a PollingService
 * @param options - Configuration options for polling
 * @param logger - Logger instance for logging
 * @returns PollingService instance
 */
export function createPollingService(options: PollingServiceOptions, logger: ILogger): PollingService {
  return new PollingService(options, logger);
}
