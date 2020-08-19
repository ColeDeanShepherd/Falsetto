import * as React from "react";

import { ChordTypeGroup } from "../../lib/TheoryLib/ChordTypeGroup";
import { ChordType } from "../../lib/TheoryLib/ChordType";
import { Button } from "../../ui/Button/Button";
import { ChordTypeGroupSelectView } from "./ChordTypeGroupSelectView";

export interface IChordTypeSelectViewProps {
  chordTypeGroups?: Array<ChordTypeGroup>;
  value: [ChordTypeGroup, ChordType];
  onChange?: (newValue: [ChordTypeGroup, ChordType]) => void;
}

export class ChordTypeSelectView extends React.Component<IChordTypeSelectViewProps, {}> {
  public render(): JSX.Element {
    const [ chordTypeGroup, chordType ] = this.props.value;

    return (
      <div>
        {<ChordTypeGroupSelectView
          chordTypeGroups={this.chordTypeGroups}
          value={chordTypeGroup}
          onChange={value => this.onChordTypeGroupClick(value)} />}

        <h4 className="h6 margin-bottom">
          Type
        </h4>
        <div style={{padding: "1em 0"}}>
          {chordTypeGroup.chordTypes.map(ct => {
            const style: any = { };
            
            const isPressed = ct.name === chordType.name;
            if (isPressed) {
              style.backgroundColor = "#959595";
            }

            return (
              <Button
                key={ct.name}
                onClick={event => this.onChordTypeClick(ct)}
                style={style}
              >
                {ct.name}
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

  private onChordTypeGroupClick(chordTypeGroup: ChordTypeGroup) {
    const { onChange } = this.props;
    if (!onChange) { return; }

    const [ _, chordType ] = this.props.value;
    
    onChange([chordTypeGroup, chordType]);
  }

  private onChordTypeClick(chordType: ChordType) {
    const { onChange } = this.props;
    if (!onChange) { return; }

    const [ chordTypeGroup, _ ] = this.props.value;
    
    onChange([chordTypeGroup, chordType]);
  }
}

