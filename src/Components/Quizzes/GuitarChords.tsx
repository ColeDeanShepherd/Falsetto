import * as React from "react";

import * as Utils from "../../Utils";
import { Vector2D } from '../../Vector2D';
import { Size2D } from "../../Size2D";
import { Rect2D } from '../../Rect2D';
import { PianoKeyboard } from "../PianoKeyboard";
import { FlashCard, FlashCardSide } from "../../FlashCard";
import { FlashCardGroup } from "../../FlashCardGroup";
import { AnswerDifficulty } from "../../StudyAlgorithm";
import { Pitch } from "../../Pitch";
import { PitchLetter } from "../../PitchLetter";
import { TableRow, TableCell, Table, TableHead, TableBody, Grid, Checkbox, Button, Typography } from "@material-ui/core";
import { Chord, ChordType } from "../../Chord";
import { GuitarFretboard, GuitarNote, standardGuitarTuning, renderGuitarFretboardScaleExtras } from "../GuitarFretboard";

const chords = ChordType.All;
const rootPitchStrs = ["Ab", "A", "Bb", "B/Cb", "C", "C#/Db", "D", "Eb", "E", "F", "F#/Gb", "G"];

interface IConfigData {
  enabledRootPitches: string[];
  enabledChordTypes: string[];
}

export function configDataToEnabledQuestionIds(configData: IConfigData): Array<number> {
  const newEnabledFlashCardIndices = new Array<number>();

  let i = 0;

  for (const rootPitchStr of rootPitchStrs) {
    for (const chord of chords) {
      const chordType = chord.name;
      if (
        Utils.arrayContains(configData.enabledRootPitches, rootPitchStr) &&
        Utils.arrayContains(configData.enabledChordTypes, chordType)
      ) {
        newEnabledFlashCardIndices.push(i);
      }

      i++;
    }
  }

  return newEnabledFlashCardIndices;
}
export interface IGuitarChordsFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  configData: IConfigData;
  selectedFlashCardIndices: number[];
  onChange?: (newValue: number[], newConfigData: any) => void;
}

export interface IGuitarChordsFlashCardMultiSelectState {}
export class GuitarChordsFlashCardMultiSelect extends React.Component<IGuitarChordsFlashCardMultiSelectProps, IGuitarChordsFlashCardMultiSelectState> {
  public render(): JSX.Element {
    const rootPitchCheckboxTableRows = rootPitchStrs
      .map((rootPitch, i) => {
        const isChecked = this.props.configData.enabledRootPitches.indexOf(rootPitch) >= 0;
        const isEnabled = !isChecked || (this.props.configData.enabledRootPitches.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleRootPitchEnabled(rootPitch)} disabled={!isEnabled} /></TableCell>
            <TableCell>{rootPitch}</TableCell>
          </TableRow>
        );
      }, this);
    const rootPitchCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Root Pitch</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rootPitchCheckboxTableRows}
        </TableBody>
      </Table>
    );

    const chordTypeCheckboxTableRows = chords
      .map((chord, i) => {
        const isChecked = this.props.configData.enabledChordTypes.indexOf(chord.name) >= 0;
        const isEnabled = !isChecked || (this.props.configData.enabledChordTypes.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleChordEnabled(chord.name)} disabled={!isEnabled} /></TableCell>
            <TableCell>{chord.name}</TableCell>
          </TableRow>
        );
      }, this);
    const chordTypeCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Chord</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chordTypeCheckboxTableRows}
        </TableBody>
      </Table>
    );

    return (
      <Grid container spacing={32}>
        <Grid item xs={6}>{rootPitchCheckboxes}</Grid>
        <Grid item xs={6}>{chordTypeCheckboxes}</Grid>
      </Grid>
    );
  }
  
  private toggleRootPitchEnabled(rootPitch: string) {
    const newEnabledRootPitches = Utils.toggleArrayElement(
      this.props.configData.enabledRootPitches,
      rootPitch
    );
    
    if (newEnabledRootPitches.length > 0) {
      const newConfigData: IConfigData = {
        enabledRootPitches: newEnabledRootPitches,
        enabledChordTypes: this.props.configData.enabledChordTypes
      };
      this.onChange(newConfigData);
    }
  }
  private toggleChordEnabled(chord: string) {
    const newEnabledChordTypes = Utils.toggleArrayElement(
      this.props.configData.enabledChordTypes,
      chord
    );
    
    if (newEnabledChordTypes.length > 0) {
      const newConfigData: IConfigData = {
        enabledRootPitches: this.props.configData.enabledRootPitches,
        enabledChordTypes: newEnabledChordTypes
      };
      this.onChange(newConfigData);
    }
  }
  private onChange(newConfigData: IConfigData) {
    if (!this.props.onChange) { return; }

    const newEnabledFlashCardIndices = configDataToEnabledQuestionIds(newConfigData);
    this.props.onChange(newEnabledFlashCardIndices, newConfigData);
  }
}

