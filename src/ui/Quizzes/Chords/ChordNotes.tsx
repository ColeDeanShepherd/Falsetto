import * as FlashCardUtils from "../Utils";
import { createFlashCardId, FlashCard, FlashCardId, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardLevel, } from "../../../FlashCardSet";
import { chordTypeLevels } from '../../../lib/TheoryLib/ChordType';
import { ChordType } from "../../../lib/TheoryLib/ChordType";
import { arrayContains } from '../../../lib/Core/ArrayUtils';

const flashCardSetId = "chordFormulasRelativeToMajorScale";

function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: any
): Array<FlashCardId> {
  return flashCards
    .filter((_, i) => i <= 16)
    .map(fc => fc.id);
}
function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Chord Notes", createFlashCards);
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.moreInfoUri = "/essential-music-theory/chords";
  flashCardSet.createFlashCardLevels = (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => (
    chordTypeLevels
      .map(ctl =>
        new FlashCardLevel(
          ctl.name,
          flashCards
            .filter(fc => arrayContains(ctl.chordTypes, fc.backSide.data as ChordType))
            .map(fc => fc.id),
          (curConfigData: any) => null
        )
      )
  );

  return flashCardSet;
}

export function createFlashCards(): FlashCard[] {
  return ChordType.All
    .map(chordType => {
      return new FlashCard(
        createFlashCardId(flashCardSetId, { chord: chordType.symbols[0] }),
        new FlashCardSide(chordType.name),
        new FlashCardSide(
          chordType.formula.toString(),
          chordType
        )
      );
    });
}

export const flashCardSet = createFlashCardSet();