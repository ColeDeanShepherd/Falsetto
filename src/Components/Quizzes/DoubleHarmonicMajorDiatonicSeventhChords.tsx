import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("Double Harmonic Major 1 Seventh Chord Type", "M7"),
    new FlashCard("Double Harmonic Major 2 Seventh Chord Type", "M7"),
    new FlashCard("Double Harmonic Major 3 Seventh Chord Type", "mbb7"),
    new FlashCard("Double Harmonic Major 4 Seventh Chord Type", "mM7"),
    new FlashCard("Double Harmonic Major 5 Seventh Chord Type", "7b5"),
    new FlashCard("Double Harmonic Major 6 Seventh Chord Type", "M7#5"),
    new FlashCard("Double Harmonic Major 7 Seventh Chord Type", "7"),
  ];
}
export function createQuiz(): Quiz {
  const chordRoots = ["1", "2", "3", "4", "5", "6", "7"];
  const chordTypes = [
    "M7",
    "M7",
    "mbb7",
    "mM7",
    "7b5",
    "M7#5",
    "7"
  ];
  const answers = [
    "7",
    "M7",
    "m7",
    "m7b5",
    "dim7",
    "mM7",
    "M7#5",
    "mbb7",
    "7b5"
  ];
  
  return createTextMultipleChoiceQuiz(
    "Double Harmonic Major Diatonic Seventh Chords",
    chordRoots,
    chordTypes,
    answers,
    false
  );
}