import * as Utils from "./Utils";
import { Pitch } from "./Pitch";
import { GuitarTuning } from './Components/Utils/GuitarFretboard';

export class GuitarNote {
  public static allNotesOfPitches(
    tuning: GuitarTuning,
    pitches: Array<Pitch>,
    minFretNumber: number,
    maxFretNumber: number
  ): Array<GuitarNote> {
    Utils.precondition(minFretNumber >= 0);
    Utils.precondition(maxFretNumber >= minFretNumber);

    const fretNumbers = Utils.range(0, maxFretNumber);
    return Utils.flattenArrays<GuitarNote>(
      tuning.openStringPitches
        .map((_, stringIndex) => fretNumbers
          .map(fretNumber => new GuitarNote(
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
    Utils.invariant(stringIndex >= 0);
  }

  // TODO: add tests
  public getFretNumber(tuning: GuitarTuning): number {
    const openStringPitch = tuning.openStringPitches[this.stringIndex];
    return this.pitch.midiNumber - openStringPitch.midiNumber;
  }
}