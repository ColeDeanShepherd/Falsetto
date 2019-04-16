import * as React from "react";
import * as Vex from "vexflow";
import { VexFlowComponent } from './VexFlowComponent';

export interface TimeSignatureProps {
  beatCount: number;
  beatType: number;
}
export class TimeSignature extends React.Component<TimeSignatureProps, {}> {
  public render(): JSX.Element {
    return <VexFlowComponent
      width={this.width} height={this.height}
      vexFlowRender={this.vexFlowRender.bind(this)}
    />;
  }

  private get height(): number {
    return 44;
  }
  private get width(): number {
    return this.height;
  }

  private vexFlowRender(context: Vex.IRenderContext) {
    context
      .setFont("Arial", 10)
      .setBackgroundFillStyle("#eed");

    const topStaff = new Vex.Flow.Stave(0, 0, this.width);
    topStaff.addTimeSignature(`${this.props.beatCount}/${this.props.beatType}`);
    topStaff.setY(-topStaff.getYForLine(0));
    
    topStaff.setContext(context).draw();
  }
}