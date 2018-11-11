import * as React from 'react';

import { Quiz } from "../Quiz";
import { Quiz as QuizComponent } from "./Quiz";

export class HarmonicMajorDiatonicTriads extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);

    const chordRoots = [1, 2, 3, 4, 5, 6, 7];
    const chordTypes = [
      "major",
      "diminished",
      "minor",
      "minor",
      "major",
      "augmented",
      "diminished"
    ];
    const answers = [
      "major",
      "minor",
      "diminished",
      "augmented"
    ];
    const questionAnswerIndices = chordTypes.map(answer => answers.indexOf(answer));

    this.quiz = new Quiz(
      chordRoots.map(chordRoot => (() => <span style={{ fontSize: "2em" }}>{chordRoot}</span>)),
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