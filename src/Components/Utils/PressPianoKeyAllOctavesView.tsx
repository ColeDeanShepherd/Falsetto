import * as React from "react";

import CheckCircle from '@material-ui/icons/CheckCircle';

import { Pitch, areMidiNumbersSamePitchClass } from '../../lib/TheoryLib/Pitch';

import { PlayablePianoKeyboard } from "../../Components/Utils/PlayablePianoKeyboard";
import { fullPianoLowestPitch, fullPianoHighestPitch } from './PianoUtils';
import { AppModel } from "../../App/Model";
import { ActionBus, ActionHandler } from "../../ActionBus";
import { IAction } from "../../IAction";
import { WebMidiInitializedAction, MidiDeviceConnectedAction, MidiDeviceDisconnectedAction, MidiInputDeviceChangedAction, MidiInputDevicePitchRangeChangedAction } from "../../AppMidi/Actions";
import { PianoKeyboardMetrics } from './PianoKeyboard';
import { getScaleTranslateTransformString } from '../../lib/Core/SvgUtils';
import { Vector2D } from '../../lib/Core/Vector2D';

export interface IPressPianoKeyAllOctavesViewProps {
  pitch: Pitch;
  maxWidth: number;
  onAllCorrectKeysPressed: () => void;
}

export interface IPressPianoKeyAllOctavesViewState {
  correctPressedPitches: Array<Pitch>;
}

export class PressPianoKeyAllOctavesView extends React.Component<IPressPianoKeyAllOctavesViewProps, IPressPianoKeyAllOctavesViewState> {
  public constructor(props: IPressPianoKeyAllOctavesViewProps) {
    super(props);

    this.boundHandleAction = this.handleAction.bind(this);
    this.boundOnKeyPress = this.onKeyPress.bind(this);
    this.boundRenderExtrasFn = this.renderExtrasFn.bind(this);

    this.state = {
      correctPressedPitches: []
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
    
    const pitchRange = midiModel.getMidiInputPitchRange();
    const lowestEnabledPitch = (pitchRange !== undefined) ? pitchRange[0] : undefined;
    const highestEnabledPitch = (pitchRange !== undefined) ? pitchRange[1] : undefined;

    const { pitch, maxWidth }  = this.props;
  
    return (
      <PlayablePianoKeyboard
        maxWidth={maxWidth}
        lowestPitch={fullPianoLowestPitch}
        highestPitch={fullPianoHighestPitch}
        lowestEnabledPitch={lowestEnabledPitch}
        highestEnabledPitch={highestEnabledPitch}
        onKeyPress={this.boundOnKeyPress}
        renderExtrasFn={this.boundRenderExtrasFn} />
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

    const correctPitch = this.props.pitch;

    if (pitch.midiNumberNoOctave === correctPitch.midiNumberNoOctave) {
      this.setState(
        {
          correctPressedPitches: this.state.correctPressedPitches.concat([pitch])
        },
        () => {
          if (this.wereAllCorrectPitchesPressed()) {
            onAllCorrectKeysPressed();
          }
        }
      );
    }
  }

  private wereAllCorrectPitchesPressed(): boolean {
    const { midiModel } = AppModel.instance;
    const { pitch } = this.props;
    const { correctPressedPitches } = this.state;
    
    const correctPitchMidiNumber = pitch.midiNumber;

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
      if (
        areMidiNumbersSamePitchClass(midiNumber, correctPitchMidiNumber) &&
        !correctPressedPitchMidiNumbers.has(midiNumber)
      ) {
        return false;
      }
    }

    return true;
  }
}