import * as Utils from "./Utils";
import { Pitch } from "./Pitch";
import { getIntervalsFromFormula, getSimpleScaleDegree } from './Scale';
import { Interval } from './Interval';
import { ChordScaleFormula } from './ChordScaleFormula';

export function getSimpleChordNoteNumber(chordNoteNumber: number) {
  return getSimpleScaleDegree(chordNoteNumber);
}

export class ChordTypeGroup {
  public constructor(
    public name: string,
    public chordTypes: Array<ChordType>
  ) {}
}
export class ChordType {
  // Chord Modifiers
  public static chordTypesWithRemovedNote(chordTypes: Array<ChordType>, chordNoteNumbers: number[]): Array<ChordType> {
    Utils.precondition(chordNoteNumbers.length > 0);

    return Utils.flattenArrays(chordTypes
      .map(ct => chordNoteNumbers
        .map(n => new ChordType(
          ct.name + ` (no ${n})`,
          ct.formula.withoutPart(n),
          ct.symbols.map(s => s + ` (no ${n})`)
        ))
      )
    );
  }
  public static addChords(chordTypes: Array<ChordType>, addedChordNoteNumber: number): Array<ChordType> {
    return chordTypes
      .map(ct => new ChordType(
        ct.name + `add${addedChordNoteNumber}`,
        ct.formula.withAddedPart(addedChordNoteNumber, 0),
        ct.symbols.map(s => s + `add${addedChordNoteNumber}`)
      ));
  }

  // Triads
  public static Major = new ChordType("Major", ChordScaleFormula.parse("1 3 5"), ["", "M"]);
  public static Minor = new ChordType("Minor", ChordScaleFormula.parse("1 b3 5"), ["m"]);
  public static Augmented = new ChordType("Augmented", ChordScaleFormula.parse("1 3 #5"), ["+"]);
  public static Diminished = new ChordType("Diminished", ChordScaleFormula.parse("1 b3 b5"), ["°"]);

  public static Sus2 = new ChordType("Sus2", ChordScaleFormula.parse("1 2 5"), ["sus2"]);
  public static Sus4 = new ChordType("Sus4", ChordScaleFormula.parse("1 4 5"), ["sus4"]);

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

  public static SixthChords = [
    ChordType.Maj6,
    ChordType.Min6
  ];
  
  // Seventh Chords
  public static Maj7 = new ChordType("Major 7th", ChordScaleFormula.parse("1 3 5 7"), ["M7"]);
  public static Dom7 = new ChordType("Dominant 7th", ChordScaleFormula.parse("1 3 5 b7"), ["7"]);
  public static MinMaj7 = new ChordType("Minor-Major 7th", ChordScaleFormula.parse("1 b3 5 7"), ["mM7"]);
  public static Min7 = new ChordType("Minor 7th", ChordScaleFormula.parse("1 b3 5 b7"), ["m7"]);
  public static HalfDim7 = new ChordType("Half-Diminished 7th", ChordScaleFormula.parse("1 b3 b5 b7"), ["ø7"]);
  public static Dim7 = new ChordType("Diminished 7th", ChordScaleFormula.parse("1 b3 b5 bb7"), ["°7", "dim7"]);
  public static AugMaj7 = new ChordType("Augmented Major 7th", ChordScaleFormula.parse("1 3 #5 7"), ["+M7"]);
  public static Aug7 = new ChordType("Augmented 7th", ChordScaleFormula.parse("1 3 #5 b7"), ["+7"]);
  public static DimMaj7 = new ChordType("Diminished Major 7th", ChordScaleFormula.parse("1 b3 b5 7"), ["dimMaj7"]);

  public static SimpleSeventhChords = [
    ChordType.Maj7,
    ChordType.Dom7,
    ChordType.MinMaj7,
    ChordType.Min7,
    ChordType.HalfDim7,
    ChordType.Dim7,
    ChordType.AugMaj7,
    ChordType.Aug7,
    ChordType.DimMaj7,
  ];
  /*public static AlteredSeventhChords = [
    ChordType.Maj7.sharpenOrFlatten(5, -1),
    ChordType.Dom7.sharpenOrFlatten(5, -1)
  ];*/
  public static SeventhChordsOmittedNotes = ChordType.chordTypesWithRemovedNote(ChordType.SimpleSeventhChords, [5]);
  
