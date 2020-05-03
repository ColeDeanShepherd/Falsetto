import * as Utils from "../Core/Utils";
import { precondition } from '../Core/Dbc';
import { setDifference } from '../Core/SetUtils';
import { flattenArrays, areArraysEqual, arrayMax } from '../Core/ArrayUtils';

import { Pitch } from "./Pitch";
import { getIntervalsFromFormula } from './Scale';
import { Interval } from './Interval';
import { ChordScaleFormula } from './ChordScaleFormula';
import { ChordTypeGroup } from "./ChordTypeGroup";

export class ChordType {
  // Triads
  public static Major = new ChordType("Major", ChordScaleFormula.parse("1 3 5"), ["", "M", "maj", "Δ"]);
  public static Minor = new ChordType("Minor", ChordScaleFormula.parse("1 b3 5"), ["m", "min", "-"]);
  public static Augmented = new ChordType("Augmented", ChordScaleFormula.parse("1 3 #5"), ["+", "aug"]);
  public static Diminished = new ChordType("Diminished", ChordScaleFormula.parse("1 b3 b5"), ["°", "dim"]);

  public static Sus2 = new ChordType("sus2", ChordScaleFormula.parse("1 2 5"), ["sus2"]);
  public static Sus4 = new ChordType("sus4", ChordScaleFormula.parse("1 4 5"), ["sus4", "sus"]);

  public static BasicTriads = [
    ChordType.Major,
    ChordType.Minor,
    ChordType.Augmented,
    ChordType.Diminished
  ];
  public static Triads = new Array<ChordType>()
    .concat(ChordType.BasicTriads)  
    .concat([
      ChordType.Sus2,
      ChordType.Sus4
    ]);

  // Sixth Chords
  public static Maj6 = new ChordType("Major 6th", ChordScaleFormula.parse("1 3 5 6"), ["6"]);
  public static Min6 = new ChordType("Minor 6th", ChordScaleFormula.parse("1 b3 5 6"), ["m6"]);
  public static Maj69 = new ChordType("6/9", ChordScaleFormula.parse("1 9 3 5 6"), ["6/9"]);
  public static Min69 = new ChordType("Minor 6/9", ChordScaleFormula.parse("1 9 b3 5 6"), ["m6/9"]);

  public static SixthChords = [
    ChordType.Maj6,
    ChordType.Min6,
    ChordType.Maj69,
    ChordType.Min69
  ];
  
  // Seventh Chords
  public static Maj7 = new ChordType("Major 7th", ChordScaleFormula.parse("1 3 (5) 7"), ["M7"]);
  public static Dom7 = new ChordType("Dominant 7th", ChordScaleFormula.parse("1 3 (5) b7"), ["7"]);
  public static MinMaj7 = new ChordType("Minor-Major 7th", ChordScaleFormula.parse("1 b3 (5) 7"), ["mM7"]);
  public static Min7 = new ChordType("Minor 7th", ChordScaleFormula.parse("1 b3 (5) b7"), ["m7"]);
  public static DimMaj7 = new ChordType("Diminished Major 7th", ChordScaleFormula.parse("1 b3 b5 7"), ["dimMaj7"]);
  public static HalfDim7 = new ChordType("Half-Diminished 7th", ChordScaleFormula.parse("1 b3 b5 b7"), ["ø7"]);
  public static Dim7 = new ChordType("Diminished 7th", ChordScaleFormula.parse("1 b3 b5 bb7"), ["°7", "dim7"]);
  public static AugMaj7 = new ChordType("Augmented Major 7th", ChordScaleFormula.parse("1 3 #5 7"), ["+M7"]);
  public static Aug7 = new ChordType("Augmented 7th", ChordScaleFormula.parse("1 3 #5 b7"), ["+7"]);

  public static SimpleSeventhChords = [
    ChordType.Maj7,
    ChordType.Dom7,
    ChordType.MinMaj7,
    ChordType.Min7,
    ChordType.DimMaj7,
    ChordType.HalfDim7,
    ChordType.Dim7,
    ChordType.AugMaj7,
    ChordType.Aug7,
  ];
  
  // Ninth Chords
  public static Maj9 = new ChordType("Major 9th", ChordScaleFormula.parse("1 9 3 (5) 7"), ["M9"]);
  public static Dom9 = new ChordType("Dominant 9th", ChordScaleFormula.parse("1 9 3 (5) b7"), ["9"]);
  public static MinMaj9 = new ChordType("Minor-Major 9th", ChordScaleFormula.parse("1 9 b3 (5) 7"), ["mM9"]);
  public static Min9 = new ChordType("Minor 9th", ChordScaleFormula.parse("1 9 b3 (5) b7"), ["m9"]);
  public static DimMaj9 = new ChordType("Diminished Major 9th", ChordScaleFormula.parse("1 9 b3 b5 7"), ["dimMaj9"]);
  public static HalfDim9 = new ChordType("Half-Diminished 9th", ChordScaleFormula.parse("1 9 b3 b5 b7"), ["ø9"]);
  public static Dim9 = new ChordType("Diminished 9th", ChordScaleFormula.parse("1 9 b3 b5 bb7"), ["°9", "dim9"]);
  public static AugMaj9 = new ChordType("Augmented Major 9th", ChordScaleFormula.parse("1 9 3 #5 7"), ["+M9"]);
  public static Aug9 = new ChordType("Augmented 9th", ChordScaleFormula.parse("1 9 3 #5 b7"), ["+9"]);

