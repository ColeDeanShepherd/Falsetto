import { Pitch } from "./Pitch";
import { PitchLetter } from "./PitchLetter";
import { VerticalDirection } from "../Core/VerticalDirection";
import { Interval } from "./Interval";

test("midiNumber of C-1 is 0", () => {
  expect((createPitch(PitchLetter.C, 0, -1)).midiNumber).toEqual(0);
});
test("midiNumber of A0 is 21", () => {
  expect((createPitch(PitchLetter.A, 0, 0)).midiNumber).toEqual(21);
});
test("midiNumber of C4 is 60", () => {
  expect((createPitch(PitchLetter.C, 0, 4)).midiNumber).toEqual(60);
});
test("midiNumber of A4 is 69", () => {
  expect((createPitch(PitchLetter.A, 0, 4)).midiNumber).toEqual(69);
});

test("midiNumber 0 is C-1", () => {
  expect(createPitchFromMidiNumber(0).equals(createPitch(PitchLetter.C, 0, -1))).toEqual(true);
});
test("midiNumber 21 is A0", () => {
  expect(createPitchFromMidiNumber(21).equals(createPitch(PitchLetter.A, 0, 0))).toEqual(true);
});
test("midiNumber 60 is C4", () => {
  expect(createPitchFromMidiNumber(60).equals(createPitch(PitchLetter.C, 0, 4))).toEqual(true);
});
test("midiNumber 69 is A4", () => {
  expect(createPitchFromMidiNumber(69).equals(createPitch(PitchLetter.A, 0, 4))).toEqual(true);
});

test("lineOrSpaceOnStaffNumber of C-1 is -7", () => {
  expect((createPitch(PitchLetter.C, 0, -1)).lineOrSpaceOnStaffNumber).toEqual(-7);
});
test("lineOrSpaceOnStaffNumber of A0 is 5", () => {
  expect((createPitch(PitchLetter.A, 0, 0)).lineOrSpaceOnStaffNumber).toEqual(5);
});
test("lineOrSpaceOnStaffNumber of C4 is 28", () => {
  expect((createPitch(PitchLetter.C, 0, 4)).lineOrSpaceOnStaffNumber).toEqual(28);
});
test("lineOrSpaceOnStaffNumber of A4 is 33", () => {
  expect((createPitch(PitchLetter.A, 0, 4)).lineOrSpaceOnStaffNumber).toEqual(33);
});

test("createFromLineOrSpaceOnStaffNumber(-7, -2) is Cbb-1", () => {
  expect(
    Pitch.createFromLineOrSpaceOnStaffNumber(-7, -2).equals(createPitch(PitchLetter.C, -2, -1))
  ).toBeTruthy();
});
test("createFromLineOrSpaceOnStaffNumber(5, 2) is A♯♯0", () => {
  expect(
    Pitch.createFromLineOrSpaceOnStaffNumber(5, 2).equals(createPitch(PitchLetter.A, 2, 0))
  ).toBeTruthy();
});
test("createFromLineOrSpaceOnStaffNumber(28, 0) is C4", () => {
  expect(
    Pitch.createFromLineOrSpaceOnStaffNumber(28, 0).equals(createPitch(PitchLetter.C, 0, 4))
  ).toBeTruthy();
});
test("createFromLineOrSpaceOnStaffNumber(33, 0) is A4", () => {
  expect(
    Pitch.createFromLineOrSpaceOnStaffNumber(33, 0).equals(createPitch(PitchLetter.A, 0, 4))
  ).toBeTruthy();
});

test("addInterval(B3 - P1) is B3", () => {
  expect(
    Pitch.addInterval(
      createPitch(PitchLetter.B, 0, 3),
      VerticalDirection.Down,
      new Interval(1, 0)
    ).toString()
  )
    .toEqual("B3");
});
test("addInterval(C4 + P5) is G4", () => {
  expect(
    Pitch.addInterval(
      createPitch(PitchLetter.C, 0, 4),
      VerticalDirection.Up,
      new Interval(5, 0)
    ).toString()
  )
    .toEqual("G4");
});
test("addInterval(C4 - A4) is Gb3", () => {
  expect(
    Pitch.addInterval(
      createPitch(PitchLetter.C, 0, 4),
      VerticalDirection.Down,
      new Interval(4, 1)
    ).toString()
  )
    .toEqual("Gb3");
});
test("addInterval(A2 + dd12) is Ebb4", () => {
  expect(
    Pitch.addInterval(
      createPitch(PitchLetter.A, 0, 2),
      VerticalDirection.Up,
      new Interval(12, -2)
    ).toString()
  )
    .toEqual("Ebb4");
});
test("addInterval(C4 + M11) is F5", () => {
  expect(
    Pitch.addInterval(
      createPitch(PitchLetter.C, 0, 4),
      VerticalDirection.Up,
      new Interval(11, 0)
    ).toString()
  )
    .toEqual("F5");
});

test("getInterval(B3, B3) is P1", () => {
  expect(
    Interval.fromPitches(
      createPitch(PitchLetter.B, 0, 3),
      createPitch(PitchLetter.B, 0, 3)
    )
  )
    .toEqual(new Interval(1, 0));
});
test("getInterval(C4, G4) is P5", () => {
  expect(
    Interval.fromPitches(
      createPitch(PitchLetter.C, 0, 4),
      createPitch(PitchLetter.G, 0, 4)
    )
  )
    .toEqual(new Interval(5, 0));
});
test("getInterval(C4, Gb3) is A4", () => {
  expect(
    Interval.fromPitches(
      createPitch(PitchLetter.C, 0, 4),
      createPitch(PitchLetter.G, -1, 3)
    )
  )
    .toEqual(new Interval(4, 1));
});
test("getInterval(A2, Ebb4) is dd12", () => {
  expect(
    Interval.fromPitches(
      createPitch(PitchLetter.E, -2, 4),
      createPitch(PitchLetter.A, 0, 2)
    )
  )
    .toEqual(new Interval(12, -2));
});