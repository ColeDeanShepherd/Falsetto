import { flattenArrays, areArraysEqual } from "../Core/ArrayUtils";
import { precondition } from "../Core/Dbc";
import { mod } from "../Core/MathUtils";
import { areSetsEqual } from "../Core/SetUtils";
import { unwrapValueOrUndefined } from "../Core/Utils";
import { CanonicalChordType } from "./CanonicalChord";
import { ChordScaleFormula } from "./ChordScaleFormula";
import { ChordType } from "./ChordType";
import { Interval } from "./Interval";
import { PitchClass } from "./PitchClass";
import { getModePitchIntegers } from "./Scale";

export interface ScaleTypeGroup {
  name: string;
  scaleTypes: Array<ScaleType>;
}

// TODO: specify type properly
export const ScaleTypes = {
  Ionian: {
    id: "major",
    name: "Major (Ionian)",
    formula: ChordScaleFormula.parse("1 2 3 4 5 6 7"),
    pitchIntegers: [0, 2, 4, 5, 7, 9, 11]
  } as ScaleType,
  Dorian: {
    id: "dorian",
    name: "Dorian",
    formula: ChordScaleFormula.parse("1 2 b3 4 5 6 b7"),
    pitchIntegers: [0, 2, 3, 5, 7, 9, 10]
  } as ScaleType,
  Phrygian: {
    id: "phrygian",
    name: "Phrygian",
    formula: ChordScaleFormula.parse("1 b2 b3 4 5 b6 b7"),
    pitchIntegers: [0, 1, 3, 5, 7, 8, 10]
  } as ScaleType,
  Lydian: {
    id: "lydian",
    name: "Lydian",
    formula: ChordScaleFormula.parse("1 2 3 #4 5 6 7"),
    pitchIntegers: [0, 2, 4, 6, 7, 9, 11]
  } as ScaleType,
  Mixolydian: {
    id: "mixolydian",
    name: "Mixolydian",
    formula: ChordScaleFormula.parse("1 2 3 4 5 6 b7"),
    pitchIntegers: [0, 2, 4, 5, 7, 9, 10]
  } as ScaleType,
  Aeolian: {
    id: "minor",
    name: "Natural Minor (Aeolian)",
    formula: ChordScaleFormula.parse("1 2 b3 4 5 b6 b7"),
    pitchIntegers: [0, 2, 3, 5, 7, 8, 10]
  } as ScaleType,
  Locrian: {
    id: "locrian",
    name: "Locrian",
    formula: ChordScaleFormula.parse("1 b2 b3 4 b5 b6 b7"),
    pitchIntegers: [0, 1, 3, 5, 6, 8, 10]
  } as ScaleType,
  
  MelodicMinor: {
    id: "melodicMinor",
    name: "Melodic Minor",
    formula: ChordScaleFormula.parse("1 2 b3 4 5 6 7"),
    pitchIntegers: [0, 2, 3, 5, 7, 9, 11]
  } as ScaleType,
  Dorianb2: {
    id: "dorianb2",
    name: "Dorian b2",
    formula: ChordScaleFormula.parse("1 b2 b3 4 5 6 b7"),
    pitchIntegers: [0, 1, 3, 5, 7, 9, 10]
  } as ScaleType,
  LydianAug: {
    id: "lydianAug",
    name: "Lydian Aug.",
    formula: ChordScaleFormula.parse("1 2 3 #4 #5 6 7"),
    pitchIntegers: [0, 2, 4, 6, 8, 9, 11]
  } as ScaleType,
  MixolydianSharp11: {
    id: "mixolydian#11",
    name: "Mixolydian #11",
    formula: ChordScaleFormula.parse("1 2 3 #4 5 6 b7"),
    pitchIntegers: [0, 2, 4, 6, 7, 9, 10]
  } as ScaleType,
  Mixolydianb6: {
    id: "mixolydianb6",
    name: "Mixolydian b6",
    formula: ChordScaleFormula.parse("1 2 3 4 5 b6 b7"),
    pitchIntegers: [0, 2, 4, 5, 7, 8, 10]
  } as ScaleType,
  LocrianNat9: {
    id: "locrianNat9",
    name: "Locrian Nat. 9",
    formula: ChordScaleFormula.parse("1 2 b3 4 b5 b6 b7"),
    pitchIntegers: [0, 2, 3, 5, 6, 7, 10]
  } as ScaleType,
  AlteredDominant: {
    id: "alteredDominant",
    name: "Altered Dominant",
    formula: ChordScaleFormula.parse("1 b2 b3 b4 b5 b6 b7"),
    pitchIntegers: [0, 1, 3, 4, 6, 8, 10]
  } as ScaleType,
  
  HarmonicMinor: {
    id: "harmonicMinor",
    name: "Harmonic Minor",
    formula: ChordScaleFormula.parse("1 2 b3 4 5 b6 7"),
    pitchIntegers: [0, 2, 3, 5, 7, 8, 11]
  } as ScaleType,
  LocrianNat6: {
    id: "locrianNat6",
    name: "Locrian Nat. 6",
    formula: ChordScaleFormula.parse("1 b2 b3 4 b5 6 b7"),
    pitchIntegers: [0, 1, 3, 5, 6, 9, 10]
  } as ScaleType,
  IonianAug: {
    id: "ionianAug",
    name: "Ionian Aug.",
    formula: ChordScaleFormula.parse("1 2 3 4 #5 6 7"),
    pitchIntegers: [0, 2, 4, 5, 8, 9, 11]
  } as ScaleType,
  DorianSharp11: {
    id: "dorian#11",
    name: "Dorian #11",
    formula: ChordScaleFormula.parse("1 2 b3 #4 5 6 b7"),
    pitchIntegers: [0, 2, 4, 6, 7, 9, 10]
  } as ScaleType,
  PhrygianMajor: {
    id: "phrygianDominant",
    name: "Phrygian Dominant",
    formula: ChordScaleFormula.parse("1 b2 3 4 5 b6 b7"),
    pitchIntegers: [0, 1, 4, 5, 7, 8, 10]
  } as ScaleType,
  LydianSharp9: {
    id: "lydian#9",
    name: "Lydian #9",
    formula: ChordScaleFormula.parse("1 #2 3 #4 5 6 7"),
    pitchIntegers: [0, 3, 4, 6, 7, 9, 11]
  } as ScaleType,
  AlteredDominantbb7: { // TODO: figure out what's wrong here
    id: "alteredDominantbb7",
    name: "Altered Dominant bb7",
    formula: ChordScaleFormula.parse("1 b2 b3 b4 b5 b6 bb7"),
    pitchIntegers: [0, 1, 3, 4, 6, 9, 9]
  } as ScaleType,
  
  HarmonicMajor: {
    id: "harmonicMajor",
    name: "Harmonic Major",
    formula: ChordScaleFormula.parse("1 2 3 4 5 b6 7"),
    pitchIntegers: [0, 2, 4, 5, 7, 8, 11]
  } as ScaleType,
  Dorianb5: {
    id: "dorianb5",
    name: "Dorian b5",
    formula: ChordScaleFormula.parse("1 2 b3 4 b5 6 b7"),
    pitchIntegers: [0, 2, 3, 5, 6, 9, 10]
  } as ScaleType,
  Phrygianb4: {
    id: "phrygianb4",
    name: "Phrygian b4",
    formula: ChordScaleFormula.parse("1 b2 b3 b4 5 b6 b7"),
    pitchIntegers: [0, 1, 3, 4, 7, 9, 10]
  } as ScaleType,
  Lydianb3: {
    id: "lydianb3",
    name: "Lydian b3",
    formula: ChordScaleFormula.parse("1 2 b3 #4 5 6 7"),
    pitchIntegers: [0, 2, 4, 5, 7, 9, 11]
  } as ScaleType,
  Mixolydianb2: {
    id: "mixolydianb2",
    name: "Mixolydian b2",
    formula: ChordScaleFormula.parse("1 b2 3 4 5 6 b7"),
    pitchIntegers: [0, 1, 4, 5, 7, 9, 10]
  } as ScaleType,
  LydianAugmentedSharp2: {
    id: "lydianaug#2",
    name: "Lydian Augmented #2",
    formula: ChordScaleFormula.parse("1 #2 3 #4 #5 6 7"),
    pitchIntegers: [0, 3, 4, 6, 8, 9, 11]
  } as ScaleType,
  Locrianbb7: {
    id: "locrianbb7",
    name: "Locrian bb7",
    formula: ChordScaleFormula.parse("1 b2 b3 4 b5 b6 bb7"),
    pitchIntegers: [0, 1, 3, 5, 6, 8, 9]
  } as ScaleType,
  
  DoubleHarmonicMajor: {
    id: "doubleHarmonicMajor",
    name: "Double Harmonic Major",
    formula: ChordScaleFormula.parse("1 b2 3 4 5 b6 7"),
    pitchIntegers: [0, 1, 4, 5, 7, 8, 11]
  } as ScaleType,
  LydianSharp2Sharp6: {
    id: "lydian#2#6",
    name: "Lydian #2 #6",
    formula: ChordScaleFormula.parse("1 #2 3 #4 5 #6 7"),
    pitchIntegers: [0, 3, 4, 6, 7, 10, 11]
  } as ScaleType,
  Ultraphrygian: {
    id: "ultraphrygian",
    name: "Ultraphrygian",
    formula: ChordScaleFormula.parse("1 b2 b3 b4 5 b6 bb7"),
    pitchIntegers: [0, 1, 3, 4, 7, 8, 9]
  } as ScaleType,
  HungarianMinor: {
    id: "hungarianMinor",
    name: "Hungarian Minor",
    formula: ChordScaleFormula.parse("1 2 b3 #4 5 b6 7"),
    pitchIntegers: [0, 2, 4, 6, 7, 8, 11]
  } as ScaleType,
  Oriental: {
    id: "oriental",
    name: "Oriental",
    formula: ChordScaleFormula.parse("1 b2 3 4 b5 6 b7"),
    pitchIntegers: [0, 1, 4, 5, 6, 9, 10]
  } as ScaleType,
  IonianAugmentedSharp2: {
    id: "ionianAug#2",
    name: "Ionian Augmented #2",
    formula: ChordScaleFormula.parse("1 #2 3 4 #5 6 7"),
    pitchIntegers: [0, 3, 4, 5, 8, 9, 11]
  } as ScaleType,
  Locrianbb3bb7: {
    id: "locrianbb3bb7",
    name: "Locrian bb3 bb7",
    formula: ChordScaleFormula.parse("1 b2 bb3 4 b5 b6 bb7"),
    pitchIntegers: [0, 1, 2, 5, 6, 7, 9]
  } as ScaleType,
  
  TonicDiminished: {
    id: "tonicDiminished",
    name: "Tonic Diminished",
    formula: ChordScaleFormula.parse("1 2 b3 4 b5 b6 bb7 7"),
    pitchIntegers: [0, 2, 3, 5, 6, 8, 9, 11]
  } as ScaleType,
  DominantDiminished: {
    id: "dominantDiminished",
    name: "Dominant Diminished",
    formula: ChordScaleFormula.parse("1 b2 b3 b4 b5 5 6 b7"),
    pitchIntegers: [0, 1, 3, 4, 6, 7, 9, 10]
  } as ScaleType,
  WholeTone: {
    id: "wholeTone",
    name: "Whole Tone",
    formula: ChordScaleFormula.parse("1 2 3 #4 #5 b7"),
    pitchIntegers: [0, 2, 4, 6, 8, 10]
  } as ScaleType,
  Augmented: {
    id: "augmented",
    name: "Augmented",
    formula: ChordScaleFormula.parse("1 #2 3 5 #5 7"),
    pitchIntegers: [0, 3, 4, 7, 8, 11]
  } as ScaleType,
  
  MajorPentatonic: {
    id: "majorPentatonic",
    name: "Major Pentatonic",
    formula: ChordScaleFormula.parse("1 2 3 5 6"),
    pitchIntegers: [0, 2, 4, 7, 9]
  } as ScaleType,
  MajorPentatonicMode2: {
    id: "majorPentatonicMode2",
    name: "Major Pentatonic Mode 2",
    formula: ChordScaleFormula.parse("1 2 4 5 b7"),
    pitchIntegers: [0, 2, 5, 7, 10]
  } as ScaleType,
  MajorPentatonicMode3: {
    id: "majorPentatonicMode3",
    name: "Major Pentatonic Mode 3",
    formula: ChordScaleFormula.parse("1 b3 4 b6 b7"),
    pitchIntegers: [0, 3, 5, 8, 10]
  } as ScaleType,
  MajorPentatonicMode4: {
    id: "majorPentatonicMode4",
    name: "Major Pentatonic Mode 4",
    formula: ChordScaleFormula.parse("1 2 4 5 6"),
    pitchIntegers: [0, 2, 5, 7, 9]
  } as ScaleType,
  MinorPentatonic: {
    id: "minorPentatonic",
    name: "Minor Pentatonic",
    formula: ChordScaleFormula.parse("1 b3 4 5 b7"),
    pitchIntegers: [0, 3, 5, 7, 10]
  } as ScaleType,
  
  MajorBlues: {
    id: "majorBlues",
    name: "Major Blues",
    formula: ChordScaleFormula.parse("1 2 b3 3 5 6"),
    pitchIntegers: [0, 2, 3, 4, 7, 9]
  } as ScaleType,
  MinorBlues: {
    id: "minorBlues",
    name: "Minor Blues",
    formula: ChordScaleFormula.parse("1 b3 4 b5 5 b7"),
    pitchIntegers: [0, 3, 5, 6, 7, 10]
  } as ScaleType,
  Chromatic: {
    id: "chromatic",
    name: "Chromatic",
    formula: ChordScaleFormula.parse("1 b2 2 b3 3 4 b5 5 b6 6 b7 7"),
    pitchIntegers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  } as ScaleType,
};

