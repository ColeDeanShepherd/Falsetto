import * as React from 'react';
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody, Grid } from '@material-ui/core';
import * as Vex from 'vexflow';

import * as Utils from '../../Utils';
import { FlashCard } from 'src/FlashCard';
import { FlashCardGroup } from 'src/FlashCardGroup';
import Pitch from 'src/Pitch';
import { PitchLetter } from 'src/PitchLetter';
import { VerticalDirection } from 'src/VerticalDirection';
import { VexFlowComponent } from '../VexFlowComponent';

const minPitch = new Pitch(PitchLetter.C, -1, 2);
const maxPitch = new Pitch(PitchLetter.C, 1, 6);
const notes = getPossibleNotes();
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

// TODO: instead of generating all flash cards ahead of time, dynamically generate each one
function getPossibleNotes(): Array<Pitch> {
  const minLineOrSpaceOnStaffNumber = minPitch.lineOrSpaceOnStaffNumber;
  const maxLineOrSpaceOnStaffNumber = maxPitch.lineOrSpaceOnStaffNumber;
  const possibleNotes = new Array<Pitch>();

  for (
    let lineOrSpaceOnStaffNumber = minLineOrSpaceOnStaffNumber;
    lineOrSpaceOnStaffNumber < maxLineOrSpaceOnStaffNumber;
    lineOrSpaceOnStaffNumber++
  ) {
    for (let signedAccidental = -1; signedAccidental < 1; signedAccidental++) {
      possibleNotes.push(Pitch.createFromLineOrSpaceOnStaffNumber(
        lineOrSpaceOnStaffNumber,
        signedAccidental
      ));
    }
  }

  return possibleNotes;
}

export interface ISheetMusicIntervalProps {
  width: number;
  height: number;
  pitches: Array<Pitch>;
}
export class SheetMusicInterval extends React.Component<ISheetMusicIntervalProps, {}> {
  public render(): JSX.Element {
    const vexFlowRender = this.vexFlowRender.bind(this);
    return <VexFlowComponent width={this.props.width} height={this.props.height} vexFlowRender={vexFlowRender} />;
  }

  private vexFlowRender(context: Vex.IRenderContext) {
    Utils.assert(this.props.pitches.length >= 2);

    context.setFont("Arial", 10).setBackgroundFillStyle("#eed");

    // Create the staves
    const staveLength = this.props.width;
    const staveX = 20;

    const topStaff = new Vex.Flow.Stave(staveX, 0, staveLength);
    topStaff.addClef('treble');
    //topStaff.addTimeSignature("4/4");

    const bottomStaff = new Vex.Flow.Stave(staveX, 80, staveLength);
    bottomStaff.addClef('bass');
    //bottomStaff.addTimeSignature("4/4");

    const brace = new Vex.Flow.StaveConnector(topStaff, bottomStaff).setType(3);
    const lineLeft = new Vex.Flow.StaveConnector(topStaff, bottomStaff).setType(1);
    const lineRight = new Vex.Flow.StaveConnector(topStaff, bottomStaff).setType(6);

    topStaff.setContext(context).draw();
    bottomStaff.setContext(context).draw();

    brace.setContext(context).draw();
    lineLeft.setContext(context).draw();
    lineRight.setContext(context).draw();

    const voiceTreble = new Vex.Flow.Voice({num_beats:4, beat_value: 4, resolution:Vex.Flow.RESOLUTION});
    const voiceBass = new Vex.Flow.Voice({num_beats:4, beat_value: 4, resolution:Vex.Flow.RESOLUTION});
    
    const lowestTrebleClefPitch = new Pitch(PitchLetter.C, 0, 4);
    const isPitchInTrebleClef = (pitch: Pitch) => pitch.midiNumber >= lowestTrebleClefPitch.midiNumber;

    // TODO: need to add accidentals
    const treblePitches = this.props.pitches
      .filter(p => isPitchInTrebleClef(p));
    const trebleVexFlowNotes = (treblePitches.length > 0) ? [
      new Vex.Flow.StaveNote({
        clef: "treble",
        keys: treblePitches.map(p => p.toVexFlowString()),
        duration: "w"
      })
    ] : [
      new Vex.Flow.StaveNote({
        clef: "treble",
        keys: ["b/4"],
        duration: "wr"
      })
    ];
    // add treble clef accidentals to VexFlow
    for (let i = 0; i < treblePitches.length; i++) {
      const pitch = treblePitches[i];

      if (pitch.signedAccidental !== 0) {
        trebleVexFlowNotes[0].addAccidental(i, new Vex.Flow.Accidental(pitch.getAccidentalString()))
      }
    }

    const bassPitches = this.props.pitches
      .filter(p => !isPitchInTrebleClef(p));
    const bassVexFlowNotes = (bassPitches.length > 0) ? [
      new Vex.Flow.StaveNote({
        clef: "bass",
        keys: bassPitches.map(p => p.toVexFlowString()),
        duration: "w"
      })
    ] : [
      new Vex.Flow.StaveNote({
        clef: "bass",
        keys: ["d/3"],
        duration: "wr"
      })
    ];
    // add bass clef accidentals to VexFlow
    for (let i = 0; i < bassPitches.length; i++) {
      const pitch = bassPitches[i];

      if (pitch.signedAccidental !== 0) {
        bassVexFlowNotes[0].addAccidental(i, new Vex.Flow.Accidental(pitch.getAccidentalString()))
      }
    }

    voiceTreble.addTickables(trebleVexFlowNotes).setStave(topStaff);
    voiceBass.addTickables(bassVexFlowNotes).setStave(bottomStaff);
    
    const formatter = new Vex.Flow.Formatter();
    
    // Make sure the staves have the same starting point for notes
    const startX = Math.max(topStaff.getNoteStartX(), bottomStaff.getNoteStartX());
    topStaff.setNoteStartX(startX);
    bottomStaff.setNoteStartX(startX);
    
    // the treble and bass are joined independently but formatted together
    formatter.joinVoices([voiceTreble]);
    formatter.joinVoices([voiceBass]);
    formatter.format([voiceTreble, voiceBass], staveLength - (startX - staveX));
    
    voiceTreble.draw(context);
    voiceBass.draw(context);
  }
}

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
            {pitches[0].toString(true) + ", " + pitches[1].toString(true)}
            <SheetMusicInterval
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