import { PitchLetter } from './PitchLetter';
import { Pitch, PitchClass, getClassRelativePitchInteger } from './Pitch';
import { precondition } from '../Core/Dbc';
import { Scale, ScaleType } from './Scale';
import { ChordScaleFormulaPart } from './ChordScaleFormula';
import { mod } from '../Core/MathUtils';

export function getValidKeyPitches(preferredOctaveNumber: number): Array<Pitch> {
  return [
    new Pitch(PitchLetter.C, 0, preferredOctaveNumber),
    new Pitch(PitchLetter.C, 1, preferredOctaveNumber),
    new Pitch(PitchLetter.D, -1, preferredOctaveNumber),
    new Pitch(PitchLetter.D, 0, preferredOctaveNumber),
    new Pitch(PitchLetter.E, -1, preferredOctaveNumber),
    new Pitch(PitchLetter.E, 0, preferredOctaveNumber),
    new Pitch(PitchLetter.F, 0, preferredOctaveNumber),
    new Pitch(PitchLetter.F, 1, preferredOctaveNumber),
    new Pitch(PitchLetter.G, -1, preferredOctaveNumber),
    new Pitch(PitchLetter.G, 0, preferredOctaveNumber),
    new Pitch(PitchLetter.A, -1, preferredOctaveNumber),
    new Pitch(PitchLetter.A, 0, preferredOctaveNumber),
    new Pitch(PitchLetter.B, -1, preferredOctaveNumber),
    new Pitch(PitchLetter.B, 0, preferredOctaveNumber),
    new Pitch(PitchLetter.C, -1, preferredOctaveNumber + 1)
  ];
}

const validKeyPitchesOctave0 = getValidKeyPitches(0);

export class Key {
  public static readonly CMajor = new Key(PitchLetter.C, 0, true);
  public static readonly CSharpMajor = new Key(PitchLetter.C, 1, true);
  public static readonly DFlatMajor = new Key(PitchLetter.D, -1, true);
  public static readonly DMajor = new Key(PitchLetter.D, 0, true);
  public static readonly EFlatMajor = new Key(PitchLetter.E, -1, true);
  public static readonly EMajor = new Key(PitchLetter.E, 0, true);
  public static readonly FMajor = new Key(PitchLetter.F, 0, true);
  public static readonly FSharpMajor = new Key(PitchLetter.F, 1, true);
  public static readonly GFlatMajor = new Key(PitchLetter.G, -1, true);
  public static readonly GMajor = new Key(PitchLetter.G, 0, true);
  public static readonly AFlatMajor = new Key(PitchLetter.A, -1, true);
  public static readonly AMajor = new Key(PitchLetter.A, 0, true);
  public static readonly BFlatMajor = new Key(PitchLetter.B, -1, true);
  public static readonly BMajor = new Key(PitchLetter.B, 0, true);
  public static readonly CFlatMajor = new Key(PitchLetter.C, -1, true);

  public static readonly MajorKeys = [
    Key.CMajor,
    Key.CSharpMajor,
    Key.DFlatMajor,
    Key.DMajor,
    Key.EFlatMajor,
    Key.EMajor,
    Key.FMajor,
    Key.FSharpMajor,
    Key.GFlatMajor,
    Key.GMajor,
    Key.AFlatMajor,
    Key.AMajor,
    Key.BFlatMajor,
    Key.BMajor,
    Key.CFlatMajor
  ];
  
  public static readonly CMinor = new Key(PitchLetter.C, 0, false);
  public static readonly CSharpMinor = new Key(PitchLetter.C, 1, false);
  public static readonly DFlatMinor = new Key(PitchLetter.D, -1, false);
  public static readonly DMinor = new Key(PitchLetter.D, 0, false);
  public static readonly EFlatMinor = new Key(PitchLetter.E, -1, false);
  public static readonly EMinor = new Key(PitchLetter.E, 0, false);
  public static readonly FMinor = new Key(PitchLetter.F, 0, false);
  public static readonly FSharpMinor = new Key(PitchLetter.F, 1, false);
  public static readonly GFlatMinor = new Key(PitchLetter.G, -1, false);
  public static readonly GMinor = new Key(PitchLetter.G, 0, false);
  public static readonly AFlatMinor = new Key(PitchLetter.A, -1, false);
  public static readonly AMinor = new Key(PitchLetter.A, 0, false);
  public static readonly BFlatMinor = new Key(PitchLetter.B, -1, false);
  public static readonly BMinor = new Key(PitchLetter.B, 0, false);
  public static readonly CFlatMinor = new Key(PitchLetter.C, -1, false);

