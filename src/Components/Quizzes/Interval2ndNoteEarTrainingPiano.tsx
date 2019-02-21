import * as React from 'react';

import * as Utils from '../../Utils';
import * as FlashCardUtils from "./Utils";
import { FlashCard, FlashCardSide } from '../../FlashCard';
import { FlashCardGroup } from '../../FlashCardGroup';
import { Pitch } from '../../Pitch';
import { VerticalDirection } from '../../VerticalDirection';
import { Interval, intervalQualityStringToNumber } from '../../Interval';
import { playPitchesSequentially } from '../../Piano';
import {
  intervals,
  directions
} from "../../Components/IntervalEarTrainingFlashCardMultiSelect";
import { Button, TableRow, TableCell, Checkbox, Table, TableHead, TableBody, Grid } from '@material-ui/core';
import { PianoKeyboard } from '../PianoKeyboard';
import { PitchLetter } from '../../PitchLetter';
import { AnswerDifficulty } from '../../StudyAlgorithm';
import { PianoKeysAnswerSelect } from '../PianoKeysAnswerSelect';

const minPitch = new Pitch(PitchLetter.C, 0, 4);
const maxPitch = new Pitch(PitchLetter.B, 0, 5);

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
  forEachInterval((interval, p1, p2, i) => {
    if (Utils.arrayContains(configData.enabledIntervals, interval)) {
      enabledQuestionIds.push(i);
    }
  });

  return enabledQuestionIds;
}

export interface IFlashCardFrontSideProps {
  pitch1: Pitch;
  pitch2: Pitch;
}
export class FlashCardFrontSide extends React.Component<IFlashCardFrontSideProps, {}> {
  public componentDidMount() {
    this.playAudio();
  }

  public render(): JSX.Element {
    return (
      <div>
        <div>
          <PianoKeyboard
            width={400} height={100}
            lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
            highestPitch={new Pitch(PitchLetter.B, 0, 5)}
            pressedPitches={[this.props.pitch1]}
          />
        </div>
        <Button
          onClick={event => this.playAudio()}
          variant="contained"
        >
          Replay
        </Button>
      </div>
    );
  }

  private playAudio() {
    playPitchesSequentially([this.props.pitch1, this.props.pitch2], 500);
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
  flashCards: FlashCard[],
  enabledFlashCardIndices: number[],
  areFlashCardsInverted: boolean,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
) {
  const key = flashCards.indexOf(flashCard);
  const correctAnswer = [flashCard.backSide.data as Pitch];
  return <PianoKeysAnswerSelect key={key} correctAnswer={correctAnswer} onAnswer={onAnswer} maxNumPitches={1} />;
}

export function forEachInterval(callbackFn: (interval: string, pitch1: Pitch, pitch2: Pitch, index: number) => void) {
  let i = 0;

  for (const rootPitch of rootNotes) {
    for (const interval of intervals) {
      for (const direction of directions) {
        const intervalQuality = interval[0];
        const intervalQualityNum = intervalQualityStringToNumber(intervalQuality);

        const genericInterval = interval[1];
        const genericIntervalNum = parseInt(genericInterval, 10);

        const newPitch = Pitch.addInterval(
          rootPitch,
          (direction === "↑") ? VerticalDirection.Up : VerticalDirection.Down,
          new Interval(genericIntervalNum, intervalQualityNum)
        );

        if ((newPitch.midiNumber >= minPitch.midiNumber) && (newPitch.midiNumber <= maxPitch.midiNumber)) {
          callbackFn(interval, rootPitch, newPitch, i);
          i++;
        }
      }
    }
  }
}

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = new Array<FlashCard>();
  forEachInterval((interval, p1, p2, i) => {
    flashCards.push(
      new FlashCard(
        new FlashCardSide(() => <FlashCardFrontSide key={i} pitch1={p1} pitch2={p2} />, p1),
        new FlashCardSide(p2.toOneAccidentalAmbiguousString(false), p2)
      )
    );
  });

  const renderFlashCardMultiSelect = (
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
    flashCards
  );
  group.initialSelectedFlashCardIndices = configDataToEnabledQuestionIds(initialConfigData);
  group.initialConfigData = initialConfigData;
  group.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  group.enableInvertFlashCards = false;
  group.renderAnswerSelect = renderAnswerSelect;
  group.customNextFlashCardIdFilter = (studyAlgorithm, enabledFlashCardIds) => {
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
  
  return group;
}