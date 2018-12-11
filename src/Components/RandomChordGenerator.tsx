import * as React from 'react';
import { Card, CardContent, Typography, Button, Checkbox } from '@material-ui/core';

import * as Utils from '../Utils';
import { FlashCard } from 'src/FlashCard';

export function createFlashCards(): FlashCard[] {
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
  const randomChords = Utils.flattenArrays<string>(chordRoots
    .map(chordRoot => chordTypes
      .map(chordType => chordRoot + chordType)
    )
  );
  return randomChords
    .map(chord => new FlashCard(chord, chord));
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