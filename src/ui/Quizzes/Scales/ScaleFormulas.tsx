import * as FlashCardUtils from "../Utils";
import { createFlashCardId, FlashCard, FlashCardId, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardLevel, } from "../../../FlashCardSet";
import { ScaleType, scaleTypeLevels } from '../../../lib/TheoryLib/Scale';
import { arrayContains } from '../../../lib/Core/ArrayUtils';

const flashCardSetId = "scaleFormulasMajor";

function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: any
): Array<FlashCardId> {
  return flashCards
    .filter((_, i) => i <= 7)
    .map(fc => fc.id);
}

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Scale Formulas", createFlashCards);
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.moreInfoUri = "/essential-music-theory/scales-and-modes";
  flashCardSet.createFlashCardLevels = (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => (
    scaleTypeLevels
      .map(level => new FlashCardLevel(
        level.name,
        flashCards
          .filter(fc => {
            const scaleType = fc.backSide.data as ScaleType;
            return arrayContains(level.scaleTypes, scaleType);
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
      createFlashCardId(flashCardSetId, { scale: scaleType.name }),
      new FlashCardSide(scaleType.name),
      new FlashCardSide(
        scaleType.formula.toString(),
        scaleType
      )
    ));
}

export const flashCardSet = createFlashCardSet();