import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("Double Harmonic Major 1 Chord Type", "major"),
    FlashCard.fromRenderFns("Double Harmonic Major 2 Chord Type", "major"),
    FlashCard.fromRenderFns("Double Harmonic Major 3 Chord Type", "minor"),
    FlashCard.fromRenderFns("Double Harmonic Major 4 Chord Type", "minor"),
    FlashCard.fromRenderFns("Double Harmonic Major 5 Chord Type", "major b5"),
    FlashCard.fromRenderFns("Double Harmonic Major 6 Chord Type", "augmented"),
    FlashCard.fromRenderFns("Double Harmonic Major 7 Chord Type", "sus2 b5"),
  ];
}