  public static readonly MinorKeys = [
    Key.CMinor,
    Key.CSharpMinor,
    Key.DFlatMinor,
    Key.DMinor,
    Key.EFlatMinor,
    Key.EMinor,
    Key.FMinor,
    Key.FSharpMinor,
    Key.GFlatMinor,
    Key.GMinor,
    Key.AFlatMinor,
    Key.AMinor,
    Key.BFlatMinor,
    Key.BMinor,
    Key.CFlatMinor
  ];

  public static readonly All = Key.MajorKeys.concat(Key.MinorKeys);

  public constructor(
    public readonly pitchLetter: PitchLetter,
    public readonly signedAccidental: number,
    public readonly isMajor: boolean
  ) {
    precondition(validKeyPitchesOctave0
      .some(kp => (kp.letter === pitchLetter) && (kp.signedAccidental === signedAccidental))
    );
  }

  public getScaleType(): ScaleType {
    return this.isMajor ? ScaleType.Major : ScaleType.NaturalMinor;
  }

  public getScale(octaveNumber: number): Scale {
    const rootPitch = new Pitch(this.pitchLetter, this.signedAccidental, octaveNumber);
    return new Scale(this.getScaleType(), rootPitch);
  }

  public getPitchClasses(): Set<PitchClass> {
    const scale = this.getScale(/*octaveNumber*/ 4);
    const pitches = scale.getPitches();
    const pitchClasses = new Set<PitchClass>(pitches.map(p => p.class));
    return pitchClasses;
  }

  public getOrderedPitchClasses(): Array<PitchClass> {
    const scale = this.getScale(/*octaveNumber*/ 4);
    const pitches = scale.getPitches();
    const orderedPitchClasses = pitches.map(p => p.class);
    return orderedPitchClasses;
  }

  public getPitchClassScaleDegree(pitchClass: PitchClass): ChordScaleFormulaPart {
    const scale = this.getScale(/*octaveNumber*/ 4);
    const scalePitchIntegers = scale.type.pitchIntegers;
    const pitchInteger = getClassRelativePitchInteger(scale.rootPitch.class, pitchClass);

    function getNearestPitchInteger() {
      // TODO: improve
      for (let i = 0; i < scalePitchIntegers.length; i++) {
        if (scalePitchIntegers[i] >= pitchInteger) {
          return [scalePitchIntegers[i], 1 + i];
        }
      }

      return [scalePitchIntegers[scalePitchIntegers.length - 1], scalePitchIntegers.length];
    }

    const [nearestPitchInteger, nearestScaleDegree] = getNearestPitchInteger();
    const scaleDegree = new ChordScaleFormulaPart(nearestScaleDegree, (pitchInteger - nearestPitchInteger), /*isOptional*/ false);
    return scaleDegree;
  }

  public toString(): string {
    const rootPitch = new Pitch(this.pitchLetter, this.signedAccidental, /*octaveNumber*/ 4);
    const rootPitchStr = rootPitch.toString(/*includeOctaveNumber*/ false, /*useSymbols*/ true);
    const majorMinorStr = this.isMajor ? "Major" : "Minor";
    return `${rootPitchStr} ${majorMinorStr}`;
  }
}

export function doesKeyUseSharps(pitchLetter: PitchLetter, signedAccidental: number): boolean {
  precondition(Math.abs(signedAccidental) <= 1);

  if (signedAccidental === 1) {
    return true;
  } else if (signedAccidental === -1) {
    return false;
  }

  switch (pitchLetter) {
    case PitchLetter.C:
      return false;
    case PitchLetter.D:
      return true;
    case PitchLetter.E:
      return true;
    case PitchLetter.F:
      return false;
    case PitchLetter.G:
      return true;
    case PitchLetter.A:
      return true;
    case PitchLetter.B:
      return true;
  }
}

export function doesKeyUseFlats(pitchLetter: PitchLetter, signedAccidental: number) {
  return !doesKeyUseSharps(pitchLetter, signedAccidental);
}

export function forEachKey(
  callbackFn: (key: Key, i: number) => void
) {
  for (let i = 0; i < Key.All.length; i++) {
    callbackFn(Key.All[i], i);
  }
}