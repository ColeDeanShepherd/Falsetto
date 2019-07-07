import * as Utils from "./Utils";
import { Pitch } from './Pitch';
import { Chord, ChordType, ChordScaleFormulaPart, ChordScaleFormula } from './Chord';
import { Interval } from './Interval';

// TODO: remove helpers?
export function getIntervalsFromFormula(formula: ChordScaleFormula): Array<Interval> {
  return formula.parts
    .map(p => new Interval(p.scaleDegreeNumber, p.signedAccidental));
}
export function getIntervalsFromFormulaString(formulaString: string): Array<Interval> {
  Utils.precondition(!Utils.isNullOrWhiteSpace(formulaString));

  return ChordScaleFormula.parse(formulaString).parts
    .map(p => p.getIntervalFromRootNote());
}

export function getModePitchIntegers(
  pitchIntegers: Array<number>, scaleDegree: number
): Array<number> {
  Utils.precondition(scaleDegree >= 1);

  const halfStepsToSubtract = pitchIntegers[scaleDegree - 1];
  const modePitchIntegers = new Array<number>(pitchIntegers.length);
  for (let modeI = 0; modeI < modePitchIntegers.length; modeI++) {
    const unwrappedBaseScaleI = (scaleDegree - 1) + modeI;
    const baseScaleI = unwrappedBaseScaleI % pitchIntegers.length;
    
    modePitchIntegers[modeI] = Utils.mod(pitchIntegers[baseScaleI] - halfStepsToSubtract, 12);
  }

  return modePitchIntegers;
}
export function getAllModePitchIntegers(pitchIntegers: Array<number>): Array<Array<number>> {
  return pitchIntegers
    .map((_, i) => getModePitchIntegers(pitchIntegers, 1 + i));
}

export class ScaleTypeGroup {
  public constructor(
    public name: string,
    public scaleTypes: Array<ScaleType>
  ) {}
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
  public static Dorianb2 = new ScaleType("Dorian b2", [0, 1, 3, 5, 7, 9, 10], "1 b2 b3 4 5 6 b7");
  public static LydianAug = new ScaleType("Lydian Aug.", [0, 2, 4, 6, 8, 9, 11], "1 2 3 #4 #5 6 7");
  public static MixolydianSharp11 = new ScaleType("Mixolydian #11", [0, 2, 4, 6, 7, 9, 10], "1 2 3 #4 5 6 b7");
  public static Mixolydianb6 = new ScaleType("Mixolydian b6", [0, 2, 4, 5, 7, 8, 10], "1 2 3 4 5 b6 b7");
  public static LocrianNat9 = new ScaleType("Locrian Nat. 9", [0, 2, 3, 5, 6, 8, 10], "1 2 b3 4 b5 b6 b7");
  public static AlteredDominant = new ScaleType("Altered Dominant", [0, 1, 3, 4, 6, 8, 10], "1 b2 b3 b4 b5 b6 b7");

  public static HarmonicMinor = new ScaleType("Harmonic Minor", [0, 2, 3, 5, 7, 8, 11], "1 2 b3 4 5 b6 7");
  public static LocrianNat6 = new ScaleType("Locrian Nat. 6", [0, 1, 3, 5, 6, 9, 10], "1 b2 b3 4 b5 6 b7");
  public static IonianAug = new ScaleType("Ionian Aug.", [0, 2, 4, 5, 8, 9, 11], "1 2 3 4 #5 6 7");
  public static DorianSharp11 = new ScaleType("Dorian #11", [0, 2, 3, 6, 7, 9, 10], "1 2 b3 #4 5 6 b7");
  public static PhrygianMajor = new ScaleType("Phrygian Dominant", [0, 1, 4, 5, 7, 8, 10], "1 b2 3 4 5 b6 b7");
  public static LydianSharp9 = new ScaleType("Lydian #9", [0, 3, 4, 6, 7, 9, 11], "1 #2 3 #4 5 6 7");
  public static AlteredDominantbb7 = new ScaleType("Altered Dominant bb7", [0, 1, 3, 4, 6, 8, 9], "1 b2 b3 b4 b5 b6 bb7");

