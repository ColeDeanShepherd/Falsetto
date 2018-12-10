import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("Melodic Minor 1 Seventh Chord Type", "mM7"),
    new FlashCard("Melodic Minor 2 Seventh Chord Type", "m7"),
    new FlashCard("Melodic Minor 3 Seventh Chord Type", "M7#5"),
    new FlashCard("Melodic Minor 4 Seventh Chord Type", "7"),
    new FlashCard("Melodic Minor 5 Seventh Chord Type", "7"),
    new FlashCard("Melodic Minor 6 Seventh Chord Type", "m7b5"),
    new FlashCard("Melodic Minor 7 Seventh Chord Type", "m7b5"),
  ];
}
export function createQuiz(): Quiz {
  const chordRoots = ["1", "2", "3", "4", "5", "6", "7"];
  const chordTypes = [
    "mM7",
    "m7",
    "M7#5",
    "7",
    "7",
    "m7b5",
    "m7b5"
  ];
  const answers = [
    "7",
    "M7",
    "m7",
    "m7b5",
    "dim7",
    "mM7",
    "M7#5"
  ];

  return createTextMultipleChoiceQuiz(
    "Melodic Minor Diatonic Seventh Chords",
    chordRoots,
    chordTypes,
    answers,
    false
  );
}