export const MajorScaleModes: Array<ScaleType> = [
  ScaleTypes.Ionian,
  ScaleTypes.Dorian,
  ScaleTypes.Phrygian,
  ScaleTypes.Lydian,
  ScaleTypes.Mixolydian,
  ScaleTypes.Aeolian,
  ScaleTypes.Locrian
];
export const MajorPentatonicScaleModes: Array<ScaleType> = [
  ScaleTypes.MajorPentatonic,
  ScaleTypes.MajorPentatonicMode2,
  ScaleTypes.MajorPentatonicMode3,
  ScaleTypes.MajorPentatonicMode4,
  ScaleTypes.MinorPentatonic,
];
export const MelodicMinorScaleModes: Array<ScaleType> = [
  ScaleTypes.MelodicMinor,
  ScaleTypes.Dorianb2,
  ScaleTypes.LydianAug,
  ScaleTypes.MixolydianSharp11,
  ScaleTypes.Mixolydianb6,
  ScaleTypes.LocrianNat9,
  ScaleTypes.AlteredDominant
];
export const HarmonicMinorScaleModes: Array<ScaleType> = [
  ScaleTypes.HarmonicMinor,
  ScaleTypes.LocrianNat6,
  ScaleTypes.IonianAug,
  ScaleTypes.DorianSharp11,
  ScaleTypes.PhrygianMajor,
  ScaleTypes.LydianSharp9,
  ScaleTypes.AlteredDominantbb7
];
export const HarmonicMajorScaleModes: Array<ScaleType> = [
  ScaleTypes.HarmonicMajor,
  ScaleTypes.Dorianb5,
  ScaleTypes.Phrygianb4,
  ScaleTypes.Lydianb3,
  ScaleTypes.Mixolydianb2,
  ScaleTypes.LydianAugmentedSharp2,
  ScaleTypes.Locrianbb7
];
export const DoubleHarmonicMajorScaleModes: Array<ScaleType> = [
  ScaleTypes.DoubleHarmonicMajor,
  ScaleTypes.LydianSharp2Sharp6,
  ScaleTypes.Ultraphrygian,
  ScaleTypes.HungarianMinor,
  ScaleTypes.Oriental,
  ScaleTypes.IonianAugmentedSharp2,
  ScaleTypes.Locrianbb3bb7
];
export const DiminishedScales: Array<ScaleType> = [
  ScaleTypes.TonicDiminished,
  ScaleTypes.DominantDiminished
];
export const ScaleTypeGroups: Array<ScaleTypeGroup> = [
  { name: "Major Scale Modes", scaleTypes: MajorScaleModes },
  { name: "Melodic Minor Scale Modes", scaleTypes: MelodicMinorScaleModes },
  { name: "Harmonic Minor Scale Modes", scaleTypes: HarmonicMinorScaleModes },
  { name: "Harmonic Major Scale Modes", scaleTypes: HarmonicMajorScaleModes },
  { name: "Double Harmonic Major Scale Modes", scaleTypes: DoubleHarmonicMajorScaleModes },
  { name: "Diminished Scales", scaleTypes: DiminishedScales },
  { name: "Major Pentatonic Scale Modes", scaleTypes: MajorPentatonicScaleModes },
  { name: "Blues Scales", scaleTypes: [
      ScaleTypes.MajorBlues,
      ScaleTypes.MinorBlues
    ]
  },
  { name: "Other Scales", scaleTypes: [
      ScaleTypes.WholeTone,
      ScaleTypes.Augmented,
      ScaleTypes.Chromatic
    ]
  }
];
export const AllScaleTypes = flattenArrays<ScaleType>(
  ScaleTypeGroups.map(st => st.scaleTypes)
);

