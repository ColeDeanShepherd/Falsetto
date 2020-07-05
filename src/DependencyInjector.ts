import { createBrowserHistory, History } from 'history';

import { UserManager } from './UserManager';
import { InMemoryDatabase } from './Database';
import { Analytics, MockAnalytics, IAnalytics } from './Analytics';
import { isProduction } from "./Config";
import { ConsoleLogger } from './Logger';
import { Server } from "./Server";

export class DependencyInjector {
  public static instance = new DependencyInjector();

  public constructor() {
    // Ensure "instance" is initialized for use in constructors below.
    DependencyInjector.instance = this;

    this.logger = new ConsoleLogger();
    this.history = createBrowserHistory();
    this.userManager = new UserManager();
    this.database = new InMemoryDatabase(); // new TwoTierDatabase();
    this.analytics = isProduction() ? (new Analytics()) : (new MockAnalytics());
    this.server = new Server();
  }

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

  private logger: ConsoleLogger;
  private history: History<any>;
  private userManager: UserManager;
  private database: InMemoryDatabase; // new TwoTierDatabase();
  private analytics: IAnalytics;
  private server: Server;
}