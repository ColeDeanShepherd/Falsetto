import * as React from 'react';

import { Quiz } from "../../Quiz";
import { Quiz as QuizComponent } from "../Quiz";

import Button from "@material-ui/core/Button";

export class GenericIntervalsToIntervalQualities extends React.Component<{}, {}> {
  public static createQuiz(): Quiz {
    const genericIntervals = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
    const intervalQualities = ["perfect", "imperfect", "imperfect", "perfect", "perfect", "imperfect", "imperfect", "perfect"];
    const answers = ["perfect", "imperfect"];
    const questionAnswerIndices = intervalQualities.map(answer => answers.indexOf(answer));

    return new Quiz(
      "Generic Intervals To Interval Qualities",
      genericIntervals.map(genericInterval => (() => <span style={{ fontSize: "2em" }}>{genericInterval}</span>)),
      questionAnswerIndices,
      selectAnswerIndex => {
        const answerButtons = answers.map((answer, i) => {
          return <span key={i} style={{padding: "1em"}}><Button onClick={event => selectAnswerIndex(i)} variant="outlined" color="primary">{answer}</Button></span>;
        }, this);
        return <div style={{lineHeight: 3}}>{answerButtons}</div>;
      }
    );
  }
  
  constructor(props: {}) {
    super(props);
    this.quiz = GenericIntervalsToIntervalQualities.createQuiz();
  }

  public render(): JSX.Element {
    return <QuizComponent quiz={this.quiz} />;
  }

  private quiz: Quiz;
}