import * as React from "react";
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody } from "@material-ui/core";

import * as FlashCardUtils from "../Utils";
import { FlashCard, FlashCardId, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo, FlashCardLevel } from "../../../FlashCardSet";
import { Interval, createIntervalLevels } from "../../../lib/TheoryLib/Interval";
import {
  GuitarFretboard
} from "../../Utils/GuitarFretboard";
import {
  StringedInstrumentMetrics,
  getIntervalDeltaFretNumber,
  StringedInstrumentFingerboard
} from "../../Utils/StringedInstrumentFingerboard";
import { standard6StringGuitarTuning } from "../../Utils/StringedInstrumentTuning";
import { VerticalDirection } from "../../../lib/Core/VerticalDirection";
import { StringedInstrumentNote } from '../../../lib/TheoryLib/StringedInstrumentNote';
import { range } from '../../../lib/Core/MathUtils';
import { arrayContains, toggleArrayElement } from '../../../lib/Core/ArrayUtils';
import { randomInt } from '../../../lib/Core/Random';

const flashCardSetId = "guitarIntervals";
const FRET_COUNT = StringedInstrumentFingerboard.DEFAULT_FRET_COUNT;

const intervalStrings = [
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

function forEachInterval(
  fn: (
    intervalString: string,
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
    range(1, 4), // E string
    range(2, 3) // G string
  ];

  let i = 0;

  for (let intervalIndex = 0; intervalIndex < intervalStrings.length; intervalIndex++) {
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

          if (Math.abs(deltaFretNumber) <= FRET_COUNT) {
            fn(intervalStrings[intervalIndex], direction, stringIndex0, deltaStringIndex, deltaFretNumber, i);
            i++;
          }
        }
      }
    }
  }
}

interface IConfigData {
  enabledIntervals: string[];
  // TODO: add enabledDirections?
};

export function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
): Array<FlashCardId> {
  const newEnabledFlashCardIds = new Array<FlashCardId>();

  forEachInterval((interval, direction, stringIndex0, deltaStringIndex, deltaFretNumber, i) => {
    if (arrayContains(configData.enabledIntervals, interval)) {
      newEnabledFlashCardIds.push(flashCards[i].id);
    }
  });

  return newEnabledFlashCardIds;
}

export interface IIntervalsFlashCardMultiSelectProps {
  studySessionInfo: FlashCardStudySessionInfo;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export class IntervalsFlashCardMultiSelect extends React.Component<IIntervalsFlashCardMultiSelectProps, {}> {
  public render(): JSX.Element {
    const configData = this.props.studySessionInfo.configData as IConfigData;

    const intervalCheckboxTableRows = intervalStrings
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
    const newEnabledIntervals = toggleArrayElement(
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

export function renderAnswerSelect(
  info: FlashCardStudySessionInfo
): JSX.Element {
  const configData = info.configData as IConfigData;
  
  const ascendingIntervals = configData.enabledIntervals
    .map(i => Interval.upDirectionSymbol + " " + i);
  const descendingIntervals = configData.enabledIntervals
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
    const maxFretNumber = Math.min(FRET_COUNT - this.props.deltaFretNumber, FRET_COUNT);
    this.state = {
      fretNumber: randomInt(minFretNumber, maxFretNumber)
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
          fretCount={FRET_COUNT}
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

  const fillColor = "lightblue";

  return (
    <g>
      <circle
        cx={x1}
        cy={y1}
        r={metrics.fretDotRadius}
        fill={fillColor}
        strokeWidth="0"
      />
      <text x={x1 + textXOffset} y={y1 + textYOffset} style={textStyle}>1</text>

      <circle
        cx={x2}
        cy={y2}
        r={metrics.fretDotRadius}
        fill={fillColor}
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

    const flashCard = new FlashCard(
      id,
      new FlashCardSide(
        size => (
          <FlashCardFrontSide
            stringIndex0={stringIndex0}
            deltaStringIndex={deltaStringIndex}
            deltaFretNumber={deltaFretNumber}
          />
        )
      ),
      new FlashCardSide(
        directionChar + " " + interval,
        interval
      )
    );
    flashCards.push(flashCard);
  });

  return flashCards;
}
function createFlashCardSet(): FlashCardSet {
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
  
  const flashCardSet = new FlashCardSet(flashCardSetId, "Guitar Intervals", createFlashCards);
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.getInitialConfigData = (): IConfigData => ({
    enabledIntervals: intervalStrings.slice()
  });
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.containerHeight = "100px";
  flashCardSet.createFlashCardLevels = (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => (
    createIntervalLevels(false, false)
      .map(level => new FlashCardLevel(
        level.name,
        flashCards
          .filter(fc => {
            const intervalString = fc.backSide.data as string;
            return arrayContains(level.intervalStrings, intervalString);
          })
          .map(fc => fc.id),
        (curConfigData: IConfigData) => (
          {
            enabledIntervals: level.intervalStrings.slice()
          } as IConfigData
        )
      ))
  );

  return flashCardSet;
}

export const flashCardSet = createFlashCardSet();