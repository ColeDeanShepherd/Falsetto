import * as React from 'react';

import { Quiz } from "../../Quiz";

import Button from "@material-ui/core/Button";

export function createQuiz(): Quiz {
  const chordTypes = [
    "Ionian",
    "Lydian",
    "Lydian aug",
    "Ionian aug",
    "Major Petatonic",
    "Major Blues",
    "Augmented",
    "Dorian",
    "Phrygian",
    "Aeolian",
    "Melodic Minor",
    "Dorian b2",
    "Harmonic Minor",
    "Dorian #4",
    "Minor Pentatonic",
    "Minor Blues",
    "Locrian",
    "Locrian nat2",
    "Locrian nat6",
    "Mixolydian",
    "Mixolydian #11",
    "Mixolydian b6",
    "Altered Dominant",
    "Phrygian Major",
    "Dominant Diminished",
    "Whole Tone",
    "Major Pentatonic",
    "Minor Pentatonic",
    "Major Blues",
    "Minor Blues",
    "Tonic Diminished",
    "Altered Dominant bb7",
    "Whole Tone",
    "Augmented"
  ];
  const characteristics = [
    "sus4",
    "#4 (#11)",
    "#4, #5",
    "sus4, #5",
    "no 4 or 7",
    "b3, no4 or 7",
    "b3, #5",
    "6",
    "b2, 5, b6",
    "b6",
    "6, 7",
    "b2, 6",
    "b6, 7",
    "#4, 6",
    "4 (11)",
    "4, #4 (11, #11)",
    "b2, b5",
    "2, b5",
    "b2, b5, 6",
    "sus4, b7",
    "#4 (b5), b7",
    "sus4, b6(#5), b7",
    "b9, #9, b5, #5",
    "sus4, #5, 5",
    "b9, #9, b5, 5, 13",
    "#4, #5",
    "no 4 or b7",
    "#9, no b7",
    "b3, no b7",
    "#9, sus4, b5",
    "9, 11, b13, 7",
    "b9, 3, b13",
    "#4, #5",
    "#2, 5, #5, 7"
  ];
  const questionAnswerIndices = chordTypes.map((_, i) => i);

  return new Quiz(
    "Scale Characteristics",
    chordTypes.map(ct => (() => <span style={{ fontSize: "2em" }}>{ct}</span>)),
    questionAnswerIndices,
    selectAnswerIndex => {
      const answerButtons = characteristics.map((x, i) => {
        return <span key={i} style={{padding: "1em"}}><Button onClick={event => selectAnswerIndex(i)} variant="outlined" color="primary">{x}</Button></span>;
      });
      return <div style={{lineHeight: 3}}>{answerButtons}</div>;
    }
  );
}