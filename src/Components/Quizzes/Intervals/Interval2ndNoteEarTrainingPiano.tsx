import * as React from "react";

import * as Utils from "../../../Utils";
import { Vector2D } from '../../../Vector2D';
import { Size2D } from "../../../Size2D";
import { Rect2D } from '../../../Rect2D';
import { FlashCard, FlashCardSide } from "../../../FlashCard";
import { FlashCardGroup, RenderAnswerSelectArgs } from "../../../FlashCardGroup";
import { Pitch } from "../../../Pitch";
import { playPitchesSequentially } from "../../../Piano";
import {
  intervals,
  forEachInterval
} from "../../IntervalEarTrainingFlashCardMultiSelect";
import { Button, TableRow, TableCell, Checkbox, Table, TableHead, TableBody, Grid } from "@material-ui/core";
import { PianoKeyboard } from "../../PianoKeyboard";
import { PitchLetter } from "../../../PitchLetter";
import { AnswerDifficulty } from "../../../StudyAlgorithm";
import { PianoKeysAnswerSelect } from "../../PianoKeysAnswerSelect";

const minPitch = new Pitch(PitchLetter.C, 0, 4);
const maxPitch = new Pitch(PitchLetter.B, 0, 5);
const includeHarmonicIntervals = false;

export const rootNotes = [
  new Pitch(PitchLetter.C, 0, 4),
  new Pitch(PitchLetter.C, 1, 4),
  new Pitch(PitchLetter.D, -1, 4),
  new Pitch(PitchLetter.D, 0, 4),
  new Pitch(PitchLetter.E, -1, 4),
  new Pitch(PitchLetter.E, 0, 4),
  new Pitch(PitchLetter.F, 0, 4),
  new Pitch(PitchLetter.F, 1, 4),
  new Pitch(PitchLetter.G, -1, 4),
  new Pitch(PitchLetter.G, 0, 4),
  new Pitch(PitchLetter.A, -1, 4),
  new Pitch(PitchLetter.A, 0, 4),
  new Pitch(PitchLetter.B, -1, 4),
  new Pitch(PitchLetter.B, 0, 4),
  new Pitch(PitchLetter.C, 0, 5),
  new Pitch(PitchLetter.C, 1, 5),
  new Pitch(PitchLetter.D, -1, 5),
  new Pitch(PitchLetter.D, 0, 5),
  new Pitch(PitchLetter.E, -1, 5),
  new Pitch(PitchLetter.E, 0, 5),
  new Pitch(PitchLetter.F, 0, 5),
  new Pitch(PitchLetter.F, 1, 5),
  new Pitch(PitchLetter.G, -1, 5),
  new Pitch(PitchLetter.G, 0, 5),
  new Pitch(PitchLetter.A, -1, 5),
  new Pitch(PitchLetter.A, 0, 5),
  new Pitch(PitchLetter.B, -1, 5),
  new Pitch(PitchLetter.B, 0, 5)
];

export interface IConfigData {
  enabledIntervals: string[];
}

export function configDataToEnabledQuestionIds(
  configData: IConfigData
): Array<number> {
  const enabledQuestionIds = new Array<number>();
  forEachInterval(rootNotes,
    (interval, p1, p2, isHarmonicInterval, i) => {
    if (Utils.arrayContains(configData.enabledIntervals, interval)) {
      enabledQuestionIds.push(i);
    }
  }, includeHarmonicIntervals, minPitch, maxPitch);

  return enabledQuestionIds;
}

export interface IFlashCardFrontSideProps {
  width: number;
  height: number;
  pitch1: Pitch;
  pitch2: Pitch;
}
export class FlashCardFrontSide extends React.Component<IFlashCardFrontSideProps, {}> {
  public componentDidMount() {
    //this.playAudio();
  }

