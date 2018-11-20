import * as React from 'react';

import { Quiz } from "../../Quiz";

import Button from "@material-ui/core/Button";

export function createQuiz(): Quiz {
  const intervals = [
    "m2",
    "M2",
    "m3",
    "M3",
    "P4",
    "A4/d5",
    "P5",
    "m6",
    "M6",
    "m7",
    "M7",
    "P8"
  ];
  const consonanceDissonances = [
    "sharp dissonance",
    "mild dissonance",
    "soft consonance",
    "soft consonance",
    "consonance or dissonance",
    "neutral or restless",
    "open consonance",
    "soft consonance",
    "soft consonance",
    "mild dissonance",
    "sharp dissonance",
    "open consonance"
  ];
  const answers = [
    "sharp dissonance",
    "mild dissonance",
    "consonance or dissonance",
    "neutral or restless",
    "soft consonance",
    "open consonance"
  ];
  const questionAnswerIndices = consonanceDissonances.map(answer => answers.indexOf(answer));

  return new Quiz(
    "Intervals To Consonance Dissonance",
    intervals.map(genericInterval => (() => <span>{genericInterval}</span>)),
    questionAnswerIndices,
    selectAnswerId => {
      const answerButtons = answers.map((answer, i) => {
        return <span key={i} style={{padding: "1em 1em 1em 0"}}><Button onClick={event => selectAnswerId(i)} variant="outlined" color="primary">{answer}</Button></span>;
      });
      return <div style={{lineHeight: 3}}>{answerButtons}</div>;
    }
  );
}