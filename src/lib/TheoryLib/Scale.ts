import * as Utils from "../Core/Utils";
import { Pitch } from './Pitch';
import { Chord } from './Chord';
import { ChordType } from "./ChordType";
import { Interval } from './Interval';
import { ChordScaleFormula } from './ChordScaleFormula';
import { mod } from '../Core/MathUtils';
import { precondition } from '../Core/Dbc';
import { isNullOrWhiteSpace } from '../Core/StringUtils';
import { flattenArrays, areArraysEqual } from '../Core/ArrayUtils';
import { getValidKeyPitches } from "./Key";
import { areSetsEqual } from '../Core/SetUtils';
import { CanonicalChordType, CanonicalChord } from './CanonicalChord';

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

export class ScaleTypeGroup {
  public constructor(
    public name: string,
    public scaleTypes: Array<ScaleType>
  ) {}
}
export class ScaleType {
  public static Ionian = new ScaleType("major", "Major (Ionian)", ChordScaleFormula.parse("1 2 3 4 5 6 7"));
  public static Dorian = new ScaleType("dorian", "Dorian", ChordScaleFormula.parse("1 2 b3 4 5 6 b7"));
  public static Phrygian = new ScaleType("phrygian", "Phrygian", ChordScaleFormula.parse("1 b2 b3 4 5 b6 b7"));
  public static Lydian = new ScaleType("lydian", "Lydian", ChordScaleFormula.parse("1 2 3 #4 5 6 7"));
  public static Mixolydian = new ScaleType("mixolydian", "Mixolydian", ChordScaleFormula.parse("1 2 3 4 5 6 b7"));
  public static Aeolian = new ScaleType("minor", "Natural Minor (Aeolian)", ChordScaleFormula.parse("1 2 b3 4 5 b6 b7"));
  public static Locrian = new ScaleType("locrian", "Locrian", ChordScaleFormula.parse("1 b2 b3 4 b5 b6 b7"));
  
  public static Major = ScaleType.Ionian;
  public static NaturalMinor = ScaleType.Aeolian;

  public static MelodicMinor = new ScaleType("melodicMinor", "Melodic Minor", ChordScaleFormula.parse("1 2 b3 4 5 6 7"));
  public static Dorianb2 = new ScaleType("dorianb2", "Dorian b2", ChordScaleFormula.parse("1 b2 b3 4 5 6 b7"));
  public static LydianAug = new ScaleType("lydianAug", "Lydian Aug.", ChordScaleFormula.parse("1 2 3 #4 #5 6 7"));
  public static MixolydianSharp11 = new ScaleType("mixolydian#11", "Mixolydian #11", ChordScaleFormula.parse("1 2 3 #4 5 6 b7"));
  public static Mixolydianb6 = new ScaleType("mixolydianb6", "Mixolydian b6", ChordScaleFormula.parse("1 2 3 4 5 b6 b7"));
  public static LocrianNat9 = new ScaleType("locrianNat9", "Locrian Nat. 9", ChordScaleFormula.parse("1 2 b3 4 b5 b6 b7"));
  public static AlteredDominant = new ScaleType("alteredDominant", "Altered Dominant", ChordScaleFormula.parse("1 b2 b3 b4 b5 b6 b7"));

  public static HarmonicMinor = new ScaleType("harmonicMinor", "Harmonic Minor", ChordScaleFormula.parse("1 2 b3 4 5 b6 7"));
  public static LocrianNat6 = new ScaleType("locrianNat6", "Locrian Nat. 6", ChordScaleFormula.parse("1 b2 b3 4 b5 6 b7"));
  public static IonianAug = new ScaleType("ionianAug", "Ionian Aug.", ChordScaleFormula.parse("1 2 3 4 #5 6 7"));
  public static DorianSharp11 = new ScaleType("dorian#11", "Dorian #11", ChordScaleFormula.parse("1 2 b3 #4 5 6 b7"));
  public static PhrygianMajor = new ScaleType("phrygianDominant", "Phrygian Dominant", ChordScaleFormula.parse("1 b2 3 4 5 b6 b7"));
  public static LydianSharp9 = new ScaleType("lydian#9", "Lydian #9", ChordScaleFormula.parse("1 #2 3 #4 5 6 7"));
  public static AlteredDominantbb7 = new ScaleType("alteredDominantbb7", "Altered Dominant bb7", ChordScaleFormula.parse("1 b2 b3 b4 b5 b6 bb7"));

