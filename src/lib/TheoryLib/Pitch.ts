import { PitchLetter, getPitchLetterMidiNoteNumberOffset } from "./PitchLetter";
import { VerticalDirection } from "../Core/VerticalDirection";
import { Interval } from "./Interval";
import { precondition } from '../Core/Dbc';
import { mod } from '../Core/MathUtils';

export function getPitchRange(minPitch: Pitch, maxPitch: Pitch) {
  const minMidiNumber = minPitch.midiNumber;
  const maxMidiNumber = maxPitch.midiNumber;

  precondition(minMidiNumber <= maxMidiNumber);

  let pitches = new Array<Pitch>();

  for (let midiNumber = minMidiNumber; midiNumber <= maxMidiNumber; midiNumber++) {
    pitches.push(Pitch.createFromMidiNumber(midiNumber));
  }

  return pitches;
}

export function getAmbiguousPitchRange(
  minPitch: Pitch, maxPitch: Pitch,
  minSignedAccidental: number, maxSignedAccidental: number
): Array<Pitch> {
  precondition(minSignedAccidental <= maxSignedAccidental);

  const minLineOrSpaceOnStaffNumber = minPitch.lineOrSpaceOnStaffNumber;
  const maxLineOrSpaceOnStaffNumber = maxPitch.lineOrSpaceOnStaffNumber;
  const possibleNotes = new Array<Pitch>();

  for (
    let lineOrSpaceOnStaffNumber = minLineOrSpaceOnStaffNumber;
    lineOrSpaceOnStaffNumber < maxLineOrSpaceOnStaffNumber;
    lineOrSpaceOnStaffNumber++
  ) {
    for (
      let signedAccidental = minSignedAccidental;
      signedAccidental <= maxSignedAccidental;
      signedAccidental++
    ) {
      possibleNotes.push(Pitch.createFromLineOrSpaceOnStaffNumber(
        lineOrSpaceOnStaffNumber,
        signedAccidental
      ));
    }
  }

  return possibleNotes;
}

export function getAccidentalString(signedAccidental: number, useSymbols: boolean = false): string {
  if (signedAccidental === 0) {
    return "";
  }

  const accidentalCharacter = (signedAccidental > 0)
    ? useSymbols ? "♯" : "#"
    : useSymbols ? "♭" : "b";
  return accidentalCharacter.repeat(Math.abs(signedAccidental));
}

export const arePitchOffsetsFromCWhiteKeys = [
  true, // C
  false, // C#/Db
  true, // D
  false, // D#/Eb
  true, // E
  true, // F
  false, // F#/Gb
  true, // G
  false, // G#/Ab
  true, // A
  false, // A#/Bb
  true, // B
];
export const ambiguousPitchStrings = [
  "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"
];
export const ambiguousPitchStringsSymbols = [
  "C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭", "A", "A♯/B♭", "B"
];

export const ambiguousKeyPitchStringsSymbols = [
  "A", "A♯/B♭", "B", "C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭"
];

export class Pitch {
  public static createFromMidiNumber(midiNumber: number, useSharps: boolean = true): Pitch {
    const positivePitchOffsetFromC = mod(midiNumber, 12);
    const octaveNumber = Math.floor(midiNumber / 12) - 1;
    
    switch (positivePitchOffsetFromC) {
      case 0:
        return new Pitch(PitchLetter.C, 0, octaveNumber);
      case 1:
        return useSharps ? new Pitch(PitchLetter.C, 1, octaveNumber) : new Pitch(PitchLetter.D, -1, octaveNumber);
      case 2:
        return new Pitch(PitchLetter.D, 0, octaveNumber);
      case 3:
        return useSharps ? new Pitch(PitchLetter.D, 1, octaveNumber) : new Pitch(PitchLetter.E, -1, octaveNumber);
      case 4:
        return new Pitch(PitchLetter.E, 0, octaveNumber);
      case 5:
        return new Pitch(PitchLetter.F, 0, octaveNumber);
      case 6:
        return useSharps ? new Pitch(PitchLetter.F, 1, octaveNumber) : new Pitch(PitchLetter.G, -1, octaveNumber);
      case 7:
        return new Pitch(PitchLetter.G, 0, octaveNumber);
      case 8:
        return useSharps ? new Pitch(PitchLetter.G, 1, octaveNumber) : new Pitch(PitchLetter.A, -1, octaveNumber);
      case 9:
        return new Pitch(PitchLetter.A, 0, octaveNumber);
      case 10:
        return useSharps ? new Pitch(PitchLetter.A, 1, octaveNumber) : new Pitch(PitchLetter.B, -1, octaveNumber);
      case 11:
        return new Pitch(PitchLetter.B, 0, octaveNumber);
      default:
        throw new Error(`Invalid positivePitchOffsetFromC: ${positivePitchOffsetFromC}`);
    }
  }
  public static createFromLineOrSpaceOnStaffNumber(lineOrSpaceOnStaffNumber: number, signedAccidental: number): Pitch {
    const letter = mod(lineOrSpaceOnStaffNumber + 2, 7) as PitchLetter;
    const octaveNumber = Math.floor(lineOrSpaceOnStaffNumber / 7);
    return new Pitch(letter, signedAccidental, octaveNumber);
  }
  public static addPitchLetters(pitch: Pitch, pitchLetterOffset: number): Pitch {
    return Pitch.createFromLineOrSpaceOnStaffNumber(
      pitch.lineOrSpaceOnStaffNumber + pitchLetterOffset,
      pitch.signedAccidental
    );
  }
  public static isInRange(pitch: Pitch, minPitch: Pitch, maxPitch: Pitch): boolean {
    const minPitchMidiNumber = minPitch.midiNumber;
    const maxPitchMidiNumber = maxPitch.midiNumber;
    precondition(minPitchMidiNumber <= maxPitchMidiNumber);

    const pitchMidiNumber = pitch.midiNumber;
    return (pitchMidiNumber >= minPitchMidiNumber) && (pitchMidiNumber <= maxPitchMidiNumber);
  }

