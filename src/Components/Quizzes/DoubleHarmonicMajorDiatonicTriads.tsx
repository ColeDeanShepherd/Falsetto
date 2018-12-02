import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";

export function createQuiz(): Quiz {
  const chordRoots = ["1", "2", "3", "4", "5", "6", "7"];
  const chordTypes = [
    "major",
    "major",
    "minor",
    "minor",
    "major b5",
    "augmented",
    "sus2 b5"
  ];
  const answers = [
    "major",
    "minor",
    "diminished",
    "augmented",
    "major b5",
    "sus2 b5"
  ];

  return createTextMultipleChoiceQuiz(
    "Double Harmonic Major Diatonic Triads",
    chordRoots,
    chordTypes,
    answers,
    false
  );
}