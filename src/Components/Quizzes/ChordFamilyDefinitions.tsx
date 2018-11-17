import * as React from 'react';

import * as Utils from "../../Utils";
import { Quiz } from "../../Quiz";

import Button from "@material-ui/core/Button";

export function createQuiz(): Quiz {
  const chordFamily = [
    "Tonic",
    "Pre-Dominant",
    "Dominant"
  ];
  const chordFamilyDefinitions = [
    "doesn't contain the 4th scale degree",
    "contains only 4th scale degree",
    "contains the 4th and 7th scale degrees"
  ];
  const answers = Utils.uniq(chordFamilyDefinitions);
  const questionAnswerIndices = chordFamilyDefinitions.map(answer => answers.indexOf(answer));

  return new Quiz(
    "Chord Family Definitions",
    chordFamily.map(cf => (() => <span>{cf}</span>)),
    questionAnswerIndices,
    selectAnswerIndex => {
      const answerButtons = answers.map((answer, i) => {
        return <span key={i} style={{padding: "1em 1em 1em 0"}}><Button onClick={event => selectAnswerIndex(i)} variant="outlined" color="primary">{answer}</Button></span>;
      });
      return <div style={{lineHeight: 3}}>{answerButtons}</div>;
    }
  );
}