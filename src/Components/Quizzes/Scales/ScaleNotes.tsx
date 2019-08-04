import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";
import { Scale, ScaleType } from '../../../Scale';

const flashCardSetId = "scaleFormulasMajor";

export function createFlashCardGroup(): FlashCardSet {
  const flashCardGroup = new FlashCardSet(flashCardSetId, "Scale Notes", createFlashCards);
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(0, 8);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/the-basics/modes";
  flashCardGroup.containerHeight = "80px";

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return ScaleType.All
    .map(scaleType => FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, scale: scaleType.name }),
      scaleType.name,
      scaleType.formula.toString()
    ));
}