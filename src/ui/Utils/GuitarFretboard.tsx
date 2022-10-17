import * as React from "react";

import * as Utils from "../../lib/Core/Utils";
import { Pitch } from "../../lib/TheoryLib/Pitch";
import { Size2D } from '../../lib/Core/Size2D';
import { Rect2D } from '../../lib/Core/Rect2D';
import { Vector2D } from '../../lib/Core/Vector2D';
import { ScaleType, Scale } from '../../lib/TheoryLib/Scale';
import { Chord } from '../../lib/TheoryLib/Chord';
import { StringedInstrumentNote } from '../../lib/TheoryLib/StringedInstrumentNote';
import { getStandardGuitarTuning, StringedInstrumentTuning } from '../../lib/TheoryLib/StringedInstrumentTuning';
import { StringedInstrumentMetrics, StringedInstrumentFingerboard } from './StringedInstrumentFingerboard';
import { arrayMin, arrayMax } from '../../lib/Core/ArrayUtils';
import { precondition } from '../../lib/Core/Dbc';
import { mod, range } from '../../lib/Core/MathUtils';

export function generateGuitarScaleTextDiagram(scale: Scale, stringCount: number): string {
  const minFretNumber = 1;
  const maxFretNumber = 17;
  const tuning = getStandardGuitarTuning(stringCount);
  const pitches = scale.getPitches();
  const guitarNotes = getPreferredGuitarScaleShape(scale, tuning);
  
  let diagram = "";

  // strings
  for (let stringIndex = (stringCount - 1); stringIndex >= 0; stringIndex--) {
    let stringText = tuning.openStringPitches[stringIndex].toOneAccidentalAmbiguousString(false);
    stringText += " |";

    for (let fretNumber = minFretNumber; fretNumber <= maxFretNumber; fretNumber++) {
      if (guitarNotes.some(gn => (gn.stringIndex === stringIndex) && (gn.getFretNumber(tuning) === fretNumber))) {
        const fretPitch = tuning.getNote(stringIndex, fretNumber).pitch;
        const scaleDegreeNumber = 1 + pitches.findIndex(p => p.midiNumberNoOctave === fretPitch.midiNumberNoOctave);
        stringText += `-${scaleDegreeNumber}-|`;
      } else {
        stringText += "---|";
      }
    }

    diagram += stringText;
    diagram += "\n";
  }

  // fret numbers
  let fretNumbersText = "   ";

  for (let fretNumber = minFretNumber; fretNumber <= maxFretNumber; fretNumber++) {
    const fretNumberString = fretNumber.toString();
    fretNumbersText += (fretNumberString.length == 2)
      ? `${fretNumberString}  `
      : ` ${fretNumberString}  `;
  }
  diagram += fretNumbersText;

  return diagram;
}

export function getPreferredGuitarScaleShape(
  scale: Scale, tuning: StringedInstrumentTuning
) {
  const scaleShapes = findGuitarScaleShapes(scale, tuning);
  scaleShapes.sort((shape1, shape2) => {
    // sort by fret range
    const shape1FretNumbers = shape1.map(gn => gn.getFretNumber(tuning));
    const shape1MinFretNumber = arrayMin(shape1FretNumbers);
    const shape1MaxFretNumber = arrayMax(shape1FretNumbers);
    const shape1FretRange = shape1MaxFretNumber - shape1MinFretNumber;
    
    const shape2FretNumbers = shape2.map(gn => gn.getFretNumber(tuning));
    const shape2MinFretNumber = arrayMin(shape2FretNumbers);
    const shape2MaxFretNumber = arrayMax(shape2FretNumbers);
    const shape2FretRange = shape2MaxFretNumber - shape2MinFretNumber;

    if (shape1FretRange < shape2FretRange) { return -1; }
    else if (shape1FretRange > shape2FretRange) { return 1; }

    // then by num notes descending
    if (shape1.length > shape2.length) { return -1; }
    else if (shape1.length < shape2.length) { return 1; }

    // break ties
    return -1;
  });
  return scaleShapes[0];
}

class GuitarScaleShapeFinderState {
  public guitarNotes: Array<StringedInstrumentNote> = new Array<StringedInstrumentNote>();
  public stringIndex: number = 0;
  public numNotesOnCurrentString: number = 0;

