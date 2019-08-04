import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";

const flashCardSetId = "diatonic7Chords";

export function createFlashCardGroup(): FlashCardSet {
  const flashCardGroup = new FlashCardSet(flashCardSetId, "Diatonic Seventh Chords", createFlashCards);
  flashCardGroup.enableInvertFlashCards = false;
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(0, 13);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/the-basics/keys/";
  flashCardGroup.containerHeight = "80px";

  return flashCardGroup;
}
export function createFlashCards(): FlashCard[] {
  return new Array<FlashCard>()
    .concat([
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "maj1" }),
        "Major 1 Seventh Chord Type", "M7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "maj2" }),
        "Major 2 Seventh Chord Type", "m7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "maj3" }),
        "Major 3 Seventh Chord Type", "m7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "maj4" }),
        "Major 4 Seventh Chord Type", "M7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "maj5" }),
        "Major 5 Seventh Chord Type", "7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "maj6" }),
        "Major 6 Seventh Chord Type", "m7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "maj7" }),
        "Major 7 Seventh Chord Type", "m7b5"),
    ])
    .concat([
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "m1" }),
        "Natural Minor 1 Seventh Chord Type", "m7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "m2" }),
        "Natural Minor 2 Seventh Chord Type", "m7b5"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "m3" }),
        "Natural Minor 3 Seventh Chord Type", "M7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "m4" }),
        "Natural Minor 4 Seventh Chord Type", "m7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "m5" }),
        "Natural Minor 5 Seventh Chord Type", "m7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "m6" }),
        "Natural Minor 6 Seventh Chord Type", "M7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "m7" }),
        "Natural Minor 7 Seventh Chord Type", "7"),
    ])
    .concat([
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "mm1" }),
        "Melodic Minor 1 Seventh Chord Type", "mM7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "mm2" }),
        "Melodic Minor 2 Seventh Chord Type", "m7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "mm3" }),
        "Melodic Minor 3 Seventh Chord Type", "M7#5"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "mm4" }),
        "Melodic Minor 4 Seventh Chord Type", "7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "mm5" }),
        "Melodic Minor 5 Seventh Chord Type", "7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "mm6" }),
        "Melodic Minor 6 Seventh Chord Type", "m7b5"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "mm7" }),
        "Melodic Minor 7 Seventh Chord Type", "m7b5"),
    ])
    .concat([
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "hm1" }),
        "Harmonic Minor 1 Seventh Chord Type", "mM7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "hm2" }),
        "Harmonic Minor 2 Seventh Chord Type", "m7b5"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "hm3" }),
        "Harmonic Minor 3 Seventh Chord Type", "M7#5"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "hm4" }),
        "Harmonic Minor 4 Seventh Chord Type", "m7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "hm5" }),
        "Harmonic Minor 5 Seventh Chord Type", "7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "hm6" }),
        "Harmonic Minor 6 Seventh Chord Type", "M7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "hm7" }),
        "Harmonic Minor 7 Seventh Chord Type", "dim7"),
    ])
    .concat([
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "hmaj1" }),
        "Harmonic Major 1 Seventh Chord Type", "M7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "hmaj2" }),
        "Harmonic Major 2 Seventh Chord Type", "m7b5"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "hmaj3" }),
        "Harmonic Major 3 Seventh Chord Type", "m7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "hmaj4" }),
        "Harmonic Major 4 Seventh Chord Type", "mM7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "hmaj5" }),
        "Harmonic Major 5 Seventh Chord Type", "7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "hmaj6" }),
        "Harmonic Major 6 Seventh Chord Type", "M7#5"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "hmaj7" }),
        "Harmonic Major 7 Seventh Chord Type", "dim7"),
    ])
    .concat([
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "dhmaj1" }),
        "Double Harmonic Major 1 Seventh Chord Type", "M7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "dhmaj2" }),
        "Double Harmonic Major 2 Seventh Chord Type", "M7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "dhmaj3" }),
        "Double Harmonic Major 3 Seventh Chord Type", "mbb7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "dhmaj4" }),
        "Double Harmonic Major 4 Seventh Chord Type", "mM7"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "dhmaj5" }),
        "Double Harmonic Major 5 Seventh Chord Type", "7b5"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "dhmaj6" }),
        "Double Harmonic Major 6 Seventh Chord Type", "M7#5"),
      FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, id: "dhmaj7" }),
        "Double Harmonic Major 7 Seventh Chord Type", "7"),
    ]);
}