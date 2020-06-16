import * as React from "react";

import { AnswerDifficulty } from "../../Study/AnswerDifficulty";
import { FlashCardStudySessionInfo } from "../../FlashCardSet";
import { areArraysEqual } from '../../lib/Core/ArrayUtils';
import { Button } from "../../ui/Button/Button";

export interface IScaleFormulaAnswerSelectProps {
  info: FlashCardStudySessionInfo
  correctAnswer: Array<string>;
}
export interface IScaleFormulaAnswerSelectState {
  value: Array<string>
}
export class ScaleFormulaAnswerSelect extends React.Component<IScaleFormulaAnswerSelectProps, IScaleFormulaAnswerSelectState> {
  public constructor(props: IScaleFormulaAnswerSelectProps) {
    super(props);
    
    this.state = {
      value: new Array<string>()
    };
  }

  public render(): JSX.Element {
    const { value } = this.state;

    const formulaString = (value.length > 0)
      ? this.state.value.join(" ")
      : <span>&nbsp;</span>; // Ensure the paragraph doesn't collapse.

    return (
      <div>
        <p>
          {formulaString}
        </p>

        <p>
          <Button
            onClick={event => this.onHalfStepClick()}
            style={{ textTransform: "none" }}
          >
            H
          </Button>
          
          <Button
            onClick={event => this.onWholeStepClick()}
            style={{ textTransform: "none" }}
          >
            W
          </Button>
          
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
  
  private onHalfStepClick() {
    this.setState({ value: this.state.value.concat(["H"]) });
  }
  
  private onWholeStepClick() {
    this.setState({ value: this.state.value.concat(["W"]) });
  }

  private onBackspaceClick() {
    this.setState({ value: this.state.value.slice(0, this.state.value.length - 1) });
  }

  private confirmAnswer() {
    const { info, correctAnswer } = this.props;
    const { value } = this.state;

    const isCorrect = areArraysEqual(value, correctAnswer);
    const answerDifficulty = isCorrect ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect;
    info.onAnswer(answerDifficulty, value);
  }
}