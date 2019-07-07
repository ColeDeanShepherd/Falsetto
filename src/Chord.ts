import * as Utils from "./Utils";
import { Pitch } from "./Pitch";
import { VerticalDirection } from "./VerticalDirection";
import { getIntervalsFromFormulaString, getIntervalsFromFormula } from './Scale';
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

  public getPitches(rootPitch: Pitch): Array<Pitch> {
    return this.parts
      .map(p => p.getIntervalFromRootNote())
      .map(interval => Pitch.addInterval(rootPitch, VerticalDirection.Up, interval));
  }
  public toString(): string {
    return this.parts
      .map(p => p.toString())
      .join(" ");
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

  public toString(): string {
    if (this.signedAccidental === 0) {
      return this.scaleDegreeNumber.toString();
    } else if (this.signedAccidental > 0) {
      return this.scaleDegreeNumber.toString() + "#".repeat(this.signedAccidental);
    } else { // if (this.signedAccidental < 0)
      return this.scaleDegreeNumber.toString() + "b".repeat(-this.signedAccidental);
    }
  }
  public getIntervalFromRootNote(): Interval {
    return new Interval(this.scaleDegreeNumber, this.signedAccidental);
  }
}
export class ChordTypeGroup {
  public constructor(
    public name: string,
    public chordTypes: Array<ChordType>
  ) {}
}
export class ChordType {
  public static Power = new ChordType("Power", ChordScaleFormula.parse("1 5"), [" power"]);
  public static Major = new ChordType("Major", ChordScaleFormula.parse("1 3 5"), ["M"]);
  public static Minor = new ChordType("Minor", ChordScaleFormula.parse("1 b3 5"), ["m"]);
  public static Augmented = new ChordType("Augmented", ChordScaleFormula.parse("1 3 #5"), ["+"]);
  public static Diminished = new ChordType("Diminished", ChordScaleFormula.parse("1 b3 b5"), ["°"]);
  
  public static Sus2 = new ChordType("Sus2", ChordScaleFormula.parse("1 2 5"), ["sus2"]);
  public static Sus4 = new ChordType("Sus4", ChordScaleFormula.parse("1 4 5"), ["sus4"]);
  
  public static Maj6 = new ChordType("Major 6th", ChordScaleFormula.parse("1 3 5 6"), ["6"]);
  public static Min6 = new ChordType("Minor 6th", ChordScaleFormula.parse("1 b3 5 6"), ["m6"]);
  public static ItalianAug6 = new ChordType("Italian Augmented 6th", ChordScaleFormula.parse("1 3 #6"), [" Italian aug6"]);
  public static FrenchAug6 = new ChordType("French Augmented 6th", ChordScaleFormula.parse("1 3 #4 #6"), [" French aug6", "7b5"]);
  public static GermanAug6 = new ChordType("German Augmented 6th", ChordScaleFormula.parse("1 3 5 #6"), [" German aug6"]);

  public static Maj7 = new ChordType("Major 7th", ChordScaleFormula.parse("1 3 5 7"), ["M7"]);
  public static Dom7 = new ChordType("Dominant 7th", ChordScaleFormula.parse("1 3 5 b7"), ["7", " German 6th"]);
  public static MinMaj7 = new ChordType("Minor-Major 7th", ChordScaleFormula.parse("1 b3 5 7"), ["mM7"]);
  public static Min7 = new ChordType("Minor 7th", ChordScaleFormula.parse("1 b3 5 b7"), ["m7"]);
  public static HalfDim7 = new ChordType("Half-Diminished 7th", ChordScaleFormula.parse("1 b3 b5 b7"), ["ø7"]);
  public static Dim7 = new ChordType("Diminished 7th", ChordScaleFormula.parse("1 b3 b5 bb7"), ["°7"]);
  public static AugMaj7 = new ChordType("Augmented Major 7th", ChordScaleFormula.parse("1 3 #5 7"), ["+M7"]);
  public static Aug7 = new ChordType("Augmented 7th", ChordScaleFormula.parse("1 3 #5 b7"), ["+7"]);
  public static DimMaj7 = new ChordType("Diminished Major 7th", ChordScaleFormula.parse("1 b3 b5 7"), ["dimMaj7"])

