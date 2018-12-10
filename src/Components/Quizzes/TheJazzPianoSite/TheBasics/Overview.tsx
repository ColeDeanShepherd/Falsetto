import { FlashCard } from "../../../../FlashCard";
import * as PianoNotes from "../../../PianoNotes";
import * as SheetMusicNotes from "../../../SheetMusicNotes";
import * as NoteDurations from "../../NoteDurations";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("A note is _.", "the smallest element of music, a pitched sound"),
    new FlashCard("In Western music, there are _ notes in an octave – labeled _ through _.", "12, A, G"),
    new FlashCard("Different note names which represent the same note (for example C# and D♭) are called _.", "enharmonic"),
  ].concat(PianoNotes.createFlashCards())
  .concat(SheetMusicNotes.createFlashCards())
  .concat(NoteDurations.createFlashCards());
}