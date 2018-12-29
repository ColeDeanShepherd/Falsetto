import { Interval } from "./Interval";

test('halfSteps(unison) is 0', () => {
  expect((new Interval(1, 0)).halfSteps).toEqual(0);
});
test('halfSteps(m2) is 1', () => {
  expect((new Interval(2, -1)).halfSteps).toEqual(1);
});
test('halfSteps(d4) is 4', () => {
  expect((new Interval(4, -1)).halfSteps).toEqual(4);
});
test('halfSteps(P8) is 12', () => {
  expect((new Interval(8, 0)).halfSteps).toEqual(12);
});
test('halfSteps(d12) is 18', () => {
  expect((new Interval(12, -1)).halfSteps).toEqual(18);
});