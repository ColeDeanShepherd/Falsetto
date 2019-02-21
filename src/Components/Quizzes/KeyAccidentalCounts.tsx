import * as React from "react";

import * as FlashCardUtils from "../../Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from "../../FlashCardGroup";
import { AnswerDifficulty } from "../../StudyAlgorithm";

export function renderAnswerSelect(
  flashCards: FlashCard[],
  enabledFlashCardIndices: number[],
  areFlashCardsInverted: boolean,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
): JSX.Element {
  const row0 = ["0 sharps/flats"];
  const row1 = ["1 sharp", "2 sharps", "3 sharps", "4 sharps", "5 sharps", "6 sharps", "7 sharps"];
  const row2 = ["1 flat", "2 flats", "3 flats", "4 flats", "5 flats", "6 flats", "7 flats"];

  return (
    <div>
      {FlashCardUtils.renderStringAnswerSelect(row0, flashCards, enabledFlashCardIndices, areFlashCardsInverted, flashCard, onAnswer)}
      {FlashCardUtils.renderStringAnswerSelect(row1, flashCards, enabledFlashCardIndices, areFlashCardsInverted, flashCard, onAnswer)}
      {FlashCardUtils.renderStringAnswerSelect(row2, flashCards, enabledFlashCardIndices, areFlashCardsInverted, flashCard, onAnswer)}
    </div>
  );
}

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Key Accidental Counts", flashCards);
  flashCardGroup.renderAnswerSelect = renderAnswerSelect;
  flashCardGroup.moreInfoUri = "https://www.musicnotes.com/now/tips/circle-of-fifths-guide/";

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("C Major", "0 sharps/flats"),
    FlashCard.fromRenderFns("C# Major", "7 sharps"),
    FlashCard.fromRenderFns("Db Major", "5 flats"),
    FlashCard.fromRenderFns("D Major", "2 sharps"),
    FlashCard.fromRenderFns("Eb Major", "3 flats"),
    FlashCard.fromRenderFns("E Major", "4 sharps"),
    FlashCard.fromRenderFns("F Major", "1 flat"),
    FlashCard.fromRenderFns("F# Major", "6 sharps"),
    FlashCard.fromRenderFns("Gb Major", "6 flats"),
    FlashCard.fromRenderFns("G Major", "1 sharp"),
    FlashCard.fromRenderFns("Ab Major", "4 flats"),
    FlashCard.fromRenderFns("A Major", "3 sharps"),
    FlashCard.fromRenderFns("Bb Major", "2 flats"),
    FlashCard.fromRenderFns("B Major", "5 sharps"),
    FlashCard.fromRenderFns("Cb Major", "7 flats"),

    FlashCard.fromRenderFns("A Minor", "0 sharps/flats"),
    FlashCard.fromRenderFns("A# Minor", "7 sharps"),
    FlashCard.fromRenderFns("Bb Minor", "5 flats"),
    FlashCard.fromRenderFns("B Minor", "2 sharps"),
    FlashCard.fromRenderFns("C Minor", "3 flats"),
    FlashCard.fromRenderFns("C# Minor", "4 sharps"),
    FlashCard.fromRenderFns("D Minor", "1 flat"),
    FlashCard.fromRenderFns("D# Minor", "6 sharps"),
    FlashCard.fromRenderFns("Eb Minor", "6 flats"),
    FlashCard.fromRenderFns("E Minor", "1 sharp"),
    FlashCard.fromRenderFns("F Minor", "4 flats"),
    FlashCard.fromRenderFns("F# Minor", "3 sharps"),
    FlashCard.fromRenderFns("G Minor", "2 flats"),
    FlashCard.fromRenderFns("G# Minor", "5 sharps"),
    FlashCard.fromRenderFns("Ab Minor", "7 flats")
  ];
}