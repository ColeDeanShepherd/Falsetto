import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("1", "Ionian"),
    new FlashCard("2", "Dorian"),
    new FlashCard("3", "Phrygian"),
    new FlashCard("4", "Lydian"),
    new FlashCard("5", "Mixolydian"),
    new FlashCard("6", "Aeolian"),
    new FlashCard("7", "Locrian"),
  ];
}
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