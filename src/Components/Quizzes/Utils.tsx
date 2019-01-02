import * as React from 'react';

import { FlashCard } from 'src/FlashCard';
import { AnswerDifficulty } from 'src/StudyAlgorithm';
import { Button } from '@material-ui/core';

export function renderNoteAnswerSelect(
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
): JSX.Element {
  const notes = ["A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab"];
  return renderStringAnswerSelect(notes, true, flashCard, onAnswer);
}
export function renderStringAnswerSelect(
  answers: string[],
  areAnswersOnBackSide: boolean,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
): JSX.Element {
  const flashCardSide = !areAnswersOnBackSide ? flashCard.frontSide : flashCard.backSide;

  return (
    <div>
      {answers.map(a => (
        <Button
          key={a}
          onClick={_ => onAnswer((a === flashCardSide) ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect)}
          style={{ textTransform: "none" }}
        >
          {a}
        </Button>))}
    </div>
  );
}