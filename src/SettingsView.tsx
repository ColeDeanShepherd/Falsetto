import * as React from "react";

import { MidiInputDeviceSelect } from './Components/Utils/MidiInputDeviceSelect';

export class Settings extends React.Component<{}, {}> {
  public render() {
    return (
      <div style={{ paddingTop: "1em" }}>
        <h3>Settings</h3>
        <MidiInputDeviceSelect />
      </div>
    );
  }
}