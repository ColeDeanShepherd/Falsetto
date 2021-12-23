import { precondition } from '../Core/Dbc';
import { PitchLetter } from './PitchLetter';
import { Pitch, PitchClassName } from './Pitch';

export const commonKeyPitchClassNames: Array<PitchClassName> = [
  { letter: PitchLetter.C, signedAccidental: 0 },
  { letter: PitchLetter.C, signedAccidental: 1 },
  { letter: PitchLetter.D, signedAccidental: 0 },
  { letter: PitchLetter.E, signedAccidental: -1 },
  { letter: PitchLetter.E, signedAccidental: 0 },
  { letter: PitchLetter.F, signedAccidental: 0 },
  { letter: PitchLetter.F, signedAccidental: 1 },
  { letter: PitchLetter.G, signedAccidental: 0 },
  { letter: PitchLetter.A, signedAccidental: -1 },
  { letter: PitchLetter.A, signedAccidental: 0 },
  { letter: PitchLetter.B, signedAccidental: -1 },
  { letter: PitchLetter.B, signedAccidental: 0 }
];

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

export const validKeyPitchesOctave0 = getValidKeyPitches(0);

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
    public pitchLetter: PitchLetter,
    public signedAccidental: number,
    public isMajor: boolean
  ) {
    precondition(validKeyPitchesOctave0
      .some(kp => (kp.letter === pitchLetter) && (kp.signedAccidental === signedAccidental))
    );
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