  public static HarmonicMajor = new ScaleType("harmonicMajor", "Harmonic Major", ChordScaleFormula.parse("1 2 3 4 5 b6 7"));
  public static Dorianb5 = new ScaleType("dorianb5", "Dorian b5", ChordScaleFormula.parse("1 2 b3 4 b5 6 b7"));
  public static Phrygianb4 = new ScaleType("phrygianb4", "Phrygian b4", ChordScaleFormula.parse("1 b2 b3 b4 5 b6 b7"));
  public static Lydianb3 = new ScaleType("lydianb3", "Lydian b3", ChordScaleFormula.parse("1 2 b3 #4 5 6 7"));
  public static Mixolydianb2 = new ScaleType("mixolydianb2", "Mixolydian b2", ChordScaleFormula.parse("1 b2 3 4 5 6 b7"));
  public static LydianAugmentedSharp2 = new ScaleType("lydianaug#2", "Lydian Augmented #2", ChordScaleFormula.parse("1 #2 3 #4 #5 6 7"));
  public static Locrianbb7 = new ScaleType("locrianbb7", "Locrian bb7", ChordScaleFormula.parse("1 b2 b3 4 b5 b6 bb7"));

  public static DoubleHarmonicMajor = new ScaleType("doubleHarmonicMajor", "Double Harmonic Major", ChordScaleFormula.parse("1 b2 3 4 5 b6 7"));
  public static LydianSharp2Sharp6 = new ScaleType("lydian#2#6", "Lydian #2 #6", ChordScaleFormula.parse("1 #2 3 #4 5 #6 7"));
  public static Ultraphrygian = new ScaleType("ultraphrygian", "Ultraphrygian", ChordScaleFormula.parse("1 b2 b3 b4 5 b6 bb7"));
  public static HungarianMinor = new ScaleType("hungarianMinor", "Hungarian Minor", ChordScaleFormula.parse("1 2 b3 #4 5 b6 7"));
  public static Oriental = new ScaleType("oriental", "Oriental", ChordScaleFormula.parse("1 b2 3 4 b5 6 b7"));
  public static IonianAugmentedSharp2 = new ScaleType("ionianAug#2", "Ionian Augmented #2", ChordScaleFormula.parse("1 #2 3 4 #5 6 7"));
  public static Locrianbb3bb7 = new ScaleType("locrianbb3bb7", "Locrian bb3 bb7", ChordScaleFormula.parse("1 b2 bb3 4 b5 b6 bb7"));

  public static TonicDiminished = new ScaleType("tonicDiminished", "Tonic Diminished", ChordScaleFormula.parse("1 2 b3 4 b5 b6 bb7 7"));
  public static DominantDiminished = new ScaleType("dominantDiminished", "Dominant Diminished", ChordScaleFormula.parse("1 b2 b3 b4 b5 5 6 b7"));
  public static WholeTone = new ScaleType("wholeTone", "Whole Tone", ChordScaleFormula.parse("1 2 3 #4 #5 b7"));
  public static Augmented = new ScaleType("augmented", "Augmented", ChordScaleFormula.parse("1 #2 3 5 #5 7"));

  public static MajorPentatonic = new ScaleType("majorPentatonic", "Major Pentatonic", ChordScaleFormula.parse("1 2 3 5 6"));
  public static MajorPentatonicMode2 = new ScaleType("majorPentatonicMode2", "Major Pentatonic Mode 2", ChordScaleFormula.parse("1 2 4 5 b7"));
  public static MajorPentatonicMode3 = new ScaleType("majorPentatonicMode3", "Major Pentatonic Mode 3", ChordScaleFormula.parse("1 b3 4 b6 b7"));
  public static MajorPentatonicMode4 = new ScaleType("majorPentatonicMode4", "Major Pentatonic Mode 4", ChordScaleFormula.parse("1 2 4 5 6"));
  public static MinorPentatonic = new ScaleType("minorPentatonic", "Minor Pentatonic", ChordScaleFormula.parse("1 b3 4 5 b7"));

