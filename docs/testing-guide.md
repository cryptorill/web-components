# Testing Guide

## Testing Philosophy

The CryptoRill library is designed with testability in mind:

- **Dependency Injection**: All services are injected, making them easy to mock
- **Interface-Based Design**: Components depend on interfaces, not implementations
- **Built-in Mocks**: Comprehensive mock implementations for all services
- **Clear Boundaries**: Well-defined interfaces between layers

## Testing Utilities

### Test Helpers

Import from `@cryptorill/core/testing`:

```typescript
import { wait, createDeferred, flushPromises } from '@cryptorill/core/testing';

// Wait for a duration
await wait(100); // Wait 100ms

// Create a deferred promise
const deferred = createDeferred<string>();
setTimeout(() => deferred.resolve('done'), 50);
const result = await deferred.promise;

// Flush pending promises
await flushPromises(); // Process all microtasks
```

## Mock Services

### MockLogger

Captures log messages for assertions:

```typescript
import { MockLogger } from '@cryptorill/core/testing';

const mockLogger = new MockLogger();

// Use in component or service
mockLogger.info('User logged in', { userId: 123 });
mockLogger.error('Request failed', error);

// Assert on logs
expect(mockLogger.getLogs()).toHaveLength(2);
expect(mockLogger.hasMessage('info', 'User logged in')).toBe(true);
expect(mockLogger.getLogsByLevel('error')).toHaveLength(1);

// Get last log
const lastLog = mockLogger.getLastLog();
expect(lastLog?.level).toBe('error');

// Clear logs between tests
mockLogger.clear();
```

**MockLogger API:**

| Method                                | Description                |
| ------------------------------------- | -------------------------- |
| `getLogs(): LogEntry[]`               | Get all logged messages    |
| `clear(): void`                       | Clear all logs             |
| `hasMessage(level, pattern): boolean` | Check for specific message |
| `getLogsByLevel(level): LogEntry[]`   | Filter logs by level       |
| `getLastLog(): LogEntry \| undefined` | Get most recent log        |

### MockHttpClient

Stub HTTP requests with configured responses:

```typescript
import { MockHttpClient } from '@cryptorill/core/testing';

const mockHttp = new MockHttpClient();

// Set up responses
mockHttp.setResponse('/api/prices', {
  status: 200,
  data: { btc: 50000, eth: 3000 },
  headers: {},
});

// Set up errors
mockHttp.setError('/api/fail', {
  message: 'Network error',
  status: 500,
});

// Set default response
mockHttp.setDefaultResponse({
  status: 404,
  data: { error: 'Not found' },
});

// Make requests
const response = await mockHttp.get('/api/prices');

// Assert on requests
expect(mockHttp.wasRequested('GET', '/api/prices')).toBe(true);
expect(mockHttp.getRequests()).toHaveLength(1);

// Clear between tests
mockHttp.clear();
```

**MockHttpClient API:**

| Method                             | Description                      |
| ---------------------------------- | -------------------------------- |
| `setResponse(url, response)`       | Configure success response       |
| `setError(url, error)`             | Configure error response         |
| `setDefaultResponse(response)`     | Set fallback response            |
| `clear()`                          | Reset all responses and requests |
| `getRequests()`                    | Get tracked requests             |
| `wasRequested(method, urlPattern)` | Check if request was made        |

### MockPriceDataSource

Mock cryptocurrency price data:

```typescript
import { MockPriceDataSource } from '@cryptorill/core/testing';

const mockDataSource = new MockPriceDataSource();

// Set prices
mockDataSource.setPrice('BTC', '50000');
mockDataSource.setPrice('ETH', {
  id: 'ethereum',
  name: 'Ethereum',
  symbol: 'ETH',
  price: '3000',
});

// Simulate failures
mockDataSource.setShouldFail(true);
mockDataSource.setShouldFail(false); // Reset

// Add artificial delay
mockDataSource.setDelay(100); // 100ms delay

// Fetch prices
const prices = await mockDataSource.fetchPrices(['BTC', 'ETH']);

// Clear between tests
mockDataSource.clear();
```

**MockPriceDataSource API:**

| Method                    | Description          |
| ------------------------- | -------------------- |
| `setPrice(symbol, price)` | Set price for symbol |
| `setShouldFail(value)`    | Toggle failure mode  |
| `setDelay(ms)`            | Set artificial delay |
| `clear()`                 | Remove all prices    |
| `fetchPrice(symbol)`      | Get single price     |
| `fetchPrices(symbols)`    | Get multiple prices  |

## Unit Test Examples

### Testing Services

