import * as React from "react";
import { Card, CardContent } from '@material-ui/core';

import App from "./App";
import * as Utils from "../Utils";
import { GuitarFretboard, renderGuitarNoteHighlightsAndNoteNames, GuitarNote, GuitarFretboardMetrics } from './GuitarFretboard';
import * as GuitarNotes from "./Quizzes/GuitarNotes";
import { Pitch } from '../Pitch';
import { PitchLetter } from '../PitchLetter';
import { createStudyFlashCardGroupComponent } from './StudyFlashCards';
import { MAX_MAIN_CARD_WIDTH } from './Style';

const noteGroups = [
  {
    color: "lightgreen",
    notes: [
      new GuitarNote(new Pitch(PitchLetter.G, 0, 2), 0),
      new GuitarNote(new Pitch(PitchLetter.A, 0, 2), 0),
      new GuitarNote(new Pitch(PitchLetter.B, 0, 2), 0),
      new GuitarNote(new Pitch(PitchLetter.C, 0, 3), 1),
      new GuitarNote(new Pitch(PitchLetter.D, 0, 3), 1),
      new GuitarNote(new Pitch(PitchLetter.E, 0, 3), 1),
      new GuitarNote(new Pitch(PitchLetter.F, 0, 3), 2),
      
      new GuitarNote(new Pitch(PitchLetter.G, 0, 4), 5),
      new GuitarNote(new Pitch(PitchLetter.A, 0, 4), 5),
      new GuitarNote(new Pitch(PitchLetter.B, 0, 4), 5)
    ]
  },
  {
    color: "lightsalmon",
    notes: [
      new GuitarNote(new Pitch(PitchLetter.G, 0, 3), 2),
      new GuitarNote(new Pitch(PitchLetter.A, 0, 3), 2),
      new GuitarNote(new Pitch(PitchLetter.B, 0, 3), 2),
      new GuitarNote(new Pitch(PitchLetter.C, 0, 4), 3),
      new GuitarNote(new Pitch(PitchLetter.D, 0, 4), 3),
      new GuitarNote(new Pitch(PitchLetter.E, 0, 4), 3),
      new GuitarNote(new Pitch(PitchLetter.F, 0, 4), 4)
    ]
  },
  {
    color: "lightblue",
    notes: [
      new GuitarNote(new Pitch(PitchLetter.G, 0, 4), 4),
      new GuitarNote(new Pitch(PitchLetter.A, 0, 4), 4),
      new GuitarNote(new Pitch(PitchLetter.B, 0, 3), 4),
      new GuitarNote(new Pitch(PitchLetter.C, 0, 3), 0),
      new GuitarNote(new Pitch(PitchLetter.D, 0, 3), 0),
      new GuitarNote(new Pitch(PitchLetter.E, 0, 2), 0),
      new GuitarNote(new Pitch(PitchLetter.F, 0, 3), 1),
      
      new GuitarNote(new Pitch(PitchLetter.C, 0, 5), 5),
      new GuitarNote(new Pitch(PitchLetter.D, 0, 5), 5),
      new GuitarNote(new Pitch(PitchLetter.E, 0, 4), 5)
    ]
  },
  {
    color: "yellow",
    notes: [
      new GuitarNote(new Pitch(PitchLetter.G, 0, 3), 1),
      new GuitarNote(new Pitch(PitchLetter.A, 0, 2), 1),
      new GuitarNote(new Pitch(PitchLetter.B, 0, 2), 1),
      new GuitarNote(new Pitch(PitchLetter.C, 0, 4), 2),
      new GuitarNote(new Pitch(PitchLetter.D, 0, 3), 2),
      new GuitarNote(new Pitch(PitchLetter.E, 0, 3), 2),
      new GuitarNote(new Pitch(PitchLetter.F, 0, 4), 3)
    ]
  },
  {
    color: "turquoise",
    notes: [
      new GuitarNote(new Pitch(PitchLetter.G, 0, 3), 3),
      new GuitarNote(new Pitch(PitchLetter.A, 0, 3), 3),
      new GuitarNote(new Pitch(PitchLetter.B, 0, 3), 3),
      new GuitarNote(new Pitch(PitchLetter.C, 0, 4), 4),
      new GuitarNote(new Pitch(PitchLetter.D, 0, 4), 4),
      new GuitarNote(new Pitch(PitchLetter.E, 0, 4), 4),
      new GuitarNote(new Pitch(PitchLetter.F, 0, 2), 0),
      
      new GuitarNote(new Pitch(PitchLetter.F, 0, 4), 5)
    ]
  },
  {
    color: "lightgray",
    notes: [
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
      new GuitarNote(new Pitch(PitchLetter.D, 1, 4), 4),
      
      new GuitarNote(new Pitch(PitchLetter.F, 1, 4), 5),
      new GuitarNote(new Pitch(PitchLetter.G, 1, 4), 5),
      new GuitarNote(new Pitch(PitchLetter.A, 1, 4), 5),
      new GuitarNote(new Pitch(PitchLetter.C, 1, 5), 5),
      new GuitarNote(new Pitch(PitchLetter.D, 1, 5), 5)
    ]
  }
];

