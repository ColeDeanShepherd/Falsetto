import * as React from 'react';
import * as Vex from 'vexflow';

export interface IVexFlowComponentProps {
  width: number;
  height: number;
  vexFlowRender: (context: Vex.IRenderContext) => void
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

    const renderer = new Vex.Flow.Renderer(div, Vex.Flow.Renderer.Backends.SVG);
    renderer.resize(this.props.width, this.props.height);

    this.vexFlowContext = renderer.getContext();

    if (this.props.vexFlowRender) {
      this.props.vexFlowRender(this.vexFlowContext);
    }
  }
  public componentDidUpdate(prevProps: IVexFlowComponentProps, prevState: {}, snapshot: any) {
    if (this.vexFlowContext && this.props.vexFlowRender) {
      this.vexFlowContext.clear();
      this.props.vexFlowRender(this.vexFlowContext);
    }
  }
  
  public render(): JSX.Element {
    return <div ref={this.containerRef} />;
  }
  
  private containerRef: React.Ref<HTMLDivElement>;
  private vexFlowContext: Vex.IRenderContext | null = null;
}