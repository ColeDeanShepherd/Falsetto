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
    "Interval Half Steps To Names",
    intervalNames.map((_, i) => (() => <span>{i}</span>)),
    intervalNames.map((_, i) => i),
    selectAnswerId => {
      const intervalButtons = intervalNames.map((intervalName, i) => {
        return <span key={i} style={{padding: "1em 1em 1em 0"}}><Button onClick={event => selectAnswerId(i)} variant="outlined" color="primary">{intervalName}</Button></span>;
      });
      return <div style={{lineHeight: 3}}>{intervalButtons}</div>;
    }
  );
}