  public static SimpleNinthChords = [
    ChordType.Maj9,
    ChordType.Dom9,
    ChordType.MinMaj9,
    ChordType.Min9,
    ChordType.DimMaj9,
    ChordType.HalfDim9,
    ChordType.Dim9,
    ChordType.AugMaj9,
    ChordType.Aug9
  ];
  
  // Eleventh Chords
  public static Maj11 = new ChordType("Major 11th", ChordScaleFormula.parse("1 (9) (3) 11 (5) 7"), ["M11"]);
  public static Dom11 = new ChordType("Dominant 11th", ChordScaleFormula.parse("1 (9) (3) 11 (5) b7"), ["11"]);
  public static MinMaj11 = new ChordType("Minor-Major 11th", ChordScaleFormula.parse("1 (9) b3 11 (5) 7"), ["mM11"]);
  public static Min11 = new ChordType("Minor 11th", ChordScaleFormula.parse("1 (9) b3 11 (5) b7"), ["m11"]);
  public static DimMaj11 = new ChordType("Diminished Major 11th", ChordScaleFormula.parse("1 (9) b3 11 b5 7"), ["dimMaj11"]);
  public static AugMaj11 = new ChordType("Augmented Major 11th", ChordScaleFormula.parse("1 (9) (3) 11 #5 7"), ["+M11"]);
  public static Aug11 = new ChordType("Augmented 11th", ChordScaleFormula.parse("1 (9) (3) 11 #5 b7"), ["+11"]);
  public static HalfDim11 = new ChordType("Half-Diminished 11th", ChordScaleFormula.parse("1 (9) b3 11 b5 b7"), ["ø11"]);
  public static Dim11 = new ChordType("Diminished 11th", ChordScaleFormula.parse("1 (9) b3 11 b5 bb7"), ["°11", "dim11"]);

  public static SimpleEleventhChords = [
    ChordType.Maj11,
    ChordType.Dom11,
    ChordType.MinMaj11,
    ChordType.Min11,
    ChordType.DimMaj11,
    ChordType.AugMaj11,
    ChordType.Aug11,
    ChordType.HalfDim11,
    ChordType.Dim11
  ];
  
  // Thirteenth Chords
  public static Maj13 = new ChordType("Major 13th", ChordScaleFormula.parse("1 (9) 3 (11) (5) 13 7"), ["M13"]);
  public static Dom13 = new ChordType("Dominant 13th", ChordScaleFormula.parse("1 (9) 3 (11) (5) 13 b7"), ["13"]);
  public static MinMaj13 = new ChordType("Minor-Major 13th", ChordScaleFormula.parse("1 (9) b3 (11) (5) 13 7"), ["mM13"]);
  public static Min13 = new ChordType("Minor 13th", ChordScaleFormula.parse("1 (9) b3 (11) (5) 13 b7"), ["m13"]);
  public static DimMaj13 = new ChordType("Diminished Major 13th", ChordScaleFormula.parse("1 (9) b3 (11) b5 13 7"), ["dimMaj13"]);
  public static AugMaj13 = new ChordType("Augmented Major 13th", ChordScaleFormula.parse("1 (9) 3 (11) #5 13 7"), ["+M13"]);
  public static Aug13 = new ChordType("Augmented 13th", ChordScaleFormula.parse("1 (9) 3 (11) #5 13 b7"), ["+13"]);
  public static HalfDim13 = new ChordType("Half-Diminished 13th", ChordScaleFormula.parse("1 (9) b3 (11) b5 13 b7"), ["ø13"]);

  public static SimpleThirteenthChords = [
    ChordType.Maj13,
    ChordType.Dom13,
    ChordType.MinMaj13,
    ChordType.Min13,
    ChordType.DimMaj13,
    ChordType.AugMaj13,
    ChordType.Aug13,
    ChordType.HalfDim13,
  ];

  // Other Chords
  public static Power = new ChordType("Power", ChordScaleFormula.parse("1 5"), [" power"]);
  public static QuartalTriad = new ChordType("Quartal Triad", ChordScaleFormula.parse("1 4 b7"), ["quartal triad"]);
  public static Quartal4Notes = new ChordType("Quartal", ChordScaleFormula.parse("1 b3 4 b7"), ["quartal"]);
    
  public static OtherChords = [
    ChordType.Power,
    ChordType.QuartalTriad
  ];

  // All Chords
  public static Groups = [
    new ChordTypeGroup("Triads", ChordType.Triads),
    new ChordTypeGroup("Sixth Chords", ChordType.SixthChords),
    new ChordTypeGroup("Seventh Chords", ChordType.SimpleSeventhChords),
    new ChordTypeGroup("Ninth Chords", ChordType.SimpleNinthChords),
    new ChordTypeGroup("Eleventh Chords", ChordType.SimpleEleventhChords),
    new ChordTypeGroup("Thirteenth Chords", ChordType.SimpleThirteenthChords),
    new ChordTypeGroup("Other Chords", ChordType.OtherChords)
  ];

