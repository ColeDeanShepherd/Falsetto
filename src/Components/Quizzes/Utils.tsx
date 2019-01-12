import * as React from 'react';
import { Button } from '@material-ui/core';

import * as Utils from "src/Utils";
import { FlashCard } from 'src/FlashCard';
import { renderFlashCardSide } from "src/Components/FlashCard";
import { AnswerDifficulty } from 'src/StudyAlgorithm';

export function renderNoteAnswerSelect(
  flashCards: FlashCard[],
  areFlashCardsInverted: boolean,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
): JSX.Element {
  const naturalNotes = ["C", "D", "E", "F", "G", "A", "B"];
  const accidentalNotes = ["C#/Db", "D#/Eb", "F#/Gb", "G#/Ab", "A#/Bb"];
  return (
    <div>
      {renderStringAnswerSelect(accidentalNotes, flashCards, areFlashCardsInverted, flashCard, onAnswer)}
      {renderStringAnswerSelect(naturalNotes, flashCards, areFlashCardsInverted, flashCard, onAnswer)}
    </div>
  );
}
export function renderStringAnswerSelect(
  answers: string[],
  flashCards: FlashCard[],
  areFlashCardsInverted: boolean,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
): JSX.Element {
  const flashCardSide = flashCard.backSide;

  return (
    <div>
      {answers.map(a => (
        <Button
          key={a}
          variant="contained"
          onClick={_ => onAnswer((a === flashCardSide) ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect)}
          style={{ textTransform: "none" }}
        >
          {a}
        </Button>))}
    </div>
  );
}
export function renderDistinctFlashCardSideAnswerSelect(
  flashCards: FlashCard[],
  areFlashCardsInverted: boolean,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
) {
  const distinctFlashCardSides = Utils.uniq(
    flashCards.map(fc => fc.backSide)
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