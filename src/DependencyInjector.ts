import { createBrowserHistory } from 'history';

import { UserManager } from './UserManager';
import { InMemoryDatabase } from './Database';
import { Analytics, MockAnalytics } from './Analytics';
import { isProduction } from "./Config";
import { ConsoleLogger } from './Logger';
import { Server } from "./Server";

export class DependencyInjector {
  public static instance = new DependencyInjector();

  public getRequiredService<T>(serviceName: string): T {
    switch (serviceName) {
      case "ILogger":
        return this.logger as any;
      case "History":
        return this.history as any;
      case "IUserManager":
        return this.userManager as any;
      case "IDatabase":
        return this.database as any;
      case "IAnalytics":
        return this.analytics as any;
      case "IServer":
        return this.server as any;
      default:
        throw new Error(`Unknown service name: ${serviceName}`);
    }
  }

  private logger = new ConsoleLogger();
  private history = createBrowserHistory();
  private userManager = new UserManager();
  private database = new InMemoryDatabase(); // new TwoTierDatabase();
  private analytics = isProduction() ? (new Analytics()) : (new MockAnalytics());
  private server = new Server();
}