  public static All = flattenArrays<ChordType>(
    ChordType.Groups.map(ct => ct.chordTypes)
  ).concat(ChordType.Quartal4Notes);
  
  public static AllByNumNotesDescending = ChordType.All
    .slice()
    .sort((a, b) => (a.pitchCount > b.pitchCount) ? -1 : 1);

  public pitchIntegers: Array<number>;

  public constructor(
    public name: string,
    public formula: ChordScaleFormula,
    public symbols: Array<string>
  ) {
    this.pitchIntegers = this.formula.parts.map(p => p.pitchInteger);
  }
  
  public get isMajorType(): boolean {
    return !this.isMinorType;
  }
  public get isMinorType(): boolean {
    return this.formula.parts.some(p => (p.chordNoteNumber === 3) && (p.signedAccidental === -1));
  }
  
  public get pitchCount(): number {
    return this.pitchIntegers.length;
  }

  public equals(other: ChordType): boolean {
    return areArraysEqual(this.pitchIntegers, other.pitchIntegers);
  }
  public getSubChordType(startPitchIndex: number, numPitches: number): ChordType {
    precondition(startPitchIndex >= 0);
    precondition(numPitches >= 1);
    precondition((startPitchIndex + numPitches) <= this.pitchIntegers.length);

    const newPitchIntegers = this.pitchIntegers.slice(startPitchIndex, startPitchIndex + numPitches);

    const subChordType = ChordType.All
      .find(chordType => areArraysEqual(chordType.pitchIntegers, newPitchIntegers));
    
    return Utils.unwrapValueOrUndefined(subChordType);
  }
  
  public getPitches(rootPitch: Pitch): Array<Pitch> {
    return this.formula.getPitches(rootPitch);
  }
  public getIntervals(): Array<Interval> {
    return getIntervalsFromFormula(this.formula);
  }

  public matchPitchIntegers(pitchIntegers: Set<number>): Array<string> | null {
    const requiredPitchIntegers = new Set<number>(this.formula.parts
      .filter(p => !p.isOptional)
      .map(p => p.pitchInteger));
    
    let remainingPitchIntegers = setDifference(pitchIntegers, requiredPitchIntegers);
    if (remainingPitchIntegers.size !== (pitchIntegers.size - requiredPitchIntegers.size)) { return null; }

    const optionalPitchIntegers = new Set<number>(this.formula.parts
      .filter(p => p.isOptional)
      .map(p => p.pitchInteger));
    remainingPitchIntegers = setDifference(remainingPitchIntegers, optionalPitchIntegers);

    const alterations = new Array<string>();
    const extension = arrayMax(this.formula.parts.map(p => p.chordNoteNumber));

    for (const pi of remainingPitchIntegers) {
      switch (pi) {
        case 1:
          if ((extension < 7) ) {
            alterations.push("addb9");
          } else {
            alterations.push("b9");
          }
          break;
        case 2:
          if (extension < 7) {
            alterations.push("add9");
          }
          break;
        case 3:
          if (extension < 7) {
            alterations.push("add#9");
          } else {
            alterations.push("#9");
          }
          break;
        case 5:
          if (extension < 7) {
            alterations.push("add11");
          }
          break;
        case 6:
          if (extension < 7) {
            alterations.push("add#11");
          } else {
            alterations.push("#11");
          }
          break;
        case 8:
          if (extension < 7) {
            alterations.push("addb13");
          } else {
            alterations.push("b13");
          }
          break;
        case 10:
          if (extension < 7) {
            alterations.push("add#13");
          } else {
            alterations.push("#13");
          }
          break;
        default:
          return null;
      }
    }

    return (alterations.length === remainingPitchIntegers.size)
      ? alterations
      : null;
  }
}

export const chordTypeLevels = [
  {
    name: "Basic Triads",
    chordTypes: ChordType.BasicTriads
  },
  {
    name: "All Triads",
    chordTypes: ChordType.Triads
  },
  {
    name: "Common 7th Chords",
    chordTypes: ChordType.Triads
      .concat([
        ChordType.Maj7,
        ChordType.Dom7,
        ChordType.Min7,
        ChordType.HalfDim7,
        ChordType.Dim7
      ])
  },
  {
    name: "More 7th Chords",
    chordTypes: ChordType.Triads
      .concat(ChordType.SimpleSeventhChords)
  },
  {
    name: "6th Chords",
    chordTypes: ChordType.Triads
      .concat(ChordType.SixthChords)
      .concat(ChordType.SimpleSeventhChords)
  },
  {
    name: "Extended Chords",
    chordTypes: ChordType.Triads
      .concat(ChordType.SixthChords)
      .concat(ChordType.SimpleSeventhChords)
      .concat(ChordType.SimpleNinthChords)
      .concat(ChordType.SimpleEleventhChords)
      .concat(ChordType.SimpleThirteenthChords)
  }
];