export interface IGuitarChordsAnswerSelectProps {
  correctAnswer: string;
  onAnswer: (answerDifficulty: AnswerDifficulty) => void;
}
export interface IGuitarChordsAnswerSelectState {
  selectedRootPitch: string | undefined;
  selectedChordType: string | undefined;
}
export class GuitarChordsAnswerSelect extends React.Component<IGuitarChordsAnswerSelectProps, IGuitarChordsAnswerSelectState> {
  public constructor(props: IGuitarChordsAnswerSelectProps) {
    super(props);
    
    this.state = {
      selectedRootPitch: undefined,
      selectedChordType: undefined
    };
  }
  public render(): JSX.Element {
    return (
      <div>
        <Typography gutterBottom={true} variant="h6" component="h4">
          Root Pitch
        </Typography>
        <div style={{padding: "1em 0"}}>
          <div>
            {rootPitchStrs.slice(0, 6).map(rootPitchStr => {
              const style: any = { textTransform: "none" };
              
              const isPressed = rootPitchStr === this.state.selectedRootPitch;
              if (isPressed) {
                style.backgroundColor = "#959595";
              }

              return (
                <Button
                  key={rootPitchStr}
                  onClick={event => this.onRootPitchClick(rootPitchStr)}
                  variant="contained"
                  style={style}
                >
                  {rootPitchStr}
                </Button>
              );
            })}
          </div>
          <div>
            {rootPitchStrs.slice(6, 12).map(rootPitchStr => {
              const style: any = { textTransform: "none" };
              
              const isPressed = rootPitchStr === this.state.selectedRootPitch;
              if (isPressed) {
                style.backgroundColor = "#959595";
              }

              return (
                <Button
                  key={rootPitchStr}
                  onClick={event => this.onRootPitchClick(rootPitchStr)}
                  variant="contained"
                  style={style}
                >
                  {rootPitchStr}
                </Button>
              );
            })}
          </div>
        </div>
        
        <Typography gutterBottom={true} variant="h6" component="h4">
          Chord
        </Typography>
        <div style={{padding: "1em 0"}}>
          {chords.map(chord => {
            const style: any = { textTransform: "none" };
            
            const isPressed = chord.name === this.state.selectedChordType;
            if (isPressed) {
              style.backgroundColor = "#959595";
            }
            
            return (
              <Button
                key={chord.name}
                onClick={event => this.onChordTypeClick(chord.name)}
                variant="contained"
                style={style}
              >
                {chord.name}
              </Button>
            );
          })}
        </div>

        <div style={{padding: "1em 0"}}>
          <Button
            onClick={event => this.confirmAnswer()}
            disabled={!this.state.selectedRootPitch || !this.state.selectedChordType}
            variant="contained"
          >
            Confirm Answer
          </Button>
        </div>
      </div>
    );
  }

  private onRootPitchClick(rootPitch: string) {
    this.setState({ selectedRootPitch: rootPitch });
  }
  private onChordTypeClick(chordType: string) {
    this.setState({ selectedChordType: chordType });
  }
  private confirmAnswer() {
    const selectedAnswer = this.state.selectedRootPitch + " " + this.state.selectedChordType;
    const isCorrect = selectedAnswer === this.props.correctAnswer;
    this.props.onAnswer(isCorrect ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect);
  }
}

export interface IGuitarNotesAnswerSelectProps {
  correctAnswer: Array<Pitch>;
  onAnswer: (answerDifficulty: AnswerDifficulty) => void;
}
export interface IGuitarNotesAnswerSelectState {
  selectedPitches: Array<Pitch>;
}
export class GuitarNotesAnswerSelect extends React.Component<IGuitarNotesAnswerSelectProps, IGuitarNotesAnswerSelectState> {
  public constructor(props: IGuitarNotesAnswerSelectProps) {
    super(props);
    
    this.state = {
      selectedPitches: []
    };
  }
  public render(): JSX.Element {
    return (
      <div>
        <PianoKeyboard
          rect={new Rect2D(new Size2D(400, 100), new Vector2D(0, 0))}
          lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
          highestPitch={new Pitch(PitchLetter.B, 0, 5)}
          pressedPitches={this.state.selectedPitches}
          onKeyPress={pitch => this.onPitchClick(pitch)}
        />
        
        <div style={{padding: "1em 0"}}>
          <Button
            onClick={event => this.confirmAnswer()}
            disabled={this.state.selectedPitches.length === 0}
            variant="contained"
          >
            Confirm Answer
          </Button>
        </div>
      </div>
    );
  }

