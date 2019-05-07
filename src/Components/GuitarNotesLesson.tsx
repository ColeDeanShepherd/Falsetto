import * as React from "react";
import { Card, CardContent } from '@material-ui/core';
import { GuitarFretboard, renderGuitarNoteHighlightsAndNoteNames, GuitarNote, GuitarFretboardMetrics } from './GuitarFretboard';
import { Pitch } from '../Pitch';
import { PitchLetter } from '../PitchLetter';

export interface IGuitarNotesLessonProps {
}
export interface IGuitarNotesLessonState {
}
export class GuitarNotesLesson extends React.Component<IGuitarNotesLessonProps, IGuitarNotesLessonState> {
  public constructor(props: IGuitarNotesLessonProps) {
    super(props);
    
    this.state = {};
  }
  public render(): JSX.Element {
    const fretboardWidth = 400;
    const fretboardHeight = 100;

    return (
      <Card style={{ marginBottom: "6em" }}>
        <CardContent>
          <p>Being able to identify all of the notes on your instrument is vital to becoming a skilled musician, and learning this skill on guitar is quicker and easier than you might think. There are no excuses to not having this skill. Let's get started!</p>
          
          <p>Introduction</p>
          <p>There are 6 strings and (usually) up to 24 frets on a guitar:</p>
          <p style={{ textAlign: "center" }}>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              pressedNotes={[]}
              fretCount={24}
            />
          </p>

          <p>This means there are 6 open string notes and up to 6 * 24 = 144 fretted notes, adding up to 150 notes! Luckily, you can use a few rules to cut the number of notes you need to memorize down only <strong>7 notes</strong>! Then, as you use combine these rules with the 7 notes to identify other notes, you will naturally memorize more notes on the fretboard and become faster at identifying them.</p>
          
          <p>Step 1</p>
          <p>The first rule is that the notes repeat every 12 frets. This means that we can ignore all fretted notes after the 11th fret and wrap around instead (so the 12th fret is the same as the open string, the 13th fret is the same as the 1st fret, and so on).</p>
          <p style={{ textAlign: "center" }}>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              pressedNotes={[]}
            />
          </p>

          <p>Step 2</p>
          <p>The second rule is that the highest string's notes and the lowest string's notes have the exact same names. So, we can ignore the highest string (the one at the top of the fretboard diagrams) when memorizing notes and wrap around to the lowest string instead.</p>
          <p style={{ textAlign: "center" }}>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              pressedNotes={[]}
              renderExtrasFn={metrics => {
                const y = 0.75 * metrics.stringSpacing;

                return (
                  <rect
                    x={0} y={y}
                    width={metrics.width} height={metrics.height - y}
                    fill="green"
                    fillOpacity={0.3}>
                  </rect>
                );
              }}
            />
          </p>

          <p>Step 3</p>
          <p>Memorize these 7 notes and the shape they make. Note that from reading from the bottom-up and left to right follows the musical alphabet (which cycles back to A after G).</p>
          <p style={{ textAlign: "center" }}>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              pressedNotes={[]}
              renderExtrasFn={metrics => this.renderDiagram1Extras(metrics)}
            />
          </p>
          <p>TODO: quiz</p>
          
          <p>Step 4</p>
          <p>Memorize this rule: If you move up 2 strings and right 2 frets (or in the exact opposite direction) from any note, that note has the same name as the starting note.</p>
          <p style={{ textAlign: "center" }}>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              pressedNotes={[]}
              renderExtrasFn={metrics => this.renderDiagram2Extras(metrics)}
            />
          </p>

          <p>Step 5</p>
          <p>We stopped on the 3rd highest string because there is a special rule you must follow to continue: When moving from the 3rd highest string to the 2nd highest string, you must shift one fret to the right (and therefore when crossing back from the 2nd highest string to the 3rd highest string, you must shift one fret to the left).</p>
          <p>This rule, combined with the previous rules, allows us to identify all of the natural notes (non-sharp/flat notes):</p>
          <p style={{ textAlign: "center" }}>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              pressedNotes={[]}
              renderExtrasFn={metrics => this.renderDiagram3Extras(metrics)}
            />
          </p>
          <p>Though we can reach &amp; identify all natural notes with these rules, it can sometimes take a few steps to get to some of the notes. To shorten the number of steps to get to these notes you can memorize some additional rules:</p>
          <ul>
            <li>The names of the open notes, from lowest to highest, are: E, A, D, G, B, E</li>
            <li>If you move up 3 strings and left 3 frets from any note (or in the opposite direction), that note has the same name as the starting note. The rule when moving between the 2nd-highest and 3rd-highest strings still holds!</li>
            <li>C is directly to the right of B, and F is directly to the right of E.</li>
            <li>For every string but the 3rd-highest string, the name of the 5th fret is the same as the name of the next open string. For the 3rd-highest string, this is true for the 4th fret instead.</li>
            <li>For every string but the 2nd-highest string, the name of the 7th fret is the same as the name of the previous open string. For the 2nd-highest string, this is true for the 8th fret instead.</li>
          </ul>

          <p>These rules should be enough for fast identification of natural notes, but there are many more rules you can memorize. Explore your fretboard and apply your knowledge of music theory to discover them!</p>
          
          <p>TODO: quiz</p>
          
          <p>Step 6</p>
          <p>To identify the rest of the notes (accidental notes, whose names have added symbols as well), simply add a '#' (read "sharp") to the natural note to the left, or add a 'b' (read "flat") to the natural note to the right. Yes, each of these notes has two possible names, and which name you use depends on the context (more info. on this in the "Essential Music Theory" lesson TODO: LINK).</p>
          <p style={{ textAlign: "center" }}>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              pressedNotes={[]}
              renderExtrasFn={metrics => this.renderDiagram4Extras(metrics)}
            />
          </p>
          <p>Because the lowest and highest strings have the same note names, and because the note names repeat every 12 frets, you have now identified every note on the fretboard!</p>
          <p style={{ textAlign: "center" }}>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              pressedNotes={[]}
              renderExtrasFn={metrics => this.renderDiagram5Extras(metrics)}
            />
          </p>
          <p>Now, you can practice your knowledge on your guitar, or using the exercise below.</p>
          <p>TODO: quiz</p>
        </CardContent>
      </Card>
    );
  }
  private renderDiagram1Extras(metrics: GuitarFretboardMetrics): JSX.Element {
    const notes = [
      new GuitarNote(new Pitch(PitchLetter.G, 0, 2), 0),
      new GuitarNote(new Pitch(PitchLetter.A, 0, 2), 0),
      new GuitarNote(new Pitch(PitchLetter.B, 0, 2), 0),
      new GuitarNote(new Pitch(PitchLetter.C, 0, 3), 1),
      new GuitarNote(new Pitch(PitchLetter.D, 0, 3), 1),
      new GuitarNote(new Pitch(PitchLetter.E, 0, 3), 1),
      new GuitarNote(new Pitch(PitchLetter.F, 0, 3), 2)
    ];

    return renderGuitarNoteHighlightsAndNoteNames(metrics, notes, "lightgreen");
  }
  private renderDiagram2Extras(metrics: GuitarFretboardMetrics): JSX.Element {
    const noteGroup1 = [
      new GuitarNote(new Pitch(PitchLetter.G, 0, 3), 2),
      new GuitarNote(new Pitch(PitchLetter.A, 0, 3), 2),
      new GuitarNote(new Pitch(PitchLetter.B, 0, 3), 2),
      new GuitarNote(new Pitch(PitchLetter.C, 0, 4), 3),
      new GuitarNote(new Pitch(PitchLetter.D, 0, 4), 3),
      new GuitarNote(new Pitch(PitchLetter.E, 0, 4), 3)
    ];

    return (
      <g>
        {this.renderDiagram1Extras(metrics)}
        {renderGuitarNoteHighlightsAndNoteNames(metrics, noteGroup1, "lightsalmon")}
      </g>
    );
  }
  private renderDiagram3Extras(metrics: GuitarFretboardMetrics): JSX.Element {
    const noteGroup1 = [
      new GuitarNote(new Pitch(PitchLetter.F, 0, 4), 4)
    ];
    const noteGroup2 = [
      new GuitarNote(new Pitch(PitchLetter.G, 0, 4), 4),
      new GuitarNote(new Pitch(PitchLetter.A, 0, 4), 4),
      new GuitarNote(new Pitch(PitchLetter.B, 0, 3), 4),
      new GuitarNote(new Pitch(PitchLetter.C, 0, 3), 0),
      new GuitarNote(new Pitch(PitchLetter.D, 0, 3), 0),
      new GuitarNote(new Pitch(PitchLetter.E, 0, 2), 0),
      new GuitarNote(new Pitch(PitchLetter.F, 0, 3), 1)
    ];
    const noteGroup3 = [
      new GuitarNote(new Pitch(PitchLetter.G, 0, 3), 1),
      new GuitarNote(new Pitch(PitchLetter.A, 0, 2), 1),
      new GuitarNote(new Pitch(PitchLetter.B, 0, 2), 1),
      new GuitarNote(new Pitch(PitchLetter.C, 0, 4), 2),
      new GuitarNote(new Pitch(PitchLetter.D, 0, 3), 2),
      new GuitarNote(new Pitch(PitchLetter.E, 0, 3), 2),
      new GuitarNote(new Pitch(PitchLetter.F, 0, 4), 3)
    ];
    const noteGroup4 = [
      new GuitarNote(new Pitch(PitchLetter.G, 0, 3), 3),
      new GuitarNote(new Pitch(PitchLetter.A, 0, 3), 3),
      new GuitarNote(new Pitch(PitchLetter.B, 0, 3), 3),
      new GuitarNote(new Pitch(PitchLetter.C, 0, 4), 4),
      new GuitarNote(new Pitch(PitchLetter.D, 0, 4), 4),
      new GuitarNote(new Pitch(PitchLetter.E, 0, 4), 4),
      new GuitarNote(new Pitch(PitchLetter.F, 0, 2), 0)
    ];

    return (
      <g>
        {this.renderDiagram2Extras(metrics)}
        {renderGuitarNoteHighlightsAndNoteNames(metrics, noteGroup1, "lightsalmon")}
        {renderGuitarNoteHighlightsAndNoteNames(metrics, noteGroup2, "lightblue")}
        {renderGuitarNoteHighlightsAndNoteNames(metrics, noteGroup3, "yellow")}
        {renderGuitarNoteHighlightsAndNoteNames(metrics, noteGroup4, "turquoise")}
      </g>
    );
  }
  private renderDiagram4Extras(metrics: GuitarFretboardMetrics): JSX.Element {
    const notes = [
      new GuitarNote(new Pitch(PitchLetter.F, 1, 2), 0),
      new GuitarNote(new Pitch(PitchLetter.G, 1, 2), 0),
      new GuitarNote(new Pitch(PitchLetter.A, 1, 2), 0),
      new GuitarNote(new Pitch(PitchLetter.C, 1, 3), 0),
      new GuitarNote(new Pitch(PitchLetter.D, 1, 3), 0),
      
      new GuitarNote(new Pitch(PitchLetter.F, 1, 3), 1),
      new GuitarNote(new Pitch(PitchLetter.G, 1, 3), 1),
      new GuitarNote(new Pitch(PitchLetter.A, 1, 2), 1),
      new GuitarNote(new Pitch(PitchLetter.C, 1, 3), 1),
      new GuitarNote(new Pitch(PitchLetter.D, 1, 3), 1),

      new GuitarNote(new Pitch(PitchLetter.F, 1, 3), 2),
      new GuitarNote(new Pitch(PitchLetter.G, 1, 3), 2),
      new GuitarNote(new Pitch(PitchLetter.A, 1, 3), 2),
      new GuitarNote(new Pitch(PitchLetter.C, 1, 4), 2),
      new GuitarNote(new Pitch(PitchLetter.D, 1, 3), 2),

      new GuitarNote(new Pitch(PitchLetter.F, 1, 4), 3),
      new GuitarNote(new Pitch(PitchLetter.G, 1, 3), 3),
      new GuitarNote(new Pitch(PitchLetter.A, 1, 3), 3),
      new GuitarNote(new Pitch(PitchLetter.C, 1, 4), 3),
      new GuitarNote(new Pitch(PitchLetter.D, 1, 4), 3),
      
      new GuitarNote(new Pitch(PitchLetter.F, 1, 4), 4),
      new GuitarNote(new Pitch(PitchLetter.G, 1, 4), 4),
      new GuitarNote(new Pitch(PitchLetter.A, 1, 4), 4),
      new GuitarNote(new Pitch(PitchLetter.C, 1, 4), 4),
      new GuitarNote(new Pitch(PitchLetter.D, 1, 4), 4)
    ];
    
    return (
      <g>
        {this.renderDiagram3Extras(metrics)}
        {renderGuitarNoteHighlightsAndNoteNames(metrics, notes, "lightgray")}
      </g>
    );
  }
  
