import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("Natural Minor 1 Chord Type", "minor"),
    new FlashCard("Natural Minor 2 Chord Type", "diminished"),
    new FlashCard("Natural Minor 3 Chord Type", "major"),
    new FlashCard("Natural Minor 4 Chord Type", "minor"),
    new FlashCard("Natural Minor 5 Chord Type", "minor"),
    new FlashCard("Natural Minor 6 Chord Type", "major"),
    new FlashCard("Natural Minor 7 Chord Type", "major"),
  ];
}
export function createQuiz(): Quiz {
  const chordRoots = ["1", "2", "3", "4", "5", "6", "7"];
  const chordTypes = [
    "minor",
    "diminished",
    "major",
    "minor",
    "minor",
    "major",
    "major"
  ];
  const answers = [
    "major",
    "minor",
    "diminished",
    "augmented"
  ];

  return createTextMultipleChoiceQuiz(
    "Natural Minor Diatonic Triads",
    chordRoots,
    chordTypes,
    answers,
    false
  );
}