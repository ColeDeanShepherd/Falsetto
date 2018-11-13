import * as React from 'react';

import { Quiz } from "../../Quiz";

import Button from "@material-ui/core/Button";

export function createQuiz(): Quiz {
  const chordRoots = [1, 2, 3, 4, 5, 6, 7];
  const chordTypes = [
    "M7",
    "M7",
    "mbb7",
    "mM7",
    "7b5",
    "M7#5",
    "7"
  ];
  const answers = [
    "7",
    "M7",
    "m7",
    "m7b5",
    "dim7",
    "mM7",
    "M7#5",
    "mbb7",
    "7b5"
  ];
  const questionAnswerIndices = chordTypes.map(answer => answers.indexOf(answer));

  return new Quiz(
    "Double Harmonic Major Diatonic Seventh Chords",
    chordRoots.map(chordRoot => (() => <p style={{ fontSize: "2em" }}>{chordRoot}</p>)),
    questionAnswerIndices,
    selectAnswerIndex => {
      const answerButtons = answers.map((answer, i) => {
        return <span key={i} style={{paddingLeft: "1em"}}><Button onClick={event => selectAnswerIndex(i)} variant="outlined" color="primary">{answer}</Button></span>;
      });
      return <div style={{lineHeight: 3}}>{answerButtons}</div>;
    }
  );
}