  private renderDiagram5Extras(metrics: GuitarFretboardMetrics): JSX.Element {
    const noteGroup1 = [
      new GuitarNote(new Pitch(PitchLetter.G, 0, 4), 5),
      new GuitarNote(new Pitch(PitchLetter.A, 0, 4), 5),
      new GuitarNote(new Pitch(PitchLetter.B, 0, 4), 5)
    ];
    const noteGroup2 = [
      new GuitarNote(new Pitch(PitchLetter.C, 0, 5), 5),
      new GuitarNote(new Pitch(PitchLetter.D, 0, 5), 5),
      new GuitarNote(new Pitch(PitchLetter.E, 0, 4), 5)
    ];
    const noteGroup3 = [
      new GuitarNote(new Pitch(PitchLetter.F, 0, 4), 5)
    ];
    const noteGroup4 = [
      new GuitarNote(new Pitch(PitchLetter.F, 1, 4), 5),
      new GuitarNote(new Pitch(PitchLetter.G, 1, 4), 5),
      new GuitarNote(new Pitch(PitchLetter.A, 1, 4), 5),
      new GuitarNote(new Pitch(PitchLetter.C, 1, 5), 5),
      new GuitarNote(new Pitch(PitchLetter.D, 1, 5), 5),
    ];
    
    return (
      <g>
        {this.renderDiagram4Extras(metrics)}
        {renderGuitarNoteHighlightsAndNoteNames(metrics, noteGroup1, "lightgreen")}
        {renderGuitarNoteHighlightsAndNoteNames(metrics, noteGroup2, "lightblue")}
        {renderGuitarNoteHighlightsAndNoteNames(metrics, noteGroup3, "turquoise")}
        {renderGuitarNoteHighlightsAndNoteNames(metrics, noteGroup4, "lightgray")}
      </g>
    );
  }
}