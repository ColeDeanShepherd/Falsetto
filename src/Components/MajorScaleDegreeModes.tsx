import * as React from 'react';

import { Quiz } from "../Quiz";
import { Quiz as QuizComponent } from "./Quiz";

export class MajorScaleDegreeModes extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);

    const scaleDegrees = [1, 2, 3, 4, 5, 6, 7];
    const scaleDegreeModes = [
      "Ionian",
      "Dorian",
      "Phrygian",
      "Lydian",
      "Mixolydian",
      "Aeolian",
      "Locrian"
    ];
    const answers = [
      "Ionian",
      "Dorian",
      "Phrygian",
      "Lydian",
      "Mixolydian",
      "Aeolian",
      "Locrian"
    ];
    const questionAnswerIndices = scaleDegreeModes.map(answer => answers.indexOf(answer));

    this.quiz = new Quiz(
      scaleDegrees.map(scaleDegree => (() => <span style={{ fontSize: "2em" }}>{scaleDegree}</span>)),
      questionAnswerIndices,
      selectAnswerIndex => {
        const answerButtons = answers.map((answer, i) => {
          return <button key={i} onClick={event => selectAnswerIndex(i)}>{answer}</button>;
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