  // Ninth Chords
  public static Maj9 = new ChordType("Major 9th", ChordScaleFormula.parse("1 9 3 5 7"), ["M9"]);
  public static Dom9 = new ChordType("9th", ChordScaleFormula.parse("1 9 3 5 b7"), ["9"]);
  public static MinMaj9 = new ChordType("Minor-Major 9th", ChordScaleFormula.parse("1 9 b3 5 7"), ["mM9"]);
  public static Min9 = new ChordType("Minor 9th", ChordScaleFormula.parse("1 9 b3 5 b7"), ["m9"]);
  public static HalfDim9 = new ChordType("Half-Diminished 9th", ChordScaleFormula.parse("1 9 b3 b5 b7"), ["ø9"]);
  public static Dim9 = new ChordType("Diminished 9th", ChordScaleFormula.parse("1 9 b3 b5 bb7"), ["°9", "dim9"]);
  public static AugMaj9 = new ChordType("Augmented Major 9th", ChordScaleFormula.parse("1 9 3 #5 7"), ["+M9"]);
  public static Aug9 = new ChordType("Augmented 9th", ChordScaleFormula.parse("1 9 3 #5 b7"), ["+9"]);
  public static DimMaj9 = new ChordType("Diminished Major 9th", ChordScaleFormula.parse("1 9 b3 b5 7"), ["dimMaj9"]);

  public static SimpleNinthChords = [
    ChordType.Maj9,
    ChordType.Dom9,
    ChordType.MinMaj9,
    ChordType.Min9,
    ChordType.HalfDim9,
    ChordType.Dim9,
    ChordType.AugMaj9,
    ChordType.Aug9,
    ChordType.DimMaj9
  ];
  /*public static FlatNinthChords = ChordType.SimpleNinthChords
    .map(ct => ct.sharpenOrFlatten(9, -1));*/
  public static NinthChordsOmittedNotes = ChordType.chordTypesWithRemovedNote(ChordType.SimpleNinthChords, [5]);
  
  // Eleventh Chords
  public static Maj11 = new ChordType("Major 11th", ChordScaleFormula.parse("1 9 3 11 5 7"), ["M11"]);
  public static Dom11 = new ChordType("11th", ChordScaleFormula.parse("1 9 3 11 5 b7"), ["11"]);
  public static MinMaj11 = new ChordType("Minor-Major 11th", ChordScaleFormula.parse("1 9 b3 11 5 7"), ["mM11"]);
  public static Min11 = new ChordType("Minor 11th", ChordScaleFormula.parse("1 9 b3 11 5 b7"), ["m11"]);
  public static AugMaj11 = new ChordType("Augmented Major 11th", ChordScaleFormula.parse("1 9 3 11 #5 7"), ["+M11"]);
  public static Aug11 = new ChordType("Augmented 11th", ChordScaleFormula.parse("1 9 3 11 #5 b7"), ["+11"]);
  public static HalfDim11 = new ChordType("Half-Diminished 11th", ChordScaleFormula.parse("1 9 b3 11 b5 b7"), ["ø11"]);
  public static Dim11 = new ChordType("Diminished 11th", ChordScaleFormula.parse("1 9 b3 11 b5 bb7"), ["°11", "dim11"]);
  public static DimMaj11 = new ChordType("Diminished Major 11th", ChordScaleFormula.parse("1 9 b3 11 b5 7"), ["dimMaj11"]);

  public static SimpleEleventhChords = [
    ChordType.Maj11,
    ChordType.Dom11,
    ChordType.MinMaj11,
    ChordType.Min11,
    ChordType.AugMaj11,
    ChordType.Aug11,
    ChordType.HalfDim11,
    ChordType.Dim11,
    ChordType.DimMaj11
  ];
  public static EleventhChordsOmittedNotes = ChordType.chordTypesWithRemovedNote(ChordType.SimpleEleventhChords, [3, 5, 9]);
  
