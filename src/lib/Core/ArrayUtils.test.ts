import { rotateArrayRight, areArraysEqual } from './ArrayUtils';

test("rotateArrayRight", () => {
  const array = [1, 2, 3, 4];
  rotateArrayRight(array, /*steps*/ 6);

  expect(areArraysEqual(array, [3, 4, 1, 2])).toBeTruthy();
});