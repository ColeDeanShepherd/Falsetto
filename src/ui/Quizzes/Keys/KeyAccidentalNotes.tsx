import * as React from "react";

import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";

const flashCardSetId = "keyAccidentalNotes";

export function renderAnswerSelect(
  info: FlashCardStudySessionInfo
): JSX.Element {
  const row0 = ["none"];
  const row1 = ["F♯", "F♯, C♯", "F♯, C♯, G♯", "F♯, C♯, G♯, D♯", "F♯, C♯, G♯, D♯, A♯", "F♯, C♯, G♯, D♯, A♯, E♯", "F♯, C♯, G♯, D♯, A♯, E♯, B♯"];
  const row2 = ["B♭", "B♭, E♭", "B♭, E♭, A♭", "B♭, E♭, A♭, D♭", "B♭, E♭, A♭, D♭, G♭", "B♭, E♭, A♭, D♭, G♭, C♭", "B♭, E♭, A♭, D♭, G♭, C♭, F♭"];

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
  const flashCardSet = new FlashCardSet(flashCardSetId, "Key Accidental Notes", createFlashCards);
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.moreInfoUri = "http://myguitarpal.com/the-order-of-sharps-and-flats/";

  return flashCardSet;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "C" }),
      "C Major", "none"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "C♯" }),
      "C♯ Major", "F♯, C♯, G♯, D♯, A♯, E♯, B♯"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "D♭" }),
      "D♭ Major", "B♭, E♭, A♭, D♭, G♭"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "D" }),
      "D Major", "F♯, C♯"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "E♭" }),
      "E♭ Major", "B♭, E♭, A♭"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "E" }),
      "E Major", "F♯, C♯, G♯, D♯"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "F" }),
      "F Major", "B♭"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "F♯" }),
      "F♯ Major", "F♯, C♯, G♯, D♯, A♯, E♯"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "G♭" }),
      "G♭ Major", "B♭, E♭, A♭, D♭, G♭, C♭"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "G" }),
      "G Major", "F♯"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "A♭" }),
      "A♭ Major", "B♭, E♭, A♭, D♭"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "A" }),
      "A Major", "F♯, C♯, G♯"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "B♭" }),
      "B♭ Major", "B♭, E♭"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "B" }),
      "B Major", "F♯, C♯, G♯, D♯, A♯"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "C♭" }),
      "C♭ Major", "B♭, E♭, A♭, D♭, G♭, C♭, F♭"),

    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "Am" }),
      "A Minor", "none"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "A♯m" }),
      "A♯ Minor", "F♯, C♯, G♯, D♯, A♯, E♯, B♯"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "B♭m" }),
      "B♭ Minor", "B♭, E♭, A♭, D♭, G♭"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "Bm" }),
      "B Minor", "F♯, C♯"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "Cm" }),
      "C Minor", "B♭, E♭, A♭"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "C♯m" }),
      "C♯ Minor", "F♯, C♯, G♯, D♯"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "Dm" }),
      "D Minor", "B♭"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "D♯m" }),
      "D♯ Minor", "F♯, C♯, G♯, D♯, A♯, E♯"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "E♭m" }),
      "E♭ Minor", "B♭, E♭, A♭, D♭, G♭, C♭"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "Em" }),
      "E Minor", "F♯"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "Fm" }),
      "F Minor", "B♭, E♭, A♭, D♭"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "F♯m" }),
      "F♯ Minor", "F♯, C♯, G♯"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "Gm" }),
      "G Minor", "B♭, E♭"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "G♯m" }),
      "G♯ Minor", "F♯, C♯, G♯, D♯, A♯"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, key: "A♭m" }),
      "A♭ Minor", "B♭, E♭, A♭, D♭, G♭, C♭, F♭")
  ];
}

export const flashCardSet = createFlashCardSet();