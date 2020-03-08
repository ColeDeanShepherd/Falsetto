import * as React from "react";

import { Size2D } from "../../lib/Core/Size2D";
import { Pitch } from "../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../lib/TheoryLib/PitchLetter";
import { StringedInstrumentNote } from '../../lib/TheoryLib/StringedInstrumentNote';
import { ChordType } from "../../lib/TheoryLib/Chord";
import { GuitarFretboard, renderGuitarNoteHighlightsAndLabels } from "./GuitarFretboard";
import { StringedInstrumentTuning } from "./StringedInstrumentTuning";

const MIN_FRET_NUMBER = 0;
const MAX_FRET_NUMBER = 11;

export const GuitarChordViewer: React.FunctionComponent<{
  chordType: ChordType,
  rootPitch: Pitch,
  tuning: StringedInstrumentTuning,
  size: Size2D,
  style?: any
}> = props => {
  let rootPitch = Pitch.createFromMidiNumber(
    (new Pitch(PitchLetter.C, 0, 2)).midiNumber + props.rootPitch.midiNumberNoOctave
  );

  // If the root pitch is below the range of the guitar, add an octave.
  const guitarLowestNoteMidiNumber = (new Pitch(PitchLetter.E, 0, 2)).midiNumber;
  if (rootPitch.midiNumber < guitarLowestNoteMidiNumber) {
    rootPitch.octaveNumber++;
  }

  const pitches = props.chordType.getPitches(rootPitch);
  const maxFretNumber = MIN_FRET_NUMBER + MAX_FRET_NUMBER;
  const guitarNotes = StringedInstrumentNote.allNotesOfPitches(
    props.tuning, pitches, MIN_FRET_NUMBER, maxFretNumber
  );

  return (
    <GuitarFretboard
      width={props.size.width} height={props.size.height}
      tuning={props.tuning}
      minFretNumber={MIN_FRET_NUMBER} fretCount={MAX_FRET_NUMBER}
      renderExtrasFn={metrics => renderGuitarNoteHighlightsAndLabels(
        metrics, guitarNotes, "lightblue",
        (n, i) => ""
      )}
      style={props.style}
    />
  );
}