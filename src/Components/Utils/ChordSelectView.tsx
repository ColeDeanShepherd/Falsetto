import * as React from "react";

import { Pitch } from "../../lib/TheoryLib/Pitch";
import { Button, Typography } from "@material-ui/core";
import { Chord } from "../../lib/TheoryLib/Chord";
import { ChordTypeGroup } from "../../lib/TheoryLib/ChordTypeGroup";
import { ChordType } from "../../lib/TheoryLib/ChordType";
import { ValidKeyPitchSelect } from '../Utils/ValidKeyPitchSelect';
import { ChordTypeSelectView } from "./ChordTypeSelectView";

export interface IChordSelectViewProps {
  chordTypeGroups?: Array<ChordTypeGroup>;
  value: [ChordTypeGroup, Chord];
  onChange?: (newValue: [ChordTypeGroup, Chord]) => void;
}

export class ChordSelectView extends React.Component<IChordSelectViewProps, {}> {
  public render(): JSX.Element {
    const { chordTypeGroups, onChange } = this.props;
    const [ chordTypeGroup, chord ] = this.props.value;

    const baseButtonStyle: any = { textTransform: "none" };

    return (
      <div>
        <Typography gutterBottom={true} variant="h6" component="h4">
          Root Pitch
        </Typography>
        <div style={{padding: "1em 0"}}>
          <ValidKeyPitchSelect
            preferredOctaveNumber={4}
            value={[chord.rootPitch]}
            onChange={rootPitches => this.onRootPitchClick(rootPitches[0])}
          />
        </div>
        
        <ChordTypeSelectView
          chordTypeGroups={chordTypeGroups}
          value={[chordTypeGroup, chord.type]}
          onChange={newValue => this.onChordTypeChange(newValue[0], newValue[1])} />
      </div>
    );
  }

  private get chordTypeGroups(): Array<ChordTypeGroup> {
    return this.props.chordTypeGroups
      ? this.props.chordTypeGroups
      : ChordType.Groups;
  }

  private onRootPitchClick(rootPitch: Pitch) {
    const { onChange } = this.props;
    if (!onChange) { return; }

    const [ chordTypeGroup, chord ] = this.props.value;

    const newChord = new Chord(chord.type, rootPitch);

    onChange([chordTypeGroup, newChord]);
  }

  private onChordTypeChange(chordTypeGroup: ChordTypeGroup, chordType: ChordType) {
    const { onChange } = this.props;
    if (!onChange) { return; }
    
    const [_, chord] = this.props.value;

    const newChord = new Chord(chordType, chord.rootPitch);
    
    onChange([chordTypeGroup, newChord]);
  }
}

