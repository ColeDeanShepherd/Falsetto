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

export class ScaleType {
  public static Ionian = new ScaleType("Major (Ionian)", [0, 2, 4, 5, 7, 9, 11], "1 2 3 4 5 6 7");
  public static Dorian = new ScaleType("Dorian", [0, 2, 3, 5, 7, 9, 10], "1 2 b3 4 5 6 b7");
  public static Phrygian = new ScaleType("Phrygian", [0, 1, 3, 5, 7, 8, 10], "1 b2 b3 4 5 b6 b7");
  public static Lydian = new ScaleType("Lydian", [0, 2, 4, 6, 7, 9, 11], "1 2 3 #4 5 6 7");
  public static Mixolydian = new ScaleType("Mixolydian", [0, 2, 4, 5, 7, 9, 10], "1 2 3 4 5 6 b7");
  public static Aeolian = new ScaleType("Natural Minor (Aeolian)", [0, 2, 3, 5, 7, 8, 10], "1 2 b3 4 5 b6 b7");
  public static Locrian = new ScaleType("Locrian", [0, 1, 3, 5, 6, 8, 10], "1 b2 b3 4 b5 b6 b7");
  
  public static Major = ScaleType.Ionian;
  public static NaturalMinor = ScaleType.Aeolian;

  public static MelodicMinor = new ScaleType("Melodic Minor", [0, 2, 3, 5, 7, 9, 11], "1 2 b3 4 5 6 7");
  public static HarmonicMinor = new ScaleType("Harmonic Minor", [0, 2, 3, 5, 7, 8, 11], "1 2 b3 4 5 b6 7");

  public static TonicDiminished = new ScaleType("Tonic Diminished", [0, 2, 3, 5, 6, 8, 9, 11], "1 2 b3 4 b5 b6 bb7 7");
  public static DominantDiminished = new ScaleType("Dominant Diminished", [0, 1, 3, 4, 6, 7, 9, 10], "1 b2 b3 b4 b5 5 6 b7");
  public static WholeTone = new ScaleType("Whole Tone", [0, 2, 4, 6, 8, 10], "1 2 3 #4 #5 b7");
  public static Augmented = new ScaleType("Augmented", [0, 3, 4, 7, 8, 11], "1 #2 3 5 #5 7");

  public static MajorPentatonic = new ScaleType("Major Pentatonic", [0, 2, 4, 7, 9], "1 2 3 5 6");
  public static MinorPentatonic = new ScaleType("Minor Pentatonic", [0, 3, 5, 7, 10], "1 b3 4 5 b7");

  public static MajorBlues = new ScaleType("Major Blues", [0, 2, 3, 4, 7, 9], "1 2 b3 3 5 6");
  public static MinorBlues = new ScaleType("Minor Blues", [0, 3, 5, 6, 7, 10], "1 b3 4 b5 5 b7");

  public static Dorianb2 = new ScaleType("Dorian b2", [0, 1, 3, 5, 7, 9, 10], "1 b2 b3 4 5 6 b7");
  public static LydianAug = new ScaleType("Lydian Aug.", [0, 2, 4, 6, 8, 9, 11], "1 2 3 #4 #5 6 7");
  public static MixolydianSharp11 = new ScaleType("Mixolydian #11", [0, 2, 4, 6, 7, 9, 10], "1 2 3 #4 5 6 b7");
  public static Mixolydianb6 = new ScaleType("Mixolydian b6", [0, 2, 4, 5, 7, 8, 10], "1 2 3 4 5 b6 b7");
  public static LocrianNat9 = new ScaleType("Locrian Nat. 9", [0, 2, 3, 5, 6, 8, 10], "1 2 b3 4 b5 b6 b7");
  public static AlteredDominant = new ScaleType("Altered Dominant", [0, 1, 3, 4, 6, 8, 10], "1 b2 b3 b4 b5 b6 b7");
  public static LocrianNat6 = new ScaleType("Locrian Nat. 6", [0, 1, 3, 5, 6, 9, 10], "1 b2 b3 4 b5 6 b7");
  public static IonianAug = new ScaleType("Ionian Aug.", [0, 2, 4, 5, 8, 9, 11], "1 2 3 4 #5 6 7");
  public static DorianSharp11 = new ScaleType("Dorian #11", [0, 2, 3, 6, 7, 9, 10], "1 2 b3 #4 5 6 b7");
  public static PhrygianMajor = new ScaleType("Phrygian Major", [0, 1, 4, 5, 7, 8, 10], "1 b2 3 4 5 b6 b7");
  public static LydianSharp9 = new ScaleType("Lydian #9", [0, 3, 4, 6, 7, 9, 11], "1 #2 3 #4 5 6 7");
  public static AlteredDominantbb7 = new ScaleType("Altered Dominant bb7", [0, 1, 3, 4, 6, 8, 9], "1 b2 b3 b4 b5 b6 bb7");

