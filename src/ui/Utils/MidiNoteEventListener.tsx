import * as React from "react";
import { InputEventNoteon, InputEventNoteoff } from "webmidi";

import { Pitch } from "../../lib/TheoryLib/Pitch";

import { AppModel } from "../../App/Model";

import { IAction } from "../../IAction";
import { ActionHandler, ActionBus } from "../../ActionBus";
import { MidiDeviceConnectedAction, MidiDeviceDisconnectedAction, MidiInputDeviceChangedAction } from "../../AppMidi/Actions";
import { keyToPitch } from "../Tools/IntervalChordScaleFinder";

export interface IMidiNoteEventListenerProps {
  onNoteOn: (pitch: Pitch, velocity: number) => void;
  onNoteOff: (pitch: Pitch) => void;
  isComputerKeyboardPlayable?: boolean;
}

export class MidiNoteEventListener extends React.Component<IMidiNoteEventListenerProps, {}> {
  public constructor(props: IMidiNoteEventListenerProps) {
    super(props);

    this.boundHandleAction = this.handleAction.bind(this);
  }

  // #region React Functions
  
  public componentDidMount() {
    ActionBus.instance.subscribe(this.boundHandleAction);

    this.reinitializeMidi();
    this.registerKeyEventHandlers();
  }

  public componentWillUnmount() {
    AppModel.instance.pianoAudio.releaseAllKeys();

    this.unregisterKeyEventHandlers();
    this.uninitializeMidi();
    
    ActionBus.instance.unsubscribe(this.boundHandleAction);
  }

  public render() { return null; }

  // #endregion
  
  // #region Event Handlers

  private boundOnKeyDown: ((event: KeyboardEvent) => void) | undefined;
  private boundOnKeyUp: ((event: KeyboardEvent) => void) | undefined;
  
  private registerKeyEventHandlers() {
    this.boundOnKeyDown = this.onKeyDown.bind(this);
    window.addEventListener("keydown", this.boundOnKeyDown);
    
    this.boundOnKeyUp = this.onKeyUp.bind(this);
    window.addEventListener("keyup", this.boundOnKeyUp);
  }

  private unregisterKeyEventHandlers() {
    if (this.boundOnKeyDown) {
      window.removeEventListener("keydown", this.boundOnKeyDown);
      this.boundOnKeyDown = undefined;
    }

    if (this.boundOnKeyUp) {
      window.removeEventListener("keyup", this.boundOnKeyUp);
      this.boundOnKeyUp = undefined;
    }
  }

  private onKeyDown(event: KeyboardEvent) {
    const { onNoteOn } = this.props;

    const isComputerKeyboardPlayable = this.getIsComputerKeyboardPlayable();

    if (
      isComputerKeyboardPlayable &&
      onNoteOn &&
      (event.type === "keydown") &&
      !event.repeat
    ) {
      const pitch = keyToPitch(event.key);

      if (pitch !== null) {
        onNoteOn(pitch, /*velocity*/ 1);
      }
    }
  }

  private onKeyUp(event: KeyboardEvent) {
    const { onNoteOff } = this.props;

    const isComputerKeyboardPlayable = this.getIsComputerKeyboardPlayable();
    
    if (
      isComputerKeyboardPlayable &&
      onNoteOff &&
      (event.type === "keyup")
    ) {
      // Try to convert the key to a pitch & stop playing it.
      const pitch = keyToPitch(event.key);

      if (pitch !== null) {
        onNoteOff(pitch);
      }
    }
  }

  // #endregion

  private getIsComputerKeyboardPlayable(): boolean {
    const isComputerKeyboardPlayable = (this.props.isComputerKeyboardPlayable !== undefined)
      ? this.props.isComputerKeyboardPlayable
      : false;

    return isComputerKeyboardPlayable;
  }

  private boundHandleAction: ActionHandler;

  private handleAction(action: IAction) {
    switch (action.getId()) {
      case MidiDeviceConnectedAction.Id:
      case MidiDeviceDisconnectedAction.Id:
      case MidiInputDeviceChangedAction.Id:
        this.reinitializeMidi();
    }
  }
  
  // #region MIDI

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

  // #endregion
}