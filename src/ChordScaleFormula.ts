import * as Utils from "./Utils";
import { Pitch, getAccidentalString } from "./Pitch";
import { VerticalDirection } from "./VerticalDirection";
import { Interval } from './Interval';
import { getSimpleChordNoteNumber } from './Chord';

export class ScaleDegreePitchIntegers {
  public static readonly _1 = 0;
  
  public static readonly _b3 = 3;
  public static readonly _3 = 4;
  
  public static readonly _b5 = 6;
  public static readonly _5 = 7;
  public static readonly _Sharp5 = 8;
  
  public static readonly _bb7 = 9;
  public static readonly _b7 = 10;
  public static readonly _7 = 11;
  
  public static readonly _b9 = 1;
  public static readonly _9 = 2;
  public static readonly _Sharp9 = 3;
  
  public static readonly _11 = 5;
  public static readonly _Sharp11 = 6;
  
  public static readonly _b13 = 8;
  public static readonly _13 = 9;
}

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
  
  public withAddedPart(chordNoteNumber: number, signedAccidental: number): ChordScaleFormula {
    Utils.precondition(chordNoteNumber >= 9);
    Utils.precondition((chordNoteNumber % 2) === 1);

    const simpleChordNoteNumber = getSimpleChordNoteNumber(chordNoteNumber);

    let insertIndex = -1;
    for (let i = 0; i < this.parts.length; i++) {
      const part = this.parts[i];

      if (getSimpleChordNoteNumber(part.chordNoteNumber) === simpleChordNoteNumber) {
        if (part.signedAccidental === signedAccidental) {
          throw new Error(`Already added ${chordNoteNumber}, ${signedAccidental}`);
        } else if (part.signedAccidental > signedAccidental) {
          insertIndex = i;
          break;
        }
      } else if (part.chordNoteNumber > simpleChordNoteNumber) {
        insertIndex = i;
        break;
      } 
    }

    return (insertIndex >= 0)
      ? new ChordScaleFormula(Utils.newArraySplice(this.parts, insertIndex, 0, new ChordScaleFormulaPart(chordNoteNumber, signedAccidental)))
      : new ChordScaleFormula(this.parts.concat([new ChordScaleFormulaPart(chordNoteNumber, signedAccidental)]));
  }
  public withoutPart(chordNoteNumber: number): ChordScaleFormula {
    Utils.precondition(chordNoteNumber >= 2);

    const simpleChordNoteNumber = getSimpleChordNoteNumber(chordNoteNumber);
    const partIndex = this.parts.findIndex(p =>
      getSimpleChordNoteNumber(p.chordNoteNumber) === simpleChordNoteNumber
    );
    Utils.precondition(partIndex >= 0);

    return new ChordScaleFormula(Utils.newArraySplice(this.parts, partIndex, 1));
  }
  public withSharpenedOrFlattenedPart(chordNoteNumber: number, signedAccidental: number): ChordScaleFormula {
    Utils.precondition(signedAccidental !== 0);
    Utils.precondition(chordNoteNumber >= 2);

    const simpleChordNoteNumber = getSimpleChordNoteNumber(chordNoteNumber);
    const partIndex = this.parts.findIndex(p =>
      (getSimpleChordNoteNumber(p.chordNoteNumber) === simpleChordNoteNumber) &&
      (p.signedAccidental === 0)
    );
    Utils.precondition(partIndex >= 0);

    const newFormulaParts = this.parts.slice();
    newFormulaParts[partIndex].signedAccidental = signedAccidental;
    return new ChordScaleFormula(newFormulaParts);
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
    public chordNoteNumber: number,
    public signedAccidental: number
  ) {
    Utils.invariant(chordNoteNumber >= 1);
  }

  public get pitchInteger(): number {
    return Interval.getSimpleIntervalTypeHalfSteps(Interval.getSimpleIntervalType(this.chordNoteNumber)) + this.signedAccidental;
  }

  public toString(): string {
    return this.chordNoteNumber.toString() + getAccidentalString(this.signedAccidental);
  }
  public getIntervalFromRootNote(): Interval {
    return new Interval(this.chordNoteNumber, this.signedAccidental);
  }
}