  public static MajorBlues = new ScaleType("majorBlues", "Major Blues", ChordScaleFormula.parse("1 2 b3 3 5 6"));
  public static MinorBlues = new ScaleType("minorBlues", "Minor Blues", ChordScaleFormula.parse("1 b3 4 b5 5 b7"));
  public static Chromatic = new ScaleType("chromatic", "Chromatic", ChordScaleFormula.parse("1 b2 2 b3 3 4 b5 5 b6 6 b7 7"));

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
        ScaleType.Augmented,
        ScaleType.Chromatic
      ]
    )
  ];
  public static All = flattenArrays<ScaleType>(
    ScaleType.Groups.map(st => st.scaleTypes)
  );

  public pitchIntegers: Array<number>;

  public constructor(
    public id: string,
    public name: string,
    public formula: ChordScaleFormula
  ) {
    this.pitchIntegers = formula.pitchIntegers;
  }

  public get numPitches(): number {
    return this.pitchIntegers.length;
  }
  
  public equals(other: ScaleType): boolean {
    return areArraysEqual(this.pitchIntegers, other.pitchIntegers);
  }

  public getIntervals(): Array<Interval> {
    return this.formula.parts.map(p => p.getIntervalFromRootNote());
  }

  public getPitch(rootPitch: Pitch, scaleDegree: number): Pitch {
    return this.formula.getPitch(rootPitch, scaleDegree);
  }

  public getPitches(rootPitch: Pitch): Array<Pitch> {
    return this.formula.getPitches(rootPitch);
  }

  public getMode(scaleDegree: number): ScaleType {
    precondition(scaleDegree >= 1);
    precondition(scaleDegree <= this.numPitches);

    if (scaleDegree === 1) { return this; }

    const modePitchIntegers = getModePitchIntegers(this.pitchIntegers, scaleDegree);
    const mode = ScaleType.All.find(scale => areArraysEqual(modePitchIntegers, scale.pitchIntegers));
    return Utils.unwrapValueOrUndefined(mode);
  }

  public getDiatonicChordScaleDegreeNumbers(scaleDegree: number, numChordPitches: number): Array<number> {
    precondition(scaleDegree >= 1);
    precondition(scaleDegree <= this.numPitches);
    precondition(numChordPitches >= 1);
    precondition(numChordPitches <= this.numPitches);

    const i = scaleDegree - 1;
    const chordScaleDegreeNumbers = new Array<number>(numChordPitches);

    for (let chordI = 0; chordI < numChordPitches; chordI++) {
      const unwrappedScaleI = i + (2 * chordI);
      const baseScaleI = unwrappedScaleI % this.numPitches;
      
      chordScaleDegreeNumbers[chordI] = 1 + baseScaleI;
    }

    return chordScaleDegreeNumbers;
  }

  public getDiatonicChordPitchIntegers(scaleDegree: number, numChordPitches: number): Array<number> {
    precondition(scaleDegree >= 1);
    precondition(scaleDegree <= this.numPitches);
    precondition(numChordPitches >= 1);
    precondition(numChordPitches <= this.numPitches);

    const i = scaleDegree - 1;
    const halfStepsToSubtract = this.pitchIntegers[i];
    const chordPitchIntegers = new Array<number>(numChordPitches);

    for (let chordI = 0; chordI < chordPitchIntegers.length; chordI++) {
      const unwrappedScaleI = i + (2 * chordI);
      const baseScaleI = unwrappedScaleI % this.numPitches;
      
      chordPitchIntegers[chordI] = mod(this.pitchIntegers[baseScaleI] - halfStepsToSubtract, 12);
    }

    return chordPitchIntegers;
  }
  
  public getDiatonicCanonicalChordType(scaleDegree: number, numChordPitches: number): CanonicalChordType {
    return new Set<number>(this.getDiatonicChordPitchIntegers(scaleDegree, numChordPitches));
  }

  public getDiatonicChordType(scaleDegree: number, numChordPitches: number): ChordType {
    const chordPitchIntegers = new Set<number>(this.getDiatonicChordPitchIntegers(scaleDegree, numChordPitches));
    const chordType = ChordType.All.find(chordType =>
      areSetsEqual(chordPitchIntegers, new Set<number>(chordType.pitchIntegers)));
    return Utils.unwrapValueOrUndefined(chordType);
  }

  public getDiatonicChordTypes(numChordPitches: number): Array<ChordType> {
    precondition(numChordPitches >= 1);
    precondition(numChordPitches <= this.numPitches);

    return this.pitchIntegers
      .map((_, i) => this.getDiatonicChordType(1 + i, numChordPitches));
  }
}

