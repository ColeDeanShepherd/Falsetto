import { FlashCard } from "../../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("Major 1 Chord Type", "major"),
    FlashCard.fromRenderFns("Major 2 Chord Type", "minor"),
    FlashCard.fromRenderFns("Major 3 Chord Type", "minor"),
    FlashCard.fromRenderFns("Major 4 Chord Type", "major"),
    FlashCard.fromRenderFns("Major 5 Chord Type", "major"),
    FlashCard.fromRenderFns("Major 6 Chord Type", "minor"),
    FlashCard.fromRenderFns("Major 7 Chord Type", "diminished"),
  ];
}