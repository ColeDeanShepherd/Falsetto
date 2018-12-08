import * as React from 'react';
import { Card, CardContent, Typography, Button, Checkbox, TextField } from '@material-ui/core';

import * as Utils from '../Utils';
import { GuitarFretboard } from './GuitarFretboard';

export interface IGuitarNotesState {
  currentStringIndex: number;
  currentFretNumber: number;
  maxFret: number;
}
export class GuitarNotes extends React.Component<{}, IGuitarNotesState> {
  public GUITAR_STRING_COUNT = 6;

  constructor(props: {}) {
    super(props);

    const maxFret = 11;
    this.state = Object.assign({ maxFret: maxFret }, this.getNextStringAndFret(maxFret));
  }

  public render(): JSX.Element {
    const currentNoteName = this.stringNotes[this.state.currentStringIndex][this.state.currentFretNumber];

    return (
      <Card>
        <CardContent>
          <Typography gutterBottom={true} variant="h5" component="h2">
            Guitar Notes
          </Typography>

          <div>
            <TextField
              label="Max. Fret"
              value={this.state.maxFret}
              onChange={event => this.onMaxFretTextChange(event.target.value)}
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
          </div>

          <GuitarFretboard
            width={300} height={100}
            noteStringIndex={this.state.currentStringIndex}
            noteFretNumber={this.state.currentFretNumber}
          />
          <div style={{textAlign: "center", fontSize: "2em"}}>{currentNoteName}</div>
          
          <Button onClick={event => this.moveToNextNote()} variant="outlined" color="primary">Next</Button>
        </CardContent>
      </Card>
    );
  }
  
  private getNextStringAndFret(maxFret: number) {
    return {
      currentStringIndex: Utils.randomInt(0, 5),
      currentFretNumber: Utils.randomInt(0, maxFret)
    };
  }
  private moveToNextNote() {
    this.setState(this.getNextStringAndFret(this.state.maxFret));
  }

  private onMaxFretTextChange(newValue: string) {
    const maxFret = Utils.clamp(parseInt(newValue, 10), 0, 11);
    let stateDelta = { maxFret: maxFret };

    if (this.state.currentFretNumber > maxFret) {
      stateDelta = Object.assign(stateDelta, this.getNextStringAndFret(maxFret));
    }

    this.setState(stateDelta);
  }
  
  private stringNotes = [
    ["E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb"], // low E string
    ["A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab"], // A string
    ["D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B", "C", "C#/Db"], // D string
    ["G", "G#/Ab", "A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb"], // G string
    ["B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb"], // B string
    ["E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb"], // high E string
  ];
}