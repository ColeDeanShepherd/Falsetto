import * as React from "react";
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody, Grid } from "@material-ui/core";

import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";
import { Pitch } from "../../../Pitch";
import { PitchLetter } from "../../../PitchLetter";
import { VerticalDirection } from "../../../VerticalDirection";
import { Interval } from "../../../Interval";

const flashCardSetId = "notesToIntervals";
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
const signs = ["+", "-"];

interface IConfigData {
  enabledRootNotes: Pitch[];
  enabledIntervals: string[];
  enabledSigns: string[];
}

export function configDataToEnabledFlashCardIds(info: FlashCardStudySessionInfo, configData: IConfigData): Array<FlashCardId> {
  return Utils.flattenArrays<boolean>(rootNotes
    .map(rootNote => intervals
      .map(interval => signs
        .map(sign =>
          Utils.arrayContains(configData.enabledRootNotes, rootNote) &&
          Utils.arrayContains(configData.enabledIntervals, interval) &&
          Utils.arrayContains(configData.enabledSigns, sign)
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
  public constructor(props: IIntervalNotesFlashCardMultiSelectProps) {
    super(props);

    this.state = {
      enabledRootNotes: rootNotes.slice(),
      enabledIntervals: intervals.slice(),
      enabledSigns: signs.slice()
    };
  }
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
    
    const signCheckboxTableRows = signs
      .map((sign, i) => {
        const isChecked = this.props.configData.enabledSigns.indexOf(sign) >= 0;
        const isEnabled = !isChecked || (this.props.configData.enabledSigns.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleSignEnabled(sign)} disabled={!isEnabled} /></TableCell>
            <TableCell>{sign}</TableCell>
          </TableRow>
        );
      }, this);
    const signCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Direction</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {signCheckboxTableRows}
        </TableBody>
      </Table>
    );

    return (
      <Grid container spacing={32}>
        <Grid item xs={4}>{rootNoteCheckboxes}</Grid>
        <Grid item xs={4}>{intervalCheckboxes}</Grid>
        <Grid item xs={4}>{signCheckboxes}</Grid>
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
        enabledSigns: this.props.configData.enabledSigns
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
        enabledSigns: this.props.configData.enabledSigns
      };
      this.onChange(newConfigData);
    }
  }
  private toggleSignEnabled(sign: string) {
    const newEnabledSigns = Utils.toggleArrayElement(
      this.props.configData.enabledSigns,
      sign
    );
    
    if (newEnabledSigns.length > 0) {
      const newConfigData: IConfigData = {
        enabledRootNotes: this.props.configData.enabledRootNotes,
        enabledIntervals: this.props.configData.enabledIntervals,
        enabledSigns: newEnabledSigns
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

export function createFlashCards(): Array<FlashCard> {
  return Utils.flattenArrays<FlashCard>(rootNotes
    .map(rootPitch => intervals
      .map(interval => signs
        .map(sign => {
          const intervalQuality = interval[0];
          const intervalQualityNum = Utils.intervalQualityToNumber(intervalQuality);

          const genericInterval = interval[1];
          const genericIntervalNum = parseInt(genericInterval, 10);

          const newPitch = Pitch.addInterval(
            rootPitch,
            (sign === "+") ? VerticalDirection.Up : VerticalDirection.Down,
            new Interval(genericIntervalNum, intervalQualityNum)
          );
          
          const deserializedId = {
            set: flashCardSetId,
            pitches: [rootPitch.toString(true), newPitch.toString(true)]
          };
          const id = JSON.stringify(deserializedId);
          
          return FlashCard.fromRenderFns(
            id,
            rootPitch.toString(true) + ", " + newPitch.toString(true),
            interval
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
    enabledSigns: signs.slice()
  };
  
  const flashCardSet = new FlashCardSet(flashCardSetId,
    "Notes To Intervals",
    createFlashCards
  );
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds configDataToEnabledFlashCardIds(flashCardSet, initialConfigData);
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.enableInvertFlashCards = false;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.containerHeight = "80px";

  return flashCardSet;
}