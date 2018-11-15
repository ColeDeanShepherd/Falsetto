import * as React from 'react';
import { Card, CardContent, Typography, Button } from '@material-ui/core';

import * as Utils from '../Utils';

export interface IRandomChordGeneratorState {
  currentChord: string;
}
export class RandomChordGenerator extends React.Component<{}, IRandomChordGeneratorState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      currentChord: this.generateRandomChord()
    };
  }

  public render(): JSX.Element {
    return (
      <Card>
        <CardContent>
          <Typography gutterBottom={true} variant="h5" component="h2">
            Random Chord Generator
          </Typography>

          <div style={{textAlign: "center", fontSize: "2em"}}>{this.state.currentChord}</div>
          
          <Button onClick={event => this.moveToNextChord()} variant="outlined" color="primary">Next</Button>
        </CardContent>
      </Card>
    );
  }
  
  private moveToNextChord() {
    this.setState({ currentChord: this.generateRandomChord() });
  }

  private generateRandomChord(): string {
    const chordRoot = Utils.randomElement(this.chordRoots);
    const chordType = Utils.randomElement(this.chordTypes);
    return `${chordRoot} ${chordType}`;
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