# Dependency Injection Guide

## Overview

CryptoRill uses a lightweight Dependency Injection (DI) container for managing service dependencies. This provides:

- **Loose coupling**: Components depend on interfaces, not concrete implementations
- **Testability**: Easy to inject mocks for testing
- **Lifecycle management**: Control over singleton vs transient instances
- **Centralized configuration**: Single place to wire up the application

## DI Container

### Container Instance

The DI container is a singleton that manages all service registrations:

```typescript
import { container, DIContainer } from '@cryptorill/core';

// Get the global container instance
const di = container;

// Or get the singleton instance directly
const di = DIContainer.getInstance();
```

### Service Registration

Services can be registered in three ways:

#### 1. Singleton Registration

A single instance is created and reused for all resolutions:

```typescript
import { container, LOGGER_TOKEN } from '@cryptorill/core';
import { ConsoleLogger } from '@cryptorill/core';

container.registerSingleton(LOGGER_TOKEN, () => new ConsoleLogger('debug'));

// Same instance every time
const logger1 = container.resolve(LOGGER_TOKEN);
const logger2 = container.resolve(LOGGER_TOKEN);
console.log(logger1 === logger2); // true
```

#### 2. Transient Registration

A new instance is created for each resolution:

```typescript
import { container, POLLING_SERVICE_TOKEN } from '@cryptorill/core';
import { PollingService } from '@cryptorill/core';

container.registerTransient(POLLING_SERVICE_TOKEN, () => {
  return new PollingService({ interval: 30000 }, logger);
});

// Different instances
const polling1 = container.resolve(POLLING_SERVICE_TOKEN);
const polling2 = container.resolve(POLLING_SERVICE_TOKEN);
console.log(polling1 === polling2); // false
```

#### 3. Instance Registration

Register an existing instance (useful for testing):

```typescript
import { container, LOGGER_TOKEN } from '@cryptorill/core';
import { MockLogger } from '@cryptorill/core/testing';

const mockLogger = new MockLogger();
container.registerInstance(LOGGER_TOKEN, mockLogger);

// Same instance is returned
const logger = container.resolve(LOGGER_TOKEN);
console.log(logger === mockLogger); // true
```

## Injection Tokens

Tokens are symbols used to identify services in the container:

| Token                         | Service Interface      | Description                   |
| ----------------------------- | ---------------------- | ----------------------------- |
| `PRICE_DATA_SOURCE_TOKEN`     | `IPriceDataSource`     | Fetches cryptocurrency prices |
| `LOGGER_TOKEN`                | `ILogger`              | Application logging           |
| `CONFIG_TOKEN`                | `IAppConfiguration`    | Configuration management      |
| `POLLING_SERVICE_TOKEN`       | `IPollingService`      | Periodic updates              |
| `COIN_METADATA_SERVICE_TOKEN` | `ICoinMetadataService` | Coin display metadata         |
| `HTTP_CLIENT_TOKEN`           | `IHttpClient`          | HTTP communication            |
| `ERROR_HANDLER_TOKEN`         | `IErrorHandler`        | Error handling                |
| `RETRY_SERVICE_TOKEN`         | `IRetryService`        | Retry with circuit breaker    |
| `PRICE_FORMATTER_TOKEN`       | `IPriceFormatter`      | Price formatting              |

## Injecting Dependencies

### Using the @Inject Decorator

The `@Inject` decorator enables property-based injection:

```typescript
import { Component, Prop } from '@stencil/core';
import { Inject } from '@cryptorill/core';
import { LOGGER_TOKEN, PRICE_DATA_SOURCE_TOKEN } from '@cryptorill/core';
import { ILogger, IPriceDataSource } from '@cryptorill/core';

@Component({
  tag: 'my-component',
  shadow: true,
})
export class MyComponent {
  @Inject(LOGGER_TOKEN) private logger!: ILogger;
  @Inject(PRICE_DATA_SOURCE_TOKEN) private dataSource!: IPriceDataSource;

  async componentWillLoad() {
    this.logger.info('Component loading...');
    const prices = await this.dataSource.fetchPrices(['BTC', 'ETH']);
  }
}
```

### Using Container.resolve

Direct resolution from the container:

```typescript
import { container, LOGGER_TOKEN } from '@cryptorill/core';
import type { ILogger } from '@cryptorill/core';

const logger = container.resolve<ILogger>(LOGGER_TOKEN);
logger.info('Hello from resolved logger');
```

## Lifecycle Management

### Singleton Services

Use singletons for:

- Shared state (configuration, metadata)
- Expensive to create (HTTP clients)
- Stateless services (formatters)