  public static HarmonicMajor = new ScaleType("Harmonic Major", [0, 2, 4, 5, 7, 8, 11], "1 2 3 4 5 b6 7");
  public static Dorianb5 = new ScaleType("Dorian b5", [0, 2, 3, 5, 6, 9, 10], "1 2 b3 4 b5 6 b7");
  public static Phrygianb4 = new ScaleType("Phrygian b4", [0, 1, 3, 4, 7, 8, 10], "1 b2 b3 b4 5 b6 b7");
  public static Lydianb3 = new ScaleType("Lydian b3", [0, 2, 3, 6, 7, 9, 11], "1 2 b3 #4 5 6 7");
  public static Mixolydianb2 = new ScaleType("Mixolydian b2", [0, 1, 4, 5, 7, 9, 10], "1 b2 3 4 5 6 b7");
  public static LydianAugmentedSharp2 = new ScaleType("Lydian Augmented #2", [0, 3, 4, 6, 8, 9, 11], "1 #2 3 #4 #5 6 7");
  public static Locrianbb7 = new ScaleType("Locrian bb7", [0, 1, 3, 5, 6, 8, 9], "1 b2 b3 4 b5 b6 bb7");

  public static DoubleHarmonicMajor = new ScaleType("Double Harmonic Major", [0, 1, 4, 5, 7, 8, 11], "1 b2 3 4 5 b6 7");
  public static LydianSharp2Sharp6 = new ScaleType("Lydian #2 #6", [0, 3, 4, 6, 7, 10, 11], "1 #2 3 #4 5 #6 7");
  public static Ultraphrygian = new ScaleType("Ultraphrygian", [0, 1, 3, 4, 7, 8, 9], "1 b2 b3 b4 5 b6 bb7");
  public static HungarianMinor = new ScaleType("Hungarian Minor", [0, 2, 3, 6, 7, 8, 11], "1 2 b3 #4 5 b6 7");
  public static Oriental = new ScaleType("Oriental", [0, 1, 4, 5, 6, 9, 10], "1 b2 3 4 b5 6 b7");
  public static IonianAugmentedSharp2 = new ScaleType("Ionian Augmented #2", [0, 3, 4, 5, 8, 9, 11], "1 #2 3 4 #5 6 7");
  public static Locrianbb3bb7 = new ScaleType("Locrian bb3 bb7", [0, 1, 2, 5, 6, 8, 9], "1 b2 bb3 4 b5 b6 bb7");

  public static TonicDiminished = new ScaleType("Tonic Diminished", [0, 2, 3, 5, 6, 8, 9, 11], "1 2 b3 4 b5 b6 bb7 7");
  public static DominantDiminished = new ScaleType("Dominant Diminished", [0, 1, 3, 4, 6, 7, 9, 10], "1 b2 b3 b4 b5 5 6 b7");
  public static WholeTone = new ScaleType("Whole Tone", [0, 2, 4, 6, 8, 10], "1 2 3 #4 #5 b7");
  public static Augmented = new ScaleType("Augmented", [0, 3, 4, 7, 8, 11], "1 #2 3 5 #5 7");

  public static MajorPentatonic = new ScaleType("Major Pentatonic", [0, 2, 4, 7, 9], "1 2 3 5 6");
  public static MajorPentatonicMode2 = new ScaleType("Major Pentatonic Mode 2", [0, 2, 5, 7, 10], "1 2 4 5 b7");
  public static MajorPentatonicMode3 = new ScaleType("Major Pentatonic Mode 3", [0, 3, 5, 8, 10], "1 b3 4 b6 b7");
  public static MajorPentatonicMode4 = new ScaleType("Major Pentatonic Mode 4", [0, 2, 5, 7, 9], "1 2 4 5 6");
  public static MinorPentatonic = new ScaleType("Minor Pentatonic", [0, 3, 5, 7, 10], "1 b3 4 5 b7");

