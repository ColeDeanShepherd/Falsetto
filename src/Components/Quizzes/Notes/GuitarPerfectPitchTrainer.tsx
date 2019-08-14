import * as React from "react";
import { TextField, Button } from "@material-ui/core";

import * as Utils from "../../../Utils";
import {
  GuitarFretboard,
  standard6StringGuitarTuning,
  StringedInstrumentMetrics,
  StringedInstrumentTuning
} from "../../Utils/GuitarFretboard";
import { FlashCard, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, RenderAnswerSelectArgs } from "../../../FlashCardSet";
import { StringedInstrumentNote } from '../../../GuitarNote';
import { playPitches } from '../../../Guitar';
import { Pitch } from '../../../Pitch';
import { Vector2D } from '../../../Vector2D';
import { AnswerDifficulty } from '../../../AnswerDifficulty';

interface IConfigData {
  maxFret: number
};

const flashCardSetId = "guitarPerfectPitchTrainer";

export function configDataToEnabledFlashCardIds(flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData): Array<FlashCardId> {
  const notesPerString = 12;

  const enabledFlashCardIds = new Array<number>();
  for (let stringIndex = 0; stringIndex < standard6StringGuitarTuning.stringCount; stringIndex++) {
    for (let fretNumber = 0; fretNumber <= configData.maxFret; fretNumber++) {
      enabledFlashCardIds.push((notesPerString * stringIndex) + fretNumber);
    }
  }

  return enabledFlashCardIds;
}

export interface IFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  configData: IConfigData;
  selectedFlashCardIds: Array<FlashCardId>;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export interface IFlashCardMultiSelectState {}
