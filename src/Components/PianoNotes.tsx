import * as React from 'react';
import { Card, CardContent, Typography, Button, TextField } from '@material-ui/core';

import * as Utils from '../Utils';
import { PianoKeyboard } from './PianoKeyboard';
import { FlashCard } from 'src/FlashCard';
import { renderFlashCardSide } from "./FlashCard";

export interface IPianoNotesState {
  currentNoteIndex: number;
  isShowingFront: boolean;
}
export class PianoNotes extends React.Component<{}, IPianoNotesState> {
  constructor(props: {}) {
    super(props);

    this.state = { currentNoteIndex: this.getNextNoteIndex(), isShowingFront: true };
  }

  public render(): JSX.Element {
    const currentNoteName = this.notes[this.state.currentNoteIndex];
    const flashCard = new FlashCard(
      () => (
        <PianoKeyboard
          width={300} height={100}
          noteIndex={this.state.currentNoteIndex}
        />
      ),
      currentNoteName
    );

    return (
      <Card>
        <CardContent>
          <Typography gutterBottom={true} variant="h5" component="h2">
            Piano Notes
          </Typography>

          {this.state.isShowingFront
            ? <div style={{textAlign: "center", fontSize: "2em"}}>{renderFlashCardSide(flashCard.frontSide)}</div>
            : <div style={{textAlign: "center", fontSize: "2em", height: 100}}>{renderFlashCardSide(flashCard.backSide)}</div>
          }
          
          <Button onClick={event => this.flipFlashCard()} variant="outlined" color="primary">Flip</Button>
          <Button onClick={event => this.moveToNextNote()} variant="outlined" color="primary">Next</Button>
        </CardContent>
      </Card>
    );
  }
  
  private getNextNoteIndex(): number {
    return Utils.randomInt(0, this.notes.length - 1);
  }

  private flipFlashCard() {
    this.setState({ isShowingFront: !this.state.isShowingFront });
  }
  private moveToNextNote() {
    this.setState({ isShowingFront: true, currentNoteIndex: this.getNextNoteIndex() });
  }
  
  private notes = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];
}