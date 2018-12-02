import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";

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