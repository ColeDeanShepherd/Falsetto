import * as React from "react";

import * as FlashCardUtils from "../Components/Quizzes/Utils";
import { FlashCard } from "../FlashCard";
import { FlashCardSet } from "../FlashCardSet";
import { renderUserDeterminedCorrectnessAnswerSelect } from '../Components/Quizzes/Utils';
import { ScaleFormulaAnswerSelect } from "../Components/Utils/ScaleFormulaAnswerSelect";
import { MajorScaleRelativeScaleFormulaAnswerSelect } from '../Components/Utils/MajorScaleRelativeScaleFormulaAnswerSelect';

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
      "a set of notes with a designated root note",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "rootNoteDef" }),
      "What is the root note of a scale?",
      "the note that generally \"sounds like home\" in the scale",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "formulaRDef" }),
      "What does \"R\" mean in scale formulas?",
      "root note",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "formulaHDef" }),
      "What does \"H\" mean in scale formulas?",
      "the next note in the scale is a half step higher than the previous note",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "formulaWDef" }),
      "What does \"W\" mean in scale formulas?",
      "the next note in the scale is a whole step higher than the previous note",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "halfStepDef" }),
      "How many keys does a half step span?",
      "one",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "wholeStepDef" }),
      "How many keys does a whole step span?",
      "two",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "scaleUnordered" }),
      "Do scale notes need to be played in the same order as they are defined in scale formulas?",
      "no",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "majorScaleFormula" }),
      "What is the formula for major scales?",
      "R W W H W W W",
      info => <ScaleFormulaAnswerSelect info={info} correctAnswer={["R", "W", "W", "H", "W", "W", "W"]} />
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "natMinorScaleFormula" }),
      "What is the major-scale-relative formula for natural minor scales?",
      "1 2 3♭ 4 5 6♭ 7♭",
      info => <MajorScaleRelativeScaleFormulaAnswerSelect info={info} correctAnswer={[0, 0, -1, 0, 0, -1, -1]} />
    ),
  ];
}

export const flashCardSet = createFlashCardSet();