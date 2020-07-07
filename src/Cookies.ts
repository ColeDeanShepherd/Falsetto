import Cookies from "js-cookie";
import { isProduction, websiteUriAuthority } from './Config';

const sessionTokenCookieName = "sessionToken";

export function saveSessionToken(sessionToken: string) {
  Cookies.set(
    sessionTokenCookieName,
    sessionToken,
    {
      secure: isProduction(),
      domain: `.${websiteUriAuthority}`
    });
}

export function loadSessionToken(): string | undefined {
  return Cookies.get(sessionTokenCookieName);
}

export function clearSessionToken() {
  Cookies.remove(sessionTokenCookieName);
}