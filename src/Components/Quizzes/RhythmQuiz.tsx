import * as FlashCardUtils from "./Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from "../../FlashCardGroup";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup("Rhythm Quiz", createFlashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.containerHeight = "160px";

  return flashCardGroup;
}
export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("_ is the purposeful arrangement of sounds over time.", "rhythm"),
    FlashCard.fromRenderFns("The _ is the repeating pulse you can feel when listening to a piece of music.", "beat"),
    FlashCard.fromRenderFns("_ is the speed of the beat, often given as beats per minute (BPM).", "tempo"),
    FlashCard.fromRenderFns("120 BPM means there are _ beats per second", "two"),
    FlashCard.fromRenderFns("_ is slightly deviating from a fixed tempo in a smooth and flowing manner.", "rubato"),
    FlashCard.fromRenderFns("A _ is a small section of music containing a fixed number of beats", "measure/bar"),
    FlashCard.fromRenderFns("A _ is a period of silence in music.", "rest"),
    FlashCard.fromRenderFns("A _ is the duration of a note.", "note value"),
    FlashCard.fromRenderFns("Whole notes & rests are _ times as long as quarter notes & rests.", "four"),
    FlashCard.fromRenderFns("The number & type of beats in a measure are specified by a _.", "time signature"),
    FlashCard.fromRenderFns("Three-four time means there are _ _ notes in a measure.", "three, quarter"),
    FlashCard.fromRenderFns("Six-eight time means there are _ _ notes in a measure.", "six, eighth"),
    FlashCard.fromRenderFns("The top number in a time signature represents the _ of beats in a measure.", "number"),
    FlashCard.fromRenderFns("The bottom number in a time signature represents the _ of beats in a measure.", "note value"),
    FlashCard.fromRenderFns("Time signature note values are generally powers of _.", "two"),
    FlashCard.fromRenderFns("A division of a a beat or measure into three notes is called a _.", "triplet"),
    FlashCard.fromRenderFns("In general, any time signature with a # of beats divisible by 3 will have a repeating pattern of _.", "strong beat, weak beat, weak beat"),
    FlashCard.fromRenderFns("In general, any time signature with a # of beats divisible by 4 (but not 3) will have a repeating pattern of: _.", "strong beat, weak beat, medium-strength beat, weak beat")
  ];
}