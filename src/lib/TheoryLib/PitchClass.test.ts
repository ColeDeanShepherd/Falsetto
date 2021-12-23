import { parseEnglishSignedAccidental } from "./PitchClass";

// #region parseEnglishSignedAccidental

const testDatas = [
  { str: '', signedAccidental: 0 },
  { str: 'asdf', signedAccidental: undefined },
  { str: 'sasdf', signedAccidental: 0 },
  { str: 'fasdf', signedAccidental: 0 },
  { str: 'sharp', signedAccidental: 1 },
  { str: 'flat', signedAccidental: -1 },
  { str: 'sharpsharp', signedAccidental: 2 },
  { str: 'flatflat', signedAccidental: -2 },
];

for (const testData of testDatas) {
  test(`parseEnglishSignedAccidental('${testData.str}') is ${testData.signedAccidental}`, () => {
    expect(parseEnglishSignedAccidental(testData.str)).toEqual(testData.signedAccidental);
  });
}

// #endregion parseEnglishSignedAccidental