  public copy(): GuitarScaleShapeFinderState {
    const copy = new GuitarScaleShapeFinderState();
    copy.guitarNotes = this.guitarNotes.slice();
    copy.stringIndex = this.stringIndex;
    copy.numNotesOnCurrentString = this.numNotesOnCurrentString;

    return copy;
  }
}
export function findGuitarScaleShapes(
  scale: Scale, tuning: StringedInstrumentTuning
): Array<Array<StringedInstrumentNote>> {
    const { minNotesPerString, maxNotesPerString } = getPreferredNumNotesPerStringRange(scale.type);
    const scalePitches = scale.getPitches();

    const state = new GuitarScaleShapeFinderState();
    const outShapes = new Array<Array<StringedInstrumentNote>>();
    findGuitarScaleShapesRecursive(scalePitches, tuning, minNotesPerString, maxNotesPerString, state, outShapes);

    return outShapes;
}
export function findGuitarScaleShapesRecursive(
  scalePitches: Array<Pitch>, tuning: StringedInstrumentTuning,  minNotesPerString: number, maxNotesPerString: number,
  state: GuitarScaleShapeFinderState,
  outShapes: Array<Array<StringedInstrumentNote>>
) {
  function addNoteToString(state: GuitarScaleShapeFinderState, note: StringedInstrumentNote) {
    state.guitarNotes.push(note);
    state.numNotesOnCurrentString++;
  }
  function moveToNextString(state: GuitarScaleShapeFinderState) {
    state.stringIndex++;
    state.numNotesOnCurrentString = 0;
  }

  while (state.stringIndex < tuning.stringCount) {
    const i = state.guitarNotes.length;
    const scalePitch = scalePitches[i % scalePitches.length];
    const deltaOctave = Math.floor(i / scalePitches.length);
    const pitch = new Pitch(scalePitch.letter, scalePitch.signedAccidental, scalePitch.octaveNumber + deltaOctave);
    const guitarNoteSameString = new StringedInstrumentNote(pitch, state.stringIndex);

    // On all string, add notes until at the min.
    // Until at max:
      // Branch and try to add note on: same string, AND next string
    
    // Add notes to the current string until we're at the min.
    // If the min is also the max, move to the next string.
    if (state.numNotesOnCurrentString < minNotesPerString) {
      addNoteToString(state, guitarNoteSameString);
      
      if (state.numNotesOnCurrentString === maxNotesPerString) {
        moveToNextString(state);
      }
    } else {
      // We're between the min. & max. # of notes per string.

      // Try putting the note on the next string.
      const nextStringState = state.copy();
      moveToNextString(nextStringState);
      findGuitarScaleShapesRecursive(scalePitches, tuning, minNotesPerString, maxNotesPerString, nextStringState, outShapes);

      // Try continuing with the note on the current string.
      addNoteToString(state, guitarNoteSameString);
      
      if (state.numNotesOnCurrentString === maxNotesPerString) {
        moveToNextString(state);
      }
    }
  }

  outShapes.push(state.guitarNotes);
}

// TODO: Add integer interval type?
export function getPreferredNumNotesPerStringRange(scaleType: ScaleType): ({ minNotesPerString: number, maxNotesPerString: number, preferredNotesPerString: number }) {
  switch (scaleType.numPitches) {
    case 5:
      return {
        minNotesPerString: 2,
        maxNotesPerString: 2,
        preferredNotesPerString: 2
      };
    case 6:
      return {
        minNotesPerString: 2,
        maxNotesPerString: 3,
        preferredNotesPerString: 2
      };
    case 7:
      return {
        minNotesPerString: 3,
        maxNotesPerString: 3,
        preferredNotesPerString: 3
      };
    case 8:
      return {
        minNotesPerString: 3,
        maxNotesPerString: 4,
        preferredNotesPerString: 3
      };
    case 12:
      return {
        minNotesPerString: 4,
        maxNotesPerString: 4,
        preferredNotesPerString: 4
      };
    default:
      throw new Error(`Unsupported scale length: ${scaleType.numPitches}`);
  }
}

