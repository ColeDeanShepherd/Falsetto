import { parseFromUriComponent } from "./Pitch";
import { getSimpleScaleDegree } from './Scale';
import { ChordType, parseChordTypeFromUriComponent, getUriComponent as getChordTypeUriComponent } from "./ChordType";
import { getPitchClassUriComponent, PitchClass } from "./PitchClass";
import { pitchClassNameToPitchClass } from "./PitchClassName";

export function getSimpleChordNoteNumber(chordNoteNumber: number) {
  return getSimpleScaleDegree(chordNoteNumber);
}

// TODO: add tests
export function parseChordFromUriComponent(uriComponent: string): Chord | undefined {
  const splitStr = uriComponent.split("-");
  if (splitStr.length !== 2) { return undefined; }

  const chordTypeUriComponent = splitStr[1];
  const chordType = parseChordTypeFromUriComponent(chordTypeUriComponent);
  if (!chordType) { return undefined; }

  const rootPitchClassNameString = splitStr[0];
  const rootPitchClassName = parseFromUriComponent(rootPitchClassNameString, /*octaveNumber*/ 4);
  if (!rootPitchClassName) { return undefined; }

  return new Chord(chordType, pitchClassNameToPitchClass(rootPitchClassName));
}

export function getUriComponent(chord: Chord): string {
  return `${getPitchClassUriComponent(chord.rootPitchClass)}-${getChordTypeUriComponent(chord.type)}`;
}

export class Chord {
  public constructor(
    public type: ChordType,
    public rootPitchClass: PitchClass
  ) {}

  public getSymbol(useOneAccidentalAmbiguousPitch: boolean): string {
    const rootPitchString = useOneAccidentalAmbiguousPitch
      ? this.rootPitchClass.toOneAccidentalAmbiguousString(false)
      : this.rootPitchClass.toString(false);
    return `${rootPitchString}${this.type.symbols[0]}`;
  }
  
  public getPitchClasses(): Array<PitchClass> {
    return this.type.formula.getPitchClasses(this.rootPitchClass);
  }
}