  public static addInterval(
    pitch: Pitch,
    direction: VerticalDirection,
    interval: Interval
  ): Pitch {
    const offsetSign = direction as number;
    
    const halfStepsOffset = offsetSign * interval.halfSteps;
    const newMidiNumber = pitch.midiNumber + halfStepsOffset;

    const result = Pitch.createFromLineOrSpaceOnStaffNumber(
      pitch.lineOrSpaceOnStaffNumber + (offsetSign * (interval.type - 1)),
      pitch.signedAccidental
    );
    result.signedAccidental += newMidiNumber - result.midiNumber;

    return result;
  }

  public static addOctaves(
    pitch: Pitch, octaves: number
  ): Pitch {
    return new Pitch(pitch.letter, pitch.signedAccidental, pitch.octaveNumber + octaves);
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
  public get midiNumberNoOctave(): number {
    return mod(this.midiNumber, 12);
  }
  public get lineOrSpaceOnStaffNumber(): number {
    return (7 * this.octaveNumber) + mod(this.letter - 2, 7);
  }
  public get isNatural(): boolean {
    return this.signedAccidental === 0;
  }

  // TODO: add tests
  public get isWhiteKey(): boolean {
    const positivePitchOffsetFromC = mod(this.midiNumber, 12);
    return arePitchOffsetsFromCWhiteKeys[positivePitchOffsetFromC];
  }
  // TODO: add tests
  public get isBlackKey(): boolean {
    return !this.isWhiteKey;
  }
  
  public equals(pitch: Pitch): boolean {
    return (
      (this.letter === pitch.letter) &&
      (this.signedAccidental === pitch.signedAccidental) &&
      (this.octaveNumber === pitch.octaveNumber)
    );
  }
  public equalsNoOctave(pitch: Pitch): boolean {
    return (
      (this.letter === pitch.letter) &&
      (this.signedAccidental === pitch.signedAccidental)
    );
  }
  public isEnharmonic(pitch: Pitch): boolean {
    return this.midiNumber === pitch.midiNumber;
  }
  public getAccidentalString(useSymbols: boolean = false): string {
    return getAccidentalString(this.signedAccidental, useSymbols);
  }
  public toString(includeOctaveNumber: boolean = true, useSymbols: boolean = false): string {
    return PitchLetter[this.letter] + this.getAccidentalString(useSymbols) + (includeOctaveNumber ? this.octaveNumber.toString() : "");
  }

  // TODO: add tests
  public toOneAccidentalAmbiguousString(includeOctaveNumber: boolean = true, useSymbols: boolean = false): string {
    const positivePitchOffsetFromC = mod(this.midiNumber, 12);
    const ambiguousPitchString = !useSymbols
      ? ambiguousPitchStrings[positivePitchOffsetFromC]
      : ambiguousPitchStringsSymbols[positivePitchOffsetFromC];
    
    const octaveNumber = Math.floor(this.midiNumber / 12) - 1;
    const octaveNumberString = includeOctaveNumber ? octaveNumber.toString() : "";

    return ambiguousPitchString + octaveNumberString;
  }
  
  // TODO: add tests
  public toVexFlowString(includeOctaveNumber: boolean = true): string {
    return `${PitchLetter[this.letter].toLowerCase()}${this.getAccidentalString()}/${this.octaveNumber}`;
  }
  
  // TODO: add tests
  public toVexFlowKeySignatureString(): string {
    return `${PitchLetter[this.letter]}${this.getAccidentalString()}`;
  }
}