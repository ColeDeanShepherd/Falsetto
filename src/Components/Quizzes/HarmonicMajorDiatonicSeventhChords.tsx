import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("Harmonic Major 1 Seventh Chord Type", "M7"),
    FlashCard.fromRenderFns("Harmonic Major 2 Seventh Chord Type", "m7b5"),
    FlashCard.fromRenderFns("Harmonic Major 3 Seventh Chord Type", "m7"),
    FlashCard.fromRenderFns("Harmonic Major 4 Seventh Chord Type", "mM7"),
    FlashCard.fromRenderFns("Harmonic Major 5 Seventh Chord Type", "7"),
    FlashCard.fromRenderFns("Harmonic Major 6 Seventh Chord Type", "M7#5"),
    FlashCard.fromRenderFns("Harmonic Major 7 Seventh Chord Type", "dim7"),
  ];
}