import * as FlashCardUtils from "../Utils";
import { FlashCard, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, } from "../../../FlashCardSet";
import { ScaleType } from '../../../Scale';

const flashCardSetId = "scaleFormulasMajor";

function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: any
): Array<FlashCardId> {
  return flashCards
    .filter((_, i) => i <= 7)
    .map(fc => fc.id);
}

export function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Scale Formulas", createFlashCards);
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.moreInfoUri = "/essential-music-theory/scales-and-modes";
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