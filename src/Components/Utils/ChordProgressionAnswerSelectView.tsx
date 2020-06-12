import * as React from "react";

import { AnswerDifficulty } from "../../Study/AnswerDifficulty";
import { FlashCardStudySessionInfo } from "../../FlashCardSet";
import { areArraysEqual } from '../../lib/Core/ArrayUtils';
import { Button } from "../../ui/Button/Button";

const romanNumeralChords = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];

export interface IChordProgressionAnswerSelectViewProps {
  info: FlashCardStudySessionInfo
  correctAnswer: string;
}
export interface IChordProgressionAnswerSelectViewState {
  value: Array<string>
}
export class ChordProgressionAnswerSelectView extends React.Component<IChordProgressionAnswerSelectViewProps, IChordProgressionAnswerSelectViewState> {
  public constructor(props: IChordProgressionAnswerSelectViewProps) {
    super(props);
    
    this.state = {
      value: new Array<string>()
    };
  }

  public render(): JSX.Element {
    const { value } = this.state;

    const formulaString = (value.length > 0)
      ? this.getAnswer(this.state.value)
      : <span>&nbsp;</span>; // Ensure the paragraph doesn't collapse.

    return (
      <div>
        <p>
          {formulaString}
        </p>

        <p>
          {romanNumeralChords.map(chord => (
            <Button
              key={chord}
              onClick={event => this.onChordClick(chord)}
              style={{ textTransform: "none" }}
            >
              {chord}
            </Button>
          ))}
          
          <Button
            onClick={event => this.onBackspaceClick()}
            style={{ textTransform: "none" }}
          >
            <i className="material-icons">backspace</i>
          </Button>
        </p>

        <p>
          <Button
            onClick={event => this.confirmAnswer()}
            style={{ textTransform: "none" }}
          >
            Confirm
          </Button>
        </p>
      </div>
    );
  }
  
  private onChordClick(chord: string) {
    this.setState({ value: this.state.value.concat([chord]) });
  }

  private onBackspaceClick() {
    this.setState({ value: this.state.value.slice(0, this.state.value.length - 1) });
  }

  private confirmAnswer() {
    const { info, correctAnswer } = this.props;
    const { value } = this.state;

    const isCorrect = this.getAnswer(this.state.value) === correctAnswer;
    const answerDifficulty = isCorrect ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect;
    info.onAnswer(answerDifficulty, value);
  }

  private getAnswer(value: Array<string>): string {
    return value.join(" - ");
  }
}