  // Thirteenth Chords
  public static Maj13 = new ChordType("Major 13th", ChordScaleFormula.parse("1 9 3 11 5 13 7"), ["M13"]);
  public static Dom13 = new ChordType("13th", ChordScaleFormula.parse("1 9 3 11 5 13 b7"), ["13"]);
  public static MinMaj13 = new ChordType("Minor-Major 13th", ChordScaleFormula.parse("1 9 b3 11 5 13 7"), ["mM13"]);
  public static Min13 = new ChordType("Minor 13th", ChordScaleFormula.parse("1 9 b3 11 5 13 b7"), ["m13"]);
  public static AugMaj13 = new ChordType("Augmented Major 13th", ChordScaleFormula.parse("1 9 3 11 #5 13 7"), ["+M13"]);
  public static Aug13 = new ChordType("Augmented 13th", ChordScaleFormula.parse("1 9 3 11 #5 13 b7"), ["+13"]);
  public static HalfDim13 = new ChordType("Half-Diminished 13th", ChordScaleFormula.parse("1 9 b3 11 b5 13 b7"), ["ø13"]);
  public static DimMaj13 = new ChordType("Diminished Major 13th", ChordScaleFormula.parse("1 9 b3 11 b5 13 7"), ["dimMaj13"]);

  public static SimpleThirteenthChords = [
    ChordType.Maj13,
    ChordType.Dom13,
    ChordType.MinMaj13,
    ChordType.Min13,
    ChordType.AugMaj13,
    ChordType.Aug13,
    ChordType.HalfDim13,
    ChordType.DimMaj13
  ];
  public static ThirteenthChordsOmittedNotes = ChordType.chordTypesWithRemovedNote(ChordType.SimpleEleventhChords, [3, 5, 9, 11]);

  // Other Chords
  public static Power = new ChordType("Power", ChordScaleFormula.parse("1 5"), [" power"]);
  public static QuartalTriad = new ChordType("Quartal", ChordScaleFormula.parse("1 4 b7"), ["quartal"]);
  public static Quartal4Notes = new ChordType("Quartal", ChordScaleFormula.parse("1 b3 4 b7"), ["quartal"]);
    
  public static AddChords = new Array<ChordType>()
    .concat(ChordType.addChords(ChordType.BasicTriads, 9))
    .concat(ChordType.addChords(ChordType.SixthChords, 9))
    .concat(ChordType.addChords(ChordType.BasicTriads, 11))
    .concat(ChordType.addChords(ChordType.SixthChords, 11))
    .concat(ChordType.addChords(ChordType.BasicTriads, 13));
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
    new ChordTypeGroup("Add Chords", ChordType.AddChords),
    new ChordTypeGroup("Other Chords", ChordType.OtherChords)
  ];

  public static All = Utils.flattenArrays<ChordType>(
    ChordType.Groups.map(ct => ct.chordTypes)
  )
    .concat(ChordType.SeventhChordsOmittedNotes)
    //.concat(ChordType.AlteredSeventhChords)
    //.concat(ChordType.FlatNinthChords)
    .concat(ChordType.NinthChordsOmittedNotes)
    .concat(ChordType.EleventhChordsOmittedNotes)
    .concat(ChordType.ThirteenthChordsOmittedNotes)
    .concat(ChordType.Quartal4Notes);

  public pitchIntegers: Array<number>;

  public constructor(
    public name: string,
    public formula: ChordScaleFormula,
    public symbols: Array<string>
  ) {
    this.pitchIntegers = formula.parts.map(p => p.pitchInteger);

    const chordNames = formula.generateChordNames()
      .map(cn => cn.toString());
    if (!Utils.arrayContains(chordNames, name)) {
      const formulaString = formula.toString();
      console.log(chordNames, name, formulaString);
    }
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
//checkChordNames();