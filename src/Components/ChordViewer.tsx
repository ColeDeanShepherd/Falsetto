import * as React from "react";

import { ScaleViewer } from "./ScaleViewer";
import { allChords } from "../Chord";

export class ChordViewer extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return <ScaleViewer scales={allChords} typeTitle="Chord" playSimultaneously={true} />;
  }
}