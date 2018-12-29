import { Chord } from "./Chord";
import { Pitch } from './Pitch';
import { PitchLetter } from './PitchLetter';

test('fromPitchAndFormulaString(C, "1 3 5") is "C E G"', () => {
  expect(Chord.fromPitchAndFormulaString(
    new Pitch(PitchLetter.C, 0, 4),
    "1 3 5"
  ).toPitchString())
    .toEqual("C E G");
});

test('fromPitchAndFormulaString(C, "1 b3 5") is "C Eb G"', () => {
  expect(Chord.fromPitchAndFormulaString(
    new Pitch(PitchLetter.C, 0, 4),
    "1 b3 5"
  ).toPitchString())
    .toEqual("C Eb G");
});

test('fromPitchAndFormulaString(C, "1 b3 5 b7") is "C Eb G Bb"', () => {
  expect(Chord.fromPitchAndFormulaString(
    new Pitch(PitchLetter.C, 0, 4),
    "1 b3 5 b7"
  ).toPitchString())
    .toEqual("C Eb G Bb");
});

test('fromPitchAndFormulaString(C, "1 3 5 7 9 11 13") is "C E G B D F A"', () => {
  expect(Chord.fromPitchAndFormulaString(
    new Pitch(PitchLetter.C, 0, 4),
    "1 3 5 7 9 11 b13"
  ).toPitchString())
    .toEqual("C E G B D F Ab");
});

test('fromPitchAndFormulaString(C, "1 b2 3 b4 5 b6 7") is "C Db E Fb G Ab B"', () => {
  expect(Chord.fromPitchAndFormulaString(
    new Pitch(PitchLetter.C, 0, 4),
    "1 b2 3 b4 5 b6 7"
  ).toPitchString())
    .toEqual("C Db E Fb G Ab B");
});