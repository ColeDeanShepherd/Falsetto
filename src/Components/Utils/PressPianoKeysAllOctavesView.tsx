import * as React from "react";

import CheckCircle from '@material-ui/icons/CheckCircle';

import { Pitch } from '../../lib/TheoryLib/Pitch';

import { PlayablePianoKeyboard } from "./PlayablePianoKeyboard";
import { fullPianoLowestPitch, fullPianoHighestPitch } from './PianoUtils';
import { AppModel } from "../../App/Model";
import { ActionBus, ActionHandler } from "../../ActionBus";
import { IAction } from "../../IAction";
import { WebMidiInitializedAction, MidiDeviceConnectedAction, MidiDeviceDisconnectedAction, MidiInputDeviceChangedAction, MidiInputDevicePitchRangeChangedAction } from "../../AppMidi/Actions";
import { PianoKeyboardMetrics } from './PianoKeyboard';
import { getScaleTranslateTransformString } from '../../lib/Core/SvgUtils';
import { Vector2D } from '../../lib/Core/Vector2D';

export interface IPressPianoKeysAllOctavesViewProps {
  pitches: Array<Pitch>;
  maxWidth: number;
  onAllCorrectKeysPressed: () => void;
}

export interface IPressPianoKeysAllOctavesViewState {
  correctPressedPitches: Array<Pitch>;
  areAllCorrectPitchesPressed: boolean;
}

export class PressPianoKeysAllOctavesView extends React.Component<IPressPianoKeysAllOctavesViewProps, IPressPianoKeysAllOctavesViewState> {
  public constructor(props: IPressPianoKeysAllOctavesViewProps) {
    super(props);

    this.boundHandleAction = this.handleAction.bind(this);
    this.boundOnKeyPress = this.onKeyPress.bind(this);
    this.boundRenderExtrasFn = this.renderExtrasFn.bind(this);

    this.state = {
      correctPressedPitches: [],
      areAllCorrectPitchesPressed: false
    };
  }

  public componentDidMount() {
    ActionBus.instance.subscribe(this.boundHandleAction);
  }

  public componentWillUnmount() {
    ActionBus.instance.unsubscribe(this.boundHandleAction);
  }

  public render(): JSX.Element {
    const { midiModel } = AppModel.instance;
    const { areAllCorrectPitchesPressed } = this.state;
    
    const pitchRange = midiModel.getMidiInputPitchRange();
    const lowestEnabledPitch = (pitchRange !== undefined) ? pitchRange[0] : undefined;
    const highestEnabledPitch = (pitchRange !== undefined) ? pitchRange[1] : undefined;

    const { maxWidth }  = this.props;
  
    return (
      <div>
        <PlayablePianoKeyboard
          maxWidth={maxWidth}
          lowestPitch={fullPianoLowestPitch}
          highestPitch={fullPianoHighestPitch}
          lowestEnabledPitch={lowestEnabledPitch}
          highestEnabledPitch={highestEnabledPitch}
          onKeyPress={this.boundOnKeyPress}
          renderExtrasFn={this.boundRenderExtrasFn} />
        {areAllCorrectPitchesPressed
          ? (
            <p>
              <i
                className="material-icons"
                style={{
                  color: "green",
                  display: "inline-block",
                  fontSize: "1.3em",
                  verticalAlign: "bottom"
                }}>
                check_circle
              </i>

              <span> Correct!</span>
            </p>
          )
          : null}
      </div>
    );
  }

  private renderExtrasFn(metrics: PianoKeyboardMetrics): JSX.Element {
    const { correctPressedPitches } = this.state;

    let correctIcons = new Array<JSX.Element>(correctPressedPitches.length);

    for (let i = 0; i < correctPressedPitches.length; i++) {
      const pitch = correctPressedPitches[i];
      const keyRect = metrics.getKeyRect(pitch);
      
      const unscaledIconWidth = 24;

      const iconScale = keyRect.size.width / 30;
      const iconWidth = iconScale * unscaledIconWidth;

      const iconTopLeftOffsetFromKey = new Vector2D(
        keyRect.size.width / 2,
        pitch.isWhiteKey
          ? (metrics.blackKeySize.height + ((metrics.whiteKeySize.height - metrics.blackKeySize.height) / 2))
          : (keyRect.size.height / 2)
      );
      const iconTopLeftPosition = keyRect.position.plus(iconTopLeftOffsetFromKey);
      const iconCenteringOffset = new Vector2D(-(iconWidth / 2), -(iconWidth / 2));
      const iconPosition = iconTopLeftPosition.plus(iconCenteringOffset);

      correctIcons[i] = (
        <CheckCircle
          nativeColor="green"
          component="g"
          transform={getScaleTranslateTransformString(iconScale, iconPosition)}
          className="pass-through-click"
        />
      );
    }

    return <g>{correctIcons}</g>
  }
  
  private boundHandleAction: ActionHandler;
  private boundOnKeyPress: (pitch: Pitch) => void;
  private boundRenderExtrasFn: (metrics: PianoKeyboardMetrics) => JSX.Element;
  
  private handleAction(action: IAction) {
    switch (action.getId()) {
      case WebMidiInitializedAction.Id:
      case MidiDeviceConnectedAction.Id:
      case MidiDeviceDisconnectedAction.Id:
      case MidiInputDeviceChangedAction.Id:
      case MidiInputDevicePitchRangeChangedAction.Id:
        this.forceUpdate();
    }
  }

  private onKeyPress(pitch: Pitch) {
    const { onAllCorrectKeysPressed } = this.props;

    const correctPitchMidiNumberNoOctaves = new Set<number>(
      this.props.pitches
        .map(p => p.midiNumberNoOctave)
    );

    if (correctPitchMidiNumberNoOctaves.has(pitch.midiNumberNoOctave)) {
      this.setState(
        {
          correctPressedPitches: this.state.correctPressedPitches.concat([pitch])
        },
        () => {
          if (this.wereAllCorrectPitchesPressed()) {
            this.setState({ areAllCorrectPitchesPressed: true }, () => {
              onAllCorrectKeysPressed();
            });
          }
        }
      );
    }
  }

  private wereAllCorrectPitchesPressed(): boolean {
    const { midiModel } = AppModel.instance;
    const { pitches } = this.props;
    const { correctPressedPitches } = this.state;
    
    const correctPitchMidiNumberNoOctaves = new Set<number>(
      this.props.pitches
        .map(p => p.midiNumberNoOctave)
    );

    const correctPressedPitchMidiNumbers = new Set<number>(
      correctPressedPitches
        .map(p => p.midiNumber)
    );

    const pitchRange = midiModel.getMidiInputPitchRange();
    const lowestEnabledPitch = (pitchRange !== undefined) ? pitchRange[0] : fullPianoLowestPitch;
    const highestEnabledPitch = (pitchRange !== undefined) ? pitchRange[1] : fullPianoHighestPitch;

    const lowestEnabledPitchMidiNumber = lowestEnabledPitch.midiNumber;
    const highestEnabledPitchMidiNumber = highestEnabledPitch.midiNumber;

    for (let midiNumber = lowestEnabledPitchMidiNumber; midiNumber <= highestEnabledPitchMidiNumber; midiNumber++) {
      const midiNumberNoOctave = Pitch.createFromMidiNumber(midiNumber).midiNumberNoOctave;

      if (
        correctPitchMidiNumberNoOctaves.has(midiNumberNoOctave) &&
        !correctPressedPitchMidiNumbers.has(midiNumber)
      ) {
        return false;
      }
    }

    return true;
  }
}