import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";
import { ScaleType } from '../../../Scale';

const flashCardSetId = "scaleFormulasMajor";

export function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Scale Formulas", createFlashCards);
  flashCardSet.initialSelectedFlashCardIds = Utils.range(0, 8);
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/the-basics/modes";
  flashCardSet.containerHeight = "80px";

  return flashCardSet;
}

export function createFlashCards(): FlashCard[] {
  return ScaleType.All
    .map(scaleType => FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: scaleType.name }),
      scaleType.name,
      scaleType.formula.toString()
    ));
}