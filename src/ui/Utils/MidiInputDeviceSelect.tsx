import * as React from "react";
import { Select, MenuItem } from '@material-ui/core';
import { WebMidi } from "webmidi";

import { AppModel } from '../../App/Model';
import { ActionHandler, ActionBus } from '../../ActionBus';
import { MidiDeviceConnectedAction, MidiDeviceDisconnectedAction, MidiInputDeviceChangedAction, WebMidiInitializedAction } from '../../AppMidi/Actions';
import { IAction } from '../../IAction';

export class MidiInputDeviceSelect extends React.Component<{}, {}> {
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
    const midiInput = AppModel.instance.midiModel.getMidiInput();
    
    return WebMidi.enabled
      ? (
        <span>
          <span style={{ paddingRight: "1em" }}>MIDI Input Device: </span>
          <Select value={midiInput ? midiInput.id : -1} onChange={e => this.onMidiInputChange(e.target.value)}>
            <MenuItem key={-1} value={-1}>None</MenuItem>
            {WebMidi.inputs.map(i => <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>)}
          </Select>
        </span>
      )
      : <p>Your web browser does not support MIDI inputs. <a href="https://caniuse.com/#feat=midi" target="_blank">Click here</a> to find a browser which does.</p>;
  }
  
  private handleAction(action: IAction) {
    switch (action.getId()) {
      case WebMidiInitializedAction.Id:
      case MidiDeviceConnectedAction.Id:
      case MidiDeviceDisconnectedAction.Id:
      case MidiInputDeviceChangedAction.Id:
        this.forceUpdate();
    }
  }

  private onMidiInputChange(inputId: any) {
    const newMidiInput = WebMidi.inputs.find(i => i.id === inputId);
    AppModel.instance.midiModel.setMidiInput(newMidiInput);
  }
}