import * as React from 'react';

import { Quiz } from "../Quiz";
import { Quiz as QuizComponent } from "./Quiz";

export class ScaleNotes extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);

    const chordNotes = [
      "1 2 3 4 5 6 7",
      "1 2 b3 4 5 6 b7",
      "1 b2 b3 4 5 b6 b7",
      "1 2 3 #4 5 6 7",
      "1 2 3 4 5 6 b7",
      "1 2 b3 4 5 b6 b7",
      "1 b2 b3 4 b5 b6 b7",
      "1 2 b3 4 5 6 7",
      "1 b2 b3 4 5 6 b7",
      "1 2 3 #4 #5 6 7",
      "1 2 3 #4 5 6 b7",
      "1 2 3 4 5 b6 b7",
      "1 2 b3 4 b5 b6 b7",
      "1 b2 b3 b4 b5 b6 b7",
      "1 2 b3 4 5 b6 7",
      "1 b2 b3 4 b5 6 b7",
      "1 2 3 4 #5 6 7",
      "1 2 b3 #4 5 6 b7",
      "1 b2 3 4 5 b6 b7",
      "1 #2 3 #4 5 6 7",
      "1 b2 b3 b4 b5 b6 bb7",
      "1 2 b3 4 b5 b6 bb7 7",
      "1 b2 b3 b4 b5 5 6 b7",
      "1 2 3 #4 #5 b7",
      "1 #2 3 5 #5 7",
      "1 2 3 5 6",
      "1 b3 4 5 b7",
      "1 2 b3 3 5 6",
      "1 b3 4 b5 5 b7"
    ];
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
    const questionAnswerIndices = chordNotes.map((_, i) => i);

    this.quiz = new Quiz(
      chordNotes.map(cn => (() => <span style={{ fontSize: "2em" }}>{cn}</span>)),
      questionAnswerIndices,
      selectAnswerIndex => {
        const answerButtons = chordTypes.map((chordType, i) => {
          return <button key={i} onClick={event => selectAnswerIndex(i)}>{chordType}</button>;
        }, this);
        return <div>{answerButtons}</div>;
      }
    );
  }

  public render(): JSX.Element {
    return <QuizComponent quiz={this.quiz} />;
  }

  private quiz: Quiz;
}