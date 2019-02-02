import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("Major 1 Seventh Chord Type", "M7"),
    FlashCard.fromRenderFns("Major 2 Seventh Chord Type", "m7"),
    FlashCard.fromRenderFns("Major 3 Seventh Chord Type", "m7"),
    FlashCard.fromRenderFns("Major 4 Seventh Chord Type", "M7"),
    FlashCard.fromRenderFns("Major 5 Seventh Chord Type", "7"),
    FlashCard.fromRenderFns("Major 6 Seventh Chord Type", "m7"),
    FlashCard.fromRenderFns("Major 7 Seventh Chord Type", "m7b5"),
  ];
}