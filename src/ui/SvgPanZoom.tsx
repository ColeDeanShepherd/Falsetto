import * as React from "react";

import svgPanZoom from "svg-pan-zoom";

export class SvgPanZoom extends React.Component<React.SVGProps<SVGSVGElement>, {}> {
  public constructor(props: React.SVGProps<SVGSVGElement>) {
    super(props);

    this.svgRef = React.createRef();
  }

  public componentDidMount() {
    svgPanZoom((this.svgRef as any).current);
  }

  public render(): JSX.Element {
    return (
      <svg ref={this.svgRef} {...this.props}>
        {this.props.children}
      </svg>
    );
  }

  private svgRef: React.Ref<SVGSVGElement>;
}