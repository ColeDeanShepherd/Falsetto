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