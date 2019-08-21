import * as React from "react";
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody, Grid } from "@material-ui/core";

import * as Utils from "../../Utils";
import { FlashCard, FlashCardId } from "../../FlashCard";
import { Pitch } from "../../Pitch";
import { FlashCardStudySessionInfo, FlashCardSet } from '../../FlashCardSet';
import { getValidKeyPitches } from '../../Key';
import { CheckboxColumnsFlashCardMultiSelect, CheckboxColumnCell, CheckboxColumn } from './CheckboxColumnsFlashCardMultiSelect';

export const firstPitches = getValidKeyPitches(4);
export const intervals = [
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
export const directions = ["↑", "↓"];
export const directionsWithHarmonic = directions.concat(["harmonic"]);

export function forEachInterval(
  firstPitches: Array<Pitch>,
  callbackFn: (interval: string, direction: string, pitch1: Pitch, pitch2: Pitch, isHarmonicInterval: boolean, index: number) => void,
  includeHarmonicIntervals: boolean,
  minPitch?: Pitch,
  maxPitch?: Pitch
) {
  let i = 0;
  const theDirections = includeHarmonicIntervals ? directionsWithHarmonic : directions;

  for (const firstPitch of firstPitches) {
    for (let intervalIndex = 0; intervalIndex < intervals.length; intervalIndex++) {
      const interval = intervals[intervalIndex];

      for (const direction of theDirections) {
        const intervalHalfSteps = (direction === "↑")
          ? intervalIndex + 1
          : -(intervalIndex + 1);
        const newPitch = Pitch.createFromMidiNumber(firstPitch.midiNumber + intervalHalfSteps);

        if (minPitch && (newPitch.midiNumber < minPitch.midiNumber)) {
          continue;
        }
        
        if (maxPitch && (newPitch.midiNumber > maxPitch.midiNumber)) {
          continue;
        }
        
        const isHarmonicInterval = direction === "harmonic";

        callbackFn(interval, direction, firstPitch, newPitch, isHarmonicInterval, i);
        i++;
      }
    }
  }
}

export interface IConfigData {
  enabledFirstPitches: Pitch[];
  enabledIntervals: string[];
  enabledDirections: string[];
}

export function configDataToEnabledFlashCardIds(
  enableHarmonicIntervals: boolean,
  hasFlashCardPerFirstPitch: boolean,
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
): Array<FlashCardId> {
  const directionsToUse = enableHarmonicIntervals ? directionsWithHarmonic : directions;

  if (hasFlashCardPerFirstPitch) {
    return Utils.flattenArrays<boolean>(firstPitches
      .map(firstPitch => intervals
        .map(interval => directionsToUse
          .map(direction =>
            Utils.arrayContains(configData.enabledFirstPitches, firstPitch) &&
            Utils.arrayContains(configData.enabledIntervals, interval) &&
            Utils.arrayContains(configData.enabledDirections, direction)
          )
        )
      )
    )
      .map((x, i) => x ? i : -1)
      .filter(i => i >= 0)
      .map(i => flashCards[i].id);
  } else {
    return Utils.flattenArrays<boolean>(intervals
      .map(interval => directionsToUse
        .map(direction =>
          Utils.arrayContains(configData.enabledIntervals, interval) &&
          Utils.arrayContains(configData.enabledDirections, direction)
        )
      )
    )
      .map((x, i) => x ? i : -1)
      .filter(i => i >= 0)
      .map(i => flashCards[i].id);
  }
}

export interface IIntervalEarTrainingFlashCardMultiSelectProps {
  studySessionInfo: FlashCardStudySessionInfo;
  hasFlashCardPerFirstPitch: boolean;
  enableHarmonicIntervals: boolean;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export class IntervalEarTrainingFlashCardMultiSelect extends React.Component<IIntervalEarTrainingFlashCardMultiSelectProps, {}> {
  public render(): JSX.Element {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const selectedCellDatas = [
      //configData.enabledFirstPitches,
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

  private get directionsSource(): Array<string> {
    return !this.props.enableHarmonicIntervals ? directions : directionsWithHarmonic;
  }

  private columns: Array<CheckboxColumn> = [
    /*new CheckboxColumn(
      "First Pitch",
      firstPitches
        .map(fp => new CheckboxColumnCell(
          () => <span>{fp.toString(false, true)}</span>, fp
        )),
      (a: Pitch, b: Pitch) => a === b
    ),*/
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
      this.directionsSource
        .map(d => new CheckboxColumnCell(
          () => <span>{d}</span>, d
        )),
      (a: string, b: string) => a === b
    )
  ];

  private onChange(newSelectedCellDatas: Array<Array<any>>) {
    if (!this.props.onChange) { return; }

    const oldConfigData = this.props.studySessionInfo.configData as IConfigData;
    const newConfigData: IConfigData = {
      enabledFirstPitches: oldConfigData.enabledFirstPitches,
      enabledIntervals: newSelectedCellDatas[0] as Array<string>,
      enabledDirections: newSelectedCellDatas[1] as Array<string>
    };

    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(
      this.props.enableHarmonicIntervals, this.props.hasFlashCardPerFirstPitch,
      this.props.studySessionInfo.flashCardSet, this.props.studySessionInfo.flashCards,
      newConfigData
    );
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}