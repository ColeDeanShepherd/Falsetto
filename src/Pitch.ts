import { PitchLetter, getPitchLetterMidiNoteNumberOffset } from './PitchLetter';
import * as Utils from './Utils';
import { VerticalDirection } from "./VerticalDirection";

function isValidIntervalType(num: number) {
  return Number.isInteger(num) && (num > 0);
}

class Pitch {
  public static createFromMidiNumber(midiNumber: number): Pitch {
    const positivePitchOffsetFromC = Utils.mod(midiNumber, 12);
    const octaveNumber = Math.floor(midiNumber / 12) - 1;
    
    switch (positivePitchOffsetFromC) {
      case 0:
        return new Pitch(PitchLetter.C, 0, octaveNumber);
      case 1:
        return new Pitch(PitchLetter.C, 1, octaveNumber);
      case 2:
        return new Pitch(PitchLetter.D, 0, octaveNumber);
      case 3:
        return new Pitch(PitchLetter.D, 1, octaveNumber);
      case 4:
        return new Pitch(PitchLetter.E, 0, octaveNumber);
      case 5:
        return new Pitch(PitchLetter.F, 0, octaveNumber);
      case 6:
        return new Pitch(PitchLetter.F, 1, octaveNumber);
      case 7:
        return new Pitch(PitchLetter.G, 0, octaveNumber);
      case 8:
        return new Pitch(PitchLetter.G, 1, octaveNumber);
      case 9:
        return new Pitch(PitchLetter.A, 0, octaveNumber);
      case 10:
        return new Pitch(PitchLetter.A, 1, octaveNumber);
      case 11:
        return new Pitch(PitchLetter.B, 0, octaveNumber);
      default:
        throw new Error("Invalid positivePitchOffsetFromC.");
    }
  }
  public static createFromLineOrSpaceOnStaffNumber(lineOrSpaceOnStaffNumber: number, signedAccidental: number): Pitch {
    const letter = Utils.mod(lineOrSpaceOnStaffNumber + 2, 7) as PitchLetter;
    const octaveNumber = Math.floor(lineOrSpaceOnStaffNumber / 7);
    return new Pitch(letter, signedAccidental, octaveNumber);
  }
  public static addPitchLetters(pitch: Pitch, pitchLetterOffset: number): Pitch {
    return Pitch.createFromLineOrSpaceOnStaffNumber(
      pitch.lineOrSpaceOnStaffNumber + pitchLetterOffset,
      pitch.signedAccidental
    );
  }

  public static addInterval(
    pitch: Pitch,
    direction: VerticalDirection,
    intervalType: number,
    intervalQuality: number
  ) {
    Utils.precondition(isValidIntervalType(intervalType));
    Utils.precondition(Number.isInteger(intervalQuality));

    const offsetSign = direction as number;
    
    const halfStepsOffset = offsetSign * Pitch.intervalToHalfSteps(intervalType, intervalQuality);
    const newMidiNumber = pitch.midiNumber + halfStepsOffset;

    const result = Pitch.createFromLineOrSpaceOnStaffNumber(
      pitch.lineOrSpaceOnStaffNumber + (offsetSign * (intervalType - 1)),
      pitch.signedAccidental
    );
    result.signedAccidental += newMidiNumber - result.midiNumber;

    return result;
  }

  public static intervalToHalfSteps(intervalType: number, intervalQuality: number) {
    Utils.precondition(isValidIntervalType(intervalType));
    Utils.precondition(Number.isInteger(intervalQuality));
    
    const octaveCount = Math.floor(intervalType / 8);
    const simpleIntervalType = 1 + Utils.mod((intervalType - 1), 7);

    let simpleIntervalHalfSteps: number;
    switch (simpleIntervalType) {
      case 1:
        simpleIntervalHalfSteps = 0;
        break;
      case 2:
        simpleIntervalHalfSteps = 2;
        break;
      case 3:
        simpleIntervalHalfSteps = 4;
        break;
      case 4:
        simpleIntervalHalfSteps = 5;
        break;
      case 5:
        simpleIntervalHalfSteps = 7;
        break;
      case 6:
        simpleIntervalHalfSteps = 9;
        break;
      case 7:
        simpleIntervalHalfSteps = 11;
        break;
      default:
        throw new Error(`Invalid simple interval type: ${simpleIntervalType}`);
    }

    return (12 * octaveCount) + simpleIntervalHalfSteps + intervalQuality;
  }

  public constructor(
    public letter: PitchLetter,
    public signedAccidental: number,
    public octaveNumber: number
  ) {}

  public get midiNumber(): number {
    const pitchLetterMidiNoteNumberOffset = getPitchLetterMidiNoteNumberOffset(this.letter);
    return (12 * (this.octaveNumber + 1)) + pitchLetterMidiNoteNumberOffset + this.signedAccidental;
  }
  public get lineOrSpaceOnStaffNumber(): number {
    return (7 * this.octaveNumber) + Utils.mod(this.letter - 2, 7);
  }
  public equals(pitch: Pitch): boolean {
    return (
      (this.letter === pitch.letter) &&
      (this.signedAccidental === pitch.signedAccidental) &&
      (this.octaveNumber === pitch.octaveNumber)
    );
  }
  public isEnharmonic(pitch: Pitch): boolean {
    return this.midiNumber === pitch.midiNumber;
  }
  public getAccidentalString(): string {
    if (this.signedAccidental === 0) {
      return "";
    }

    const accidentalCharacter = (this.signedAccidental > 0) ? "#" : "b";
    return accidentalCharacter.repeat(Math.abs(this.signedAccidental));
  }
  public toString(includeOctaveNumber: boolean = true): string {
    return PitchLetter[this.letter] + this.getAccidentalString() + (includeOctaveNumber ? this.octaveNumber.toString() : "");
  }
}

export default Pitch;