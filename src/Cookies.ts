import Cookies from "js-cookie";
import { isProduction, websiteUriAuthority } from './Config';

const sessionTokenCookieName = "sessionToken";
const sessionTokenCookieAttributes = {
  secure: isProduction(),
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