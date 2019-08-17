import * as React from "react";

import * as Utils from "../../../Utils";
import { Vector2D } from '../../../Vector2D';
import { Size2D } from "../../../Size2D";
import { Rect2D } from '../../../Rect2D';
import { FlashCard, FlashCardSide, FlashCardId } from "../../../FlashCard";
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
  studySessionInfo: FlashCardStudySessionInfo,
  configData: IConfigData
): Array<FlashCardId> {
  const enabledFlashCardIds = new Array<string>();
  forEachInterval(rootNotes,
    (interval, direction, p1, p2, isHarmonicInterval, i) => {
    if (Utils.arrayContains(configData.enabledIntervals, interval)) {
      enabledFlashCardIds.push(studySessionInfo.flashCards[i].id);
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
  studySessionInfo: FlashCardStudySessionInfo;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export interface IFlashCardMultiSelectState {}
export class FlashCardMultiSelect extends React.Component<IFlashCardMultiSelectProps, IFlashCardMultiSelectState> {
  public render(): JSX.Element {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const intervalCheckboxTableRows = intervals
      .map((interval, i) => {
        const isChecked = configData.enabledIntervals.indexOf(interval) >= 0;
        const isEnabled = !isChecked || (configData.enabledIntervals.length > 1);

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
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const newEnabledIntervals = Utils.toggleArrayElement(
      configData.enabledIntervals,
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

    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(
      this.props.studySessionInfo, newConfigData
    );
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}

export function renderAnswerSelect(
  info: FlashCardStudySessionInfo
) {
  const key = info.flashCards.indexOf(info.currentFlashCard);
  const correctAnswer = [info.currentFlashCard.backSide.data as Pitch];
  const size = Utils.shrinkRectToFit(new Size2D(info.width, info.height), new Size2D(400, 100));
  
  return <PianoKeysAnswerSelect
    key={key} width={size.width} height={size.height} correctAnswer={correctAnswer}
    onAnswer={info.onAnswer} maxNumPitches={1} lastCorrectAnswer={info.lastCorrectAnswer}
    incorrectAnswers={info.incorrectAnswers} />;
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
    studySessionInfo: FlashCardStudySessionInfo,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return (
    <FlashCardMultiSelect
      studySessionInfo={studySessionInfo}
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
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.customNextFlashCardIdFilter = studySessionInfo => {
    if (studySessionInfo.studyAlgorithm.currentFlashCardId === undefined) {
      return studySessionInfo.enabledFlashCardIds;
    }

    const flashCard = studySessionInfo.flashCards[studySessionInfo.studyAlgorithm.currentFlashCardId];
    const secondPitch = flashCard.backSide.data as Pitch;
    
    return studySessionInfo.enabledFlashCardIds
      .filter(flashCardIndex => {
        const otherFlashCard = studySessionInfo.flashCards[flashCardIndex];
        const firstPitch = otherFlashCard.frontSide.data as Pitch;

        return firstPitch.midiNumber === secondPitch.midiNumber;
      });
  };
  flashCardSet.containerHeight = "180px";
  
  return flashCardSet;
}