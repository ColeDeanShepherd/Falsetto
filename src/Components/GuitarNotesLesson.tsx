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

    const step1Notes = [
      new GuitarNote(new Pitch(PitchLetter.G, 0, 2), 0),
      new GuitarNote(new Pitch(PitchLetter.A, 0, 2), 0),
      new GuitarNote(new Pitch(PitchLetter.B, 0, 2), 0),
      new GuitarNote(new Pitch(PitchLetter.C, 0, 3), 1),
      new GuitarNote(new Pitch(PitchLetter.D, 0, 3), 1),
      new GuitarNote(new Pitch(PitchLetter.E, 0, 3), 1),
      new GuitarNote(new Pitch(PitchLetter.F, 0, 3), 2)
    ];
    const step1RenderExtras = (metrics: GuitarFretboardMetrics) =>
      renderGuitarNoteHighlightsAndNoteNames(metrics, step1Notes, "lightgreen");

    const step2NoteGroup1 = [
      new GuitarNote(new Pitch(PitchLetter.G, 0, 3), 2),
      new GuitarNote(new Pitch(PitchLetter.A, 0, 3), 2),
      new GuitarNote(new Pitch(PitchLetter.B, 0, 3), 2),
      new GuitarNote(new Pitch(PitchLetter.C, 0, 4), 3),
      new GuitarNote(new Pitch(PitchLetter.D, 0, 4), 3),
      new GuitarNote(new Pitch(PitchLetter.E, 0, 4), 3),
      new GuitarNote(new Pitch(PitchLetter.F, 0, 4), 4)
    ];
    const step2NoteGroup2 = [
      new GuitarNote(new Pitch(PitchLetter.G, 0, 4), 4),
      new GuitarNote(new Pitch(PitchLetter.A, 0, 4), 4),
      new GuitarNote(new Pitch(PitchLetter.B, 0, 3), 4)
    ];
    const step2RenderExtras = (metrics: GuitarFretboardMetrics) => (
      <g>
        {step1RenderExtras(metrics)}
        {renderGuitarNoteHighlightsAndNoteNames(metrics, step2NoteGroup1, "lightsalmon")}
        {renderGuitarNoteHighlightsAndNoteNames(metrics, step2NoteGroup2, "lightblue")}
      </g>
    );

    const step3NoteGroup1 = [
      new GuitarNote(new Pitch(PitchLetter.G, 0, 3), 3),
      new GuitarNote(new Pitch(PitchLetter.A, 0, 3), 3),
      new GuitarNote(new Pitch(PitchLetter.B, 0, 3), 3),
      new GuitarNote(new Pitch(PitchLetter.C, 0, 4), 4),
      new GuitarNote(new Pitch(PitchLetter.D, 0, 4), 4),
      new GuitarNote(new Pitch(PitchLetter.E, 0, 4), 4)
    ];
    const step3NoteGroup2 = [
      new GuitarNote(new Pitch(PitchLetter.C, 0, 3), 0),
      new GuitarNote(new Pitch(PitchLetter.D, 0, 3), 0),
      new GuitarNote(new Pitch(PitchLetter.F, 0, 3), 1)
    ];
    const step3NoteGroup3 = [
      new GuitarNote(new Pitch(PitchLetter.G, 0, 3), 1),
      new GuitarNote(new Pitch(PitchLetter.C, 0, 4), 2),
      new GuitarNote(new Pitch(PitchLetter.F, 0, 4), 3),
    ];
    const step3RenderExtras = (metrics: GuitarFretboardMetrics) => (
      <g>
        {step2RenderExtras(metrics)}
        {renderGuitarNoteHighlightsAndNoteNames(metrics, step3NoteGroup1, "yellow")}
        {renderGuitarNoteHighlightsAndNoteNames(metrics, step3NoteGroup2, "turquoise")}
        {renderGuitarNoteHighlightsAndNoteNames(metrics, step3NoteGroup3, "orange")}
      </g>
    );

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
          <p>The first rule is that the notes repeat every 12 frets. This means that we can ignore all fretted notes after the 11th fret.</p>
          <p style={{ textAlign: "center" }}>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              pressedNotes={[]}
            />
          </p>

          <p>Step 2</p>
          <p>The second rule is that the highest string's notes and the lowest string's notes have the exact same names. So, we can ignore the highest string (the one at the top of the fretboard diagrams).</p>
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
              renderExtrasFn={step1RenderExtras}
            />
          </p>
          <p>TODO: quiz</p>
          
          <p>Step 4</p>
          <p>Memorize this rule: If you move up 2 strings and right 2 frets (or in the exact opposite direction) from any note, that note has the same name as the starting note. When moving from the 3rd highest string to the 2nd highest string, you must shift one fret to the right (and therefore when crossing back from the 2nd highest string to the 3rd highest string, you must shift one fret to the left). So, you can repeat the pattern of notes you memorized twice as you go up and to the right of the fretboard.</p>
          <p>Note that if the pattern extends past the 11th fret (which is the case for E &amp; B in the top-left), it wraps around because the notes repeat every 12 frets.</p>
          <p style={{ textAlign: "center" }}>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              pressedNotes={[]}
              renderExtrasFn={step2RenderExtras}
            />
          </p>
          <p>TODO: quiz</p>
          
          <p>Step 5</p>
          <p>Memorize this rule: If you move up 3 strings and left 3 frets from any note (or in the opposite direction), that note has the same name as the starting note. <strong>Be sure follow the shifting rule between the 3rd highest and 2nd highest strings.</strong></p>
          <p style={{ textAlign: "center" }}>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              pressedNotes={[]}
              renderExtrasFn={step3RenderExtras}
            />
          </p>
          <p>TODO: quiz</p>
        </CardContent>
      </Card>
    );
  }
}