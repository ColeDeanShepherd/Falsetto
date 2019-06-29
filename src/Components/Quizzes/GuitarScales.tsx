import * as React from "react";
import { TableRow, TableCell, Table, TableHead, TableBody, Grid, Checkbox, Button } from "@material-ui/core";

import * as Utils from "../../Utils";
import { Vector2D } from "../../Vector2D";
import { Size2D } from "../../Size2D";
import { Rect2D } from "../../Rect2D";
import { ScaleType } from "../../Scale";
import { PianoKeyboard } from "../PianoKeyboard";
import { FlashCard, FlashCardSide } from "../../FlashCard";
import { FlashCardGroup } from "../../FlashCardGroup";
import { AnswerDifficulty } from "../../StudyAlgorithm";
import { Pitch } from "../../Pitch";
import { PitchLetter } from "../../PitchLetter";
import { Chord, ChordType } from "../../Chord";
import { GuitarFretboard, renderGuitarFretboardScaleExtras, getStandardGuitarTuning, findGuitarChordShape, renderGuitarFretboardChordExtras } from "../GuitarFretboard";
import { ScaleAnswerSelect } from "../ScaleAnswerSelect";
import { getPreferredGuitarScaleShape } from "../GuitarFretboard";

const rootPitchStrs = ["Ab", "A", "Bb", "B/Cb", "C", "C#/Db", "D", "Eb", "E", "F", "F#/Gb", "G"];
const STRING_COUNT = 6;

interface IConfigData {
  enabledRootPitches: string[];
  enabledScaleTypes: string[];
}

export const GuitarScaleViewer: React.FunctionComponent<{
  scaleType: ScaleType,
  rootPitch: Pitch,
  renderAllScaleShapes: boolean,
  size: Size2D
}> = props => {
  let rootPitch = Pitch.createFromMidiNumber(
    (new Pitch(PitchLetter.C, 0, 2)).midiNumber + props.rootPitch.midiNumberNoOctave
  );

  // If the root pitch is below the range of the guitar, add an octave.
  const guitarLowestNoteMidiNumber = (new Pitch(PitchLetter.E, 0, 2)).midiNumber;
  if (rootPitch.midiNumber < guitarLowestNoteMidiNumber) {
    rootPitch.octaveNumber++;
  }

  const guitarTuning = getStandardGuitarTuning(STRING_COUNT);
  const guitarNotes = getPreferredGuitarScaleShape(props.scaleType, rootPitch, guitarTuning);
  const maxFretNumber = Utils.arrayMax(guitarNotes
    .map(gn => gn.getFretNumber(guitarTuning))
  );
  const minFretNumber = Math.max(0, maxFretNumber - 11);
  
  const fretboardStyle = { width: "100%", maxWidth: `${props.size.width}px`, height: "auto" };

  return (
    <GuitarFretboard
      width={props.size.width} height={props.size.height}
      minFretNumber={minFretNumber}
      renderExtrasFn={metrics => renderGuitarFretboardScaleExtras(metrics, rootPitch, props.scaleType, props.renderAllScaleShapes)}
      style={fretboardStyle}
    />
  );
}
export const GuitarChordViewer: React.FunctionComponent<{
  chordType: ChordType,
  rootPitch: Pitch,
  size: Size2D
}> = props => {
  let rootPitch = Pitch.createFromMidiNumber(
    (new Pitch(PitchLetter.C, 0, 2)).midiNumber + props.rootPitch.midiNumberNoOctave
  );

  // If the root pitch is below the range of the guitar, add an octave.
  const guitarLowestNoteMidiNumber = (new Pitch(PitchLetter.E, 0, 2)).midiNumber;
  if (rootPitch.midiNumber < guitarLowestNoteMidiNumber) {
    rootPitch.octaveNumber++;
  }

  const guitarNotes = findGuitarChordShape(props.chordType, rootPitch, 1, 0, getStandardGuitarTuning(STRING_COUNT));
  const guitarTuning = getStandardGuitarTuning(STRING_COUNT);
  const maxFretNumber = Utils.arrayMax(guitarNotes
    .map(gn => gn.getFretNumber(guitarTuning))
  );
  const minFretNumber = Math.max(0, maxFretNumber - 11);

  return (
    <GuitarFretboard
      width={props.size.width} height={props.size.height}
      minFretNumber={minFretNumber}
      renderExtrasFn={metrics => renderGuitarFretboardChordExtras(metrics, rootPitch, props.chordType)}
    />
  );
}

