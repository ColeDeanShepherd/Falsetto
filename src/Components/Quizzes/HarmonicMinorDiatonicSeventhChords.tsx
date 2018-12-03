import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("1", "mM7"),
    new FlashCard("2", "m7b5"),
    new FlashCard("3", "M7#5"),
    new FlashCard("4", "m7"),
    new FlashCard("5", "7"),
    new FlashCard("6", "M7"),
    new FlashCard("7", "dim7"),
  ];
}
export function createQuiz(): Quiz {
  const chordRoots = ["1", "2", "3", "4", "5", "6", "7"];
  const chordTypes = [
    "mM7",
    "m7b5",
    "M7#5",
    "m7",
    "7",
    "M7",
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
    "Harmonic Minor Diatonic Seventh Chords",
    chordRoots,
    chordTypes,
    answers,
    false
  );
}