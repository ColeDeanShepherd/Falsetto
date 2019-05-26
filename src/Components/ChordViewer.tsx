import * as React from "react";

import { ScaleViewer } from "./ScaleViewer";
import { allChords } from "../Chord";
import { Scale } from '../Scale';

export interface IChordViewerProps {
  isEmbedded?: boolean;
}
export class ChordViewer extends React.Component<IChordViewerProps, {}> {
  public constructor(props: IChordViewerProps) {
    super(props);
  }
  public render(): JSX.Element {
    const allScales = allChords
      .map(c => new Scale(c.type, c.formulaString));
    return <ScaleViewer scales={allScales} typeTitle="Chord" playSimultaneously={true} isEmbedded={this.props.isEmbedded} />;
  }
}