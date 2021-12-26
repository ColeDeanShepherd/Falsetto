import { Pitch } from "./Pitch";
import { PitchLetter } from "./PitchLetter";
import { ChordScaleFormula } from './ChordScaleFormula';

test("getPitches(C, \"1 3 5\") is \"C E G\"", () => {
  expect(ChordScaleFormula.parse("1 3 5").getPitchClasses(
    new Pitch(PitchLetter.C, 0, 4),
  ).map(p => p.toString(false)).join(" "))
    .toEqual("C E G");
});

test("getPitches(C, \"1 b3 5\") is \"C Eb G\"", () => {
  expect(ChordScaleFormula.parse("1 b3 5").getPitchClasses(
    new Pitch(PitchLetter.C, 0, 4),
  ).map(p => p.toString(false)).join(" "))
    .toEqual("C Eb G");
});

test("getPitches(C, \"1 b3 5 b7\") is \"C Eb G Bb\"", () => {
  expect(ChordScaleFormula.parse("1 b3 5 b7").getPitchClasses(
    new Pitch(PitchLetter.C, 0, 4),
  ).map(p => p.toString(false)).join(" "))
    .toEqual("C Eb G Bb");
});

test("getPitches(C, \"1 3 5 7 9 11 13\") is \"C E G B D F A\"", () => {
  expect(ChordScaleFormula.parse("1 3 5 7 9 11 b13").getPitchClasses(
    new Pitch(PitchLetter.C, 0, 4),
  ).map(p => p.toString(false)).join(" "))
    .toEqual("C E G B D F Ab");
});

test("getPitches(C, \"1 b2 3 b4 5 b6 7\") is \"C Db E Fb G Ab B\"", () => {
  expect(ChordScaleFormula.parse("1 b2 3 b4 5 b6 7").getPitchClasses(
    new Pitch(PitchLetter.C, 0, 4),
  ).map(p => p.toString(false)).join(" "))
    .toEqual("C Db E Fb G Ab B");
});