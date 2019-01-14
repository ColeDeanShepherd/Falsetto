import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("Harmonic Major 1 Chord Type", "major"),
    new FlashCard("Harmonic Major 2 Chord Type", "diminished"),
    new FlashCard("Harmonic Major 3 Chord Type", "minor"),
    new FlashCard("Harmonic Major 4 Chord Type", "minor"),
    new FlashCard("Harmonic Major 5 Chord Type", "major"),
    new FlashCard("Harmonic Major 6 Chord Type", "augmented"),
    new FlashCard("Harmonic Major 7 Chord Type", "diminished"),
  ];
}