export function forEachScale(callbackFn: (scaleType: ScaleType, rootPitch: Pitch, rootPitchStr: string, i: number) => void) {
  let i = 0;
  const guitarLowestNoteMidiNumber = (new Pitch(PitchLetter.E, 0, 2)).midiNumber;

  for (let rootPitchStrIndex = 0; rootPitchStrIndex < rootPitchStrs.length; rootPitchStrIndex++) {
    // Compute the root pitch.
    const halfStepsFromC = Utils.mod(rootPitchStrIndex - 4, 12);
    const rootPitch = Pitch.createFromMidiNumber((new Pitch(PitchLetter.C, 0, 2)).midiNumber + halfStepsFromC);

    // If the root pitch is below the range of the guitar, add an octave.
    if (rootPitch.midiNumber < guitarLowestNoteMidiNumber) {
      rootPitch.octaveNumber++;
    }

    // Iterate through each scale type for the root pitch.
    for (const scaleType of ScaleType.All) {
      callbackFn(scaleType, rootPitch, rootPitchStrs[rootPitchStrIndex], i);
      i++;
    }
  }
}
export function configDataToEnabledQuestionIds(configData: IConfigData): Array<number> {
  const newEnabledFlashCardIndices = new Array<number>();

  forEachScale((scaleType, rootPitch, rootPitchStr, i) => {
    if (
      Utils.arrayContains(configData.enabledRootPitches, rootPitchStr) &&
      Utils.arrayContains(configData.enabledScaleTypes, scaleType.type)
    ) {
      newEnabledFlashCardIndices.push(i);
    }
  });

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

    const scaleTypeCheckboxTableRows = ScaleType.All
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
          rect={new Rect2D(new Size2D(300, 100), new Vector2D(0, 0))}
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

export function createFlashCardGroup(title?: string, initialScaleTypes?: Array<ScaleType>): FlashCardGroup {
  title = (title !== undefined) ? title : "Guitar Scales";

  const renderFlashCardMultiSelect = (
    flashCards: Array<FlashCard>,
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
    enabledScaleTypes: !initialScaleTypes
      ? ScaleType.All
        .filter((_, scaleIndex) => scaleIndex <= 8)
        .map(scale => scale.type)
      : initialScaleTypes
        .map(scaleType => Utils.unwrapValueOrUndefined(ScaleType.All.find(st => st.equals(scaleType))).type)
  };

  const group = new FlashCardGroup(title, createFlashCards);
  group.enableInvertFlashCards = false;
  group.initialSelectedFlashCardIndices = configDataToEnabledQuestionIds(initialConfigData);
  group.initialConfigData = initialConfigData;
  group.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  group.renderAnswerSelect = renderAnswerSelect;
  group.containerHeight = "110px";

  return group;
}
export function createFlashCards(): Array<FlashCard> {
  const flashCards = new Array<FlashCard>();

  forEachScale((scaleType, rootPitch, rootPitchStr, i) => {
    const formulaString = scaleType.formulaString + " 8";
    const pitches = Chord.fromPitchAndFormulaString(rootPitch, formulaString)
      .pitches;

    flashCards.push(new FlashCard(
      new FlashCardSide(
        (width, height) => {
          return (
            <div>
              <GuitarScaleViewer scaleType={scaleType} rootPitch={rootPitch} renderAllScaleShapes={false} size={new Size2D(400, 140)} />
            </div>
          );
        },
        pitches
      ),
      new FlashCardSide(rootPitchStr + " " + scaleType.type)
    ));
  });

  return flashCards;
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
    const activeScales = ScaleType.All
      .filter((_, i) => Utils.arrayContains(enabledFlashCardIndices, i));
    return <ScaleAnswerSelect key={correctAnswer} scales={activeScales} correctAnswer={correctAnswer} onAnswer={onAnswer} />;
  } else {
    const key = flashCard.frontSide.renderFn as string;
    const correctAnswer = flashCard.backSide.data[0] as Array<Pitch>;
    return <GuitarNotesAnswerSelect key={key} correctAnswer={correctAnswer} onAnswer={onAnswer} />;
  }
}