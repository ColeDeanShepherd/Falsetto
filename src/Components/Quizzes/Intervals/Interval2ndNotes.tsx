import * as React from "react";
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody, Grid } from "@material-ui/core";

import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { Pitch } from "../../../Pitch";
import { PitchLetter } from "../../../PitchLetter";
import { VerticalDirection } from "../../../VerticalDirection";
import { Interval } from "../../../Interval";

const flashCardSetId = "interval2ndNotes";

const rootNotes = [
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
  enabledRootNotes: Pitch[];
  enabledIntervals: string[];
  enabledDirections: string[];
}

export function forEachInterval(callbackFn: (rootNote: Pitch, interval: string, direction: string, i: number) => void) {
  let i = 0;

  for (const rootNote of rootNotes) {
    for (const interval of intervals) {
      for (const direction of directions) {
        callbackFn(rootNote, interval, direction, i);
        i++;
      }
    }
  }
}
export function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
): Array<FlashCardId> {
  const flashCardIds = new Array<FlashCardId>();

  forEachInterval((rootNote, interval, direction, i) => {
    if (
      Utils.arrayContains(configData.enabledRootNotes, rootNote) &&
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
    const rootNoteCheckboxTableRows = rootNotes
      .map((rootNote, i) => {
        const isChecked = configData.enabledRootNotes.indexOf(rootNote) >= 0;
        const isEnabled = !isChecked || (configData.enabledRootNotes.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleRootNoteEnabled(rootNote)} disabled={!isEnabled} /></TableCell>
            <TableCell>{rootNote.toString(false)}</TableCell>
          </TableRow>
        );
      }, this);
    const rootNoteCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Root Note</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rootNoteCheckboxTableRows}
        </TableBody>
      </Table>
    );
    
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
    
    const directionCheckboxTableRows = directions
      .map((direction, i) => {
        const isChecked = configData.enabledDirections.indexOf(direction) >= 0;
        const isEnabled = !isChecked || (configData.enabledDirections.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleSignsEnabled(direction)} disabled={!isEnabled} /></TableCell>
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
        <Grid item xs={4}>{rootNoteCheckboxes}</Grid>
        <Grid item xs={4}>{intervalCheckboxes}</Grid>
        <Grid item xs={4}>{directionCheckboxes}</Grid>
      </Grid>
    );
  }

  private toggleRootNoteEnabled(rootNote: Pitch) {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const newEnabledRootNotes = Utils.toggleArrayElement(
      configData.enabledRootNotes,
      rootNote
    );
    
    if (newEnabledRootNotes.length > 0) {
      const newConfigData: IConfigData = {
        enabledRootNotes: newEnabledRootNotes,
        enabledIntervals: configData.enabledIntervals,
        enabledDirections: configData.enabledDirections
      };
      this.onChange(newConfigData);
    }
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
  private toggleSignsEnabled(direction: string) {
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

    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(
      this.props.studySessionInfo.flashCardSet, this.props.studySessionInfo.flashCards, newConfigData
    );
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}

export function renderNoteAnswerSelect(
  info: FlashCardStudySessionInfo
): JSX.Element {
  const doubleSharpNotes = ["A##", "B##", "C##", "D##", "E##", "F##", "G##"];
  const sharpNotes = ["A#", "B#", "C#", "D#", "E#", "F#", "G#"];
  const naturalNotes = ["A", "B", "C", "D", "E", "F", "G"];
  const flatNotes = ["Ab", "Bb", "Cb", "Db", "Eb", "Fb", "Gb"];
  const doubleFlatNotes = ["Abb", "Bbb", "Cbb", "Dbb", "Ebb", "Fbb", "Gbb"];

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

  forEachInterval((rootPitch, interval, direction, i) => {
    const intervalQuality = interval[0];
    const intervalQualityNum = Utils.intervalQualityToNumber(intervalQuality);

    const genericInterval = interval[1];
    const genericIntervalNum = parseInt(genericInterval, 10);

    const verticalDirection = (direction === "↑") ? VerticalDirection.Up : VerticalDirection.Down;
    const newPitch = Pitch.addInterval(
      rootPitch,
      verticalDirection,
      new Interval(genericIntervalNum, intervalQualityNum)
    );
    
    const deserializedId = {
      set: flashCardSetId,
      rootPitch: rootPitch.toString(true, false),
      interval: interval.toString(),
      direction: VerticalDirection[verticalDirection]
    };
    const id = JSON.stringify(deserializedId);

    const flashCard = FlashCard.fromRenderFns(
      id,
      rootPitch.toString(false) + " " + direction + " " + interval,
      newPitch.toString(false)
    );

    flashCards.push(flashCard);
  });

  return flashCards;
}
export function createFlashCardSet(): FlashCardSet {
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

  const initialConfigData: IConfigData = {
    enabledRootNotes: rootNotes.slice(),
    enabledIntervals: intervals.slice(),
    enabledDirections: directions.slice()
  };
  
  const flashCardSet = new FlashCardSet(flashCardSetId,
    "Interval 2nd Notes",
    createFlashCards
  );
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = renderNoteAnswerSelect;
  flashCardSet.containerHeight = "80px";

  return flashCardSet;
}