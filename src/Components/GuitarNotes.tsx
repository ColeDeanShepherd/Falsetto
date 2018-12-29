import * as React from 'react';
import { Card, CardContent, Typography, Button, TextField } from '@material-ui/core';

import * as Utils from '../Utils';
import { GuitarFretboard } from './GuitarFretboard';
import { FlashCard } from '../FlashCard';
import { renderFlashCardSide } from "./FlashCard";
import { FlashCardGroup } from 'src/FlashCardGroup';

const stringNotes = [
  ["E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb"], // low E string
  ["A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab"], // A string
  ["D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B", "C", "C#/Db"], // D string
  ["G", "G#/Ab", "A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb"], // G string
  ["B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb"], // B string
  ["E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb"], // high E string
];

export interface IGuitarNotesFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  selectedFlashCardIndices: number[];
  onChange?: (newValue: number[]) => void;
}
export interface IGuitarNotesFlashCardMultiSelectState {
  maxFretString: string;
}
export class GuitarNotesFlashCardMultiSelect extends React.Component<IGuitarNotesFlashCardMultiSelectProps, IGuitarNotesFlashCardMultiSelectState> {
  public constructor(props: IGuitarNotesFlashCardMultiSelectProps) {
    super(props);

    this.state = {
      maxFretString: "11"
    };
  }
  public render(): JSX.Element {
    return (
      <TextField
        label="Max. Fret"
        value={this.state.maxFretString}
        onChange={event => this.onMaxFretStringChange(event.target.value)}
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
      />
    );
  }
  
  private onMaxFretStringChange(newValue: string) {
    this.setState({ maxFretString: newValue });
    
    if (!this.props.onChange) { return; }

    const maxFret = parseInt(newValue, 10);
    if (isNaN(maxFret)) { return; }

    const clampedMaxFret = Utils.clamp(maxFret, 0, 11);
    const notesPerString = stringNotes[0].length;

    const enabledFlashCardIndices = new Array<number>();
    for (let stringIndex = 0; stringIndex < stringNotes.length; stringIndex++) {
      for (let fretNumber = 0; fretNumber <= clampedMaxFret; fretNumber++) {
        enabledFlashCardIndices.push((notesPerString * stringIndex) + fretNumber);
      }
    }

    this.props.onChange(enabledFlashCardIndices);
  }
}

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const renderFlashCardMultiSelect = (
    selectedFlashCardIndices: number[],
    onChange: (newValue: number[]) => void
  ): JSX.Element => {
    return <GuitarNotesFlashCardMultiSelect
      flashCards={flashCards}
      selectedFlashCardIndices={selectedFlashCardIndices}
      onChange={onChange}
    />;
  };

  const group = new FlashCardGroup("Guitar Notes", flashCards);
  group.renderFlashCardMultiSelect = renderFlashCardMultiSelect;

  return group;
}

export function createFlashCards(): FlashCard[] {
  
  return Utils.flattenArrays(stringNotes
    .map((notes, stringIndex) => notes
      .map((_, fretNumber) => new FlashCard(
        () => (
          <GuitarFretboard
            width={300} height={100}
            noteStringIndex={stringIndex}
            noteFretNumber={fretNumber}
          />
        ),
        stringNotes[stringIndex][fretNumber]
      ))
    )
  );
}

export interface IGuitarNotesState {
  currentStringIndex: number;
  currentFretNumber: number;
  maxFret: number;
  isShowingFront: boolean;
}
export class GuitarNotes extends React.Component<{}, IGuitarNotesState> {
  public GUITAR_STRING_COUNT = 6;

  constructor(props: {}) {
    super(props);

    const maxFret = 11;
    this.state = Object.assign(
      { maxFret: maxFret, isShowingFront: true },
      this.getNextStringAndFret(maxFret)
    );
  }

  public render(): JSX.Element {
    const currentNoteName = this.stringNotes[this.state.currentStringIndex][this.state.currentFretNumber];
    const flashCard = new FlashCard(
      () => (
        <GuitarFretboard
          width={300} height={100}
          noteStringIndex={this.state.currentStringIndex}
          noteFretNumber={this.state.currentFretNumber}
        />
      ),
      currentNoteName
    );

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
  
  private getNextStringAndFret(maxFret: number) {
    return {
      currentStringIndex: Utils.randomInt(0, 5),
      currentFretNumber: Utils.randomInt(0, maxFret)
    };
  }

  private flipFlashCard() {
    this.setState({ isShowingFront: !this.state.isShowingFront });
  }
  private moveToNextNote() {
    this.setState(Object.assign({ isShowingFront: true }, this.getNextStringAndFret(this.state.maxFret)));
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