const diagram1NoteGroups = [
  {
    color: noteGroups[0].color,
    notes: noteGroups[0].notes.slice(0, 7)
  }
];
const diagram1Notes = Utils.flattenArrays<GuitarNote>(diagram1NoteGroups
  .map(ng => ng.notes));

const diagram2NoteGroups = diagram1NoteGroups.concat([
  {
    color: noteGroups[1].color,
    notes: noteGroups[1].notes.slice(0, 6)
  }
]);
const diagram2Notes = Utils.flattenArrays<GuitarNote>(diagram2NoteGroups
  .map(ng => ng.notes));

const diagram3NoteGroups = diagram2NoteGroups.concat([
  {
    color: noteGroups[1].color,
    notes: noteGroups[1].notes.slice(6)
  },
  {
    color: noteGroups[2].color,
    notes: noteGroups[2].notes.slice(0, 7)
  }
]);
const diagram3Notes = Utils.flattenArrays<GuitarNote>(diagram3NoteGroups
  .map(ng => ng.notes));

const diagram4NoteGroups = diagram3NoteGroups.concat([
  {
    color: noteGroups[3].color,
    notes: noteGroups[3].notes
  }
]);
const diagram4Notes = Utils.flattenArrays<GuitarNote>(diagram4NoteGroups
  .map(ng => ng.notes));


const diagram5NoteGroups = diagram4NoteGroups.concat([
  {
    color: noteGroups[4].color,
    notes: noteGroups[4].notes.slice(0, 7)
  }
]);
const diagram5Notes = Utils.flattenArrays<GuitarNote>(diagram4NoteGroups
  .map(ng => ng.notes));

const diagram7NoteGroups = diagram2NoteGroups.concat([
  {
    color: noteGroups[1].color,
    notes: noteGroups[1].notes.slice(6)
  },
  {
    color: noteGroups[2].color,
    notes: noteGroups[2].notes.slice(0, 7)
  },
  {
    color: noteGroups[3].color,
    notes: noteGroups[3].notes
  },
  {
    color: noteGroups[4].color,
    notes: noteGroups[4].notes.slice(0, 7)
  }
]);
const diagram7Notes = Utils.flattenArrays<GuitarNote>(diagram7NoteGroups
  .map(ng => ng.notes));

const diagram8NoteGroups = diagram7NoteGroups.concat([
  {
    color: noteGroups[5].color,
    notes: noteGroups[5].notes.slice(0, 25)
  }
]);

