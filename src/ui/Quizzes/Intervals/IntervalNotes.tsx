import * as React from "react";

import * as Utils from "../../../lib/Core/Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard, FlashCardId, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo, FlashCardLevel } from "../../../FlashCardSet";
import { Pitch } from "../../../lib/TheoryLib/Pitch";
import { VerticalDirection } from "../../../lib/Core/VerticalDirection";
import { Interval, createIntervalLevels, intervalQualityToNumber } from "../../../lib/TheoryLib/Interval";
import { getValidKeyPitches } from '../../../lib/TheoryLib/Key';
import { CheckboxColumnsFlashCardMultiSelect, CheckboxColumn, CheckboxColumnCell } from '../../Utils/CheckboxColumnsFlashCardMultiSelect';
import { arrayContains } from '../../../lib/Core/ArrayUtils';

const flashCardSetId = "notesToIntervals";
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

function forEachInterval(callbackFn: (firstPitch: Pitch, interval: string, direction: string, i: number) => void) {
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
      arrayContains(configData.enabledFirstPitches, firstPitch) &&
      arrayContains(configData.enabledIntervals, interval) &&
      arrayContains(configData.enabledDirections, direction)
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

export function createFlashCards(): Array<FlashCard> {
  const flashCards = new Array<FlashCard>();
  
  forEachInterval((rootPitch, interval, direction, i) => {
    const intervalQuality = interval[0];
    const intervalQualityNum = intervalQualityToNumber(intervalQuality);

    const genericInterval = interval[1];
    const genericIntervalNum = parseInt(genericInterval, 10);

    const newPitch = Pitch.addInterval(
      rootPitch,
      (direction === "↑") ? VerticalDirection.Up : VerticalDirection.Down,
      new Interval(genericIntervalNum, intervalQualityNum)
    );
    
    const deserializedId = {
      set: flashCardSetId,
      pitches: [rootPitch.toString(true), newPitch.toString(true)]
    };
    const id = JSON.stringify(deserializedId);
    
    const flashCard = new FlashCard(
      id,
      new FlashCardSide(
        rootPitch.toString(true) + ", " + newPitch.toString(true)
      ),
      new FlashCardSide(
        interval,
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
    "Notes To Intervals",
    createFlashCards
  );
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.getInitialConfigData = (): IConfigData => ({
    enabledFirstPitches: firstPitches.slice(),
    enabledIntervals: intervals.slice(),
    enabledDirections: directions.slice()
  });
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.createFlashCardLevels = (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => (
    createIntervalLevels(false, true)
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