using OneOf;

namespace Falsetto.Client.Html;

using Attribute = KeyValuePair<string, object>;

[GenerateOneOf]
public partial class Node : OneOfBase<TextNode, Element> { }

public record TextNode(string Value);

public record Element(
    string Type,
    Dictionary<string, object>? Attributes = null,
    List<Node>? Children = null);

public static class NodeExtensions
{
    public static string ToHtml(this Node node) =>
        node.Match(
            textNode => textNode.ToHtml(),
            element => element.ToHtml());
}

public static class TextNodeExtensions
{
    public static string ToHtml(this TextNode textNode) => textNode.Value;
}

public static class ElementExtensions
{
    public static string ToHtml(this Element element) => $"<{element.Type}{element.Attributes?.Map(a => a.ToHtml()).AddBeforeEach(" ").Join()}>{element.Children?.Map(NodeExtensions.ToHtml).Join()}</{element.Type}>";
}

public static class AttributeExtensions
{
    public static string ToHtml(this Attribute attribute) => $"{attribute.Key}=\"{attribute.Value}\"";
}

public static class HtmlHelpers
{
    public static class Elem
    {
        public static List<Node> Nodes(params Node[] nodes) => nodes.ToList();

        public static Node Text(string Value) => new TextNode(Value);

        public static Node Div(
            Dictionary<string, object>? Attributes = null,
            List<Node>? Children = null) =>
            new Element("div", Attributes, Children);

        public static Node P(
            Dictionary<string, object>? Attributes = null,
            List<Node>? Children = null) =>
            new Element("p", Attributes, Children);

        public static Node Svg(
            Dictionary<string, object>? Attributes = null,
            List<Node>? Children = null) =>
            new Element(
                "svg",
                (Attributes ?? new Dictionary<string, object>())
                    .AddIfMissing("xmlns", "http://www.w3.org/2000/svg"),
                Children);

        public static Node G(
            Dictionary<string, object>? Attributes = null,
            List<Node>? Children = null) =>
            new Element("g", Attributes, Children);

        public static Node Rect(
            Dictionary<string, object>? Attributes = null) =>
            new Element("rect", Attributes);

        public static Node Line(
            Dictionary<string, object>? Attributes = null) =>
            new Element("line", Attributes);

        public static Node Circle(
            Dictionary<string, object>? Attributes = null) =>
            new Element("circle", Attributes);
    }

    public static class Attr
    {
        public static Dictionary<string, object> Attrs(params Attribute[] keyValuePairs) =>
            new Dictionary<string, object>(keyValuePairs);

        public static Attribute Width(double value) =>
            new Attribute("width", value);

        public static Attribute Height(double value) =>
            new Attribute("height", value);

        public static Attribute X(double value) =>
            new Attribute("x", value);

        public static Attribute Y(double value) =>
            new Attribute("y", value);

        public static Attribute X1(double value) =>
            new Attribute("x1", value);

        public static Attribute Y1(double value) =>
            new Attribute("y1", value);

        public static Attribute X2(double value) =>
            new Attribute("x2", value);

        public static Attribute Y2(double value) =>
            new Attribute("y2", value);

        public static Attribute CX(double value) =>
            new Attribute("cx", value);

        public static Attribute CY(double value) =>
            new Attribute("cy", value);

        public static Attribute R(double value) =>
            new Attribute("r", value);

        public static Attribute Stroke(string value) =>
            new Attribute("stroke", value);

        public static Attribute StrokeWidth(double value) =>
            new Attribute("stroke-width", value);

        public static Attribute Fill(string value) =>
            new Attribute("fill", value);

        public static Attribute Transform(string value) =>
            new Attribute("transform", value);

        public static Attribute TransformTranslate(double x, double y) =>
            new Attribute("transform", $"translate({x}, {y})");

        public static Attribute Viewbox(double x, double y, double width, double height) =>
            new Attribute("viewbox", $"{x} {y} {width} {height}");
    }
}