export interface ScaleType {
  id: string;
  name: string;
  formula: ChordScaleFormula;
  pitchIntegers: Array<number>;
}

export function getNumPitches(scaleType: ScaleType): number {
  return scaleType.pitchIntegers.length;
}

export function equals(scaleType: ScaleType, other: ScaleType): boolean {
  return areArraysEqual(scaleType.pitchIntegers, other.pitchIntegers);
}

export function getIntervals(scaleType: ScaleType): Array<Interval> {
  return scaleType.formula.parts.map(p => p.getIntervalFromRootNote());
}

export function getPitchClassForDegree(scaleType: ScaleType, rootPitchClass: PitchClass, scaleDegree: number): PitchClass {
  return scaleType.formula.getPitchClassForDegree(rootPitchClass, scaleDegree);
}

export function getPitchClasses(scaleType: ScaleType, rootPitchClass: PitchClass): Array<PitchClass> {
  return scaleType.formula.getPitchClasses(rootPitchClass);
}

export function getMode(scaleType: ScaleType, scaleDegree: number): ScaleType {
  precondition(scaleDegree >= 1);
  precondition(scaleDegree <= getNumPitches(scaleType));

  if (scaleDegree === 1) { return scaleType; }

  const modePitchIntegers = getModePitchIntegers(scaleType.pitchIntegers, scaleDegree);
  const mode = AllScaleTypes.find(scale => areArraysEqual(modePitchIntegers, scale.pitchIntegers));
  return unwrapValueOrUndefined(mode);
}

