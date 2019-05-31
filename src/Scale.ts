import * as Utils from "./Utils";
import { Pitch } from './Pitch';
import { Chord } from './Chord';
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
  public static Ionian = new Scale("Ionian (Major)", "1 2 3 4 5 6 7");
  public static Dorian = new Scale("Dorian", "1 2 b3 4 5 6 b7");
  public static Phrygian = new Scale("Phrygian", "1 b2 b3 4 5 b6 b7");
  public static Lydian = new Scale("Lydian", "1 2 3 #4 5 6 7");
  public static Mixolydian = new Scale("Mixolydian", "1 2 3 4 5 6 b7");
  public static Aeolian = new Scale("Aeolian (Natural Minor)", "1 2 b3 4 5 b6 b7");
  public static Locrian = new Scale("Locrian", "1 b2 b3 4 b5 b6 b7");
  public static MelodicMinor = new Scale("Melodic Minor", "1 2 b3 4 5 6 7");
  public static HarmonicMinor = new Scale("Harmonic Minor", "1 2 b3 4 5 b6 7");
  public static TonicDiminished = new Scale("Tonic Diminished", "1 2 b3 4 b5 b6 bb7 7");
  public static DominantDiminished = new Scale("Dominant Diminished", "1 b2 b3 b4 b5 5 6 b7");
  public static WholeTone = new Scale("Whole Tone", "1 2 3 #4 #5 b7");
  public static Augmented = new Scale("Augmented", "1 #2 3 5 #5 7");
  public static MajorPentatonic = new Scale("Major Pentatonic", "1 2 3 5 6");
  public static MinorPentatonic = new Scale("Minor Pentatonic", "1 b3 4 5 b7");
  public static MajorBlues = new Scale("Major Blues", "1 2 b3 3 5 6");
  public static MinorBlues = new Scale("Minor Blues", "1 b3 4 b5 5 b7");
  public static Dorianb2 = new Scale("Dorian b2", "1 b2 b3 4 5 6 b7");
  public static LydianAug = new Scale("Lydian Aug.", "1 2 3 #4 #5 6 7");
  public static MixolydianSharp11 = new Scale("Mixolydian #11", "1 2 3 #4 5 6 b7");
  public static Mixolydianb6 = new Scale("Mixolydian b6", "1 2 3 4 5 b6 b7");
  public static LocrianNat9 = new Scale("Locrian Nat. 9", "1 2 b3 4 b5 b6 b7");
  public static AlteredDominant = new Scale("Altered Dominant", "1 b2 b3 b4 b5 b6 b7");
  public static LocrianNat6 = new Scale("Locrian Nat. 6", "1 b2 b3 4 b5 6 b7");
  public static IonianAug = new Scale("Ionian Aug.", "1 2 3 4 #5 6 7");
  public static DorianSharp11 = new Scale("Dorian #11", "1 2 b3 #4 5 6 b7");
  public static PhrygianMajor = new Scale("Phrygian Major", "1 b2 3 4 5 b6 b7");
  public static LydianSharp9 = new Scale("Lydian #9", "1 #2 3 #4 5 6 7");
  public static AlteredDominantbb7 = new Scale("Altered Dominant bb7", "1 b2 b3 b4 b5 b6 bb7");

  public constructor(public type: string, public formulaString: string) {}

  public getIntervals(): Array<Interval> {
    return getIntervalsFromFormulaString(this.formulaString);
  }
  public getPitches(rootPitch: Pitch): Array<Pitch> {
    return Chord.fromPitchAndFormulaString(rootPitch, this.formulaString).pitches;
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