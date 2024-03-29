import * as React from "react";

import { AnswerDifficulty } from "../../Study/AnswerDifficulty";
import { ambiguousKeyPitchStringsSymbols } from "../../lib/TheoryLib/Pitch";
import { ChordType } from "../../lib/TheoryLib/ChordType";
import { arrayContains } from '../../lib/Core/ArrayUtils';
import { Button } from "../../ui/Button/Button";

export interface IPianoChordsButtonAnswerSelectProps {
  correctAnswer: string;
  onAnswer: (answerDifficulty: AnswerDifficulty, answer: any) => void;
  lastCorrectAnswer: any;
  incorrectAnswers: Array<any>;
  enabledRootPitches: Array<string>;
  enabledChordTypeNames: Array<string>;
}

export interface IPianoChordsButtonAnswerSelectState {
  selectedRootPitch: string | undefined;
  selectedChordType: string | undefined;
}

export class PianoChordsButtonAnswerSelect extends React.Component<IPianoChordsButtonAnswerSelectProps, IPianoChordsButtonAnswerSelectState> {
  public constructor(props: IPianoChordsButtonAnswerSelectProps) {
    super(props);
    
    this.state = {
      selectedRootPitch: undefined,
      selectedChordType: undefined
    };
  }
  public render(): JSX.Element {
    // TODO: use lastCorrectAnswer
    return (
      <div>
        <h4 className="h6 margin-bottom">
          Root Pitch
        </h4>
        <div style={{padding: "1em 0"}}>
          <div>
            {ambiguousKeyPitchStringsSymbols.slice(0, 6)
              .filter(rp => arrayContains(this.props.enabledRootPitches, rp))
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
            {ambiguousKeyPitchStringsSymbols.slice(6, 12)
              .filter(rp => arrayContains(this.props.enabledRootPitches, rp))
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
          Chord
        </h4>
        <div style={{padding: "1em 0"}}>
          {ChordType.All
            .filter(ct => arrayContains(this.props.enabledChordTypeNames, ct.name))
            .map(chord => {
              const style: any = { textTransform: "none" };
              
              const isPressed = chord.name === this.state.selectedChordType;
              if (isPressed) {
                style.backgroundColor = "#959595";
              }
              
              return (
                <Button
                  key={chord.name}
                  onClick={event => this.onChordTypeClick(chord.name)}
                  style={style}
                >
                  {chord.name}
                </Button>
              );
            })}
        </div>

        <div style={{padding: "1em 0"}}>
          <Button
            onClick={event => this.confirmAnswer()}
            disabled={!this.state.selectedRootPitch || !this.state.selectedChordType}
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
  private onChordTypeClick(chordType: string) {
    this.setState({ selectedChordType: chordType });
  }
  private confirmAnswer() {
    const selectedAnswer = this.state.selectedRootPitch + " " + this.state.selectedChordType;
    const isCorrect = selectedAnswer === this.props.correctAnswer;
    this.props.onAnswer(isCorrect ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect, selectedAnswer);
  }
}