const diagram9NoteGroups = noteGroups;
const diagram9Notes = Utils.flattenArrays<GuitarNote>(diagram9NoteGroups
  .map(ng => ng.notes));

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
    const fretboardHeight = 140;

    return (
      <Card style={{ maxWidth: MAX_MAIN_CARD_WIDTH, marginBottom: "6em" }}>
        <CardContent>
          <h1>Guitar Note Identification Lesson</h1>

          <p>Being able to identify all of the notes on your instrument is vital to becoming a skilled musician, and learning this skill on guitar is quicker and easier than you might think. Let's get started!</p>
          
          <h3>Introduction</h3>
          <p>There are 6 strings and (usually) up to 24 frets on a guitar:</p>
          <p style={{ textAlign: "center" }}>
            <GuitarFretboard
              width={fretboardWidth} height={0.8 * fretboardHeight}
              pressedNotes={[]}
              fretCount={24}
            />
          </p>

          <p>This means that there are 150 notes to learn! Luckily, you can leverage a few rules to cut the number of notes you need to memorize down only <strong>7 notes</strong>! Then, as you use combine these rules with the 7 notes to identify other notes, you will naturally memorize more notes on the fretboard and become faster at identifying them.</p>
          
          <h3>Step 1</h3>
          <p>The first rule is that the notes repeat every 12 frets. This means that we can ignore all fretted notes after the 11th fret and wrap around instead (so the 12th fret is the same as the open string, the 13th fret is the same as the 1st fret, and so on). Now we are left with this section of the guitar:</p>
          <p style={{ textAlign: "center" }}>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              pressedNotes={[]}
            />
          </p>

          <h3>Step 2</h3>
          <p>The second rule is that the highest string's notes and the lowest string's notes have the exact same names. So, we can ignore the highest string (the one at the top of the fretboard diagrams) when memorizing notes and wrap around to the lowest string instead. Now we are left with the notes highlighted in green:</p>
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

          <h3>Step 3</h3>
          <p>Memorize these 7 notes and the shape they make. Note that from reading from the bottom-up and left to right follows the musical alphabet (which cycles back to A after G).</p>
          <p style={{ textAlign: "center" }}>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              pressedNotes={[]}
              renderExtrasFn={metrics => this.renderDiagramExtras(metrics, diagram1NoteGroups)}
            />
          </p>
          <p>
            {createStudyFlashCardGroupComponent(
              GuitarNotes.createFlashCardGroup(diagram1Notes), false, true, "Step 3 Quiz", { margin: "0 auto" })}
          </p>
          
          <h3>Step 4</h3>
          <p>Memorize this rule: If you move up 2 strings and right 2 frets (or in the exact opposite direction) from any note, that note has the same name as the starting note.</p>
          <p style={{ textAlign: "center" }}>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              pressedNotes={[]}
              renderExtrasFn={metrics => this.renderDiagramExtras(metrics, diagram2NoteGroups)}
            />
          </p>
          <p>
            {createStudyFlashCardGroupComponent(
              GuitarNotes.createFlashCardGroup(diagram2Notes), false, true, "Step 4 Quiz", { margin: "0 auto" })}
          </p>

          <h3>Step 5</h3>
          <p>We stopped on the 3rd highest string because there is a special rule you must follow to continue: When moving from the 3rd highest string to the 2nd highest string, you must shift one fret to the right (and therefore when crossing back from the 2nd highest string to the 3rd highest string, you must shift one fret to the left).</p>
          <p>This rule, combined with the previous rules, allows us to identify the rest of the natural notes (non-sharp/flat notes):</p>
          <p style={{ textAlign: "center" }}>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              pressedNotes={[]}
              renderExtrasFn={metrics => this.renderDiagramExtras(metrics, diagram5NoteGroups)}
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
          
          <p>
            {createStudyFlashCardGroupComponent(
              GuitarNotes.createFlashCardGroup(diagram7Notes), false, true, "Step 5 Quiz", { margin: "0 auto" })}
          </p>
          
          <h3>Step 6</h3>
          <p>To identify the rest of the notes (accidental notes, whose names have added symbols as well), simply add a '#' (read "sharp") to the natural note to the left, or add a 'b' (read "flat") to the natural note to the right. Yes, each of these notes has two possible names, and which name you use depends on the context (more info. on this in the {App.instance.renderNavLink("/essential-music-theory", "Essential Music Theory")} lesson).</p>
          <p style={{ textAlign: "center" }}>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              pressedNotes={[]}
              renderExtrasFn={metrics => this.renderDiagramExtras(metrics, diagram8NoteGroups)}
            />
          </p>
          <p>Because the lowest and highest strings have the same note names, and because the note names repeat every 12 frets, you have now identified every note on the fretboard!</p>
          <p style={{ textAlign: "center" }}>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              pressedNotes={[]}
              renderExtrasFn={metrics => this.renderDiagramExtras(metrics, diagram9NoteGroups)}
            />
          </p>

          <h3>Test Your Knowledge</h3>
          <p>Now, you can practice your knowledge on your guitar, or using the exercise below.</p>
          <p>
            {createStudyFlashCardGroupComponent(
              GuitarNotes.createFlashCardGroup(diagram9Notes), false, true, "Step 6 Quiz", { margin: "0 auto" })}
          </p>
        </CardContent>
      </Card>
    );
  }
  private renderDiagramExtras(
    metrics: GuitarFretboardMetrics,
    diagramNoteGroups: Array<{ color: string, notes: Array<GuitarNote> }>): JSX.Element {
    return (
      <g>
        {diagramNoteGroups
          .map(dng => renderGuitarNoteHighlightsAndNoteNames(
            metrics, dng.notes, dng.color
          ))}
      </g>
    );
  }
}