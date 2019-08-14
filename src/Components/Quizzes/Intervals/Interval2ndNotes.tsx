import * as React from "react";
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody, Grid } from "@material-ui/core";

import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardSet, RenderAnswerSelectArgs } from "../../../FlashCardSet";
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

export function configDataToEnabledFlashCardIds(flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData): Array<FlashCardId> {
  return Utils.flattenArrays<boolean>(rootNotes
    .map(rootNote => intervals
      .map(interval => directions
        .map(direction =>
          Utils.arrayContains(configData.enabledRootNotes, rootNote) &&
          Utils.arrayContains(configData.enabledIntervals, interval) &&
          Utils.arrayContains(configData.enabledDirections, direction)
        )
      )
    )
  )
    .map((x, i) => x ? i : -1)
    .filter(i => i >= 0);
}

export interface IIntervalNotesFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  configData: IConfigData;
  selectedFlashCardIds: Array<FlashCardId>;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export interface IIntervalNotesFlashCardMultiSelectState {}
export class IntervalNotesFlashCardMultiSelect extends React.Component<IIntervalNotesFlashCardMultiSelectProps, IIntervalNotesFlashCardMultiSelectState> {
  public render(): JSX.Element {
    const rootNoteCheckboxTableRows = rootNotes
      .map((rootNote, i) => {
        const isChecked = this.props.configData.enabledRootNotes.indexOf(rootNote) >= 0;
        const isEnabled = !isChecked || (this.props.configData.enabledRootNotes.length > 1);

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
    
    const directionCheckboxTableRows = directions
      .map((direction, i) => {
        const isChecked = this.props.configData.enabledDirections.indexOf(direction) >= 0;
        const isEnabled = !isChecked || (this.props.configData.enabledDirections.length > 1);

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
    const newEnabledRootNotes = Utils.toggleArrayElement(
      this.props.configData.enabledRootNotes,
      rootNote
    );
    
    if (newEnabledRootNotes.length > 0) {
      const newConfigData: IConfigData = {
        enabledRootNotes: newEnabledRootNotes,
        enabledIntervals: this.props.configData.enabledIntervals,
        enabledDirections: this.props.configData.enabledDirections
      };
      this.onChange(newConfigData);
    }
  }
  private toggleIntervalEnabled(interval: string) {
    const newEnabledIntervals = Utils.toggleArrayElement(
      this.props.configData.enabledIntervals,
      interval
    );
    
    if (newEnabledIntervals.length > 0) {
      const newConfigData: IConfigData = {
        enabledRootNotes: this.props.configData.enabledRootNotes,
        enabledIntervals: newEnabledIntervals,
        enabledDirections: this.props.configData.enabledDirections
      };
      this.onChange(newConfigData);
    }
  }
  private toggleSignsEnabled(direction: string) {
    const newEnabledDirections = Utils.toggleArrayElement(
      this.props.configData.enabledDirections,
      direction
    );
    
    if (newEnabledDirections.length > 0) {
      const newConfigData: IConfigData = {
        enabledRootNotes: this.props.configData.enabledRootNotes,
        enabledIntervals: this.props.configData.enabledIntervals,
        enabledDirections: newEnabledDirections
      };
      this.onChange(newConfigData);
    }
  }
  private onChange(newConfigData: IConfigData) {
    if (!this.props.onChange) { return; }

    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(newConfigData);
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}

export function renderNoteAnswerSelect(
  state: RenderAnswerSelectArgs
): JSX.Element {
  const doubleSharpNotes = ["A##", "B##", "C##", "D##", "E##", "F##", "G##"];
  const sharpNotes = ["A#", "B#", "C#", "D#", "E#", "F#", "G#"];
  const naturalNotes = ["A", "B", "C", "D", "E", "F", "G"];
  const flatNotes = ["Ab", "Bb", "Cb", "Db", "Eb", "Fb", "Gb"];
  const doubleFlatNotes = ["Abb", "Bbb", "Cbb", "Dbb", "Ebb", "Fbb", "Gbb"];

  return (
    <div>
      {FlashCardUtils.renderStringAnswerSelectInternal(
        `${state.currentFlashCardId}.0`, doubleSharpNotes, state
      )}
      {FlashCardUtils.renderStringAnswerSelectInternal(
        `${state.currentFlashCardId}.1`, sharpNotes, state
      )}
      {FlashCardUtils.renderStringAnswerSelectInternal(
        `${state.currentFlashCardId}.2`, naturalNotes, state
      )}
      {FlashCardUtils.renderStringAnswerSelectInternal(
        `${state.currentFlashCardId}.3`, flatNotes, state
      )}
      {FlashCardUtils.renderStringAnswerSelectInternal(
        `${state.currentFlashCardId}.4`, doubleFlatNotes, state
      )}
    </div>
  );
}

export function createFlashCards(): Array<FlashCard> {
  return Utils.flattenArrays<FlashCard>(rootNotes
    .map(rootPitch => intervals
      .map(interval => directions
        .map(direction => {
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

          return FlashCard.fromRenderFns(
            id,
            rootPitch.toString(false) + " " + direction + " " + interval,
            newPitch.toString(false)
          );
        })
      )
    )
  );
}
export function createFlashCardSet(): FlashCardSet {
  const renderFlashCardMultiSelect = (
    flashCards: Array<FlashCard>,
    selectedFlashCardIds: Array<FlashCardId>,
    configData: any,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return (
    <IntervalNotesFlashCardMultiSelect
      flashCards={flashCards}
      configData={configData}
      selectedFlashCardIds={selectedFlashCardIds}
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
  flashCardSet.initialSelectedFlashCardIds = configDataToEnabledFlashCardIds(flashCardSet, initialConfigData);
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.enableInvertFlashCards = false;
  flashCardSet.renderAnswerSelect = renderNoteAnswerSelect;
  flashCardSet.containerHeight = "80px";

  return flashCardSet;
}