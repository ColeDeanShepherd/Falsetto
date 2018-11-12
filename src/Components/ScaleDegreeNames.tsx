import * as React from 'react';

import { Quiz } from "../Quiz";
import { Quiz as QuizComponent } from "./Quiz";

export class ScaleDegreeNames extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);

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