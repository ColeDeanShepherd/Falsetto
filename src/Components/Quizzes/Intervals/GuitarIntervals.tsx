import * as React from "react";
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody } from "@material-ui/core";

import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardGroup, RenderAnswerSelectArgs } from "../../../FlashCardGroup";
import { Interval } from "../../../Interval";
import { standard6StringGuitarTuning, GuitarFretboard, GuitarFretboardMetrics } from "../../Utils/GuitarFretboard";
import { VerticalDirection } from "../../../VerticalDirection";
import { AnswerDifficulty } from "../../../StudyAlgorithm";
import { Size2D } from '../../../Size2D';
import { GuitarNote } from '../../../GuitarNote';

const intervals = [
  "m2",
  "M2",
  "m3",
  "M3",
  "P4",
  "A4",
  "d5",
  "P5",
  "m6",
  "M6",
  "m7",
  "M7",
  "P8"
];

interface IConfigData {
  enabledIntervals: string[];
};

export function configDataToEnabledQuestionIds(configData: IConfigData): Array<number> {
  const newEnabledFlashCardIndices = new Array<number>();

  let i = 0;

  forEachInterval((pitches, interval) => {
    if (
      Utils.arrayContains(configData.enabledIntervals, interval.toString())
    ) {
      newEnabledFlashCardIndices.push(i);
    }

    i++;
  });

  return newEnabledFlashCardIndices;
}

export interface IIntervalsFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  configData: IConfigData;
  selectedFlashCardIndices: number[];
  onChange?: (newValue: number[], newConfigData: any) => void;
}
export interface IIntervalsFlashCardMultiSelectState {}
export class IntervalsFlashCardMultiSelect extends React.Component<IIntervalsFlashCardMultiSelectProps, IIntervalsFlashCardMultiSelectState> {
  public render(): JSX.Element {
    const intervalCheckboxTableRows = intervals
      .map((interval, i) => {
        const isChecked = this.props.configData.enabledIntervals.indexOf(interval) >= 0;
        const isEnabled = !isChecked || (this.props.configData.enabledIntervals.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleIntervalEnabled(interval)} disabled={!isEnabled} /></TableCell>
            <TableCell>{interval}</TableCell>
          </TableRow>
        );
      }, this);
    const intervalCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Interval</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {intervalCheckboxTableRows}
        </TableBody>
      </Table>
    );

    return (
      <div>
        <div>{intervalCheckboxes}</div>
      </div>
    );
  }

  private toggleIntervalEnabled(interval: string) {
    const newEnabledIntervals = Utils.toggleArrayElement(
      this.props.configData.enabledIntervals,
      interval
    );
    
    if (newEnabledIntervals.length > 0) {
      const newConfigData: IConfigData = {
        enabledIntervals: newEnabledIntervals
      };
      this.onChange(newConfigData);
    }
  }
  private onChange(newConfigData: IConfigData) {
    if (!this.props.onChange) { return; }

    const newEnabledFlashCardIndices = configDataToEnabledQuestionIds(newConfigData);
    this.props.onChange(newEnabledFlashCardIndices, newConfigData);
  }
}

function forEachInterval(fn: (pitches: Array<GuitarNote>, interval: Interval) => void) {
  for (let stringIndex1 = 0; stringIndex1 < 6; stringIndex1++) {
    for (let fretNumber1 = 0; fretNumber1 < 12; fretNumber1++) {
      for (let stringIndex2 = 0; stringIndex2 < 6; stringIndex2++) {
        for (let fretNumber2 = 0; fretNumber2 < 12; fretNumber2++) {
          const note1 = standard6StringGuitarTuning.getNote(stringIndex1, fretNumber1);
          const note2 = standard6StringGuitarTuning.getNote(stringIndex2, fretNumber2);

          const halfSteps = Math.abs(note2.pitch.midiNumber - note1.pitch.midiNumber);
          if ((halfSteps === 0) || (halfSteps > 12)) { continue; }

          const interval = Interval.fromPitches(note1.pitch, note2.pitch);
          
          fn([note1, note2], interval);
        }
      }
    }
  }
}


