import * as React from "react";
import ResizeObserver from "resize-observer-polyfill";
import { Size2D } from '../../lib/Core/Size2D';

export interface ISizeAwareContainerProps {
  height: number;
  onResize?: (size: Size2D) => void;
}
export class SizeAwareContainer extends React.Component<ISizeAwareContainerProps, {}> {
  public constructor(props: ISizeAwareContainerProps) {
    super(props);

    this.containerRef = React.createRef();
    this.containerResizeObserver = null;
  }

  public componentDidMount() {
    this.containerResizeObserver = new ResizeObserver((entries, observer) => {
      this.onResize();
    });
    
    this.containerResizeObserver.observe((this.containerRef as any).current);

    this.forceUpdate();
  }
  public componentWillUnmount() {
    if (this.containerResizeObserver) {
      this.containerResizeObserver.disconnect();
    }
  }
  public componentDidUpdate() {
    if (!this.hasHandledInitialResize) {
      this.onResize();
      this.hasHandledInitialResize = true;
    }
  }

  public render(): JSX.Element {
    return <div ref={this.containerRef} style={{ height: `${this.props.height}px` }}>{this.props.children}</div>;
  }
  
  private hasHandledInitialResize: boolean = false;
  private containerRef: React.Ref<HTMLDivElement>;
  private containerResizeObserver: ResizeObserver | null;

  private onResize() {
    if (this.props.onResize && this.containerRef) {
      const containerElement = (this.containerRef as any).current;
      const newSize = new Size2D(containerElement.offsetWidth, containerElement.offsetHeight);
      this.props.onResize(newSize);
    }
  }
}