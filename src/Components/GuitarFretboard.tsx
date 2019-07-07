import * as React from "react";

import * as Utils from "../Utils";
import { Pitch } from "../Pitch";
import { PitchLetter } from "../PitchLetter";
import { Size2D } from '../Size2D';
import { Rect2D } from '../Rect2D';
import { Vector2D } from '../Vector2D';
import { ScaleType } from '../Scale';
import { ChordType, Chord } from '../Chord';

export class GuitarTuning {
  public constructor(public openStringPitches: Array<Pitch>) {
    Utils.invariant(this.openStringPitches.length > 0);
  }

  public get stringCount(): number {
    return this.openStringPitches.length;
  }

  public getNote(stringIndex: number, fretNumber: number): GuitarNote {
    Utils.precondition((stringIndex >= 0) && (stringIndex < this.stringCount));

    const pitch = Pitch.createFromMidiNumber(
      this.openStringPitches[stringIndex].midiNumber + fretNumber
    );
    return new GuitarNote(pitch, stringIndex);
  }
}
export const standard6StringGuitarTuning = new GuitarTuning([
  new Pitch(PitchLetter.E, 0, 2),
  new Pitch(PitchLetter.A, 0, 2),
  new Pitch(PitchLetter.D, 0, 3),
  new Pitch(PitchLetter.G, 0, 3),
  new Pitch(PitchLetter.B, 0, 3),
  new Pitch(PitchLetter.E, 0, 4)
]);
export const standard7StringGuitarTuning = new GuitarTuning([
  new Pitch(PitchLetter.B, 0, 1),
  new Pitch(PitchLetter.E, 0, 2),
  new Pitch(PitchLetter.A, 0, 2),
  new Pitch(PitchLetter.D, 0, 3),
  new Pitch(PitchLetter.G, 0, 3),
  new Pitch(PitchLetter.B, 0, 3),
  new Pitch(PitchLetter.E, 0, 4)
]);
export const standard8StringGuitarTuning = new GuitarTuning([
  new Pitch(PitchLetter.F, 1, 1),
  new Pitch(PitchLetter.B, 0, 1),
  new Pitch(PitchLetter.E, 0, 2),
  new Pitch(PitchLetter.A, 0, 2),
  new Pitch(PitchLetter.D, 0, 3),
  new Pitch(PitchLetter.G, 0, 3),
  new Pitch(PitchLetter.B, 0, 3),
  new Pitch(PitchLetter.E, 0, 4)
]);
export function getStandardGuitarTuning(stringCount: number): GuitarTuning {
  switch (stringCount) {
    case 6:
      return standard6StringGuitarTuning;
    case 7:
      return standard7StringGuitarTuning;
    case 8:
      return standard8StringGuitarTuning;
    default:
      throw new Error(`No registered standard guitar tuning for ${stringCount} strings.`);
  }
}

