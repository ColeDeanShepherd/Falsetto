import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("m2", "sharp dissonance"),
    new FlashCard("M2", "mild dissonance"),
    new FlashCard("m3", "soft consonance"),
    new FlashCard("M3", "soft consonance"),
    new FlashCard("P4", "consonance or dissonance"),
    new FlashCard("A4/d5", "neutral or restless"),
    new FlashCard("P5", "open consonance"),
    new FlashCard("m6", "soft consonance"),
    new FlashCard("M6", "soft consonance"),
    new FlashCard("m7", "mild dissonance"),
    new FlashCard("M7", "sharp dissonance"),
    new FlashCard("P8", "open consonance"),
  ];
}
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