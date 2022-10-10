using Falsetto.Client.Html;
using static Falsetto.Client.Html.HtmlHelpers.Elem;
using static Falsetto.Client.Html.HtmlHelpers.Attr;

namespace Falsetto.Client;

public record GuitarNote(
    uint StringIndex,
    uint FretNumber);

public static class GuitarFretboardDiagram
{
    public static Element GuitarFretboard(
        List<GuitarNote> markedNotes)
    {
        int width = 400;
        int height = 140;
        int padding = 20;
        int numFrets = 11;

        int fretboardWidth = width - (2 * padding);
        int fretboardHeight = height - (2 * padding);
        int nutWidth = 8;
        int nutX = nutWidth / 2;
        int fretBarWidth = 4;
        int fretWidth = (fretboardWidth - 8) / numFrets;
        double lowestStringWidth = 3;
        int fretboardToStringYPadding = 5;
        int stringYSpacing = (fretboardHeight - (2 * fretboardToStringYPadding)) / 5;

        double GetStringY(uint stringIndex) => fretboardToStringYPadding + (stringYSpacing * stringIndex);
        double GetFretSpaceCenterX(uint fretNumber) =>
            fretNumber switch
            {
                0 => nutWidth / 2,
                _ => nutWidth + ((fretNumber - 1) * fretWidth) + (fretWidth / 2)
            };

        return Svg(Attrs(Width(width), Height(height), Viewbox(0, 0, width, height)), Elems(
            G(Attrs(TransformTranslate(padding, padding)), Elems(
                // Wood
                Rect(Attrs(X(0), Y(0), Width(fretboardWidth), Height(fretboardHeight), StrokeWidth(0), Fill("#844e30"))),
                // Nut
                Line(Attrs(X1(nutX), Y1(0), X2(nutX), Y2(fretboardHeight), Stroke("#a29f98"), StrokeWidth(nutWidth)))
                // Fret Bars
                ).Add(Enumerable.Range(1, numFrets).Map(i =>
                {
                    int x = nutWidth + (fretWidth * i);
                    return Line(Attrs(X1(x), Y1(0), X2(x), Y2(fretboardHeight), Stroke("#bebeba"), StrokeWidth(fretBarWidth)));
                })
                // Strings
                ).Add(Enumerable.Range(0, 6).Map(i =>
                {
                    double y = GetStringY((uint)i);
                    double stringWidth = lowestStringWidth / (1 + ((double)(5 - i) / 4));
                    return Line(Attrs(X1(nutWidth), Y1(y), X2(fretboardWidth), Y2(y), Stroke("#dad2cb"), StrokeWidth(stringWidth)));
                })
                // Fret Markers
                ).Add((new uint[] { 3, 5, 7, 9 }).Map(i =>
                {
                    double cx = GetFretSpaceCenterX(i);
                    return Circle(Attrs(CX(cx), CY(fretboardHeight / 2), R(8), Fill("#fdfcf8"), StrokeWidth(0)));
                })
                // Marked Notes
                ).Add(markedNotes.Map(n =>
                {
                    double cx = GetFretSpaceCenterX(n.FretNumber);
                    double cy = GetStringY(n.StringIndex);
                    return Circle(Attrs(CX(cx), CY(cy), R(8), Fill("lightblue"), StrokeWidth(0)));
                }))
            ))
        );
    }
}