  public static MajorBlues = new ScaleType("Major Blues", [0, 2, 3, 4, 7, 9], "1 2 b3 3 5 6");
  public static MinorBlues = new ScaleType("Minor Blues", [0, 3, 5, 6, 7, 10], "1 b3 4 b5 5 b7");

  public static MajorScaleModes = [
    ScaleType.Ionian,
    ScaleType.Dorian,
    ScaleType.Phrygian,
    ScaleType.Lydian,
    ScaleType.Mixolydian,
    ScaleType.Aeolian,
    ScaleType.Locrian
  ];
  public static MajorPentatonicScaleModes = [
    ScaleType.MajorPentatonic,
    ScaleType.MajorPentatonicMode2,
    ScaleType.MajorPentatonicMode3,
    ScaleType.MajorPentatonicMode4,
    ScaleType.MinorPentatonic,
  ];
  public static MelodicMinorScaleModes = [
    ScaleType.MelodicMinor,
    ScaleType.Dorianb2,
    ScaleType.LydianAug,
    ScaleType.MixolydianSharp11,
    ScaleType.Mixolydianb6,
    ScaleType.LocrianNat9,
    ScaleType.AlteredDominant
  ];
  public static HarmonicMinorScaleModes = [
    ScaleType.HarmonicMinor,
    ScaleType.LocrianNat6,
    ScaleType.IonianAug,
    ScaleType.DorianSharp11,
    ScaleType.PhrygianMajor,
    ScaleType.LydianSharp9,
    ScaleType.AlteredDominantbb7
  ];
  public static HarmonicMajorScaleModes = [
    ScaleType.HarmonicMajor,
    ScaleType.Dorianb5,
    ScaleType.Phrygianb4,
    ScaleType.Lydianb3,
    ScaleType.Mixolydianb2,
    ScaleType.LydianAugmentedSharp2,
    ScaleType.Locrianbb7
  ];
  public static DoubleHarmonicMajorScaleModes = [
    ScaleType.DoubleHarmonicMajor,
    ScaleType.LydianSharp2Sharp6,
    ScaleType.Ultraphrygian,
    ScaleType.HungarianMinor,
    ScaleType.Oriental,
    ScaleType.IonianAugmentedSharp2,
    ScaleType.Locrianbb3bb7
  ];
  public static DiminishedScales = [
    ScaleType.TonicDiminished,
    ScaleType.DominantDiminished
  ];
  public static Groups = [
    new ScaleTypeGroup("Major Scale Modes", ScaleType.MajorScaleModes),
    new ScaleTypeGroup("Melodic Minor Scale Modes", ScaleType.MelodicMinorScaleModes),
    new ScaleTypeGroup("Harmonic Minor Scale Modes", ScaleType.HarmonicMinorScaleModes),
    new ScaleTypeGroup("Harmonic Major Scale Modes", ScaleType.HarmonicMajorScaleModes),
    new ScaleTypeGroup("Double Harmonic Major Scale Modes", ScaleType.DoubleHarmonicMajorScaleModes),
    new ScaleTypeGroup("Diminished Scales", ScaleType.DiminishedScales),
    new ScaleTypeGroup("Major Pentatonic Scale Modes", ScaleType.MajorPentatonicScaleModes),
    new ScaleTypeGroup("Blues Scales", [
        ScaleType.MajorBlues,
        ScaleType.MinorBlues
      ]
    ),
    new ScaleTypeGroup("Other Scales", [
        ScaleType.WholeTone,
        ScaleType.Augmented
      ]
    )
  ];
  public static All = Utils.flattenArrays<ScaleType>(
    ScaleType.Groups.map(st => st.scaleTypes)
  );

  public constructor(
    public name: string,
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
    return ChordScaleFormula.parse(this.formulaString).getPitches(rootPitch);
  }
  public getMode(scaleDegree: number): ScaleType {
    Utils.precondition(scaleDegree >= 1);
    Utils.precondition(scaleDegree <= this.numPitches);

    if (scaleDegree === 1) { return this; }

    const modePitchIntegers = getModePitchIntegers(this.pitchIntegers, scaleDegree);
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