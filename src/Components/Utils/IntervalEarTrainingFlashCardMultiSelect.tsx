import * as React from "react";
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody, Grid } from "@material-ui/core";

import * as Utils from "../../Utils";
import { FlashCard, FlashCardId } from "../../FlashCard";
import { Pitch } from "../../Pitch";
import { PitchLetter } from "../../PitchLetter";
import { FlashCardStudySessionInfo, FlashCardSet } from '../../FlashCardSet';

// TODO: move this somewhere else
export const rootNotes = [
  new Pitch(PitchLetter.C, -1, 4),
  new Pitch(PitchLetter.C, 0, 4),
  new Pitch(PitchLetter.C, 1, 4),
  new Pitch(PitchLetter.D, -1, 4),
  new Pitch(PitchLetter.D, 0, 4),
  new Pitch(PitchLetter.E, -1, 4),
  new Pitch(PitchLetter.E, 0, 4),
  new Pitch(PitchLetter.F, 0, 4),
  new Pitch(PitchLetter.F, 1, 4),
  new Pitch(PitchLetter.G, -1, 4),
  new Pitch(PitchLetter.G, 0, 4),
  new Pitch(PitchLetter.A, -1, 4),
  new Pitch(PitchLetter.A, 0, 4),
  new Pitch(PitchLetter.B, -1, 4),
  new Pitch(PitchLetter.B, 0, 4)
];
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
  rootNotes: Array<Pitch>,
  callbackFn: (interval: string, direction: string, pitch1: Pitch, pitch2: Pitch, isHarmonicInterval: boolean, index: number) => void,
  includeHarmonicIntervals: boolean,
  minPitch?: Pitch,
  maxPitch?: Pitch
) {
  let i = 0;
  const theDirections = includeHarmonicIntervals ? directionsWithHarmonic : directions;

  for (const rootPitch of rootNotes) {
    for (let intervalIndex = 0; intervalIndex < intervals.length; intervalIndex++) {
      const interval = intervals[intervalIndex];

      for (const direction of theDirections) {
        const intervalHalfSteps = (direction === "↑")
          ? intervalIndex + 1
          : -(intervalIndex + 1);
        const newPitch = Pitch.createFromMidiNumber(rootPitch.midiNumber + intervalHalfSteps);

        if (minPitch && (newPitch.midiNumber < minPitch.midiNumber)) {
          continue;
        }
        
        if (maxPitch && (newPitch.midiNumber > maxPitch.midiNumber)) {
          continue;
        }
        
        const isHarmonicInterval = direction === "harmonic";

        callbackFn(interval, direction, rootPitch, newPitch, isHarmonicInterval, i);
        i++;
      }
    }
  }
}

export interface IConfigData {
  enabledRootNotes: Pitch[];
  enabledIntervals: string[];
  enabledDirections: string[];
}

export function configDataToEnabledFlashCardIds(
  enableHarmonicIntervals: boolean,
  hasFlashCardPerRootNote: boolean,
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
): Array<FlashCardId> {
  const directionsToUse = enableHarmonicIntervals ? directionsWithHarmonic : directions;

  if (hasFlashCardPerRootNote) {
    return Utils.flattenArrays<boolean>(rootNotes
      .map(rootNote => intervals
        .map(interval => directionsToUse
          .map(direction =>
            Utils.arrayContains(configData.enabledRootNotes, rootNote) &&
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
  hasFlashCardPerRootNote: boolean;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
  enableHarmonicIntervals?: boolean;
}
export interface IIntervalEarTrainingFlashCardMultiSelectState {}
export class IntervalEarTrainingFlashCardMultiSelect extends React.Component<IIntervalEarTrainingFlashCardMultiSelectProps, IIntervalEarTrainingFlashCardMultiSelectState> {
  public constructor(props: IIntervalEarTrainingFlashCardMultiSelectProps) {
    super(props);

    this.state = {
      enabledRootNotes: rootNotes.slice(),
      enabledIntervals: intervals.slice(),
      enabledDirections: this.directionsSource.slice()
    };
  }
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
    
    const directionCheckboxTableRows = this.directionsSource
      .map((direction, i) => {
        const isChecked = configData.enabledDirections.indexOf(direction) >= 0;
        const isEnabled = !isChecked || (configData.enabledDirections.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleDirectionEnabled(direction)} disabled={!isEnabled} /></TableCell>
            <TableCell>{direction}</TableCell>
          </TableRow>
        );
      }, this);
    const directionCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Direction</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {directionCheckboxTableRows}
        </TableBody>
      </Table>
    );

    return (
      <Grid container spacing={32}>
        <Grid item xs={6}>{intervalCheckboxes}</Grid>
        <Grid item xs={6}>{directionCheckboxes}</Grid>
      </Grid>
    );
  }

  private get directionsSource(): Array<string> {
    return !this.props.enableHarmonicIntervals ? directions : directionsWithHarmonic;
  }

  private toggleIntervalEnabled(interval: string) {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const newEnabledIntervals = Utils.toggleArrayElement(
      configData.enabledIntervals,
      interval
    );
    
    if (newEnabledIntervals.length > 0) {
      const newConfigData: IConfigData = {
        enabledRootNotes: configData.enabledRootNotes,
        enabledIntervals: newEnabledIntervals,
        enabledDirections: configData.enabledDirections
      };
      this.onChange(newConfigData);
    }
  }
  private toggleDirectionEnabled(direction: string) {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const newEnabledDirections = Utils.toggleArrayElement(
      configData.enabledDirections,
      direction
    );
    
    if (newEnabledDirections.length > 0) {
      const newConfigData: IConfigData = {
        enabledRootNotes: configData.enabledRootNotes,
        enabledIntervals: configData.enabledIntervals,
        enabledDirections: newEnabledDirections
      };
      this.onChange(newConfigData);
    }
  }
  private onChange(newConfigData: IConfigData) {
    if (!this.props.onChange) { return; }

    const enableHarmonicIntervals = this.props.enableHarmonicIntervals === true;
    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(
      enableHarmonicIntervals, this.props.hasFlashCardPerRootNote,
      this.props.studySessionInfo.flashCardSet, this.props.studySessionInfo.flashCards, newConfigData
    );
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}