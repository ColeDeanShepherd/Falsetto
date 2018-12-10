import { PitchLetter, getPitchLetterMidiNoteNumberOffset } from './PitchLetter';
import * as Utils from './Utils';

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
}

export default Pitch;