```typescript
import { RetryService } from '@cryptorill/core';
import { MockLogger } from '@cryptorill/core/testing';

describe('RetryService', () => {
  let service: RetryService;
  let mockLogger: MockLogger;

  beforeEach(() => {
    mockLogger = new MockLogger();
    service = new RetryService(mockLogger);
  });

  it('should retry failed operations', async () => {
    let attempts = 0;
    const operation = jest.fn().mockImplementation(() => {
      attempts++;
      if (attempts < 3) throw new Error('Failed');
      return 'success';
    });

    const result = await service.execute(operation, { maxRetries: 3 });

    expect(result).toBe('success');
    expect(attempts).toBe(3);
  });

  it('should open circuit after threshold failures', async () => {
    const operation = jest.fn().mockRejectedValue(new Error('Failed'));

    // Exceed failure threshold
    for (let i = 0; i < 6; i++) {
      try {
        await service.execute(operation);
      } catch {
        // Expected
      }
    }

    expect(service.getCircuitState()).toBe('open');
    expect(mockLogger.hasMessage('warn', 'Circuit breaker opened')).toBe(true);
  });
});
```

### Testing with DI Container

```typescript
import { container, PRICE_DATA_SOURCE_TOKEN, LOGGER_TOKEN, initializeCoreModule, resetCoreModule } from '@cryptorill/core';
import { MockPriceDataSource, MockLogger } from '@cryptorill/core/testing';

describe('Component with DI', () => {
  beforeEach(() => {
    resetCoreModule();
    initializeCoreModule({ production: true });
  });

  it('should use mock data source', async () => {
    // Replace with mock
    const mockDataSource = new MockPriceDataSource();
    mockDataSource.setPrice('BTC', '50000');
    container.registerInstance(PRICE_DATA_SOURCE_TOKEN, mockDataSource);

    // Component will now use mock
    const dataSource = container.resolve(PRICE_DATA_SOURCE_TOKEN);
    const prices = await dataSource.fetchPrices(['BTC']);

    expect(prices[0].price).toBe('50000');
  });
});
```

## Component Test Patterns

### Testing Stencil Components

```typescript
import { newSpecPage } from '@stencil/core/testing';
import { CryptorillPrice } from './cryptorill-price';

describe('cryptorill-price', () => {
  it('renders with price', async () => {
    const page = await newSpecPage({
      components: [CryptorillPrice],
      html: `<cryptorill-price value="50000"></cryptorill-price>`,
    });

    expect(page.root).toMatchSnapshot();
    expect(page.root?.textContent).toContain('$50,000.00');
  });

  it('updates on value change', async () => {
    const page = await newSpecPage({
      components: [CryptorillPrice],
      html: `<cryptorill-price value="100"></cryptorill-price>`,
    });

    // Update prop
    const component = page.rootInstance as CryptorillPrice;
    component.value = '200';
    await page.waitForChanges();

    expect(page.root?.textContent).toContain('$200.00');
  });
});
```

### Testing Components with DI

```typescript
import { newSpecPage } from '@stencil/core/testing';
import { CryptorillPriceTicker } from './cryptorill-price-ticker';
import { container, PRICE_DATA_SOURCE_TOKEN, LOGGER_TOKEN } from '@cryptorill/core';
import { MockPriceDataSource, MockLogger, resetCoreModule } from '@cryptorill/core/testing';

describe('cryptorill-price-ticker', () => {
  beforeEach(() => {
    resetCoreModule();
  });

  it('fetches and displays price', async () => {
    // Setup mocks
    const mockDataSource = new MockPriceDataSource();
    mockDataSource.setPrice('BTC', '50000');
    container.registerInstance(PRICE_DATA_SOURCE_TOKEN, mockDataSource);

    container.registerInstance(LOGGER_TOKEN, new MockLogger());

    // Render component
    const page = await newSpecPage({
      components: [CryptorillPriceTicker],
      html: `<cryptorill-price-ticker symbol="BTC"></cryptorill-price-ticker>`,
    });

    // Wait for async fetch
    await page.waitForChanges();
    await flushPromises();
    await page.waitForChanges();

    expect(page.root?.textContent).toContain('BTC');
    expect(page.root?.textContent).toContain('50,000');
  });
});
```

## Mocking Services Guide

### Pattern 1: Direct Injection

For components using `@Inject` decorator:

```typescript
// In test setup
const mockLogger = new MockLogger();
container.registerInstance(LOGGER_TOKEN, mockLogger);
```

### Pattern 2: Factory Registration

For services with dependencies:

```typescript
container.registerSingleton(PRICE_DATA_SOURCE_TOKEN, () => {
  const httpClient = container.resolve<IHttpClient>(HTTP_CLIENT_TOKEN);
  const config = container.resolve<IAppConfiguration>(CONFIG_TOKEN);
  const logger = container.resolve<ILogger>(LOGGER_TOKEN);

  return new MockPriceDataSource();
});
```

