import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("1", "minor"),
    new FlashCard("2", "minor"),
    new FlashCard("3", "augmented"),
    new FlashCard("4", "major"),
    new FlashCard("5", "major"),
    new FlashCard("6", "diminished"),
    new FlashCard("7", "diminished"),
  ];
}
export function createQuiz(): Quiz {
  const chordRoots = ["1", "2", "3", "4", "5", "6", "7"];
  const chordTypes = [
    "minor",
    "minor",
    "augmented",
    "major",
    "major",
    "diminished",
    "diminished"
  ];
  const answers = [
    "major",
    "minor",
    "diminished",
    "augmented"
  ];
  
  return createTextMultipleChoiceQuiz(
    "Melodic Minor Diatonic Triads",
    chordRoots,
    chordTypes,
    answers,
    false
  );
}