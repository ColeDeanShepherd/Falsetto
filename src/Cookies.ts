import Cookies from "js-cookie";

const sessionTokenCookieName = "sessionToken";
const sessionTokenCookieAttributes = {
  secure: true
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