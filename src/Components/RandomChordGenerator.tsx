import * as React from 'react';
import { Card, CardContent, Typography, Button, Checkbox, TableRow, TableCell, Table, TableHead, TableBody, Grid } from '@material-ui/core';

import * as Utils from '../Utils';
import { FlashCard } from 'src/FlashCard';
import { FlashCardGroup } from 'src/FlashCardGroup';

const chordRoots = [
  'Cb',
  'C',
  'C#',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B'
];
const chordTypes = [
  "major",
  "minor",
  "diminished",
  "augmented",
  "sus2",
  "sus4",
  "lydian",
  "sus4b5",
  "phryg",
  "maj7",
  "7",
  "-7",
  "-7b5",
  "dim7",
  "+Ma7",
  "-Ma7",
  "+7",
  "dimMa7",
  "-7#5",
  "quartal",
  "quartal aug.",
  "G+4Q"
];

export interface IRandomChordGeneratorFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  selectedFlashCardIndices: number[];
  onChange?: (newValue: number[]) => void;
}
export interface IRandomChordGeneratorFlashCardMultiSelectState {
  enabledChordRoots: string[];
  enabledChordTypes: string[];
}
export class RandomChordGeneratorFlashCardMultiSelect extends React.Component<IRandomChordGeneratorFlashCardMultiSelectProps, IRandomChordGeneratorFlashCardMultiSelectState> {
  public constructor(props: IRandomChordGeneratorFlashCardMultiSelectProps) {
    super(props);

    this.state = {
      enabledChordRoots: chordRoots.slice(),
      enabledChordTypes: chordTypes.slice()
    };
  }
  public render(): JSX.Element {
    const chordRootCheckboxTableRows = chordRoots
      .map((chordRoot, i) => {
        const isChecked = this.state.enabledChordRoots.indexOf(chordRoot) >= 0;
        const isEnabled = !isChecked || (this.state.enabledChordRoots.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleChordRootEnabled(chordRoot)} disabled={!isEnabled} /></TableCell>
            <TableCell>{chordRoot}</TableCell>
          </TableRow>
        );
      }, this);
    const chordRootCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Chord Root</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chordRootCheckboxTableRows}
        </TableBody>
      </Table>
    );
    
    const chordTypeCheckboxTableRows = chordTypes
      .map((chordType, i) => {
        const isChecked = this.state.enabledChordTypes.indexOf(chordType) >= 0;
        const isEnabled = !isChecked || (this.state.enabledChordTypes.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleChordTypeEnabled(chordType)} disabled={!isEnabled} /></TableCell>
            <TableCell>{chordType}</TableCell>
          </TableRow>
        );
      }, this);
    const chordTypeCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Chord Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chordTypeCheckboxTableRows}
        </TableBody>
      </Table>
    );

    return (
      <Grid container spacing={32}>
        <Grid item xs={6}>{chordRootCheckboxes}</Grid>
        <Grid item xs={6}>{chordTypeCheckboxes}</Grid>
      </Grid>
    );
  }

  private toggleChordRootEnabled(chordRoot: string) {
    const newEnabledChordRoots = Utils.toggleArrayElement(
      this.state.enabledChordRoots,
      chordRoot
    );
    
    if (newEnabledChordRoots.length > 0) {
      this.setState({ enabledChordRoots: newEnabledChordRoots });
      this.onChange(newEnabledChordRoots, this.state.enabledChordTypes);
    }
  }
  private toggleChordTypeEnabled(chordType: string) {
    const newEnabledChordTypes = Utils.toggleArrayElement(
      this.state.enabledChordTypes,
      chordType
    );
    
    if (newEnabledChordTypes.length > 0) {
      this.setState({ enabledChordTypes: newEnabledChordTypes });
      this.onChange(this.state.enabledChordRoots, newEnabledChordTypes);
    }
  }
  private onChange(enabledChordRoots: string[], enabledChordTypes: string[]) {
    if (!this.props.onChange) { return; }

    const newEnabledFlashCardIndices = Utils.flattenArrays<boolean>(chordRoots
      .map(chordRoot => chordTypes
        .map(chordType => Utils.arrayContains(enabledChordRoots, chordRoot) && Utils.arrayContains(enabledChordTypes, chordType))
      )
    )
    .map((x, i) => x ? i : -1)
    .filter(i => i >= 0);

    this.props.onChange(newEnabledFlashCardIndices);
  }
}

