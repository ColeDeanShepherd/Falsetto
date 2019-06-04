import { Size2D } from './Size2D';

export function identity<T>(value: T): T {
  return value;
}

// TODO: don't run asserts in prod?
// TODO: add tests
export function assert(condition: boolean) {
  if (!condition) {
    throw new Error("Failed assertion.");
  }
}

// TODO: add tests
export function precondition(condition: boolean) {
  assert(condition);
}

// TODO: add tests
export function invariant(condition: boolean) {
  assert(condition);
}

export function unwrapValueOrUndefined<T>(value: T | undefined): T {
  if (value === undefined) {
    throw new Error("Tried to unwrap an undefined value.");
  }

  return value;
}
export function unwrapMaybe<T>(value: T | null): T {
  if (value === null) {
    throw new Error("Tried to unwrap a null value.");
  }

  return value;
}

// TODO: add tests
export function reverseString(str: string): string {
  let reversedString = "";

  for (let i = str.length - 1; i >= 0; i--) {
    reversedString += str[i];
  }

  return reversedString;
}

// TODO: add tests
export function reverseInt(x: number): number {
  return parseInt(reverseString(x.toString()));
}

// TODO: add tests
export function isPowerOf2(x: number): boolean {
  return (x !== 0) && ((x & (x - 1)) === 0);
}

// TODO: add tests
export function highestPowerOf2(n: number): number {
  precondition(Number.isInteger(n));

  let res = 0;
  
  for (let i = n; i >= 1; i--) {
    if (isPowerOf2(i)) {
      res = i;
      break;
    }
  }

  return res; 
}

export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

// TODO: add tests
export function range(minValue: number, maxValue: number): Array<number> {
  precondition(Number.isInteger(minValue));
  precondition(Number.isInteger(maxValue));
  precondition(maxValue >= minValue);

  const numValues = 1 + (maxValue - minValue);
  const result = new Array<number>(numValues);

  for (let i = 0; i < numValues; i++) {
    result[i] = minValue + i;
  }

  return result;
}

// TODO: add tests
export function wrapReal(value: number, minValue: number, maxValue: number): number {
  precondition(maxValue >= minValue);

  const range = maxValue - minValue;

  while (value < minValue) {
    value += range;
  }

  while (value > maxValue) {
    value -= range;
  }

  return value;
}

// TODO: add tests
export function clamp(value: number, minValue: number, maxValue: number): number {
  precondition(maxValue >= minValue);

  if (value < minValue) {
    return minValue;
  } else if (value > maxValue) {
    return maxValue;
  } else {
    return value;
  }
}

// TODO: add tests
export function randomInt(minValue: number, maxValue: number): number {
  precondition(Number.isInteger(minValue));
  precondition(Number.isInteger(maxValue));
  precondition(maxValue >= minValue);

  const numValues = 1 + (maxValue - minValue);
  return Math.floor(numValues * Math.random());
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

// TODO: add tests
export function getNonConstEnumValues(enumType: any): any[] {
  return Object.keys(enumType)
    .map(key => parseInt(enumType[key], 10))
    .filter(value => !isNaN(value));
}

// TODO: add tests
export function sumNumbers(array: Array<number>): number {
  return array.reduce(
    (prevVal, curVal) => prevVal + curVal,
    0
  );
}

// TODO: add tests
export function sum<T>(array: Array<T>, callbackFn: (value: T) => number): number {
  return array.reduce(
    (prevVal, curVal) => prevVal + callbackFn(curVal),
    0
  );
}

// TODO: add tests
export function min<T>(array: Array<T>, callbackFn: (value: T) => number): number {
  precondition(array.length > 0);

  let minValue = callbackFn(array[0]);

  for (let i = 1; i < array.length; i++) {
    minValue = Math.min(callbackFn(array[i]), minValue);
  }

  return minValue;
}

// TODO: add tests
export function uniq<T>(array: Array<T>) {
  return array.filter((x, index) => array.indexOf(x) === index);
}

// TODO: add tests
export function isUniqueArrayElement<T>(value: T, index: number, array: Array<T>) {
  return array.indexOf(value) === index;
}

// TODO: add tests
export function setBitIndicesToInt(setBitIndices: number[]): number {
  let result = 0;

  for (const bitIndex of setBitIndices) {
    result |= (1 << bitIndex);
  }

  return result;
}

// TODO: add tests
export function flattenArrays<T>(arrays: any): T[] {
  return arrays.reduce(
    (flat: any, toFlatten: any) => flat.concat(Array.isArray(toFlatten) ? flattenArrays(toFlatten) : toFlatten),
    []
  );
}

// TODO: add tests
export function areArraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1 === arr2) { return true; }
  if (arr1.length !== arr2.length) { return false; }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) { return false; }
  }

  return true;
}
export function areArraysEqualComparer<T>(arr1: T[], arr2: T[], comparer: (e1: T, e2: T) => boolean): boolean {
  if (arr1 === arr2) { return true; }
  if (arr1.length !== arr2.length) { return false; }

  for (let i = 0; i < arr1.length; i++) {
    if (!comparer(arr1[i], arr2[i])) { return false; }
  }

  return true;
}

