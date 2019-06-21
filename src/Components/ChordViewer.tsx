import * as React from "react";

import { ScaleViewer } from "./ScaleViewer";
import { ScaleType } from '../Scale';
import { ChordType } from '../Chord';

export interface IChordViewerProps {
  title?: string;
  chords?: Array<ChordType>;
  showGuitarFretboard?: boolean;
  isEmbedded?: boolean;
}
export class ChordViewer extends React.Component<IChordViewerProps, {}> {
  public constructor(props: IChordViewerProps) {
    super(props);
  }
  public render(): JSX.Element {
    const title = this.props.title ? this.props.title : "Chord Viewer";
    const chords = this.props.chords ? this.props.chords : ChordType.All;
    const showGuitarFretboard = (this.props.showGuitarFretboard !== undefined)
      ? this.props.showGuitarFretboard
      : true;

    const scales = chords
      .map(c => new ScaleType(c.name, c.pitchIntegers, c.formulaString));
    return <ScaleViewer
      scales={scales}
      title={title}
      playSimultaneously={true}
      showGuitarFretboard={showGuitarFretboard}
      isEmbedded={this.props.isEmbedded}
    />;
  }
}