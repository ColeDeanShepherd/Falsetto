import * as React from "react";

import { ScaleType, ScaleTypeGroup } from "../../lib/TheoryLib/Scale";
import { Button } from "../../ui/Button/Button";

export interface IScaleTypeSelectProps {
  scaleTypeGroups?: Array<ScaleTypeGroup>;
  value: [ScaleTypeGroup, ScaleType];
  onChange?: (newValue: [ScaleTypeGroup, ScaleType]) => void;
}

export class ScaleTypeSelect extends React.Component<IScaleTypeSelectProps, {}> {
  public render(): JSX.Element {
    const { value } = this.props;

    const scaleTypeGroups = this.props.scaleTypeGroups
      ? this.props.scaleTypeGroups
      : ScaleType.Groups;

    const [ scaleTypeGroup, scaleType ] = value;

    return (
      <div style={{textAlign: "center"}}>
        <h4 className="h6 margin-bottom">
          Category
        </h4>
        <div style={{padding: "1em 0"}}>
          {scaleTypeGroups.map(stg => {
            const buttonStyle: any = { };
            const isPressed = stg.name === scaleTypeGroup.name;
            if (isPressed) {
              buttonStyle.backgroundColor = "#959595";
            }

            return (
              <Button
                key={stg.name}
                onClick={event => this.onScaleTypeGroupClick(stg)}
                style={buttonStyle}
              >
                {stg.name}
              </Button>
            );
          })}
        </div>

        <h4 className="h6 margin-bottom">
          Type
        </h4>

        <div style={{padding: "1em 0"}}>
          {scaleTypeGroup.scaleTypes.map(st => {
            const buttonStyle: any = { };
            const isPressed = st.name === scaleType.name;
            if (isPressed) {
              buttonStyle.backgroundColor = "#959595";
            }

            return (
              <Button
                key={st.name}
                onClick={event => this.onScaleTypeClick(st)}
                style={buttonStyle}
              >
                {st.name}
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  private onScaleTypeGroupClick(scaleTypeGroup: ScaleTypeGroup) {
    const { onChange } = this.props;
    const [ _, scaleType ] = this.props.value;

    if (onChange) {
      onChange([scaleTypeGroup, scaleType]);
    }
  }

  private onScaleTypeClick(scaleType: ScaleType) {
    const { onChange } = this.props;
    const [ scaleTypeGroup, _ ] = this.props.value;

    if (onChange) {
      onChange([scaleTypeGroup, scaleType]);
    }
  }
}