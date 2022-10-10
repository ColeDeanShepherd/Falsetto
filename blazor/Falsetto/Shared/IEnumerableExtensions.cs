namespace System.Linq;

public static class FalsettoIEnumerableExtensions
{
    public static IEnumerable<T> ForEach<T>(this IEnumerable<T> enumerable, Action<T> action)
    {
        foreach (T item in enumerable)
        {
            action(item);
        }

        return enumerable;
    }

    public static IEnumerable<TResult> Map<TSource, TResult>(this IEnumerable<TSource> enumerable, Func<TSource, TResult> mapFn)
        => enumerable.Select(mapFn);

    public static IEnumerable<TResult> Map<TSource, TResult>(this IEnumerable<TSource> enumerable, Func<TSource, uint, TResult> mapFn)
    {
        uint index = 0;

        foreach (TSource item in enumerable)
        {
            yield return mapFn(item, index);
            index++;
        }
    }

    public static IEnumerable<TResult> FlatMap<TSource, TResult>(this IEnumerable<TSource> source, Func<TSource, IEnumerable<TResult>> selector)
    {
        foreach (TSource item in source)
        {
            IEnumerable<TResult> selectorResult = selector(item);

            foreach (TResult result in selectorResult)
            {
                yield return result;
            }
        }
    }

    public static IEnumerable<TResult> FlatMap<TSource, TResult>(this IEnumerable<TSource> source, Func<TSource, uint, IEnumerable<TResult>> selector)
    {
        uint i = 0;

        foreach (TSource item in source)
        {
            IEnumerable<TResult> selectorResult = selector(item, i);

            foreach (TResult result in selectorResult)
            {
                yield return result;
            }

            i++;
        }
    }

    public static IEnumerable<T> AddBeforeEach<T>(this IEnumerable<T> enumerable, T prefix)
    {
        foreach (T item in enumerable)
        {
            yield return prefix;
            yield return item;
        }
    }

    public static string Join(this IEnumerable<string> strings, string? separator = null) =>
        string.Join(separator, strings);

    public static IEnumerable<T> Repeat<T>(this T element, uint count) => Enumerable.Repeat(element, (int)count);
}
