import * as React from "react";

import * as Utils from "../../Utils";
import { Pitch } from "../../Pitch";
import { Size2D } from '../../Size2D';
import { Rect2D } from '../../Rect2D';
import { Vector2D } from '../../Vector2D';
import { ScaleType, Scale } from '../../Scale';
import { Chord } from '../../Chord';
import { StringedInstrumentNote } from '../../GuitarNote';
import { Interval } from '../../Interval';
import { VerticalDirection } from '../../VerticalDirection';

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

export function getIntervalDeltaFretNumber(
  interval: Interval, direction: VerticalDirection, stringIndex: number,
  deltaStringIndex: number, tuning: StringedInstrumentTuning
): number {
  Utils.precondition(stringIndex >= 0);
  Utils.precondition(stringIndex < tuning.stringCount);
  Utils.precondition((stringIndex + deltaStringIndex) >= 0);
  Utils.precondition((stringIndex + deltaStringIndex) < tuning.stringCount);

  const signedHalfSteps = (direction === VerticalDirection.Up)
    ? interval.halfSteps
    : -interval.halfSteps;

  if (deltaStringIndex === 0) {
    return signedHalfSteps;
  }

  const halfStepsBetweenStrings =
    tuning.openStringPitches[stringIndex + deltaStringIndex].midiNumber -
    tuning.openStringPitches[stringIndex].midiNumber;
  const deltaFretNumber = signedHalfSteps - halfStepsBetweenStrings;
  return deltaFretNumber;
}

export function get1stStringedInstrumentNoteOnString(pitch: Pitch, stringIndex: number, tuning: StringedInstrumentTuning): StringedInstrumentNote {
  Utils.precondition(stringIndex >= 0);
  Utils.precondition(stringIndex < tuning.stringCount);

  const openStringPitch = tuning.openStringPitches[stringIndex];

  let notePitch = new Pitch(pitch.letter, pitch.signedAccidental, openStringPitch.octaveNumber);
  if (notePitch.midiNumber < openStringPitch.midiNumber) {
    notePitch.octaveNumber++;
  }

  return new StringedInstrumentNote(notePitch, stringIndex);
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
    default:
      throw new Error(`Unsupported scale length: ${scaleType.numPitches}`);
  }
}

export function findGuitarChordShape(
  chord: Chord, inversion: number, firstStringIndex: number,
  tuning: StringedInstrumentTuning
): Array<StringedInstrumentNote> {
  Utils.precondition((inversion >= 0) && (inversion < chord.type.pitchCount));
  Utils.precondition((firstStringIndex >= 0) && (firstStringIndex < tuning.stringCount));

  const pitches = chord.getPitches();

  let guitarNotes = new Array<StringedInstrumentNote>();

  for (let i = 0; i < pitches.length; i++) {
    const pitch = pitches[Utils.mod(i + (inversion - 1), pitches.length)];
    const stringIndex = firstStringIndex + i;

    guitarNotes.push(new StringedInstrumentNote(pitch, stringIndex));
  }

  return guitarNotes;
}

