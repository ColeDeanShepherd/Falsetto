import * as React from 'react';

import * as FlashCardUtils from "src/Components/Quizzes/Utils";
import { FlashCard } from 'src/FlashCard';
import { FlashCardGroup } from 'src/FlashCardGroup';
import { AnswerDifficulty } from 'src/StudyAlgorithm';

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
    new FlashCard("C Major", "0 sharps/flats"),
    new FlashCard("C# Major", "7 sharps"),
    new FlashCard("Db Major", "5 flats"),
    new FlashCard("D Major", "2 sharps"),
    new FlashCard("Eb Major", "3 flats"),
    new FlashCard("E Major", "4 sharps"),
    new FlashCard("F Major", "1 flat"),
    new FlashCard("F# Major", "6 sharps"),
    new FlashCard("Gb Major", "6 flats"),
    new FlashCard("G Major", "1 sharp"),
    new FlashCard("Ab Major", "4 flats"),
    new FlashCard("A Major", "3 sharps"),
    new FlashCard("Bb Major", "2 flats"),
    new FlashCard("B Major", "5 sharps"),
    new FlashCard("Cb Major", "7 flats"),

    new FlashCard("A Minor", "0 sharps/flats"),
    new FlashCard("A# Minor", "7 sharps"),
    new FlashCard("Bb Minor", "5 flats"),
    new FlashCard("B Minor", "2 sharps"),
    new FlashCard("C Minor", "3 flats"),
    new FlashCard("C# Minor", "4 sharps"),
    new FlashCard("D Minor", "1 flat"),
    new FlashCard("D# Minor", "6 sharps"),
    new FlashCard("Eb Minor", "6 flats"),
    new FlashCard("E Minor", "1 sharp"),
    new FlashCard("F Minor", "4 flats"),
    new FlashCard("F# Minor", "3 sharps"),
    new FlashCard("G Minor", "2 flats"),
    new FlashCard("G# Minor", "5 sharps"),
    new FlashCard("Ab Minor", "7 flats")
  ];
}