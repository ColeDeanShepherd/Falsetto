import { MappedTypeKey } from "./Utils";

export interface Dictionary<TKey, TValue> {
  // TODO: fix mismatch between TKey & data
  data: { [key in MappedTypeKey]: TValue };
}

export function createDictionary<TKey, TValue>(
  data?: { [key in MappedTypeKey]: TValue }
): Dictionary<TKey, TValue> {
  return {
    data: data
      ? data
      : {}
  };
}

export function get<TKey, TValue>(dictionary: Dictionary<TKey, TValue>, key: TKey): TValue {
  return dictionary.data[key as any]; // TODO: remove cast
}

export function set<TKey, TValue>(dictionary: Dictionary<TKey, TValue>, key: TKey, value: TValue) {
  dictionary.data[key as any] = value; // TODO: remove vast
}

export function reversed<TKey, TValue>(dictionary: Dictionary<TKey, TValue>): Dictionary<TValue, TKey> {
  const result = createDictionary<TValue, TKey>();

  for (const [key, value] of Object.entries(dictionary)) {
    result[value] = key;
  }

  return result;
}