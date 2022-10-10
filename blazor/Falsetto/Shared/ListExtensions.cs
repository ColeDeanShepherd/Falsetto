namespace System.Collections.Generic;

public static class FalsettoListExtensions
{
    public static List<T> Add<T>(this List<T> list, IEnumerable<T> elements)
    {
        list.AddRange(elements);
        return list;
    }
}
