import * as Utils from "./Utils";
import { Pitch } from './Pitch';
import { ChordType } from './Chord';
import { Interval } from './Interval';
import { ChordScaleFormula } from './ChordScaleFormula';

// TODO: remove helpers?
export function getIntervalsFromFormula(formula: ChordScaleFormula): Array<Interval> {
  return formula.parts
    .map(p => new Interval(p.chordNoteNumber, p.signedAccidental));
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

export function getSimpleScaleDegree(scaleDegree: number): number {
  return 1 + Utils.mod((scaleDegree - 1), 7);
}

export class ScaleTypeGroup {
  public constructor(
    public name: string,
    public scaleTypes: Array<ScaleType>
  ) {}
}
export class ScaleType {
  public static Ionian = new ScaleType("Major (Ionian)", ChordScaleFormula.parse("1 2 3 4 5 6 7"));
  public static Dorian = new ScaleType("Dorian", ChordScaleFormula.parse("1 2 b3 4 5 6 b7"));
  public static Phrygian = new ScaleType("Phrygian", ChordScaleFormula.parse("1 b2 b3 4 5 b6 b7"));
  public static Lydian = new ScaleType("Lydian", ChordScaleFormula.parse("1 2 3 #4 5 6 7"));
  public static Mixolydian = new ScaleType("Mixolydian", ChordScaleFormula.parse("1 2 3 4 5 6 b7"));
  public static Aeolian = new ScaleType("Natural Minor (Aeolian)", ChordScaleFormula.parse("1 2 b3 4 5 b6 b7"));
  public static Locrian = new ScaleType("Locrian", ChordScaleFormula.parse("1 b2 b3 4 b5 b6 b7"));
  
  public static Major = ScaleType.Ionian;
  public static NaturalMinor = ScaleType.Aeolian;

  public static MelodicMinor = new ScaleType("Melodic Minor", ChordScaleFormula.parse("1 2 b3 4 5 6 7"));
  public static Dorianb2 = new ScaleType("Dorian b2", ChordScaleFormula.parse("1 b2 b3 4 5 6 b7"));
  public static LydianAug = new ScaleType("Lydian Aug.", ChordScaleFormula.parse("1 2 3 #4 #5 6 7"));
  public static MixolydianSharp11 = new ScaleType("Mixolydian #11", ChordScaleFormula.parse("1 2 3 #4 5 6 b7"));
  public static Mixolydianb6 = new ScaleType("Mixolydian b6", ChordScaleFormula.parse("1 2 3 4 5 b6 b7"));
  public static LocrianNat9 = new ScaleType("Locrian Nat. 9", ChordScaleFormula.parse("1 2 b3 4 b5 b6 b7"));
  public static AlteredDominant = new ScaleType("Altered Dominant", ChordScaleFormula.parse("1 b2 b3 b4 b5 b6 b7"));

  public static HarmonicMinor = new ScaleType("Harmonic Minor", ChordScaleFormula.parse("1 2 b3 4 5 b6 7"));
  public static LocrianNat6 = new ScaleType("Locrian Nat. 6", ChordScaleFormula.parse("1 b2 b3 4 b5 6 b7"));
  public static IonianAug = new ScaleType("Ionian Aug.", ChordScaleFormula.parse("1 2 3 4 #5 6 7"));
  public static DorianSharp11 = new ScaleType("Dorian #11", ChordScaleFormula.parse("1 2 b3 #4 5 6 b7"));
  public static PhrygianMajor = new ScaleType("Phrygian Dominant", ChordScaleFormula.parse("1 b2 3 4 5 b6 b7"));
  public static LydianSharp9 = new ScaleType("Lydian #9", ChordScaleFormula.parse("1 #2 3 #4 5 6 7"));
  public static AlteredDominantbb7 = new ScaleType("Altered Dominant bb7", ChordScaleFormula.parse("1 b2 b3 b4 b5 b6 bb7"));

  public static HarmonicMajor = new ScaleType("Harmonic Major", ChordScaleFormula.parse("1 2 3 4 5 b6 7"));
  public static Dorianb5 = new ScaleType("Dorian b5", ChordScaleFormula.parse("1 2 b3 4 b5 6 b7"));
  public static Phrygianb4 = new ScaleType("Phrygian b4", ChordScaleFormula.parse("1 b2 b3 b4 5 b6 b7"));
  public static Lydianb3 = new ScaleType("Lydian b3", ChordScaleFormula.parse("1 2 b3 #4 5 6 7"));
  public static Mixolydianb2 = new ScaleType("Mixolydian b2", ChordScaleFormula.parse("1 b2 3 4 5 6 b7"));
  public static LydianAugmentedSharp2 = new ScaleType("Lydian Augmented #2", ChordScaleFormula.parse("1 #2 3 #4 #5 6 7"));
  public static Locrianbb7 = new ScaleType("Locrian bb7", ChordScaleFormula.parse("1 b2 b3 4 b5 b6 bb7"));

  public static DoubleHarmonicMajor = new ScaleType("Double Harmonic Major", ChordScaleFormula.parse("1 b2 3 4 5 b6 7"));
  public static LydianSharp2Sharp6 = new ScaleType("Lydian #2 #6", ChordScaleFormula.parse("1 #2 3 #4 5 #6 7"));
  public static Ultraphrygian = new ScaleType("Ultraphrygian", ChordScaleFormula.parse("1 b2 b3 b4 5 b6 bb7"));
  public static HungarianMinor = new ScaleType("Hungarian Minor", ChordScaleFormula.parse("1 2 b3 #4 5 b6 7"));
  public static Oriental = new ScaleType("Oriental", ChordScaleFormula.parse("1 b2 3 4 b5 6 b7"));
  public static IonianAugmentedSharp2 = new ScaleType("Ionian Augmented #2", ChordScaleFormula.parse("1 #2 3 4 #5 6 7"));
  public static Locrianbb3bb7 = new ScaleType("Locrian bb3 bb7", ChordScaleFormula.parse("1 b2 bb3 4 b5 b6 bb7"));

  public static TonicDiminished = new ScaleType("Tonic Diminished", ChordScaleFormula.parse("1 2 b3 4 b5 b6 bb7 7"));
  public static DominantDiminished = new ScaleType("Dominant Diminished", ChordScaleFormula.parse("1 b2 b3 b4 b5 5 6 b7"));
  public static WholeTone = new ScaleType("Whole Tone", ChordScaleFormula.parse("1 2 3 #4 #5 b7"));
  public static Augmented = new ScaleType("Augmented", ChordScaleFormula.parse("1 #2 3 5 #5 7"));

  public static MajorPentatonic = new ScaleType("Major Pentatonic", ChordScaleFormula.parse("1 2 3 5 6"));
  public static MajorPentatonicMode2 = new ScaleType("Major Pentatonic Mode 2", ChordScaleFormula.parse("1 2 4 5 b7"));
  public static MajorPentatonicMode3 = new ScaleType("Major Pentatonic Mode 3", ChordScaleFormula.parse("1 b3 4 b6 b7"));
  public static MajorPentatonicMode4 = new ScaleType("Major Pentatonic Mode 4", ChordScaleFormula.parse("1 2 4 5 6"));
  public static MinorPentatonic = new ScaleType("Minor Pentatonic", ChordScaleFormula.parse("1 b3 4 5 b7"));

  public static MajorBlues = new ScaleType("Major Blues", ChordScaleFormula.parse("1 2 b3 3 5 6"));
  public static MinorBlues = new ScaleType("Minor Blues", ChordScaleFormula.parse("1 b3 4 b5 5 b7"));

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

  public pitchIntegers: Array<number>;

  public constructor(
    public name: string,
    public formula: ChordScaleFormula
  ) {
    this.pitchIntegers = formula.pitchIntegers;
  }

  public get numPitches(): number {
    return this.pitchIntegers.length;
  }
  
  public equals(other: ScaleType): boolean {
    return Utils.areArraysEqual(this.pitchIntegers, other.pitchIntegers);
  }
  public getIntervals(): Array<Interval> {
    return this.formula.parts.map(p => p.getIntervalFromRootNote());
  }
  public getPitches(rootPitch: Pitch): Array<Pitch> {
    return this.formula.getPitches(rootPitch);
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

export class Scale {
  public constructor(
    public type: ScaleType,
    public rootPitch: Pitch
  ) {}

  public getPitches(): Array<Pitch> {
    return this.type.formula.getPitches(this.rootPitch);
  }
}