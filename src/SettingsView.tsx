import * as React from "react";
import { Select, MenuItem } from '@material-ui/core';
import WebMidi from "webmidi";

import { AppModel } from './App/Model';
import { ActionHandler, ActionBus } from './ActionBus';
import { MidiDeviceConnectedAction, MidiDeviceDisconnectedAction, MidiInputDeviceChangedAction } from './App/Actions';
import { IAction } from './IAction';

export class Settings extends React.Component<{}, {}> {
  public constructor(props: {}) {
    super(props);

    this.boundHandleAction = this.handleAction.bind(this);
  }

  private boundHandleAction: ActionHandler;
  public componentDidMount() {
    ActionBus.instance.subscribe(this.boundHandleAction);
  }
  public componentWillUnmount() {
    ActionBus.instance.unsubscribe(this.boundHandleAction);
  }
  
  public render() {
    const midiInput = AppModel.instance.getMidiInput();
    
    return WebMidi.enabled
      ? (
        <div style={{ paddingTop: "1em" }}>
          <h3>Settings</h3>
          <span style={{ paddingRight: "1em" }}>MIDI Input Device: </span>
          <Select value={midiInput ? midiInput.id : ""} onChange={e => this.onMidiInputChange(e.target.value)}>
            <MenuItem value="" key={""}>None</MenuItem>
            {WebMidi.inputs.map(i => <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>)}
          </Select>
        </div>
      )
      : (
        <div style={{ paddingTop: "1em" }}>
          <p>Your web browser does not support MIDI inputs.</p>
        </div>
      );
  }
  
  private handleAction(action: IAction) {
    switch (action.getId()) {
      case MidiDeviceConnectedAction.Id:
      case MidiDeviceDisconnectedAction.Id:
      case MidiInputDeviceChangedAction.Id:
        this.forceUpdate();
    }
  }

  private onMidiInputChange(inputId: string) {
    const newMidiInput = WebMidi.inputs.find(i => i.id === inputId);
    AppModel.instance.setMidiInput(newMidiInput);
  }
}