import { Pitch } from './Pitch';
import { Chord } from './Chord';
import { Interval } from './Interval';
import { ChordScaleFormula } from './ChordScaleFormula';
import { mod } from '../Core/MathUtils';
import { precondition } from '../Core/Dbc';
import { isNullOrWhiteSpace } from '../Core/StringUtils';
import { CanonicalChord } from './CanonicalChord';
import { getPitchClassUriComponent, PitchClass, pitchClasses } from './PitchClass';
import { ScaleType } from './ScaleType';
import { parsePitchClassName, parsePitchClassNameFromUriComponent, pitchClassNameToPitchClass } from './PitchClassName';

// TODO: remove helpers?
export function getIntervalsFromFormula(formula: ChordScaleFormula): Array<Interval> {
  return formula.parts
    .map(p => new Interval(p.chordNoteNumber, p.signedAccidental));
}
export function getIntervalsFromFormulaString(formulaString: string): Array<Interval> {
  precondition(!isNullOrWhiteSpace(formulaString));

  return ChordScaleFormula.parse(formulaString).parts
    .map(p => p.getIntervalFromRootNote());
}

export function getModePitchIntegers(
  pitchIntegers: Array<number>, scaleDegree: number
): Array<number> {
  precondition(scaleDegree >= 1);

  const halfStepsToSubtract = pitchIntegers[scaleDegree - 1];
  const modePitchIntegers = new Array<number>(pitchIntegers.length);
  for (let modeI = 0; modeI < modePitchIntegers.length; modeI++) {
    const unwrappedBaseScaleI = (scaleDegree - 1) + modeI;
    const baseScaleI = unwrappedBaseScaleI % pitchIntegers.length;
    
    modePitchIntegers[modeI] = mod(pitchIntegers[baseScaleI] - halfStepsToSubtract, 12);
  }

  return modePitchIntegers;
}
export function getAllModePitchIntegers(pitchIntegers: Array<number>): Array<Array<number>> {
  return pitchIntegers
    .map((_, i) => getModePitchIntegers(pitchIntegers, 1 + i));
}

export function getSimpleScaleDegree(scaleDegree: number): number {
  return 1 + mod((scaleDegree - 1), 7);
}

export function getUriComponent(scale: Scale): string {
  return `${getPitchClassUriComponent(scale.rootPitchClass)}-${getScaleTypeUriComponent(scale.type)}`;
}

export function parseScaleFromUriComponent(uriComponent: string): Scale | undefined {
  const splitStr = uriComponent.split("-");
  if (splitStr.length !== 2) { return undefined; }

  const scaleTypeUriComponent = splitStr[1];
  const scaleType = parseScaleTypeFromUriComponent(scaleTypeUriComponent);
  if (!scaleType) { return undefined; }

  const scaleRootPitchClassString = splitStr[0];
  const rootPitchClassName = parsePitchClassNameFromUriComponent(scaleRootPitchClassString);
  if (!rootPitchClassName) { return undefined; }

  const rootPitchClass = pitchClassNameToPitchClass(rootPitchClassName);

  return new Scale(scaleType, rootPitchClass);
}

export function getScaleTypeUriComponent(scaleType: ScaleType): string {
  return scaleType.id;
}

export function parseScaleTypeFromUriComponent(uriComponent: string): ScaleType | undefined {
  return ScaleType.All.find(st => st.id === uriComponent);
}

export class Scale {
  public static forAll(callback: (scale: Scale, i: number) => void) {
    let i = 0;

    for (const scaleType of ScaleType.All) {
      for (const rootPitchClass of pitchClasses) {
        const scale = new Scale(scaleType, rootPitchClass);

        callback(scale, i); 
        i++;
      }
    }
  }

  public static parseId(id: string): Scale | undefined {
    const splitId = (id as string).split("-");
    if (splitId.length !== 2) { return undefined; }

    const scaleTypeId = splitId[1];
    const scaleType = ScaleType.All.find(st => st.id === scaleTypeId);
    if (!scaleType) { return undefined; }

    const scaleRootPitchString = splitId[0];
    const rootPitchClassName = parsePitchClassName(scaleRootPitchString);
    if (!rootPitchClassName) { return undefined; }

    return new Scale(scaleType, pitchClassNameToPitchClass(rootPitchClassName));
  }

  public constructor(
    public type: ScaleType,
    public rootPitchClass: PitchClass
  ) {}

  // TODO: fix
  public get id(): string {
    return `${this.rootPitchClass.toString()}-${this.type.id}`;
  }
  
  public equals(scale: Scale): boolean {
    return (
      (this.type === scale.type) &&
      (this.rootPitchClass === scale.rootPitchClass)
    );
  }

  public getPitchClassForDegree(scaleDegree: number): PitchClass {
    return this.type.getPitchClassForDegree(this.rootPitchClass, scaleDegree);
  }

  public getPitchClasses(): Array<PitchClass> {
    return this.type.formula.getPitchClasses(this.rootPitchClass);
  }

  public getDiatonicCanonicalChord(scaleDegree: number, numChordPitches: number): CanonicalChord {
    return {
      type: this.type.getDiatonicCanonicalChordType(scaleDegree, numChordPitches),
      rootPitchClass: this.type.formula.getPitchClassForDegree(this.rootPitchClass, scaleDegree)
    } as CanonicalChord;
  }
  
  public getDiatonicChord(scaleDegree: number, numChordPitches: number): Chord {
    const rootPitch = this.type.formula.getPitchClassForDegree(this.rootPitchClass, scaleDegree);
    const chordType = this.type.getDiatonicChordType(scaleDegree, numChordPitches);
    return new Chord(chordType, rootPitch);
  }

  public getDiatonicCanonicalChords(numChordPitches: number): Array<CanonicalChord> {
    precondition(numChordPitches >= 1);
    precondition(numChordPitches <= this.type.numPitches);

    const pitchClasses = this.getPitchClasses();

    return pitchClasses
      .map((pitchClass, i) => ({
        type: this.type.getDiatonicCanonicalChordType(
          /*scaleDegree*/ 1 + i,
          numChordPitches
        ),
        rootPitchClass: pitchClass
      } as CanonicalChord));
  }

  public getDiatonicChords(numChordPitches: number): Array<Chord> {
    precondition(numChordPitches >= 1);
    precondition(numChordPitches <= this.type.numPitches);

    const pitchClasses = this.getPitchClasses();

    return this.type.pitchIntegers
      .map((_, i) => new Chord(
        this.type.getDiatonicChordType(1 + i, numChordPitches),
        pitchClasses[i]
      ));
  }
}