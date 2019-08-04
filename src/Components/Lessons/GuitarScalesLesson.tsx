import * as React from "react";
import { Card, CardContent } from '@material-ui/core';

import * as Utils from "../../Utils";
import App from '../App';
import {
  GuitarFretboard, StringedInstrumentMetrics,
  renderGuitarNoteHighlightsAndLabels, renderFretNumbers, getStandardGuitarTuning,
  getPreferredGuitarScaleShape, 
} from '../Utils/GuitarFretboard';
import { Pitch } from '../../Pitch';
import { PitchLetter } from '../../PitchLetter';
import { MAX_MAIN_CARD_WIDTH } from '../Style';
import { ScaleType, Scale } from '../../Scale';
import { NoteText } from './EssentialMusicTheory';
import { ScaleAudioPlayer } from '../Utils/ScaleAudioPlayer';
import { createStudyFlashCardSetComponent } from '../StudyFlashCards';
import * as GuitarScales from "../Quizzes/Scales/GuitarScales";
import { ScaleViewer } from '../Tools/ScaleViewer';
import { StringedInstrumentNote } from '../../GuitarNote';

const fretCount = 11;
const ionianRootPitch = new Pitch(PitchLetter.F, 0, 2);
const ionianPitches = ScaleType.Ionian.getPitches(ionianRootPitch);
const majorPentatonicRootPitch = new Pitch(PitchLetter.A, 0, 2);
const majorPentatonicPitches = ScaleType.MajorPentatonic.getPitches(majorPentatonicRootPitch);
const melodicMinorRootPitch = new Pitch(PitchLetter.F, 0, 2);
const melodicMinorPitches = ScaleType.MelodicMinor.getPitches(melodicMinorRootPitch);
const noteHighlightColor = "lightblue";

const GuitarScalePatternDiagram: React.FunctionComponent<{
  scale: Scale,
  stringCount?: number,
  dontShiftBetweenGAndBStrings?: boolean,
  canListen?: boolean
}> = props => {
  const fretboardWidth = 400;
  const fretboardHeight = 140;
  const fretboardStyle = { width: "100%", maxWidth: "400px", height: "auto" };
  const stringCount = (props.stringCount !== undefined) ? props.stringCount : 6;
  
  const dontShiftBetweenGAndBStrings = (props.dontShiftBetweenGAndBStrings !== undefined)
    ? props.dontShiftBetweenGAndBStrings
    : false;
  const guitarTuning = getStandardGuitarTuning(stringCount);
  const guitarNotes = getPreferredGuitarScaleShape(props.scale, guitarTuning);

  if (dontShiftBetweenGAndBStrings) {
    const gStringIndex = (props.stringCount === 6)
      ? 3
      : 4;

    for (let note of guitarNotes) {
      if (note.stringIndex > gStringIndex) {
        note.pitch.signedAccidental--;
      }
    }
  }

  const maxFretNumber = Utils.arrayMax(guitarNotes
    .map(gn => gn.getFretNumber(guitarTuning))
  );
  const minFretNumber = Math.max(0, maxFretNumber - fretCount);

  const canListen = (props.canListen !== undefined) ? props.canListen : true;

  return (
    <div>
      {canListen ? <p style={{ textAlign: "center" }}><ScaleAudioPlayer scale={props.scale} pitchCount={guitarNotes.length} /></p> : null}
      <p style={{ textAlign: "center" }}>
        <GuitarFretboard
          width={fretboardWidth} height={fretboardHeight}
          tuning={getStandardGuitarTuning(stringCount)}
          renderExtrasFn={metrics => renderGuitarScalePatternDiagramExtras(metrics, props.scale.type, guitarNotes)}
          minFretNumber={minFretNumber}
          fretCount={fretCount}
          style={fretboardStyle}
        />
      </p>
    </div>
  );
};

