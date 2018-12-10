import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("Melodic Minor 1 Chord Type", "minor"),
    new FlashCard("Melodic Minor 2 Chord Type", "minor"),
    new FlashCard("Melodic Minor 3 Chord Type", "augmented"),
    new FlashCard("Melodic Minor 4 Chord Type", "major"),
    new FlashCard("Melodic Minor 5 Chord Type", "major"),
    new FlashCard("Melodic Minor 6 Chord Type", "diminished"),
    new FlashCard("Melodic Minor 7 Chord Type", "diminished"),
  ];
}
export function createQuiz(): Quiz {
  const chordRoots = ["1", "2", "3", "4", "5", "6", "7"];
  const chordTypes = [
    "minor",
    "minor",
    "augmented",
    "major",
    "major",
    "diminished",
    "diminished"
  ];
  const answers = [
    "major",
    "minor",
    "diminished",
    "augmented"
  ];
  
  return createTextMultipleChoiceQuiz(
    "Melodic Minor Diatonic Triads",
    chordRoots,
    chordTypes,
    answers,
    false
  );
}