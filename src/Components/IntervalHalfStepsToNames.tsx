import * as React from 'react';

import { Quiz } from "../Quiz";
import { Quiz as QuizComponent } from "./Quiz";

export class IntervalHalfStepsToNames extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);

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
    this.quiz = new Quiz(
      intervalNames.map((_, i) => (() => <span style={{ fontSize: "2em" }}>{i}</span>)),
      intervalNames.map((_, i) => i),
      selectAnswerIndex => {
        const intervalButtons = intervalNames.map((intervalName, i) => {
          return <button key={i} onClick={event => selectAnswerIndex(i)}>{intervalName}</button>;
        }, this);
        return <div>{intervalButtons}</div>;
      }
    );
  }

  public render(): JSX.Element {
    return <QuizComponent quiz={this.quiz} />;
  }

  private quiz: Quiz;
}