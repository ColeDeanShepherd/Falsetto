import * as React from "react";
import { Button } from "@material-ui/core";

import { uniq, immutableRemoveIfFoundInArray, immutableAddIfNotFoundInArray, toggleArrayElement, immutableToggleArrayElementCustomEquals, areArraysEqual, areArraysEqualComparer } from '../../lib/Core/ArrayUtils';
import { Size2D } from "../../lib/Core/Size2D";
import { Vector2D } from "../../lib/Core/Vector2D";
import { Rect2D } from "../../lib/Core/Rect2D";

import { Pitch, tryWrapPitchOctave } from "../../lib/TheoryLib/Pitch";

import { AnswerDifficulty } from "../../Study/AnswerDifficulty";

import { PianoKeyboard } from "./PianoKeyboard";
import { MidiNoteEventListener } from "./MidiNoteEventListener";
import { areSetsEqual } from '../../lib/Core/SetUtils';

export interface IPianoKeysAnswerSelectProps {
  aspectRatio: number;
  maxWidth: number;
  lowestPitch: Pitch;
  highestPitch: Pitch;
  correctAnswer: Array<Pitch>;
  maxNumPitches?: number;
  onAnswer: (answerDifficulty: AnswerDifficulty, answer: any) => void;
  lastCorrectAnswer: any;
  incorrectAnswers: Array<any>;
  instantConfirm: boolean;
  wrapOctave?: boolean;
}

export interface IPianoKeysAnswerSelectState {
  selectedPitches: Array<Pitch>;
}

export class PianoKeysAnswerSelect extends React.Component<IPianoKeysAnswerSelectProps, IPianoKeysAnswerSelectState> {
  public constructor(props: IPianoKeysAnswerSelectProps) {
    super(props);
    
    this.state = this.getStateFromProps(props);
  }

  public componentWillReceiveProps(nextProps: IPianoKeysAnswerSelectProps) {
    if (!areArraysEqualComparer(nextProps.correctAnswer, this.props.correctAnswer, (a, b) => a.equals(b))) {
      this.setState(this.getStateFromProps(nextProps));
    }
  }

  public render(): JSX.Element {
    // TODO: use lastCorrectAnswer

    const { aspectRatio, maxWidth, lowestPitch, highestPitch, instantConfirm } = this.props;
    const { selectedPitches } = this.state;

    return (
      <div>
        <PianoKeyboard
          rect={new Rect2D(new Size2D(aspectRatio * 100, 100), new Vector2D(0, 0))}
          lowestPitch={lowestPitch}
          highestPitch={highestPitch}
          pressedPitches={selectedPitches}
          onKeyPress={pitch => this.onKeyPress(pitch, /*wasClick*/ true)}
          onKeyRelease={pitch => this.onKeyRelease(pitch, /*wasClick*/ true)}
          allowDragPresses={false}
          style={{ width: "100%", maxWidth: `${maxWidth}px`, height: "auto" }}
        />

        {!instantConfirm ? this.renderConfirmAnswerButton() : null}

        <MidiNoteEventListener
          onNoteOn={(pitch, velocity) => this.onKeyPress(pitch, /*wasClick*/ false)}
          onNoteOff={pitch => this.onKeyRelease(pitch, /*wasClick*/ false)} />
      </div>
    );
  }

  private getStateFromProps(props: IPianoKeysAnswerSelectProps): IPianoKeysAnswerSelectState {
    return {
      selectedPitches: []
    };
  }

  private renderConfirmAnswerButton(): JSX.Element {
    const { selectedPitches } = this.state;

    return (
      <div style={{padding: "1em 0"}}>
        <Button
          onClick={event => this.confirmAnswer()}
          disabled={selectedPitches.length === 0}
          variant="contained"
        >
          Confirm Answer
        </Button>
      </div>
    );
  }

  private onKeyPress(pitch: Pitch, wasClick: boolean) {
    const { maxNumPitches, instantConfirm } = this.props;
    const { selectedPitches } = this.state;

    // Process & validate the pitch.
    const newPitch = this.processAndValidatePitch(pitch);
    if (!newPitch) { return; }

    pitch = newPitch;

    //#region Get new selected pitches

    let newSelectedPitches: Pitch[];

    // If click event, toggle key.
    if (wasClick) {
      newSelectedPitches = immutableToggleArrayElementCustomEquals(
        selectedPitches,
        pitch,
        p => p.equals(pitch)
      );
    }
    // If MIDI event, press key.
    else {
      newSelectedPitches = immutableAddIfNotFoundInArray(
        selectedPitches,
        pitch,
        p => p.equals(pitch)
      );
    }

    //#endregion

    // Remove the oldest selected pitch if there are too many selected pitches now.
    if (maxNumPitches && (newSelectedPitches.length > maxNumPitches)) {
      newSelectedPitches = newSelectedPitches.slice(1);
    }
    
    // Update the state, and confirm the answer if instant confirm is on, or if we're pressing the right MIDI keys.
    this.setState({ selectedPitches: newSelectedPitches }, () => {
      if (instantConfirm || (!wasClick && this.getIsCorrect())) {
        this.confirmAnswer();
      }
    });
  }
  
  private onKeyRelease(pitch: Pitch, wasClick: boolean) {
    const { instantConfirm } = this.props;
    const { selectedPitches } = this.state;

    // If the key wasn't released through a MIDI event, early-out.
    if (wasClick && !instantConfirm) { return; }

    // Process & validate the pitch.
    const newPitch = this.processAndValidatePitch(pitch);
    if (!newPitch) { return; }

    pitch = newPitch;

    // Remove the pitch from the selection.
    let newSelectedPitches = immutableRemoveIfFoundInArray(
      selectedPitches,
      p => p.equals(pitch)
    );
    
    // Update the state.
    this.setState({ selectedPitches: newSelectedPitches });
  }

  private confirmAnswer() {
    const answerDifficulty = this.getIsCorrect() ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect;
    const selectedPitchMidiNumbersNoOctave = uniq(
      this.state.selectedPitches
        .map(pitch => pitch.midiNumberNoOctave)
    );
    this.props.onAnswer(answerDifficulty, selectedPitchMidiNumbersNoOctave);
  }

  private getIsCorrect(): boolean {
    const selectedPitchMidiNumbersNoOctave = new Set<number>(
      this.state.selectedPitches
        .map(pitch => pitch.midiNumberNoOctave)
    );
    const correctAnswerMidiNumbersNoOctave = new Set<number>(
      this.props.correctAnswer
        .map(pitch => pitch.midiNumberNoOctave)
    );

    const isCorrect = areSetsEqual(selectedPitchMidiNumbersNoOctave, correctAnswerMidiNumbersNoOctave);
    return isCorrect;
  }

  private processAndValidatePitch(pitch: Pitch): Pitch | undefined {
    const { lowestPitch, highestPitch, wrapOctave } = this.props;

    if (wrapOctave) {
      const wrappedPitch = tryWrapPitchOctave(pitch, lowestPitch, highestPitch);
      if (!wrappedPitch) { return undefined; }

      return wrappedPitch;
    } else if ((pitch.midiNumber < lowestPitch.midiNumber) || (pitch.midiNumber > highestPitch.midiNumber)) {
      return undefined;
    } else {
      return pitch;
    }
  }
}