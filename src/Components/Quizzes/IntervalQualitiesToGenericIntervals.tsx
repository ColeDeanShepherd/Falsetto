import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceMultipleAnswerQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("perfect", "1st, 4th, 5th, 8th"),
    new FlashCard("imperfect", "2nd, 3rd, 6th, 7th"),
  ];
}
export function createQuiz(): Quiz {
  const intervalQualities = ["perfect", "imperfect"];
  const questionAnswers = [
    ["1st", "4th", "5th", "8th"],
    ["2nd", "3rd", "6th", "7th"]
  ];
  const answers = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
  
  return createTextMultipleChoiceMultipleAnswerQuiz(
    "Interval Qualities To Generic Intervals",
    intervalQualities,
    questionAnswers,
    answers,
    false
  );
}