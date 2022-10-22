import { createBrowserHistory, History } from 'history';

import { Analytics, MockAnalytics, IAnalytics } from './Analytics';
import { isProduction } from "./Config";
import { ConsoleLogger } from './Logger';

export class DependencyInjector {
  public static instance = new DependencyInjector();

  public constructor() {
    // Ensure "instance" is initialized for use in constructors below.
    DependencyInjector.instance = this;

    this.logger = new ConsoleLogger();
    this.history = createBrowserHistory();
    this.analytics = isProduction() ? (new Analytics()) : (new MockAnalytics());
  }

  public getRequiredService<T>(serviceName: string): T {
    switch (serviceName) {
      case "ILogger":
        return this.logger as any;
      case "History":
        return this.history as any;
      case "IAnalytics":
        return this.analytics as any;
      default:
        throw new Error(`Unknown service name: ${serviceName}`);
    }
  }

  private logger: ConsoleLogger;
  private history: History;
  private analytics: IAnalytics;
}