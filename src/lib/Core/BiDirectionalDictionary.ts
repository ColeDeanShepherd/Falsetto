import { MappedTypeKey, reverseMappedType } from "./Utils";

export interface BiDirectionalDictionary<TKey, TValue> {
  // TODO: fix mismatch between TKey & data
  data: { [key in MappedTypeKey]: TValue };
  reverseData: { [key in MappedTypeKey]: TKey };
}

export function createBiDirectionalDictionary<TKey, TValue>(
  data?: { [key in MappedTypeKey]: TValue }
): BiDirectionalDictionary<TKey, TValue> {
  return {
    data: data
      ? data
      : {},
    reverseData: data
      ? (reverseMappedType(data as any) as any) as { [key in MappedTypeKey]: TKey } // TODO: avoid casting
      : {}
  };
}

export function get<TKey, TValue>(dictionary: BiDirectionalDictionary<TKey, TValue>, key: TKey): TValue {
  return dictionary.data[key as any]; // TODO: fix cast
}

export function getReverse<TKey, TValue>(dictionary: BiDirectionalDictionary<TKey, TValue>, key: TValue): TKey {
  return dictionary.reverseData[key as any]; // TODO: fix cast
}

export function set<TKey, TValue>(dictionary: BiDirectionalDictionary<TKey, TValue>, key: TKey, value: TValue) {
  dictionary.data[key as any] = value; // TODO: fix cast
  dictionary.reverseData[value as any] = key; // TODO: fix cast
}