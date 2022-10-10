namespace System.Collections.Generic;

public static class FalsettoDictionaryExtensions
{
    public static Dictionary<TKey, TValue> Add<TKey, TValue>(
        this Dictionary<TKey, TValue> dictionary,
        params KeyValuePair<TKey, TValue>[] keyValuePairs)
        where TKey : notnull
    {
        foreach (var kvp in keyValuePairs)
        {
            dictionary.Add(kvp.Key, kvp.Value);
        }

        return dictionary;
    }

    public static Dictionary<TKey, TValue> Add<TKey, TValue>(
        this Dictionary<TKey, TValue> dictionary,
        IEnumerable<KeyValuePair<TKey, TValue>>? keyValuePairs)
        where TKey : notnull
    {
        if (keyValuePairs != null)
        {
            foreach (var kvp in keyValuePairs)
            {
                dictionary.Add(kvp.Key, kvp.Value);
            }
        }

        return dictionary;
    }

    public static Dictionary<TKey, TValue> AddIfMissing<TKey, TValue>(
        this Dictionary<TKey, TValue> dictionary,
        TKey key,
        TValue value)
        where TKey : notnull
    {
        if (!dictionary.ContainsKey(key))
        {
            dictionary.Add(key, value);
        }

        return dictionary;
    }
}