export class StringedInstrumentMetrics {
  public constructor(
    public width: number,
    public height: number,
    public hasFrets: boolean,
    public minFretNumber: number = 0,
    public fretCount: number = StringedInstrumentFingerboard.DEFAULT_FRET_COUNT,
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
  public getFretX(fretNumber: number): number {
    return this.stringsLeft + ((fretNumber - this.minFretNumber) * this.fretSpacing);
  }
  public getFretSpaceCenterX(fretNumber: number): number {
    return this.stringsLeft + ((fretNumber - 1 - this.minFretNumber) * this.fretSpacing) + (this.fretSpacing / 2);
  }
  public getNoteX(fretNumber: number) {
    return this.hasFrets
      ? Math.max(
        this.getFretSpaceCenterX(fretNumber),
        this.nutWidth / 2
      ) : this.getFretX(fretNumber);
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

export interface IViolinFingerboardProps {
  width: number;
  height: number;
  tuning: StringedInstrumentTuning;
  minFretNumber?: number;
  fretCount?: number;
  pressedNotes?: Array<StringedInstrumentNote>;
  renderExtrasFn?: (metrics: StringedInstrumentMetrics) => JSX.Element;
  style?: any;
}
export class ViolinFingerboard extends React.Component<IViolinFingerboardProps, {}> {
  public render(): JSX.Element {
    return (
      <StringedInstrumentFingerboard
        width={this.props.width} height={this.props.height}
        tuning={this.props.tuning}
        hasFrets={false}
        minFretNumber={this.props.minFretNumber}
        fretCount={this.props.fretCount}
        positionLineFretNumbers={this.positionLineFretNumbers}
        pressedNotes={this.props.pressedNotes}
        renderExtrasFn={this.props.renderExtrasFn}
        style={this.props.style} />
    );
  }

  private positionLineFretNumbers = [2, 3, 5, 7, 8];
}

export interface IStringedInstrumentFingerboardProps {
  width: number;
  height: number;
  tuning: StringedInstrumentTuning;
  hasFrets: boolean;
  dottedFretNumbers?: Array<number>;
  positionLineFretNumbers?: Array<number>;
  minFretNumber?: number;
  fretCount?: number;
  pressedNotes?: Array<StringedInstrumentNote>;
  renderExtrasFn?: (metrics: StringedInstrumentMetrics) => JSX.Element;
  style?: any;
}
export class StringedInstrumentFingerboard extends React.Component<IStringedInstrumentFingerboardProps, {}> {
  public static readonly DEFAULT_FRET_COUNT = 11;

  public render(): JSX.Element {
    const margin = 20;

    const metrics = new StringedInstrumentMetrics(
      this.props.width - (2 * margin),
      this.props.height - (2 * margin),
      this.props.hasFrets,
      (this.props.minFretNumber !== undefined) ? this.props.minFretNumber : 0,
      (this.props.fretCount !== undefined) ? this.props.fretCount : StringedInstrumentFingerboard.DEFAULT_FRET_COUNT,
      this.props.tuning.stringCount
    );
    
    const tuning = this.props.tuning;

    const nut = <line x1={metrics.nutX} x2={metrics.nutX} y1={0} y2={metrics.height} stroke="black" strokeWidth={metrics.nutWidth} />;
    const strings = Utils.range(0, metrics.stringCount - 1)
      .map(i => {
        const y = metrics.getStringY(i);
        return <line key={i} x1={metrics.stringsLeft} x2={metrics.width} y1={y} y2={y} stroke="black" strokeWidth={metrics.getStringWidth(i)} />;
      });

    const frets = this.props.hasFrets ? (
      Utils.range(1, metrics.fretCount)
        .map(i => {
          const x = metrics.stringsLeft + (i * metrics.fretSpacing);
          return <line key={i} x1={x} x2={x} y1={0} y2={metrics.height} stroke="black" strokeWidth={metrics.fretWidth} />;
        })
      ) : null;
    
    const positionFontSize = 12;
    const positionTextStyle: any = {
      fontSize: `${positionFontSize}px`,
      fontWeight: "bold",
      textAnchor: "middle"
    };
    const positionLineFretNumbers = (this.props.positionLineFretNumbers !== undefined) ? this.props.positionLineFretNumbers : [];
    const positionLines = (
      positionLineFretNumbers
        .map((fretNumber, positionIndex) => {
          const x = metrics.getNoteX(fretNumber);;
          return (
            <g>
              <line key={fretNumber} x1={x} x2={x} y1={0} y2={metrics.height} stroke="black" strokeWidth="2" />
              <text
                x={x} y={metrics.height + (1.6 * positionFontSize)}
                style={positionTextStyle}>{1 + positionIndex}</text>
            </g>
          );
        })
    );

    const dottedFretNumbers = (this.props.dottedFretNumbers !== undefined) ? this.props.dottedFretNumbers : [];
    const fretDots = this.props.hasFrets ? (
      dottedFretNumbers
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
        })
    ) : null;

    const noteCircles = !this.props.hasFrets ? (
      Utils.range(0, 3)
        .map(stringIndex => Utils.range(0, metrics.fretCount)
          .map(fretNumber => {
            const position = new Vector2D(
              metrics.getNoteX(fretNumber),
              metrics.getStringY(stringIndex)
            );

            return <circle key={fretNumber} cx={position.x} cy={position.y} r={metrics.fretDotRadius} fill="none" stroke="black" strokeWidth="2" />;
          }))
    ) : null;

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
          {positionLines}
          {noteCircles}
          {noteHighlights}
          {extraElements}
        </g>
      </svg>
    );
  }
}