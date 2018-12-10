import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("Major 1 Chord Type", "major"),
    new FlashCard("Major 2 Chord Type", "minor"),
    new FlashCard("Major 3 Chord Type", "minor"),
    new FlashCard("Major 4 Chord Type", "major"),
    new FlashCard("Major 5 Chord Type", "major"),
    new FlashCard("Major 6 Chord Type", "minor"),
    new FlashCard("Major 7 Chord Type", "diminished"),
  ];
}
export function createQuiz(): Quiz {
  const chordRoots = ["1", "2", "3", "4", "5", "6", "7"];
  const chordTypes = [
    "major",
    "minor",
    "minor",
    "major",
    "major",
    "minor",
    "diminished"
  ];
  const answers = [
    "major",
    "minor",
    "diminished",
    "augmented"
  ];
  
  return createTextMultipleChoiceQuiz(
    "Major Diatonic Triads",
    chordRoots,
    chordTypes,
    answers,
    false
  );
}