import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("Double Harmonic Major 1 Chord Type", "major"),
    new FlashCard("Double Harmonic Major 2 Chord Type", "major"),
    new FlashCard("Double Harmonic Major 3 Chord Type", "minor"),
    new FlashCard("Double Harmonic Major 4 Chord Type", "minor"),
    new FlashCard("Double Harmonic Major 5 Chord Type", "major b5"),
    new FlashCard("Double Harmonic Major 6 Chord Type", "augmented"),
    new FlashCard("Double Harmonic Major 7 Chord Type", "sus2 b5"),
  ];
}
export function createQuiz(): Quiz {
  const chordRoots = ["1", "2", "3", "4", "5", "6", "7"];
  const chordTypes = [
    "major",
    "major",
    "minor",
    "minor",
    "major b5",
    "augmented",
    "sus2 b5"
  ];
  const answers = [
    "major",
    "minor",
    "diminished",
    "augmented",
    "major b5",
    "sus2 b5"
  ];

  return createTextMultipleChoiceQuiz(
    "Double Harmonic Major Diatonic Triads",
    chordRoots,
    chordTypes,
    answers,
    false
  );
}