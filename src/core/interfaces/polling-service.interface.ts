/**
 * Options for creating a PollingService
 */
export interface PollingServiceOptions {
  /** Interval in milliseconds between poll executions */
  interval: number;
  /** Whether to execute the callback immediately on start */
  immediate?: boolean;
}

/**
 * Interface for polling service
 * Provides abstraction for periodic callback execution
 */
export interface IPollingService {
  /**
   * Start polling with the given callback
   * @param callback - Function to execute on each poll interval
   */
  start(callback: () => void): void;

  /**
   * Stop polling and clean up resources
   */
  stop(): void;

  /**
   * Check if polling is currently running
   * @returns True if polling is active
   */
  isRunning(): boolean;
}
