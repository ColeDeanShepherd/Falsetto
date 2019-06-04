import * as Utils from "./Utils";
import { Pitch } from './Pitch';
import { Chord, ChordType } from './Chord';
import { Interval } from './Interval';

export function getIntervalsFromFormulaString(formulaString: string): Array<Interval> {
  Utils.precondition(!Utils.isNullOrWhiteSpace(formulaString));

  return formulaString.split(" ")
    .map(scaleDegree => {
      const accidentalString = Utils.takeCharsWhile(scaleDegree, 0, c => (c === "#") || (c === "b"));

      let signedAccidental: number;
      if (accidentalString.length === 0) {
        signedAccidental = 0;
      } else if (scaleDegree[0] === "#") {
        signedAccidental = accidentalString.length;
      } else if (scaleDegree[0] === "b") {
        signedAccidental = -accidentalString.length;
      } else {
        throw new Error(`Invalid accidental character: ${scaleDegree[0]}`);
      }

      const degreeNumberString = scaleDegree.substring(accidentalString.length);
      const degreeNumber = parseInt(degreeNumberString, 10);
      return new Interval(degreeNumber, signedAccidental);
    });
}

export class Scale {
  public static Ionian = new Scale("Major (Ionian)", [0, 2, 4, 5, 7, 9, 11], "1 2 3 4 5 6 7");
  public static Dorian = new Scale("Dorian", [0, 2, 3, 5, 7, 9, 10], "1 2 b3 4 5 6 b7");
  public static Phrygian = new Scale("Phrygian", [0, 1, 3, 5, 7, 8, 10], "1 b2 b3 4 5 b6 b7");
  public static Lydian = new Scale("Lydian", [0, 2, 4, 6, 7, 9, 11], "1 2 3 #4 5 6 7");
  public static Mixolydian = new Scale("Mixolydian", [0, 2, 4, 5, 7, 9, 10], "1 2 3 4 5 6 b7");
  public static Aeolian = new Scale("Natural Minor (Aeolian)", [0, 2, 3, 5, 7, 8, 10], "1 2 b3 4 5 b6 b7");
  public static Locrian = new Scale("Locrian", [0, 1, 3, 5, 6, 8, 10], "1 b2 b3 4 b5 b6 b7");

  public static MelodicMinor = new Scale("Melodic Minor", [0, 2, 3, 5, 7, 9, 11], "1 2 b3 4 5 6 7");
  public static HarmonicMinor = new Scale("Harmonic Minor", [0, 2, 3, 5, 7, 8, 11], "1 2 b3 4 5 b6 7");

  public static TonicDiminished = new Scale("Tonic Diminished", [0, 2, 3, 5, 6, 8, 9, 11], "1 2 b3 4 b5 b6 bb7 7");
  public static DominantDiminished = new Scale("Dominant Diminished", [0, 1, 3, 4, 6, 7, 9, 10], "1 b2 b3 b4 b5 5 6 b7");
  public static WholeTone = new Scale("Whole Tone", [0, 2, 4, 6, 8, 10], "1 2 3 #4 #5 b7");
  public static Augmented = new Scale("Augmented", [0, 3, 4, 7, 8, 11], "1 #2 3 5 #5 7");

  public static MajorPentatonic = new Scale("Major Pentatonic", [0, 2, 4, 7, 9], "1 2 3 5 6");
  public static MinorPentatonic = new Scale("Minor Pentatonic", [0, 3, 5, 7, 10], "1 b3 4 5 b7");

  public static MajorBlues = new Scale("Major Blues", [0, 2, 3, 4, 7, 9], "1 2 b3 3 5 6");
  public static MinorBlues = new Scale("Minor Blues", [0, 3, 5, 6, 7, 10], "1 b3 4 b5 5 b7");

  public static Dorianb2 = new Scale("Dorian b2", [0, 1, 3, 5, 7, 9, 10], "1 b2 b3 4 5 6 b7");
  public static LydianAug = new Scale("Lydian Aug.", [0, 2, 4, 6, 8, 9, 11], "1 2 3 #4 #5 6 7");
  public static MixolydianSharp11 = new Scale("Mixolydian #11", [0, 2, 4, 6, 7, 9, 10], "1 2 3 #4 5 6 b7");
  public static Mixolydianb6 = new Scale("Mixolydian b6", [0, 2, 4, 5, 7, 8, 10], "1 2 3 4 5 b6 b7");
  public static LocrianNat9 = new Scale("Locrian Nat. 9", [0, 2, 3, 5, 6, 8, 10], "1 2 b3 4 b5 b6 b7");
  public static AlteredDominant = new Scale("Altered Dominant", [0, 1, 3, 4, 6, 8, 10], "1 b2 b3 b4 b5 b6 b7");
  public static LocrianNat6 = new Scale("Locrian Nat. 6", [0, 1, 3, 5, 6, 9, 10], "1 b2 b3 4 b5 6 b7");
  public static IonianAug = new Scale("Ionian Aug.", [0, 2, 4, 5, 8, 9, 11], "1 2 3 4 #5 6 7");
  public static DorianSharp11 = new Scale("Dorian #11", [0, 2, 3, 6, 7, 9, 10], "1 2 b3 #4 5 6 b7");
  public static PhrygianMajor = new Scale("Phrygian Major", [0, 1, 4, 5, 7, 8, 10], "1 b2 3 4 5 b6 b7");
  public static LydianSharp9 = new Scale("Lydian #9", [0, 3, 4, 6, 7, 9, 11], "1 #2 3 #4 5 6 7");
  public static AlteredDominantbb7 = new Scale("Altered Dominant bb7", [0, 1, 3, 4, 6, 8, 9], "1 b2 b3 b4 b5 b6 bb7");

