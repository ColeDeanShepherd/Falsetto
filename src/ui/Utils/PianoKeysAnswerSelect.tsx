import * as React from "react";

import { uniq, areArraysEqualComparer } from '../../lib/Core/ArrayUtils';

import { Pitch } from "../../lib/TheoryLib/Pitch";

import { AnswerDifficulty } from "../../Study/AnswerDifficulty";

import { areSetsEqual } from '../../lib/Core/SetUtils';
import { PlayablePianoKeyboard, IPlayablePianoKeyboardExports } from './PlayablePianoKeyboard';
import { Button } from "../../ui/Button/Button";

export interface IPianoKeysAnswerSelectProps {
  maxWidth?: number;
  maxHeight?: number;
  lowestPitch: Pitch;
  highestPitch: Pitch;
  correctAnswer: Array<Pitch>;
  onAnswer: (answerDifficulty: AnswerDifficulty, answer: any) => void;
  lastCorrectAnswer: any;
  incorrectAnswers: Array<any>;
  instantConfirm: boolean;
  wrapOctave?: boolean;
  instantConfirmMidiToggleKeys?: boolean;
}

export interface IPianoKeysAnswerSelectState {}

export class PianoKeysAnswerSelect extends React.Component<IPianoKeysAnswerSelectProps, IPianoKeysAnswerSelectState> {
  // #region React Functions

  public componentWillReceiveProps(nextProps: IPianoKeysAnswerSelectProps) {
    if (!areArraysEqualComparer(nextProps.correctAnswer, this.props.correctAnswer, (a, b) => a.equals(b))) {
      // TODO: clear keys?
    }
  }

  public render(): JSX.Element {
    // TODO: use lastCorrectAnswer

    const { maxWidth, maxHeight, lowestPitch, highestPitch, instantConfirm, wrapOctave } = this.props;

    return (
      <div>
        <PlayablePianoKeyboard
          maxWidth={maxWidth}
          maxHeight={maxHeight}
          lowestPitch={lowestPitch}
          highestPitch={highestPitch}
          onKeyPress={(pitch, velocity, wasClick) => this.onKeyPress(pitch, wasClick)}
          onKeyRelease={(pitch, wasClick) => this.onKeyRelease(pitch, wasClick)}
          toggleKeys={!instantConfirm}
          wrapOctave={wrapOctave}
          onGetExports={exports => this.keyboardExports = exports}
        />

        {!instantConfirm ? this.renderConfirmAnswerButton() : null}
      </div>
    );
  }
  
  private renderConfirmAnswerButton(): JSX.Element {
    const pressedPitches = this.keyboardExports
      ? this.keyboardExports.getPressedPitches()
      : [];

    return (
      <div style={{padding: "1em 0"}}>
        <Button
          onClick={event => this.confirmAnswer(pressedPitches)}
          disabled={pressedPitches.length === 0}
        >
          Confirm Answer
        </Button>
      </div>
    );
  }

  // #endregion

  private keyboardExports: IPlayablePianoKeyboardExports | undefined = undefined;

  private onKeyPress(pitch: Pitch, wasClick: boolean) {
    if (!this.keyboardExports) { return; }

    const { instantConfirm } = this.props;
    const selectedPitches = this.keyboardExports.getPressedPitches();

    // Update the state, and confirm the answer if instant confirm is on, or if we're pressing the right MIDI keys.
    if (instantConfirm || (!wasClick && this.getIsCorrect(selectedPitches))) {
      if (this.keyboardExports) {
        const selectedPitches = !instantConfirm
          ? this.keyboardExports.getPressedPitches()
          : [pitch];
        this.confirmAnswer(selectedPitches);
      }
    }

    this.forceUpdate();
  }
  
  private onKeyRelease(pitch: Pitch, wasClick: boolean) {
    if (!this.keyboardExports) { return; }

    const selectedPitches = this.keyboardExports.getPressedPitches();

    if (!wasClick && this.getIsCorrect(selectedPitches)) {
      if (this.keyboardExports) {
        const selectedPitches = this.keyboardExports.getPressedPitches();
        this.confirmAnswer(selectedPitches);
      }
    }

    this.forceUpdate();
  }

  private confirmAnswer(selectedPitches: Array<Pitch>) {
    const { instantConfirm } = this.props;

    const isCorrect = this.getIsCorrect(selectedPitches);
    const answerDifficulty = isCorrect ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect;
    const selectedPitchMidiNumbersNoOctave = uniq(
      selectedPitches
        .map(pitch => pitch.midiNumberNoOctave)
    );

    if (isCorrect && !instantConfirm && this.keyboardExports) {
      this.keyboardExports.clearPressedPitches();
    }

    this.props.onAnswer(answerDifficulty, selectedPitchMidiNumbersNoOctave);
  }

  private getIsCorrect(selectedPitches: Array<Pitch>): boolean {
    const selectedPitchMidiNumbersNoOctave = new Set<number>(
      selectedPitches
        .map(pitch => pitch.midiNumberNoOctave)
    );
    const correctAnswerMidiNumbersNoOctave = new Set<number>(
      this.props.correctAnswer
        .map(pitch => pitch.midiNumberNoOctave)
    );

    const isCorrect = areSetsEqual(selectedPitchMidiNumbersNoOctave, correctAnswerMidiNumbersNoOctave);
    return isCorrect;
  }
}