import * as React from 'react';

import { Quiz } from "../../Quiz";

import Button from "@material-ui/core/Button";

export function createQuiz(): Quiz {
  const chordRoots = [1, 2, 3, 4, 5, 6, 7];
  const chordTypes = [
    "major",
    "diminished",
    "minor",
    "minor",
    "major",
    "augmented",
    "diminished"
  ];
  const answers = [
    "major",
    "minor",
    "diminished",
    "augmented"
  ];
  const questionAnswerIndices = chordTypes.map(answer => answers.indexOf(answer));

  return new Quiz(
    "Harmonic Major Diatonic Triads",
    chordRoots.map(chordRoot => (() => <span>{chordRoot}</span>)),
    questionAnswerIndices,
    selectAnswerIndex => {
      const answerButtons = answers.map((answer, i) => {
        return <span key={i} style={{padding: "1em 1em 1em 0"}}><Button onClick={event => selectAnswerIndex(i)} variant="outlined" color="primary">{answer}</Button></span>;
      });
      return <div style={{lineHeight: 3}}>{answerButtons}</div>;
    }
  );
}