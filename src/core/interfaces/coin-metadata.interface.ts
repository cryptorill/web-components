/**
 * Coin metadata containing display information
 */
export interface CoinMetadata {
  /** Symbol of the cryptocurrency (e.g., "BTC") */
  symbol: string;
  /** Full name of the cryptocurrency (e.g., "Bitcoin") */
  name: string;
  /** Display icon/emoji for the coin */
  icon: string;
  /** CSS gradient for the coin's visual theme */
  gradient: string;
  /** Optional: Primary color hex code */
  primaryColor?: string;
  /** Optional: Coin category (e.g., "layer1", "defi", "meme") */
  category?: string;
  /** Optional: Market cap rank */
  rank?: number;
}

/**
 * Interface for coin metadata service
 * Provides access to coin display information and metadata
 */
export interface ICoinMetadataService {
  /**
   * Get metadata for a specific coin
   * @param symbol - Cryptocurrency symbol (e.g., "BTC")
   * @returns CoinMetadata or undefined if not found
   */
  getMetadata(symbol: string): CoinMetadata | undefined;

  /**
   * Get display name for a coin
   * @param symbol - Cryptocurrency symbol
   * @returns Display name or symbol if not found
   */
  getDisplayName(symbol: string): string;

  /**
   * Get icon for a coin
   * @param symbol - Cryptocurrency symbol
   * @returns Icon/emoji or first letter of symbol if not found
   */
  getIcon(symbol: string): string;

  /**
   * Get gradient for a coin
   * @param symbol - Cryptocurrency symbol
   * @returns CSS gradient or default gradient if not found
   */
  getGradient(symbol: string): string;

  /**
   * Get all available metadata
   * @returns Array of all CoinMetadata
   */
  getAllMetadata(): CoinMetadata[];

  /**
   * Check if metadata exists for a symbol
   * @param symbol - Cryptocurrency symbol
   * @returns True if metadata exists
   */
  hasMetadata(symbol: string): boolean;

  /**
   * Register new coin metadata
   * @param metadata - CoinMetadata to register
   */
  registerMetadata(metadata: CoinMetadata): void;

  /**
   * Register multiple coin metadata entries
   * @param metadataArray - Array of CoinMetadata to register
   */
  registerMetadataArray(metadataArray: CoinMetadata[]): void;
}
