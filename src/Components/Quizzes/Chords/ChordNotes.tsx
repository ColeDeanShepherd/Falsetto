import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";
import { ChordType } from '../../../Chord';

const flashCardSetId = "chordFormulasMajorScale";

export function createFlashCardGroup(): FlashCardSet {
  const flashCardGroup = new FlashCardSet(flashCardSetId, "Chord Notes", createFlashCards);
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(1, 16);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/jazz-chords/extensions-alterations/";
  flashCardGroup.containerHeight = "80px";

  return flashCardGroup;
}

export function createFlashCard(chordType: ChordType): FlashCard {
  const deserializedId = { "set": flashCardSetId, name: chordType.symbols[0] };
  const id = JSON.stringify(deserializedId);
  return FlashCard.fromRenderFns(id, "power", "1 5");
}
export function createFlashCards(): FlashCard[] {
  return ChordType.All.map(createFlashCard);
}