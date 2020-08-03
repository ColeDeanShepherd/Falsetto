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

export function copyChordScaleFormula(chordScaleFormula: ChordScaleFormula): ChordScaleFormula {
  return new ChordScaleFormula(
    chordScaleFormula.parts.map(copyChordScaleFormulaPart)
  );
}

export function containsPart(formula: ChordScaleFormula, part: ChordScaleFormulaPart): boolean {
  return formula.parts.some(p => p.pitchInteger === part.pitchInteger);
}

export function removePart(formula: ChordScaleFormula, chordNoteNumber: number, signedAccidental: number): boolean {
  for (let i = 0; i < formula.parts.length;) {
    const part = formula.parts[i];

    if ((part.chordNoteNumber === chordNoteNumber) && (part.signedAccidental === signedAccidental)) {
      formula.parts.splice(i, 1);
      return true;
    } else {
      i++;
    }
  }

  return false;
}

export function removePartWithPitchInteger(formula: ChordScaleFormula, pitchInteger: number): boolean {
  for (let i = 0; i < formula.parts.length;) {
    const part = formula.parts[i];

    if ((part.pitchInteger === pitchInteger)) {
      formula.parts.splice(i, 1);
      return true;
    } else {
      i++;
    }
  }

  return false;
}

function partComesBefore(a: ChordScaleFormulaPart, b: ChordScaleFormulaPart): boolean {
  function calculateQuotientRemainder(p: ChordScaleFormulaPart): [number, number] {
    let quotient: number;
    let remainder: number;
    
    if (a.chordNoteNumber < 8) {
      quotient = 0;
      remainder = p.chordNoteNumber;
    } else {
      quotient = 1;
      remainder = p.chordNoteNumber - 7;
    }

    return [quotient, remainder];
  }
  
  let [aQuotient, aRemainder] = calculateQuotientRemainder(a);
  let [bQuotient, bRemainder] = calculateQuotientRemainder(b);

  if (aRemainder < bRemainder) { return true; }
  else if (aRemainder > bRemainder) { return false; }
  else { return aQuotient < bQuotient; }
}

function findPartInsertIndex(part: ChordScaleFormulaPart, formula: ChordScaleFormula): number {
  let insertIndex = 0;

  while (partComesBefore(part, formula.parts[insertIndex])) {
    insertIndex++;
  }

  return insertIndex;
}

export function addPart(formula: ChordScaleFormula, newPart: ChordScaleFormulaPart): boolean {
  if (containsPart(formula, newPart)) { return false; }

  const insertIndex = findPartInsertIndex(newPart, formula);
  formula.parts.splice(insertIndex, 0, newPart);

  return true;
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

export function copyChordScaleFormulaPart(chordScaleFormulaPart: ChordScaleFormulaPart): ChordScaleFormulaPart {
  return new ChordScaleFormulaPart(
    chordScaleFormulaPart.chordNoteNumber,
    chordScaleFormulaPart.signedAccidental,
    chordScaleFormulaPart.isOptional
  );
}