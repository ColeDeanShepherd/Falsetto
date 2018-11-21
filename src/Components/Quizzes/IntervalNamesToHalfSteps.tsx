import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";

export function createQuiz(): Quiz {
  const intervalNames = [
    "Unison",
    "m2",
    "M2",
    "m3",
    "M3",
    "P4",
    "A4/d5",
    "P5",
    "m6",
    "M6",
    "m7",
    "M7",
    "P8"
  ];
  const answers = intervalNames.map((_, i) => i.toString());
  return createTextMultipleChoiceQuiz(
    "Interval Names to Half Steps",
    intervalNames,
    answers,
    answers,
    false
  );
}