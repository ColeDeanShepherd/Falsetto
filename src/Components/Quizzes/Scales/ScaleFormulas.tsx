import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard, FlashCardId, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardLevel, } from "../../../FlashCardSet";
import { ScaleType, ScaleTypeLevels } from '../../../Scale';

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
  flashCardSet.createFlashCardLevels = (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => (
    ScaleTypeLevels
      .map(level => new FlashCardLevel(
        level.name,
        flashCards
          .filter(fc => {
            const scaleType = fc.backSide.data as ScaleType;
            return Utils.arrayContains(level.scaleTypes, scaleType);
          })
          .map(fc => fc.id),
        (curConfigData: any) => null
      ))
  );

  return flashCardSet;
}

export function createFlashCards(): FlashCard[] {
  return ScaleType.All
    .map(scaleType => new FlashCard(
      JSON.stringify({ set: flashCardSetId, scale: scaleType.name }),
      new FlashCardSide(scaleType.name),
      new FlashCardSide(
        scaleType.formula.toString(),
        scaleType
      )
    ));
}