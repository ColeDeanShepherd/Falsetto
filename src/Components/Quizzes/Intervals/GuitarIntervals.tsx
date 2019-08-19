import * as React from "react";
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody } from "@material-ui/core";

import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { Interval } from "../../../Interval";
import {
  GuitarFretboard
} from "../../Utils/GuitarFretboard";
import {
  StringedInstrumentMetrics,
  getIntervalDeltaFretNumber,
  StringedInstrumentFingerboard
} from "../../Utils/StringedInstrumentFingerboard";
import { standard6StringGuitarTuning } from "../../Utils/StringedInstrumentTuning";
import { VerticalDirection } from "../../../VerticalDirection";
import { StringedInstrumentNote } from '../../../GuitarNote';

const flashCardSetId = "guitarIntervals";
const fretCount = StringedInstrumentFingerboard.DEFAULT_FRET_COUNT;

const intervals = [
  "m2",
  "M2",
  "m3",
  "M3",
  "P4",
  "A4/d5",
  "P5",
  "m6",
  "M6",
  "m7",
  "M7",
  "P8"
];

const guitarTuning = standard6StringGuitarTuning;

interface IConfigData {
  enabledIntervals: string[];
  // TODO: add enabledDirections?
};

export function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
): Array<FlashCardId> {
  const newEnabledFlashCardIds = new Array<FlashCardId>();

  forEachInterval((interval, _, i) => {
    if (Utils.arrayContains(configData.enabledIntervals, interval.toString())) {
      newEnabledFlashCardIds.push(flashCards[i].id);
    }
  });

  return newEnabledFlashCardIds;
}

