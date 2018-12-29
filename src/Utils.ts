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
export function arrayContains<T>(array: T[], element: T): boolean {
  return array.indexOf(element) >= 0;
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