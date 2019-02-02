import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from 'src/FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Miscellaneous", flashCards);

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("suspended chords are", "chords where the 3rd has been replaced by a 2nd or (usually) a 4th"),
    FlashCard.fromRenderFns("In Jazz, sus chords act as substitutes for _ or _ chords and are usually extended to _ or _ chords.", "ii or V7 chords, 9sus or ♭9sus chords"),
    FlashCard.fromRenderFns("sus chords can be useful becase a _ is an unavailable tension over the regular _ chord, but it is a chord tone over the _ chord", "♮11, V7, V7sus"),

    
    FlashCard.fromRenderFns("", ""),
    FlashCard.fromRenderFns("", ""),
    FlashCard.fromRenderFns("", "")
    //FlashCard.fromRenderFns("", "")
  ];
}