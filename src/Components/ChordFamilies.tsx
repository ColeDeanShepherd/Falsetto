import * as React from 'react';

import * as Utils from "../Utils";
import { Quiz } from "../Quiz";
import { Quiz as QuizComponent } from "./Quiz";

export class ChordFamilies extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);

    const diatonicChord = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7"
    ];
    const scaleFamilies = [
      "Tonic",
      "Pre-Dominant",
      "Tonic",
      "Pre-Dominant",
      "Dominant",
      "Tonic",
      "Dominant"
    ];
    const answers = Utils.uniq(scaleFamilies);
    const questionAnswerIndices = scaleFamilies.map(answer => answers.indexOf(answer));

    this.quiz = new Quiz(
      diatonicChord.map(dc => (() => <span style={{ fontSize: "2em" }}>{dc}</span>)),
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