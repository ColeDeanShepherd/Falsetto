import * as React from 'react';
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody, Grid } from '@material-ui/core';

import * as Utils from '../../Utils';
import { FlashCard } from 'src/FlashCard';
import { FlashCardGroup } from 'src/FlashCardGroup';
import { Pitch, pitchRange } from 'src/Pitch';
import { PitchLetter } from 'src/PitchLetter';
import { SheetMusicChord } from '../SheetMusicChord';

const minPitch = new Pitch(PitchLetter.C, -1, 2);
const maxPitch = new Pitch(PitchLetter.C, 1, 6);
const notes = pitchRange(minPitch, maxPitch, -1, 1);
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

// TODO: instead of generating all flash cards ahead of time, dynamically generate each one

export interface IIntervalNotesFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  selectedFlashCardIndices: number[];
  onChange?: (newValue: number[]) => void;
}
export interface IIntervalNotesFlashCardMultiSelectState {
  enabledIntervals: string[];
}
export class IntervalNotesFlashCardMultiSelect extends React.Component<IIntervalNotesFlashCardMultiSelectProps, IIntervalNotesFlashCardMultiSelectState> {
  public constructor(props: IIntervalNotesFlashCardMultiSelectProps) {
    super(props);

    this.state = {
      enabledIntervals: intervals.slice()
    };
  }
  public render(): JSX.Element {
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

    return (
      <Grid container spacing={32}>
        <Grid item xs={4}>{intervalCheckboxes}</Grid>
      </Grid>
    );
  }

  private toggleIntervalEnabled(interval: string) {
    const newEnabledIntervals = Utils.toggleArrayElement(
      this.state.enabledIntervals,
      interval
    );
    
    if (newEnabledIntervals.length > 0) {
      this.setState({ enabledIntervals: newEnabledIntervals });
      this.onChange(newEnabledIntervals);
    }
  }
  private onChange(enabledIntervals: string[]) {
    if (!this.props.onChange) { return; }

    const newEnabledFlashCardIndices = new Array<number>();

    for (let i = 0; i < notes.length; i++) {
      for (let j = i + 1; j < notes.length; j++) {
        const pitches = [notes[i], notes[j]];
        const interval = Pitch.getInterval(pitches[0], pitches[1]);

        if (Utils.arrayContains(intervals, interval.toString())) {
          newEnabledFlashCardIndices.push(newEnabledFlashCardIndices.length);
        }
      }
    }

    this.props.onChange(newEnabledFlashCardIndices);
  }
}

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = new Array<FlashCard>();

  for (let i = 0; i < notes.length; i++) {
    for (let j = i + 1; j < notes.length; j++) {
      const pitches = [notes[i], notes[j]];
      const interval = Pitch.getInterval(pitches[0], pitches[1]);
      if (interval.type > 8) { continue; }

      flashCards.push(new FlashCard(
        () => (
          <div>
            <SheetMusicChord
              width={300} height={200}
              pitches={pitches}
            />
          </div>
        ),
        interval.toString()
      ));
    }
  }

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
    "Sheet Music Intervals",
    flashCards
  );
  group.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  group.enableInvertFlashCards = false;
  return group;
}