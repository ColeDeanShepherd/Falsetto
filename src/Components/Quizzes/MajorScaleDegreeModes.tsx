import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";

export function createQuiz(): Quiz {
  const scaleDegrees = ["1", "2", "3", "4", "5", "6", "7"];
  const scaleDegreeModes = [
    "Ionian",
    "Dorian",
    "Phrygian",
    "Lydian",
    "Mixolydian",
    "Aeolian",
    "Locrian"
  ];
  const answers = [
    "Ionian",
    "Dorian",
    "Phrygian",
    "Lydian",
    "Mixolydian",
    "Aeolian",
    "Locrian"
  ];
  
  return createTextMultipleChoiceQuiz(
    "Major Scale Degree Modes",
    scaleDegrees,
    scaleDegreeModes,
    answers,
    false
  );
}