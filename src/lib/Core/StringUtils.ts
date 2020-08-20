import { precondition } from './Dbc';

export const alphaNumericCharacters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

// TODO: add tests
export function reverseString(str: string): string {
  let reversedString = "";

  for (let i = str.length - 1; i >= 0; i--) {
    reversedString += str[i];
  }

  return reversedString;
}

// TODO: add tests
export function stringContains(str: string, substring: string): boolean {
  return str.indexOf(substring) >= 0;
}

// TODO: add tests
export function isNullOrEmpty(str: string | null | undefined): boolean {
  return ((str === null) || (str === undefined) || (str.length === 0));
}

// TODO: add tests
export function isNullOrWhiteSpace(str: string | null | undefined): boolean {
  if ((str === null) || (str === undefined)) { return true; }
  
  for (const char of str) {
    if (!char.match(/\s/)) {
      return false;
    }
  }

  return true;
}

// TODO: add tests
export function lastChar(str: string): string {
  if (str.length === 0) { return ""; }
  return str[str.length - 1];
}

// TODO: add tests
export function takeCharsWhile(
  str: string,
  startIndex: number,
  predicate: (char: string) => boolean
): string {
  precondition((startIndex >= 0) && (startIndex <= str.length));
  
  let endIndexExclusive = startIndex;

  while ((endIndexExclusive < str.length) && predicate(str[endIndexExclusive])) {
    endIndexExclusive++;
  }

  return str.substring(startIndex, endIndexExclusive);
}

export function numMatchingCharsAtStart(str: string, character: string): number {
  for (let i = 0; i < str.length; i++) {
    if (str[i] !== character) {
      return i;
    }
  }

  return str.length;
}

export function numSubstringOccurrences(string: string, substring: string, allowOverlapping: boolean) {
  string += "";
  substring += "";

  if (substring.length <= 0) { return (string.length + 1) };

  let n = 0;
  let pos = 0;
  const step = allowOverlapping ? 1 : substring.length;

  while (true) {
    pos = string.indexOf(substring, pos);

    if (pos >= 0) {
        ++n;
        pos += step;
    } else {
      break
    };
  }

  return n;
}

export function zeroPad(str: string, desiredLength: number): string {
  if (str.length < desiredLength) {
    const numZeros = desiredLength - str.length;
    return "0".repeat(numZeros) + str;
  } else {
    return str;
  }
}