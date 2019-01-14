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