export function renderAnswerSelect(
  state: RenderAnswerSelectArgs
): JSX.Element {
  const ascendingIntervals = intervals
    .map(i => "↑ " + i);
  const descendingIntervals = intervals
    .map(i => "↓ " + i);
  return (
    <div>
      {FlashCardUtils.renderStringAnswerSelectInternal(
        `${state.currentFlashCardId}.0`, ascendingIntervals, state
      )}
      {FlashCardUtils.renderStringAnswerSelectInternal(
        `${state.currentFlashCardId}.1`, descendingIntervals, state
      )}
    </div>
  );
}

export function createFlashCards(): Array<FlashCard> {
  const flashCards = new Array<FlashCard>();

  forEachInterval((notes, interval) => {
    const intervalDirection = (notes[1].pitch.midiNumber > notes[0].pitch.midiNumber)
      ? VerticalDirection.Up
      : VerticalDirection.Down;
    const directionChar = (intervalDirection === VerticalDirection.Up)
      ? "↑"
      : "↓";
    
    const renderExtras = (metrics: GuitarFretboardMetrics) => {
      const fontSize = 16;
      const textStyle = {
        fontSize: `${fontSize}px`
      };

      const x1 = metrics.getNoteX(notes[0].getFretNumber(standard6StringGuitarTuning));
      const y1 = metrics.getStringY(notes[0].stringIndex);
      
      const x2 = metrics.getNoteX(notes[1].getFretNumber(standard6StringGuitarTuning));
      const y2 = metrics.getStringY(notes[1].stringIndex);

      const textXOffset = -(0.3 * fontSize);
      const textYOffset = 0.3 * fontSize;

      return (
        <g>
          <circle
            cx={x1}
            cy={y1}
            r={metrics.fretDotRadius}
            fill="green"
            strokeWidth="0"
          />
          <text x={x1 + textXOffset} y={y1 + textYOffset} style={textStyle}>1</text>

          <circle
            cx={x2}
            cy={y2}
            r={metrics.fretDotRadius}
            fill="red"
            strokeWidth="0"
          />
          <text x={x2 + textXOffset} y={y2 + textYOffset} style={textStyle}>2</text>
        </g>
      );
    };

    flashCards.push(FlashCard.fromRenderFns(
      (width, height) => {
        const size = Utils.shrinkRectToFit(
          new Size2D(width, height),
          new Size2D(400, 140)
        );

        return (
          <div>
            <GuitarFretboard
              width={size.width} height={size.height}
              renderExtrasFn={renderExtras}
            />
          </div>
        );
      },
      directionChar + " " + interval.toString()
    ));
  });

  return flashCards;
}
export function createFlashCardGroup(): FlashCardGroup {
  const renderFlashCardMultiSelect = (
    flashCards: Array<FlashCard>,
    selectedFlashCardIndices: number[],
    configData: any,
    onChange: (newValue: number[], newConfigData: any) => void
  ): JSX.Element => {
    return (
    <IntervalsFlashCardMultiSelect
      flashCards={flashCards}
      configData={configData}
      selectedFlashCardIndices={selectedFlashCardIndices}
      onChange={onChange}
    />
    );
  };

  const initialConfigData: IConfigData = {
    enabledIntervals: intervals.slice()
  };
  
  const group = new FlashCardGroup(
    "Guitar Intervals",
    createFlashCards
  );createFlashCards
  group.initialSelectedFlashCardIndices = configDataToEnabledQuestionIds(initialConfigData);
  group.initialConfigData = initialConfigData;
  group.enableInvertFlashCards = false;
  group.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  group.renderAnswerSelect = renderAnswerSelect;
  group.containerHeight = "100px";

  return group;
}