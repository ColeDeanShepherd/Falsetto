import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("1", "mM7"),
    new FlashCard("2", "m7"),
    new FlashCard("3", "M7#5"),
    new FlashCard("4", "7"),
    new FlashCard("5", "7"),
    new FlashCard("6", "m7b5"),
    new FlashCard("7", "m7b5"),
  ];
}
export function createQuiz(): Quiz {
  const chordRoots = ["1", "2", "3", "4", "5", "6", "7"];
  const chordTypes = [
    "mM7",
    "m7",
    "M7#5",
    "7",
    "7",
    "m7b5",
    "m7b5"
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
    "Melodic Minor Diatonic Seventh Chords",
    chordRoots,
    chordTypes,
    answers,
    false
  );
}