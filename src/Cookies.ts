import Cookies from "js-cookie";
import { websiteUriAuthority, isDevelopment } from './Config';

const sessionTokenCookieName = "sessionToken";
const sessionTokenCookieAttributes = isDevelopment()
  ? {
    secure: true
  }
  : {
    secure: true,
    domain: `.${websiteUriAuthority}`
  };

export function saveSessionToken(sessionToken: string) {
  Cookies.set(
    sessionTokenCookieName,
    sessionToken,
    sessionTokenCookieAttributes
  );
}

export function loadSessionToken(): string | undefined {
  return Cookies.get(sessionTokenCookieName);
}

export function clearSessionToken() {
  Cookies.remove(sessionTokenCookieName, sessionTokenCookieAttributes);
}