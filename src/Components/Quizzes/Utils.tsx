import * as React from 'react';
import { Button } from '@material-ui/core';

import * as Utils from "src/Utils";
import { FlashCard } from 'src/FlashCard';
import { renderFlashCardSide } from "src/Components/FlashCard";
import { AnswerDifficulty } from 'src/StudyAlgorithm';

export function renderNoteAnswerSelect(
  flashCards: FlashCard[],
  enabledFlashCardIndices: number[],
  areFlashCardsInverted: boolean,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
): JSX.Element {
  const naturalNotes = ["A", "B", "C", "D", "E", "F", "G"];
  const accidentalNotes = ["A#/Bb", "C#/Db", "D#/Eb", "F#/Gb", "G#/Ab"];
  return (
    <div>
      {renderStringAnswerSelect(accidentalNotes, flashCards, enabledFlashCardIndices, areFlashCardsInverted, flashCard, onAnswer)}
      {renderStringAnswerSelect(naturalNotes, flashCards, enabledFlashCardIndices, areFlashCardsInverted, flashCard, onAnswer)}
    </div>
  );
}
export function renderStringAnswerSelect(
  answers: string[],
  flashCards: FlashCard[],
  enabledFlashCardIndices: number[],
  areFlashCardsInverted: boolean,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
): JSX.Element {
  const correctAnswer = flashCard.backSide.renderFn as string;

  return (
    <div>
      {answers.map(a => (
        <Button
          key={a}
          variant="contained"
          onClick={_ => onAnswer((a === correctAnswer) ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect)}
          style={{ textTransform: "none" }}
        >
          {a}
        </Button>))}
    </div>
  );
}
export function renderDistinctFlashCardSideAnswerSelect(
  flashCards: FlashCard[],
  enabledFlashCardIndices: number[],
  areFlashCardsInverted: boolean,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
) {
  const distinctFlashCardSides = Utils.uniq(
    flashCards
      .filter((_, i) => Utils.arrayContains(enabledFlashCardIndices, i))
      .map(fc => fc.backSide)
  );
  const flashCardSide = flashCard.backSide;

  return (
    <div>
      {distinctFlashCardSides.map((fcs, i) => (
        <Button
          key={i}
          variant="contained"
          onClick={_ => onAnswer((fcs === flashCardSide) ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect)}
          style={{ textTransform: "none" }}
        >
          {renderFlashCardSide(fcs)}
        </Button>))}
    </div>
  );
}