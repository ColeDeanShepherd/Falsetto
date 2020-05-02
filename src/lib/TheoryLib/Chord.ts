import { Pitch } from "./Pitch";
import { getSimpleScaleDegree } from './Scale';
import { ChordType } from "./ChordType";

export function getSimpleChordNoteNumber(chordNoteNumber: number) {
  return getSimpleScaleDegree(chordNoteNumber);
}

export class Chord {
  public constructor(
    public type: ChordType,
    public rootPitch: Pitch
  ) {}

  public getSymbol(useOneAccidentalAmbiguousPitch: boolean): string {
    const rootPitchString = useOneAccidentalAmbiguousPitch
      ? this.rootPitch.toOneAccidentalAmbiguousString(false)
      : this.rootPitch.toString(false);
    return `${rootPitchString}${this.type.symbols[0]}`;
  }
  public getPitches(): Array<Pitch> {
    return this.type.formula.getPitches(this.rootPitch);
  }
}