### Pattern 3: Spy on Services

Wrap real services with spies:

```typescript
import { CoinMetadataService } from '@cryptorill/core';

const realService = new CoinMetadataService();
const spy = jest.spyOn(realService, 'getMetadata');

container.registerInstance(COIN_METADATA_SERVICE_TOKEN, realService);

// Assert spy was called
expect(spy).toHaveBeenCalledWith('BTC');
```

### Pattern 4: Conditional Mocking

Return different responses based on input:

```typescript
class ConditionalMockDataSource implements IPriceDataSource {
  async fetchPrices(symbols: string[]): Promise<CryptoPrice[]> {
    return symbols.map(symbol => ({
      id: symbol.toLowerCase(),
      name: symbol.toUpperCase(),
      symbol: symbol.toUpperCase(),
      price: symbol === 'BTC' ? '50000' : '1000',
    }));
  }

  async fetchPrice(symbol: string): Promise<CryptoPrice> {
    const prices = await this.fetchPrices([symbol]);
    return prices[0];
  }
}

container.registerInstance(PRICE_DATA_SOURCE_TOKEN, new ConditionalMockDataSource());
```

## Test Organization

### File Structure

```
src/
├── components/
│   └── my-component/
│       ├── my-component.tsx
│       └── my-component.spec.ts  # Component tests
├── core/
│   └── services/
│       ├── my-service.ts
│       └── my-service.spec.ts    # Service tests
└── testing/
    └── mocks/
        ├── mock-logger.ts        # Mock implementations
        └── mock-http-client.ts
```

### Test Naming

Follow descriptive naming patterns:

```typescript
// Good
describe('RetryService', () => {
  describe('execute', () => {
    it('should return result on successful operation', async () => {});
    it('should retry on transient failure', async () => {});
    it('should throw after max retries exceeded', async () => {});
    it('should open circuit after threshold failures', async () => {});
  });
});

// Bad
describe('test', () => {
  it('works', async () => {});
});
```

## Best Practices

### 1. Reset State Between Tests

```typescript
beforeEach(() => {
  resetCoreModule();
  initializeCoreModule({ production: true });
});
```

### 2. Assert on Mock Interactions

```typescript
// Verify logger was called
expect(mockLogger.hasMessage('error', 'Failed to fetch')).toBe(true);

// Verify HTTP request was made
expect(mockHttp.wasRequested('GET', '/api/prices')).toBe(true);

// Verify data source was called
expect(mockDataSource.fetchPrices).toHaveBeenCalledWith(['BTC', 'ETH']);
```

### 3. Test Error Cases

```typescript
it('should handle fetch errors gracefully', async () => {
  mockDataSource.setShouldFail(true);

  const page = await newSpecPage({
    components: [MyComponent],
    html: `<my-component></my-component>`,
  });

  await page.waitForChanges();

  expect(page.root?.textContent).toContain('Error');
});
```

### 4. Use Realistic Test Data

```typescript
// Good - realistic values
mockDataSource.setPrice('BTC', '52347.89');

// Bad - placeholder values
mockDataSource.setPrice('BTC', '123');
```

### 5. Test Async Behavior

```typescript
it('should poll for updates', async () => {
  jest.useFakeTimers();

  const page = await newSpecPage({
    components: [PollingComponent],
    html: `<polling-component interval="1000"></polling-component>`,
  });

  // Initial fetch
  expect(mockDataSource.fetchPrices).toHaveBeenCalledTimes(1);

  // Advance timer
  jest.advanceTimersByTime(1000);
  await flushPromises();

  // Should have fetched again
  expect(mockDataSource.fetchPrices).toHaveBeenCalledTimes(2);

  jest.useRealTimers();
});
```

## Common Pitfalls

### 1. Forgetting to Wait for Changes

```typescript
// Bad - may miss updates
component.value = 'new';
expect(page.root?.textContent).toContain('new');

// Good
component.value = 'new';
await page.waitForChanges();
expect(page.root?.textContent).toContain('new');
```

### 2. Not Resetting DI Container

```typescript
// Bad - tests may interfere
it('test 1', () => {
  container.registerInstance(TOKEN, mock1);
});

it('test 2', () => {
  // May still have mock1 registered!
});

// Good
beforeEach(() => {
  resetCoreModule();
});
```

### 3. Missing await on Async Operations

```typescript
// Bad
component.fetchData();
expect(mockHttp.getRequests()).toHaveLength(1);

// Good
await component.fetchData();
expect(mockHttp.getRequests()).toHaveLength(1);
```
