import * as Utils from "../../Utils";
import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("1", "Tonic"),
    new FlashCard("2", "Pre-Dominant"),
    new FlashCard("3", "Tonic"),
    new FlashCard("4", "Pre-Dominant"),
    new FlashCard("5", "Dominant"),
    new FlashCard("6", "Tonic"),
    new FlashCard("7", "Dominant"),
  ];
}
export function createQuiz(): Quiz {
  const diatonicChords = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7"
  ];
  const scaleFamilies = [
    "Tonic",
    "Pre-Dominant",
    "Tonic",
    "Pre-Dominant",
    "Dominant",
    "Tonic",
    "Dominant"
  ];
  const answers = Utils.uniq(scaleFamilies);

  return createTextMultipleChoiceQuiz(
    "Chord Families",
    diatonicChords,
    scaleFamilies,
    answers,
    false
  );
}