  public static Maj9 = new ChordType("Major 9th", ChordScaleFormula.parse("1 9 3 5 7"), ["maj9"]);
  public static Dom9 = new ChordType("9th", ChordScaleFormula.parse("1 9 3 5 b7"), ["9"]);
  public static Min9 = new ChordType("Minor 9th", ChordScaleFormula.parse("1 9 b3 5 b7"), ["m9"]);
  public static DomMin9 = new ChordType("Dominant Minor 9th", ChordScaleFormula.parse("1 b9 3 5 b7"), ["domMin9"])

  public static Dom11 = new ChordType("11th", ChordScaleFormula.parse("1 9 3 11 5 b7"), ["11"]);
  public static Min11 = new ChordType("Minor 11th", ChordScaleFormula.parse("1 9 b3 11 5 7"), ["m11"]);
  public static Aug11 = new ChordType("Augmented 11th", ChordScaleFormula.parse("1 9 3 11 5 b7"), ["+11"]);

  public static Dom13 = new ChordType("13th", ChordScaleFormula.parse("1 9 3 11 5 13 b7"), ["13"]);
  public static Min13 = new ChordType("Minor 13th", ChordScaleFormula.parse("1 9 b3 11 5 13 b7"), ["m13"]);

  public static Add9 = new ChordType("Add 9", ChordScaleFormula.parse("1 9 3 5"), ["add9"]);
  public static SixNine = new ChordType("6/9", ChordScaleFormula.parse("1 9 3 5 6"), ["6/9", "6add9"]);

  public static Dream = new ChordType("Dream", ChordScaleFormula.parse("1 b2 2 5"), ["dream"]);
  public static Quartal = new ChordType("Quartal", ChordScaleFormula.parse("1 4 b7"), ["quartal"]);

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

  public pitchIntegers: Array<number>;

  public constructor(
    public name: string,
    public formula: ChordScaleFormula,
    public symbols: Array<string>
  ) {
    this.pitchIntegers = formula.parts.map(p => p.pitchInteger);
  }
  
  public get isMajorType(): boolean {
    return !this.isMinorType;
  }
  public get isMinorType(): boolean {
    return this.formula.parts.some(p => (p.scaleDegreeNumber === 3) && (p.signedAccidental === -1));
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
    return this.formula.getPitches(rootPitch);
  }
  public getIntervals(): Array<Interval> {
    return getIntervalsFromFormula(this.formula);
  }
}

export class Chord {
  public constructor(
    public type: ChordType,
    public rootPitch: Pitch
  ) {}

  public getSymbol(): string {
    return `${this.rootPitch.toString(false)}${this.type.symbols[0]}`;
  }
  public getPitches(): Array<Pitch> {
    return this.type.formula.getPitches(this.rootPitch);
  }
}

export function checkChordNames() {
  const numPitchIntegerCombinations = 4096; // 2 ^ 12
  
  for (let i = 0; i < numPitchIntegerCombinations; i++) {
    // The pitch integer '0' always needs to be present.
    if ((i % 2) == 0) { continue; }

    let pitchIntegers = new Array<number>();

    for (let pitchInteger = 0; pitchInteger < 12; pitchInteger++) {
      if ((i & (1 << pitchInteger)) !== 0) {
        pitchIntegers.push(pitchInteger);
      }
    }

    if (pitchIntegers.length < 2) { continue; }

    const pitchIntegersString = pitchIntegers.join(' ');
    const chordType = ChordType.All.find(ct => Utils.areArraysEqual(ct.pitchIntegers, pitchIntegers));
    console.log(pitchIntegersString, chordType ? chordType.name : null);
  }
}
checkChordNames();