export class FlashCardMultiSelect extends React.Component<IFlashCardMultiSelectProps, IFlashCardMultiSelectState> {
  public render(): JSX.Element {
    return (
      <TextField
        label="Max. Fret"
        value={this.props.configData.maxFret}
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
    if (!this.props.onChange) { return; }
    
    const maxFret = parseInt(newValue, 10);
    if (isNaN(maxFret)) { return; }

    const clampedMaxFret = Utils.clamp(maxFret, 0, 11);

    const newConfigData: IConfigData = {
      maxFret: clampedMaxFret
    }
    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(newConfigData);
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}

export interface IFlashCardFrontSideProps {
  pitch: Pitch;
}
export class FlashCardFrontSide extends React.Component<IFlashCardFrontSideProps, {}> {
  public componentDidMount() {
    //this.playAudio();
  }

  public render(): JSX.Element {
    return (
      <div>
        <Button
          onClick={event => this.playAudio()}
          variant="contained"
        >
          Play Sound
        </Button>
      </div>
    );
  }

  private stopSoundsFunc: (() => void) | null = null;

  private playAudio(): void {
    if (this.stopSoundsFunc) {
      this.stopSoundsFunc();
      this.stopSoundsFunc = null;
    }

    const playPitchesResult = playPitches([this.props.pitch]);
    this.stopSoundsFunc = playPitchesResult[1];
  }
}

export interface IGuitarNoteAnswerSelectProps {
  args: RenderAnswerSelectArgs;
  tuning: StringedInstrumentTuning;
}
export interface IGuitarNoteAnswerSelectState {
  selectedNote: StringedInstrumentNote | undefined;
}
export class GuitarNoteAnswerSelect extends React.Component<IGuitarNoteAnswerSelectProps, IGuitarNoteAnswerSelectState> {
  public constructor(props: IGuitarNoteAnswerSelectProps) {
    super(props);

    this.state = {
      selectedNote: undefined
    }
  }

  public render(): JSX.Element {
    const style= { width: "100%", maxWidth: "400px" };

    return (
      <div>
        <div>
          <GuitarFretboard
            width={400} height={140}
            tuning={this.props.tuning}
            renderExtrasFn={metrics => this.renderExtras(metrics)}
            style={style}
          />
        </div>
        
        <Button
          onClick={event => this.confirmAnswer()}
          disabled={!this.state.selectedNote}
          variant="contained"
        >
          Confirm Answer
        </Button>
      </div>
    );
  }

  private renderExtras(metrics: StringedInstrumentMetrics): JSX.Element {
    const stringIndices = Utils.range(0, metrics.stringCount - 1);
    const fretNumbers = Utils.range(metrics.minFretNumber, metrics.minFretNumber + metrics.fretCount);
    const buttonStyle: any = { cursor: "pointer" };

    const buttons = Utils.flattenArrays(
      stringIndices.map(stringIndex =>
        fretNumbers.map(fretNumber => {
          if (fretNumber > (this.props.args.configData as IConfigData).maxFret) {
            return null;
          }
          
          const position = new Vector2D(
            metrics.getNoteX(fretNumber),
            metrics.getStringY(stringIndex)
          );
          const note = this.props.tuning.getNote(stringIndex, fretNumber);
          const isClickedNote = this.state.selectedNote && note.equals(this.state.selectedNote);

          return (
            <circle
              cx={position.x}
              cy={position.y}
              r={metrics.fretDotRadius}
              fill={!isClickedNote ? "white" : "blue"}
              fillOpacity={!isClickedNote ? 0.2 : 1}
              stroke="gray"
              strokeWidth="1.25"
              onClick={e => this.onNoteClick(note)}
              style={buttonStyle}
            />          
          );
        })
      )
    );

    return (
      <g>
        {buttons}
      </g>
    );
  }
  private onNoteClick(note: StringedInstrumentNote) {
    if (!this.state.selectedNote || !note.equals(this.state.selectedNote)) {
      this.setState({ selectedNote: note });
    } else {
      this.setState({ selectedNote: undefined });
    }
  }
  private confirmAnswer() {
    if (!this.state.selectedNote) {
      return;
    }

    const correctAnswer = this.props.args.currentFlashCard.backSide.data as StringedInstrumentNote;
    const isCorrect = this.state.selectedNote.pitch.midiNumber === correctAnswer.pitch.midiNumber;
    this.props.args.onAnswer(isCorrect ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect, this.state.selectedNote);
  }
}

export function createFlashCardSet(guitarNotes?: Array<StringedInstrumentNote>): FlashCardSet {
  const renderFlashCardMultiSelect = (
    flashCards: Array<FlashCard>,
    selectedFlashCardIds: Array<FlashCardId>,
    configData: any,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return <FlashCardMultiSelect
      flashCards={flashCards}
      configData={configData}
      selectedFlashCardIds={selectedFlashCardIds}
      onChange={onChange}
    />;
  };

  const initialConfigData: IConfigData = {
    maxFret: 11
  };

  const flashCardSet = new FlashCardSet(flashCardSetId, "Guitar Perfect Pitch Trainer", () => createFlashCards(guitarNotes));
  flashCardSet.initialSelectedFlashCardIds = configDataToEnabledFlashCardIds(flashCardSet, initialConfigData);
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = (state: RenderAnswerSelectArgs) => <GuitarNoteAnswerSelect key={state.currentFlashCardId} args={state} tuning={standard6StringGuitarTuning} />;
  flashCardSet.enableInvertFlashCards = false;
  flashCardSet.containerHeight = "200px";

  return flashCardSet;
}

export function getStringedInstrumentNotes(pitch: Pitch, tuning: StringedInstrumentTuning, minFretNumber: number, maxFretNumber: number): Array<StringedInstrumentNote> {
  Utils.precondition(minFretNumber <= maxFretNumber);
  
  const notes = new Array<StringedInstrumentNote>();

  for (let stringIndex = 0; stringIndex < tuning.stringCount; stringIndex++) {
    for (let fretNumber = minFretNumber; fretNumber <= maxFretNumber; fretNumber++) {
      const note = tuning.getNote(stringIndex, fretNumber);

      if (note.pitch.midiNumber === pitch.midiNumber) {
        notes.push(note);
      }
    }
  }

  return notes;
}

export function createFlashCards(guitarNotes?: Array<StringedInstrumentNote>): FlashCard[] {
  const MAX_FRET_NUMBER = 11;
  const tuning = standard6StringGuitarTuning;
  guitarNotes = !guitarNotes
    ? Utils.flattenArrays(Utils.range(0, tuning.stringCount - 1)
    .map(stringIndex => Utils.range(0, MAX_FRET_NUMBER)
      .map(fretNumber => {
        return tuning.getNote(
          stringIndex, fretNumber
        );
      })
    ))
    : guitarNotes;

  return guitarNotes
    .map(guitarNote => {
      const deserializedId = {
        set: flashCardSetId,
        note: [guitarNote.stringIndex, guitarNote.pitch.midiNumber]
      };
      const id = JSON.stringify(deserializedId);

      return new FlashCard(
        id,
        new FlashCardSide(
          (width, height) => {
            return <FlashCardFrontSide key={`${guitarNote.stringIndex}.${guitarNote.pitch.toString()}`} pitch={guitarNote.pitch} />;
          }
        ),
        new FlashCardSide(
          (width, height) => {
            const style= { width: "100%", maxWidth: "400px" };
  
            return (
              <div style={{ margin: "1em" }}>
                <div>{guitarNote.pitch.toString()}</div>
                <GuitarFretboard
                  width={400} height={140}
                  tuning={tuning}
                  pressedNotes={getStringedInstrumentNotes(guitarNote.pitch, tuning, 0, MAX_FRET_NUMBER)}
                  style={style}
                />
              </div>
            );
          },
          guitarNote
        )
      );
    });
}