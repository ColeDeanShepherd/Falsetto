import { Pitch, parseFromUriComponent, getUriComponent as getPitchUriComponent } from "./Pitch";
import { getSimpleScaleDegree } from './Scale';
import { ChordType, parseChordTypeFromUriComponent, getUriComponent as getChordTypeUriComponent } from "./ChordType";

export function getSimpleChordNoteNumber(chordNoteNumber: number) {
  return getSimpleScaleDegree(chordNoteNumber);
}

export function parseChordFromUriComponent(uriComponent: string): Chord | undefined {
  const splitStr = uriComponent.split("-");
  if (splitStr.length !== 2) { return undefined; }

  const chordTypeUriComponent = splitStr[1];
  const chordType = parseChordTypeFromUriComponent(chordTypeUriComponent);
  if (!chordType) { return undefined; }

  const rootPitchString = splitStr[0];
  const rootPitch = parseFromUriComponent(rootPitchString, /*octaveNumber*/ 4);
  if (!rootPitch) { return undefined; }

  return new Chord(chordType, rootPitch);
}

export function getUriComponent(chord: Chord): string {
  return `${getPitchUriComponent(chord.rootPitch)}-${getChordTypeUriComponent(chord.type)}`;
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