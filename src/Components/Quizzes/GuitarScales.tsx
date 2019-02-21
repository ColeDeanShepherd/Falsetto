import * as React from 'react';

import * as Utils from "../../Utils";
import { scales } from "../../Scale";
import { PianoKeyboard } from '../PianoKeyboard';
import { FlashCard, FlashCardSide } from '../../FlashCard';
import { FlashCardGroup } from '../../FlashCardGroup';
import { AnswerDifficulty } from '../../StudyAlgorithm';
import { Pitch } from '../../Pitch';
import { PitchLetter } from '../../PitchLetter';
import { TableRow, TableCell, Table, TableHead, TableBody, Grid, Checkbox, Button, Typography } from '@material-ui/core';
import { Chord } from '../../Chord';
import { GuitarFretboard, GuitarNote, standardGuitarTuning, GuitarFretboardMetrics } from '../GuitarFretboard';

const rootPitchStrs = ["Ab", "A", "Bb", "B/Cb", "C", "C#/Db", "D", "Eb", "E", "F", "F#/Gb", "G"];

interface IConfigData {
  enabledRootPitches: string[];
  enabledScaleTypes: string[];
}

export function configDataToEnabledQuestionIds(configData: IConfigData): Array<number> {
  const newEnabledFlashCardIndices = new Array<number>();

  let i = 0;

  for (const rootPitchStr of rootPitchStrs) {
    for (const scale of scales) {
      const scaleType = scale.type;
      if (
        Utils.arrayContains(configData.enabledRootPitches, rootPitchStr) &&
        Utils.arrayContains(configData.enabledScaleTypes, scaleType)
      ) {
        newEnabledFlashCardIndices.push(i);
      }

      i++;
    }
  }

  return newEnabledFlashCardIndices;
}
export interface IGuitarScalesFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  configData: IConfigData;
  selectedFlashCardIndices: number[];
  onChange?: (newValue: number[], newConfigData: any) => void;
}

export interface IGuitarScalesFlashCardMultiSelectState {}
export class GuitarScalesFlashCardMultiSelect extends React.Component<IGuitarScalesFlashCardMultiSelectProps, IGuitarScalesFlashCardMultiSelectState> {
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

