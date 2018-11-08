import * as React from 'react';

import { Quiz } from "../Quiz";
import { Quiz as QuizComponent } from "./Quiz";

export class GenericIntervalsToIntervalQualities extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);

    const genericIntervals = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
    const intervalQualities = ["perfect", "imperfect", "imperfect", "perfect", "perfect", "imperfect", "imperfect", "perfect"];
    const answers = ["perfect", "imperfect"];
    const questionAnswerIndices = intervalQualities.map(answer => answers.indexOf(answer));

    this.quiz = new Quiz(
      genericIntervals.map(genericInterval => (() => <span style={{ fontSize: "2em" }}>{genericInterval}</span>)),
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