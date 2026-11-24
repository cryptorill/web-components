import type { ILogger } from '../interfaces/logger.interface';

/**
 * Retry options
 */
export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Base delay between retries in milliseconds (default: 1000) */
  baseDelay?: number;
}

/**
 * Default retry options
 */
const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 1000,
};

/**
 * Retry Service Interface
 */
export interface IRetryService {
  /**
   * Execute an operation with retry logic
   * @param operation - Async operation to execute
   * @param options - Retry options
   * @returns Result of the operation
   */
  execute<T>(operation: () => Promise<T>, options?: RetryOptions): Promise<T>;
}

/**
 * Retry Service
 * Provides retry functionality with exponential backoff
 */
export class RetryService implements IRetryService {
  constructor(private readonly logger: ILogger) {}

  /**
   * Execute an operation with retry logic
   * Uses exponential backoff: delay = baseDelay * (2 ^ attempt)
   * @param operation - Async operation to execute
   * @param options - Retry options
   * @returns Result of the operation
   * @throws Last error if all retries fail
   */
  async execute<T>(operation: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    let lastError: Error;

    for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt < opts.maxRetries) {
          const delay = opts.baseDelay * Math.pow(2, attempt);
          this.logger.warn(`Operation failed, retrying in ${delay}ms (attempt ${attempt + 1}/${opts.maxRetries})`);
          await this.sleep(delay);
        }
      }
    }

    throw lastError!;
  }

  /**
   * Sleep for a given duration
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
