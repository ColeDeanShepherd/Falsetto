import { PitchLetter, pitchLetterToMidiNumberOffset, parsePitchLetter } from './PitchLetter';
import { VerticalDirection } from "../Core/VerticalDirection";
import { Interval } from "./Interval";
import { precondition } from '../Core/Dbc';
import { mod } from '../Core/MathUtils';
import { parseSignedAccidental, PitchClassName } from './PitchClassName';
import { parseEnglishSignedAccidental, PitchClass } from './PitchClass';
import { createPitch, Pitch } from './Pitch';

export function pitchClassNameToPitchName(pitchClassName: PitchClassName, octaveNumber: number): PitchName {
  return {
    letter: pitchClassName.letter,
    signedAccidental: pitchClassName.signedAccidental,
    octaveNumber
  };
}

export function getAmbiguousPitchRange(
  minPitch: PitchName, maxPitch: PitchName,
  minSignedAccidental: number, maxSignedAccidental: number
): Array<PitchName> {
  precondition(minSignedAccidental <= maxSignedAccidental);

  const minLineOrSpaceOnStaffNumber = getLineOrSpaceOnStaffNumber(minPitch);
  const maxLineOrSpaceOnStaffNumber = getLineOrSpaceOnStaffNumber(maxPitch);
  const possibleNotes = new Array<PitchName>();

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
      possibleNotes.push(createPitchNameFromLineOrSpaceOnStaffNumber(
        lineOrSpaceOnStaffNumber,
        signedAccidental
      ));
    }
  }

  return possibleNotes;
}

function getAccidentalStringInternal(signedAccidental: number, sharpText: string, flatText: string): string {
  if (signedAccidental === 0) {
    return "";
  }

  const accidentalCharacter = (signedAccidental > 0)
    ? sharpText
    : flatText;
  return accidentalCharacter.repeat(Math.abs(signedAccidental));
}

export function getAccidentalString(signedAccidental: number, useSymbols: boolean = false): string {
  return getAccidentalStringInternal(signedAccidental, useSymbols ? "♯" : "#", useSymbols ? "♭" : "b");
}

