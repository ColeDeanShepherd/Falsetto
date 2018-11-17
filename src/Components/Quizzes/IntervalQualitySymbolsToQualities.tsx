import * as React from 'react';

import { Quiz } from "../../Quiz";

import Button from "@material-ui/core/Button";

export function createQuiz(): Quiz {
  const intervalQualitySymbols = [
    "m",
    "M",
    "A",
    "d",
    "P"
  ];
  const intervalQualities = [
    "minor",
    "major",
    "augmented",
    "diminished",
    "perfect"
  ];
  return new Quiz(
    "Interval Quality Symbols To Qualities",
    intervalQualitySymbols.map(symbol => (() => <span>{symbol}</span>)),
    intervalQualitySymbols.map((_, i) => i),
    selectAnswerIndex => {
      const answerButtons = intervalQualities.map((intervalQuality, i) => {
        return <span key={i} style={{padding: "1em 1em 1em 0"}}><Button onClick={event => selectAnswerIndex(i)} variant="outlined" color="primary">{intervalQuality}</Button></span>;
      });
      return <div style={{lineHeight: 3}}>{answerButtons}</div>;
    }
  );
}