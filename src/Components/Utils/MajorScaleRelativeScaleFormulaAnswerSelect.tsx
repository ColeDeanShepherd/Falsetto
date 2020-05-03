import * as React from "react";
import { Button, Typography } from "@material-ui/core";

import { AnswerDifficulty } from "../../Study/AnswerDifficulty";
import { FlashCardStudySessionInfo } from "../../FlashCardSet";
import { areArraysEqual, immutableArraySetElement, repeatElement } from '../../lib/Core/ArrayUtils';
import { range } from '../../lib/Core/MathUtils';
import { SignedAccidental, getAccidentalString } from '../../lib/TheoryLib/Pitch';

const scaleDegreeCount = 7;
const scaleDegreeIndexes = range(0, scaleDegreeCount - 1);

export interface IMajorScaleRelativeScaleFormulaAnswerSelectProps {
  info: FlashCardStudySessionInfo
  correctAnswer: Array<SignedAccidental>;
}
export interface IMajorScaleRelativeScaleFormulaAnswerSelectState {
  value: Array<SignedAccidental>
}
export class MajorScaleRelativeScaleFormulaAnswerSelect extends React.Component<IMajorScaleRelativeScaleFormulaAnswerSelectProps, IMajorScaleRelativeScaleFormulaAnswerSelectState> {
  public constructor(props: IMajorScaleRelativeScaleFormulaAnswerSelectProps) {
    super(props);
    
    this.state = {
      value: repeatElement(0, scaleDegreeCount)
    };
  }

  public render(): JSX.Element {
    const { value } = this.state;
    
    const renderFormulaPartAnswerSelect = (scaleDegreeIndex: number) => {
      const signedAccidental = value[scaleDegreeIndex];

      return (
        <div style={{ display: "inline-block", padding: "0 0.5em" }}>
          <div>
            <Button
              onClick={event => this.sharpenScaleDegree(scaleDegreeIndex)}
              variant="contained"
              style={{ textTransform: "none" }}
            >
              ♯
            </Button>
          </div>
  
          <p>{1 + scaleDegreeIndex}{getAccidentalString(signedAccidental, /*useSymbols*/ true)}</p>
  
          <div>
            <Button
              onClick={event => this.flattenScaleDegree(scaleDegreeIndex)}
              variant="contained"
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
        <p>{scaleDegreeIndexes.map(renderFormulaPartAnswerSelect)}</p>

        <p>
          <Button
            onClick={event => this.confirmAnswer()}
            variant="contained"
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
    
    this.setState({ value: immutableArraySetElement(value, scaleDegreeIndex, value[scaleDegreeIndex] + 1) }, () => console.log(this.state));
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