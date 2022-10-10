namespace System.Linq;

public static class FalsettoIEnumerableExtensions
{
    public static IEnumerable<TResult> Map<TSource, TResult>(this IEnumerable<TSource> enumerable, Func<TSource, TResult> mapFn)
        => enumerable.Select(mapFn);

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
}
