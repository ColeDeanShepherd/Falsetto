import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";

export function createQuiz(): Quiz {
  const intervalQualitySymbols = [
    "m",
    "M",
    "A",
    "d",
    "P"
  ];
  const intervalQualities = [
    "minor",
    "major",
    "augmented",
    "diminished",
    "perfect"
  ];
  
  return createTextMultipleChoiceQuiz(
    "Interval Names to Half Steps",
    intervalQualitySymbols,
    intervalQualities,
    intervalQualities,
    false
  );
}