export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export const googleAnalyticsTrackingId = "UA-72494315-5"; // TODO: move this somewhere else?

export const websiteUriAuthority = isProduction() ? "falsetto.app" : "localhost:3000";

export const apiBaseUri = isProduction() ? "https://api.falsetto.app" : "https://localhost:3001";