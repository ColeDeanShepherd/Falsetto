import * as React from "react";

import * as Utils from "../../../lib/Core/Utils";
import { FlashCard, FlashCardSide, FlashCardId, createFlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo, FlashCardLevel } from "../../../FlashCardSet";
import { createPitch, Pitch } from "../../../lib/TheoryLib/Pitch";
import { playPitchesSequentially } from "../../../Audio/PianoAudio";
import {
  intervals,
  forEachInterval
} from "../../Utils/IntervalEarTrainingFlashCardMultiSelect";
import { TableRow, TableCell, Checkbox, Table, TableHead, TableBody, Grid } from "@material-ui/core";
import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";
import { PianoKeysAnswerSelect } from "../../Utils/PianoKeysAnswerSelect";
import { createIntervalLevels } from '../../../lib/TheoryLib/Interval';
import { arrayContains, toggleArrayElement } from '../../../lib/Core/ArrayUtils';
import { Button } from "../../../ui/Button/Button";

const flashCardSetId = "pianoNextNoteEarTraining";

const minPitch = createPitch(PitchLetter.C, 0, 4);
const maxPitch = createPitch(PitchLetter.B, 0, 5);
const includeHarmonicIntervals = false;

const pianoMaxHeight = 140;

export const rootNotes = [
  createPitch(PitchLetter.C, 0, 4),
  createPitch(PitchLetter.C, 1, 4),
  createPitch(PitchLetter.D, -1, 4),
  createPitch(PitchLetter.D, 0, 4),
  createPitch(PitchLetter.E, -1, 4),
  createPitch(PitchLetter.E, 0, 4),
  createPitch(PitchLetter.F, 0, 4),
  createPitch(PitchLetter.F, 1, 4),
  createPitch(PitchLetter.G, -1, 4),
  createPitch(PitchLetter.G, 0, 4),
  createPitch(PitchLetter.A, -1, 4),
  createPitch(PitchLetter.A, 0, 4),
  createPitch(PitchLetter.B, -1, 4),
  createPitch(PitchLetter.B, 0, 4),
  createPitch(PitchLetter.C, 0, 5),
  createPitch(PitchLetter.C, 1, 5),
  createPitch(PitchLetter.D, -1, 5),
  createPitch(PitchLetter.D, 0, 5),
  createPitch(PitchLetter.E, -1, 5),
  createPitch(PitchLetter.E, 0, 5),
  createPitch(PitchLetter.F, 0, 5),
  createPitch(PitchLetter.F, 1, 5),
  createPitch(PitchLetter.G, -1, 5),
  createPitch(PitchLetter.G, 0, 5),
  createPitch(PitchLetter.A, -1, 5),
  createPitch(PitchLetter.A, 0, 5),
  createPitch(PitchLetter.B, -1, 5),
  createPitch(PitchLetter.B, 0, 5)
];

export interface IConfigData {
  enabledIntervals: string[];
}
export interface IFlashCardBackSideData {
  pitch: Pitch;
  intervalString: string;
}

export function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
): Array<FlashCardId> {
  const enabledFlashCardIds = new Array<string>();
  forEachInterval(rootNotes,
    (interval, direction, p1, p2, isHarmonicInterval, i) => {
    if (arrayContains(configData.enabledIntervals, interval)) {
      enabledFlashCardIds.push(flashCards[i].id);
    }
  }, includeHarmonicIntervals, minPitch, maxPitch);

  return enabledFlashCardIds;
}

export interface IFlashCardFrontSideProps {
  pitch1: Pitch;
  pitch2: Pitch;
}
export class FlashCardFrontSide extends React.Component<IFlashCardFrontSideProps, {}> {
  public componentDidMount() {
    //this.playAudio();
  }

  public render(): JSX.Element {
    return (
      <div>
        <div>
          <PianoKeyboard
            maxHeight={pianoMaxHeight}
            lowestPitch={createPitch(PitchLetter.C, 0, 4)}
            highestPitch={createPitch(PitchLetter.B, 0, 5)}
            pressedPitches={[this.props.pitch1]}
          />
        </div>
        <Button
          onClick={event => this.playAudio()}
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
      <Grid container spacing={10}>
        <Grid item xs={12}>{intervalCheckboxes}</Grid>
      </Grid>
    );
  }

  private toggleIntervalEnabled(interval: string) {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const newEnabledIntervals = toggleArrayElement(
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
      this.props.studySessionInfo.flashCardSet, this.props.studySessionInfo.flashCards, newConfigData
    );
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}

export function renderAnswerSelect(
  info: FlashCardStudySessionInfo
) {
  const correctAnswer = [(info.currentFlashCard.backSide.data as IFlashCardBackSideData).pitch];
  
  return <PianoKeysAnswerSelect
    maxHeight={pianoMaxHeight}
    lowestPitch={createPitch(PitchLetter.C, 0, 4)}
    highestPitch={createPitch(PitchLetter.B, 0, 5)}
    correctAnswer={correctAnswer}
    onAnswer={info.onAnswer} lastCorrectAnswer={info.lastCorrectAnswer}
    incorrectAnswers={info.incorrectAnswers} instantConfirm={true} />;
}

export function createFlashCards(): Array<FlashCard> {
  const flashCards = new Array<FlashCard>();
  forEachInterval(rootNotes,
    (interval, direction, p1, p2, _, i) => {
      flashCards.push(
        new FlashCard(
          createFlashCardId(flashCardSetId, { pitches: [p1.toString(true), p2.toString(true)] }),
          new FlashCardSide(
            size => <FlashCardFrontSide key={i} pitch1={p1} pitch2={p2} />,
            p1
          ),
          new FlashCardSide(
            p2.toOneAccidentalAmbiguousString(/*includeOctaveNumber*/ false),
            { pitch: p2, intervalString: interval } as IFlashCardBackSideData
          )
        )
      );
    }, includeHarmonicIntervals, minPitch, maxPitch);
  return flashCards;
}
function createFlashCardSet(): FlashCardSet {
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
  
  const flashCardSet = new FlashCardSet(flashCardSetId,
    "Interval 2nd Note Ear Training Piano",
    createFlashCards
  );
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.getInitialConfigData = (): IConfigData => ({
    enabledIntervals: intervals.slice()
  });
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.customNextFlashCardIdFilter = studySessionInfo => {
    if (studySessionInfo.studyAlgorithm.currentFlashCardId === undefined) {
      return studySessionInfo.enabledFlashCardIds;
    }

    const flashCard = studySessionInfo.currentFlashCard;
    const secondPitch = (flashCard.backSide.data as IFlashCardBackSideData).pitch;
    
    return studySessionInfo.enabledFlashCardIds
      .filter(flashCardId => {
        const otherFlashCard = Utils.unwrapValueOrUndefined(studySessionInfo.flashCards.find(fc => fc.id === flashCardId));
        const firstPitch = otherFlashCard.frontSide.data as Pitch;

        return firstPitch.midiNumber === secondPitch.midiNumber;
      });
  };
  flashCardSet.createFlashCardLevels = (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => (
    createIntervalLevels(false, false)
      .map(level => new FlashCardLevel(
        level.name,
        flashCards
          .filter(fc => {
            const intervalString = (fc.backSide.data as IFlashCardBackSideData).intervalString;
            return arrayContains(level.intervalStrings, intervalString);
          })
          .map(fc => fc.id),
        (curConfigData: IConfigData) => (
          {
            enabledIntervals: level.intervalStrings.slice()
          } as IConfigData
        )
      ))
  );
  
  return flashCardSet;
}

export const flashCardSet = createFlashCardSet();