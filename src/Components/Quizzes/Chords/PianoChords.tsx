import * as React from "react";

import * as Utils from "../../../Utils";
import { Vector2D } from '../../../Vector2D';
import { Size2D } from "../../../Size2D";
import { Rect2D } from '../../../Rect2D';
import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { FlashCard, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { AnswerDifficulty } from "../../../AnswerDifficulty";
import { Pitch } from "../../../Pitch";
import { PitchLetter } from "../../../PitchLetter";
import { TableRow, TableCell, Table, TableHead, TableBody, Grid, Checkbox, Button, Typography } from "@material-ui/core";
import { Chord, ChordType } from "../../../Chord";
import { PianoKeysAnswerSelect } from "../../Utils/PianoKeysAnswerSelect";

const flashCardSetId = "pianoChords";

const rootPitchStrs = ["Ab", "A", "Bb", "B/Cb", "C", "C#/Db", "D", "Eb", "E", "F", "F#/Gb", "G"];

interface IConfigData {
  enabledRootPitches: string[];
  enabledChordTypes: string[];
}

export function configDataToEnabledFlashCardIds(flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData): Array<FlashCardId> {
  const newEnabledFlashCardIds = new Array<FlashCardId>();

  let i = 0;

  for (const rootPitchStr of rootPitchStrs) {
    for (const chord of ChordType.All) {
      const chordType = chord.name;
      if (
        Utils.arrayContains(configData.enabledRootPitches, rootPitchStr) &&
        Utils.arrayContains(configData.enabledChordTypes, chordType)
      ) {
        newEnabledFlashCardIds.push(i);
      }

      i++;
    }
  }

  return newEnabledFlashCardIds;
}
export interface IPianoChordsFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  configData: IConfigData;
  selectedFlashCardIds: Array<FlashCardId>;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}

export interface IPianoChordsFlashCardMultiSelectState {}
export class PianoChordsFlashCardMultiSelect extends React.Component<IPianoChordsFlashCardMultiSelectProps, IPianoChordsFlashCardMultiSelectState> {
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

    const chordTypeCheckboxTableRows = ChordType.All
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

    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(newConfigData);
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}

export interface IPianoChordsAnswerSelectProps {
  correctAnswer: string;
  onAnswer: (answerDifficulty: AnswerDifficulty, answer: any) => void;
  lastCorrectAnswer: any;
  incorrectAnswers: Array<any>;
  enabledChordTypeNames: Array<string>;
}
export interface IPianoChordsAnswerSelectState {
  selectedRootPitch: string | undefined;
  selectedChordType: string | undefined;
}
export class PianoChordsAnswerSelect extends React.Component<IPianoChordsAnswerSelectProps, IPianoChordsAnswerSelectState> {
  public constructor(props: IPianoChordsAnswerSelectProps) {
    super(props);
    
    this.state = {
      selectedRootPitch: undefined,
      selectedChordType: undefined
    };
  }
  public render(): JSX.Element {
    // TODO: use lastCorrectAnswer
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
          {ChordType.All
            .filter(ct => Utils.arrayContains(this.props.enabledChordTypeNames, ct.name))
            .map(chord => {
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
    this.props.onAnswer(isCorrect ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect, selectedAnswer);
  }
}

export function createFlashCardSet(): FlashCardSet {
  const renderFlashCardMultiSelect = (
    flashCards: Array<FlashCard>,
    selectedFlashCardIds: Array<FlashCardId>,
    configData: any,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return (
    <PianoChordsFlashCardMultiSelect
      flashCards={flashCards}
      configData={configData}
      selectedFlashCardIds={selectedFlashCardIds}
      onChange={onChange}
    />
    );
  };

  const initialConfigData: IConfigData = {
    enabledRootPitches: rootPitchStrs.slice(),
    enabledChordTypes: ChordType.All
      .filter((_, chordIndex) => chordIndex <= 8)
      .map(chord => chord.name)
  };

  const flashCardSet = new FlashCardSet(flashCardSetId, "Piano Chords", createFlashCards);
  flashCardSet.enableInvertFlashCards = true;
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds configDataToEnabledFlashCardIds(flashCardSet, initialConfigData);
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.containerHeight = "120px";

  return flashCardSet;
}
export function createFlashCards(): FlashCard[] {
  return Utils.flattenArrays<FlashCard>(
    rootPitchStrs.map((rootPitchStr, i) =>
      ChordType.All.map(chordType => {
        const halfStepsFromC = Utils.mod(i - 4, 12);
        const rootPitch = Pitch.createFromMidiNumber((new Pitch(PitchLetter.C, 0, 4)).midiNumber + halfStepsFromC);
        const pitches = new Chord(chordType, rootPitch).getPitches();
        const deserializedId = {
          set: flashCardSetId,
          chord: `${rootPitch.toString(false)} ${chordType.name}`
        };
        const id = JSON.stringify(deserializedId);

        return new FlashCard(
          id,
          new FlashCardSide(
            (width, height) => {
              const size = Utils.shrinkRectToFit(new Size2D(width, height), new Size2D(400, 100));

              return (
                <PianoKeyboard
                  rect={new Rect2D(size, new Vector2D(0, 0))}
                  lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
                  highestPitch={new Pitch(PitchLetter.B, 0, 5)}
                  pressedPitches={pitches}
                />
              );
            },
            pitches
          ),
          new FlashCardSide(rootPitchStr + " " + chordType.name)
        );
      })
    )
  );
}
export function renderAnswerSelect(
  info: FlashCardStudySessionInfo
) {
  if (!state.areFlashCardsInverted) {
    const correctAnswer = state.currentFlashCard.backSide.renderFn as string;
    return <PianoChordsAnswerSelect
      key={correctAnswer} correctAnswer={correctAnswer} onAnswer={state.onAnswer}
      lastCorrectAnswer={state.lastCorrectAnswer} incorrectAnswers={state.incorrectAnswers}
      enabledChordTypeNames={(state.configData as IConfigData).enabledChordTypes} />;
  } else {
    const key = state.currentFlashCard.frontSide.renderFn as string;
    const correctAnswer = state.currentFlashCard.backSide.data[0] as Array<Pitch>;
    return <PianoKeysAnswerSelect
      key={key} width={400} height={100} correctAnswer={correctAnswer}
      onAnswer={state.onAnswer} lastCorrectAnswer={state.lastCorrectAnswer}
      incorrectAnswers={state.incorrectAnswers} />;
  }
}