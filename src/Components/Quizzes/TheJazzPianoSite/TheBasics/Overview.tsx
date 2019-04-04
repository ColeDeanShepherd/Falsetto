import { FlashCard } from "../../../../FlashCard";
import { FlashCardGroup } from '../../../../FlashCardGroup';

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("A note is _.", "the smallest element of music, a pitched sound"),
    FlashCard.fromRenderFns("In Western music, there are _ notes in an octave – labeled _ through _.", "12, A, G"),
    FlashCard.fromRenderFns("Different note names which represent the same note (for example C# and D♭) are called _.", "enharmonic"),
  ];
}
export function createFlashCardGroup(): FlashCardGroup {
  return new FlashCardGroup("Overview", createFlashCards);
}