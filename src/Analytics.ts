import { isProduction } from "./Config";
import * as Utils from "./Utils";

const googleAnalyticsTrackingId = "UA-72494315-5"; // TODO: move this somewhere else?

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
    Utils.precondition((value === undefined) || (Number.isInteger(value) && (value >= 0)));
  
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
  public trackPageView(): Promise<void> { return Promise.resolve(); }
  public trackCustomEvent(id: string, label?: string, value?: number, category?: string): Promise<void> { return Promise.resolve(); }
  public trackException(description: string, fatal: boolean): Promise<void> { return Promise.resolve(); }
}