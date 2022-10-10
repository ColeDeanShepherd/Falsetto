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
    public static class Elem
    {
        public static List<Element> Elems(params Element[] elements) => elements.ToList();

        public static Element Svg(
            Dictionary<string, object>? Attributes = null,
            List<Element>? Children = null) =>
            new Element(
                "svg",
                (Attributes ?? new Dictionary<string, object>())
                    .AddIfMissing("xmlns", "http://www.w3.org/2000/svg"),
                Children);

        public static Element G(
            Dictionary<string, object>? Attributes = null,
            List<Element>? Children = null) =>
            new Element("g", Attributes, Children);

        public static Element Rect(
            Dictionary<string, object>? Attributes = null) =>
            new Element("rect", Attributes);

        public static Element Line(
            Dictionary<string, object>? Attributes = null) =>
            new Element("line", Attributes);

        public static Element Circle(
            Dictionary<string, object>? Attributes = null) =>
            new Element("circle", Attributes);
    }

    public static class Attr
    {
        public static Dictionary<string, object> Attrs(params KeyValuePair<string, object>[] keyValuePairs) =>
            new Dictionary<string, object>(keyValuePairs);

        public static KeyValuePair<string, object> Width(double value) =>
            new KeyValuePair<string, object>("width", value);

        public static KeyValuePair<string, object> Height(double value) =>
            new KeyValuePair<string, object>("height", value);

        public static KeyValuePair<string, object> X(int value) =>
            new KeyValuePair<string, object>("x", value);

        public static KeyValuePair<string, object> Y(int value) =>
            new KeyValuePair<string, object>("y", value);

        public static KeyValuePair<string, object> X1(int value) =>
            new KeyValuePair<string, object>("x1", value);

        public static KeyValuePair<string, object> Y1(int value) =>
            new KeyValuePair<string, object>("y1", value);

        public static KeyValuePair<string, object> X2(int value) =>
            new KeyValuePair<string, object>("x2", value);

        public static KeyValuePair<string, object> Y2(int value) =>
            new KeyValuePair<string, object>("y2", value);

        public static KeyValuePair<string, object> CX(int value) =>
            new KeyValuePair<string, object>("cx", value);

        public static KeyValuePair<string, object> CY(int value) =>
            new KeyValuePair<string, object>("cy", value);

        public static KeyValuePair<string, object> R(int value) =>
            new KeyValuePair<string, object>("r", value);

        public static KeyValuePair<string, object> Stroke(string value) =>
            new KeyValuePair<string, object>("stroke", value);

        public static KeyValuePair<string, object> StrokeWidth(double value) =>
            new KeyValuePair<string, object>("stroke-width", value);

        public static KeyValuePair<string, object> Fill(string value) =>
            new KeyValuePair<string, object>("fill", value);

        public static KeyValuePair<string, object> Transform(string value) =>
            new KeyValuePair<string, object>("transform", value);

        public static KeyValuePair<string, object> TransformTranslate(double x, double y) =>
            new KeyValuePair<string, object>("transform", $"translate({x}, {y})");

        public static KeyValuePair<string, object> Viewbox(double x, double y, double width, double height) =>
            new KeyValuePair<string, object>("viewbox", $"{x} {y} {width} {height}");
    }
}
