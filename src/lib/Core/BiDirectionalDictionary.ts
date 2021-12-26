import { MappedTypeKey, reverseMappedType } from "./Utils";

export interface BiDirectionalDictionary<TKey, TValue> {
  // TODO: fix mismatch between TKey & data
  data: { [key in MappedTypeKey]: TValue };
  reverseData: { [key in MappedTypeKey]: TKey };
}

export function createDictionary<TKey, TValue>(
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

export function get<TKey, TValue>(dictionary: BiDirectionalDictionary<TKey, TValue>, key: MappedTypeKey): TValue {
  return dictionary.data[key];
}

export function set<TKey, TValue>(dictionary: BiDirectionalDictionary<TKey, TValue>, key: MappedTypeKey, value: TValue) {
  dictionary.data[key] = value;
}