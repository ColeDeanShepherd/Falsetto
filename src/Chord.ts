import * as Utils from "./Utils";
import { Pitch } from "./Pitch";
import { VerticalDirection } from "./VerticalDirection";
import { getIntervalsFromFormulaString } from './Scale';
import { Interval } from './Interval';

export class ChordScaleFormula {
  public static parse(formulaString: string): ChordScaleFormula {
    Utils.precondition(!Utils.isNullOrWhiteSpace(formulaString));

    return new ChordScaleFormula(
      formulaString.split(" ").map(ChordScaleFormulaPart.parse)
    );
  }

  public constructor(public parts: Array<ChordScaleFormulaPart>) {}

  public get pitchIntegers(): Array<number> {
    return this.parts.map(p => p.pitchInteger);
  }
}
export class ChordScaleFormulaPart {
  public static parse(formulaPartString: string): ChordScaleFormulaPart {
    const accidentalString = Utils.takeCharsWhile(formulaPartString, 0, c => (c === "#") || (c === "b"));

    let signedAccidental: number;
    if (accidentalString.length === 0) {
      signedAccidental = 0;
    } else if (accidentalString[0] === "#") {
      signedAccidental = accidentalString.length;
    } else if (accidentalString[0] === "b") {
      signedAccidental = -accidentalString.length;
    } else {
      throw new Error(`Invalid accidental character: ${accidentalString[0]}`);
    }

    const scaleDegreeNumberString = formulaPartString.substring(accidentalString.length);
    const scaleDegreeNumber = parseInt(scaleDegreeNumberString, 10);

    return new ChordScaleFormulaPart(scaleDegreeNumber, signedAccidental);
  }

  public constructor(
    public scaleDegreeNumber: number,
    public signedAccidental: number
  ) {
    Utils.invariant(scaleDegreeNumber >= 1);
  }

