/**
 * HTTP Request configuration
 */
export interface HttpRequestConfig {
  /** Query parameters */
  params?: Record<string, string | number | boolean>;
  /** Request headers */
  headers?: Record<string, string>;
  /** Request timeout in milliseconds */
  timeout?: number;
}

/**
 * HTTP Response wrapper
 */
export interface HttpResponse<T> {
  /** Response data */
  data: T;
  /** HTTP status code */
  status: number;
  /** Response headers */
  headers: Record<string, string>;
  /** Whether the request was successful */
  ok: boolean;
}

/**
 * HTTP Client interface
 * Abstraction over fetch API for testability and flexibility
 */
export interface IHttpClient {
  /**
   * Perform a GET request
   * @param url - Request URL
   * @param config - Request configuration
   * @returns Promise resolving to HttpResponse
   */
  get<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;

  /**
   * Perform a POST request
   * @param url - Request URL
   * @param body - Request body
   * @param config - Request configuration
   * @returns Promise resolving to HttpResponse
   */
  post<T>(url: string, body: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>>;

  /**
   * Perform a PUT request
   * @param url - Request URL
   * @param body - Request body
   * @param config - Request configuration
   * @returns Promise resolving to HttpResponse
   */
  put<T>(url: string, body: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>>;

  /**
   * Perform a DELETE request
   * @param url - Request URL
   * @param config - Request configuration
   * @returns Promise resolving to HttpResponse
   */
  delete<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
}
