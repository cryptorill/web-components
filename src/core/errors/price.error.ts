/**
 * Error codes for price-related errors
 */
export type PriceErrorCode = 'NETWORK_ERROR' | 'VALIDATION_ERROR' | 'NOT_FOUND' | 'UNKNOWN';

/**
 * Unified error class for all price-related errors
 * Replaces BaseError, NetworkError, ValidationError, NotFoundError
 */
export class PriceError extends Error {
  constructor(
    message: string,
    readonly code: PriceErrorCode,
    readonly context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'PriceError';

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);

    // Capture stack trace if available
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Get a string representation of the error
   */
  toString(): string {
    return `[${this.code}] ${this.message}`;
  }
}

/**
 * Factory function for network errors
 */
export function createNetworkError(message: string, url?: string, statusCode?: number): PriceError {
  return new PriceError(message, 'NETWORK_ERROR', { url, statusCode });
}

/**
 * Factory function for validation errors
 */
export function createValidationError(message: string, field?: string): PriceError {
  return new PriceError(message, 'VALIDATION_ERROR', { field });
}

/**
 * Factory function for not found errors
 */
export function createNotFoundError(message: string, resource?: string): PriceError {
  return new PriceError(message, 'NOT_FOUND', { resource });
}
