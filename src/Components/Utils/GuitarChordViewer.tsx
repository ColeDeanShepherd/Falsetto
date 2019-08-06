import * as React from "react";

import { Size2D } from "../../Size2D";
import { Pitch } from "../../Pitch";
import { PitchLetter } from "../../PitchLetter";
import { StringedInstrumentNote } from '../../GuitarNote';
import { ChordType } from "../../Chord";
import { GuitarFretboard, renderGuitarNoteHighlightsAndLabels, StringedInstrumentTuning } from "./GuitarFretboard";

export const GuitarChordViewer: React.FunctionComponent<{
  chordType: ChordType,
  rootPitch: Pitch,
  tuning: StringedInstrumentTuning,
  size: Size2D
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
  const minFretNumber = 0;
  const fretCount = 11;
  const maxFretNumber = minFretNumber + fretCount;
  const guitarNotes = StringedInstrumentNote.allNotesOfPitches(
    props.tuning, pitches, minFretNumber, maxFretNumber
  );

  return (
    <GuitarFretboard
      width={props.size.width} height={props.size.height}
      tuning={props.tuning}
      minFretNumber={minFretNumber} fretCount={fretCount}
      renderExtrasFn={metrics => renderGuitarNoteHighlightsAndLabels(
        metrics, guitarNotes, "lightblue",
        (n, i) => (1 + pitches.findIndex(p => p.midiNumberNoOctave == n.pitch.midiNumberNoOctave)).toString()
      )}
    />
  );
}