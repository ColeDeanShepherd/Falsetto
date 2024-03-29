import * as React from "react";

import * as FlashCardUtils from "../Utils";
import { createFlashCardId, FlashCard } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";

const flashCardSetId = "keyAccidentalCounts";

export function renderAnswerSelect(
  info: FlashCardStudySessionInfo
): JSX.Element {
  const row0 = ["0 sharps/flats"];
  const row1 = ["1 sharp", "2 sharps", "3 sharps", "4 sharps", "5 sharps", "6 sharps", "7 sharps"];
  const row2 = ["1 flat", "2 flats", "3 flats", "4 flats", "5 flats", "6 flats", "7 flats"];

  return (
    <div>
      {FlashCardUtils.renderStringAnswerSelectInternal(
        `${info.currentFlashCardId}.0`, row0, info
      )}
      {FlashCardUtils.renderStringAnswerSelectInternal(
        `${info.currentFlashCardId}.1`, row1, info
      )}
      {FlashCardUtils.renderStringAnswerSelectInternal(
        `${info.currentFlashCardId}.2`, row2, info
      )}
    </div>
  );
}

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Key Accidental Counts", createFlashCards);
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.moreInfoUri = "https://www.musicnotes.com/now/tips/circle-of-fifths-guide/";

  return flashCardSet;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "C" }),
      "C Major", "0 sharps/flats"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "C♯" }),
      "C♯ Major", "7 sharps"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "D♭" }),
      "D♭ Major", "5 flats"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "D" }),
      "D Major", "2 sharps"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "E♭" }),
      "E♭ Major", "3 flats"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "E" }),
      "E Major", "4 sharps"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "F" }),
      "F Major", "1 flat"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "F♯" }),
      "F♯ Major", "6 sharps"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "G♭" }),
      "G♭ Major", "6 flats"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "G" }),
      "G Major", "1 sharp"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "A♭" }),
      "A♭ Major", "4 flats"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "A" }),
      "A Major", "3 sharps"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "B♭" }),
      "B♭ Major", "2 flats"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "B" }),
      "B Major", "5 sharps"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "C♭" }),
      "C♭ Major", "7 flats"),

    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "Am" }),
      "A Minor", "0 sharps/flats"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "A♯m" }),
      "A♯ Minor", "7 sharps"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "B♭m" }),
      "B♭ Minor", "5 flats"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "Bm" }),
      "B Minor", "2 sharps"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "Cm" }),
      "C Minor", "3 flats"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "C♯m" }),
      "C♯ Minor", "4 sharps"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "Dm" }),
      "D Minor", "1 flat"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "D♯m" }),
      "D♯ Minor", "6 sharps"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "E♭m" }),
      "E♭ Minor", "6 flats"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "Em" }),
      "E Minor", "1 sharp"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "Fm" }),
      "F Minor", "4 flats"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "F♯m" }),
      "F♯ Minor", "3 sharps"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "Gm" }),
      "G Minor", "2 flats"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "G♯m" }),
      "G♯ Minor", "5 sharps"),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { key: "A♭m" }),
      "A♭ Minor", "7 flats")
  ];
}

export const flashCardSet = createFlashCardSet();