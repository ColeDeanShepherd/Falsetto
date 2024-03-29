import * as React from "react";
import Vex from "vexflow";
import { Size2D } from '../../lib/Core/Size2D';

export interface IVexFlowComponentProps {
  size: Size2D;
  vexFlowRender: (context: Vex.IRenderContext, size: Size2D) => void
}
export class VexFlowComponent extends React.Component<IVexFlowComponentProps, {}> {
  public constructor(props: IVexFlowComponentProps) {
    super(props);
    this.containerRef = React.createRef();
  }
  public componentDidMount() {
    const div = (this.containerRef as any).current;
    if (!div) {
      return;
    }

    this.vexFlowRenderer = new Vex.Flow.Renderer(div, (Vex.Flow.Renderer as any).Backends.SVG);
    this.vexFlowRenderer.resize(this.props.size.width, this.props.size.height);

    this.vexFlowContext = this.vexFlowRenderer.getContext();

    if (this.props.vexFlowRender) {
      this.props.vexFlowRender(this.vexFlowContext, new Size2D(this.props.size.width, this.props.size.height));
    }
  }
  public componentDidUpdate(prevProps: IVexFlowComponentProps, prevState: {}, snapshot: any) {
    if (this.vexFlowRenderer && this.vexFlowContext && this.props.vexFlowRender) {
      this.vexFlowContext.clear();
      this.vexFlowRenderer.resize(this.props.size.width, this.props.size.height);
      this.vexFlowContext.scale(1, 1); // Fix the viewbox after clear sets it and resize doesn't update it.
      this.props.vexFlowRender(
        this.vexFlowContext, new Size2D(this.props.size.width, this.props.size.height)
      );
    }
  }
  
  public render(): JSX.Element {
    return <div ref={this.containerRef} />;
  }
  
  private containerRef: React.Ref<HTMLDivElement>;
  private vexFlowRenderer: Vex.Flow.Renderer | null = null;
  private vexFlowContext: Vex.IRenderContext | null = null;
}