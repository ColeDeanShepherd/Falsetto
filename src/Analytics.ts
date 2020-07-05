import { isProduction, googleAnalyticsTrackingId } from "./Config";
import { precondition } from './lib/Core/Dbc';
import { ILogger } from './Logger';
import { DependencyInjector } from './DependencyInjector';

export interface IAnalytics {
  trackPageView(): Promise<void>;
  trackCustomEvent(id: string, label?: string, value?: number, category?: string): Promise<void>;
  trackException(description: string, fatal: boolean): Promise<void>;
}

export class Analytics implements IAnalytics {
  public trackPageView(): Promise<void> {
    if (isProduction()) {
      const gtag = this.getGtag();
      gtag("config", googleAnalyticsTrackingId, {
        "page_title" : document.title,
        "page_path": location.pathname + location.search
      });
    }

    return Promise.resolve();
  }
  public trackCustomEvent(id: string, label?: string, value?: number, category?: string): Promise<void> {
    precondition((value === undefined) || (Number.isInteger(value) && (value >= 0)));
  
    if (isProduction()) {
      const gtag = this.getGtag();
      let parameters = {};
      
      if (label !== undefined) {
        parameters["event_label"] = label;
      }
  
      if (value !== undefined) {
        parameters["value"] = value;
      }
      
      if (category !== undefined) {
        parameters["event_category"] = category;
      }
  
      gtag("event", id, parameters);      
    }

    return Promise.resolve();
  }
  public trackException(description: string, fatal: boolean): Promise<void> {
    if (isProduction()) {
      const gtag = this.getGtag();
      gtag('event', 'exception', {
        'description': description,
        'fatal': fatal
      });
    }

    return Promise.resolve();
  }

  private getGtag(): any {
    return (window as any).gtag;
  }
}

export class MockAnalytics implements IAnalytics {
  public constructor() {
    this.logger = DependencyInjector.instance.getRequiredService<ILogger>("ILogger");
  }

  public trackPageView(): Promise<void> {
    this.logger.logInfo(`View to page ${location.pathname + location.search} tracked`);
    return Promise.resolve();
  
  }
  public trackCustomEvent(id: string, label?: string, value?: number, category?: string): Promise<void> { return Promise.resolve(); }
  
  public trackException(description: string, fatal: boolean): Promise<void> { return Promise.resolve(); }

  private logger: ILogger;
}