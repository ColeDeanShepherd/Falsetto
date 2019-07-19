import { FlashCard } from "../../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("Melodic Minor 1 Chord Type", "minor"),
    FlashCard.fromRenderFns("Melodic Minor 2 Chord Type", "minor"),
    FlashCard.fromRenderFns("Melodic Minor 3 Chord Type", "augmented"),
    FlashCard.fromRenderFns("Melodic Minor 4 Chord Type", "major"),
    FlashCard.fromRenderFns("Melodic Minor 5 Chord Type", "major"),
    FlashCard.fromRenderFns("Melodic Minor 6 Chord Type", "diminished"),
    FlashCard.fromRenderFns("Melodic Minor 7 Chord Type", "diminished"),
  ];
}