```typescript
// Registered once, reused everywhere
container.registerSingleton(COIN_METADATA_SERVICE_TOKEN, () => {
  return new CoinMetadataService();
});
```

### Transient Services

Use transients for:

- Services with instance-specific state (polling intervals)
- Services that need cleanup (timers, subscriptions)
- Per-component services

```typescript
// New instance for each component
container.registerTransient(POLLING_SERVICE_TOKEN, () => {
  return new PollingService({ interval: 30000 }, logger);
});
```

## Module Initialization

### initializeCoreModule

The `initializeCoreModule` function wires up all core services:

```typescript
import { initializeCoreModule } from '@cryptorill/core';

// Development mode
initializeCoreModule({
  production: false,
  logLevel: 'debug',
});

// Production mode (uses NoopLogger)
initializeCoreModule({
  production: true,
});

// With custom configuration
initializeCoreModule({
  production: false,
  config: {
    apiBaseUrl: 'https://custom-api.example.com',
    defaultPollingInterval: 60000,
  },
});

// With custom logger
import { MyCustomLogger } from './my-logger';
initializeCoreModule({
  logger: new MyCustomLogger(),
});
```

### Configuration Interface

```typescript
interface CoreModuleConfig {
  /** Whether to use production mode (noop logger) */
  production?: boolean;
  /** Custom logger implementation */
  logger?: ILogger;
  /** Custom configuration */
  config?: IAppConfiguration;
  /** Log level for console logger */
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}
```

## Testing with DI

### Resetting the Container

Always reset the container between tests:

```typescript
import { resetCoreModule, initializeCoreModule } from '@cryptorill/core';

beforeEach(() => {
  resetCoreModule();
  initializeCoreModule({ production: true });
});
```

### Injecting Mocks

Replace services with mocks for testing:

```typescript
import { container, PRICE_DATA_SOURCE_TOKEN, LOGGER_TOKEN } from '@cryptorill/core';
import { MockPriceDataSource, MockLogger } from '@cryptorill/core/testing';

it('should display prices', async () => {
  // Setup mocks
  const mockDataSource = new MockPriceDataSource();
  mockDataSource.setPrice('BTC', '50000');
  container.registerInstance(PRICE_DATA_SOURCE_TOKEN, mockDataSource);

  const mockLogger = new MockLogger();
  container.registerInstance(LOGGER_TOKEN, mockLogger);

  // Test component...
});
```

## Best Practices

### 1. Depend on Interfaces

Always inject interfaces, not concrete classes:

```typescript
// Good
@Inject(LOGGER_TOKEN) private logger!: ILogger;

// Bad - tight coupling
private logger = new ConsoleLogger();
```

### 2. Use Non-Null Assertions

TypeScript doesn't know the DI container will provide the value:

```typescript
@Inject(LOGGER_TOKEN) private logger!: ILogger; // Note the !
```

### 3. Initialize Module Early

Call `initializeCoreModule` before any components render:

```typescript
// main.ts or app entry point
import { initializeCoreModule } from '@cryptorill/core';

initializeCoreModule({ production: false });
```

### 4. Register Services Lazily

Services are created only when first resolved (for singletons):

```typescript
// Registration doesn't create the instance
container.registerSingleton(EXPENSIVE_SERVICE_TOKEN, () => {
  return new ExpensiveService(); // Created on first resolve
});
```

### 5. Handle Missing Services

The container throws if a service isn't registered:

```typescript
try {
  const service = container.resolve(UNKNOWN_TOKEN);
} catch (error) {
  console.error('Service not registered:', error.message);
}

// Or check first
if (container.has(OPTIONAL_TOKEN)) {
  const service = container.resolve(OPTIONAL_TOKEN);
}
```

## Troubleshooting

### Service Not Registered Error

```
Error: Service not registered: Symbol(ILogger)
```

**Solution**: Call `initializeCoreModule()` before using services.

### Circular Dependencies

Avoid circular dependencies between services:

```typescript
// Bad - circular dependency
class ServiceA {
  @Inject(SERVICE_B_TOKEN) private b!: IServiceB;
}

class ServiceB {
  @Inject(SERVICE_A_TOKEN) private a!: IServiceA;
}
```

**Solution**: Use a third service or event-based communication.

### Type Safety

Use generic type parameters for type-safe resolution:

```typescript
// Type-safe
const logger = container.resolve<ILogger>(LOGGER_TOKEN);

// Less safe (returns unknown)
const logger = container.resolve(LOGGER_TOKEN);
```
