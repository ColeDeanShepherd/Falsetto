import * as React from 'react';

import * as Utils from "../Utils";
import { Quiz } from "../Quiz";
import { Quiz as QuizComponent } from "./Quiz";

export class ChordFamilyDefinitions extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);

    const chordFamily = [
      "Tonic",
      "Pre-Dominant",
      "Dominant"
    ];
    const chordFamilyDefinitions = [
      "doesn't contain the 4th scale degree",
      "contains only 4th scale degree",
      "contains the 4th and 7th scale degrees"
    ];
    const answers = Utils.uniq(chordFamilyDefinitions);
    const questionAnswerIndices = chordFamilyDefinitions.map(answer => answers.indexOf(answer));

    this.quiz = new Quiz(
      chordFamily.map(cf => (() => <span style={{ fontSize: "2em" }}>{cf}</span>)),
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