  public static MajorScaleModes = [
    Scale.Ionian,
    Scale.Dorian,
    Scale.Phrygian,
    Scale.Lydian,
    Scale.Mixolydian,
    Scale.Aeolian,
    Scale.Locrian
  ];
  public static All = [
    Scale.Ionian,
    Scale.Dorian,
    Scale.Phrygian,
    Scale.Lydian,
    Scale.Mixolydian,
    Scale.Aeolian,
    Scale.Locrian,

    Scale.MelodicMinor,
    Scale.HarmonicMinor,

    Scale.TonicDiminished,
    Scale.DominantDiminished,

    Scale.WholeTone,
    Scale.Augmented,

    Scale.MajorPentatonic,
    Scale.MinorPentatonic,

    Scale.MajorBlues,
    Scale.MinorBlues,
    
    Scale.Dorianb2,
    Scale.LydianAug,
    Scale.MixolydianSharp11,
    Scale.Mixolydianb6,
    Scale.LocrianNat9,
    Scale.AlteredDominant,
    Scale.LocrianNat6,
    Scale.IonianAug,
    Scale.DorianSharp11,
    Scale.PhrygianMajor,
    Scale.LydianSharp9,
    Scale.AlteredDominantbb7,
  ];

  public constructor(
    public type: string,
    public pitchIntegers: Array<number>,
    public formulaString: string) {}

  public get length(): number {
    return this.pitchIntegers.length;
  }
  
  public equals(other: Scale): boolean {
    return Utils.areArraysEqual(this.pitchIntegers, other.pitchIntegers);
  }
  public getIntervals(): Array<Interval> {
    return getIntervalsFromFormulaString(this.formulaString);
  }
  public getPitches(rootPitch: Pitch): Array<Pitch> {
    return Chord.fromPitchAndFormulaString(rootPitch, this.formulaString).pitches;
  }
  public getMode(scaleDegree: number): Scale {
    Utils.precondition(scaleDegree >= 1);
    Utils.precondition(scaleDegree <= this.length);

    if (scaleDegree === 1) { return this; }

    const halfStepsToSubtract = this.pitchIntegers[scaleDegree - 1];
    const modePitchIntegers = new Array<number>(this.length);
    for (let modeI = 0; modeI < modePitchIntegers.length; modeI++) {
      const unwrappedBaseScaleI = (scaleDegree - 1) + modeI;
      const baseScaleI = unwrappedBaseScaleI % this.length;
      
      modePitchIntegers[modeI] = Utils.mod(this.pitchIntegers[baseScaleI] - halfStepsToSubtract, 12);
    }

    const mode = Scale.All.find(scale => Utils.areArraysEqual(modePitchIntegers, scale.pitchIntegers));
    return Utils.unwrapValueOrUndefined(mode);
  }
  public getDiatonicChordType(scaleDegree: number, numChordPitches: number): ChordType {
    Utils.precondition(scaleDegree >= 1);
    Utils.precondition(scaleDegree <= this.length);
    Utils.precondition(numChordPitches >= 1);
    Utils.precondition(numChordPitches <= this.length);

    const halfStepsToSubtract = this.pitchIntegers[scaleDegree - 1];
    const chordPitchIntegers = new Array<number>(numChordPitches);
    for (let chordI = 0; chordI < chordPitchIntegers.length; chordI++) {
      const unwrappedScaleI = (scaleDegree - 1) + (2 * chordI);
      const baseScaleI = unwrappedScaleI % this.length;
      
      chordPitchIntegers[chordI] = Utils.mod(this.pitchIntegers[baseScaleI] - halfStepsToSubtract, 12);
    }

    const chordType = ChordType.All.find(chordType => Utils.areArraysEqual(chordPitchIntegers, chordType.pitchIntegers));
    return Utils.unwrapValueOrUndefined(chordType);
  }
  public getDiatonicChordTypes(numChordPitches: number): Array<ChordType> {
    Utils.precondition(numChordPitches >= 1);
    Utils.precondition(numChordPitches <= this.length);

    return this.pitchIntegers
      .map((_, i) => this.getDiatonicChordType(1 + i, numChordPitches));
  }
}

export const scales: Array<Scale> = [
  Scale.Ionian,
  Scale.Dorian,
  Scale.Phrygian,
  Scale.Lydian,
  Scale.Mixolydian,
  Scale.Aeolian,
  Scale.Locrian,
  Scale.MelodicMinor,
  Scale.HarmonicMinor,
  Scale.TonicDiminished,
  Scale.DominantDiminished,
  Scale.WholeTone,
  Scale.Augmented,
  Scale.MajorPentatonic,
  Scale.MinorPentatonic,
  Scale.MajorBlues,
  Scale.MinorBlues,
  Scale.Dorianb2,
  Scale.LydianAug,
  Scale.MixolydianSharp11,
  Scale.Mixolydianb6,
  Scale.LocrianNat9,
  Scale.AlteredDominant,
  Scale.LocrianNat6,
  Scale.IonianAug,
  Scale.DorianSharp11,
  Scale.PhrygianMajor,
  Scale.LydianSharp9,
  Scale.AlteredDominantbb7
];