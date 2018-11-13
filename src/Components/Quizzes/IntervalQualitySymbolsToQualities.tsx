import * as React from 'react';

import { Quiz } from "../../Quiz";
import { Quiz as QuizComponent } from "../Quiz";

import Button from "@material-ui/core/Button";

export class IntervalQualitySymbolsToQualities extends React.Component<{}, {}> {
  public static createQuiz(): Quiz {
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
    return new Quiz(
      "Interval Quality Symbols To Qualities",
      intervalQualitySymbols.map(symbol => (() => <span style={{ fontSize: "2em" }}>{symbol}</span>)),
      intervalQualitySymbols.map((_, i) => i),
      selectAnswerIndex => {
        const answerButtons = intervalQualities.map((intervalQuality, i) => {
          return <span key={i} style={{padding: "1em"}}><Button onClick={event => selectAnswerIndex(i)} variant="outlined" color="primary">{intervalQuality}</Button></span>;
        }, this);
        return <div style={{lineHeight: 3}}>{answerButtons}</div>;
      }
    );
  }
  
  constructor(props: {}) {
    super(props);
    this.quiz = IntervalQualitySymbolsToQualities.createQuiz();
  }

  public render(): JSX.Element {
    return <QuizComponent quiz={this.quiz} />;
  }

  private quiz: Quiz;
}