    const scaleTypeCheckboxTableRows = scales
      .map((scale, i) => {
        const isChecked = this.props.configData.enabledScaleTypes.indexOf(scale.type) >= 0;
        const isEnabled = !isChecked || (this.props.configData.enabledScaleTypes.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleScaleEnabled(scale.type)} disabled={!isEnabled} /></TableCell>
            <TableCell>{scale.type}</TableCell>
          </TableRow>
        );
      }, this);
    const scaleTypeCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Scale</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scaleTypeCheckboxTableRows}
        </TableBody>
      </Table>
    );

    return (
      <Grid container spacing={32}>
        <Grid item xs={6}>{rootPitchCheckboxes}</Grid>
        <Grid item xs={6}>{scaleTypeCheckboxes}</Grid>
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
        enabledScaleTypes: this.props.configData.enabledScaleTypes
      };
      this.onChange(newConfigData);
    }
  }
  private toggleScaleEnabled(scale: string) {
    const newEnabledScaleTypes = Utils.toggleArrayElement(
      this.props.configData.enabledScaleTypes,
      scale
    );
    
    if (newEnabledScaleTypes.length > 0) {
      const newConfigData: IConfigData = {
        enabledRootPitches: this.props.configData.enabledRootPitches,
        enabledScaleTypes: newEnabledScaleTypes
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

export interface IGuitarScalesAnswerSelectProps {
  correctAnswer: string;
  onAnswer: (answerDifficulty: AnswerDifficulty) => void;
}
export interface IGuitarScalesAnswerSelectState {
  selectedRootPitch: string | undefined;
  selectedScaleType: string | undefined;
}
export class GuitarScalesAnswerSelect extends React.Component<IGuitarScalesAnswerSelectProps, IGuitarScalesAnswerSelectState> {
  public constructor(props: IGuitarScalesAnswerSelectProps) {
    super(props);
    
    this.state = {
      selectedRootPitch: undefined,
      selectedScaleType: undefined
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
          Scale
        </Typography>
        <div style={{padding: "1em 0"}}>
          {scales.map(scale => {
            const style: any = { textTransform: "none" };
            
            const isPressed = scale.type === this.state.selectedScaleType;
            if (isPressed) {
              style.backgroundColor = "#959595";
            }
            
            return (
              <Button
                key={scale.type}
                onClick={event => this.onScaleTypeClick(scale.type)}
                variant="contained"
                style={style}
              >
                {scale.type}
              </Button>
            );
          })}
        </div>

        <div style={{padding: "1em 0"}}>
          <Button
            onClick={event => this.confirmAnswer()}
            disabled={!this.state.selectedRootPitch || !this.state.selectedScaleType}
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
  private onScaleTypeClick(scaleType: string) {
    this.setState({ selectedScaleType: scaleType });
  }
  private confirmAnswer() {
    const selectedAnswer = this.state.selectedRootPitch + " " + this.state.selectedScaleType;
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
          width={400} height={100}
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
  const flashCards = createFlashCards();

  const renderFlashCardMultiSelect = (
    selectedFlashCardIndices: number[],
    configData: any,
    onChange: (newValue: number[], newConfigData: any) => void
  ): JSX.Element => {
    return (
    <GuitarScalesFlashCardMultiSelect
      flashCards={flashCards}
      configData={configData}
      selectedFlashCardIndices={selectedFlashCardIndices}
      onChange={onChange}
    />
    );
  };

  const initialConfigData: IConfigData = {
    enabledRootPitches: rootPitchStrs.slice(),
    enabledScaleTypes: scales
      .filter((_, scaleIndex) => scaleIndex <= 8)
      .map(scale => scale.type)
  };

  const group = new FlashCardGroup("Guitar Scales", flashCards);
  group.enableInvertFlashCards = false;
  group.initialSelectedFlashCardIndices = configDataToEnabledQuestionIds(initialConfigData);
  group.initialConfigData = initialConfigData;
  group.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  group.renderAnswerSelect = renderAnswerSelect;

  return group;
}
export function createFlashCards(): FlashCard[] {
  return Utils.flattenArrays<FlashCard>(
    rootPitchStrs.map((rootPitchStr, i) => {
      const halfStepsFromC = Utils.mod(i - 4, 12);
      const rootPitch = Pitch.createFromMidiNumber((new Pitch(PitchLetter.C, 0, 4)).midiNumber + halfStepsFromC);

      const renderExtras = (metrics: GuitarFretboardMetrics) => {
        const rootPitchGuitarNotes = GuitarNote.allNotesOfPitches(
          standardGuitarTuning,
          [rootPitch],
          11
        );

        const rootPitchFretDots = rootPitchGuitarNotes
          .map((guitarNote, noteIndex) => {
            const x = metrics.getNoteX(guitarNote.getFretNumber(standardGuitarTuning));
            const y = metrics.getStringY(guitarNote.stringIndex);
            return <circle key={noteIndex} cx={x} cy={y} r={metrics.fretDotRadius} fill="green" strokeWidth="0" />;
          });
        
        return <g>{rootPitchFretDots}</g>;
      };
      
      return scales.map(scale => {
        const formulaString = scale.formulaString + " 8";
        const pitches = Chord.fromPitchAndFormulaString(rootPitch, formulaString)
          .pitches;
        const guitarNotes = GuitarNote.allNotesOfPitches(
          standardGuitarTuning,
          pitches,
          11
        );

        return new FlashCard(
          new FlashCardSide(
            () => (
              <GuitarFretboard
                width={400} height={100}
                pressedNotes={guitarNotes}
                renderExtrasFn={renderExtras}
              />
            ),
            pitches
          ),
          new FlashCardSide(rootPitchStr + " " + scale.type)
        );
      });
    })
  );
}
export function renderAnswerSelect(
  flashCards: FlashCard[],
  enabledFlashCardIndices: number[],
  areFlashCardsInverted: boolean,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
) {
  if (!areFlashCardsInverted) {
    const correctAnswer = flashCard.backSide.renderFn as string;
    return <GuitarScalesAnswerSelect key={correctAnswer} correctAnswer={correctAnswer} onAnswer={onAnswer} />;
  } else {
    const key = flashCard.frontSide.renderFn as string;
    const correctAnswer = flashCard.backSide.data[0] as Array<Pitch>;
    return <GuitarNotesAnswerSelect key={key} correctAnswer={correctAnswer} onAnswer={onAnswer} />;
  }
}