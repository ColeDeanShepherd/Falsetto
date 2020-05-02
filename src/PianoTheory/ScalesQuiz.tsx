import * as FlashCardUtils from "../Components/Quizzes/Utils";
import { FlashCard } from "../FlashCard";
import { FlashCardSet } from "../FlashCardSet";

const flashCardSetId = "ptScalesQuiz";

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Scales Quiz", createFlashCards);
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.containerHeight = "160px";

  return flashCardSet;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "scaleDef" }),
      "What is a scale?",
      "a set of notes with a designated root note"
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "rootNoteDef" }),
      "What is the root note of a scale?",
      "the note that generally \"sounds like home\" in the scale"
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "formulaRDef" }),
      "What does \"R\" mean in scale formulas?",
      "root note"
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "formulaHDef" }),
      "What does \"H\" mean in scale formulas?",
      "the next note in the scale is a half step higher than the previous note"
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "formulaWDef" }),
      "What does \"W\" mean in scale formulas?",
      "the next note in the scale is a whole step higher than the previous note"
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "halfStepDef" }),
      "How many keys does a half step span?",
      "one"
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "wholeStepDef" }),
      "How many keys does a whole step span?",
      "two"
    ),
  ];
}

export const flashCardSet = createFlashCardSet();