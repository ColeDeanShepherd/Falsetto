import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("1", "major"),
    new FlashCard("2", "minor"),
    new FlashCard("3", "minor"),
    new FlashCard("4", "major"),
    new FlashCard("5", "major"),
    new FlashCard("6", "minor"),
    new FlashCard("7", "diminished"),
  ];
}
export function createQuiz(): Quiz {
  const chordRoots = ["1", "2", "3", "4", "5", "6", "7"];
  const chordTypes = [
    "major",
    "minor",
    "minor",
    "major",
    "major",
    "minor",
    "diminished"
  ];
  const answers = [
    "major",
    "minor",
    "diminished",
    "augmented"
  ];
  
  return createTextMultipleChoiceQuiz(
    "Major Diatonic Triads",
    chordRoots,
    chordTypes,
    answers,
    false
  );
}