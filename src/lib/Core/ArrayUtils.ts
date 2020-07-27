import { precondition, assert } from './Dbc';

export function any<T>(arr: T[]): boolean {
  return arr.length > 0;
}

export function none<T>(arr: T[]): boolean {
  return arr.length === 0;
}

export function first<T>(arr: T[]): T {
  return arr[0];
}

export function last<T>(arr: T[]): T {
  return arr[arr.length - 1];
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

// TODO: add tests
export function flattenArrays<T>(arrays: any): T[] {
  return arrays.reduce(
    (flat: any, toFlatten: any) => flat.concat(Array.isArray(toFlatten) ? flattenArrays(toFlatten) : toFlatten),
    []
  );
}

export function arrayMin<T>(array: T[]): T {
  precondition(array.length > 0);

  let min = array[0];

  for (let i = 1; i < array.length; i++) {
    min = (array[i] < min) ? array[i] : min;
  }

  return min;
}

export function arrayMax<T>(array: T[]): T {
  precondition(array.length > 0);

  let max = array[0];

  for (let i = 1; i < array.length; i++) {
    max = (array[i] > max) ? array[i] : max;
  }
  
  return max;
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
  return immutableToggleArrayElement(array, element);
}

// TODO: add tests
export function toggleArrayElementCustomEquals<T>(array: T[], element: T, equalsFn: (a: T, b: T) => boolean): T[] {
  return immutableToggleArrayElementCustomEquals(array, element, equalsFn);
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

export function arrayCountPassing<T>(array: T[], predicate: (element: T) => boolean) {
  let countPassing = 0;

  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      countPassing++;
    }
  }

  return countPassing;
}

export function newArraySplice<T>(array: T[], start: number, deleteCount: number, ...items: T[]): T[] {
  const newArray = array.slice();
  newArray.splice(start, deleteCount, ...items);
  return newArray;
}

export function removeElement<T>(array: T[], element: T): boolean {
  const elementIndex = array.indexOf(element);
  if (elementIndex >= 0) {
    array.splice(elementIndex, 1);
    return true;
  } else {
    return false;
  }
}

export function addIfNotInArray<T>(array: T[], element: T): boolean {
  const elementIndex = array.indexOf(element);

  if (elementIndex < 0) {
    array.push(element);
    return true;
  } else {
    return false;
  }
}

export function removeIfInArray<T>(array: T[], element: T): boolean {
  const elementIndex = array.indexOf(element);

  if (elementIndex >= 0) {
    array.splice(elementIndex, 1);
    return true;
  } else {
    return false;
  }
}

export function addIfNotFoundInArray<T>(
  array: T[], element: T, predicate: (value: T, index: number) => boolean
): boolean {
  const elementIndex = array.findIndex(predicate);

  if (elementIndex < 0) {
    array.push(element);
    return true;
  } else {
    return false;
  }
}

export function removeIfFoundInArray<T>(
  array: T[], predicate: (value: T, index: number) => boolean
): boolean {
  const elementIndex = array.findIndex(predicate);

  if (elementIndex >= 0) {
    array.splice(elementIndex, 1);
    return true;
  } else {
    return false;
  }
}

export function immutableArraySetElement<T>(array: T[], i: number, newValue: T): Array<T> {
  let newArray = array.slice();
  newArray[i] = newValue;
  return newArray;
}

export function immutableAddIfNotInArray<T>(array: T[], element: T): T[] {
  const elementIndex = array.indexOf(element);
  return (elementIndex < 0)
    ? array.concat([element])
    : array.slice();
}

export function immutableRemoveIfInArray<T>(array: T[], element: T): T[] {
  const newArray = array.slice();
  const elementIndex = newArray.indexOf(element);

  if (elementIndex >= 0) {
    newArray.splice(elementIndex, 1);
  } 
  
  return newArray;
}

export function immutableAddIfNotFoundInArray<T>(
  array: T[], element: T, predicate: (value: T, index: number) => boolean
): T[] {
  const elementIndex = array.findIndex(predicate);
  return (elementIndex < 0)
    ? array.concat([element])
    : array.slice();
}

export function immutableRemoveIfFoundInArray<T>(
  array: T[], predicate: (value: T, index: number) => boolean
): T[] {
  const newArray = array.slice();
  const elementIndex = newArray.findIndex(predicate);

  if (elementIndex >= 0) {
    newArray.splice(elementIndex, 1);
  } 
  
  return newArray;
}

// TODO: add tests
export function immutableToggleArrayElement<T>(array: T[], element: T): T[] {
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
export function immutableToggleArrayElementCustomEquals<T>(array: T[], element: T, equalsFn: (a: T, b: T) => boolean): T[] {
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
export function isUniqueArrayElement<T>(value: T, index: number, array: Array<T>) {
  return array.indexOf(value) === index;
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
export function mean<T>(array: Array<T>, callbackFn: (value: T) => number): number {
  if (array.length === 0) { return 0; }
  
  return sum(array, callbackFn) / array.length;
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

export function uniqWithSet<T>(array: Array<T>): Array<T> {
  return [...(new Set<T>(array))];
}

// TODO: add tests
export function uniqWithSelector<T, R>(array: Array<T>, selector: (e: T) => R) {
  const result = new Array<T>();
  const selectors = new Array<R>();

  for (const e of array) {
    const s = selector(e);
    if (!arrayContains(selectors, s)) {
      result.push(e);
      selectors.push(s);
    }
  }

  return result;
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

export function uint8ArrayMap<TResult>(
  array: Uint8Array,
  callbackFn: (value: number, index: number, array: Uint8Array) => TResult
) {
  const result = new Array<TResult>(array.length);

  for (let i = 0; i < result.length; i++) {
    result[i] = callbackFn(array[i], i, array);
  }

  return result;
}

export function uint8ArrayMax(array: Uint8Array): number {
  precondition(array.length > 0);

  let max = array[0];

  for (let i = 1; i < array.length; i++) {
    max = (array[i] > max) ? array[i] : max;
  }

  return max;
}

export function sortNumbersAscendingInPlace(array: Array<number>): Array<number> {
  array.sort((a, b) => a - b);
  return array;
}