export function findGuitarChordShape(
  chord: Chord, inversion: number, firstStringIndex: number,
  tuning: StringedInstrumentTuning
): Array<StringedInstrumentNote> {
  precondition((inversion >= 0) && (inversion < chord.type.pitchCount));
  precondition((firstStringIndex >= 0) && (firstStringIndex < tuning.stringCount));

  const pitches = chord.getPitches();

  let guitarNotes = new Array<StringedInstrumentNote>();

  for (let i = 0; i < pitches.length; i++) {
    const pitch = pitches[mod(i + (inversion - 1), pitches.length)];
    const stringIndex = firstStringIndex + i;

    guitarNotes.push(new StringedInstrumentNote(pitch, stringIndex));
  }

  return guitarNotes;
}

export function renderGuitarNoteHighlightsAndLabels(
  metrics: StringedInstrumentMetrics, notes: Array<StringedInstrumentNote>, highlightStyle: string,
  getLabelsFn: (n: StringedInstrumentNote, i: number) => string
) {
  const rootPitchFretDots = notes
    .map((note, noteIndex) => {
      const tuning = getStandardGuitarTuning(metrics.stringCount);
      const fretNumber = note.getFretNumber(tuning);
      let x = metrics.getNoteX(fretNumber);
      if (fretNumber == 0) {
        x -= 0.3 * metrics.fretSpacing;
      }

      const y = metrics.getStringY(note.stringIndex);

      const noteLabel = getLabelsFn(note, noteIndex) ;

      const isShortLabel = noteLabel.length <= 1;
      const fontSize = isShortLabel ? 11 : 8;
      const textStyle: any = {
        fontSize: `${fontSize}px`,
        fontWeight: "bold",
        textAnchor: "middle"
      };
      
      const rectSize = new Size2D(
        0.7 * metrics.fretSpacing,
        0.6 * metrics.stringSpacing
      );
      const rect = new Rect2D(
        rectSize,
        new Vector2D(
          x - (rectSize.width / 2),
          y - (rectSize.height / 2)
        )
      );

      const textX = rect.center.x;
      const textY = rect.bottom - (isShortLabel ? 1 : 2.5);

      return (
        <g>
          <rect
            x={x - (rectSize.width / 2)} y={y - (rectSize.height / 2)}
            width={rectSize.width} height={rectSize.height}
            fill={highlightStyle} fillOpacity={1} strokeWidth="0" />
          <text
            x={textX} y={textY}
            style={textStyle}>{noteLabel}</text>
        </g>
      );
    });
  
  return <g>{rootPitchFretDots}</g>;
}
export function renderGuitarNoteHighlightsAndNoteNames(
  metrics: StringedInstrumentMetrics, notes: Array<StringedInstrumentNote>, highlightStyle: string
) {
  return renderGuitarNoteHighlightsAndLabels(
    metrics, notes, highlightStyle, (n, _) => n.pitch.toOneAccidentalAmbiguousString(false, false)
  );
}
export function renderGuitarFretboardScaleExtras(
  metrics: StringedInstrumentMetrics, scale: Scale,
  renderAllScaleShapes: boolean = false
): JSX.Element {
  const tuning = getStandardGuitarTuning(metrics.stringCount);
  const pitches = scale.getPitches();
  const guitarNotes = renderAllScaleShapes
    ? (
      StringedInstrumentNote.allNotesOfPitches(
        tuning, pitches, 0, metrics.fretCount
      )
    )
    : getPreferredGuitarScaleShape(scale, tuning);
  const formulaStringParts = scale.type.formula.parts.map(p => p.toString());

  const rootPitchFretDots = guitarNotes
    .map((guitarNote, _) => {
      const pitchIndex = pitches.findIndex(p => p.midiNumberNoOctave === guitarNote.pitch.midiNumberNoOctave);
      const formulaStringPart = formulaStringParts[pitchIndex];

      const x = metrics.getNoteX(guitarNote.getFretNumber(tuning));
      const y = metrics.getStringY(guitarNote.stringIndex);
      const fill = "lightblue";
      
      const fontSize = 11;
      const textStyle: any = {
        fontSize: `${fontSize}px`,
        fontWeight: "bold",
        textAnchor: "middle"
      };

      const rectSize = new Size2D(
        0.7 * metrics.fretSpacing,
        0.6 * metrics.stringSpacing
      );
      const rect = new Rect2D(
        rectSize,
        new Vector2D(
          x - (rectSize.width / 2),
          y - (rectSize.height / 2)
        )
      );

      const textX = rect.center.x;
      const textY = rect.bottom - 1;

      return (
        <g>
          <rect
            x={rect.position.x} y={rect.position.y}
            width={rect.size.width} height={rect.size.height}
            fill={fill} strokeWidth="0" />
          <text x={textX} y={textY} style={textStyle}>{formulaStringPart}</text>
        </g>
      );
    });
  
  return (
    <g>
      {rootPitchFretDots}
      {renderFretNumbers(metrics)}
    </g>
  );
}
export function renderGuitarFretboardChordExtras(
  metrics: StringedInstrumentMetrics, chord: Chord
): JSX.Element {
  const tuning = getStandardGuitarTuning(metrics.stringCount);
  const pitches = chord.type.getPitches(chord.rootPitch);
  const guitarNotes = findGuitarChordShape(chord, 1, 0, tuning);
  const formulaStringParts = chord.type.formula.parts.map(p => p.toString());

  const rootPitchFretDots = guitarNotes
    .map((guitarNote, _) => {
      const pitchIndex = pitches.findIndex(p => p.midiNumberNoOctave === guitarNote.pitch.midiNumberNoOctave);
      const formulaStringPart = formulaStringParts[pitchIndex];

      const x = metrics.getNoteX(guitarNote.getFretNumber(tuning));
      const y = metrics.getStringY(guitarNote.stringIndex);
      const fill = "lightblue";
      
      const fontSize = 11;
      const textStyle: any = {
        fontSize: `${fontSize}px`,
        fontWeight: "bold",
        textAnchor: "middle"
      };

      const rectSize = new Size2D(
        0.7 * metrics.fretSpacing,
        0.6 * metrics.stringSpacing
      );
      const rect = new Rect2D(
        rectSize,
        new Vector2D(
          x - (rectSize.width / 2),
          y - (rectSize.height / 2)
        )
      );

      const textX = rect.center.x;
      const textY = rect.bottom - 1;

      return (
        <g>
          <rect
            x={rect.position.x} y={rect.position.y}
            width={rect.size.width} height={rect.size.height}
            fill={fill} strokeWidth="0" />
          <text x={textX} y={textY} style={textStyle}>{formulaStringPart}</text>
        </g>
      );
    });
  const labeledFretNumber = (metrics.minFretNumber === 0)
    ? 0
    : metrics.minFretNumber + 1;
  
  return (
    <g>
      {rootPitchFretDots}
      {renderFretNumber(metrics, labeledFretNumber)}
    </g>
  );
}

