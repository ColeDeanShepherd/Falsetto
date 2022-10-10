using Falsetto.Client.Html;
using static Falsetto.Client.Html.HtmlHelpers.Elem;
using static Falsetto.Client.Html.HtmlHelpers.Attr;

namespace Falsetto.Shared;

public static class GuitarFretboardDiagram
{
    public static Element GuitarFretboard()
    {
        int width = 400;
        int height = 140;
        int padding = 20;
        int fretboardWidth = width - (2 * padding);
        int fretboardHeight = height - (2 * padding);
        int nutWidth = 8;
        int nutX = nutWidth / 2;
        int fretBarWidth = 4;
        int fretWidth = (fretboardWidth - 8) / 11;
        double lowestStringWidth = 3;
        int fretboardToStringYPadding = 5;
        int stringYSpacing = height - (2 * fretboardToStringYPadding) / 5;

        return Svg(Attrs(Width(width), Height(height), Viewbox(0, 0, width, height)), Elems(
            G(Attrs(TransformTranslate(padding, padding)), Elems(
                // Wood
                Rect(Attrs(X(0), Y(0), Width(fretboardWidth), Height(fretboardHeight), StrokeWidth(0), Fill("#844e30"))),
                // Nut
                Line(Attrs(X1(nutX), Y1(0), X2(nutX), Y2(fretboardHeight), Stroke("#a29f98"), StrokeWidth(nutWidth)))
                // Fret Bars
                ).Add(Enumerable.Range(1, 11).Map(i =>
                {
                    int x = nutWidth + (fretWidth * i);
                    return Line(Attrs(X1(x), Y1(0), X2(x), Y2(fretboardHeight), Stroke("#bebeba"), StrokeWidth(fretBarWidth)));
                })
                // Strings
                ).Add(Enumerable.Range(0, 6).Map(i =>
                {
                    int y = fretboardToStringYPadding + (stringYSpacing * i);
                    double stringWidth = lowestStringWidth / (1 + ((float)(5 - i) / 4));
                    return Line(Attrs(X1(nutWidth), Y1(y), X2(fretboardWidth), Y2(y), Stroke("#dad2cb"), StrokeWidth(stringWidth)));
                })
                // Fret Markers
                ).Add((new[] { 2, 4, 6, 8 }).Map(i =>
                {
                    int cx = nutWidth + (i * fretWidth) + (fretWidth / 2);
                    return Circle(Attrs(CX(cx), CY(height / 2), R(8), Fill("#fdfcf8"), StrokeWidth(0)));
                })))
        ));
    }
}
