import * as React from "react";

import { MidiInputDeviceSelect } from '../ui/Utils/MidiInputDeviceSelect';
import { MidiPianoRangeInput } from "../ui/Utils/MidiPianoRangeInput";

export class Settings extends React.Component<{}, {}> {
  public render() {
    return (
      <div style={{ paddingTop: "1em" }}>
        <h3>Settings</h3>
        <div><MidiInputDeviceSelect /></div>
        <br />
        <div style={{ width: `${1000}px` }}><MidiPianoRangeInput /></div>
      </div>
    );
  }
}