import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";
import { ChordType } from '../../../Chord';

const flashCardSetId = "chordFormulasRelativeToMajorScale";

export function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Chord Notes", createFlashCards);
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds Utils.range(1, 16);
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/jazz-chords/extensions-alterations/";
  flashCardSet.containerHeight = "80px";

  return flashCardSet;
}

export function createFlashCard(chordType: ChordType): FlashCard {
  const deserializedId = { "set": flashCardSetId, chord: chordType.symbols[0] };
  const id = JSON.stringify(deserializedId);
  return FlashCard.fromRenderFns(id, "power", "1 5");
}
export function createFlashCards(): FlashCard[] {
  return ChordType.All.map(createFlashCard);
}