export function getDiatonicChordScaleDegreeNumbers(
  scaleType: ScaleType,
  scaleDegree: number,
  numChordPitches: number
): Array<number> {
  precondition(scaleDegree >= 1);
  precondition(scaleDegree <= getNumPitches(scaleType));
  precondition(numChordPitches >= 1);
  precondition(numChordPitches <= getNumPitches(scaleType));

  const i = scaleDegree - 1;
  const chordScaleDegreeNumbers = new Array<number>(numChordPitches);

  for (let chordI = 0; chordI < numChordPitches; chordI++) {
    const unwrappedScaleI = i + (2 * chordI);
    const baseScaleI = unwrappedScaleI % getNumPitches(scaleType);
    
    chordScaleDegreeNumbers[chordI] = 1 + baseScaleI;
  }

  return chordScaleDegreeNumbers;
}

export function getDiatonicChordPitchIntegers(
  scaleType: ScaleType,
  scaleDegree: number,
  numChordPitches: number
): Array<number> {
  precondition(scaleDegree >= 1);
  precondition(scaleDegree <= getNumPitches(scaleType));
  precondition(numChordPitches >= 1);
  precondition(numChordPitches <= getNumPitches(scaleType));

  const i = scaleDegree - 1;
  const halfStepsToSubtract = scaleType.pitchIntegers[i];
  const chordPitchIntegers = new Array<number>(numChordPitches);

  for (let chordI = 0; chordI < chordPitchIntegers.length; chordI++) {
    const unwrappedScaleI = i + (2 * chordI);
    const baseScaleI = unwrappedScaleI % getNumPitches(scaleType);
    
    chordPitchIntegers[chordI] = mod(scaleType.pitchIntegers[baseScaleI] - halfStepsToSubtract, 12);
  }

  return chordPitchIntegers;
}

