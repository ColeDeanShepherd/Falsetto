import * as React from "react";
import { Checkbox } from "@material-ui/core";

import { FlashCard, FlashCardId, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo, FlashCardLevel } from "../../../FlashCardSet";
import { Pitch } from "../../../lib/TheoryLib/Pitch";
import { playPitches } from "../../../Audio/PianoAudio";
import {
  IConfigData as IBaseConfigData,
  firstPitches,
  intervals,
  directions,
  IntervalEarTrainingFlashCardMultiSelect,
  configDataToEnabledFlashCardIds,
  forEachInterval
} from "../../Utils/IntervalEarTrainingFlashCardMultiSelect";
import { createIntervalLevels } from '../../../lib/TheoryLib/Interval';
import { arrayContains } from '../../../lib/Core/ArrayUtils';
import { Button } from "../../../ui/Button/Button";
import { SingNoteAnswerSelect } from '../../Utils/SingNoteAnswerSelect';

const flashCardSetId = "intervalSinging";

export interface IConfigData extends IBaseConfigData {
  preferUseMic: boolean;
}

interface IFlashCardBackSideData {
  pitch: Pitch;
  intervalString: string;
}

export interface IFlashCardFrontSideProps {
  pitch1: Pitch;
  interval: string;
  direction: string;
}

export class FlashCardFrontSide extends React.Component<IFlashCardFrontSideProps, {}> {
  public componentDidMount() {
    //this.playAudio();
  }

  public render(): JSX.Element {
    return (
      <div>
        <div>{this.props.pitch1.toOneAccidentalAmbiguousString(false, true) + " " + this.props.direction + " " + this.props.interval}</div>
        <Button
          onClick={event => this.playAudio()}
        >
          Play First Pitch
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

    this.stopSoundsFunc = playPitches([this.props.pitch1])[1];
  }
}

export interface IFlashCardBackSideProps {
  pitch: Pitch;
}
export class FlashCardBackSide extends React.Component<IFlashCardBackSideProps, {}> {
  public componentDidMount() {
    //this.playAudio();
  }

  public render(): JSX.Element {
    return (
      <div>
        <div>{this.props.pitch.toOneAccidentalAmbiguousString(false, true)}</div>
        <Button
          onClick={event => this.playAudio()}
        >
          Play Second Pitch
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

    this.stopSoundsFunc = playPitches([this.props.pitch])[1];
  }
}

export function createFlashCards(): Array<FlashCard> {
  let flashCards = new Array<FlashCard>();

  const includeHarmonicIntervals = false;
  forEachInterval(firstPitches,
    (interval, direction, pitch1, pitch2, isHarmonicInterval, i) => {
      const deserializedId = {
        set: flashCardSetId,
        isHarmonic: isHarmonicInterval,
        pitches: [pitch1.toString(true), pitch2.toString(true)]
      };
      const id = JSON.stringify(deserializedId);

      flashCards.push(new FlashCard(
        id,
        new FlashCardSide(
          () => <FlashCardFrontSide
            key={i}
            pitch1={pitch1}
            interval={interval} direction={direction}
          />
        ),
        new FlashCardSide(
          () => <FlashCardBackSide
            key={i.toString() + "b"}
            pitch={pitch2}
          />,
          { pitch: pitch2, intervalString: interval } as IFlashCardBackSideData
        )
      ));
    },
    includeHarmonicIntervals);

  return flashCards;
}

export function createFlashCardSet(): FlashCardSet {
  const renderFlashCardMultiSelect = (
    studySessionInfo: FlashCardStudySessionInfo,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    const configData = studySessionInfo.configData as IConfigData;
    const preferUseMic = configData.preferUseMic;

    return (
      <div>
        <div>
          <span>Use Microphone If Available</span>
          <Checkbox
            checked={preferUseMic}
            onChange={(event, checked) => {
              const newConfigData: IConfigData = {
                enabledFirstPitches: configData.enabledFirstPitches,
                enabledIntervals: configData.enabledIntervals,
                enabledDirections: configData.enabledDirections,
                preferUseMic: checked
              };
              onChange(studySessionInfo.enabledFlashCardIds, newConfigData);
            }}
          />
        </div>
        <IntervalEarTrainingFlashCardMultiSelect
          enableHarmonicIntervals={false}
          studySessionInfo={studySessionInfo}
          hasFlashCardPerFirstPitch={true}
          onChange={onChange}
        />
      </div>
    );
  };

  const flashCardSet = new FlashCardSet(flashCardSetId,
    "Interval Singing",
    createFlashCards
  );
  flashCardSet.configDataToEnabledFlashCardIds = (
    flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
  ) => configDataToEnabledFlashCardIds(false, true, flashCardSet, flashCards, configData);
  flashCardSet.getInitialConfigData = (): IConfigData => ({
    enabledFirstPitches: firstPitches.slice(),
    enabledIntervals: intervals.slice(),
    enabledDirections: directions.slice(),
    preferUseMic: true
  });
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = (info: FlashCardStudySessionInfo) =>
    <SingNoteAnswerSelect
      info={info}
      preferUseMic={(info.configData as IConfigData).preferUseMic}
      correctPitch={(info.currentFlashCard.backSide.data as IFlashCardBackSideData).pitch} />;
  flashCardSet.containerHeight = "120px";
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
            enabledFirstPitches: firstPitches.slice(),
            enabledIntervals: level.intervalStrings.slice(),
            enabledDirections: directions.slice(),
            preferUseMic: curConfigData.preferUseMic
          } as IConfigData
        )
      ))
  );
  
  return flashCardSet;
}

export const flashCardSet = createFlashCardSet();