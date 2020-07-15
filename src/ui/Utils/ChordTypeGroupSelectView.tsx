import * as React from "react";

import { ChordTypeGroup } from "../../lib/TheoryLib/ChordTypeGroup";
import { ChordType } from "../../lib/TheoryLib/ChordType";
import { Button } from "../../ui/Button/Button";

export interface IChordTypeGroupSelectViewProps {
  chordTypeGroups?: Array<ChordTypeGroup>;
  value: ChordTypeGroup;
  onChange?: (newValue: ChordTypeGroup) => void;
}

export function ChordTypeGroupSelectView(props: IChordTypeGroupSelectViewProps): JSX.Element | null {
  const { value, onChange } = props;
  
  const chordTypeGroups = props.chordTypeGroups
    ? props.chordTypeGroups
    : ChordType.Groups;

  return (chordTypeGroups.length > 1) ? (
    <div>
      <h4 className="h6 margin-bottom">
        Category
      </h4>
      <div style={{padding: "1em 0"}}>
        {chordTypeGroups.map(ctg => {
          const style: any = { };
          
          const isPressed = ctg.name === value.name;
          if (isPressed) {
            style.backgroundColor = "#959595";
          }
          
          return (
            <Button
              key={ctg.name}
              onClick={event => { if (onChange) { onChange(ctg); } }}
              style={style}
            >
              {ctg.name}
            </Button>
          );
        })}
      </div>
    </div>
  ) : null;
}