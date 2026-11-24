/**
 * Testing utilities for CryptoRill Web Components
 */

export * from './mocks';

/**
 * Wait for a specified duration
 * @param ms - Duration in milliseconds
 * @returns Promise that resolves after the duration
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a deferred promise for async testing
 * @returns Object with promise, resolve, and reject
 */
export function createDeferred<T>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
} {
  let resolveFn: (value: T) => void;
  let rejectFn: (reason?: unknown) => void;

  const promise = new Promise<T>((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;
  });

  return {
    promise,
    resolve: resolveFn!,
    reject: rejectFn!,
  };
}

/**
 * Flush all pending promises
 * @returns Promise that resolves after microtasks
 */
export async function flushPromises(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 0));
}
