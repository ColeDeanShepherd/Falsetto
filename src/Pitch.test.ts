import Pitch from './Pitch';
import { PitchLetter } from './PitchLetter';

test('midiNumber of C-1 is 0', () => {
  expect((new Pitch(PitchLetter.C, 0, -1)).midiNumber).toEqual(0);
});
test('midiNumber of A0 is 21', () => {
  expect((new Pitch(PitchLetter.A, 0, 0)).midiNumber).toEqual(21);
});
test('midiNumber of C4 is 60', () => {
  expect((new Pitch(PitchLetter.C, 0, 4)).midiNumber).toEqual(60);
});
test('midiNumber of A4 is 69', () => {
  expect((new Pitch(PitchLetter.A, 0, 4)).midiNumber).toEqual(69);
});

test('midiNumber 0 is C-1', () => {
  expect(Pitch.createFromMidiNumber(0).equals(new Pitch(PitchLetter.C, 0, -1))).toEqual(true);
});
test('midiNumber 21 is A0', () => {
  expect(Pitch.createFromMidiNumber(21).equals(new Pitch(PitchLetter.A, 0, 0))).toEqual(true);
});
test('midiNumber 60 is C4', () => {
  expect(Pitch.createFromMidiNumber(60).equals(new Pitch(PitchLetter.C, 0, 4))).toEqual(true);
});
test('midiNumber 69 is A4', () => {
  expect(Pitch.createFromMidiNumber(69).equals(new Pitch(PitchLetter.A, 0, 4))).toEqual(true);
});

test('lineOrSpaceOnStaffNumber of C-1 is -7', () => {
  expect((new Pitch(PitchLetter.C, 0, -1)).lineOrSpaceOnStaffNumber).toEqual(-7);
});
test('lineOrSpaceOnStaffNumber of A0 is 5', () => {
  expect((new Pitch(PitchLetter.A, 0, 0)).lineOrSpaceOnStaffNumber).toEqual(5);
});
test('lineOrSpaceOnStaffNumber of C4 is 28', () => {
  expect((new Pitch(PitchLetter.C, 0, 4)).lineOrSpaceOnStaffNumber).toEqual(28);
});
test('lineOrSpaceOnStaffNumber of A4 is 33', () => {
  expect((new Pitch(PitchLetter.A, 0, 4)).lineOrSpaceOnStaffNumber).toEqual(33);
});

test('createFromLineOrSpaceOnStaffNumber(-7, -2) is Cbb-1', () => {
  expect(
    Pitch.createFromLineOrSpaceOnStaffNumber(-7, -2).equals(new Pitch(PitchLetter.C, -2, -1))
  ).toBeTruthy();
});
test('createFromLineOrSpaceOnStaffNumber(5, 2) is A##0', () => {
  expect(
    Pitch.createFromLineOrSpaceOnStaffNumber(5, 2).equals(new Pitch(PitchLetter.A, 2, 0))
  ).toBeTruthy();
});
test('createFromLineOrSpaceOnStaffNumber(28, 0) is C4', () => {
  expect(
    Pitch.createFromLineOrSpaceOnStaffNumber(28, 0).equals(new Pitch(PitchLetter.C, 0, 4))
  ).toBeTruthy();
});
test('createFromLineOrSpaceOnStaffNumber(33, 0) is A4', () => {
  expect(
    Pitch.createFromLineOrSpaceOnStaffNumber(33, 0).equals(new Pitch(PitchLetter.A, 0, 4))
  ).toBeTruthy();
});