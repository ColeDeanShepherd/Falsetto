import * as React from 'react';

import { Quiz } from "../Quiz";
import { Quiz as QuizComponent } from "./Quiz";

export class IntervalsToConsonanceDissonance extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);

    const intervals = [
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
    const consonanceDissonances = [
      "sharp dissonance",
      "mild dissonance",
      "soft consonance",
      "soft consonance",
      "consonance or dissonance",
      "neutral or restless",
      "open consonance",
      "soft consonance",
      "soft consonance",
      "mild dissonance",
      "sharp dissonance",
      "open consonance"
    ];
    const answers = ["sharp dissonance", "mild dissonance", "consonance or dissonance", "neutral or restless", "soft consonance", "open consonance"];
    const questionAnswerIndices = consonanceDissonances.map(answer => answers.indexOf(answer));

    this.quiz = new Quiz(
      intervals.map(genericInterval => (() => <span style={{ fontSize: "2em" }}>{genericInterval}</span>)),
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