import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("Natural Minor 1 Seventh Chord Type", "m7"),
    new FlashCard("Natural Minor 2 Seventh Chord Type", "m7b5"),
    new FlashCard("Natural Minor 3 Seventh Chord Type", "M7"),
    new FlashCard("Natural Minor 4 Seventh Chord Type", "m7"),
    new FlashCard("Natural Minor 5 Seventh Chord Type", "m7"),
    new FlashCard("Natural Minor 6 Seventh Chord Type", "M7"),
    new FlashCard("Natural Minor 7 Seventh Chord Type", "7"),
  ];
}
export function createQuiz(): Quiz {
  const chordRoots = ["1", "2", "3", "4", "5", "6", "7"];
  const chordTypes = [
    "m7",
    "m7b5",
    "M7",
    "m7",
    "m7",
    "M7",
    "7"
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
    "Interval Names to Half Steps",
    chordRoots,
    chordTypes,
    answers,
    false
  );
}