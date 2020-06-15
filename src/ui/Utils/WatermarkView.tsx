import * as React from "react";

export interface IWatermarkViewProps {
  isEmbedded: boolean;
}
export class WatermarkView extends React.Component<IWatermarkViewProps, {}> {
  public render(): JSX.Element {
    const { isEmbedded } = this.props;

    const watermarkStyle: any = {
      display: isEmbedded ? "block" : "none",
      position: "absolute",
      bottom: 0,
      right: 0,
      margin: "0.25em",
      fontWeight: "bold",
      opacity: 0.25
    };

    return <p style={watermarkStyle} className="watermark">https://falsetto.app</p>;
  }
}