import * as React from 'react';

import { Quiz } from "../Quiz";
import { Quiz as QuizComponent } from "./Quiz";

export class IntervalQualitySymbolsToQualities extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);

    const intervalQualitySymbols = [
      "m",
      "M",
      "A",
      "d",
      "P"
    ];
    const intervalQualities = [
      "minor",
      "major",
      "augmented",
      "diminished",
      "perfect"
    ];
    this.quiz = new Quiz(
      intervalQualitySymbols.map(symbol => (() => <span style={{ fontSize: "2em" }}>{symbol}</span>)),
      intervalQualitySymbols.map((_, i) => i),
      selectAnswerIndex => {
        const answerButtons = intervalQualities.map((intervalQuality, i) => {
          return <button key={i} onClick={event => selectAnswerIndex(i)}>{intervalQuality}</button>;
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