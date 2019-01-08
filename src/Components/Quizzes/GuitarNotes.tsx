import * as React from 'react';
import { TextField, Button, Card, CardContent, Typography } from '@material-ui/core';

import * as Utils from '../../Utils';
import * as FlashCardUtils from "./Utils";
import { GuitarFretboard } from '../GuitarFretboard';
import { FlashCard } from '../../FlashCard';
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
  group.renderAnswerSelect = FlashCardUtils.renderNoteAnswerSelect;
  group.enableInvertFlashCards = false;

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

export interface IGuitarNotesProps {}
export interface IGuitarNotesState {
  maxFretNumber: number;
  currentStringIndex: number;
  currentFretNumber: number;
  isShowingAnswer: boolean;
  isShowingConfiguration: boolean;
  // stats
}
export class GuitarNotesComponent extends React.Component<IGuitarNotesProps, IGuitarNotesState> {
  public constructor(props: IGuitarNotesProps) {
    super(props);

    const maxFretNumber = 11;
    this.state = Object.assign({
      maxFretNumber: maxFretNumber,
      isShowingAnswer: false,
      isShowingConfiguration: false
    }, this.getNextNote(maxFretNumber));
  }
  public render(): JSX.Element {
    const answers = ["A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab"];
    const correctAnswer = stringNotes[this.state.currentStringIndex][this.state.currentFretNumber];

    const flashCardContainerStyle: any = {
      fontSize: "2em",
      textAlign: "center",
      padding: "1em 0",
      height: "240px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    };

    return (
      <Card>
        <CardContent>
          <Typography gutterBottom={true} variant="h5" component="h2">
            Guitar Notes
          </Typography>
          
          <Button variant="contained" onClick={event => this.toggleShowConfiguration()}>Configuration</Button>
          {this.state.isShowingConfiguration ? (
            <div>
              <TextField
                label="Max. Fret"
                type="number"
                value={this.state.maxFretNumber}
                onChange={event => this.onMaxFretStringChange(event.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />
            </div>
          ) : null}

          <div
            style={flashCardContainerStyle}
          >
            {!this.state.isShowingAnswer
              ? (
                <GuitarFretboard
                  width={300} height={100}
                  noteStringIndex={this.state.currentStringIndex}
                  noteFretNumber={this.state.currentFretNumber}
                />
              ) : (
                <span>{correctAnswer}</span>
              )
            }
          </div>

          <div style={{marginBottom: "1em"}}>
            <Button
              onClick={event => this.toggleShowAnswer()}
              variant="contained"
            >
              Show {!this.state.isShowingAnswer ? "Answer" : "Question"}
            </Button>
            <Button
              onClick={event => this.moveToNextQuestion()}
              variant="contained"
            >
              Skip
            </Button>
          </div>

          <div>
            {answers.map(a => (
              <Button
                key={a}
                variant="contained"
                onClick={event => this.onAnswerSelected(a)}
                style={{ textTransform: "none" }}
              >
                {a}
              </Button>))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  private getNextNote(maxFretNumber: number): { currentStringIndex: number, currentFretNumber: number } {
    return {
      currentStringIndex: Utils.randomInt(0, stringNotes.length - 1),
      currentFretNumber: Utils.randomInt(0, maxFretNumber)
    };
  }
  private moveToNextQuestion() {
    const newState = Object.assign({ isShowingAnswer: false }, this.getNextNote(this.state.maxFretNumber));
    this.setState(newState);
  }
  private toggleShowAnswer() {
    const newValue = !this.state.isShowingAnswer;
    this.setState({ isShowingAnswer: newValue });
  }
  private toggleShowConfiguration() {
    this.setState({ isShowingConfiguration: !this.state.isShowingConfiguration });
  }

  // handlers
  private onMaxFretStringChange(newValueString: string) {
    const newMaxFretNumber = parseInt(newValueString, 10);
    if (isNaN(newMaxFretNumber) || (newMaxFretNumber < 0) || (newMaxFretNumber > 11)) { return; }
    
    let newState = { maxFretNumber: newMaxFretNumber };

    const isCurrentNoteValid = this.state.currentFretNumber <= newMaxFretNumber;
    if (!isCurrentNoteValid) {
      newState = Object.assign(newState, this.getNextNote(newMaxFretNumber));
    }

    this.setState(newState);
  }
  private onAnswerSelected(answer: string) {
    const correctAnswer = stringNotes[this.state.currentStringIndex][this.state.currentFretNumber];

    if (answer === correctAnswer) {
      this.moveToNextQuestion();
    } else {

    }
  }
}