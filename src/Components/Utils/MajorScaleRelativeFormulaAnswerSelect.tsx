import * as React from "react";

import { AnswerDifficulty } from "../../Study/AnswerDifficulty";
import { FlashCardStudySessionInfo } from "../../FlashCardSet";
import { areArraysEqual, immutableArraySetElement, repeatElement } from '../../lib/Core/ArrayUtils';
import { SignedAccidental, getAccidentalString } from '../../lib/TheoryLib/Pitch';
import { Button } from "../../ui/Button/Button";

export interface IMajorScaleRelativeFormulaAnswerSelectProps {
  scaleDegreeNumbers: Array<number>;
  info: FlashCardStudySessionInfo;
  correctAnswer: Array<SignedAccidental>;
}

export interface IMajorScaleRelativeFormulaAnswerSelectState {
  value: Array<SignedAccidental>;
}

export class MajorScaleRelativeFormulaAnswerSelect extends React.Component<
  IMajorScaleRelativeFormulaAnswerSelectProps,
  IMajorScaleRelativeFormulaAnswerSelectState
> {
  public constructor(props: IMajorScaleRelativeFormulaAnswerSelectProps) {
    super(props);
    
    this.state = {
      value: repeatElement(0, props.scaleDegreeNumbers.length)
    };
  }

  public render(): JSX.Element {
    const { scaleDegreeNumbers } = this.props;
    const { value } = this.state;
    
    const renderFormulaPartAnswerSelect = (scaleDegreeNumber: number, scaleDegreeIndex: number) => {
      const signedAccidental = value[scaleDegreeIndex];

      return (
        <div style={{ display: "inline-block", padding: "0 0.5em" }}>
          <div>
            <Button
              onClick={event => this.sharpenScaleDegree(scaleDegreeIndex)}
              style={{ textTransform: "none" }}
            >
              ♯
            </Button>
          </div>
  
          <p>{scaleDegreeNumber}{getAccidentalString(signedAccidental, /*useSymbols*/ true)}</p>
  
          <div>
            <Button
              onClick={event => this.flattenScaleDegree(scaleDegreeIndex)}
              style={{ textTransform: "none" }}
            >
              ♭
            </Button>
          </div>
        </div>
      );
    };

    return (
      <div>
        <p>{scaleDegreeNumbers.map(renderFormulaPartAnswerSelect)}</p>

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

  private sharpenScaleDegree(scaleDegreeIndex: number) {
    const { value } = this.state;
    
    this.setState({ value: immutableArraySetElement(value, scaleDegreeIndex, value[scaleDegreeIndex] + 1) });
  }
  
  private flattenScaleDegree(scaleDegreeIndex: number) {
    const { value } = this.state;
    
    this.setState({ value: immutableArraySetElement(value, scaleDegreeIndex, value[scaleDegreeIndex] - 1) });
  }

  private confirmAnswer() {
    const { info, correctAnswer } = this.props;
    const { value } = this.state;

    const isCorrect = areArraysEqual(value, correctAnswer);
    const answerDifficulty = isCorrect ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect;
    info.onAnswer(answerDifficulty, value);
  }
}