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