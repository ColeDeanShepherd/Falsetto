import * as React from "react";

import { PianoKeyboard } from "../../Components/Utils/PianoKeyboard";
import { fullPianoLowestPitch, fullPianoHighestPitch } from "../../Components/Utils/PianoUtils";
import { AppModel } from "../../App/Model";
import { ActionBus, ActionHandler } from "../../ActionBus";
import { MidiInputDevicePitchRangeChangedAction, WebMidiInitializedAction, MidiDeviceConnectedAction, MidiDeviceDisconnectedAction, MidiInputDeviceChangedAction } from '../../AppMidi/Actions';
import { IAction } from "../../IAction";
import { MidiNoteEventListener } from "./MidiNoteEventListener";
import { Pitch, expandPitchRangeToIncludePitch, getNumPitchesInRange } from '../../lib/TheoryLib/Pitch';
import { Button } from "../../ui/Button/Button";

export class MidiPianoRangeInput extends React.Component<{}, {}> {
  public constructor(props: {}) {
    super(props);

    this.boundHandleAction = this.handleAction.bind(this);
  }

  public render(): JSX.Element {
    const { midiModel } = AppModel.instance;

    const midiInput = midiModel.getMidiInput();

    if (midiInput) {
      const pitchRange = midiModel.getMidiInputPitchRange();
      const lowestEnabledPitch = (pitchRange !== undefined) ? pitchRange[0] : undefined;
      const highestEnabledPitch = (pitchRange !== undefined) ? pitchRange[1] : undefined;
      
      const midiInputPitchRange = midiModel.getMidiInputPitchRange();
      const numPitchesInRange = midiInputPitchRange
        ? getNumPitchesInRange(midiInputPitchRange)
        : 0;

      return (
        <div>
          <p>Press the leftmost and rightmost keys on your MIDI piano keyboard to detect the number of keys it has.</p>
          <p>{numPitchesInRange} Keys Detected:</p>

          <div>
            <PianoKeyboard
              lowestPitch={fullPianoLowestPitch}
              highestPitch={fullPianoHighestPitch}
              lowestEnabledPitch={lowestEnabledPitch}
              highestEnabledPitch={highestEnabledPitch} />
          </div>
            
          <p>
            <Button
              onClick={_ => this.reset()}
              style={{ textTransform: "none" }}
            >
              Reset Detected Keys
            </Button>
          </p>

          <MidiNoteEventListener
            onNoteOn={(pitch, velocity) => this.onKeyPress(pitch)}
            onNoteOff={pitch => this.onKeyRelease(pitch)} />
        </div>
      );
    } else {
      return <p>No MIDI input device selected!</p>;
    }
  }
  
  public componentDidMount() {
    ActionBus.instance.subscribe(this.boundHandleAction);
  }

  public componentWillUnmount() {
    ActionBus.instance.unsubscribe(this.boundHandleAction);
  }
  
  private boundHandleAction: ActionHandler;
  
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

  private reset() {
    const { midiModel } = AppModel.instance;
    midiModel.setMidiInputPitchRange(undefined);
  }
  
  private onKeyPress(pitch: Pitch) {
    const { pianoAudio, midiModel } = AppModel.instance;

    pianoAudio.pressKey(pitch, /*velocity*/ 1);

    const midiInputPitchRange = midiModel.getMidiInputPitchRange();

    // If the pitch range is undefined, create a one-pitch range including the pressed pitch.
    if (!midiInputPitchRange) {
      midiModel.setMidiInputPitchRange([pitch, pitch]);
    }
    // If the pitch range is defined, expand the pitch range to include the pressed pitch if necessary.
    else {
      const newMidiInputPitchRange = expandPitchRangeToIncludePitch(midiInputPitchRange, pitch);
      midiModel.setMidiInputPitchRange(newMidiInputPitchRange);
    }
  }

  private onKeyRelease(pitch: Pitch) {
    const { pianoAudio } = AppModel.instance;
    pianoAudio.releaseKey(pitch);
  }
}