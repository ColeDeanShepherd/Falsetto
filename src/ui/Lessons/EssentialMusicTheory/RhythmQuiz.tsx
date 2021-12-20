import * as FlashCardUtils from "../../Quizzes/Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";

const flashCardSetId = "esmRhythmQuiz";

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Rhythm Quiz", createFlashCards);
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardSet;
}
export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "rhyDef" }),
      "_ is the purposeful arrangement of sounds over time.", "rhythm"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "beatDef" }),
      "The _ is the repeating pulse you can feel when listening to a piece of music.", "beat"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "tempoDef" }),
      "_ is the speed of the beat, often given as beats per minute (BPM).", "tempo"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "120bpm" }),
      "120 BPM means there are _ beats per second", "two"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "rubatoDef" }),
      "_ is slightly deviating from a fixed tempo in a smooth and flowing manner.", "rubato"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "barDef" }),
      "A _ is a small section of music containing a fixed number of beats", "measure/bar"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "restDef" }),
      "A _ is a period of silence in music.", "rest"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "noteValDef" }),
      "A _ is the duration of a note.", "note value"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "num4In1" }),
      "Whole notes & rests are _ times as long as quarter notes & rests.", "four"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "timeSigDef" }),
      "The number & type of beats in a measure are specified by a _.", "time signature"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "34time" }),
      "Three-four time means there are _ _ notes in a measure.", "three, quarter"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "68time" }),
      "Six-eight time means there are _ _ notes in a measure.", "six, eighth"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "timeSigTop" }),
      "The top number in a time signature represents the _ of beats in a measure.", "number"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "timeSigBot" }),
      "The bottom number in a time signature represents the _ of beats in a measure.", "note value"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "timeSigPow2" }),
      "Time signature note values are generally powers of _.", "two"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "tripletDef" }),
      "A division of a a beat or measure into three notes is called a _.", "triplet"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "timeSigDiv3" }),
      "In general, any time signature with a # of beats divisible by 3 will have a repeating pattern of _.", "strong beat, weak beat, weak beat"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "timeSigDiv4" }),
      "In general, any time signature with a # of beats divisible by 4 (but not 3) will have a repeating pattern of: _.", "strong beat, weak beat, medium-strength beat, weak beat")
  ];
}

export const flashCardSet = createFlashCardSet();