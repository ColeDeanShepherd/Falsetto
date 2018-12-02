import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceMultipleAnswerQuiz } from "../Quiz";

export function createQuiz(): Quiz {
  const chordTypes = [
    "Maj7",
    "m7",
    "ø7",
    "mMaj7",
    "Maj+7",
    "o",
    "7",
    "7sus",
    "+7",
  ];
  const questionAnswers = [
    ["9", "#11", "13"],
    ["9", "11", "13"],
    ["9", "11", "b13"],
    ["9", "11", "13"],
    ["9", "#11"],
    ["9", "11", "b13", "7"],
    ["b9", "9", "#9", "#11", "b13", "13"],
    ["b9", "9", "#9", "b11", "b13", "13"],
    ["b9", "9", "#9", "#11", "13"],
  ];
  const answers = ["7", "b9", "9", "#9", "b11", "11", "#11", "b13", "13"];
  
  return createTextMultipleChoiceMultipleAnswerQuiz(
    "Available Chord Tensions",
    chordTypes,
    questionAnswers,
    answers,
    false
  );
}