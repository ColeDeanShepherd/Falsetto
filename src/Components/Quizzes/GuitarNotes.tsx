import * as React from 'react';
import { TextField } from '@material-ui/core';

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