  public render(): JSX.Element {
    const size = Utils.shrinkRectToFit(
      new Size2D(this.props.width, this.props.height),
      new Size2D(400, 100)
    );

    return (
      <div>
        <div>
          <PianoKeyboard
            rect={new Rect2D(size, new Vector2D(0, 0))}
            lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
            highestPitch={new Pitch(PitchLetter.B, 0, 5)}
            pressedPitches={[this.props.pitch1]}
          />
        </div>
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

  private playAudio() {
    if (this.stopSoundsFunc !== null) {
      this.stopSoundsFunc();
      this.stopSoundsFunc = null;
    }

    const cutOffSounds = true;
    this.stopSoundsFunc = playPitchesSequentially([this.props.pitch1, this.props.pitch2], 500, cutOffSounds);
  }
}

export interface IFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  configData: IConfigData;
  selectedFlashCardIndices: number[];
  onChange?: (newValue: number[], newConfigData: any) => void;
}
export interface IFlashCardMultiSelectState {}
export class FlashCardMultiSelect extends React.Component<IFlashCardMultiSelectProps, IFlashCardMultiSelectState> {
  public render(): JSX.Element {
    const intervalCheckboxTableRows = intervals
      .map((interval, i) => {
        const isChecked = this.props.configData.enabledIntervals.indexOf(interval) >= 0;
        const isEnabled = !isChecked || (this.props.configData.enabledIntervals.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleIntervalEnabled(interval)} disabled={!isEnabled} /></TableCell>
            <TableCell>{interval}</TableCell>
          </TableRow>
        );
      }, this);
    const intervalCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Interval</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {intervalCheckboxTableRows}
        </TableBody>
      </Table>
    );

    return (
      <Grid container spacing={32}>
        <Grid item xs={12}>{intervalCheckboxes}</Grid>
      </Grid>
    );
  }

  private toggleIntervalEnabled(interval: string) {
    const newEnabledIntervals = Utils.toggleArrayElement(
      this.props.configData.enabledIntervals,
      interval
    );
    
    if (newEnabledIntervals.length > 0) {
      const newConfigData: IConfigData = {
        enabledIntervals: newEnabledIntervals
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

export function renderAnswerSelect(
  state: RenderAnswerSelectArgs
) {
  const key = state.flashCards.indexOf(state.currentFlashCard);
  const correctAnswer = [state.currentFlashCard.backSide.data as Pitch];
  const size = Utils.shrinkRectToFit(new Size2D(state.width, state.height), new Size2D(400, 100));
  
  return <PianoKeysAnswerSelect
    key={key} width={size.width} height={size.height} correctAnswer={correctAnswer}
    onAnswer={state.onAnswer} maxNumPitches={1} lastCorrectAnswer={state.lastCorrectAnswer}
    incorrectAnswers={state.incorrectAnswers} />;
}

export function createFlashCards(): Array<FlashCard> {
  const flashCards = new Array<FlashCard>();
  forEachInterval(rootNotes,
    (interval, p1, p2, isHarmonicInterval, i) => {
    flashCards.push(
      new FlashCard(
        new FlashCardSide((width, height) => <FlashCardFrontSide key={i} width={width} height={height} pitch1={p1} pitch2={p2} />, p1),
        new FlashCardSide(p2.toOneAccidentalAmbiguousString(false), p2)
      )
    );
  }, includeHarmonicIntervals, minPitch, maxPitch);
  return flashCards;
}
export function createFlashCardGroup(): FlashCardGroup {
  const renderFlashCardMultiSelect = (
    flashCards: Array<FlashCard>,
    selectedFlashCardIndices: number[],
    configData: any,
    onChange: (newValue: number[], newConfigData: any) => void
  ): JSX.Element => {
    return (
    <FlashCardMultiSelect
      flashCards={flashCards}
      configData={configData}
      selectedFlashCardIndices={selectedFlashCardIndices}
      onChange={onChange}
    />
    );
  };

  const initialConfigData: IConfigData = {
    enabledIntervals: intervals.slice()
  };
  
  const group = new FlashCardGroup(
    "Interval 2nd Note Ear Training Piano",
    createFlashCards
  );
  group.initialSelectedFlashCardIndices = configDataToEnabledQuestionIds(initialConfigData);
  group.initialConfigData = initialConfigData;
  group.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  group.enableInvertFlashCards = false;
  group.renderAnswerSelect = renderAnswerSelect;
  group.customNextFlashCardIdFilter = (studyAlgorithm, flashCards, enabledFlashCardIds) => {
    if (studyAlgorithm.currentQuestionId === undefined) {
      return enabledFlashCardIds;
    }

    const flashCard = flashCards[studyAlgorithm.currentQuestionId];
    const secondPitch = flashCard.backSide.data as Pitch;
    
    return enabledFlashCardIds
      .filter(flashCardIndex => {
        const otherFlashCard = flashCards[flashCardIndex];
        const firstPitch = otherFlashCard.frontSide.data as Pitch;

        return firstPitch.midiNumber === secondPitch.midiNumber;
      });
  };
  group.containerHeight = "180px";
  
  return group;
}