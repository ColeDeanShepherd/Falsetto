import * as React from 'react';

import * as Utils from "src/Utils";
import { FlashCard } from 'src/FlashCard';
import { renderFlashCardSide } from "src/Components/FlashCard";
import { AnswerDifficulty } from 'src/StudyAlgorithm';
import { Button } from '@material-ui/core';

export function renderNoteAnswerSelect(
  flashCards: FlashCard[],
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
): JSX.Element {
  const notes = ["A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab"];
  return renderStringAnswerSelect(notes, true, flashCards, flashCard, onAnswer);
}
export function renderStringAnswerSelect(
  answers: string[],
  areAnswersOnBackSide: boolean,
  flashCards: FlashCard[],
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
): JSX.Element {
  const flashCardSide = !areAnswersOnBackSide ? flashCard.frontSide : flashCard.backSide;

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
  areAnswersOnBackSide: boolean,
  flashCards: FlashCard[],
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
) {
  const distinctFlashCardSides = Utils.uniq(
    flashCards.map(fc => !areAnswersOnBackSide ? fc.frontSide : fc.backSide)
  );
  const flashCardSide = !areAnswersOnBackSide ? flashCard.frontSide : flashCard.backSide;

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