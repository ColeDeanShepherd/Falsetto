import * as React from "react";
import { Card, CardContent } from '@material-ui/core';

import * as Utils from "../Utils";
import { GuitarFretboard, renderGuitarNoteHighlightsAndNoteNames, GuitarNote, GuitarFretboardMetrics, renderGuitarNoteHighlightsAndLabels } from './GuitarFretboard';
import { Pitch } from '../Pitch';
import { PitchLetter } from '../PitchLetter';
import { MAX_MAIN_CARD_WIDTH } from './Style';
import { ScaleType } from '../Scale';
import { NoteText } from './EssentialMusicTheory';

export function get3NotePerStringScaleNotes(
  scaleType: ScaleType, rootPitch: Pitch, stringCount: number
): Array<GuitarNote> {
  const scalePitches = (new Array<Pitch>())
    .concat(scaleType.getPitches(rootPitch))
    .concat(scaleType.getPitches(new Pitch(rootPitch.letter, rootPitch.signedAccidental, rootPitch.octaveNumber + 1)))
    .concat(scaleType.getPitches(new Pitch(rootPitch.letter, rootPitch.signedAccidental, rootPitch.octaveNumber + 2)))
    .slice(0, 3 * stringCount);
  const guitarNotes = scalePitches
    .map((p, i) => new GuitarNote(p, Math.floor(i / 3)));
  return guitarNotes;
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
    const fretboardHeight = 160;
    const fretboardStyle = { width: "100%", maxWidth: "400px", height: "auto" };

    return (
      <Card style={{ maxWidth: MAX_MAIN_CARD_WIDTH, marginBottom: "6em" }}>
        <CardContent style={{ textAlign: "center" }}>
          <h1>Learn the Guitar Scales</h1>
          
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
          <p>Let's take a look at the shapes for the modes of the F major scale. Pay closer attention to the shapes on the fretboard, which are not specific to the underlying key, than the exact fret numbers.</p>

          <h3>Major Scale (Ionian)</h3>
          <p>The major scale starts on the 2nd part of the repeating pattern above. Here is the F major scale (1st mode of the F major scale):</p>
          <p>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              renderExtrasFn={metrics => this.renderDiagramExtras(metrics, ScaleType.Ionian, baseScalePitches[0])}
              fretCount={fretCount}
              style={fretboardStyle}
            />
          </p>
          
          <h3>Dorian</h3>
          <p>The dorian mode starts on the 7th part of the repeating pattern above. Here is the G dorian mode (2st mode of the F major scale):</p>
          <p>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              renderExtrasFn={metrics => this.renderDiagramExtras(metrics, ScaleType.Dorian, baseScalePitches[1])}
              fretCount={fretCount}
              style={fretboardStyle}
            />
          </p>
          
          <h3>Phrygian</h3>
          <p>The phrygian mode starts on the 5th part of the repeating pattern. Here is the A phrygian mode (3rd mode of the F major scale):</p>
          <p>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              renderExtrasFn={metrics => this.renderDiagramExtras(metrics, ScaleType.Phrygian, baseScalePitches[2])}
              fretCount={fretCount}
              style={fretboardStyle}
            />
          </p>

          <h3>Lydian</h3>
          <p>The lydian mode starts on the 3rd part of the repeating pattern. Here is the Bb lydian mode (4th mode of the F major scale):</p>
          <p>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              renderExtrasFn={metrics => this.renderDiagramExtras(metrics, ScaleType.Lydian, baseScalePitches[3])}
              fretCount={fretCount}
              style={fretboardStyle}
            />
          </p>

          <h3>Mixolydian</h3>
          <p>The mixolydian mode starts on the 1st part of the repeating pattern. Here is the C mixolydian mode (5th mode of the F major scale):</p>
          <p>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              renderExtrasFn={metrics => this.renderDiagramExtras(metrics, ScaleType.Mixolydian, baseScalePitches[4])}
              fretCount={fretCount}
              style={fretboardStyle}
            />
          </p>

          <h3>Minor Scale (Aeolian)</h3>
          <p>The minor scale (aeolian mode) starts on the 6th part of the repeating pattern. Here is the D major scale (aeolian mode) (6th mode of the F major scale):</p>
          <p>
            <GuitarFretboard
              width={fretboardWidth} height={fretboardHeight}
              renderExtrasFn={metrics => this.renderDiagramExtras(metrics, ScaleType.Aeolian, baseScalePitches[5])}
              fretCount={fretCount}
              style={fretboardStyle}
            />
          </p>

          <h3>Locrian</h3>
          <p>The locrian mode starts on the 4th part of the repeating pattern. Here is the E locrian mode (7th mode of the F major scale):</p>
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

          <p>TODO: audio</p>
          <p>TODO: quizzes</p>

          <h3>Interactive Exercises</h3>

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
    const notes = get3NotePerStringScaleNotes(scaleType, rootPitch, metrics.stringCount);

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
        {this.renderFretNumbers(metrics)}
      </g>
    );
  }
  private renderFretNumbers(metrics: GuitarFretboardMetrics): JSX.Element {
    const fretNumbers = Utils.range(0, fretCount);
    return (
      <g>
        {fretNumbers.map(fretNumber => {
          const fontSize = 12;
          let x = metrics.getNoteX(fretNumber) - (0.4 * fontSize);
          if (fretNumber == 0) {
            x -= 0.25 * metrics.fretSpacing;
          }

          const y = metrics.height + 20;
          const textStyle: any = {
            fontSize: `${fontSize}px`,
            fontWeight: "bold"
          };

          return (
            <text
              x={x} y={y}
              style={textStyle}>
              {fretNumber}
            </text>
          );
        })}
      </g>
    );
  }
}