export function renderFretNumber(
  metrics: StringedInstrumentMetrics, fretNumber: number
): JSX.Element {
  const fontSize = 12;
  let x = metrics.getNoteX(fretNumber) - (0.4 * fontSize);
  if (fretNumber == 0) {
    x -= 0.25 * metrics.fretSpacing;
  }

  const y = metrics.height + 20;
  const textStyle: any = {
    fontSize: `${fontSize}px`,
    fontWeight: "bold"
  };

  return (
    <text
      x={x} y={y}
      style={textStyle}>
      {fretNumber}
    </text>
  );
}
export function renderFretNumbers(metrics: StringedInstrumentMetrics): JSX.Element {
  const fretNumbers = range(metrics.minFretNumber, metrics.minFretNumber + metrics.fretCount);
  return (
    <g>
      {fretNumbers.map(fretNumber => renderFretNumber(metrics, fretNumber))}
    </g>
  );
}

export interface IGuitarFretboardProps {
  width: number;
  height: number;
  tuning: StringedInstrumentTuning;
  minFretNumber?: number;
  fretCount?: number;
  pressedNotes?: Array<StringedInstrumentNote>;
  renderExtrasFn?: (metrics: StringedInstrumentMetrics) => JSX.Element;
  style?: any;
}
export class GuitarFretboard extends React.Component<IGuitarFretboardProps, {}> {
  public render(): JSX.Element {
    return (
      <StringedInstrumentFingerboard
        width={this.props.width} height={this.props.height}
        tuning={this.props.tuning}
        hasFrets={true}
        minFretNumber={this.props.minFretNumber}
        fretCount={this.props.fretCount}
        dottedFretNumbers={this.dottedFretNumbers}
        pressedNotes={this.props.pressedNotes}
        renderExtrasFn={this.props.renderExtrasFn}
        style={this.props.style} />
    );
  }

  private dottedFretNumbers = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
}