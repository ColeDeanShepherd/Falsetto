import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("Harmonic Minor 1 Seventh Chord Type", "mM7"),
    FlashCard.fromRenderFns("Harmonic Minor 2 Seventh Chord Type", "m7b5"),
    FlashCard.fromRenderFns("Harmonic Minor 3 Seventh Chord Type", "M7#5"),
    FlashCard.fromRenderFns("Harmonic Minor 4 Seventh Chord Type", "m7"),
    FlashCard.fromRenderFns("Harmonic Minor 5 Seventh Chord Type", "7"),
    FlashCard.fromRenderFns("Harmonic Minor 6 Seventh Chord Type", "M7"),
    FlashCard.fromRenderFns("Harmonic Minor 7 Seventh Chord Type", "dim7"),
  ];
}