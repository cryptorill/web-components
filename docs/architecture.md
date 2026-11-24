# CryptoRill Web Components Architecture

## Overview

CryptoRill Web Components is a modern, modular library for displaying cryptocurrency price data. It follows a layered architecture with clear separation of concerns:

- **Presentation Layer**: StencilJS web components
- **Service Layer**: Business logic and external communication
- **Data Layer**: Models, DTOs, and data sources
- **Infrastructure Layer**: Dependency injection, logging, and utilities

## Component Architecture (StencilJS)

### Component Hierarchy

```
cryptorill-price-ticker (Composite)
├── cryptorill-price (Atomic)
├── cryptorill-price-diff (Atomic)
└── cryptorill-sparkline (Atomic)
```

### Component Types

#### 1. Composite Components

**`cryptorill-price-ticker`**

- Full-featured cryptocurrency ticker display
- Integrates with the DI container for data fetching
- Uses polling service for automatic updates
- Demonstrates glassmorphism, dark mode, and micro-interactions

#### 2. Atomic Components

| Component               | Purpose                            | Props                                                      |
| ----------------------- | ---------------------------------- | ---------------------------------------------------------- |
| `cryptorill-price`      | Price display with flash animation | `value`, `currency`, `size`                                |
| `cryptorill-price-diff` | Price change percentage            | `value`, `label`, `showLabel`, `size`                      |
| `cryptorill-sparkline`  | Canvas-based trend chart           | `data`, `direction`, `width`, `height`, `points`, `smooth` |

### Component Communication

Components communicate through:

- **Props**: Parent-to-child data flow
- **State**: Internal component state
- **DI Container**: Shared services for data and utilities

## Service Layer Architecture

### Dependency Injection Container

The DI container provides loose coupling and testability:

```
┌─────────────────────────────────────────────────────────┐
│                    DI Container                         │
├─────────────────────────────────────────────────────────┤
│  Singleton Services        │  Transient Services        │
│  ─────────────────         │  ──────────────────        │
│  • Logger                  │  • PollingService          │
│  • Configuration           │                            │
│  • HTTP Client             │                            │
│  • Coin Metadata           │                            │
│  • Price Data Source       │                            │
└─────────────────────────────────────────────────────────┘
```

### Service Responsibilities

| Service                | Responsibility             | Lifecycle |
| ---------------------- | -------------------------- | --------- |
| `ILogger`              | Application logging        | Singleton |
| `IAppConfiguration`    | Configuration management   | Singleton |
| `IHttpClient`          | HTTP communication         | Singleton |
| `ICoinMetadataService` | Coin display metadata      | Singleton |
| `IPriceDataSource`     | Price data fetching        | Singleton |
| `IPollingService`      | Periodic updates           | Transient |
| `IErrorHandler`        | Error classification       | Singleton |
| `IRetryService`        | Retry with circuit breaker | Singleton |
| `IPriceFormatter`      | Price formatting           | Singleton |

## Data Flow Diagram

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Component  │────▶│  DI Container   │────▶│  Price Data     │
│  (Ticker)   │     │  (Resolves)     │     │  Source         │
└─────────────┘     └─────────────────┘     └────────┬────────┘
       │                                             │
       │                                             ▼
       │                                      ┌──────────────┐
       │                                      │  HTTP Client │
       │                                      └──────┬───────┘
       │                                             │
       │                    Response                 │
       │◀────────────────────────────────────────────┤
       │                                             │
       ▼                                             │
┌─────────────┐     ┌─────────────────┐            │
│  Render     │◀────│  Price Display  │◀───────────┘
│  (UI)       │     │  (formatted)    │
└─────────────┘     └─────────────────┘
```

### Data Transformation Pipeline

```
Raw API Response
       │
       ▼
┌─────────────────┐
│  CryptoPriceDto │  (API structure)
└────────┬────────┘
         │
         ▼
┌───────────────────┐
│  CryptoPriceModel │  (Domain model with logic)
└────────┬──────────┘
         │
         ▼
┌─────────────────┐
│  CryptoPrice    │  (Public interface)
└─────────────────┘
```

## Module Structure

```
src/
├── components/              # StencilJS web components
│   ├── cryptorill-price/
│   ├── cryptorill-price-diff/
│   ├── cryptorill-price-ticker/
│   └── cryptorill-sparkline/
├── core/                    # Core infrastructure
│   ├── di/                  # Dependency injection
│   │   ├── container.ts     # DI container implementation
│   │   └── tokens.ts        # Injection tokens
│   ├── interfaces/          # TypeScript interfaces
│   ├── services/            # Service implementations
│   ├── models/              # Domain models
│   ├── dtos/                # Data transfer objects
│   ├── mappers/             # Data transformation
│   └── errors/              # Custom error types
├── datasources/             # Data source implementations
├── testing/                 # Testing utilities and mocks
└── utils/                   # Utility functions
```

### Module Dependencies

```
components
    │
    ├──▶ core (interfaces, services, DI)
    │
    └──▶ datasources (IPriceDataSource implementations)

core
    │
    ├──▶ di (internal)
    ├──▶ interfaces (internal)
    ├──▶ services (internal)
    ├──▶ models (internal)
    └──▶ errors (internal)

datasources
    │
    └──▶ core (interfaces, services)
```

## Key Architectural Decisions

### 1. Interface-Driven Design

All services are defined by interfaces, enabling:

- Easy mocking for testing
- Multiple implementations
- Dependency inversion

### 2. Dependency Injection

Constructor injection and property decorators provide:

- Loose coupling between components and services
- Testability through mock injection
- Centralized service lifecycle management

### 3. Layered Data Architecture

DTO → Model → Interface pipeline provides:

- Clear separation between API and domain structures
- Business logic encapsulation in models
- Type safety throughout the application

### 4. Error Handling Strategy

Custom error types with:

- Structured error information (codes, context)
- Error classification for appropriate handling
- User-friendly error messages

### 5. Testing Infrastructure

Built-in mocks and utilities for:

- Isolated unit testing
- Component testing with DI
- HTTP request stubbing
