import { reverseString } from './StringUtils';
import { precondition } from './Dbc';

export function identity<T>(value: T): T {
  return value;
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
export function reverseInt(x: number): number {
  return parseInt(reverseString(x.toString()), 10);
}

// TODO: add tests
export function getNonConstEnumValues(enumType: any): any[] {
  return Object.keys(enumType)
    .map(key => parseInt(enumType[key], 10))
    .filter(value => !isNaN(value));
}

export function withBitSet(x: number, bitIndex: number): number {
  return x |= (1 << bitIndex);
}

// TODO: add tests
export function setBitIndicesToInt(setBitIndices: number[]): number {
  let result = 0;

  for (const bitIndex of setBitIndices) {
    result |= (1 << bitIndex);
  }

  return result;
}

export function isBitSet(bits: number, bitIndex: number): boolean {
  precondition(bitIndex >= 0);

  return (bits & (1 << bitIndex)) !== 0;
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
    case 11: return "XI";
    case 12: return "XII";
    default:
      throw new Error(`Failed converting ${x} to a roman numeral.`);
  }
}

export function getOrdinalNumeral(x: number): string {
  switch (x) {
    case 1: return "1st";
    case 2: return "2nd";
    case 3: return "3rd";
    case 4: return "4th";
    case 5: return "5th";
    case 6: return "6th";
    case 7: return "7th";
    case 8: return "8th";
    case 9: return "9th";
    case 10: return "10th";
    case 11: return "11th";
    case 12: return "12th";
    default:
      throw new Error(`Failed converting ${x} to a roman numeral.`);
  }
}

export function* generateValueCombinationBitMasks<T>(values: Array<T>) {
  precondition(values.length > 0);
  
  const numCombinations = 1 << values.length; // 2 ^ n

  for (let arrayBitMask = 0; arrayBitMask < numCombinations; arrayBitMask++) {
    yield arrayBitMask;
  }
}