  public get pitchInteger(): number {
    return Interval.getSimpleIntervalTypeHalfSteps(Interval.getSimpleIntervalType(this.scaleDegreeNumber)) + this.signedAccidental;
  }
}
export class ChordTypeGroup {
  public constructor(
    public name: string,
    public chordTypes: Array<ChordType>
  ) {}
}
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
  public static ItalianAug6 = new ChordType("Italian Augmented 6th", [0, 4, 10], "1 3 #6", ["Italian aug6"]);
  public static FrenchAug6 = new ChordType("French Augmented 6th", [0, 4, 6, 10], "1 3 #4 #6", ["French aug6", "7b5"]);
  public static GermanAug6 = new ChordType("German Augmented 6th", [0, 4, 7, 10], "1 3 5 #6", ["German aug6"]);

  public static Maj7 = new ChordType("Major 7th", [0, 4, 7, 11], "1 3 5 7", ["M7"]);
  public static Dom7 = new ChordType("Dominant 7th", [0, 4, 7, 10], "1 3 5 b7", ["7", "German 6th"]);
  public static MinMaj7 = new ChordType("Minor-Major 7th", [0, 3, 7, 11], "1 b3 5 7", ["mM7"]);
  public static Min7 = new ChordType("Minor 7th", [0, 3, 7, 10], "1 b3 5 b7", ["m7"]);
  public static HalfDim7 = new ChordType("Half-Diminished 7th", [0, 3, 6, 10], "1 b3 b5 b7", ["ø7"]);
  public static Dim7 = new ChordType("Diminished 7th", [0, 3, 6, 9], "1 b3 b5 bb7", ["°7"]);
  public static AugMaj7 = new ChordType("Augmented Major 7th", [0, 4, 8, 11], "1 3 #5 7", ["+M7"]);
  public static Aug7 = new ChordType("Augmented 7th", [0, 4, 8, 10], "1 3 #5 b7", ["+7"]);
  public static DimMaj7 = new ChordType("Diminished Major 7th", [0, 3, 6, 11], "1 b3 b5 7", ["dimMaj7"])

  public static Maj9 = new ChordType("Major 9th", [0, 2, 4, 7, 11], "1 9 3 5 7", ["maj9"]);
  public static Dom9 = new ChordType("9th", [0, 2, 4, 7, 10], "1 9 3 5 b7", ["9"]);
  public static Min9 = new ChordType("Minor 9th", [0, 2, 3, 7, 10], "1 9 b3 5 b7", ["m9"]);
  public static DomMin9 = new ChordType("Dominant Minor 9th", [0, 1, 4, 7, 10], "1 b9 3 5 b7", ["domMin9"])

  public static Dom11 = new ChordType("11th", [0, 2, 4, 5, 7, 10], "1 9 3 11 5 b7", ["11"]);
  public static Min11 = new ChordType("Minor 11th", [0, 2, 3, 5, 7, 11], "1 9 b3 11 5 7", ["m11"]);
  public static Aug11 = new ChordType("Augmented 11th", [0, 2, 4, 5, 7, 10], "1 9 3 11 5 b7", ["+11"]);

  public static Dom13 = new ChordType("13th", [0, 2, 4, 5, 7, 9, 10], "1 9 3 11 5 13 b7", ["13"]);
  public static Min13 = new ChordType("Minor 13th", [0, 2, 3, 5, 7, 9, 10], "1 9 b3 11 5 13 b7", ["m13"]);

  public static Add9 = new ChordType("Add 9", [0, 2, 4, 7], "1 9 3 5", ["add9"]);
  public static SixNine = new ChordType("6/9", [0, 2, 4, 7, 9], "1 9 3 5 6", ["6/9", "6add9"]);

  public static Dream = new ChordType("Dream", [0, 1, 2, 7], "1 b2 2 5", ["dream"]);
  public static Quartal = new ChordType("Quartal", [0, 5, 10], "1 4 b7", ["quartal"]);

  public static BasicTriads = [
    ChordType.Major,
    ChordType.Minor,
    ChordType.Augmented,
    ChordType.Diminished
  ];
  public static Triads = [
    ChordType.Major,
    ChordType.Minor,
    ChordType.Augmented,
    ChordType.Diminished,
    ChordType.Sus2,
    ChordType.Sus4
  ];
  public static SixthChords = [
    ChordType.Maj6,
    ChordType.Min6,
    ChordType.ItalianAug6,
    ChordType.FrenchAug6,
    ChordType.GermanAug6
  ];
  public static SeventhChords = [
    ChordType.Maj7,
    ChordType.Dom7,
    ChordType.MinMaj7,
    ChordType.Min7,
    ChordType.HalfDim7,
    ChordType.Dim7,
    ChordType.AugMaj7,
    ChordType.Aug7,
    ChordType.DimMaj7
  ];
  public static NinthChords = [
    ChordType.Maj9,
    ChordType.Dom9,
    ChordType.Min9,
    ChordType.DomMin9
  ];
  public static EleventhChords = [
    ChordType.Dom11,
    ChordType.Min11,
    ChordType.Aug11
  ];
  public static ThirteenthChords = [
    ChordType.Dom13,
    ChordType.Min13
  ];
  public static AddChords = [
    ChordType.Add9,
    ChordType.SixNine
  ];
  public static OtherChords = [
    ChordType.Power,
    ChordType.SixNine,
    ChordType.Quartal
  ];

  public static Groups = [
    new ChordTypeGroup("Triads", ChordType.Triads),
    new ChordTypeGroup("Sixth Chords", ChordType.SixthChords),
    new ChordTypeGroup("Seventh Chords", ChordType.SeventhChords),
    new ChordTypeGroup("Ninth Chords", ChordType.NinthChords),
    new ChordTypeGroup("Eleventh Chords", ChordType.EleventhChords),
    new ChordTypeGroup("Thirteenth Chords", ChordType.ThirteenthChords),
    new ChordTypeGroup("Add Chords", ChordType.AddChords),
    new ChordTypeGroup("Other Chords", ChordType.OtherChords)
  ];

  public static All = Utils.flattenArrays<ChordType>(
    ChordType.Groups.map(ct => ct.chordTypes)
  );

  public constructor(
    public name: string,
    public pitchIntegers: Array<number>,
    public formulaString: string,
    public symbols: Array<string>) {
      if (!Utils.areArraysEqual(pitchIntegers, ChordScaleFormula.parse(formulaString).pitchIntegers)) {
        console.error(pitchIntegers, formulaString)
      }
    }
  
  public get isMajorType(): boolean {
    return !this.isMinorType;
  }
  public get isMinorType(): boolean {
    return Utils.stringContains(this.formulaString, "b3");
  }
  
  public get pitchCount(): number {
    return this.pitchIntegers.length;
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
  
  public getPitches(rootPitch: Pitch): Array<Pitch> {
    return Chord.fromPitchAndFormulaString(rootPitch, this.formulaString).pitches;
  }
  public getIntervals(): Array<Interval> {
    return getIntervalsFromFormulaString(this.formulaString);
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