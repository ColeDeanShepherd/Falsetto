import * as Utils from "../../Utils";
import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";

import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("Tonic", "doesn't contain the 4th scale degree"),
    new FlashCard("Pre-Dominant", "contains only 4th scale degree"),
    new FlashCard("Dominant", "contains the 4th and 7th scale degrees"),
  ];
}
export function createQuiz(): Quiz {
  const chordFamilies = [
    "Tonic",
    "Pre-Dominant",
    "Dominant"
  ];
  const chordFamilyDefinitions = [
    "doesn't contain the 4th scale degree",
    "contains only 4th scale degree",
    "contains the 4th and 7th scale degrees"
  ];
  const answers = Utils.uniq(chordFamilyDefinitions);

  return createTextMultipleChoiceQuiz(
    "Chord Family Definitions",
    chordFamilies,
    chordFamilyDefinitions,
    answers,
    false
  );
}