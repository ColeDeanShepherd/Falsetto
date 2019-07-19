import { FlashCard } from "../../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("Harmonic Minor 1 Chord Type", "minor"),
    FlashCard.fromRenderFns("Harmonic Minor 2 Chord Type", "diminished"),
    FlashCard.fromRenderFns("Harmonic Minor 3 Chord Type", "augmented"),
    FlashCard.fromRenderFns("Harmonic Minor 4 Chord Type", "minor"),
    FlashCard.fromRenderFns("Harmonic Minor 5 Chord Type", "major"),
    FlashCard.fromRenderFns("Harmonic Minor 6 Chord Type", "major"),
    FlashCard.fromRenderFns("Harmonic Minor 7 Chord Type", "diminished"),
  ];
}