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