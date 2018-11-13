import * as React from 'react';

import { Quiz } from "../../Quiz";

import Button from "@material-ui/core/Button";

export function createQuiz(): Quiz {
  const chordTypes = [
    "Ionian (Major)",
    "Dorian",
    "Phrygian",
    "Lydian",
    "Mixolydian",
    "Aeolian (Natural Minor)",
    "Locrian",
    "Melodic Minor",
    "Dorian b2",
    "Lydian Aug.",
    "Mixolydian #11",
    "Mixolydian b6",
    "Locrian Nat. 9",
    "Altered Dominant",
    "Harmonic Minor",
    "Locrian Nat. 6",
    "Ionian Aug.",
    "Dorian #11",
    "Phrygian Major",
    "Lydian #9",
    "Altered Dominant bb7",
    "Tonic Diminished",
    "Dominant Diminished",
    "Whole Tone",
    "Augmented",
    "Major Pentatonic",
    "Minor Pentatonic",
    "Major Blues",
    "Minor Blues"
  ];
  const mostCommonUses = [
    "Maj7",
    "Min7 (nat. 6)",
    "Min7, Maj∆/7",
    "Maj7(#11)",
    "Dom7",
    "Min7(b6)",
    "Min7b5",
    "MinMaj7",
    "Min7sus4b9",
    "Maj7#4#5, Maj∆/b6",
    "Dom7b5",
    "Dom7b6",
    "Min9b6",
    "Dom7b9,#9,b5,#5",
    "Minmaj7, o∆/b7",
    "Min7b5",
    "Maj7sus4,#5",
    "Min7(#11)",
    "Dom7sus4,b9, #5",
    "Maj7#9,#11, Maj∆/b9",
    "Dimo7",
    "Dim7, Maj∆/b9",
    "Dom13,b9,#9,b5",
    "Dom7,#5,b5",
    "Aug∆/7Aug∆",
    "Maj(6,7)",
    "Min(7,11)",
    "Dom7, Maj(6,7)",
    "Min7, Dom7#9"
  ];
  const questionAnswerIndices = chordTypes.map((_, i) => i);

  return new Quiz(
    "Scale Chords",
    chordTypes.map(ct => (() => <span style={{ fontSize: "2em" }}>{ct}</span>)),
    questionAnswerIndices,
    selectAnswerIndex => {
      const answerButtons = mostCommonUses.map((use, i) => {
        return <span key={i} style={{padding: "1em"}}><Button onClick={event => selectAnswerIndex(i)} variant="outlined" color="primary">{use}</Button></span>;
      });
      return <div style={{lineHeight: 3}}>{answerButtons}</div>;
    }
  );
}