export function getPreferredGuitarScaleShape(
  scaleType: ScaleType, rootPitch: Pitch, tuning: GuitarTuning
) {
  const scaleShapes = findGuitarScaleShapes(scaleType, rootPitch, tuning);
  scaleShapes.sort((shape1, shape2) => {
    // sort by fret range
    const shape1FretNumbers = shape1.map(gn => gn.getFretNumber(tuning));
    const shape1MinFretNumber = Utils.arrayMin(shape1FretNumbers);
    const shape1MaxFretNumber = Utils.arrayMax(shape1FretNumbers);
    const shape1FretRange = shape1MaxFretNumber - shape1MinFretNumber;
    
    const shape2FretNumbers = shape2.map(gn => gn.getFretNumber(tuning));
    const shape2MinFretNumber = Utils.arrayMin(shape2FretNumbers);
    const shape2MaxFretNumber = Utils.arrayMax(shape2FretNumbers);
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

export function get1stGuitarNoteOnString(pitch: Pitch, stringIndex: number, tuning: GuitarTuning): GuitarNote {
  Utils.precondition(stringIndex >= 0);
  Utils.precondition(stringIndex < tuning.stringCount);

  const openStringPitch = tuning.openStringPitches[stringIndex];

  let notePitch = new Pitch(pitch.letter, pitch.signedAccidental, openStringPitch.octaveNumber);
  if (notePitch.midiNumber < openStringPitch.midiNumber) {
    notePitch.octaveNumber++;
  }

  return new GuitarNote(notePitch, stringIndex);
}

class GuitarScaleShapeFinderState {
  public guitarNotes: Array<GuitarNote> = new Array<GuitarNote>();
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
  scaleType: ScaleType, rootPitch: Pitch, tuning: GuitarTuning): Array<Array<GuitarNote>> {
    const { minNotesPerString, maxNotesPerString } = getPreferredNumNotesPerStringRange(scaleType);
    const scalePitches = scaleType.getPitches(rootPitch);

    const state = new GuitarScaleShapeFinderState();
    const outShapes = new Array<Array<GuitarNote>>();
    findGuitarScaleShapesRecursive(scalePitches, tuning, minNotesPerString, maxNotesPerString, state, outShapes);

    return outShapes;
}
export function findGuitarScaleShapesRecursive(
  scalePitches: Array<Pitch>, tuning: GuitarTuning,  minNotesPerString: number, maxNotesPerString: number,
  state: GuitarScaleShapeFinderState,
  outShapes: Array<Array<GuitarNote>>
) {
  function addNoteToString(state: GuitarScaleShapeFinderState, note: GuitarNote) {
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
    const guitarNoteSameString = new GuitarNote(pitch, state.stringIndex);

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
    default:
      throw new Error(`Unsupported scale length: ${scaleType.numPitches}`);
  }
}

export function findGuitarChordShape(
  chord: Chord, inversion: number, firstStringIndex: number,
  tuning: GuitarTuning
): Array<GuitarNote> {
  Utils.precondition((inversion >= 0) && (inversion < chord.type.pitchCount));
  Utils.precondition((firstStringIndex >= 0) && (firstStringIndex < tuning.stringCount));

  const pitches = chord.getPitches();

  let guitarNotes = new Array<GuitarNote>();

  for (let i = 0; i < pitches.length; i++) {
    const pitch = pitches[Utils.mod(i + (inversion - 1), pitches.length)];
    const stringIndex = firstStringIndex + i;

    guitarNotes.push(new GuitarNote(pitch, stringIndex));
  }

  return guitarNotes;
}

export class GuitarNote {
  public static allNotesOfPitches(
    tuning: GuitarTuning,
    pitches: Array<Pitch>,
    minFretNumber: number,
    maxFretNumber: number
  ): Array<GuitarNote> {
    Utils.precondition(minFretNumber >= 0);
    Utils.precondition(maxFretNumber >= minFretNumber);

    const fretNumbers = Utils.range(0, maxFretNumber);
    return Utils.flattenArrays<GuitarNote>(
      tuning.openStringPitches
        .map((_, stringIndex) => fretNumbers
          .map(fretNumber => new GuitarNote(
            tuning.getNote(stringIndex, fretNumber).pitch,
            stringIndex
          ))
          .filter(note => pitches.some(p => p.midiNumberNoOctave === note.pitch.midiNumberNoOctave))
        )
    );
  }

  public constructor(
    public pitch: Pitch,
    public stringIndex: number
  ) {
    Utils.invariant(stringIndex >= 0);
  }

  // TODO: add tests
  public getFretNumber(tuning: GuitarTuning): number {
    const openStringPitch = tuning.openStringPitches[this.stringIndex];
    return this.pitch.midiNumber - openStringPitch.midiNumber;
  }
}

export class GuitarFretboardMetrics {
  public constructor(
    public width: number,
    public height: number,
    public minFretNumber: number = 0,
    public fretCount: number = 11,
    public stringCount: number = 6
  ) {
    Utils.precondition((fretCount >= 1) && (fretCount <= 24))
    
    this.nutWidth = (minFretNumber === 0) ? 8 :  4;

    this.stringSpacing = (this.height - this.lowestStringWidth) / (this.stringCount - 1);
    this.fretSpacing = (this.width - this.nutWidth) / this.fretCount;
    
    this.nutX = this.nutWidth / 2;

    this.stringsLeft = this.nutWidth;

    this.fretDotRadius = this.fretSpacing / 4;
    this.fretDotY = this.height / 2;
  }

  public nutWidth: number;
  public fretWidth: number = 4;

  public stringSpacing: number;
  public fretSpacing: number;

  public nutX: number;

  public stringsLeft: number;

  public fretDotRadius: number;
  public fretDotY: number;

  public getStringY(stringIndex: number): number {
    return this.height - (this.lowestStringWidth / 2) - (stringIndex * this.stringSpacing);
  }
  public getStringWidth(stringIndex: number): number {
    return this.lowestStringWidth / (1 + (stringIndex / 4));
  }
  public getFretSpaceCenterX(fretNumber: number): number {
    return this.stringsLeft + ((fretNumber - 1 - this.minFretNumber) * this.fretSpacing) + (this.fretSpacing / 2);
  }
  public getNoteX(fretNumber: number) {
    return Math.max(
      this.getFretSpaceCenterX(fretNumber),
      this.nutWidth / 2
    );
  }
  public getTextXOffset(fontSize: number): number {
    return -(0.3 * fontSize);
  }
  public getTextYOffset(fontSize: number): number {
    return 0.3 * fontSize;
  }
  
  public lowestStringWidth: number = 4;
}

export function renderGuitarNoteHighlightsAndLabels(
  metrics: GuitarFretboardMetrics, notes: Array<GuitarNote>, highlightStyle: string,
  getLabelsFn: (n: GuitarNote, i: number) => string
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
  metrics: GuitarFretboardMetrics, notes: Array<GuitarNote>, highlightStyle: string
) {
  return renderGuitarNoteHighlightsAndLabels(
    metrics, notes, highlightStyle, (n, _) => n.pitch.toOneAccidentalAmbiguousString(false, false)
  );
}
export function renderGuitarFretboardScaleExtras(
  metrics: GuitarFretboardMetrics, rootPitch: Pitch, scaleType: ScaleType,
  renderAllScaleShapes: boolean = false
): JSX.Element {
  const tuning = getStandardGuitarTuning(metrics.stringCount);
  const pitches = scaleType.getPitches(rootPitch);
  const guitarNotes = renderAllScaleShapes
    ? (
      GuitarNote.allNotesOfPitches(
        tuning, pitches, 0, metrics.fretCount
      )
    )
    : getPreferredGuitarScaleShape(scaleType, rootPitch, tuning);
  const formulaStringParts = scaleType.formulaString.split(" ");

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
  metrics: GuitarFretboardMetrics, chord: Chord
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
  metrics: GuitarFretboardMetrics, fretNumber: number
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
export function renderFretNumbers(metrics: GuitarFretboardMetrics): JSX.Element {
  const fretNumbers = Utils.range(metrics.minFretNumber, metrics.minFretNumber + metrics.fretCount);
  return (
    <g>
      {fretNumbers.map(fretNumber => renderFretNumber(metrics, fretNumber))}
    </g>
  );
}

export interface IGuitarFretboardProps {
  width: number;
  height: number;
  minFretNumber?: number;
  fretCount?: number;
  stringCount?: number;
  pressedNotes?: Array<GuitarNote>;
  renderExtrasFn?: (metrics: GuitarFretboardMetrics) => JSX.Element;
  style?: any;
}
export class GuitarFretboard extends React.Component<IGuitarFretboardProps, {}> {
  public render(): JSX.Element {
    const margin = 20;

    const metrics = new GuitarFretboardMetrics(
      this.props.width - (2 * margin),
      this.props.height - (2 * margin),
      (this.props.minFretNumber !== undefined) ? this.props.minFretNumber : 0,
      (this.props.fretCount !== undefined) ? this.props.fretCount : 11,
      this.props.stringCount
    );
    
    const tuning = getStandardGuitarTuning(metrics.stringCount);

    const nut = <line x1={metrics.nutX} x2={metrics.nutX} y1={0} y2={metrics.height} stroke="black" strokeWidth={metrics.nutWidth} />;
    const strings = Utils.range(0, metrics.stringCount - 1)
      .map(i => {
        const y = metrics.getStringY(i);
        return <line key={i} x1={metrics.stringsLeft} x2={metrics.width} y1={y} y2={y} stroke="black" strokeWidth={metrics.getStringWidth(i)} />;
      });
    const frets = Utils.range(1, metrics.fretCount)
      .map(i => {
        const x = metrics.stringsLeft + (i * metrics.fretSpacing);
        return <line key={i} x1={x} x2={x} y1={0} y2={metrics.height} stroke="black" strokeWidth={metrics.fretWidth} />;
      });
    const fretDots = this.dottedFretNumbers
      .filter(fretNumber => (fretNumber > metrics.minFretNumber) && ((fretNumber - metrics.minFretNumber) <= metrics.fretCount))
      .map(fretNumber => {
        const x = metrics.getFretSpaceCenterX(fretNumber);

        if ((fretNumber % 12) != 0) {
          return <circle key={fretNumber} cx={x} cy={metrics.fretDotY} r={metrics.fretDotRadius} fill="black" strokeWidth="0" />;
        } else {
          const fretDotYOffset = metrics.stringSpacing;
          return (
            <g>
              <circle key={fretNumber} cx={x} cy={metrics.fretDotY - fretDotYOffset} r={metrics.fretDotRadius} fill="black" strokeWidth="0" />
              <circle key={`${fretNumber}_2`} cx={x} cy={metrics.fretDotY + fretDotYOffset} r={metrics.fretDotRadius} fill="black" strokeWidth="0" />
            </g>
          );
        }
      });
    const noteHighlights = this.props.pressedNotes ? (
        this.props.pressedNotes
        .map((note, i) => {
          const x = metrics.getNoteX(note.getFretNumber(tuning));
          const y = metrics.getStringY(note.stringIndex);
          return <circle key={i} cx={x} cy={y} r={metrics.fretDotRadius} fill="red" strokeWidth="0" />;
        })
      ) : null;
    const extraElements = this.props.renderExtrasFn
      ? this.props.renderExtrasFn(metrics)
      : null;

    return (
      <svg
        width={this.props.width} height={this.props.height}
        viewBox={`0 0 ${this.props.width} ${this.props.height}`}
        version="1.1" xmlns="http://www.w3.org/2000/svg"
        style={this.props.style}>
        <g transform={`translate(${margin},${margin})`}>
          {nut}
          {strings}
          {frets}
          {fretDots}
          {noteHighlights}
          {extraElements}
        </g>
      </svg>
    );
  }

  private dottedFretNumbers = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
}