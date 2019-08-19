import * as React from "react";

import { StringedInstrumentNote } from '../../StringedInstrumentNote';
import { StringedInstrumentTuning } from './StringedInstrumentTuning';
import { StringedInstrumentMetrics, StringedInstrumentFingerboard } from './StringedInstrumentFingerboard';

export interface IViolinFingerboardProps {
  width: number;
  height: number;
  tuning: StringedInstrumentTuning;
  minFretNumber?: number;
  fretCount?: number;
  pressedNotes?: Array<StringedInstrumentNote>;
  renderExtrasFn?: (metrics: StringedInstrumentMetrics) => JSX.Element;
  style?: any;
}
export class ViolinFingerboard extends React.Component<IViolinFingerboardProps, {}> {
  public render(): JSX.Element {
    return (
      <StringedInstrumentFingerboard
        width={this.props.width} height={this.props.height}
        tuning={this.props.tuning}
        hasFrets={false}
        minFretNumber={this.props.minFretNumber}
        fretCount={this.props.fretCount}
        positionLineFretNumbers={this.positionLineFretNumbers}
        pressedNotes={this.props.pressedNotes}
        renderExtrasFn={this.props.renderExtrasFn}
        style={this.props.style} />
    );
  }

  private positionLineFretNumbers = [2, 3, 5, 7, 8];
}