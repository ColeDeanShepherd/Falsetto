import * as React from 'react';

import { Quiz } from "../Quiz";
import { Quiz as QuizComponent } from "./Quiz";

export class MajorDiatonicSeventhChords extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);

    const chordRoots = [1, 2, 3, 4, 5, 6, 7];
    const chordTypes = [
      "M7",
      "m7",
      "m7",
      "M7",
      "7",
      "m7",
      "m7b5"
    ];
    const answers = [
      "7",
      "M7",
      "m7",
      "m7b5",
      "dim7",
      "mM7",
      "M7#5"
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