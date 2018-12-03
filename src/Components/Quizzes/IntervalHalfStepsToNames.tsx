import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("0", "Unison"),
    new FlashCard("1", "m2"),
    new FlashCard("2", "M2"),
    new FlashCard("3", "m3"),
    new FlashCard("4", "M3"),
    new FlashCard("5", "P4"),
    new FlashCard("6", "A4/d5"),
    new FlashCard("7", "P5"),
    new FlashCard("8", "m6"),
    new FlashCard("9", "M6"),
    new FlashCard("10", "m7"),
    new FlashCard("11", "M7"),
    new FlashCard("12", "P8"),
  ];
}
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
    "Interval Half Steps To Names",
    intervalNames,
    answers,
    answers,
    true
  );
}