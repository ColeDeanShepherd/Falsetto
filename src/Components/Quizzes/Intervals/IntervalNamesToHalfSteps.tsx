import * as Utils from "../../../lib/Core/Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardLevel } from "../../../FlashCardSet";
import { createIntervalLevels } from '../../../lib/TheoryLib/Interval';
import { arrayContains } from '../../../lib/Core/ArrayUtils';

const flashCardSetId = "intervalHalfSteps";

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Interval Semitones", createFlashCards);
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.moreInfoUri = "/essential-music-theory/intervals";
  flashCardSet.containerHeight = "80px";
  flashCardSet.createFlashCardLevels = (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => (
    createIntervalLevels(true, false)
      .map(level => new FlashCardLevel(
        level.name,
        flashCards
          .filter(fc => {
            const intervalString = fc.backSide.data as string;
            return arrayContains(level.intervalStrings, intervalString);
          })
          .map(fc => fc.id),
        (curConfigData: any) => null
      ))
  );

  return flashCardSet;
}

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard(
      JSON.stringify({ set: flashCardSetId, interval: "P1" }),
      new FlashCardSide("P1"),
      new FlashCardSide("0", "P1")
    ),
    new FlashCard(
      JSON.stringify({ set: flashCardSetId, interval: "m2" }),
      new FlashCardSide("m2"),
      new FlashCardSide("1", "m2")
    ),
    new FlashCard(
      JSON.stringify({ set: flashCardSetId, interval: "M2" }),
      new FlashCardSide("M2"),
      new FlashCardSide("2", "M2")
    ),
    new FlashCard(
      JSON.stringify({ set: flashCardSetId, interval: "m3" }),
      new FlashCardSide("m3"),
      new FlashCardSide("3", "m3")
    ),
    new FlashCard(
      JSON.stringify({ set: flashCardSetId, interval: "M3" }),
      new FlashCardSide("M3"),
      new FlashCardSide("4", "M3")
    ),
    new FlashCard(
      JSON.stringify({ set: flashCardSetId, interval: "P4" }),
      new FlashCardSide("P4"),
      new FlashCardSide("5", "P4")
    ),
    new FlashCard(
      JSON.stringify({ set: flashCardSetId, interval: "A4/d5" }),
      new FlashCardSide("A4/d5"),
      new FlashCardSide("6", "A4/d5")
    ),
    new FlashCard(
      JSON.stringify({ set: flashCardSetId, interval: "P5" }),
      new FlashCardSide("P5"),
      new FlashCardSide("7", "P5")
    ),
    new FlashCard(
      JSON.stringify({ set: flashCardSetId, interval: "m6" }),
      new FlashCardSide("m6"),
      new FlashCardSide("8", "m6")
    ),
    new FlashCard(
      JSON.stringify({ set: flashCardSetId, interval: "M6" }),
      new FlashCardSide("M6"),
      new FlashCardSide("9", "M6")
    ),
    new FlashCard(
      JSON.stringify({ set: flashCardSetId, interval: "m7" }),
      new FlashCardSide("m7"),
      new FlashCardSide("10", "m7")
    ),
    new FlashCard(
      JSON.stringify({ set: flashCardSetId, interval: "M7" }),
      new FlashCardSide("M7"),
      new FlashCardSide("11", "M7")
    ),
    new FlashCard(
      JSON.stringify({ set: flashCardSetId, interval: "P8" }),
      new FlashCardSide("P8"),
      new FlashCardSide("12", "P8")
    )
  ];
}

export const flashCardSet = createFlashCardSet();