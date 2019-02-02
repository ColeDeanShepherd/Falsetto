import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("Natural Minor 1 Chord Type", "minor"),
    FlashCard.fromRenderFns("Natural Minor 2 Chord Type", "diminished"),
    FlashCard.fromRenderFns("Natural Minor 3 Chord Type", "major"),
    FlashCard.fromRenderFns("Natural Minor 4 Chord Type", "minor"),
    FlashCard.fromRenderFns("Natural Minor 5 Chord Type", "minor"),
    FlashCard.fromRenderFns("Natural Minor 6 Chord Type", "major"),
    FlashCard.fromRenderFns("Natural Minor 7 Chord Type", "major"),
  ];
}