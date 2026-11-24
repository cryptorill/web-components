import { CryptoPrice, IPriceDataSource } from '../core/interfaces/data-source.interface';
import { IHttpClient } from '../core/interfaces/http-client.interface';
import { ILogger } from '../core/interfaces/logger.interface';
import { IAppConfiguration } from '../core/interfaces/configuration.interface';
import { CryptoPriceMapper } from '../core/mappers/crypto-price.mapper';
import { createNotFoundError } from '../core/errors/price.error';
import { container, LOGGER_TOKEN, CONFIG_TOKEN, HTTP_CLIENT_TOKEN } from '../core';
import { HistoricalPriceData, HistoricalPriceQuery } from '../core/types/historical-price';

/**
 * CryptoRill Crypto Price DataSource
 * Fetches cryptocurrency prices from the CryptoRill API
 * Implements IPriceDataSource for dependency injection compatibility
 */
export class CryptoRillCryptoPriceDataSource implements IPriceDataSource {
  private httpClient: IHttpClient;
  private config: IAppConfiguration;
  private logger: ILogger;

  /**
   * Create a new CryptoRillCryptoPriceDataSource
   * Dependencies are resolved from the DI container if not provided
   * @param httpClient - HTTP client for making requests
   * @param config - Application configuration
   * @param logger - Logger for error reporting
   */
  constructor(httpClient?: IHttpClient, config?: IAppConfiguration, logger?: ILogger) {
    this.httpClient = httpClient ?? container.resolve<IHttpClient>(HTTP_CLIENT_TOKEN);
    this.config = config ?? container.resolve<IAppConfiguration>(CONFIG_TOKEN);
    this.logger = logger ?? container.resolve<ILogger>(LOGGER_TOKEN);
  }

  /**
   * Fetch prices for multiple symbols
   * @param symbols - Array of cryptocurrency symbols (e.g., ['BTC', 'ETH'])
   * @returns Promise resolving to array of CryptoPrice objects
   */
  async fetchPrices(symbols: string[]): Promise<CryptoPrice[]> {
    this.logger.debug(`Fetching prices for symbols: ${symbols.join(', ')}`);

    const results = await Promise.all(symbols.map(symbol => this.fetchPriceWithErrorHandling(symbol)));
    const validResults = results.filter((result): result is CryptoPrice => result !== null);

    this.logger.debug(`Successfully fetched ${validResults.length}/${symbols.length} prices`);
    return validResults;
  }

  /**
   * Fetch price for a single symbol
   * @param symbol - Cryptocurrency symbol (e.g., 'BTC')
   * @returns Promise resolving to CryptoPrice object
   * @throws PriceError if fetch fails
   */
  async fetchPrice(symbol: string): Promise<CryptoPrice> {
    const result = await this.fetchPriceWithErrorHandling(symbol);

    if (result === null) {
      throw createNotFoundError(`Failed to fetch price for ${symbol}`, 'price');
    }

    return result;
  }

  /**
   * Internal method to fetch price with error handling
   * @param symbol - Cryptocurrency symbol
   * @returns CryptoPrice or null if fetch fails
   */
  private async fetchPriceWithErrorHandling(symbol: string): Promise<CryptoPrice | null> {
    const trimmedSymbol = symbol.trim().toUpperCase();

    try {
      interface PriceApiResponse {
        price: string;
        dayChange?: string | null;
      }

      const response = await this.httpClient.get<PriceApiResponse>(this.config.apiBaseUrl, {
        params: { pair: trimmedSymbol.toLowerCase() },
      });

      const price = CryptoPriceMapper.fromRawResponse(trimmedSymbol, response.data);
      this.logger.debug(`Fetched price for ${trimmedSymbol}: ${price.price}, dayChange: ${price.dayChange ?? 'N/A'}`);

      return price;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error fetching price for ${trimmedSymbol}: ${errorMessage}`, error instanceof Error ? error : undefined);

      // Return null to allow partial results in batch requests
      return null;
    }
  }

  /**
   * Fetch historical prices for a cryptocurrency pair
   * @param query - Query parameters including pair and optional limit
   * @returns Promise resolving to HistoricalPriceData with timestamped price points
   */
  async fetchHistoricalPrices(query: HistoricalPriceQuery): Promise<HistoricalPriceData> {
    this.logger.debug(`Fetching historical prices for ${query.pair}, limit: ${query.limit ?? 25}`);

    try {
      interface HistoricalApiResponse {
        pair: string;
        data: Array<{ timestamp: number; price: string }>;
      }

      const response = await this.httpClient.get<HistoricalApiResponse>(`${this.config.apiBaseUrl}/historical`, {
        params: {
          pair: query.pair.toLowerCase(),
          limit: query.limit ?? 25,
        },
      });

      const historicalData: HistoricalPriceData = {
        pair: response.data.pair,
        data: response.data.data
          .map((point: { timestamp: number; price: string }) => ({
            timestamp: point.timestamp,
            price: point.price,
          }))
          .reverse(),
      };

      this.logger.debug(`Fetched ${historicalData.data.length} historical points for ${query.pair}`);

      return historicalData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error fetching historical prices for ${query.pair}: ${errorMessage}`, error instanceof Error ? error : undefined);
      throw error;
    }
  }
}

// Re-export types for backward compatibility
export { CryptoPrice, HistoricalPriceData, HistoricalPriceQuery } from '../core/interfaces/data-source.interface';
