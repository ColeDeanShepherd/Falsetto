import { Pitch } from "../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../lib/TheoryLib/PitchLetter";
import { StringedInstrumentNote } from '../../lib/TheoryLib/StringedInstrumentNote';
import { invariant, precondition } from '../../lib/Core/Dbc';

export class StringedInstrumentTuning {
  public constructor(public openStringPitches: Array<Pitch>) {
    invariant(this.openStringPitches.length > 0);
  }

  public get stringCount(): number {
    return this.openStringPitches.length;
  }

  public getNote(stringIndex: number, fretNumber: number): StringedInstrumentNote {
    precondition((stringIndex >= 0) && (stringIndex < this.stringCount));

    const pitch = Pitch.createFromMidiNumber(
      this.openStringPitches[stringIndex].midiNumber + fretNumber
    );
    return new StringedInstrumentNote(pitch, stringIndex);
  }
}
export const standard6StringGuitarTuning = new StringedInstrumentTuning([
  new Pitch(PitchLetter.E, 0, 2),
  new Pitch(PitchLetter.A, 0, 2),
  new Pitch(PitchLetter.D, 0, 3),
  new Pitch(PitchLetter.G, 0, 3),
  new Pitch(PitchLetter.B, 0, 3),
  new Pitch(PitchLetter.E, 0, 4)
]);
export const standard7StringGuitarTuning = new StringedInstrumentTuning([
  new Pitch(PitchLetter.B, 0, 1),
  new Pitch(PitchLetter.E, 0, 2),
  new Pitch(PitchLetter.A, 0, 2),
  new Pitch(PitchLetter.D, 0, 3),
  new Pitch(PitchLetter.G, 0, 3),
  new Pitch(PitchLetter.B, 0, 3),
  new Pitch(PitchLetter.E, 0, 4)
]);
export const standard8StringGuitarTuning = new StringedInstrumentTuning([
  new Pitch(PitchLetter.F, 1, 1),
  new Pitch(PitchLetter.B, 0, 1),
  new Pitch(PitchLetter.E, 0, 2),
  new Pitch(PitchLetter.A, 0, 2),
  new Pitch(PitchLetter.D, 0, 3),
  new Pitch(PitchLetter.G, 0, 3),
  new Pitch(PitchLetter.B, 0, 3),
  new Pitch(PitchLetter.E, 0, 4)
]);

export const standardViolinTuning = new StringedInstrumentTuning([
  new Pitch(PitchLetter.G, 0, 3),
  new Pitch(PitchLetter.D, 0, 4),
  new Pitch(PitchLetter.A, 0, 4),
  new Pitch(PitchLetter.E, 0, 5)
]);

export function getStandardGuitarTuning(stringCount: number): StringedInstrumentTuning {
  switch (stringCount) {
    case 6:
      return standard6StringGuitarTuning;
    case 7:
      return standard7StringGuitarTuning;
    case 8:
      return standard8StringGuitarTuning;
    default:
      throw new Error(`No registered standard guitar tuning for ${stringCount} strings.`);
  }
}