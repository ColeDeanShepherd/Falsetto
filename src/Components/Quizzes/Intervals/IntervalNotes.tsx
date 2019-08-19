import * as React from "react";
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody, Grid } from "@material-ui/core";

import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { Pitch } from "../../../Pitch";
import { VerticalDirection } from "../../../VerticalDirection";
import { Interval } from "../../../Interval";
import { getValidKeyPitches } from '../../../Key';

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
const signs = ["+", "-"];

interface IConfigData {
  enabledRootNotes: Pitch[];
  enabledIntervals: string[];
  enabledSigns: string[];
}

function forEachInterval(callbackFn: (rootNote: Pitch, interval: string, sign: string, i: number) => void) {
  let i = 0;
  
  for (const rootNote of firstPitches) {
    for (const interval of intervals) {
      for (const sign of signs) {
        callbackFn(rootNote, interval, sign, i);
        i++;
      }
    }
  }
}
export function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
): Array<FlashCardId> {
  const flashCardIds = new Array<FlashCardId>();

  forEachInterval((rootNote, interval, sign, i) => {
    if (
      Utils.arrayContains(configData.enabledRootNotes, rootNote) &&
      Utils.arrayContains(configData.enabledIntervals, interval) &&
      Utils.arrayContains(configData.enabledSigns, sign)
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
  public constructor(props: IIntervalNotesFlashCardMultiSelectProps) {
    super(props);

    this.state = {
      enabledRootNotes: firstPitches.slice(),
      enabledIntervals: intervals.slice(),
      enabledSigns: signs.slice()
    };
  }
  public render(): JSX.Element {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const rootNoteCheckboxTableRows = firstPitches
      .map((rootNote, i) => {
        const isChecked = configData.enabledRootNotes.indexOf(rootNote) >= 0;
        const isEnabled = !isChecked || (configData.enabledRootNotes.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleRootNoteEnabled(rootNote)} disabled={!isEnabled} /></TableCell>
            <TableCell>{rootNote.toString(false, true)}</TableCell>
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
    
    const signCheckboxTableRows = signs
      .map((sign, i) => {
        const isChecked = configData.enabledSigns.indexOf(sign) >= 0;
        const isEnabled = !isChecked || (configData.enabledSigns.length > 1);

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
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const newEnabledRootNotes = Utils.toggleArrayElement(
      configData.enabledRootNotes,
      rootNote
    );
    
    if (newEnabledRootNotes.length > 0) {
      const newConfigData: IConfigData = {
        enabledRootNotes: newEnabledRootNotes,
        enabledIntervals: configData.enabledIntervals,
        enabledSigns: configData.enabledSigns
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
        enabledSigns: configData.enabledSigns
      };
      this.onChange(newConfigData);
    }
  }
  private toggleSignEnabled(sign: string) {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const newEnabledSigns = Utils.toggleArrayElement(
      configData.enabledSigns,
      sign
    );
    
    if (newEnabledSigns.length > 0) {
      const newConfigData: IConfigData = {
        enabledRootNotes: configData.enabledRootNotes,
        enabledIntervals: configData.enabledIntervals,
        enabledSigns: newEnabledSigns
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

export function createFlashCards(): Array<FlashCard> {
  const flashCards = new Array<FlashCard>();
  
  forEachInterval((rootPitch, interval, sign, i) => {
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
    
    const flashCard = FlashCard.fromRenderFns(
      id,
      rootPitch.toString(true) + ", " + newPitch.toString(true),
      interval
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
    enabledRootNotes: firstPitches.slice(),
    enabledIntervals: intervals.slice(),
    enabledSigns: signs.slice()
  };
  
  const flashCardSet = new FlashCardSet(flashCardSetId,
    "Notes To Intervals",
    createFlashCards
  );
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.containerHeight = "80px";

  return flashCardSet;
}