export const scaleTypeLevels = [
  {
    name: "Major/Minor",
    scaleTypes: [
      ScaleType.Major,
      ScaleType.NaturalMinor
    ]
  },
  {
    name: "More Minor Scales",
    scaleTypes: [
      ScaleType.Major,
      ScaleType.NaturalMinor,
      ScaleType.MelodicMinor,
      ScaleType.HarmonicMinor
    ]
  },
  {
    name: "Modes of Major",
    scaleTypes: ScaleType.MajorScaleModes
      .concat([
        ScaleType.NaturalMinor,
        ScaleType.MelodicMinor,
        ScaleType.HarmonicMinor
      ])
  },
  {
    name: "Modes of Mel. Minor",
    scaleTypes: ScaleType.MajorScaleModes
      .concat([
        ScaleType.NaturalMinor,
        ScaleType.HarmonicMinor
      ])
      .concat(ScaleType.MelodicMinorScaleModes)
  },
  {
    name: "Diminished",
    scaleTypes: ScaleType.MajorScaleModes
      .concat([
        ScaleType.NaturalMinor,
        ScaleType.HarmonicMinor
      ])
      .concat(ScaleType.MelodicMinorScaleModes)
      .concat(ScaleType.DiminishedScales)
  },
  {
    name: "Whole Tone/Augmented",
    scaleTypes: ScaleType.MajorScaleModes
      .concat([
        ScaleType.NaturalMinor,
        ScaleType.HarmonicMinor
      ])
      .concat(ScaleType.MelodicMinorScaleModes)
      .concat(ScaleType.DiminishedScales)
      .concat([
        ScaleType.WholeTone,
        ScaleType.Augmented
      ])
  },
  {
    name: "All Scales",
    scaleTypes: ScaleType.All
  }
];

export class Scale {
  public static forAll(callback: (scale: Scale, i: number) => void) {
    const rootPitches = getValidKeyPitches(/*preferredOctaveNumber*/ 0);
    let i = 0;

    for (const scaleType of ScaleType.All) {
      for (const rootPitch of rootPitches) {
        const scale = new Scale(scaleType, rootPitch);

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
    const rootPitch = Pitch.parseNoOctave(scaleRootPitchString, 4);
    if (!rootPitch) { return undefined; }

    return new Scale(scaleType, rootPitch);
  }

  public constructor(
    public type: ScaleType,
    public rootPitch: Pitch
  ) {}

  public get id(): string {
    return `${this.rootPitch.toString(/*includeOctaveNumber*/ false)}-${this.type.id}`;
  }

  public getPitch(scaleDegree: number): Pitch {
    return this.type.getPitch(this.rootPitch, scaleDegree);
  }

  public getPitches(): Array<Pitch> {
    return this.type.formula.getPitches(this.rootPitch);
  }

  public getDiatonicCanonicalChord(scaleDegree: number, numChordPitches: number): CanonicalChord {
    return {
      type: this.type.getDiatonicCanonicalChordType(scaleDegree, numChordPitches),
      rootPitchClass: this.type.formula.getPitch(this.rootPitch, scaleDegree).class
    } as CanonicalChord;
  }
  
  public getDiatonicChord(scaleDegree: number, numChordPitches: number): Chord {
    const rootPitch = this.type.formula.getPitch(this.rootPitch, scaleDegree);
    const chordType = this.type.getDiatonicChordType(scaleDegree, numChordPitches);
    return new Chord(chordType, rootPitch);
  }

  public getDiatonicCanonicalChords(numChordPitches: number): Array<CanonicalChord> {
    precondition(numChordPitches >= 1);
    precondition(numChordPitches <= this.type.numPitches);

    const pitchClasses = this.getPitches()
      .map(p => p.class);

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

    const pitches = this.getPitches();

    return this.type.pitchIntegers
      .map((_, i) => new Chord(
        this.type.getDiatonicChordType(1 + i, numChordPitches),
        pitches[i]
      ));
  }
}