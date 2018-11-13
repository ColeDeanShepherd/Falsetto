import * as React from 'react';

import { Quiz } from "../../Quiz";
import { Quiz as QuizComponent } from "../Quiz";

import Button from "@material-ui/core/Button";

export class IntervalHalfStepsToNames extends React.Component<{}, {}> {
  public static createQuiz(): Quiz {
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
    return new Quiz(
      "Interval Half Steps To Names",
      intervalNames.map((_, i) => (() => <span style={{ fontSize: "2em" }}>{i}</span>)),
      intervalNames.map((_, i) => i),
      selectAnswerIndex => {
        const intervalButtons = intervalNames.map((intervalName, i) => {
          return <span key={i} style={{padding: "1em"}}><Button onClick={event => selectAnswerIndex(i)} variant="outlined" color="primary">{intervalName}</Button></span>;
        }, this);
        return <div style={{lineHeight: 3}}>{intervalButtons}</div>;
      }
    );
  }
  
  constructor(props: {}) {
    super(props);
    this.quiz = IntervalHalfStepsToNames.createQuiz();
  }

  public render(): JSX.Element {
    return <QuizComponent quiz={this.quiz} />;
  }

  private quiz: Quiz;
}