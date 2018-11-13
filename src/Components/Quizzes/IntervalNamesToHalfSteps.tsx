import * as React from 'react';

import { Quiz } from "../../Quiz";

import Button from "@material-ui/core/Button";

export function createQuiz(): Quiz {
  const intervalNames = [
    "Unison",
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
  return new Quiz(
    "Interval Names To Half Steps",
    intervalNames.map(intervalName => (() => <span style={{ fontSize: "2em" }}>{intervalName}</span>)),
    intervalNames.map((_, i) => i),
    selectAnswerIndex => {
      const intervalButtons = intervalNames.map((interval, i) => {
        const text = i;
        return <span key={i} style={{padding: "1em"}}><Button onClick={event => selectAnswerIndex(i)} variant="outlined" color="primary">{text}</Button></span>;
      });
      return <div style={{lineHeight: 3}}>{intervalButtons}</div>;
    }
  );
}