function renderGuitarScalePatternDiagramExtras(
  metrics: StringedInstrumentMetrics,
  scaleType: ScaleType,
  notes: Array<StringedInstrumentNote>
): JSX.Element {
  return (
    <g>
      {renderGuitarNoteHighlightsAndLabels(
        metrics, notes, noteHighlightColor, (n, i) => (1 + (i % scaleType.pitchIntegers.length)).toString()
      )}
      {renderFretNumbers(metrics)}
    </g>
  );
}

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

    return (
      <Card style={{ maxWidth: MAX_MAIN_CARD_WIDTH }}>
        <CardContent>
          <h1>Learn Guitar Scale Shapes</h1>
          <p>Knowing common scales &amp; modes on your instrument is vital to becoming a skilled musician. There are countless scales &amp; modes to learn, but we will leverage some repeating patterns that arise on the guitar fretboard to quickly and easily learn some common scales &amp; modes on guitar.</p>
          <p>If you are not already familiar with scales &amp; modes at a conceptual level, we highly recommend you complete the {App.instance.renderNavLink("/essential-music-theory/scales-and-modes", "Scales & Modes")} section of our {App.instance.renderNavLink("/essential-music-theory", "Essential Music Theory")} course before continuing with this lesson.</p>
          <p>In this lesson we will be covering the modes of the major scale, the modes of the major pentatonic scale, and the modes of the melodic minor scale, but at <a href="#all-scales">the bottom</a> of this lesson there is an interactive scale viewer with more scales &amp; modes to explore.</p>

          <h3 style={{ marginTop: "3em" }}>Modes of the Major Scale</h3>
          <p>The modes of each scale played with 3 notes per string on guitar follows a specific repeating pattern of shapes.</p>
          <p>For the modes of the major scale, there are 7 parts to the repeating pattern -- one for each note in the major scale -- so we will show the repeating pattern on a 7 string guitar. The diagram below just happens to start on the 5th fret, but the pattern will be shifted left or right depending on which scale or mode is being played.</p>
          <GuitarScalePatternDiagram
            scale={new Scale(ScaleType.Mixolydian, ionianPitches[0])}
            stringCount={7}
            dontShiftBetweenGAndBStrings={true}
            canListen={false}
          />
          <NoteText>
            To clearly depict the repeating pattern, the diagram above does not shift 1 fret to the right when crossing from the G string to the B string as you always should. When actually playing the pattern you must include the shift as shown below:
            <GuitarScalePatternDiagram
              scale={new Scale(ScaleType.Mixolydian, ionianPitches[0])}
              stringCount={7}
              canListen={false}
            />
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
          <GuitarScalePatternDiagram
            scale={new Scale(ScaleType.Ionian, ionianPitches[0])}
          />
          
          <h3>Dorian</h3>
          <p>The G dorian mode is the 2nd mode of the F major scale, and starts on the 7th part of the repeating pattern above. Here is the G dorian mode:</p>
          <GuitarScalePatternDiagram
            scale={new Scale(ScaleType.Dorian, ionianPitches[1])}
          />
          
          <h3>Phrygian</h3>
          <p>The A phrygian mode is the 3rd mode of the F major scale, and starts on the 5th part of the repeating pattern. Here is the A phrygian mode:</p>
          <GuitarScalePatternDiagram
            scale={new Scale(ScaleType.Phrygian, ionianPitches[2])}
          />

          <h3>Lydian</h3>
          <p>The Bb lydian mode is the 4th mode of the F major scale, and starts on the 3rd part of the repeating pattern. Here is the Bb lydian mode:</p>
          <GuitarScalePatternDiagram
            scale={new Scale(ScaleType.Lydian, ionianPitches[3])}
          />

          <h3>Mixolydian</h3>
          <p>The C mixolydian mode is the 5th mode of the F major scale, and starts on the 1st part of the repeating pattern. Here is the C mixolydian mode:</p>
          <GuitarScalePatternDiagram
            scale={new Scale(ScaleType.Mixolydian, ionianPitches[4])}
          />

          <h3>Minor Scale (Aeolian Mode)</h3>
          <p>The D minor scale (aeolian mode) is the 6th mode of the F major scale, and starts on the 6th part of the repeating pattern. Here is the D minor scale (aeolian mode):</p>
          <GuitarScalePatternDiagram
            scale={new Scale(ScaleType.Aeolian, ionianPitches[5])}
          />

          <h3>Locrian</h3>
          <p>The E locrian mode is the 7th mode of the F major scale, and starts on the 4th part of the repeating pattern. Here is the E locrian mode:</p>
          <GuitarScalePatternDiagram
            scale={new Scale(ScaleType.Locrian, ionianPitches[6])}
          />
          
          <h3>Major Scale Mode Exercises</h3>
          <p>We have now learned the 7 modes of the F major scale, and with that knowledge, we can now play any mode of any other major scale, simply by shifting the patterns to the left or right to start on the desired note. Use the interactive exercises below to test your knowledge:</p>
          <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(GuitarScales.createFlashCardSet("Modes of the Major Scale", ScaleType.MajorScaleModes), false, true)}</div>

          <h3 style={{ marginTop: "3em" }}>Major Pentatonic Scale</h3>
          <p>Now let's take a look at the shapes for the 5 modes of the A major pentatonic scale.</p>
          <p>The modes of the major pentatonic scale have a repeating pattern:</p>
          <ul style={{ textAlign: "left" }}>
            <li>There are two 4-fret intervals followed by three 3-fret intervals.</li>
            <li>Whenever you reach the end of the pattern and you have to repeat it, the 1st 4-fret interval is shifted one fret to the left.</li>
            <li>As always, whenever you cross from the 3rd highest string to the 2nd highest string, you have to shift one fret to the right. Note that this can cancel out the shift to the left in the previous rule.</li>
          </ul>

          <p>The first mode of the major pentatonic scale, simply called the "major pentatonic scale", starts with the 3rd 3-fret interval on the lowest string, then goes back to the beginning of the pattern starting on the 2nd-lowest string:</p>
          <GuitarScalePatternDiagram
            scale={new Scale(ScaleType.MajorPentatonic, majorPentatonicPitches[0])}
          />
          
          <h3>Major Pentatonic Mode 2</h3>
          <p>The 2nd mode of the A major pentatonic scale starts with the 1st 3-fret interval, on the note B, and has the following shape:</p>
          <GuitarScalePatternDiagram
            scale={new Scale(ScaleType.MajorPentatonicMode2, majorPentatonicPitches[1])}
          />
          
          <h3>Major Pentatonic Mode 3</h3>
          <p>The 3rd mode of the A major pentatonic scale starts with the 1st 4-fret interval, on the note C#, and has the following shape:</p>
          <GuitarScalePatternDiagram
            scale={new Scale(ScaleType.MajorPentatonicMode3, majorPentatonicPitches[2])}
          />

          <h3>Major Pentatonic Mode 4</h3>
          <p>The 4th mode of the A major pentatonic scale starts with the 2nd 3-fret interval, on the note E, and has the following shape:</p>
          <GuitarScalePatternDiagram
            scale={new Scale(ScaleType.MajorPentatonicMode4, majorPentatonicPitches[3])}
          />

          <h3>Minor Pentatonic Scale</h3>
          <p>The 5th mode of the A major pentatonic scale is the F# minor pentatonic scale, which starts on the 2nd 4-fret interval and has the following shape:</p>
          <GuitarScalePatternDiagram
            scale={new Scale(ScaleType.MinorPentatonic, majorPentatonicPitches[4])}
          />

          <h3>Exercises</h3>
          <p>Use the interactive exercises below to test your knowledge of the 5 modes of the major pentatonic scale:</p>
          <div>{createStudyFlashCardSetComponent(GuitarScales.createFlashCardSet("Modes of the Major Pentatonic Scale", ScaleType.MajorPentatonicScaleModes), false, true)}</div>

          <h3 style={{ marginTop: "3em" }}>Modes of the Melodic Minor Scale</h3>
          <p>For the modes of the melodic minor scale, there are 7 parts to the repeating pattern:</p>
          <GuitarScalePatternDiagram
            scale={new Scale(ScaleType.LocrianNat9, melodicMinorPitches[0])}
            stringCount={7}
            dontShiftBetweenGAndBStrings={true}
            canListen={false}
          />
          <NoteText>
            To clearly depict the repeating pattern, the diagram above does not shift 1 fret to the right when crossing from the G string to the B string as you always should. When actually playing the pattern you must include the shift as shown below:
            <GuitarScalePatternDiagram
              scale={new Scale(ScaleType.LocrianNat9, melodicMinorPitches[0])}
              stringCount={7}
              canListen={false}
            />
          </NoteText>

          <p>Let's take a look at the shapes for the modes of the F melodic minor scale.</p>

          <h3>Melodic Minor</h3>
          <p>The F melodic minor scale starts on the 4th part of the repeating pattern above. Here is the F melodic minor scale:</p>
          <GuitarScalePatternDiagram
            scale={new Scale(ScaleType.MelodicMinor, melodicMinorPitches[0])}
          />
          
          <h3>Dorian b2</h3>
          <p>The G dorian b2 mode is the 2nd mode of the F melodic minor scale, and starts on the 2nd part of the repeating pattern above. Here is the G dorian b2 mode:</p>
          <GuitarScalePatternDiagram
            scale={new Scale(ScaleType.Dorianb2, melodicMinorPitches[1])}
          />
          
          <h3>Lydian Augmented</h3>
          <p>The Ab lydian augmented mode is the 3rd mode of the F melodic minor scale, and starts on the 7th part of the repeating pattern. Here is the Ab lydian augmented mode:</p>
          <GuitarScalePatternDiagram
            scale={new Scale(ScaleType.LydianAug, melodicMinorPitches[2])}
          />

          <h3>Mixolydian #11</h3>
          <p>The Bb mixolydian #11 mode is the 4th mode of the F melodic minor scale, and starts on the 5th part of the repeating pattern. Here is the Bb mixolydian #11:</p>
          <GuitarScalePatternDiagram
            scale={new Scale(ScaleType.MixolydianSharp11, melodicMinorPitches[3])}
          />

          <h3>Mixolydian b6</h3>
          <p>The C mixolydian b6 mode is the 5th mode of the F melodic minor scale, and starts on the 3rd part of the repeating pattern. Here is the C mixolydian b6 mode:</p>
          <GuitarScalePatternDiagram
            scale={new Scale(ScaleType.Mixolydianb6, melodicMinorPitches[4])}
          />

          <h3>Locrian Natural 9</h3>
          <p>The D locrian natural 9 mode is the 6th mode of the F melodic minor scale, and starts on the 1st part of the repeating pattern. Here is the D locrian natural 9 mode:</p>
          <GuitarScalePatternDiagram
            scale={new Scale(ScaleType.LocrianNat9, melodicMinorPitches[5])}
          />

          <h3>Altered Dominant</h3>
          <p>The E altered dominant mode is the 7th mode of the F melodic minor scale, and starts on the 6th part of the repeating pattern. Here is the E altered dominant mode:</p>
          <GuitarScalePatternDiagram
            scale={new Scale(ScaleType.AlteredDominant, melodicMinorPitches[6])}
          />
          
          <h3>Melodic Minor Scale Mode Exercises</h3>
          <p>We have now learned the 7 modes of the F melodic minor scale, and with that knowledge, we can now play any mode of any other melodic minor scale, simply by shifting the patterns to the left or right to start on the desired note. Use the interactive exercises below to test your knowledge:</p>
          <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(GuitarScales.createFlashCardSet("Modes of the Melodic Minor Scale", ScaleType.MelodicMinorScaleModes), false, true)}</div>

          <h3 id="all-scales" style={{ marginTop: "4em" }}>Other Scales</h3>
          <p>Use the interactive diagram below to view other guitar scales.</p>
          <ScaleViewer renderAllScaleShapes={false} showPianoKeyboard={false} isEmbedded={false} />
        </CardContent>
      </Card>
    );
  }
}