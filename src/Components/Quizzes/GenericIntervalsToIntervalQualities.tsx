import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";

export function createQuiz(): Quiz {
  const genericIntervals = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
  const intervalQualities = ["perfect", "imperfect", "imperfect", "perfect", "perfect", "imperfect", "imperfect", "perfect"];
  const answers = ["perfect", "imperfect"];
  
  return createTextMultipleChoiceQuiz(
    "Generic Intervals To Interval Qualities",
    genericIntervals,
    intervalQualities,
    answers,
    false
  );
}