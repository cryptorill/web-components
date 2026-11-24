/**
 * Mock implementation of IHttpClient for testing
 */
import { IHttpClient, HttpRequestConfig, HttpResponse } from '../../core/interfaces/http-client.interface';

export interface MockResponse<T = unknown> {
  status: number;
  data: T;
  headers?: Record<string, string>;
}

export interface MockError {
  message: string;
  status?: number;
}

export interface TrackedRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  body?: unknown;
  config?: HttpRequestConfig;
}

export class MockHttpClient implements IHttpClient {
  /** Map of URL to configured responses */
  responses: Map<string, MockResponse> = new Map();

  /** Map of URL to configured errors */
  errors: Map<string, MockError> = new Map();

  /** Array of tracked requests */
  requests: TrackedRequest[] = [];

  /** Default response for unconfigured URLs */
  private defaultResponse: MockResponse = {
    status: 200,
    data: {},
    headers: {},
  };

  /**
   * Set a response for a URL
   * @param url - URL pattern to match
   * @param response - Response configuration
   */
  setResponse<T>(url: string, response: MockResponse<T>): void {
    this.responses.set(url, response);
  }

  /**
   * Set an error for a URL
   * @param url - URL pattern to match
   * @param error - Error configuration
   */
  setError(url: string, error: MockError): void {
    this.errors.set(url, error);
  }

  /**
   * Set the default response for unconfigured URLs
   * @param response - Default response
   */
  setDefaultResponse<T>(response: MockResponse<T>): void {
    this.defaultResponse = response;
  }

  /**
   * Clear all configured responses and errors
   */
  clear(): void {
    this.responses.clear();
    this.errors.clear();
    this.requests = [];
  }

  /**
   * Get all tracked requests
   * @returns Array of tracked requests
   */
  getRequests(): TrackedRequest[] {
    return [...this.requests];
  }

  /**
   * Check if a request was made to a URL
   * @param method - HTTP method
   * @param urlPattern - URL or pattern to match
   * @returns True if matching request found
   */
  wasRequested(method: TrackedRequest['method'], urlPattern: string | RegExp): boolean {
    return this.requests.some(req => {
      if (req.method !== method) return false;
      if (typeof urlPattern === 'string') {
        return req.url.includes(urlPattern);
      }
      return urlPattern.test(req.url);
    });
  }

  /**
   * Get requests to a specific URL
   * @param urlPattern - URL or pattern to match
   * @returns Array of matching requests
   */
  getRequestsTo(urlPattern: string | RegExp): TrackedRequest[] {
    return this.requests.filter(req => {
      if (typeof urlPattern === 'string') {
        return req.url.includes(urlPattern);
      }
      return urlPattern.test(req.url);
    });
  }

  private findResponse(url: string): MockResponse {
    // Try exact match first
    if (this.responses.has(url)) {
      return this.responses.get(url)!;
    }

    // Try pattern matching
    for (const [pattern, response] of this.responses) {
      if (url.includes(pattern) || new RegExp(pattern).test(url)) {
        return response;
      }
    }

    return this.defaultResponse;
  }

  private findError(url: string): MockError | undefined {
    // Try exact match first
    if (this.errors.has(url)) {
      return this.errors.get(url);
    }

    // Try pattern matching
    for (const [pattern, error] of this.errors) {
      if (url.includes(pattern) || new RegExp(pattern).test(url)) {
        return error;
      }
    }

    return undefined;
  }

  private async executeRequest<T>(method: TrackedRequest['method'], url: string, body?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    this.requests.push({ method, url, body, config });

    const error = this.findError(url);
    if (error) {
      const err = new Error(error.message);
      if (error.status) {
        (err as Error & { status: number }).status = error.status;
      }
      throw err;
    }

    const response = this.findResponse(url);

    return {
      data: response.data as T,
      status: response.status,
      headers: response.headers ?? {},
      ok: response.status >= 200 && response.status < 300,
    };
  }

  /**
   * Perform a GET request
   * @param url - Request URL
   * @param config - Request configuration
   * @returns Promise resolving to HttpResponse
   */
  async get<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.executeRequest<T>('GET', url, undefined, config);
  }

  /**
   * Perform a POST request
   * @param url - Request URL
   * @param body - Request body
   * @param config - Request configuration
   * @returns Promise resolving to HttpResponse
   */
  async post<T>(url: string, body: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.executeRequest<T>('POST', url, body, config);
  }

  /**
   * Perform a PUT request
   * @param url - Request URL
   * @param body - Request body
   * @param config - Request configuration
   * @returns Promise resolving to HttpResponse
   */
  async put<T>(url: string, body: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.executeRequest<T>('PUT', url, body, config);
  }

  /**
   * Perform a DELETE request
   * @param url - Request URL
   * @param config - Request configuration
   * @returns Promise resolving to HttpResponse
   */
  async delete<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.executeRequest<T>('DELETE', url, undefined, config);
  }
}
