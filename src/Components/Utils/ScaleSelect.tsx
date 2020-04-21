import * as React from "react";
import { Button, Card, CardContent, Typography } from "@material-ui/core";

import { ScaleType, ScaleTypeGroup, Scale } from "../../lib/TheoryLib/Scale";
import { Pitch } from "../../lib/TheoryLib/Pitch";
import { ValidKeyPitchSelect } from '../Utils/ValidKeyPitchSelect';

export interface IScaleSelectProps {
  scaleTypeGroups?: Array<ScaleTypeGroup>;
  value: [ScaleTypeGroup, Scale];
  onChange?: (newValue: [ScaleTypeGroup, Scale]) => void;
}

export class ScaleSelect extends React.Component<IScaleSelectProps, {}> {
  public render(): JSX.Element {
    const { value } = this.props;

    const scaleTypeGroups = this.props.scaleTypeGroups
      ? this.props.scaleTypeGroups
      : ScaleType.Groups;

    const [ scaleTypeGroup, scale ] = value;
    
    const baseButtonStyle: any = { textTransform: "none" };

    return (
      <div style={{textAlign: "center"}}>
        <Typography gutterBottom={true} variant="h6" component="h4">
          Root Pitch
        </Typography>
        <div style={{padding: "1em 0"}}>
          <ValidKeyPitchSelect
            preferredOctaveNumber={4}
            value={[scale.rootPitch]}
            onChange={rootPitches => this.onRootPitchClick(rootPitches[0])}
          />
        </div>
        
        <Typography gutterBottom={true} variant="h6" component="h4">
          Category
        </Typography>
        <div style={{padding: "1em 0"}}>
          {scaleTypeGroups.map(scaleTypeGroup => {
            return (
              <Button
                key={scaleTypeGroup.name}
                onClick={event => this.onScaleTypeGroupClick(scaleTypeGroup)}
                variant="contained"
                style={baseButtonStyle}
              >
                {scaleTypeGroup.name}
              </Button>
            );
          })}
        </div>

        <Typography gutterBottom={true} variant="h6" component="h4">
          Type
        </Typography>

        <div style={{padding: "1em 0"}}>
          {scaleTypeGroup.scaleTypes.map(scaleType => {
            const buttonStyle: any = { ...baseButtonStyle };
            const isPressed = scaleType.name === scale.type.name;
            if (isPressed) {
              buttonStyle.backgroundColor = "#959595";
            }

            return (
              <Button
                key={scaleType.name}
                onClick={event => this.onScaleTypeClick(scaleType)}
                variant="contained"
                style={buttonStyle}
              >
                {scaleType.name}
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  private onScaleTypeGroupClick(scaleTypeGroup: ScaleTypeGroup) {
    const { onChange } = this.props;
    const [ _, scale ] = this.props.value;

    if (onChange) {
      onChange([scaleTypeGroup, scale]);
    }
  }

  private onRootPitchClick(rootPitch: Pitch) {
    const { onChange } = this.props;
    const [ scaleTypeGroup, scale ] = this.props.value;

    const newScale = new Scale(scale.type, rootPitch);

    if (onChange) {
      onChange([scaleTypeGroup, newScale]);
    }
  }

  private onScaleTypeClick(scaleType: ScaleType) {
    const { onChange } = this.props;
    const [ scaleTypeGroup, scale ] = this.props.value;

    const newScale = new Scale(scaleType, scale.rootPitch);

    if (onChange) {
      onChange([scaleTypeGroup, newScale]);
    }
  }
}