import * as React from 'react';
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody, Grid } from '@material-ui/core';

import * as Utils from '../../Utils';
import { FlashCard } from 'src/FlashCard';
import { FlashCardGroup } from 'src/FlashCardGroup';
import { Pitch } from 'src/Pitch';
import { PitchLetter } from 'src/PitchLetter';
import { VerticalDirection } from 'src/VerticalDirection';
import { Interval } from 'src/Interval';

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

export interface IIntervalNotesFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  selectedFlashCardIndices: number[];
  onChange?: (newValue: number[]) => void;
}
export interface IIntervalNotesFlashCardMultiSelectState {
  enabledRootNotes: Pitch[];
  enabledIntervals: string[];
  enabledSigns: string[];
}
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
        const isChecked = this.state.enabledRootNotes.indexOf(rootNote) >= 0;
        const isEnabled = !isChecked || (this.state.enabledRootNotes.length > 1);

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
        const isChecked = this.state.enabledIntervals.indexOf(interval) >= 0;
        const isEnabled = !isChecked || (this.state.enabledIntervals.length > 1);

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
        const isChecked = this.state.enabledSigns.indexOf(sign) >= 0;
        const isEnabled = !isChecked || (this.state.enabledSigns.length > 1);

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
      this.state.enabledRootNotes,
      rootNote
    );
    
    if (newEnabledRootNotes.length > 0) {
      this.setState({ enabledRootNotes: newEnabledRootNotes });
      this.onChange(newEnabledRootNotes, this.state.enabledIntervals, this.state.enabledSigns);
    }
  }
  private toggleIntervalEnabled(interval: string) {
    const newEnabledIntervals = Utils.toggleArrayElement(
      this.state.enabledIntervals,
      interval
    );
    
    if (newEnabledIntervals.length > 0) {
      this.setState({ enabledIntervals: newEnabledIntervals });
      this.onChange(this.state.enabledRootNotes, newEnabledIntervals, this.state.enabledSigns);
    }
  }
  private toggleSignEnabled(sign: string) {
    const newEnabledSigns = Utils.toggleArrayElement(
      this.state.enabledSigns,
      sign
    );
    
    if (newEnabledSigns.length > 0) {
      this.setState({ enabledSigns: newEnabledSigns });
      this.onChange(this.state.enabledRootNotes, this.state.enabledIntervals, newEnabledSigns);
    }
  }
  private onChange(enabledRootNotes: Pitch[], enabledIntervals: string[], enabledSigns: string[]) {
    if (!this.props.onChange) { return; }

    const newEnabledFlashCardIndices = Utils.flattenArrays<boolean>(rootNotes
      .map(rootNote => intervals
        .map(interval => signs
          .map(sign =>
            Utils.arrayContains(enabledRootNotes, rootNote) &&
            Utils.arrayContains(enabledIntervals, interval) &&
            Utils.arrayContains(enabledSigns, sign)
          )
        )
      )
    )
    .map((x, i) => x ? i : -1)
    .filter(i => i >= 0);

    this.props.onChange(newEnabledFlashCardIndices);
  }
}

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = Utils.flattenArrays<FlashCard>(rootNotes
    .map(rootNote => intervals
      .map(interval => signs
        .map(sign => {
          const intervalQuality = interval[0];
          const intervalQualityNum = Utils.intervalQualityToNumber(intervalQuality);

          const genericInterval = interval[1];
          const genericIntervalNum = parseInt(genericInterval, 10);

          const newPitch = Pitch.addInterval(
            rootNote,
            (sign === "+") ? VerticalDirection.Up : VerticalDirection.Down,
            new Interval(genericIntervalNum, intervalQualityNum)
          );
          
          return new FlashCard(
            rootNote.toString(false) + " " + sign + " " + interval,
            newPitch.toString(false)
          );
        })
      )
    )
  );
  const renderFlashCardMultiSelect = (
    selectedFlashCardIndices: number[],
    onChange: (newValue: number[]) => void
  ): JSX.Element => {
    return (
    <IntervalNotesFlashCardMultiSelect
      flashCards={flashCards}
      selectedFlashCardIndices={selectedFlashCardIndices}
      onChange={onChange}
    />
    );
  };
  
  const group = new FlashCardGroup(
    "Interval 2nd Notes",
    flashCards
  );
  group.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  group.enableInvertFlashCards = false;
  return group;
}