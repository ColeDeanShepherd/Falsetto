import * as React from "react";

import { StringedInstrumentMetrics } from "../Utils/StringedInstrumentFingerboard";
import { StringedInstrumentTuning } from "../../lib/TheoryLib/StringedInstrumentTuning";
import { StringedInstrumentNote } from '../../lib/TheoryLib/StringedInstrumentNote';
import { Vector2D } from '../../lib/Core/Vector2D';
import { range } from '../../lib/Core/MathUtils';
import { flattenArrays } from '../../lib/Core/ArrayUtils';

export function renderStringedInstrumentNoteInputs(
  metrics: StringedInstrumentMetrics,
  tuning: StringedInstrumentTuning,
  shouldRenderFretInputFn: (note: StringedInstrumentNote) => boolean,
  selectedNotes: Array<StringedInstrumentNote>,
  onNoteSelected: (note: StringedInstrumentNote) => void
): JSX.Element {
  const stringIndices = range(0, metrics.stringCount - 1);
  const fretNumbers = range(metrics.minFretNumber, metrics.minFretNumber + metrics.fretCount);
  
  const buttonRadius = 0.9 * metrics.fretDotRadius;
  const buttonStyle: any = { cursor: "pointer" };

  const buttons = flattenArrays(
    stringIndices.map(stringIndex =>
      fretNumbers.map(fretNumber => {
        const note = tuning.getNote(stringIndex, fretNumber);

        if (!shouldRenderFretInputFn(note)) {
          return null;
        }
        
        const position = new Vector2D(
          metrics.getNoteX(fretNumber),
          metrics.getStringY(stringIndex)
        );
        const isSelected = selectedNotes.some(n => n.equals(note));

        return (
          <circle
            cx={position.x}
            cy={position.y}
            r={buttonRadius}
            fill={!isSelected ? "white" : "lightblue"}
            fillOpacity={!isSelected ? 0.1 : 1}
            stroke="gray"
            strokeWidth="1"
            onClick={e => onNoteSelected(note)}
            style={buttonStyle}
          />          
        );
      })
    )
  );

  return (
    <g>
      {buttons}
    </g>
  );
}