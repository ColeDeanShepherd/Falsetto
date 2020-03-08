import * as React from "react";

import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard, FlashCardId, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo, FlashCardLevel } from "../../../FlashCardSet";
import { Pitch } from "../../../Pitch";
import { VerticalDirection } from "../../../VerticalDirection";
import { Interval, createIntervalLevels } from "../../../Interval";
import { CheckboxColumnsFlashCardMultiSelect, CheckboxColumn, CheckboxColumnCell } from '../../Utils/CheckboxColumnsFlashCardMultiSelect';
import { getValidKeyPitches } from '../../../Key';

const flashCardSetId = "interval2ndNotes";

const firstPitches = getValidKeyPitches(4);
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
const directions = ["↑", "↓"];

interface IConfigData {
  enabledFirstPitches: Pitch[];
  enabledIntervals: string[];
  enabledDirections: string[];
}

export function forEachInterval(callbackFn: (firstPitch: Pitch, interval: string, direction: string, i: number) => void) {
  let i = 0;

  for (const firstPitch of firstPitches) {
    for (const interval of intervals) {
      for (const direction of directions) {
        callbackFn(firstPitch, interval, direction, i);
        i++;
      }
    }
  }
}
export function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
): Array<FlashCardId> {
  const flashCardIds = new Array<FlashCardId>();

  forEachInterval((firstPitch, interval, direction, i) => {
    if (
      Utils.arrayContains(configData.enabledFirstPitches, firstPitch) &&
      Utils.arrayContains(configData.enabledIntervals, interval) &&
      Utils.arrayContains(configData.enabledDirections, direction)
    ) {
      flashCardIds.push(flashCards[i].id);
    }
  });

  return flashCardIds;
}

export interface IIntervalNotesFlashCardMultiSelectProps {
  studySessionInfo: FlashCardStudySessionInfo;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export interface IIntervalNotesFlashCardMultiSelectState {}
export class IntervalNotesFlashCardMultiSelect extends React.Component<IIntervalNotesFlashCardMultiSelectProps, IIntervalNotesFlashCardMultiSelectState> {
  public render(): JSX.Element {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const selectedCellDatas = [
      configData.enabledFirstPitches,
      configData.enabledIntervals,
      configData.enabledDirections
    ];
    const boundOnChange = this.onChange.bind(this);

    return (
      <CheckboxColumnsFlashCardMultiSelect
        columns={this.columns}
        selectedCellDatas={selectedCellDatas}
        onChange={boundOnChange}
      />
    );
  }

  private columns: Array<CheckboxColumn> = [
    new CheckboxColumn(
      "First Pitch",
      firstPitches
        .map(rn => new CheckboxColumnCell(
          () => <span>{rn.toString(false, true)}</span>, rn
        )),
      (a: Pitch, b: Pitch) => a === b
    ),
    new CheckboxColumn(
      "Interval",
      intervals
        .map(i => new CheckboxColumnCell(
          () => <span>{i}</span>, i
        )),
      (a: string, b: string) => a === b
    ),
    new CheckboxColumn(
      "Direction",
      directions
        .map(d => new CheckboxColumnCell(
          () => <span>{d}</span>, d
        )),
      (a: string, b: string) => a === b
    )
  ];

  private onChange(newSelectedCellDatas: Array<Array<any>>) {
    if (!this.props.onChange) { return; }

    const newConfigData: IConfigData = {
      enabledFirstPitches: newSelectedCellDatas[0] as Array<Pitch>,
      enabledIntervals: newSelectedCellDatas[1] as Array<string>,
      enabledDirections: newSelectedCellDatas[2] as Array<string>
    };

    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(
      this.props.studySessionInfo.flashCardSet, this.props.studySessionInfo.flashCards,
      newConfigData
    );
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}

export function renderPitchAnswerSelect(
  info: FlashCardStudySessionInfo
): JSX.Element {
  const doubleSharpNotes = ["A♯♯", "B♯♯", "C♯♯", "D♯♯", "E♯♯", "F♯♯", "G♯♯"];
  const sharpNotes = ["A♯", "B♯", "C♯", "D♯", "E♯", "F♯", "G♯"];
  const naturalNotes = ["A", "B", "C", "D", "E", "F", "G"];
  const flatNotes = ["A♭", "B♭", "C♭", "D♭", "E♭", "F♭", "G♭"];
  const doubleFlatNotes = ["A♭♭", "B♭♭", "C♭♭", "D♭♭", "E♭♭", "F♭♭", "G♭♭"];

  return (
    <div>
      {FlashCardUtils.renderStringAnswerSelectInternal(
        `${info.currentFlashCardId}.0`, doubleSharpNotes, info
      )}
      {FlashCardUtils.renderStringAnswerSelectInternal(
        `${info.currentFlashCardId}.1`, sharpNotes, info
      )}
      {FlashCardUtils.renderStringAnswerSelectInternal(
        `${info.currentFlashCardId}.2`, naturalNotes, info
      )}
      {FlashCardUtils.renderStringAnswerSelectInternal(
        `${info.currentFlashCardId}.3`, flatNotes, info
      )}
      {FlashCardUtils.renderStringAnswerSelectInternal(
        `${info.currentFlashCardId}.4`, doubleFlatNotes, info
      )}
    </div>
  );
}

export function createFlashCards(): Array<FlashCard> {
  const flashCards = new Array<FlashCard>();

  forEachInterval((firstPitch, interval, direction, i) => {
    const intervalQuality = interval[0];
    const intervalQualityNum = Utils.intervalQualityToNumber(intervalQuality);

    const genericInterval = interval[1];
    const genericIntervalNum = parseInt(genericInterval, 10);

    const verticalDirection = (direction === "↑") ? VerticalDirection.Up : VerticalDirection.Down;
    const newPitch = Pitch.addInterval(
      firstPitch,
      verticalDirection,
      new Interval(genericIntervalNum, intervalQualityNum)
    );
    
    const deserializedId = {
      set: flashCardSetId,
      firstPitch: firstPitch.toString(true, false),
      interval: interval.toString(),
      direction: VerticalDirection[verticalDirection]
    };
    const id = JSON.stringify(deserializedId);

    const flashCard = new FlashCard(
      id,
      new FlashCardSide(
        firstPitch.toString(false, true) + " " + direction + " " + interval
      ),
      new FlashCardSide(
        newPitch.toString(false, true),
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
    <IntervalNotesFlashCardMultiSelect
      studySessionInfo={studySessionInfo}
      onChange={onChange}
    />
    );
  };
  
  const flashCardSet = new FlashCardSet(flashCardSetId,
    "Interval 2nd Notes",
    createFlashCards
  );
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.getInitialConfigData = (): IConfigData => ({
    enabledFirstPitches: firstPitches.slice(),
    enabledIntervals: intervals.slice(),
    enabledDirections: directions.slice()
  });
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = renderPitchAnswerSelect;
  flashCardSet.containerHeight = "80px";
  flashCardSet.createFlashCardLevels = (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => (
    createIntervalLevels(false, true)
      .map(level => new FlashCardLevel(
        level.name,
        flashCards
          .filter(fc => {
            const intervalString = fc.backSide.data as string;
            return Utils.arrayContains(level.intervalStrings, intervalString);
          })
          .map(fc => fc.id),
        (curConfigData: IConfigData) => (
          {
            enabledFirstPitches: firstPitches.slice(),
            enabledIntervals: level.intervalStrings.slice(),
            enabledDirections: directions.slice()
          } as IConfigData
        )
      ))
  );

  return flashCardSet;
}

export const flashCardSet = createFlashCardSet();