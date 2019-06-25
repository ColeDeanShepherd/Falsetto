import * as React from "react";
import { Card, CardContent } from '@material-ui/core';

import * as Utils from "../Utils";
import App from './App';
import { GuitarFretboard, GuitarNote, GuitarFretboardMetrics, renderGuitarNoteHighlightsAndLabels, renderFretNumbers } from './GuitarFretboard';
import { Pitch } from '../Pitch';
import { PitchLetter } from '../PitchLetter';
import { MAX_MAIN_CARD_WIDTH } from './Style';
import { ScaleType } from '../Scale';
import { NoteText } from './EssentialMusicTheory';
import { ScaleAudioPlayer } from './ScaleAudioPlayer';
import { createStudyFlashCardGroupComponent } from './StudyFlashCards';
import * as GuitarScales from "./Quizzes/GuitarScales";

export function getConstantNotesPerStringScaleNotes(
  scaleType: ScaleType, rootPitch: Pitch, stringCount: number, notesPerString: number
): Array<GuitarNote> {
  Utils.precondition(stringCount >= 1);
  Utils.precondition(notesPerString >= 1)

  const scalePitches = scaleType.getPitches(rootPitch);
  const guitarNotes = new Array<GuitarNote>(stringCount * notesPerString);

  for (let i = 0; i < guitarNotes.length; i++) {
    const scalePitchI = i % scaleType.numPitches;
    const deltaOctave = Math.floor(i / scaleType.numPitches);
    const stringI = Math.floor(i / notesPerString);

    guitarNotes[i] = new GuitarNote(
      new Pitch(scalePitches[scalePitchI].letter, scalePitches[scalePitchI].signedAccidental, scalePitches[scalePitchI].octaveNumber + deltaOctave),
      stringI
    );
  }

  return guitarNotes;
}
export function get2NotePerStringScaleNotes(
  scaleType: ScaleType, rootPitch: Pitch, stringCount: number
): Array<GuitarNote> {
  return getConstantNotesPerStringScaleNotes(scaleType, rootPitch, stringCount, 2);
}
export function get3NotePerStringScaleNotes(
  scaleType: ScaleType, rootPitch: Pitch, stringCount: number
): Array<GuitarNote> {
  return getConstantNotesPerStringScaleNotes(scaleType, rootPitch, stringCount, 3);
}

const fretCount = 17;
const scalesRootPitch = new Pitch(PitchLetter.F, 0, 2);
const baseScalePitches = ScaleType.Ionian.getPitches(scalesRootPitch);
const noteHighlightColor = "lightgreen";

