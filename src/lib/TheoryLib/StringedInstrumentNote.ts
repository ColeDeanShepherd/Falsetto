import { Pitch } from "./Pitch";
import { StringedInstrumentTuning } from './StringedInstrumentTuning';
import { precondition, invariant } from '../Core/Dbc';
import { range } from '../Core/MathUtils';
import { flattenArrays } from '../Core/ArrayUtils';

export class StringedInstrumentNote {
  public static allNotesOfPitches(
    tuning: StringedInstrumentTuning,
    pitches: Array<Pitch>,
    minFretNumber: number,
    maxFretNumber: number
  ): Array<StringedInstrumentNote> {
    precondition(minFretNumber >= 0);
    precondition(maxFretNumber >= minFretNumber);

    const fretNumbers = range(0, maxFretNumber);
    return flattenArrays<StringedInstrumentNote>(
      tuning.openStringPitches
        .map((_, stringIndex) => fretNumbers
          .map(fretNumber => new StringedInstrumentNote(
            tuning.getNote(stringIndex, fretNumber).pitch,
            stringIndex
          ))
          .filter(note => pitches.some(p => p.midiNumberNoOctave === note.pitch.midiNumberNoOctave))
        )
    );
  }

  public constructor(
    public pitch: Pitch,
    public stringIndex: number
  ) {
    invariant(stringIndex >= 0);
  }

  public equals(other: StringedInstrumentNote) {
    return this.pitch.equals(other.pitch) && (this.stringIndex == other.stringIndex);
  }

  // TODO: add tests
  public getFretNumber(tuning: StringedInstrumentTuning): number {
    const openStringPitch = tuning.openStringPitches[this.stringIndex];
    return this.pitch.midiNumber - openStringPitch.midiNumber;
  }
}

export function getStringedInstrumentNotes(pitch: Pitch, tuning: StringedInstrumentTuning, minFretNumber: number, maxFretNumber: number): Array<StringedInstrumentNote> {
  precondition(minFretNumber <= maxFretNumber);
  
  const notes = new Array<StringedInstrumentNote>();

  for (let stringIndex = 0; stringIndex < tuning.stringCount; stringIndex++) {
    for (let fretNumber = minFretNumber; fretNumber <= maxFretNumber; fretNumber++) {
      const note = tuning.getNote(stringIndex, fretNumber);

      if (note.pitch.midiNumber === pitch.midiNumber) {
        notes.push(note);
      }
    }
  }

  return notes;
}