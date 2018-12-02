import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";

export function createQuiz(): Quiz {
  const intervals = [
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
  const consonanceDissonances = [
    "sharp dissonance",
    "mild dissonance",
    "soft consonance",
    "soft consonance",
    "consonance or dissonance",
    "neutral or restless",
    "open consonance",
    "soft consonance",
    "soft consonance",
    "mild dissonance",
    "sharp dissonance",
    "open consonance"
  ];
  const answers = [
    "sharp dissonance",
    "mild dissonance",
    "consonance or dissonance",
    "neutral or restless",
    "soft consonance",
    "open consonance"
  ];
  
  return createTextMultipleChoiceQuiz(
    "Intervals To Consonance Dissonance",
    intervals,
    consonanceDissonances,
    answers,
    false
  );
}