export interface IGuitarScalesLessonProps {
}
export interface IGuitarScalesLessonState {
}
export class GuitarScalesLesson extends React.Component<IGuitarScalesLessonProps, IGuitarScalesLessonState> {
  public constructor(props: IGuitarScalesLessonProps) {
    super(props);
    
    this.state = {};
  }
  public render(): JSX.Element {
    const fretboardWidth = 600;
    const fretboardHeight = 170;
    const fretboardStyle = { width: "100%", maxWidth: "400px", height: "auto" };

    return (
      <Card style={{ maxWidth: MAX_MAIN_CARD_WIDTH, marginBottom: "6em" }}>
        <CardContent style={{ textAlign: "center" }}>
          <h1>Learn the Scales &amp; Modes on Guitar</h1>
          <p>Knowing common scales &amp; modes on your instrument is vital to becoming a skilled musician. There are countless scales &amp; modes to learn, but we will leverage some repeating patterns that arise on the guitar fretboard to quickly and easily learn the most common scales &amp; modes on guitar.</p>
          <p>If you are not already familiar with scales &amp; modes at a conceptual level, we highly recommend you complete the {App.instance.renderNavLink("/essential-music-theory/scales-and-modes", "Scales & Modes")} section of our "Essential Music Theory" course before continuing with this lesson.</p>

          <h3>Repeating Pattern for Modes of the Major Scale</h3>
          <p>The modes of each scale played with 3 notes per string on guitar follows a specific repeating pattern of shapes. For the modes of the major scale, there are 7 parts to the repeating pattern -- one for each note in the major scale -- so we will show the repeating pattern on a 7 string guitar. The diagram below just happens to start on the 5th fret, but the pattern will be shifted left or right depending on which scale or mode is being played.</p>
          <p>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              renderExtrasFn={metrics => this.renderDiagramExtras(metrics, ScaleType.Mixolydian, baseScalePitches[0], true)}
              fretCount={fretCount}
              stringCount={7}
              style={fretboardStyle}
            />
          </p>
          <NoteText>
            To clearly depict the repeating pattern, the diagram above does not shift 1 fret to the right when crossing from the G string to the B string as you always should. When actually playing the pattern you must include the shift as shown below:
            <p>
              <GuitarFretboard
                width={fretboardWidth} height={fretboardHeight}
                renderExtrasFn={metrics => this.renderDiagramExtras(metrics, ScaleType.Mixolydian, baseScalePitches[0])}
                fretCount={fretCount}
                stringCount={7}
                style={fretboardStyle}
              />
            </p>
          </NoteText>

          <p>Every mode of the major scale will follow this pattern, but will:</p>
          <ul style={{ textAlign: "left" }}>
            <li>be shifted left or right to start on a particular fret depending on the scale or mode being played</li>
            <li>start on a different part of the pattern</li>
            <li>repeat the pattern if it extends past the 7th part of the pattern</li>
            <li>include a 1-fret shift to the right when crossing from the G string (3rd string) to the B string (2nd string)</li>
          </ul>
          <p>Let's take a look at the shapes for the modes of the F major scale. Pay attention to the shapes on the fretboard, which are not specific to the underlying key, instead of the exact fret numbers.</p>

          <h3>Major Scale (Ionian Mode)</h3>
          <p>The F ionian mode is the 1st mode of the F major scale, and starts on the 2nd part of the repeating pattern above. Here is the F ionian scale:</p>
          <p><ScaleAudioPlayer scale={ScaleType.Ionian} rootPitch={baseScalePitches[0]} /></p>
          <p>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              renderExtrasFn={metrics => this.renderDiagramExtras(metrics, ScaleType.Ionian, baseScalePitches[0])}
              fretCount={fretCount}
              style={fretboardStyle}
            />
          </p>
          
          <h3>Dorian</h3>
          <p>The G dorian mode is the 2nd mode of the F major scale, and starts on the 7th part of the repeating pattern above. Here is the G dorian mode:</p>
          <p><ScaleAudioPlayer scale={ScaleType.Dorian} rootPitch={baseScalePitches[1]} /></p>
          <p>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              renderExtrasFn={metrics => this.renderDiagramExtras(metrics, ScaleType.Dorian, baseScalePitches[1])}
              fretCount={fretCount}
              style={fretboardStyle}
            />
          </p>
          
          <h3>Phrygian</h3>
          <p>The A phrygian mode is the 3rd mode of the F major scale, and starts on the 5th part of the repeating pattern. Here is the A phrygian mode:</p>
          <p><ScaleAudioPlayer scale={ScaleType.Phrygian} rootPitch={baseScalePitches[2]} /></p>
          <p>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              renderExtrasFn={metrics => this.renderDiagramExtras(metrics, ScaleType.Phrygian, baseScalePitches[2])}
              fretCount={fretCount}
              style={fretboardStyle}
            />
          </p>

          <h3>Lydian</h3>
          <p>The Bb lydian mode is the 4th mode of the F major scale, and starts on the 3rd part of the repeating pattern. Here is the Bb lydian mode:</p>
          <p><ScaleAudioPlayer scale={ScaleType.Lydian} rootPitch={baseScalePitches[3]} /></p>
          <p>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              renderExtrasFn={metrics => this.renderDiagramExtras(metrics, ScaleType.Lydian, baseScalePitches[3])}
              fretCount={fretCount}
              style={fretboardStyle}
            />
          </p>

          <h3>Mixolydian</h3>
          <p>The C mixolydian mode is the 5th mode of the F major scale, and starts on the 1st part of the repeating pattern. Here is the C mixolydian mode:</p>
          <p><ScaleAudioPlayer scale={ScaleType.Mixolydian} rootPitch={baseScalePitches[4]} /></p>
          <p>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              renderExtrasFn={metrics => this.renderDiagramExtras(metrics, ScaleType.Mixolydian, baseScalePitches[4])}
              fretCount={fretCount}
              style={fretboardStyle}
            />
          </p>

          <h3>Minor Scale (Aeolian Mode)</h3>
          <p>The D minor scale (aeolian mode) is the 6th mode of the F major scale, and starts on the 6th part of the repeating pattern. Here is the D minor scale (aeolian mode):</p>
          <p><ScaleAudioPlayer scale={ScaleType.Aeolian} rootPitch={baseScalePitches[5]} /></p>
          <p>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              renderExtrasFn={metrics => this.renderDiagramExtras(metrics, ScaleType.Aeolian, baseScalePitches[5])}
              fretCount={fretCount}
              style={fretboardStyle}
            />
          </p>

          <h3>Locrian</h3>
          <p>The E locrian mode is the 7th mode of the F major scale, and starts on the 4th part of the repeating pattern. Here is the E locrian mode:</p>
          <p><ScaleAudioPlayer scale={ScaleType.Locrian} rootPitch={baseScalePitches[6]} /></p>
          <p>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              renderExtrasFn={metrics => this.renderDiagramExtras(metrics, ScaleType.Locrian, baseScalePitches[6])}
              fretCount={fretCount}
              style={fretboardStyle}
            />
          </p>

          <h3>Summary</h3>
          <p>We have now learned the 7 modes of the F major scale, and with that knowledge, we can now play any mode of any other major scale, simply by shifting the patterns to the left or right to start on the desired note. Use the interactive exercises below to test your knowledge:</p>

          <h3>Interactive Exercises</h3>
          <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(GuitarScales.createFlashCardGroup(), false, true)}</div>
        </CardContent>
      </Card>
    );
  }
  private renderDiagramExtras(
    metrics: GuitarFretboardMetrics,
    scaleType: ScaleType,
    rootPitch: Pitch,
    dontShiftBetweenGAndBStrings?: boolean
  ): JSX.Element {
    dontShiftBetweenGAndBStrings = (dontShiftBetweenGAndBStrings !== undefined)
      ? dontShiftBetweenGAndBStrings
      : false;
    const notes = (scaleType.numPitches === 5)
      ? get2NotePerStringScaleNotes(scaleType, rootPitch, metrics.stringCount)
      : get3NotePerStringScaleNotes(scaleType, rootPitch, metrics.stringCount);

    if (dontShiftBetweenGAndBStrings) {
      const gStringIndex = (metrics.stringCount === 6)
        ? 3
        : 4;

      for (let note of notes) {
        if (note.stringIndex > gStringIndex) {
          note.pitch.signedAccidental--;
        }
      }
    }

    return (
      <g>
        {renderGuitarNoteHighlightsAndLabels(
          metrics, notes, noteHighlightColor, (n, i) => (1 + (i % scaleType.pitchIntegers.length)).toString()
        )}
        {renderFretNumbers(metrics)}
      </g>
    );
  }
}