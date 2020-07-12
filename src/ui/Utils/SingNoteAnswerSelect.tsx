import * as React from "react";

import { FlashCardStudySessionInfo } from "../../FlashCardSet";
import { Pitch } from "../../lib/TheoryLib/Pitch";

import { Tuner } from '../Tools/Tuner';
import { DetectedPitch } from '../PitchDetection';
import { AnswerDifficulty } from '../../Study/AnswerDifficulty';
import { PitchesAudioPlayer } from '../Utils/PitchesAudioPlayer';
import { Button } from "../../ui/Button/Button";

export interface ISingNoteAnswerSelectProps {
  info: FlashCardStudySessionInfo;
  preferUseMic: boolean;
  correctPitch: Pitch;
}

export interface ISingNoteAnswerSelectState {
  detectedPitch: DetectedPitch | null;
  useMicrophone: boolean;
}

export class SingNoteAnswerSelect extends React.Component<ISingNoteAnswerSelectProps, ISingNoteAnswerSelectState> {
  public constructor(props: ISingNoteAnswerSelectProps) {
    super(props);

    this.state = {
      detectedPitch: null,
      useMicrophone: props.preferUseMic
    };
  }

  public render() {
    const { preferUseMic } = this.props;

    const useMicrophone = this.state.useMicrophone && preferUseMic;

    return useMicrophone
    ? (
        <div>
          <Tuner
            isStandalone={false}
            showOctaveNumbers={false}
            alwaysShowLastPitch={true}
            onPitchChange={detectedPitch => this.setState({ detectedPitch: detectedPitch })}
            onMicrophoneError={error => this.onMicrophoneError(error)}
          />
          <div style={{padding: "1em 0"}}>
            <Button
              onClick={event => this.confirmAnswer()}
              disabled={!this.state.detectedPitch}
            >
              Confirm Answer
            </Button>
          </div>
        </div>
      )
      : (
        <div style={{ fontSize: "1.5em", margin: "0 0 2em 0" }}>
          <div style={{ marginBottom: "0.5em" }}>
            <PitchesAudioPlayer pitches={[this.getCorrectPitch()]} playSequentially={false}>
              Play Answer
            </PitchesAudioPlayer>
          </div>
          <div>
            <Button
              onClick={event => this.onUserProvidedCorrectness(AnswerDifficulty.Easy)}
            >
              I Was Correct
            </Button>
            <Button
              onClick={event => this.onUserProvidedCorrectness(AnswerDifficulty.Incorrect)}
            >
              I Was Incorrect
            </Button>
          </div>
        </div>
      );
  }

  private getCorrectPitch(): Pitch {
    return this.props.correctPitch;
  }

  private confirmAnswer() {
    if (!this.state.detectedPitch) { return; }

    const { info } = this.props;
    const correctPitch = this.getCorrectPitch();
    const answer = this.state.detectedPitch.pitch;

    const answerDifficulty = (answer.midiNumberNoOctave === correctPitch.midiNumberNoOctave)
      ? AnswerDifficulty.Easy
      : AnswerDifficulty.Incorrect;
    info.onAnswer(answerDifficulty, answer);
  }
  private onUserProvidedCorrectness(answerDifficulty: AnswerDifficulty) {
    const { info } = this.props;
    info.onAnswer(answerDifficulty, AnswerDifficulty[answerDifficulty]);

    if (answerDifficulty === AnswerDifficulty.Incorrect) {
      info.skipFlashCard();
    }
  }
  private onMicrophoneError(error: any) {
    alert("Failed initializing microphone. You must check your answers yourself. Error: " + error);
    this.setState({ useMicrophone: false });
  }
}