export function tryWrapPitchOctave(
  pitchName: PitchName,
  lowestPitch: PitchName,
  highestPitch: PitchName
): PitchName | undefined {
  const lowestPitchMidiNumber = getMidiNumber(lowestPitch);
  const highestPitchMidiNumber = getMidiNumber(highestPitch);
  
  const pitchCountInRange = (highestPitchMidiNumber - lowestPitchMidiNumber) + 1;
  const pitchOctaveSpan = Math.ceil(pitchCountInRange / 12);
  
  // If the pitch is below the pitch range, shift it up by octaves until it isn't.
  if (getMidiNumber(pitchName) < lowestPitchMidiNumber) {
    // TODO: optimize
    do {
      pitchName = addOctaves(pitchName, pitchOctaveSpan);
    } while (getMidiNumber(pitchName) < lowestPitchMidiNumber);
  }
  // Otherwise, if the pitch is above the pitch range, shift it down by octaves until it isn't.
  else if (getMidiNumber(pitchName) > highestPitchMidiNumber) {
    // TODO: optimize
    do {
      pitchName = addOctaves(pitchName, -pitchOctaveSpan);
    } while (getMidiNumber(pitchName) > highestPitchMidiNumber);
  }

  // If the pitch is in range now, return it. Otherwise, return undefined.
  const pitchMidiNumber = getMidiNumber(pitchName);

  return ((pitchMidiNumber >= lowestPitchMidiNumber) && (pitchMidiNumber <= highestPitchMidiNumber))
    ? pitchName
    : undefined;
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

export function getEnglishAccidentalString(signedAccidental: number): string {
  return getAccidentalStringInternal(signedAccidental, "sharp", "flat");
}

export function getUriComponent(pitchName: PitchName, includeOctaveNumber: boolean = false): string {
  return PitchLetter[pitchName.letter] + getEnglishAccidentalString(pitchName.signedAccidental) + (includeOctaveNumber ? pitchName.octaveNumber.toString() : "");
}

export function parseFromUriComponent(uriComponent: string, octaveNumber: number): PitchName | undefined {
  const pitchLetter = parsePitchLetter(uriComponent);
  if (pitchLetter === undefined) { return undefined; }

  const signedAccidentalStr = uriComponent.substring(1);
  const signedAccidental = parseEnglishSignedAccidental(signedAccidentalStr);
  if (signedAccidental === undefined) { return undefined; }

  return {
    letter: pitchLetter,
    signedAccidental,
    octaveNumber
  };
}

export function isPitchLessThan(a: PitchName, b: PitchName): boolean {
  return getMidiNumber(a) < getMidiNumber(b);
}

export function isPitchGreaterThan(a: PitchName, b: PitchName): boolean {
  return getMidiNumber(a) > getMidiNumber(b);
}

export function areMidiNumbersSamePitchClass(a: number, b: number): boolean {
  return (Math.abs(a - b)) % 12 === 0
}

export interface PitchName {
  letter: PitchLetter;
  signedAccidental: number;
  octaveNumber: number;
}

export function createPitchName(letter: PitchLetter, signedAccidental: number, octaveNumber: number): PitchName {
  return {
    letter,
    signedAccidental,
    octaveNumber
  };
}

export function createFromPitchClass(pitchClass: number, octaveNumber: number, useSharps: boolean = true): PitchName {
  switch (pitchClass) {
    case 0:
      return { letter: PitchLetter.C, signedAccidental: 0, octaveNumber };
    case 1:
      return useSharps ? { letter: PitchLetter.C, signedAccidental: 1, octaveNumber } : { letter: PitchLetter.D, signedAccidental: -1, octaveNumber };
    case 2:
      return { letter: PitchLetter.D, signedAccidental: 0, octaveNumber };
    case 3:
      return useSharps ? { letter: PitchLetter.D, signedAccidental: 1, octaveNumber } : { letter: PitchLetter.E, signedAccidental: -1, octaveNumber };
    case 4:
      return { letter: PitchLetter.E, signedAccidental: 0, octaveNumber };
    case 5:
      return { letter: PitchLetter.F, signedAccidental: 0, octaveNumber };
    case 6:
      return useSharps ? { letter: PitchLetter.F, signedAccidental: 1, octaveNumber } : { letter: PitchLetter.G, signedAccidental: -1, octaveNumber };
    case 7:
      return { letter: PitchLetter.G, signedAccidental: 0, octaveNumber };
    case 8:
      return useSharps ? { letter: PitchLetter.G, signedAccidental: 1, octaveNumber } : { letter: PitchLetter.A, signedAccidental: -1, octaveNumber };
    case 9:
      return { letter: PitchLetter.A, signedAccidental: 0, octaveNumber };
    case 10:
      return useSharps ? { letter: PitchLetter.A, signedAccidental: 1, octaveNumber } : { letter: PitchLetter.B, signedAccidental: -1, octaveNumber };
    case 11:
      return { letter: PitchLetter.B, signedAccidental: 0, octaveNumber };
    default:
      throw new Error(`Invalid pitch class: ${pitchClass}`);
  }
}

export function createPitchNameFromMidiNumber(midiNumber: number, useSharps: boolean = true): PitchName {
  const pitchClass = mod(midiNumber, 12);
  const octaveNumber = Math.floor(midiNumber / 12) - 1;
  return createFromPitchClass(pitchClass, octaveNumber, useSharps);
}

export function createPitchNameFromLineOrSpaceOnStaffNumber(lineOrSpaceOnStaffNumber: number, signedAccidental: number): PitchName {
  const letter = mod(lineOrSpaceOnStaffNumber + 2, 7) as PitchLetter;
  const octaveNumber = Math.floor(lineOrSpaceOnStaffNumber / 7);
  return { letter: letter, signedAccidental, octaveNumber };
}

// TODO: remove
export function parseNoOctave(str: string, octaveNumber: number): PitchName | undefined {
  const pitchLetter = parsePitchLetter(str);
  if (pitchLetter === undefined) { return undefined; }

  const signedAccidentalStr = str.substring(1, 2);
  const signedAccidental = parseSignedAccidental(signedAccidentalStr);
  if (signedAccidental === undefined) { return undefined; }

  return { letter: pitchLetter, signedAccidental, octaveNumber };
}

export function addPitchLetters(pitchName: PitchName, pitchLetterOffset: number): PitchName {
  return createPitchNameFromLineOrSpaceOnStaffNumber(
    getLineOrSpaceOnStaffNumber(pitchName) + pitchLetterOffset,
    pitchName.signedAccidental
  );
}

export function isInRange(pitchName: PitchName, minPitch?: PitchName, maxPitch?: PitchName): boolean {
  const minPitchMidiNumber = minPitch ? getMidiNumber(minPitch) : undefined;
  const maxPitchMidiNumber = maxPitch ? getMidiNumber(maxPitch) : undefined;

  precondition(
    (minPitchMidiNumber === undefined) ||
    (maxPitchMidiNumber === undefined) ||
    (minPitchMidiNumber <= maxPitchMidiNumber)
  );

  const pitchMidiNumber = getMidiNumber(pitchName);

  if (minPitchMidiNumber && (pitchMidiNumber < minPitchMidiNumber)) {
    return false;
  }

  if (maxPitchMidiNumber && (pitchMidiNumber > maxPitchMidiNumber)) {
    return false;
  }

  return true;
}

export function addHalfSteps(pitchName: PitchName, numHalfSteps: number): PitchName {
  return createPitchNameFromMidiNumber(getMidiNumber(pitchName) + numHalfSteps);
}

export function addInterval(
  pitchName: PitchName,
  direction: VerticalDirection,
  interval: Interval
): PitchName {
  const offsetSign = direction as number;
  
  const halfStepsOffset = offsetSign * interval.halfSteps;
  const newMidiNumber = getMidiNumber(pitchName) + halfStepsOffset;

  const result = createPitchNameFromLineOrSpaceOnStaffNumber(
    getLineOrSpaceOnStaffNumber(pitchName) + (offsetSign * (interval.type - 1)),
    pitchName.signedAccidental
  );
  result.signedAccidental += newMidiNumber - getMidiNumber(result);

  return result;
}

export function addOctaves(
  pitchName: PitchName, octaves: number
): PitchName {
  return {
    letter: pitchName.letter,
    signedAccidental: pitchName.signedAccidental,
    octaveNumber: pitchName.octaveNumber + octaves
  };
}

export function min(a: PitchName, b: PitchName): PitchName {
  return (getMidiNumber(a) <= getMidiNumber(b)) ? a : b;
}

export function max(a: PitchName, b: PitchName): PitchName {
  return (getMidiNumber(a) >= getMidiNumber(b)) ? a : b;
}

export function getClass(pitchName: PitchName): PitchClass {
  return getMidiNumberNoOctave(pitchName);
}

export function getPitch(pitchName: PitchName): Pitch {
  return createPitch(pitchName.letter, pitchName.signedAccidental, pitchName.octaveNumber);
}

export function getMidiNumber(pitchName: PitchName): number {
  return getPitch(pitchName);
}

export function getMidiNumberNoOctave(pitchName: PitchName): number {
  return mod(getMidiNumber(pitchName), 12);
}

export function getLineOrSpaceOnStaffNumber(pitchName: PitchName): number {
  return (7 * pitchName.octaveNumber) + mod(pitchName.letter - 2, 7);
}

export function getIsNatural(pitchName: PitchName): boolean {
  return pitchName.signedAccidental === 0;
}

// TODO: add tests
export function getIsWhiteKey(pitchName: PitchName): boolean {
  const positivePitchOffsetFromC = mod(getMidiNumber(pitchName), 12);
  return arePitchOffsetsFromCWhiteKeys[positivePitchOffsetFromC];
}

// TODO: add tests
export function getIsBlackKey(pitchName: PitchName): boolean {
  return !getIsWhiteKey(pitchName);
}

export function equals(pitchName: PitchName, other: PitchName): boolean {
  return (
    (pitchName.letter === other.letter) &&
    (pitchName.signedAccidental === other.signedAccidental) &&
    (pitchName.octaveNumber === other.octaveNumber)
  );
}

export function equalsNoOctave(pitchName: PitchName, other: PitchName): boolean {
  return (
    (pitchName.letter === other.letter) &&
    (pitchName.signedAccidental === other.signedAccidental)
  );
}

export function isEnharmonic(pitchName: PitchName, other: PitchName): boolean {
  return getMidiNumber(pitchName) === getMidiNumber(other);
}

export function toString(pitchName: PitchName, includeOctaveNumber: boolean = true, useSymbols: boolean = false): string {
  return PitchLetter[pitchName.letter] + getAccidentalString(pitchName.signedAccidental, useSymbols) + (includeOctaveNumber ? pitchName.octaveNumber.toString() : "");
}

// TODO: add tests
export function toOneAccidentalAmbiguousString(pitchName: PitchName, includeOctaveNumber: boolean = true, useSymbols: boolean = false): string {
  const positivePitchOffsetFromC = mod(getMidiNumber(pitchName), 12);
  const ambiguousPitchString = !useSymbols
    ? ambiguousPitchStrings[positivePitchOffsetFromC]
    : ambiguousPitchStringsSymbols[positivePitchOffsetFromC];
  
  const octaveNumber = Math.floor(getMidiNumber(pitchName) / 12) - 1;
  const octaveNumberString = includeOctaveNumber ? octaveNumber.toString() : "";

  return ambiguousPitchString + octaveNumberString;
}

// TODO: add tests
export function toVexFlowString(pitchName: PitchName, includeOctaveNumber: boolean = true): string {
  return `${PitchLetter[pitchName.letter].toLowerCase()}${getAccidentalString(pitchName.signedAccidental)}/${pitchName.octaveNumber}`;
}

// TODO: add tests
export function toVexFlowKeySignatureString(pitchName: PitchName): string {
  return `${PitchLetter[pitchName.letter]}${getAccidentalString(pitchName.signedAccidental)}`;
}