import * as React from "react";
import { InputEventNoteon, InputEventNoteoff } from "webmidi";

import { Pitch } from "../../lib/TheoryLib/Pitch";

import { AppModel } from "../../App/Model";

import { IAction } from "../../IAction";
import { ActionHandler, ActionBus } from "../../ActionBus";
import { MidiDeviceConnectedAction, MidiDeviceDisconnectedAction, MidiInputDeviceChangedAction } from "../../AppMidi/Actions";

export interface IMidiNoteEventListenerProps {
  onNoteOn: (pitch: Pitch, velocity: number) => void,
  onNoteOff: (pitch: Pitch) => void
}

export class MidiNoteEventListener extends React.Component<IMidiNoteEventListenerProps, {}> {
  public constructor(props: IMidiNoteEventListenerProps) {
    super(props);

    this.boundHandleAction = this.handleAction.bind(this);
  }

  private boundHandleAction: ActionHandler;
  
  public componentDidMount() {
    this.reinitializeMidi();
    ActionBus.instance.subscribe(this.boundHandleAction);
  }

  public componentWillUnmount() {
    ActionBus.instance.unsubscribe(this.boundHandleAction);
    AppModel.instance.pianoAudio.releaseAllKeys();
    this.uninitializeMidi();
  }

  public render() { return null; }
  
  private handleAction(action: IAction) {
    switch (action.getId()) {
      case MidiDeviceConnectedAction.Id:
      case MidiDeviceDisconnectedAction.Id:
      case MidiInputDeviceChangedAction.Id:
        this.reinitializeMidi();
    }
  }
  private onNoteOn: ((event: InputEventNoteon) => void) | undefined = undefined;
  private onNoteOff: ((event: InputEventNoteoff) => void) | undefined = undefined;
  private disconnectFromMidiInput: (() => void) | undefined = undefined;

  private async reinitializeMidi() {
    await AppModel.instance.midiModel.initializeMidiPromise;

    this.uninitializeMidi();
    
    const midiInput = AppModel.instance.midiModel.getMidiInput();

    if (midiInput) {
      this.onNoteOn = event => {
        const pitch = Pitch.createFromMidiNumber(event.note.number);
        
        if (this.props.onNoteOn) {
          this.props.onNoteOn(pitch, event.velocity);
        }
      };
      this.onNoteOff = event => {
        const pitch = Pitch.createFromMidiNumber(event.note.number);
        
        if (this.props.onNoteOff) {
          this.props.onNoteOff(pitch);
        }
      };

      this.disconnectFromMidiInput = () => {
        if (midiInput) {
          if (this.onNoteOn) {
            midiInput.removeListener("noteon", "all", this.onNoteOn);
          }
          
          if (this.onNoteOff) {
            midiInput.removeListener("noteoff", "all", this.onNoteOff);
          }
        }
      };
  
      midiInput.addListener("noteon", "all", this.onNoteOn);
      midiInput.addListener("noteoff", "all", this.onNoteOff);
    }
  }

  private async uninitializeMidi() {
    if (this.disconnectFromMidiInput) {
      this.disconnectFromMidiInput();
      this.disconnectFromMidiInput = undefined;
    }
  }
}