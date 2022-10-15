import * as React from "react";
import Vex from "vexflow";
import { VexFlowComponent } from './VexFlowComponent';
import { TimeSignature as TimeSignatureModel } from "../../lib/TheoryLib/TimeSignature";
import { Size2D } from '../../lib/Core/Size2D';

export interface TimeSignatureProps {
  timeSignature: TimeSignatureModel;
}
export class TimeSignature extends React.Component<TimeSignatureProps, {}> {
  public render(): JSX.Element {
    return <VexFlowComponent
      size={this.size}
      vexFlowRender={this.vexFlowRender.bind(this)}
    />;
  }

  private get size(): Size2D {
    return new Size2D(44, 44);
  }

  private vexFlowRender(context: Vex.IRenderContext) {
    context
      .setFont("Arial", 10)
      .setBackgroundFillStyle("#eed");

    const topStaff = new Vex.Flow.Stave(0, 0, this.size.width);
    topStaff.addTimeSignature(this.props.timeSignature.toString());
    topStaff.setY(-topStaff.getYForLine(0));
    
    topStaff.setContext(context).draw();
  }
}