import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("Harmonic Major 1 Seventh Chord Type", "M7"),
    new FlashCard("Harmonic Major 2 Seventh Chord Type", "m7b5"),
    new FlashCard("Harmonic Major 3 Seventh Chord Type", "m7"),
    new FlashCard("Harmonic Major 4 Seventh Chord Type", "mM7"),
    new FlashCard("Harmonic Major 5 Seventh Chord Type", "7"),
    new FlashCard("Harmonic Major 6 Seventh Chord Type", "M7#5"),
    new FlashCard("Harmonic Major 7 Seventh Chord Type", "dim7"),
  ];
}
export function createQuiz(): Quiz {
  const chordRoots = ["1", "2", "3", "4", "5", "6", "7"];
  const chordTypes = [
    "M7",
    "m7b5",
    "m7",
    "mM7",
    "7",
    "M7#5",
    "dim7"
  ];
  const answers = [
    "7",
    "M7",
    "m7",
    "m7b5",
    "dim7",
    "mM7",
    "M7#5"
  ];
  
  return createTextMultipleChoiceQuiz(
    "Harmonic Major Diatonic Seventh Chords",
    chordRoots,
    chordTypes,
    answers,
    false
  );
}