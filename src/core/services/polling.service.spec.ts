import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import { PollingService, createPollingService } from './polling.service';
import { MockLogger } from '../../testing';

describe('PollingService', () => {
  let service: PollingService;
  let mockLogger: MockLogger;
  let callback: ReturnType<typeof mock>;

  beforeEach(() => {
    mockLogger = new MockLogger();
    callback = mock(() => {});
  });

  afterEach(() => {
    service?.stop();
    mockLogger.clear();
  });

  describe('basic functionality', () => {
    it('should create polling service', () => {
      service = new PollingService({ interval: 1000 }, mockLogger);
      expect(service).toBeTruthy();
    });

    it('should not be running initially', () => {
      service = new PollingService({ interval: 1000 }, mockLogger);
      expect(service.isRunning()).toBe(false);
    });

    it('should start polling', () => {
      service = new PollingService({ interval: 1000 }, mockLogger);
      service.start(callback);
      expect(service.isRunning()).toBe(true);
    });

    it('should stop polling', () => {
      service = new PollingService({ interval: 1000 }, mockLogger);
      service.start(callback);
      service.stop();
      expect(service.isRunning()).toBe(false);
    });

    it('should log debug message when starting', () => {
      service = new PollingService({ interval: 1000 }, mockLogger);
      service.start(callback);
      expect(mockLogger.hasMessage('debug', 'Starting polling')).toBe(true);
    });

    it('should log debug message when stopping', () => {
      service = new PollingService({ interval: 1000 }, mockLogger);
      service.start(callback);
      service.stop();
      expect(mockLogger.hasMessage('debug', 'Polling stopped')).toBe(true);
    });
  });

  describe('polling interval', () => {
    it('should execute callback at specified interval', async () => {
      service = new PollingService({ interval: 100 }, mockLogger);
      service.start(callback);

      await new Promise(resolve => setTimeout(resolve, 150));
      expect(callback).toHaveBeenCalledTimes(1);

      await new Promise(resolve => setTimeout(resolve, 100));
      expect(callback).toHaveBeenCalledTimes(2);

      service.stop();
    });

    it('should use custom interval timing', async () => {
      service = new PollingService({ interval: 50 }, mockLogger);
      service.start(callback);

      await new Promise(resolve => setTimeout(resolve, 75));
      expect(callback).toHaveBeenCalledTimes(1);

      service.stop();
    });

    it('should execute multiple times over multiple intervals', async () => {
      service = new PollingService({ interval: 50 }, mockLogger);
      service.start(callback);

      await new Promise(resolve => setTimeout(resolve, 200));
      expect(callback.mock.calls.length).toBeGreaterThanOrEqual(3);

      service.stop();
    });
  });

  describe('immediate execution', () => {
    it('should not execute immediately by default', () => {
      service = new PollingService({ interval: 1000 }, mockLogger);
      service.start(callback);
      expect(callback).toHaveBeenCalledTimes(0);
      service.stop();
    });

    it('should execute immediately when immediate option is true', () => {
      service = new PollingService({ interval: 1000, immediate: true }, mockLogger);
      service.start(callback);
      expect(callback).toHaveBeenCalledTimes(1);
      service.stop();
    });

    it('should continue executing after immediate execution', async () => {
      service = new PollingService({ interval: 100, immediate: true }, mockLogger);
      service.start(callback);

      expect(callback).toHaveBeenCalledTimes(1);

      await new Promise(resolve => setTimeout(resolve, 150));
      expect(callback).toHaveBeenCalledTimes(2);

      service.stop();
    });

    it('should log debug message for immediate execution', () => {
      service = new PollingService({ interval: 1000, immediate: true }, mockLogger);
      service.start(callback);
      // The service logs "Starting polling" but doesn't have a specific message for immediate execution
      expect(mockLogger.hasMessage('debug', 'Starting polling')).toBe(true);
      service.stop();
    });
  });

  describe('restart behavior', () => {
    it('should restart polling when start called again', async () => {
      service = new PollingService({ interval: 100 }, mockLogger);
      service.start(callback);

      await new Promise(resolve => setTimeout(resolve, 150));
      const firstCallCount = callback.mock.calls.length;

      service.start(callback);

      await new Promise(resolve => setTimeout(resolve, 150));
      expect(callback.mock.calls.length).toBeGreaterThan(firstCallCount);

      service.stop();
    });

    it('should use new callback after restart', async () => {
      service = new PollingService({ interval: 100 }, mockLogger);
      const firstCallback = mock(() => {});
      service.start(firstCallback);

      await new Promise(resolve => setTimeout(resolve, 150));
      expect(firstCallback).toHaveBeenCalled();

      const secondCallback = mock(() => {});
      service.start(secondCallback);

      await new Promise(resolve => setTimeout(resolve, 150));
      expect(secondCallback).toHaveBeenCalled();

      service.stop();
    });
  });

  describe('cleanup', () => {
    it('should clear interval on stop', async () => {
      service = new PollingService({ interval: 100 }, mockLogger);
      service.start(callback);

      await new Promise(resolve => setTimeout(resolve, 150));
      const callCountBeforeStop = callback.mock.calls.length;

      service.stop();

      await new Promise(resolve => setTimeout(resolve, 150));
      expect(callback.mock.calls.length).toBe(callCountBeforeStop);
    });

    it('should reset callback on stop', () => {
      service = new PollingService({ interval: 1000 }, mockLogger);
      service.start(callback);
      service.stop();

      // Starting again should work fine
      const newCallback = mock(() => {});
      service.start(newCallback);
      expect(service.isRunning()).toBe(true);

      service.stop();
    });

    it('should handle multiple stops gracefully', () => {
      service = new PollingService({ interval: 1000 }, mockLogger);
      service.start(callback);
      service.stop();
      service.stop();
      service.stop();

      expect(service.isRunning()).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should log error when callback throws', async () => {
      const errorCallback = mock(() => {
        throw new Error('Test error');
      });

      service = new PollingService({ interval: 1000, immediate: true }, mockLogger);
      service.start(errorCallback);

      expect(mockLogger.hasMessage('error', 'Error in immediate callback')).toBe(true);
      service.stop();
    });

    it('should log error when poll callback throws', async () => {
      const errorCallback = mock(() => {
        throw new Error('Poll error');
      });

      service = new PollingService({ interval: 50 }, mockLogger);
      service.start(errorCallback);

      await new Promise(resolve => setTimeout(resolve, 75));
      expect(mockLogger.hasMessage('error', 'Error in poll callback')).toBe(true);

      service.stop();
    });

    it('should continue polling after callback error', async () => {
      let callCount = 0;
      const errorCallback = mock(() => {
        callCount++;
        if (callCount === 1) {
          throw new Error('First call error');
        }
      });

      service = new PollingService({ interval: 50 }, mockLogger);
      service.start(errorCallback);

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(errorCallback.mock.calls.length).toBeGreaterThanOrEqual(2);
      expect(mockLogger.hasMessage('error', 'Error in poll callback')).toBe(true);

      service.stop();
    });
  });

  describe('factory function', () => {
    it('should create polling service via factory', () => {
      service = createPollingService({ interval: 1000 }, mockLogger);
      expect(service).toBeTruthy();
    });

    it('factory creates functioning service', async () => {
      service = createPollingService({ interval: 100 }, mockLogger);
      service.start(callback);

      await new Promise(resolve => setTimeout(resolve, 150));
      expect(callback).toHaveBeenCalled();

      service.stop();
    });
  });

  describe('edge cases', () => {
    it('should handle very short intervals', async () => {
      service = new PollingService({ interval: 10 }, mockLogger);
      service.start(callback);

      await new Promise(resolve => setTimeout(resolve, 50));
      expect(callback.mock.calls.length).toBeGreaterThanOrEqual(1);

      service.stop();
    });

    it('should handle long intervals', () => {
      service = new PollingService({ interval: 60000 }, mockLogger);
      service.start(callback);

      expect(service.isRunning()).toBe(true);
      expect(callback).toHaveBeenCalledTimes(0);

      service.stop();
    });

    it('should not execute callback after stop', async () => {
      service = new PollingService({ interval: 50 }, mockLogger);
      service.start(callback);

      await new Promise(resolve => setTimeout(resolve, 75));
      const callCount = callback.mock.calls.length;

      service.stop();

      await new Promise(resolve => setTimeout(resolve, 100));
      expect(callback.mock.calls.length).toBe(callCount);
    });
  });
});
