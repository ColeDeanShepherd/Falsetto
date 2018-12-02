import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";

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