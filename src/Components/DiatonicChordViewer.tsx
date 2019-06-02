import * as React from "react";

import { ScaleViewer } from "./ScaleViewer";
import { allChords } from "../Chord";
import { Scale } from '../Scale';

export interface IDiatonicChordViewerProps {
  title?: string;
  showGuitarFretboard?: boolean;
  isEmbedded?: boolean;
}
export class DiatonicChordViewer extends React.Component<IDiatonicChordViewerProps, {}> {
  public constructor(props: IDiatonicChordViewerProps) {
    super(props);
  }
  public render(): JSX.Element {
    const title = this.props.title ? this.props.title : "Chord Viewer";
    const chords = allChords;
    const showGuitarFretboard = (this.props.showGuitarFretboard !== undefined)
      ? this.props.showGuitarFretboard 
      : true;

    const scales = chords
      .map(c => new Scale(c.type, c.formulaString));
    return <ScaleViewer
      scales={scales}
      title={title}
      playSimultaneously={true}
      showGuitarFretboard={showGuitarFretboard}
      isEmbedded={this.props.isEmbedded}
    />;
  }
}