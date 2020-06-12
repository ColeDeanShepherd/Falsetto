import * as React from "react";
import { Typography } from "@material-ui/core";

import { ScaleType, ScaleTypeGroup, Scale } from "../../lib/TheoryLib/Scale";
import { Pitch } from "../../lib/TheoryLib/Pitch";
import { ValidKeyPitchSelect } from '../Utils/ValidKeyPitchSelect';
import { ScaleTypeSelect } from "./ScaleTypeSelect";

export interface IScaleSelectProps {
  scaleTypeGroups?: Array<ScaleTypeGroup>;
  value: [ScaleTypeGroup, Scale];
  onChange?: (newValue: [ScaleTypeGroup, Scale]) => void;
}

export class ScaleSelect extends React.Component<IScaleSelectProps, {}> {
  public render(): JSX.Element {
    const { value, scaleTypeGroups } = this.props;
    const [ scaleTypeGroup, scale ] = value;

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
        
        <ScaleTypeSelect
          scaleTypeGroups={scaleTypeGroups}
          value={[scaleTypeGroup, scale.type]}
          onChange={([stg, st]) => this.onScaleTypeChange(stg, st)} />
      </div>
    );
  }

  private onRootPitchClick(rootPitch: Pitch) {
    const { onChange } = this.props;
    const [ scaleTypeGroup, scale ] = this.props.value;

    const newScale = new Scale(scale.type, rootPitch);

    if (onChange) {
      onChange([scaleTypeGroup, newScale]);
    }
  }

  private onScaleTypeChange(scaleTypeGroup: ScaleTypeGroup, scaleType: ScaleType) {
    const { onChange } = this.props;
    const [ _, scale ] = this.props.value;

    const newScale = new Scale(scaleType, scale.rootPitch);

    if (onChange) {
      onChange([scaleTypeGroup, newScale]);
    }
  }
}