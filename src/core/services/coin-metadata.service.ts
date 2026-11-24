import { ICoinMetadataService, CoinMetadata } from '../interfaces/coin-metadata.interface';

/**
 * Default coin metadata for popular cryptocurrencies
 */
const DEFAULT_COIN_METADATA: CoinMetadata[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    icon: '₿',
    gradient: 'linear-gradient(135deg, #f7931a 0%, #ffab40 100%)',
    primaryColor: '#f7931a',
    category: 'layer1',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: 'Ξ',
    gradient: 'linear-gradient(135deg, #627eea 0%, #8bacff 100%)',
    primaryColor: '#627eea',
    category: 'layer1',
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    icon: '◎',
    gradient: 'linear-gradient(135deg, #9945ff 0%, #14f195 100%)',
    primaryColor: '#9945ff',
    category: 'layer1',
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    icon: '₳',
    gradient: 'linear-gradient(135deg, #0033ad 0%, #0051ff 100%)',
    primaryColor: '#0033ad',
    category: 'layer1',
  },
  {
    symbol: 'DOT',
    name: 'Polkadot',
    icon: '●',
    gradient: 'linear-gradient(135deg, #e6007a 0%, #ff4db3 100%)',
    primaryColor: '#e6007a',
    category: 'layer1',
  },
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    icon: '▲',
    gradient: 'linear-gradient(135deg, #e84142 0%, #ff6b6b 100%)',
    primaryColor: '#e84142',
    category: 'layer1',
  },
  {
    symbol: 'POL',
    name: 'Polygon',
    icon: '◈',
    gradient: 'linear-gradient(135deg, #8247e5 0%, #a855f7 100%)',
    primaryColor: '#8247e5',
    category: 'layer2',
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    icon: '⬡',
    gradient: 'linear-gradient(135deg, #2a5ada 0%, #4f8cff 100%)',
    primaryColor: '#2a5ada',
    category: 'oracle',
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    icon: '🦄',
    gradient: 'linear-gradient(135deg, #ff007a 0%, #ff6db3 100%)',
    primaryColor: '#ff007a',
    category: 'defi',
  },
  {
    symbol: 'AAVE',
    name: 'Aave',
    icon: '👻',
    gradient: 'linear-gradient(135deg, #b6509e 0%, #e09dd8 100%)',
    primaryColor: '#b6509e',
    category: 'defi',
  },
];

/**
 * Default gradient for unknown coins
 */
const DEFAULT_GRADIENT = 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)';

/**
 * Coin Metadata Service
 * Manages cryptocurrency display metadata (icons, names, gradients)
 * Supports dynamic registration of new coins
 */
export class CoinMetadataService implements ICoinMetadataService {
  private metadataMap: Map<string, CoinMetadata>;

  /**
   * Create a new CoinMetadataService
   * @param initialMetadata - Optional initial metadata to populate
   */
  constructor(initialMetadata: CoinMetadata[] = DEFAULT_COIN_METADATA) {
    this.metadataMap = new Map();
    this.registerMetadataArray(initialMetadata);
  }

  /**
   * Get metadata for a specific coin
   * @param symbol - Cryptocurrency symbol
   * @returns CoinMetadata or undefined if not found
   */
  getMetadata(symbol: string): CoinMetadata | undefined {
    return this.metadataMap.get(symbol.toUpperCase());
  }

  /**
   * Get display name for a coin
   * @param symbol - Cryptocurrency symbol
   * @returns Display name or symbol if not found
   */
  getDisplayName(symbol: string): string {
    const metadata = this.getMetadata(symbol);
    return metadata?.name ?? symbol.toUpperCase();
  }

  /**
   * Get icon for a coin
   * @param symbol - Cryptocurrency symbol
   * @returns Icon/emoji or first letter of symbol if not found
   */
  getIcon(symbol: string): string {
    const metadata = this.getMetadata(symbol);
    return metadata?.icon ?? symbol.charAt(0).toUpperCase();
  }

  /**
   * Get gradient for a coin
   * @param symbol - Cryptocurrency symbol
   * @returns CSS gradient or default gradient if not found
   */
  getGradient(symbol: string): string {
    const metadata = this.getMetadata(symbol);
    return metadata?.gradient ?? DEFAULT_GRADIENT;
  }

  /**
   * Get all available metadata
   * @returns Array of all CoinMetadata
   */
  getAllMetadata(): CoinMetadata[] {
    return Array.from(this.metadataMap.values());
  }

  /**
   * Check if metadata exists for a symbol
   * @param symbol - Cryptocurrency symbol
   * @returns True if metadata exists
   */
  hasMetadata(symbol: string): boolean {
    return this.metadataMap.has(symbol.toUpperCase());
  }

  /**
   * Register new coin metadata
   * @param metadata - CoinMetadata to register
   */
  registerMetadata(metadata: CoinMetadata): void {
    this.metadataMap.set(metadata.symbol.toUpperCase(), {
      ...metadata,
      symbol: metadata.symbol.toUpperCase(),
    });
  }

  /**
   * Register multiple coin metadata entries
   * @param metadataArray - Array of CoinMetadata to register
   */
  registerMetadataArray(metadataArray: CoinMetadata[]): void {
    metadataArray.forEach(metadata => this.registerMetadata(metadata));
  }

  /**
   * Remove metadata for a symbol
   * @param symbol - Cryptocurrency symbol to remove
   * @returns True if metadata was removed
   */
  removeMetadata(symbol: string): boolean {
    return this.metadataMap.delete(symbol.toUpperCase());
  }

  /**
   * Clear all metadata
   */
  clearMetadata(): void {
    this.metadataMap.clear();
  }
}

/**
 * Singleton instance with default coin metadata
 */
export const coinMetadataService = new CoinMetadataService();