export function circularArraySlice<T>(array: T[], start: number, length: number): T[] {
  precondition(start >= 0);
  precondition(start < array.length);
  precondition(length >= 0);

  if (length === 0) { return []; }

  const slice = new Array<T>(length);

  for (let i = 0; i < length; i++) {
    slice[i] = array[(start + i) % array.length];
  }

  return slice;
}

// TODO: add tests
export function arrayJoin<T>(array: T[], separator: T) {
  if (array.length === 0) { return []; }

  const result = new Array<T>(array.length + (array.length - 1));

  for (let i = 0; i < array.length; i++) {
    const baseResultI = 2 * i;
    result[baseResultI] = array[i];

    if (i < (array.length - 1)) {
      result[baseResultI + 1] = separator;
    }
  }

  return result;
}

// TODO: add tests
export function toggleArrayElement<T>(array: T[], element: T): T[] {
  const newArray = array.slice();
  const i = newArray.indexOf(element);
  const wasElementInArray = i >= 0;

  if (!wasElementInArray) {
    newArray.push(element);
  } else {
    newArray.splice(i, 1);
  }

  return newArray;
}

// TODO: add tests
export function toggleArrayElementCustomEquals<T>(array: T[], element: T, equalsFn: (a: T, b: T) => boolean): T[] {
  const newArray = array.slice();
  const i = newArray.findIndex(e => equalsFn(e, element));
  const wasElementInArray = i >= 0;

  if (!wasElementInArray) {
    newArray.push(element);
  } else {
    newArray.splice(i, 1);
  }

  return newArray;
}

// TODO: add tests
export function tryRemoveArrayElement<T>(array: T[], element: T): boolean {
  const i = array.indexOf(element);
  const wasElementInArray = i >= 0;

  if (wasElementInArray) {
    array.splice(i, 1);
    return true;
  } else {
    return false;
  }
}

// TODO: add tests
export function arrayContains<T>(array: T[], element: T): boolean {
  return array.indexOf(element) >= 0;
}

// TODO: add tests
export function getRomanNumerals(x: number): string {
  switch (x) {
    case 1: return "I";
    case 2: return "II";
    case 3: return "III";
    case 4: return "IV";
    case 5: return "V";
    case 6: return "VI";
    case 7: return "VII";
    case 8: return "VIII";
    case 9: return "IX";
    case 10: return "X";
    default:
      throw new Error(`Failed converting ${x} to a roman numeral.`);
  }
}

// TODO: add tests
export function stringContains(str: string, substring: string): boolean {
  return str.indexOf(substring) >= 0;
}

// TODO: add tests
export function repeatElement<T>(element: T, repeatCount: number): Array<T> {
  assert(repeatCount >= 0);

  const array = new Array<T>(repeatCount);

  for (let i = 0; i < repeatCount; i++) {
    array[i] = element;
  }

  return array;
}

// TODO: add tests
export function repeatGenerator<T>(createElementFn: (index: number) => T, repeatCount: number): Array<T> {
  assert(repeatCount >= 0);

  const array = new Array<T>(repeatCount);

  for (let i = 0; i < repeatCount; i++) {
    array[i] = createElementFn(i);
  }

  return array;
}

export function intervalQualityToNumber(intervalQuality: string): number {
  switch (intervalQuality) {
    case "P":
    case "M":
      return 0;
    case "m":
    case "d":
      return -1;
    case "A":
      return 1;
    default:
      throw new Error(`Unknown interval quality: ${intervalQuality}`);
  }
}

// TODO: add tests
export function isNullOrWhiteSpace(str: string | null): boolean {
  if (str == null) { return true; }
  
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

// TODO: add tests
export function shrinkRectToFit(containerSize: Size2D, rectSize: Size2D): Size2D {
  // try to reduce width and see if height fits
  if (rectSize.width > containerSize.width) {
    const scaleFactor = containerSize.width / rectSize.width;
    const scaledWidth = containerSize.width;
    const scaledHeight = scaleFactor * rectSize.height;

    if (scaledHeight <= containerSize.height) {
      return new Size2D(scaledWidth, scaledHeight);
    }
  }

  // try to reduce height and see if width fits
  if (rectSize.height > containerSize.height) {
    const scaleFactor = containerSize.height / rectSize.height;
    const scaledWidth = scaleFactor * rectSize.width;
    const scaledHeight = containerSize.height;

    if (scaledWidth <= containerSize.width) {
      return new Size2D(scaledWidth, scaledHeight);
    }
  }
  
  // If we get here, the rect doesn't need to be resized.
  return rectSize;
}