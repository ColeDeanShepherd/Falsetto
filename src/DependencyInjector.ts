import { createBrowserHistory } from 'history';

import { UserManager } from './UserManager';
import { InMemoryDatabase } from './Database';
import { Analytics, MockAnalytics } from './Analytics';
import { isProduction } from "./Config";

export class DependencyInjector {
  public static instance = new DependencyInjector();

  public getRequiredService<T>(serviceName: string): T {
    switch (serviceName) {
      case "History":
        return this.history as any;
      case "IUserManager":
        return this.userManager as any;
      case "IDatabase":
        return this.database as any;
      case "IAnalytics":
        return this.analytics as any;
      default:
        throw new Error(`Unknown service name: ${serviceName}`);
    }
  }

  private history = createBrowserHistory();
  private userManager = new UserManager();
  private database = new InMemoryDatabase(); // new TwoTierDatabase();
  private analytics = isProduction() ? (new Analytics()) : (new MockAnalytics());
}