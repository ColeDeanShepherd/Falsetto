import * as FlashCardUtils from "../Utils";
import { FlashCard, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, } from "../../../FlashCardSet";
import { ChordType } from '../../../Chord';

const flashCardSetId = "chordFormulasRelativeToMajorScale";

function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: any
): Array<FlashCardId> {
  return flashCards
    .filter((_, i) => i <= 16)
    .map(fc => fc.id);
}
export function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Chord Notes", createFlashCards);
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.moreInfoUri = "/essential-music-theory/chords";
  flashCardSet.containerHeight = "80px";

  return flashCardSet;
}

export function createFlashCards(): FlashCard[] {
  return ChordType.All
    .map(chordType => {
      const deserializedId = { "set": flashCardSetId, chord: chordType.symbols[0] };
      const id = JSON.stringify(deserializedId);
      return FlashCard.fromRenderFns(id, chordType.name, chordType.formula.toString());
    });
} 