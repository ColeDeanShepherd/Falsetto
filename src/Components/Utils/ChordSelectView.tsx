import * as React from "react";

import { Pitch } from "../../lib/TheoryLib/Pitch";
import { Button, Typography } from "@material-ui/core";
import { Chord } from "../../lib/TheoryLib/Chord";
import { ChordTypeGroup } from "../../lib/TheoryLib/ChordTypeGroup";
import { ChordType } from "../../lib/TheoryLib/ChordType";
import { ValidKeyPitchSelect } from '../Utils/ValidKeyPitchSelect';

export interface IChordSelectViewProps {
  chordTypeGroups?: Array<ChordTypeGroup>;
  value: [ChordTypeGroup, Chord];
  onChange?: (newValue: [ChordTypeGroup, Chord]) => void;
}

export class ChordSelectView extends React.Component<IChordSelectViewProps, {}> {
  public render(): JSX.Element {
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
        
        {(this.chordTypeGroups.length > 1) ? (
          <div>
            <Typography gutterBottom={true} variant="h6" component="h4">
              Category
            </Typography>
            <div style={{padding: "1em 0"}}>
              {this.chordTypeGroups.map(chordTypeGroup => {
                return (
                  <Button
                    key={chordTypeGroup.name}
                    onClick={event => this.onChordTypeGroupClick(chordTypeGroup)}
                    variant="contained"
                    style={baseButtonStyle}
                  >
                    {chordTypeGroup.name}
                  </Button>
                );
              })}
            </div>
          </div>
        ) : null}

        <Typography gutterBottom={true} variant="h6" component="h4">
          Type
        </Typography>
        <div style={{padding: "1em 0"}}>
          {chordTypeGroup.chordTypes.map(chordType => {
            const style: any = { ...baseButtonStyle };
            
            const isPressed = chordType.name === chord.type.name;
            if (isPressed) {
              style.backgroundColor = "#959595";
            }

            return (
              <Button
                key={chordType.name}
                onClick={event => this.onChordTypeClick(chordType)}
                variant="contained"
                style={style}
              >
                {chordType.name}
              </Button>
            );
          })}
        </div>
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

  private onChordTypeGroupClick(chordTypeGroup: ChordTypeGroup) {
    const { onChange } = this.props;
    if (!onChange) { return; }

    const [ _, chord ] = this.props.value;
    
    onChange([chordTypeGroup, chord]);
  }

  private onChordTypeClick(chordType: ChordType) {
    const { onChange } = this.props;
    if (!onChange) { return; }

    const [ chordTypeGroup, chord ] = this.props.value;
    
    const newChord = new Chord(chordType, chord.rootPitch);
    
    onChange([chordTypeGroup, newChord]);
  }
}

