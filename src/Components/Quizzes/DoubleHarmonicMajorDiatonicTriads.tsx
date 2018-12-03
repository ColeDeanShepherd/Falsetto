import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("1", "major"),
    new FlashCard("2", "major"),
    new FlashCard("3", "minor"),
    new FlashCard("4", "minor"),
    new FlashCard("5", "major b5"),
    new FlashCard("6", "augmented"),
    new FlashCard("7", "sus2 b5"),
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