  private onPitchClick(pitch: Pitch) {
    const newSelectedPitches = Utils.toggleArrayElementCustomEquals(
      this.state.selectedPitches,
      pitch,
      (p1, p2) => p1.equals(p2)
    );
    this.setState({ selectedPitches: newSelectedPitches });
  }
  private confirmAnswer() {
    const selectedPitchMidiNumbersNoOctave = Utils.uniq(
      this.state.selectedPitches
        .map(pitch => pitch.midiNumberNoOctave)
    );
    const correctAnswerMidiNumbersNoOctave = Utils.uniq(
      this.props.correctAnswer
        .map(pitch => pitch.midiNumberNoOctave)
    );

    const isCorrect = (selectedPitchMidiNumbersNoOctave.length === correctAnswerMidiNumbersNoOctave.length) &&
      (selectedPitchMidiNumbersNoOctave.every(guess =>
        correctAnswerMidiNumbersNoOctave.some(answer =>
          guess === answer
        )
      ));
    this.props.onAnswer(isCorrect ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect);
  }
}

export function createFlashCardGroup(): FlashCardGroup {
  const renderFlashCardMultiSelect = (
    flashCards: Array<FlashCard>,
    selectedFlashCardIndices: number[],
    configData: any,
    onChange: (newValue: number[], newConfigData: any) => void
  ): JSX.Element => {
    return (
    <GuitarChordsFlashCardMultiSelect
      flashCards={flashCards}
      configData={configData}
      selectedFlashCardIndices={selectedFlashCardIndices}
      onChange={onChange}
    />
    );
  };

  const initialConfigData: IConfigData = {
    enabledRootPitches: rootPitchStrs.slice(),
    enabledChordTypes: chords
      .filter((_, chordIndex) => chordIndex <= 8)
      .map(chord => chord.name)
  };

  const group = new FlashCardGroup("Guitar Chords", createFlashCards);
  group.enableInvertFlashCards = false;
  group.initialSelectedFlashCardIndices = configDataToEnabledQuestionIds(initialConfigData);
  group.initialConfigData = initialConfigData;
  group.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  group.renderAnswerSelect = renderAnswerSelect;
  group.containerHeight = "120px";

  return group;
}
export function createFlashCards(): FlashCard[] {
  return Utils.flattenArrays<FlashCard>(
    rootPitchStrs.map((rootPitchStr, i) => {
      const halfStepsFromC = Utils.mod(i - 4, 12);
      const rootPitch = Pitch.createFromMidiNumber((new Pitch(PitchLetter.C, 0, 4)).midiNumber + halfStepsFromC);
      
      return chords.map(chord => {
        const formulaString = chord.formulaString;
        const formulaStringParts = chord.formulaString.split(" ");
        const pitches = Chord.fromPitchAndFormulaString(rootPitch, formulaString)
          .pitches;
        const guitarNotes = GuitarNote.allNotesOfPitches(
          standardGuitarTuning,
          pitches,
          11
        );

        return new FlashCard(
          new FlashCardSide(
            (width, height) => {
              const size = Utils.shrinkRectToFit(new Size2D(width, height), new Size2D(400, 140));

              return (
                <GuitarFretboard
                  width={size.width} height={size.height}
                  renderExtrasFn={metrics => renderGuitarFretboardScaleExtras(metrics, pitches, formulaStringParts)}
                />
              )
            },
            pitches
          ),
          new FlashCardSide(rootPitchStr + " " + chord.name)
        );
      });
    })
  );
}
export function renderAnswerSelect(
  width: number, height: number,
  flashCards: FlashCard[],
  enabledFlashCardIndices: number[],
  areFlashCardsInverted: boolean,
  flashCardIndex: number,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
) {
  if (!areFlashCardsInverted) {
    const correctAnswer = flashCard.backSide.renderFn as string;
    return <GuitarChordsAnswerSelect key={correctAnswer} correctAnswer={correctAnswer} onAnswer={onAnswer} />;
  } else {
    const key = flashCard.frontSide.renderFn as string;
    const correctAnswer = flashCard.backSide.data[0] as Array<Pitch>;
    return <GuitarNotesAnswerSelect key={key} correctAnswer={correctAnswer} onAnswer={onAnswer} />;
  }
}