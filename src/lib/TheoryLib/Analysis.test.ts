import { chordTypeWithAlteration, ChordAlteration } from "./Analysis";
import { ChordType } from "./ChordType";

test("midiNumber of C-1 is 0", () => {
  const [alteredChordType, wasAltered] = chordTypeWithAlteration(ChordType.Diminished, ChordAlteration.AddSharp9);

  expect(wasAltered)
    .toBeFalsy();
});