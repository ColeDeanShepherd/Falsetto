import * as React from "react";

export interface ILevelProgressBarViewProps {
  percentToNextLevel: number;
}
export class LevelProgressBarView extends React.Component<ILevelProgressBarViewProps, {}> {
  public render(): JSX.Element {
    const { percentToNextLevel } = this.props;

    return (
      <div
        style={{
          width: "100%",
          height: "0.25em",
          backgroundColor: "lightgray",
          border: "1px solid grey"
        }}>
        <div
          style={{
            width: `${Math.round(100 * percentToNextLevel)}%`,
            height: "100%",
            backgroundColor: "#0A0"
          }}
        />
      </div>
    );
  }
}