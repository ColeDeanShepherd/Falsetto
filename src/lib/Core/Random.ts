import { precondition } from './Dbc';
import { alphaNumericCharacters } from './StringUtils';

// TODO: add tests
export function randomInt(minValue: number, maxValue: number): number {
  precondition(Number.isInteger(minValue));
  precondition(Number.isInteger(maxValue));
  precondition(maxValue >= minValue);

  const numValues = 1 + (maxValue - minValue);
  return minValue + Math.floor(numValues * Math.random());
}

// TODO: add tests
export function randomBoolean(): boolean {
  return (Math.round(Math.random()) === 1) ? true : false;
}

// TODO: add tests
export function randomElement<T>(array: Array<T>): T {
  precondition(array.length > 0);

  return array[randomInt(0, array.length - 1)];
}

export function randomAlphaNumericString(length: number): string {
  let result = '';

  for (let i = length; i > 0; --i) {
    result += alphaNumericCharacters[Math.floor(Math.random() * alphaNumericCharacters.length)];
  }

  return result;
}