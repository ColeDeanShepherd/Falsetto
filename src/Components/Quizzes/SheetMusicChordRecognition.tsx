import * as React from 'react';
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody, Grid } from '@material-ui/core';

import * as Utils from '../../Utils';
import { FlashCard } from 'src/FlashCard';
import { FlashCardGroup } from 'src/FlashCardGroup';
import { Pitch, pitchRange } from 'src/Pitch';
import { PitchLetter } from 'src/PitchLetter';
import { SheetMusicChord } from 'src/Components/SheetMusicChord';
import { Chord } from 'src/Chord';

// TODO: fix bug with FACE chords
const minPitch = new Pitch(PitchLetter.C, -1, 2);
const maxPitch = new Pitch(PitchLetter.C, 1, 6);
const rootPitches = pitchRange(minPitch, maxPitch, -1, 1);
const chords = [
  {
    type: "major",
    formulaString: "1 3 5"
  },
  {
    type: "minor",
    formulaString: "1 b3 5"
  },
  {
    type: "diminished",
    formulaString: "1 b3 b5"
  },
  {
    type: "augmented",
    formulaString: "1 3 #5"
  },
  {
    type: "sus2",
    formulaString: "1 2 5"
  },
  {
    type: "sus4",
    formulaString: "1 4 5"
  },
  {
    type: "major 7",
    formulaString: "1 3 5 7"
  },
  {
    type: "7",
    formulaString: "1 3 5 7b"
  },
  {
    type: "minor 7",
    formulaString: "1 3b 5 7b"
  },
  {
    type: "minor/major 7",
    formulaString: "1 3b 5 7"
  },
  {
    type: "half-diminished 8",
    formulaString: "1 b3 b5 7"
  },
  {
    type: "diminished 7",
    formulaString: "1 b3 b5 b7"
  },
  {
    type: "7",
    formulaString: "1 3 5 7"
  }
];

// TODO: instead of generating all flash cards ahead of time, dynamically generate each one

export interface IChordNotesFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  selectedFlashCardIndices: number[];
  onChange?: (newValue: number[]) => void;
}
export interface IChordNotesFlashCardMultiSelectState {
  enabledChordTypes: string[];
  enabledRootPitches: Pitch[];
}
export class ChordNotesFlashCardMultiSelect extends React.Component<IChordNotesFlashCardMultiSelectProps, IChordNotesFlashCardMultiSelectState> {
  public constructor(props: IChordNotesFlashCardMultiSelectProps) {
    super(props);

    this.state = {
      enabledChordTypes: chords.map(c => c.type),
      enabledRootPitches: rootPitches.slice()
    };
  }
  public render(): JSX.Element {
    const rootPitchCheckboxTableRows = rootPitches
      .map((rootPitch, i) => {
        const isChecked = this.state.enabledRootPitches.indexOf(rootPitch) >= 0;
        const isEnabled = !isChecked || (this.state.enabledRootPitches.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleRootPitchEnabled(rootPitch)} disabled={!isEnabled} /></TableCell>
            <TableCell>{rootPitch.toString(false)}</TableCell>
          </TableRow>
        );
      }, this);
    const rootPitchCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Root Pitch</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rootPitchCheckboxTableRows}
        </TableBody>
      </Table>
    );

    const chordTypeCheckboxTableRows = chords
      .map((chord, i) => {
        const isChecked = this.state.enabledChordTypes.indexOf(chord.type) >= 0;
        const isEnabled = !isChecked || (this.state.enabledChordTypes.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleChordEnabled(chord.type)} disabled={!isEnabled} /></TableCell>
            <TableCell>{chord.type}</TableCell>
          </TableRow>
        );
      }, this);
    const chordTypeCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Chord</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chordTypeCheckboxTableRows}
        </TableBody>
      </Table>
    );

    return (
      <Grid container spacing={32}>
        <Grid item xs={6}>{rootPitchCheckboxes}</Grid>
        <Grid item xs={6}>{chordTypeCheckboxes}</Grid>
      </Grid>
    );
  }
  
  private toggleRootPitchEnabled(rootPitch: Pitch) {
    const newEnabledRootPitches = Utils.toggleArrayElement(
      this.state.enabledRootPitches,
      rootPitch
    );
    
    if (newEnabledRootPitches.length > 0) {
      this.setState({ enabledRootPitches: newEnabledRootPitches });
      this.onChange(newEnabledRootPitches, this.state.enabledChordTypes);
    }
  }
  private toggleChordEnabled(chord: string) {
    const newEnabledChords = Utils.toggleArrayElement(
      this.state.enabledChordTypes,
      chord
    );
    
    if (newEnabledChords.length > 0) {
      this.setState({ enabledChordTypes: newEnabledChords });
      this.onChange(this.state.enabledRootPitches, newEnabledChords);
    }
  }
  private onChange(enabledRootPitches: Array<Pitch>, enabledChordTypes: string[]) {
    if (!this.props.onChange) { return; }

    const newEnabledFlashCardIndices = new Array<number>();

    for (const rootPitch of rootPitches) {
      for (const chord of chords) {
        const chordType = chord.type;
        if (
          Utils.arrayContains(this.state.enabledRootPitches, rootPitch) &&
          Utils.arrayContains(this.state.enabledChordTypes, chordType)
        ) {
          newEnabledFlashCardIndices.push(newEnabledFlashCardIndices.length);
        }
      }
    }

    this.props.onChange(newEnabledFlashCardIndices);
  }
}

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = new Array<FlashCard>();

  for (const rootPitch of rootPitches) {
    for (const chord of chords) {
      const pitches = Chord.fromPitchAndFormulaString(rootPitch, chord.formulaString)
        .pitches;

      flashCards.push(new FlashCard(
        () => (
          <div>
            {chord.type}
            <SheetMusicChord
              width={300} height={200}
              pitches={pitches}
            />
          </div>
        ),
        chord.type
      ));
    }
  }

  const renderFlashCardMultiSelect = (
    selectedFlashCardIndices: number[],
    onChange: (newValue: number[]) => void
  ): JSX.Element => {
    return (
    <ChordNotesFlashCardMultiSelect
      flashCards={flashCards}
      selectedFlashCardIndices={selectedFlashCardIndices}
      onChange={onChange}
    />
    );
  };
  
  const group = new FlashCardGroup(
    "Sheet Music Chords",
    flashCards
  );
  group.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  group.enableInvertFlashCards = false;
  return group;
}