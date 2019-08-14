import * as React from "react";

import * as Utils from "../../../Utils";
import { Vector2D } from '../../../Vector2D';
import { Size2D } from "../../../Size2D";
import { Rect2D } from '../../../Rect2D';
import { FlashCard, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { Pitch } from "../../../Pitch";
import { playPitchesSequentially } from "../../../Piano";
import {
  intervals,
  forEachInterval
} from "../../Utils/IntervalEarTrainingFlashCardMultiSelect";
import { Button, TableRow, TableCell, Checkbox, Table, TableHead, TableBody, Grid } from "@material-ui/core";
import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { PitchLetter } from "../../../PitchLetter";
import { PianoKeysAnswerSelect } from "../../Utils/PianoKeysAnswerSelect";

const flashCardSetId = "pianoNextNoteEarTraining";

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

export function configDataToEnabledFlashCardIds(
  configData: IConfigData
): Array<number> {
  const enabledFlashCardIds = new Array<string>();
  forEachInterval(rootNotes,
    (interval, direction, p1, p2, isHarmonicInterval, i) => {
    if (Utils.arrayContains(configData.enabledIntervals, interval)) {
      enabledFlashCardIds.push(i);
    }
  }, includeHarmonicIntervals, minPitch, maxPitch);

  return enabledFlashCardIds;
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
  selectedFlashCardIds: Array<FlashCardId>;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
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

    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(newConfigData);
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}

export function renderAnswerSelect(
  info: FlashCardStudySessionInfo
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
    (interval, direction, p1, p2, _, i) => {
      const deserializedId = {
        set: flashCardSetId,
        pitches: [p1.toString(true), p2.toString(true)]
      };
      const id = JSON.stringify(deserializedId);

      flashCards.push(
        new FlashCard(
          id,
          new FlashCardSide((width, height) => <FlashCardFrontSide key={i} width={width} height={height} pitch1={p1} pitch2={p2} />, p1),
          new FlashCardSide(p2.toOneAccidentalAmbiguousString(false), p2)
        )
      );
    }, includeHarmonicIntervals, minPitch, maxPitch);
  return flashCards;
}
export function createFlashCardSet(): FlashCardSet {
  const renderFlashCardMultiSelect = (
    flashCards: Array<FlashCard>,
    selectedFlashCardIds: Array<FlashCardId>,
    configData: any,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return (
    <FlashCardMultiSelect
      flashCards={flashCards}
      configData={configData}
      selectedFlashCardIds={selectedFlashCardIds}
      onChange={onChange}
    />
    );
  };

  const initialConfigData: IConfigData = {
    enabledIntervals: intervals.slice()
  };
  
  const flashCardSet = new FlashCardSet(flashCardSetId,
    "Interval 2nd Note Ear Training Piano",
    createFlashCards
  );
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds configDataToEnabledFlashCardIds(flashCardSet, initialConfigData);
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.enableInvertFlashCards = false;
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.customNextFlashCardIdFilter = (studyAlgorithm, flashCards, enabledFlashCardIds) => {
    if (studyAlgorithm.currentFlashCardId === undefined) {
      return enabledFlashCardIds;
    }

    const flashCard = flashCards[studyAlgorithm.currentFlashCardId];
    const secondPitch = flashCard.backSide.data as Pitch;
    
    return enabledFlashCardIds
      .filter(flashCardIndex => {
        const otherFlashCard = flashCards[flashCardIndex];
        const firstPitch = otherFlashCard.frontSide.data as Pitch;

        return firstPitch.midiNumber === secondPitch.midiNumber;
      });
  };
  flashCardSet.containerHeight = "180px";
  
  return flashCardSet;
}