export function createFlashCardGroup(): FlashCardGroup {
  const randomChords = Utils.flattenArrays<string>(chordRoots
    .map(chordRoot => chordTypes
      .map(chordType => chordRoot + chordType)
    )
  );
  const flashCards = randomChords
    .map(chord => new FlashCard(chord, chord));
  const renderFlashCardMultiSelect = (
    selectedFlashCardIndices: number[],
    onChange: (newValue: number[]) => void
  ): JSX.Element => {
    return (
    <RandomChordGeneratorFlashCardMultiSelect
      flashCards={flashCards}
      selectedFlashCardIndices={selectedFlashCardIndices}
      onChange={onChange}
    />
    );
  };
  
  return new FlashCardGroup(
    "Random Chord Generator",
    flashCards,
    renderFlashCardMultiSelect
  );
}

export interface IRandomChordGeneratorState {
  currentChordType: string;
  currentChordRoot: string;
  enabledChordTypeIndices: number[];
}
export class RandomChordGenerator extends React.Component<{}, IRandomChordGeneratorState> {
  constructor(props: {}) {
    super(props);

    const enabledChordTypeIndices = this.chordTypes.map((_, i) => i);
    const randomChord = this.generateRandomChord(enabledChordTypeIndices);

    this.state = {
      currentChordType: randomChord.type,
      currentChordRoot: randomChord.root,
      enabledChordTypeIndices: enabledChordTypeIndices
    };
  }

  public render(): JSX.Element {
    return (
      <Card>
        <CardContent>
          <Typography gutterBottom={true} variant="h5" component="h2">
            Random Chord Generator
          </Typography>

          {this.chordTypes.map((ct, i) => {
            const isEnabled = this.state.enabledChordTypeIndices.indexOf(i) >= 0;
            
            return (
              <div key={i}>
                <Checkbox checked={isEnabled} onChange={event => this.toggleChordTypeEnabled(i)} />{ct}
              </div>
            );
          }, this)}

          <div style={{textAlign: "center", fontSize: "2em"}}>{this.state.currentChordRoot}{this.state.currentChordType}</div>
          
          <Button onClick={event => this.moveToNextChord()} variant="outlined" color="primary">Next</Button>
        </CardContent>
      </Card>
    );
  }
  
  private moveToNextChord() {
    const randomChord = this.generateRandomChord(this.state.enabledChordTypeIndices);
    this.setState({
      currentChordType: randomChord.type,
      currentChordRoot: randomChord.root
    });
  }

  private generateRandomChord(enabledChordTypeIndices: number[]): { type: string, root: string } {
    const chordTypeIndex = Utils.randomElement(enabledChordTypeIndices);

    return {
      root: Utils.randomElement(this.chordRoots),
      type: this.chordTypes[chordTypeIndex]
    };
  }
  private toggleChordTypeEnabled(chordTypeIndex: number) {
    const newEnabledChordTypeIndices = this.state.enabledChordTypeIndices.slice();
    const i = newEnabledChordTypeIndices.indexOf(chordTypeIndex);
    const wasChordTypeEnabled = i >= 0;

    if (!wasChordTypeEnabled) {
      newEnabledChordTypeIndices.push(chordTypeIndex);
    } else {
      newEnabledChordTypeIndices.splice(i, 1);
    }

    const stateDelta: any = { enabledChordTypeIndices: newEnabledChordTypeIndices };
    if (wasChordTypeEnabled && (this.state.currentChordType === this.chordTypes[chordTypeIndex])) {
      stateDelta.currentChordType = this.generateRandomChord(newEnabledChordTypeIndices).type;
    }

    this.setState(stateDelta);
  }

  private chordRoots = [
    'Cb',
    'C',
    'C#',
    'Db',
    'D',
    'Eb',
    'E',
    'F',
    'F#',
    'Gb',
    'G',
    'Ab',
    'A',
    'Bb',
    'B'
  ];
  private chordTypes = [
    "major",
    "minor",
    "diminished",
    "augmented",
    "sus2",
    "sus4",
    "lydian",
    "sus4b5",
    "phryg",
    "maj7",
    "7",
    "-7",
    "-7b5",
    "dim7",
    "+Ma7",
    "-Ma7",
    "+7",
    "dimMa7",
    "-7#5",
    "quartal",
    "quartal aug.",
    "G+4Q"
  ];
}