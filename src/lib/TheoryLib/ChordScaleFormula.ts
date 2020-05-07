import { Pitch, getAccidentalString } from "./Pitch";
import { VerticalDirection } from "../Core/VerticalDirection";
import { Interval } from './Interval';
import { precondition, invariant } from '../Core/Dbc';
import { isNullOrWhiteSpace, takeCharsWhile } from '../Core/StringUtils';

export class ChordScaleFormula {
  public static parse(formulaString: string): ChordScaleFormula {
    precondition(!isNullOrWhiteSpace(formulaString));

    return new ChordScaleFormula(
      formulaString.split(" ").map(ChordScaleFormulaPart.parse)
    );
  }

  public constructor(public parts: Array<ChordScaleFormulaPart>) {}

  public get pitchIntegers(): Array<number> {
    return this.parts.map(p => p.pitchInteger);
  }

  public getPitch(rootPitch: Pitch, scaleDegree: number): Pitch {
    precondition(scaleDegree >= 1);
    precondition(scaleDegree <= this.parts.length);

    return this.parts[scaleDegree - 1].getPitch(rootPitch);
  }

  public getPitches(rootPitch: Pitch): Array<Pitch> {
    return this.parts
      .map(p => p.getPitch(rootPitch));
  }

  public toString(useSymbols: boolean = false): string {
    return this.parts
      .map(p => p.toString(useSymbols))
      .join(" ");
  }
}

export class ChordScaleFormulaPart {
  public static parse(formulaPartString: string): ChordScaleFormulaPart {
    precondition(formulaPartString.length > 0);

    const isOptional = (formulaPartString[0] === "(") && (formulaPartString[formulaPartString.length - 1] === ")");

    const accidentalStringStartIndex = isOptional ? 1 : 0;
    const accidentalString = takeCharsWhile(formulaPartString, accidentalStringStartIndex, c => (c === "#") || (c === "b"));

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

    const scaleDegreeNumberString = formulaPartString.substring(accidentalStringStartIndex + accidentalString.length, formulaPartString.length - (isOptional ? 1 : 0));
    const scaleDegreeNumber = parseInt(scaleDegreeNumberString, 10);

    return new ChordScaleFormulaPart(scaleDegreeNumber, signedAccidental, isOptional);
  }

  public constructor(
    public chordNoteNumber: number,
    public signedAccidental: number,
    public isOptional: boolean
  ) {
    invariant(chordNoteNumber >= 1);
  }

  public get pitchInteger(): number {
    return Interval.getSimpleIntervalTypeHalfSteps(Interval.getSimpleIntervalType(this.chordNoteNumber)) + this.signedAccidental;
  }

  public toString(useSymbols?: boolean): string {
    return this.chordNoteNumber.toString() + getAccidentalString(this.signedAccidental, useSymbols);
  }

  public getIntervalFromRootNote(): Interval {
    return new Interval(this.chordNoteNumber, this.signedAccidental);
  }

  public getPitch(rootPitch: Pitch): Pitch {
    const interval = this.getIntervalFromRootNote();
    const pitch = Pitch.addInterval(rootPitch, VerticalDirection.Up, interval);

    return pitch;
  }
}