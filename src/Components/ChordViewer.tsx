import * as React from "react";

import { ScaleViewer } from "./ScaleViewer";
import { allChords } from "../Chord";

export interface IChordViewerProps {
  isEmbedded?: boolean;
}
export class ChordViewer extends React.Component<IChordViewerProps, {}> {
  public constructor(props: IChordViewerProps) {
    super(props);
  }
  public render(): JSX.Element {
    return <ScaleViewer scales={allChords} typeTitle="Chord" playSimultaneously={true} isEmbedded={this.props.isEmbedded} />;
  }
}