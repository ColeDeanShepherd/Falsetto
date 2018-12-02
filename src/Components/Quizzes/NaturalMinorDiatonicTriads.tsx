import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";

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