/**
 * Service factory function type
 */
type ServiceFactory<T> = () => T;

/**
 * Service registration entry
 */
interface ServiceEntry<T> {
  factory: ServiceFactory<T>;
  singleton: boolean;
  instance?: T;
}

/**
 * Simple Dependency Injection Container
 * Manages service registrations and resolutions
 */
export class DIContainer {
  private static instance: DIContainer;
  private services: Map<symbol, ServiceEntry<unknown>> = new Map();

  /**
   * Get singleton instance of the container
   */
  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  /**
   * Register a service as singleton
   * @param token - Service token symbol
   * @param factory - Factory function to create the service
   */
  registerSingleton<T>(token: symbol, factory: ServiceFactory<T>): void {
    this.services.set(token, {
      factory,
      singleton: true,
    });
  }

  /**
   * Register a service as transient (new instance each time)
   * @param token - Service token symbol
   * @param factory - Factory function to create the service
   */
  registerTransient<T>(token: symbol, factory: ServiceFactory<T>): void {
    this.services.set(token, {
      factory,
      singleton: false,
    });
  }

  /**
   * Register an existing instance (for testing/mocking)
   * @param token - Service token symbol
   * @param instance - Service instance
   */
  registerInstance<T>(token: symbol, instance: T): void {
    this.services.set(token, {
      factory: () => instance,
      singleton: true,
      instance,
    });
  }

  /**
   * Resolve a service from the container
   * @param token - Service token symbol
   * @returns The service instance
   * @throws Error if service not registered
   */
  resolve<T>(token: symbol): T {
    const entry = this.services.get(token) as ServiceEntry<T> | undefined;

    if (!entry) {
      throw new Error(`Service not registered: ${token.toString()}`);
    }

    if (entry.singleton) {
      if (!entry.instance) {
        entry.instance = entry.factory();
      }
      return entry.instance;
    }

    return entry.factory();
  }

  /**
   * Check if a service is registered
   * @param token - Service token symbol
   * @returns True if service is registered
   */
  has(token: symbol): boolean {
    return this.services.has(token);
  }

  /**
   * Clear all registrations (useful for testing)
   */
  clear(): void {
    this.services.clear();
  }
}

/**
 * Global DI container instance
 */
export const container = DIContainer.getInstance();

/**
 * Decorator for injecting dependencies into class properties
 * Usage: @Inject(TOKEN) private service: IServiceType;
 */
export function Inject(token: symbol) {
  return function (target: object, propertyKey: string | symbol) {
    Object.defineProperty(target, propertyKey, {
      get: () => container.resolve(token),
      enumerable: true,
      configurable: true,
    });
  };
}
