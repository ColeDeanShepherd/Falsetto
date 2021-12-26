import { PitchClass } from "./PitchClass";
import { PitchClassName, pitchClassNameToPitchClass } from "./PitchClassName";
import { PitchLetter } from "./PitchLetter";

// #region parseEnglishSignedAccidental

type TestData = { pitchClassName: PitchClassName, pitchClass: PitchClass };

const testDatas: Array<TestData> = [
  { pitchClassName: { letter: PitchLetter.C, signedAccidental: 0 }, pitchClass: PitchClass.C },
  { pitchClassName: { letter: PitchLetter.C, signedAccidental: 1 }, pitchClass: PitchClass.CSharpDFlat },
  { pitchClassName: { letter: PitchLetter.D, signedAccidental: 0 }, pitchClass: PitchClass.D },
  { pitchClassName: { letter: PitchLetter.E, signedAccidental: -1 }, pitchClass: PitchClass.DSharpEFlat },
  { pitchClassName: { letter: PitchLetter.E, signedAccidental: 0 }, pitchClass: PitchClass.E },
  { pitchClassName: { letter: PitchLetter.F, signedAccidental: 0 }, pitchClass: PitchClass.F },
  { pitchClassName: { letter: PitchLetter.F, signedAccidental: 1 }, pitchClass: PitchClass.FSharpGFlat },
  { pitchClassName: { letter: PitchLetter.G, signedAccidental: 0 }, pitchClass: PitchClass.G },
  { pitchClassName: { letter: PitchLetter.A, signedAccidental: -1 }, pitchClass: PitchClass.GSharpAFlat },
  { pitchClassName: { letter: PitchLetter.A, signedAccidental: 0 }, pitchClass: PitchClass.A },
  { pitchClassName: { letter: PitchLetter.B, signedAccidental: -1 }, pitchClass: PitchClass.ASharpBFlat },
  { pitchClassName: { letter: PitchLetter.B, signedAccidental: 0 }, pitchClass: PitchClass.B },
  { pitchClassName: { letter: PitchLetter.C, signedAccidental: -1 }, pitchClass: PitchClass.B },
  { pitchClassName: { letter: PitchLetter.B, signedAccidental: 2 }, pitchClass: PitchClass.CSharpDFlat },
];

for (const testData of testDatas) {
  test(`pitchClassNameToPitchClass('${testData.pitchClassName}') is ${testData.pitchClass}`, () => {
    expect(pitchClassNameToPitchClass(testData.pitchClassName)).toEqual(testData.pitchClass);
  });
}

// #endregion parseEnglishSignedAccidental