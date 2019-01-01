import * as React from 'react';

import { FlashCard } from 'src/FlashCard';
import { AnswerDifficulty } from 'src/StudyAlgorithm';
import { Button } from '@material-ui/core';

export function renderNoteAnswerSelect(
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
): JSX.Element {
  const notes = ["A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab"];
  return (
    <div>
      {notes.map(n => (
        <Button
          key={n}
          onClick={event => onAnswer((n === flashCard.backSide) ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect)}
          style={{ textTransform: "none" }}
        >
          {n}
        </Button>))}
    </div>
  );
}