import * as React from "react";

import { ScaleType } from "../../lib/TheoryLib/Scale";
import { AnswerDifficulty } from "../../Study/AnswerDifficulty";
import { Button } from "../../ui/Button/Button";

export interface IScaleAnswerSelectProps {
  ambiguousPitchStringsSymbols: Array<string>;
  scales: Array<ScaleType>;
  correctAnswer: string;
  onAnswer: (answerDifficulty: AnswerDifficulty, answer: any) => void;
  lastCorrectAnswer: any;
  incorrectAnswers: Array<any>;
}
export interface IScaleAnswerSelectState {
  selectedRootPitch: string | undefined;
  selectedScaleType: string | undefined;
}
export class ScaleAnswerSelect extends React.Component<IScaleAnswerSelectProps, IScaleAnswerSelectState> {
  public constructor(props: IScaleAnswerSelectProps) {
    super(props);
    
    this.state = {
      selectedRootPitch: undefined,
      selectedScaleType: undefined
    };
  }
  public render(): JSX.Element {
    return (
      <div>
        <h4 className="h6 margin-bottom">
          Root Pitch
        </h4>
        <div style={{padding: "1em 0"}}>
          <div>
            {this.props.ambiguousPitchStringsSymbols.slice(0, 6)
              .map(rootPitchStr => {
                const style: any = { textTransform: "none" };
                
                const isPressed = rootPitchStr === this.state.selectedRootPitch;
                if (isPressed) {
                  style.backgroundColor = "#959595";
                }

                return (
                  <Button
                    key={rootPitchStr}
                    onClick={event => this.onRootPitchClick(rootPitchStr)}
                    style={style}
                  >
                    {rootPitchStr}
                  </Button>
                );
              })}
          </div>
          <div>
            {this.props.ambiguousPitchStringsSymbols.slice(6, 12)
              .map(rootPitchStr => {
                const style: any = { textTransform: "none" };
                
                const isPressed = rootPitchStr === this.state.selectedRootPitch;
                if (isPressed) {
                  style.backgroundColor = "#959595";
                }

                return (
                  <Button
                    key={rootPitchStr}
                    onClick={event => this.onRootPitchClick(rootPitchStr)}
                    style={style}
                  >
                    {rootPitchStr}
                  </Button>
                );
              })}
          </div>
        </div>
        
        <h4 className="h6 margin-bottom">
          Scale
        </h4>
        <div style={{padding: "1em 0"}}>
          {this.props.scales.map(scale => {
            const style: any = { textTransform: "none" };
            
            const isPressed = scale.name === this.state.selectedScaleType;
            if (isPressed) {
              style.backgroundColor = "#959595";
            }
            
            return (
              <Button
                key={scale.name}
                onClick={event => this.onScaleTypeClick(scale.name)}
                style={style}
              >
                {scale.name}
              </Button>
            );
          })}
        </div>

        <div style={{padding: "1em 0"}}>
          <Button
            onClick={event => this.confirmAnswer()}
            disabled={!this.state.selectedRootPitch || !this.state.selectedScaleType}
          >
            Confirm Answer
          </Button>
        </div>
      </div>
    );
  }

  private onRootPitchClick(rootPitch: string) {
    this.setState({ selectedRootPitch: rootPitch });
  }
  private onScaleTypeClick(scaleType: string) {
    this.setState({ selectedScaleType: scaleType });
  }
  private confirmAnswer() {
    const selectedAnswer = this.state.selectedRootPitch + " " + this.state.selectedScaleType;
    const isCorrect = selectedAnswer === this.props.correctAnswer;
    this.props.onAnswer(isCorrect ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect, selectedAnswer);
  }
}