export interface IIntervalsFlashCardMultiSelectProps {
  studySessionInfo: FlashCardStudySessionInfo;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export interface IIntervalsFlashCardMultiSelectState {}
export class IntervalsFlashCardMultiSelect extends React.Component<IIntervalsFlashCardMultiSelectProps, IIntervalsFlashCardMultiSelectState> {
  public render(): JSX.Element {
    const configData = this.props.studySessionInfo.configData as IConfigData;

    const intervalCheckboxTableRows = intervals
      .map((interval, i) => {
        const isChecked = configData.enabledIntervals.indexOf(interval) >= 0;
        const isEnabled = !isChecked || (configData.enabledIntervals.length > 1);

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
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const newEnabledIntervals = Utils.toggleArrayElement(
      configData.enabledIntervals, interval
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

    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(
      this.props.studySessionInfo.flashCardSet, this.props.studySessionInfo.flashCards, newConfigData
    );
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}

function forEachInterval(
  fn: (
    interval: Interval,
    direction: VerticalDirection,
    stringIndex0: number,
    deltaStringIndex: number,
    deltaFretNumber: number,
    i: number
  ) => void
) {
  const directions = [VerticalDirection.Up, VerticalDirection.Down];
  const firstStringIndices = [0, 3];
  const stringSpansPerFirstStringIndex = [
    Utils.range(1, 4), // E string
    Utils.range(2, 3) // G string
  ];

  let i = 0;

  for (let intervalIndex = 0; intervalIndex < intervals.length; intervalIndex++) {
    const interval = Interval.fromHalfSteps(1 + intervalIndex);

    for (const direction of directions) {
      for (let firstStringIndexIndex = 0; firstStringIndexIndex < firstStringIndices.length; firstStringIndexIndex++) {
        const stringIndex0 = firstStringIndices[firstStringIndexIndex];
        const stringSpans = stringSpansPerFirstStringIndex[firstStringIndexIndex];

        for (const stringSpan of stringSpans) {
          const deltaStringIndex = stringSpan - 1;
          const deltaFretNumber = getIntervalDeltaFretNumber(
            interval, direction, stringIndex0, deltaStringIndex, guitarTuning
          );

          if (Math.abs(deltaFretNumber) <= fretCount) {
            fn(interval, direction, stringIndex0, deltaStringIndex, deltaFretNumber, i);
            i++;
          }
        }
      }
    }
  }
}

export function renderAnswerSelect(
  info: FlashCardStudySessionInfo
): JSX.Element {
  const ascendingIntervals = intervals
    .map(i => Interval.upDirectionSymbol + " " + i);
  const descendingIntervals = intervals
    .map(i => Interval.downDirectionSymbol + " " + i);
  return (
    <div>
      {FlashCardUtils.renderStringAnswerSelectInternal(
        `${info.currentFlashCardId}.0`, ascendingIntervals, info
      )}
      {FlashCardUtils.renderStringAnswerSelectInternal(
        `${info.currentFlashCardId}.1`, descendingIntervals, info
      )}
    </div>
  );
}

interface IFlashCardFrontSideProps {
  stringIndex0: number;
  deltaStringIndex: number;
  deltaFretNumber: number;
}
interface IFlashCardFrontSideState {
  fretNumber: number;
}
class FlashCardFrontSide extends React.Component<IFlashCardFrontSideProps, IFlashCardFrontSideState> {
  public constructor(props: IFlashCardFrontSideProps) {
    super(props);

    const minFretNumber = Math.max(-this.props.deltaFretNumber, 0);
    const maxFretNumber = Math.min(fretCount - this.props.deltaFretNumber, fretCount);
    this.state = {
      fretNumber: Utils.randomInt(minFretNumber, maxFretNumber)
    };
  }
  public render(): JSX.Element {
    const note1 = guitarTuning.getNote(this.props.stringIndex0, this.state.fretNumber);
    const note2 = guitarTuning.getNote(
      this.props.stringIndex0 + this.props.deltaStringIndex,
      this.state.fretNumber + this.props.deltaFretNumber
    );
    const notes = [note1, note2];

    const renderExtras = (metrics: StringedInstrumentMetrics) => renderFretboardExtras(metrics, notes);
    const style: any = { width: "100%", maxWidth: "400px" };

    return (
      <div>
        <GuitarFretboard
          width={400} height={140}
          tuning={guitarTuning}
          fretCount={fretCount}
          renderExtrasFn={renderExtras}
          style={style}
        />
      </div>
    );
  }
}

export function renderFretboardExtras(metrics: StringedInstrumentMetrics, notes: Array<StringedInstrumentNote>): JSX.Element {
  const fontSize = 16;
  const textStyle = {
    fontSize: `${fontSize}px`
  };

  const x1 = metrics.getNoteX(notes[0].getFretNumber(guitarTuning));
  const y1 = metrics.getStringY(notes[0].stringIndex);
  
  const x2 = metrics.getNoteX(notes[1].getFretNumber(guitarTuning));
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
}

export function createFlashCards(): Array<FlashCard> {
  const flashCards = new Array<FlashCard>();

  forEachInterval((interval, direction, stringIndex0, deltaStringIndex, deltaFretNumber, i) => {
    const directionChar = (direction === VerticalDirection.Up)
      ? Interval.upDirectionSymbol
      : Interval.downDirectionSymbol;
    
    const deserializedId = {
      set: flashCardSetId,
      stringIndex0: stringIndex0,
      deltaStringIndex: deltaStringIndex,
      deltaFretNumber: deltaFretNumber
    };
    const id = JSON.stringify(deserializedId);

    flashCards.push(FlashCard.fromRenderFns(
      id,
      (width, height) => (
        <FlashCardFrontSide
          stringIndex0={stringIndex0}
          deltaStringIndex={deltaStringIndex}
          deltaFretNumber={deltaFretNumber}
        />
      ),
      directionChar + " " + interval.toString()
    ));
  });

  return flashCards;
}
export function createFlashCardSet(): FlashCardSet {
  const renderFlashCardMultiSelect = (
    studySessionInfo: FlashCardStudySessionInfo,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return (
    <IntervalsFlashCardMultiSelect
      studySessionInfo={studySessionInfo}
      onChange={onChange}
    />
    );
  };

  const initialConfigData: IConfigData = {
    enabledIntervals: intervals.slice()
  };
  
  const flashCardSet = new FlashCardSet(flashCardSetId,
    "Guitar Intervals",
    createFlashCards
  );createFlashCards
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.containerHeight = "100px";

  return flashCardSet;
}