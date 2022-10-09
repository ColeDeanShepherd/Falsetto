namespace Falsetto.Client.Html;

public record Element(
    string Type,
    Dictionary<string, object>? Attributes = null,
    List<Element>? Children = null);

public static class ElementExtensions
{
    public static string ToHtml(this Element element) => $"<{element.Type}{element.Attributes?.Map(a => a.ToHtml()).AddBeforeEach(" ").Join()}>{element.Children?.Map(ToHtml).Join()}</{element.Type}>";
}

public static class AttributeExtensions
{
    public static string ToHtml(this KeyValuePair<string, object> attribute) => $"{attribute.Key}=\"{attribute.Value}\"";
}

public static class HtmlHelpers
{
    public static Element Svg(
        Dictionary<string, object>? Attributes = null,
        List<Element>? Children = null) =>
        new Element("svg", Attributes, Children);

    public static Element Rect(
        Dictionary<string, object>? Attributes = null) =>
        new Element("rect", Attributes);
}
