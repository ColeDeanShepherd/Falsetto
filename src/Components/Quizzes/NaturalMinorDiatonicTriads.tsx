import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("1", "minor"),
    new FlashCard("2", "diminished"),
    new FlashCard("3", "major"),
    new FlashCard("4", "minor"),
    new FlashCard("5", "minor"),
    new FlashCard("6", "major"),
    new FlashCard("7", "major"),
  ];
}
export function createQuiz(): Quiz {
  const chordRoots = ["1", "2", "3", "4", "5", "6", "7"];
  const chordTypes = [
    "minor",
    "diminished",
    "major",
    "minor",
    "minor",
    "major",
    "major"
  ];
  const answers = [
    "major",
    "minor",
    "diminished",
    "augmented"
  ];

  return createTextMultipleChoiceQuiz(
    "Natural Minor Diatonic Triads",
    chordRoots,
    chordTypes,
    answers,
    false
  );
}