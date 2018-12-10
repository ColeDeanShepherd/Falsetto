import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("Harmonic Minor 1 Chord Type", "minor"),
    new FlashCard("Harmonic Minor 2 Chord Type", "diminished"),
    new FlashCard("Harmonic Minor 3 Chord Type", "augmented"),
    new FlashCard("Harmonic Minor 4 Chord Type", "minor"),
    new FlashCard("Harmonic Minor 5 Chord Type", "major"),
    new FlashCard("Harmonic Minor 6 Chord Type", "major"),
    new FlashCard("Harmonic Minor 7 Chord Type", "diminished"),
  ];
}
export function createQuiz(): Quiz {
  const chordRoots = ["1", "2", "3", "4", "5", "6", "7"];
  const chordTypes = [
    "minor",
    "diminished",
    "augmented",
    "minor",
    "major",
    "major",
    "diminished"
  ];
  const answers = [
    "major",
    "minor",
    "diminished",
    "augmented"
  ];
  
  return createTextMultipleChoiceQuiz(
    "Harmonic Minor Diatonic Triads",
    chordRoots,
    chordTypes,
    answers,
    false
  );
}