export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export const apiBaseUri = isProduction() ? "https://api.falsetto.app" : "http://api.falsetto.app";
export const authDomain = "falsetto.auth0.com";
export const authClientId = "yd2xFeeGA2MrhLubI9HphqOYfe44wZIE";
export const authAudience = "https://api.falsetto.app";