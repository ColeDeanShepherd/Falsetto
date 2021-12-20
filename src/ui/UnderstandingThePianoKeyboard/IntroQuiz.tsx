import * as FlashCardUtils from "../../ui/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardSet } from "../../FlashCardSet";

const flashCardSetId = "ptIntroQuiz";

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Introduction Quiz", createFlashCards);
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardSet;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "madeOfKeys" }),
      "Pianos are made of white & black _.", "keys"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "keysProducePitches" }),
      "Pressing a key produces a particular _.", "pitch"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "pitchDefn" }),
      "Define \"pitch\".", "the \"highness\" or \"lowness\" of a sound"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "keyPitchOrder" }),
      "Keys further to the _ produce lower pitches, and keys further to the _ produce higher pitches.", "left, right"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "numKeys" }),
      "How many keys do standard pianos have?", "88"),
  ];
}

export const flashCardSet = createFlashCardSet();