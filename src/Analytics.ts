import { isProduction } from "./Config";
import * as Utils from "./Utils";

const googleAnalyticsTrackingId = "UA-72494315-5"; // TODO: move this somewhere else?

function getGtag(): any {
  return (window as any).gtag;
}
export function trackPageView() {
  if (isProduction()) {
    const gtag = getGtag();
    gtag("config", googleAnalyticsTrackingId, {
      "page_title" : document.title,
      "page_path": location.pathname + location.search
    });
  }
}
export function trackCustomEvent(id: string, label?: string, value?: number, category?: string) {
  Utils.precondition((value === undefined) || (Number.isInteger(value) && (value >= 0)));

  if (isProduction()) {
    const gtag = getGtag();
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
}
export function trackException(description: string, fatal: boolean) {
  if (isProduction()) {
    const gtag = getGtag();
    gtag('event', 'exception', {
      'description': description,
      'fatal': fatal
    });
  }
}