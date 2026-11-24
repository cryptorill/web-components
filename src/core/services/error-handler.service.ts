import type { ILogger } from '../interfaces/logger.interface';
import { PriceError, PriceErrorCode } from '../errors/price.error';

/**
 * Error Handler Interface
 * Defines the contract for error handling services
 */
export interface IErrorHandler {
  /**
   * Handle an error
   * @param error - Error to handle
   */
  handle(error: Error): void;

  /**
   * Get a user-friendly error message
   * @param error - Error to get message for
   * @returns User-friendly error message
   */
  getUserMessage(error: Error): string;
}

/**
 * Error Handler Service
 * Provides centralized error handling with classification and user-friendly messages
 */
export class ErrorHandlerService implements IErrorHandler {
  private readonly logger: ILogger;

  /**
   * User-friendly error messages by error code
   */
  private static readonly USER_MESSAGES: Record<PriceErrorCode, string> = {
    NETWORK_ERROR: 'Unable to connect. Please check your connection and try again.',
    VALIDATION_ERROR: 'Invalid input. Please check your data and try again.',
    NOT_FOUND: 'Price data not found for this symbol.',
    UNKNOWN: 'An unexpected error occurred. Please try again later.',
  };

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  /**
   * Handle an error - log it and return appropriate context
   * @param error - Error to handle
   */
  handle(error: Error): void {
    const code = error instanceof PriceError ? error.code : 'UNKNOWN';
    this.logger.error(`[${code}] ${error.message}`, error);
  }

  /**
   * Get a user-friendly error message
   * @param error - Error to get message for
   * @returns User-friendly error message
   */
  getUserMessage(error: Error): string {
    if (error instanceof PriceError) {
      return ErrorHandlerService.USER_MESSAGES[error.code];
    }
    return ErrorHandlerService.USER_MESSAGES.UNKNOWN;
  }
}
