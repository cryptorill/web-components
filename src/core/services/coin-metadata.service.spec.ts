import { CoinMetadataService, coinMetadataService } from './coin-metadata.service';
import { CoinMetadata } from '../interfaces/coin-metadata.interface';

describe('CoinMetadataService', () => {
  let service: CoinMetadataService;

  beforeEach(() => {
    service = new CoinMetadataService();
  });

  describe('basic functionality', () => {
    it('should create service', () => {
      expect(service).toBeTruthy();
    });

    it('should have default metadata for popular coins', () => {
      expect(service.hasMetadata('BTC')).toBe(true);
      expect(service.hasMetadata('ETH')).toBe(true);
      expect(service.hasMetadata('SOL')).toBe(true);
    });

    it('should get metadata for BTC', () => {
      const metadata = service.getMetadata('BTC');
      expect(metadata).toBeTruthy();
      expect(metadata?.symbol).toBe('BTC');
      expect(metadata?.name).toBe('Bitcoin');
    });

    it('should get metadata for ETH', () => {
      const metadata = service.getMetadata('ETH');
      expect(metadata).toBeTruthy();
      expect(metadata?.symbol).toBe('ETH');
      expect(metadata?.name).toBe('Ethereum');
    });

    it('should return undefined for unknown coins', () => {
      const metadata = service.getMetadata('UNKNOWN');
      expect(metadata).toBeUndefined();
    });
  });

  describe('display name', () => {
    it('should get display name for known coin', () => {
      const name = service.getDisplayName('BTC');
      expect(name).toBe('Bitcoin');
    });

    it('should return symbol uppercase for unknown coin', () => {
      const name = service.getDisplayName('unknown');
      expect(name).toBe('UNKNOWN');
    });

    it('should handle lowercase symbol input', () => {
      const name = service.getDisplayName('btc');
      expect(name).toBe('Bitcoin');
    });

    it('should handle mixed case symbol input', () => {
      const name = service.getDisplayName('bTc');
      expect(name).toBe('Bitcoin');
    });
  });

  describe('icon retrieval', () => {
    it('should get icon for BTC', () => {
      const icon = service.getIcon('BTC');
      expect(icon).toBe('₿');
    });

    it('should get icon for ETH', () => {
      const icon = service.getIcon('ETH');
      expect(icon).toBe('Ξ');
    });

    it('should return first letter for unknown coin', () => {
      const icon = service.getIcon('UNKNOWN');
      expect(icon).toBe('U');
    });

    it('should handle lowercase symbol for icon', () => {
      const icon = service.getIcon('btc');
      expect(icon).toBe('₿');
    });
  });

  describe('gradient retrieval', () => {
    it('should get gradient for BTC', () => {
      const gradient = service.getGradient('BTC');
      expect(gradient).toContain('linear-gradient');
      expect(gradient).toContain('#f7931a');
    });

    it('should get gradient for ETH', () => {
      const gradient = service.getGradient('ETH');
      expect(gradient).toContain('linear-gradient');
      expect(gradient).toContain('#627eea');
    });

    it('should return default gradient for unknown coin', () => {
      const gradient = service.getGradient('UNKNOWN');
      expect(gradient).toContain('linear-gradient');
      expect(gradient).toContain('#6366f1');
    });

    it('should handle lowercase symbol for gradient', () => {
      const gradient = service.getGradient('btc');
      expect(gradient).toContain('#f7931a');
    });
  });

  describe('gradient generation', () => {
    it('should have gradients for all default coins', () => {
      const allMetadata = service.getAllMetadata();
      allMetadata.forEach(metadata => {
        expect(metadata.gradient).toContain('linear-gradient');
        expect(metadata.gradient).toContain('135deg');
      });
    });

    it('should have primary colors for all default coins', () => {
      const allMetadata = service.getAllMetadata();
      allMetadata.forEach(metadata => {
        expect(metadata.primaryColor).toBeTruthy();
        expect(metadata.primaryColor).toContain('#');
      });
    });

    it('should have unique gradients for different coins', () => {
      const btcGradient = service.getGradient('BTC');
      const ethGradient = service.getGradient('ETH');
      expect(btcGradient).not.toBe(ethGradient);
    });
  });

  describe('icon URL generation', () => {
    it('should have icons for all default coins', () => {
      const allMetadata = service.getAllMetadata();
      allMetadata.forEach(metadata => {
        expect(metadata.icon).toBeTruthy();
        expect(metadata.icon.length).toBeGreaterThan(0);
      });
    });

    it('should have unique icons for different coins', () => {
      const btcIcon = service.getIcon('BTC');
      const ethIcon = service.getIcon('ETH');
      expect(btcIcon).not.toBe(ethIcon);
    });
  });

  describe('caching behavior', () => {
    it('should return same metadata instance', () => {
      const metadata1 = service.getMetadata('BTC');
      const metadata2 = service.getMetadata('BTC');
      expect(metadata1).toBe(metadata2);
    });

    it('should have all metadata available', () => {
      const allMetadata = service.getAllMetadata();
      expect(allMetadata.length).toBeGreaterThan(0);
      expect(allMetadata.some(m => m.symbol === 'BTC')).toBe(true);
      expect(allMetadata.some(m => m.symbol === 'ETH')).toBe(true);
    });
  });

  describe('coin categories', () => {
    it('should categorize BTC as layer1', () => {
      const metadata = service.getMetadata('BTC');
      expect(metadata?.category).toBe('layer1');
    });

    it('should categorize ETH as layer1', () => {
      const metadata = service.getMetadata('ETH');
      expect(metadata?.category).toBe('layer1');
    });

    it('should categorize POL as layer2', () => {
      const metadata = service.getMetadata('POL');
      expect(metadata?.category).toBe('layer2');
    });

    it('should categorize LINK as oracle', () => {
      const metadata = service.getMetadata('LINK');
      expect(metadata?.category).toBe('oracle');
    });
  });

  describe('registration', () => {
    it('should register new metadata', () => {
      const newMetadata: CoinMetadata = {
        symbol: 'NEW',
        name: 'New Coin',
        icon: '🆕',
        gradient: 'linear-gradient(135deg, #ff0000 0%, #00ff00 100%)',
        primaryColor: '#ff0000',
        category: 'test',
      };

      service.registerMetadata(newMetadata);

      expect(service.hasMetadata('NEW')).toBe(true);
      expect(service.getDisplayName('NEW')).toBe('New Coin');
    });

    it('should register metadata with uppercase symbol', () => {
      const newMetadata: CoinMetadata = {
        symbol: 'new',
        name: 'New Coin',
        icon: '🆕',
        gradient: 'linear-gradient(135deg, #ff0000 0%, #00ff00 100%)',
      };

      service.registerMetadata(newMetadata);

      expect(service.hasMetadata('NEW')).toBe(true);
      expect(service.hasMetadata('new')).toBe(true);
    });

    it('should update existing metadata on re-registration', () => {
      // Verify BTC metadata exists before update
      expect(service.hasMetadata('BTC')).toBe(true);

      const updatedMetadata: CoinMetadata = {
        symbol: 'BTC',
        name: 'Updated Bitcoin',
        icon: '₿',
        gradient: 'linear-gradient(135deg, #000000 0%, #ffffff 100%)',
      };

      service.registerMetadata(updatedMetadata);

      const newMetadata = service.getMetadata('BTC');
      expect(newMetadata?.name).toBe('Updated Bitcoin');
    });

    it('should register multiple metadata entries', () => {
      const newCoins: CoinMetadata[] = [
        {
          symbol: 'COIN1',
          name: 'Coin One',
          icon: '1️⃣',
          gradient: 'linear-gradient(135deg, #ff0000 0%, #ff9999 100%)',
        },
        {
          symbol: 'COIN2',
          name: 'Coin Two',
          icon: '2️⃣',
          gradient: 'linear-gradient(135deg, #00ff00 0%, #99ff99 100%)',
        },
      ];

      service.registerMetadataArray(newCoins);

      expect(service.hasMetadata('COIN1')).toBe(true);
      expect(service.hasMetadata('COIN2')).toBe(true);
    });
  });

  describe('removal', () => {
    it('should remove metadata', () => {
      service.registerMetadata({
        symbol: 'REMOVE',
        name: 'To Remove',
        icon: '🗑️',
        gradient: 'linear-gradient(135deg, #000000 0%, #ffffff 100%)',
      });

      expect(service.hasMetadata('REMOVE')).toBe(true);

      const removed = service.removeMetadata('REMOVE');

      expect(removed).toBe(true);
      expect(service.hasMetadata('REMOVE')).toBe(false);
    });

    it('should return false when removing non-existent metadata', () => {
      const removed = service.removeMetadata('NONEXISTENT');
      expect(removed).toBe(false);
    });

    it('should handle lowercase when removing', () => {
      service.registerMetadata({
        symbol: 'REMOVE',
        name: 'To Remove',
        icon: '🗑️',
        gradient: 'linear-gradient(135deg, #000000 0%, #ffffff 100%)',
      });

      const removed = service.removeMetadata('remove');
      expect(removed).toBe(true);
    });

    it('should clear all metadata', () => {
      service.clearMetadata();

      expect(service.hasMetadata('BTC')).toBe(false);
      expect(service.hasMetadata('ETH')).toBe(false);
      expect(service.getAllMetadata().length).toBe(0);
    });
  });

  describe('singleton instance', () => {
    it('should have singleton instance available', () => {
      expect(coinMetadataService).toBeTruthy();
      expect(coinMetadataService).toBeInstanceOf(CoinMetadataService);
    });

    it('singleton should have default coins', () => {
      expect(coinMetadataService.hasMetadata('BTC')).toBe(true);
      expect(coinMetadataService.hasMetadata('ETH')).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty symbol', () => {
      const name = service.getDisplayName('');
      expect(name).toBe('');
    });

    it('should handle symbol with single character', () => {
      service.registerMetadata({
        symbol: 'X',
        name: 'X Coin',
        icon: '❌',
        gradient: 'linear-gradient(135deg, #000000 0%, #ffffff 100%)',
      });

      expect(service.getDisplayName('X')).toBe('X Coin');
      expect(service.getIcon('X')).toBe('❌');
    });

    it('should handle special characters in icon', () => {
      service.registerMetadata({
        symbol: 'EMOJI',
        name: 'Emoji Coin',
        icon: '🚀🌙',
        gradient: 'linear-gradient(135deg, #000000 0%, #ffffff 100%)',
      });

      expect(service.getIcon('EMOJI')).toBe('🚀🌙');
    });
  });
});
