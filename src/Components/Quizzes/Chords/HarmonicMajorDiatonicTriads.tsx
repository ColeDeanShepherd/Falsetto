import { FlashCard } from "../../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("Harmonic Major 1 Chord Type", "major"),
    FlashCard.fromRenderFns("Harmonic Major 2 Chord Type", "diminished"),
    FlashCard.fromRenderFns("Harmonic Major 3 Chord Type", "minor"),
    FlashCard.fromRenderFns("Harmonic Major 4 Chord Type", "minor"),
    FlashCard.fromRenderFns("Harmonic Major 5 Chord Type", "major"),
    FlashCard.fromRenderFns("Harmonic Major 6 Chord Type", "augmented"),
    FlashCard.fromRenderFns("Harmonic Major 7 Chord Type", "diminished"),
  ];
}