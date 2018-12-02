import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";

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