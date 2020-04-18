import * as React from "react";
import { Button } from "@material-ui/core";

import { Rect2D } from "../../lib/Core/Rect2D";
import { Size2D } from "../../lib/Core/Size2D";
import { Vector2D } from "../../lib/Core/Vector2D";

import { PianoKeyboard } from "../../Components/Utils/PianoKeyboard";
import { fullPianoLowestPitch, fullPianoHighestPitch } from "../../Components/Utils/PianoUtils";
import { AppModel } from "../../App/Model";
import { ActionBus, ActionHandler } from "../../ActionBus";
import { MidiInputDevicePitchRangeChangedAction, WebMidiInitializedAction, MidiDeviceConnectedAction, MidiDeviceDisconnectedAction, MidiInputDeviceChangedAction } from '../../AppMidi/Actions';
import { IAction } from "../../IAction";
import { MidiNoteEventListener } from "./MidiNoteEventListener";
import { Pitch, expandPitchRangeToIncludePitch, getPitchRange, getNumPitchesInRange } from '../../lib/TheoryLib/Pitch';
import { fullPianoAspectRatio } from './PianoUtils';

export class MidiPianoRangeInput extends React.Component<{}, {}> {
  public constructor(props: {}) {
    super(props);

    this.boundHandleAction = this.handleAction.bind(this);
  }

  public render(): JSX.Element {
    const { midiModel } = AppModel.instance;

    const midiInput = midiModel.getMidiInput();

    if (midiInput) {
      const lowestPitch = fullPianoLowestPitch;
      const highestPitch = fullPianoHighestPitch;
      const pressedPitches = this.getPianoKeyboardDarkenedPitches(lowestPitch, highestPitch);
      
      const midiInputPitchRange = midiModel.getMidiInputPitchRange();
      const numPitchesInRange = midiInputPitchRange
        ? getNumPitchesInRange(midiInputPitchRange)
        : 0;

      return (
        <div>
          <p>{numPitchesInRange} keys</p>

          <div>
            <PianoKeyboard
              rect={new Rect2D(new Size2D(fullPianoAspectRatio * 100, 100), new Vector2D(0, 0))}
              lowestPitch={lowestPitch}
              highestPitch={highestPitch}
              pressedPitches={pressedPitches}
              style={{ width: "100%", height: "auto" }} />
          </div>
            
          <p>
            <Button
              variant="contained"
              onClick={_ => this.reset()}
              style={{ textTransform: "none" }}
            >
              Reset
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

  private getPianoKeyboardDarkenedPitches(lowestKeyboardPitch: Pitch, highestKeyboardPitch: Pitch): Array<Pitch> {
    const { midiModel } = AppModel.instance;

    const pitchRange = midiModel.getMidiInputPitchRange();

    // If the pitch range is undefined, return all of the pitches.
    if (!pitchRange) {
      return getPitchRange(lowestKeyboardPitch, highestKeyboardPitch);
    }
    // If the pitch range is defined, return all of the pitches outside of the range.
    else {
      return getPitchRange(lowestKeyboardPitch, Pitch.addHalfSteps(pitchRange[0], -1))
        .concat(getPitchRange(Pitch.addHalfSteps(pitchRange[1], 1), highestKeyboardPitch))
    }
  }
}