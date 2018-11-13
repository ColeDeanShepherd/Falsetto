import * as React from 'react';

import * as Utils from "../../Utils";
import { Quiz } from "../../Quiz";
import { Quiz as QuizComponent } from "../Quiz";

import Button from "@material-ui/core/Button";

export class ChordFamilies extends React.Component<{}, {}> {
  public static createQuiz(): Quiz {
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

    return new Quiz(
      "Chord Families",
      diatonicChord.map(dc => (() => <span style={{ fontSize: "2em" }}>{dc}</span>)),
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
    this.quiz = ChordFamilies.createQuiz();
  }

  public render(): JSX.Element {
    return <QuizComponent quiz={this.quiz} />;
  }

  private quiz: Quiz;
}