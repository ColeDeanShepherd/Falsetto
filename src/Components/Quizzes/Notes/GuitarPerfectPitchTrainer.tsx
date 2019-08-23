import * as React from "react";
import { Button } from "@material-ui/core";

import * as Utils from "../../../Utils";
import {
  GuitarFretboard
} from "../../Utils/GuitarFretboard";
import { StringedInstrumentMetrics } from "../../Utils/StringedInstrumentFingerboard";
import { standard6StringGuitarTuning, StringedInstrumentTuning } from "../../Utils/StringedInstrumentTuning";
import { FlashCard, FlashCardSide, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { StringedInstrumentNote, getStringedInstrumentNotes } from '../../../StringedInstrumentNote';
import { playPitches } from '../../../Guitar';
import { Pitch } from '../../../Pitch';
import { Vector2D } from '../../../Vector2D';
import { AnswerDifficulty } from '../../../AnswerDifficulty';
import { IConfigData, forEachNote, StringedInstrumentNotesFlashCardMultiSelect } from "../../Utils/StringedInstrumentNotes";

const flashCardSetId = "guitarPerfectPitchTrainer";
const guitarTuning = standard6StringGuitarTuning;
const MAX_MAX_FRET_NUMBER = 11;

export function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
): Array<FlashCardId> {
  const enabledFlashCardIds = new Array<FlashCardId>();

  forEachNote(guitarTuning, MAX_MAX_FRET_NUMBER, (stringIndex, fretNumber, i) => {
    if (fretNumber <= configData.maxFret) {
      enabledFlashCardIds.push(flashCards[i].id);
    }
  });

  return enabledFlashCardIds;
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
  args: FlashCardStudySessionInfo;
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
    
    const buttonRadius = 0.9 * metrics.fretDotRadius;
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
              r={buttonRadius}
              fill={!isClickedNote ? "white" : "lightblue"}
              fillOpacity={!isClickedNote ? 0.1 : 1}
              stroke="gray"
              strokeWidth="1"
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
    studySessionInfo: FlashCardStudySessionInfo,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return <StringedInstrumentNotesFlashCardMultiSelect
      tuning={guitarTuning}
      maxMaxFretNumber={MAX_MAX_FRET_NUMBER}
      studySessionInfo={studySessionInfo}
      onChange={onChange}
    />;
  };

  const initialConfigData: IConfigData = {
    maxFret: MAX_MAX_FRET_NUMBER
  };

  const flashCardSet = new FlashCardSet(flashCardSetId, "Guitar Perfect Pitch Trainer", () => createFlashCards(guitarNotes));
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = (info: FlashCardStudySessionInfo) => <GuitarNoteAnswerSelect key={info.currentFlashCardId} args={info} tuning={guitarTuning} />;
  flashCardSet.containerHeight = "200px";

  return flashCardSet;
}

export function createFlashCards(notes?: Array<StringedInstrumentNote>): FlashCard[] {
  const guitarStyle = { width: "100%", maxWidth: "400px" };
  notes = !notes
    ? Utils.flattenArrays(Utils.range(0, guitarTuning.stringCount - 1)
    .map(stringIndex => Utils.range(0, MAX_MAX_FRET_NUMBER)
      .map(fretNumber => {
        return guitarTuning.getNote(
          stringIndex, fretNumber
        );
      })
    ))
    : notes;

  return notes
    .map(note => {
      const deserializedId = {
        set: flashCardSetId,
        tuning: guitarTuning.openStringPitches.map(p => p.toString(true, false)),
        stringIndex: note.stringIndex,
        fretNumber: note.getFretNumber(guitarTuning)
      };
      const id = JSON.stringify(deserializedId);

      return new FlashCard(
        id,
        new FlashCardSide(
          size => {
            return <FlashCardFrontSide
              key={`${note.stringIndex}.${note.pitch.toString()}`}
              pitch={note.pitch}
            />;
          }
        ),
        new FlashCardSide(
          size => {
            return (
              <div style={{ margin: "1em" }}>
                <div>{note.pitch.toString()}</div>
                <GuitarFretboard
                  width={400} height={140}
                  tuning={guitarTuning}
                  pressedNotes={getStringedInstrumentNotes(note.pitch, guitarTuning, 0, MAX_MAX_FRET_NUMBER)}
                  style={guitarStyle}
                />
              </div>
            );
          },
          note
        )
      );
    });
}