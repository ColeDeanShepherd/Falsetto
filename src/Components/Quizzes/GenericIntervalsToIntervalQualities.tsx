import * as React from 'react';

import { Quiz } from "../../Quiz";

import Button from "@material-ui/core/Button";

export function createQuiz(): Quiz {
  const genericIntervals = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
  const intervalQualities = ["perfect", "imperfect", "imperfect", "perfect", "perfect", "imperfect", "imperfect", "perfect"];
  const answers = ["perfect", "imperfect"];
  const questionAnswerIndices = intervalQualities.map(answer => answers.indexOf(answer));

  return new Quiz(
    "Generic Intervals To Interval Qualities",
    genericIntervals.map(genericInterval => (() => <span>{genericInterval}</span>)),
    questionAnswerIndices,
    selectAnswerId => {
      const answerButtons = answers.map((answer, i) => {
        return <span key={i} style={{padding: "1em 1em 1em 0"}}><Button onClick={event => selectAnswerId(i)} variant="outlined" color="primary">{answer}</Button></span>;
      });
      return <div style={{lineHeight: 3}}>{answerButtons}</div>;
    }
  );
}