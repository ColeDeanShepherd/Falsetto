import * as Utils from "./Utils";
import { Pitch } from "./Pitch";
import { VerticalDirection } from "./VerticalDirection";
import { getIntervalsFromFormulaString } from './Scale';

export class ChordType {
  public static Power = new ChordType("Power", [0, 7], "1 5", ["power"]);
  public static Major = new ChordType("Major", [0, 4, 7], "1 3 5", ["M"]);
  public static Minor = new ChordType("Minor", [0, 3, 7], "1 b3 5", ["m"]);
  public static Augmented = new ChordType("Augmented", [0, 4, 8], "1 3 #5", ["+"]);
  public static Diminished = new ChordType("Diminished", [0, 3, 6], "1 b3 b5", ["°"]);
  
  public static Sus2 = new ChordType("Sus2", [0, 2, 7], "1 2 5", ["sus2"]);
  public static Sus4 = new ChordType("Sus4", [0, 5, 7], "1 4 5", ["sus4"]);
  
  public static Maj6 = new ChordType("Major 6th", [0, 4, 7, 9], "1 3 5 6", ["6"]);
  public static Min6 = new ChordType("Minor 6th", [0, 3, 7, 9], "1 b3 5 6", ["m6"]);

  public static Maj7 = new ChordType("Major 7th", [0, 4, 7, 11], "1 3 5 7", ["M7"]);
  public static Dom7 = new ChordType("Dominant 7th", [0, 4, 7, 10], "1 3 5 b7", ["7"]);
  public static MinMaj7 = new ChordType("Minor-Major 7th", [0, 3, 7, 11], "1 b3 5 7", ["mM7"]);
  public static Min7 = new ChordType("Minor 7th", [0, 3, 7, 10], "1 b3 5 b7", ["m7"]);
  public static HalfDim7 = new ChordType("Half-Diminished 7th", [0, 3, 6, 10], "1 b3 b5 b7", ["ø7"]);
  public static Dim7 = new ChordType("Diminished 7th", [0, 3, 6, 9], "1 b3 b5 bb7", ["°7"]);
  public static AugMaj7 = new ChordType("Augmented Major 7th", [0, 4, 8, 11], "1 3 #5 7", ["+M7"]);
  public static Aug7 = new ChordType("Augmented 7th", [0, 4, 8, 10], "1 3 #5 b7", ["+7"]);
  
  public static Quartal = new ChordType("Quartal", [0, 5, 10], "1 4 b7", ["quartal"]);

  public static All = [
    ChordType.Power,

    ChordType.Major,
    ChordType.Minor,
    ChordType.Augmented,
    ChordType.Diminished,
    
    ChordType.Sus2,
    ChordType.Sus4,
    
    ChordType.Maj6,
    ChordType.Min6,
    
    ChordType.Maj7,
    ChordType.Dom7,
    ChordType.MinMaj7,
    ChordType.Min7,
    ChordType.HalfDim7,
    ChordType.Dim7,
    ChordType.AugMaj7,
    ChordType.Aug7,
    
    ChordType.Quartal,
  ];
  public static BasicTriads = [
    ChordType.Major,
    ChordType.Minor,
    ChordType.Augmented,
    ChordType.Diminished
  ];
  public static SeventhChords = [
    ChordType.Maj7,
    ChordType.Dom7,
    ChordType.MinMaj7,
    ChordType.Min7,
    ChordType.HalfDim7,
    ChordType.Dim7,
    ChordType.AugMaj7,
    ChordType.Aug7
  ];
  public constructor(
    public name: string,
    public pitchIntegers: Array<number>,
    public formulaString: string,
    public symbols: Array<string>) {}
  
  public get isMajorType(): boolean {
    return !this.isMinorType;
  }
  public get isMinorType(): boolean {
    return Utils.stringContains(this.formulaString, "b3");
  }

  public equals(other: ChordType): boolean {
    return Utils.areArraysEqual(this.pitchIntegers, other.pitchIntegers);
  }
  public getSubChordType(startPitchIndex: number, numPitches: number): ChordType {
    Utils.precondition(startPitchIndex >= 0);
    Utils.precondition(numPitches >= 1);
    Utils.precondition((startPitchIndex + numPitches) <= this.pitchIntegers.length);

    const newPitchIntegers = this.pitchIntegers.slice(startPitchIndex, startPitchIndex + numPitches);

    const subChordType = ChordType.All
      .find(chordType => Utils.areArraysEqual(chordType.pitchIntegers, newPitchIntegers));
    
    return Utils.unwrapValueOrUndefined(subChordType);
  }
}

export class Chord {
  public static fromPitchAndFormulaString(pitch: Pitch, formulaString: string): Chord {
    Utils.precondition(!Utils.isNullOrWhiteSpace(formulaString));

    const intervals = getIntervalsFromFormulaString(formulaString);

    const pitches = intervals
      .map(interval => Pitch.addInterval(pitch, VerticalDirection.Up, interval));
    return new Chord(pitches);
  }
  public constructor(public pitches: Array<Pitch>) {
    Utils.invariant(this.pitches.length > 1);
  }

  public equals(other: Chord): boolean {
    return Utils.areArraysEqualComparer(this.pitches, other.pitches, (a, b) => a.equals(b));
  }
  public toPitchString(): string {
    return this.pitches
      .map(p => p.toString(false))
      .join(" ");
  }
}