import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("Natural Minor 1 Seventh Chord Type", "m7"),
    FlashCard.fromRenderFns("Natural Minor 2 Seventh Chord Type", "m7b5"),
    FlashCard.fromRenderFns("Natural Minor 3 Seventh Chord Type", "M7"),
    FlashCard.fromRenderFns("Natural Minor 4 Seventh Chord Type", "m7"),
    FlashCard.fromRenderFns("Natural Minor 5 Seventh Chord Type", "m7"),
    FlashCard.fromRenderFns("Natural Minor 6 Seventh Chord Type", "M7"),
    FlashCard.fromRenderFns("Natural Minor 7 Seventh Chord Type", "7"),
  ];
}