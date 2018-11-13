import * as React from 'react';

import { Quiz } from "../../Quiz";

import Button from "@material-ui/core/Button";

export function createQuiz(): Quiz {
  const chordNotes = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7 (in major)",
    "7 (in minor)"
  ];
  const chordTypes = [
    "Tonic",
    "Supertonic",
    "Mediant",
    "Subdominant",
    "Dominant",
    "Submediant",
    "Leading Tone",
    "Subtonic"
  ];
  const questionAnswerIndices = chordNotes.map((_, i) => i);

  return new Quiz(
    "Scale Degree Names",
    chordNotes.map(cn => (() => <p style={{ fontSize: "2em" }}>{cn}</p>)),
    questionAnswerIndices,
    selectAnswerIndex => {
      const answerButtons = chordTypes.map((chordType, i) => {
        return <span key={i} style={{padding: "1em 1em 1em 0"}}><Button onClick={event => selectAnswerIndex(i)} variant="outlined" color="primary">{chordType}</Button></span>;
      });
      return <div style={{lineHeight: 3}}>{answerButtons}</div>;
    }
  );
}