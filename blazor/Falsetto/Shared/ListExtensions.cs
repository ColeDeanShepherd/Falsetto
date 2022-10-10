namespace System.Collections.Generic;

public static class FalsettListExtensions
{
    public static List<T> Add<T>(this List<T> list, IEnumerable<T> elements)
    {
        list.AddRange(elements);
        return list;
    }
}
