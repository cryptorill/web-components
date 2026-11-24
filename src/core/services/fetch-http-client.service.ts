import { IHttpClient, HttpRequestConfig, HttpResponse } from '../interfaces/http-client.interface';
import { ILogger } from '../interfaces/logger.interface';

/**
 * Fetch-based HTTP Client implementation
 * Wraps the native fetch API with error handling and logging
 */
export class FetchHttpClient implements IHttpClient {
  private baseUrl: string;
  private logger: ILogger | undefined;
  private defaultTimeout: number;

  /**
   * Create a new FetchHttpClient
   * @param baseUrl - Base URL for all requests
   * @param logger - Optional logger for request/response logging
   * @param defaultTimeout - Default timeout in milliseconds (default: 10000)
   */
  constructor(baseUrl: string = '', logger?: ILogger, defaultTimeout: number = 10000) {
    this.baseUrl = baseUrl;
    this.logger = logger;
    this.defaultTimeout = defaultTimeout;
  }

  /**
   * Perform a GET request
   */
  async get<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>('GET', url, undefined, config);
  }

  /**
   * Perform a POST request
   */
  async post<T>(url: string, body: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>('POST', url, body, config);
  }

  /**
   * Perform a PUT request
   */
  async put<T>(url: string, body: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>('PUT', url, body, config);
  }

  /**
   * Perform a DELETE request
   */
  async delete<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>('DELETE', url, undefined, config);
  }

  /**
   * Internal request method
   */
  private async request<T>(method: string, url: string, body?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    const fullUrl = this.buildUrl(url, config?.params);
    const timeout = config?.timeout ?? this.defaultTimeout;

    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...config?.headers,
    };

    if (body && typeof body === 'object') {
      headers['Content-Type'] = 'application/json';
    }

    const requestInit: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(timeout),
    };

    if (body && method !== 'GET' && method !== 'HEAD') {
      requestInit.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    this.logger?.debug(`HTTP ${method} ${fullUrl}`);

    try {
      const response = await fetch(fullUrl, requestInit);
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let data: T;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = (await response.text()) as unknown as T;
      }

      const httpResponse: HttpResponse<T> = {
        data,
        status: response.status,
        headers: responseHeaders,
        ok: response.ok,
      };

      if (!response.ok) {
        this.logger?.error(`HTTP ${method} ${fullUrl} failed with status ${response.status}`, undefined, httpResponse);
        throw new HttpError(`HTTP ${method} ${fullUrl} failed with status ${response.status}`, httpResponse);
      }

      this.logger?.debug(`HTTP ${method} ${fullUrl} succeeded`, httpResponse);
      return httpResponse;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger?.error(`HTTP ${method} ${fullUrl} request failed`, error instanceof Error ? error : undefined);
      throw new HttpError(`HTTP ${method} ${fullUrl} request failed: ${errorMessage}`);
    }
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(url: string, params?: Record<string, string | number | boolean>): string {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;

    if (!params || Object.keys(params).length === 0) {
      return fullUrl;
    }

    const urlObj = new URL(fullUrl);
    Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.append(key, String(value));
    });

    return urlObj.toString();
  }
}

/**
 * HTTP Error class for failed requests
 */
export class HttpError extends Error {
  /** HTTP response if available */
  response?: HttpResponse<unknown>;
  /** Whether this is a network error */
  isNetworkError: boolean;
  /** Whether this is a timeout error */
  isTimeoutError: boolean;

  constructor(message: string, response?: HttpResponse<unknown>) {
    super(message);
    this.name = 'HttpError';
    this.response = response;
    this.isNetworkError = !response;
    this.isTimeoutError = message.toLowerCase().includes('timeout') || message.toLowerCase().includes('abort');
  }
}

/**
 * Create a FetchHttpClient with configuration
 * @param baseUrl - Base URL for all requests
 * @param logger - Optional logger
 * @returns Configured FetchHttpClient instance
 */
export function createFetchHttpClient(baseUrl: string = '', logger?: ILogger): FetchHttpClient {
  return new FetchHttpClient(baseUrl, logger);
}