  public static MajorScaleModes = [
    ScaleType.Ionian,
    ScaleType.Dorian,
    ScaleType.Phrygian,
    ScaleType.Lydian,
    ScaleType.Mixolydian,
    ScaleType.Aeolian,
    ScaleType.Locrian
  ];
  public static All = [
    ScaleType.Ionian,
    ScaleType.Dorian,
    ScaleType.Phrygian,
    ScaleType.Lydian,
    ScaleType.Mixolydian,
    ScaleType.Aeolian,
    ScaleType.Locrian,

    ScaleType.MelodicMinor,
    ScaleType.HarmonicMinor,

    ScaleType.TonicDiminished,
    ScaleType.DominantDiminished,

    ScaleType.WholeTone,
    ScaleType.Augmented,

    ScaleType.MajorPentatonic,
    ScaleType.MinorPentatonic,

    ScaleType.MajorBlues,
    ScaleType.MinorBlues,
    
    ScaleType.Dorianb2,
    ScaleType.LydianAug,
    ScaleType.MixolydianSharp11,
    ScaleType.Mixolydianb6,
    ScaleType.LocrianNat9,
    ScaleType.AlteredDominant,
    ScaleType.LocrianNat6,
    ScaleType.IonianAug,
    ScaleType.DorianSharp11,
    ScaleType.PhrygianMajor,
    ScaleType.LydianSharp9,
    ScaleType.AlteredDominantbb7,
  ];

  public constructor(
    public type: string,
    public pitchIntegers: Array<number>,
    public formulaString: string) {}

  public get numPitches(): number {
    return this.pitchIntegers.length;
  }
  
  public equals(other: ScaleType): boolean {
    return Utils.areArraysEqual(this.pitchIntegers, other.pitchIntegers);
  }
  public getIntervals(): Array<Interval> {
    return getIntervalsFromFormulaString(this.formulaString);
  }
  public getPitches(rootPitch: Pitch): Array<Pitch> {
    return Chord.fromPitchAndFormulaString(rootPitch, this.formulaString).pitches;
  }
  public getMode(scaleDegree: number): ScaleType {
    Utils.precondition(scaleDegree >= 1);
    Utils.precondition(scaleDegree <= this.numPitches);

    if (scaleDegree === 1) { return this; }

    const halfStepsToSubtract = this.pitchIntegers[scaleDegree - 1];
    const modePitchIntegers = new Array<number>(this.numPitches);
    for (let modeI = 0; modeI < modePitchIntegers.length; modeI++) {
      const unwrappedBaseScaleI = (scaleDegree - 1) + modeI;
      const baseScaleI = unwrappedBaseScaleI % this.numPitches;
      
      modePitchIntegers[modeI] = Utils.mod(this.pitchIntegers[baseScaleI] - halfStepsToSubtract, 12);
    }

    const mode = ScaleType.All.find(scale => Utils.areArraysEqual(modePitchIntegers, scale.pitchIntegers));
    return Utils.unwrapValueOrUndefined(mode);
  }
  public getDiatonicChordType(scaleDegree: number, numChordPitches: number): ChordType {
    Utils.precondition(scaleDegree >= 1);
    Utils.precondition(scaleDegree <= this.numPitches);
    Utils.precondition(numChordPitches >= 1);
    Utils.precondition(numChordPitches <= this.numPitches);

    const halfStepsToSubtract = this.pitchIntegers[scaleDegree - 1];
    const chordPitchIntegers = new Array<number>(numChordPitches);
    for (let chordI = 0; chordI < chordPitchIntegers.length; chordI++) {
      const unwrappedScaleI = (scaleDegree - 1) + (2 * chordI);
      const baseScaleI = unwrappedScaleI % this.numPitches;
      
      chordPitchIntegers[chordI] = Utils.mod(this.pitchIntegers[baseScaleI] - halfStepsToSubtract, 12);
    }

    const chordType = ChordType.All.find(chordType => Utils.areArraysEqual(chordPitchIntegers, chordType.pitchIntegers));
    return Utils.unwrapValueOrUndefined(chordType);
  }
  public getDiatonicChordTypes(numChordPitches: number): Array<ChordType> {
    Utils.precondition(numChordPitches >= 1);
    Utils.precondition(numChordPitches <= this.numPitches);

    return this.pitchIntegers
      .map((_, i) => this.getDiatonicChordType(1 + i, numChordPitches));
  }
}

export const scaleTypes: Array<ScaleType> = [
  ScaleType.Ionian,
  ScaleType.Dorian,
  ScaleType.Phrygian,
  ScaleType.Lydian,
  ScaleType.Mixolydian,
  ScaleType.Aeolian,
  ScaleType.Locrian,
  ScaleType.MelodicMinor,
  ScaleType.HarmonicMinor,
  ScaleType.TonicDiminished,
  ScaleType.DominantDiminished,
  ScaleType.WholeTone,
  ScaleType.Augmented,
  ScaleType.MajorPentatonic,
  ScaleType.MinorPentatonic,
  ScaleType.MajorBlues,
  ScaleType.MinorBlues,
  ScaleType.Dorianb2,
  ScaleType.LydianAug,
  ScaleType.MixolydianSharp11,
  ScaleType.Mixolydianb6,
  ScaleType.LocrianNat9,
  ScaleType.AlteredDominant,
  ScaleType.LocrianNat6,
  ScaleType.IonianAug,
  ScaleType.DorianSharp11,
  ScaleType.PhrygianMajor,
  ScaleType.LydianSharp9,
  ScaleType.AlteredDominantbb7
];