export function getDiatonicCanonicalChordType(
  scaleType: ScaleType,
  scaleDegree: number,
  numChordPitches: number
): CanonicalChordType {
  return new Set<number>(getDiatonicChordPitchIntegers(scaleType, scaleDegree, numChordPitches));
}

export function getDiatonicChordType(
  scaleType: ScaleType,
  scaleDegree: number,
  numChordPitches: number
): ChordType {
  const chordPitchIntegers = new Set<number>(getDiatonicChordPitchIntegers(scaleType, scaleDegree, numChordPitches));
  const chordType = ChordType.All.find(chordType =>
    areSetsEqual(chordPitchIntegers, new Set<number>(chordType.pitchIntegers)));
  return unwrapValueOrUndefined(chordType);
}

export function getDiatonicChordTypes(scaleType: ScaleType, numChordPitches: number): Array<ChordType> {
  precondition(numChordPitches >= 1);
  precondition(numChordPitches <= getNumPitches(scaleType));

  return scaleType.pitchIntegers
    .map((_, i) => getDiatonicChordType(scaleType, 1 + i, numChordPitches));
}

export const scaleTypeLevels = [
  {
    name: "Major/Minor",
    scaleTypes: [
      ScaleTypes.Ionian,
      ScaleTypes.Aeolian
    ]
  },
  {
    name: "More Minor Scales",
    scaleTypes: [
      ScaleTypes.Ionian,
      ScaleTypes.Aeolian,
      ScaleTypes.MelodicMinor,
      ScaleTypes.HarmonicMinor
    ]
  },
  {
    name: "Modes of Major",
    scaleTypes: MajorScaleModes
      .concat([
        ScaleTypes.Aeolian,
        ScaleTypes.MelodicMinor,
        ScaleTypes.HarmonicMinor
      ])
  },
  {
    name: "Modes of Mel. Minor",
    scaleTypes: MajorScaleModes
      .concat([
        ScaleTypes.Aeolian,
        ScaleTypes.HarmonicMinor
      ])
      .concat(MelodicMinorScaleModes)
  },
  {
    name: "Diminished",
    scaleTypes: MajorScaleModes
      .concat([
        ScaleTypes.Aeolian,
        ScaleTypes.HarmonicMinor
      ])
      .concat(MelodicMinorScaleModes)
      .concat(DiminishedScales)
  },
  {
    name: "Whole Tone/Augmented",
    scaleTypes: MajorScaleModes
      .concat([
        ScaleTypes.Aeolian,
        ScaleTypes.HarmonicMinor
      ])
      .concat(MelodicMinorScaleModes)
      .concat(DiminishedScales)
      .concat([
        ScaleTypes.WholeTone,
        ScaleTypes.Augmented
      ])
  },
  {
    name: "All Scales",
    scaleTypes: AllScaleTypes
  }
];