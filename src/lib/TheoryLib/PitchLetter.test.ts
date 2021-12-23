import { parsePitchLetter, PitchLetter } from "./PitchLetter";

// #region parsePitchLetter

const testDatas = [
  { str: '', pitchLetter: undefined },
  { str: 'a', pitchLetter: PitchLetter.A },
  { str: 'A', pitchLetter: PitchLetter.A },
  { str: 'b', pitchLetter: PitchLetter.B },
  { str: 'B', pitchLetter: PitchLetter.B },
  { str: 'c', pitchLetter: PitchLetter.C },
  { str: 'C', pitchLetter: PitchLetter.C },
  { str: 'd', pitchLetter: PitchLetter.D },
  { str: 'D', pitchLetter: PitchLetter.D },
  { str: 'e', pitchLetter: PitchLetter.E },
  { str: 'E', pitchLetter: PitchLetter.E },
  { str: 'f', pitchLetter: PitchLetter.F },
  { str: 'F', pitchLetter: PitchLetter.F },
  { str: 'g', pitchLetter: PitchLetter.G },
  { str: 'G', pitchLetter: PitchLetter.G },
  { str: 'hgs', pitchLetter: undefined }
];

for (const testData of testDatas) {
  test(`parsePitchLetter('${testData.str}') is ${testData.pitchLetter}`, () => {
    expect(parsePitchLetter(testData.str)).toEqual(testData.pitchLetter);
  });
}

// #endregion parsePitchLetter