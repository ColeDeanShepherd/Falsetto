import * as Utils from "../../Utils";
import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";

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