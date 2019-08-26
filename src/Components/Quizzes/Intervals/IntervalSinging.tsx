import * as React from "react";

import { FlashCard, FlashCardId, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { Pitch } from "../../../Pitch";
import { playPitches } from "../../../Piano";
import {
  IConfigData,
  firstPitches,
  intervals,
  directions,
  IntervalEarTrainingFlashCardMultiSelect,
  configDataToEnabledFlashCardIds,
  forEachInterval
} from "../../Utils/IntervalEarTrainingFlashCardMultiSelect";
import { Button } from "@material-ui/core";
import { Tuner } from '../../Tools/Tuner';
import { DetectedPitch } from '../../PitchDetection';
import { AnswerDifficulty } from '../../../AnswerDifficulty';

const flashCardSetId = "intervalSinging";

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
          variant="contained"
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
          variant="contained"
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


export interface IFlashCardAnswerSelectProps {
  info: FlashCardStudySessionInfo
}
export interface IFlashCardAnswerSelectState {
  detectedPitch: DetectedPitch | null;
}
export class FlashCardAnswerSelect
  extends React.Component<IFlashCardAnswerSelectProps, IFlashCardAnswerSelectState> {
  public constructor(props: IFlashCardAnswerSelectProps) {
    super(props);

    this.state = {
      detectedPitch: null
    };
  }

  public render() {
    return (
      <div>
        <Tuner
          isStandalone={false}
          showOctaveNumbers={false}
          alwaysShowLastPitch={true}
          onPitchChange={detectedPitch => this.setState({ detectedPitch: detectedPitch })}
        />
        <div style={{padding: "1em 0"}}>
          <Button
            onClick={event => this.confirmAnswer()}
            disabled={!this.state.detectedPitch}
            variant="contained"
          >
            Confirm Answer
          </Button>
        </div>
      </div>
    );
  }

  private confirmAnswer() {
    if (!this.state.detectedPitch) { return; }

    const { info } = this.props;
    const correctPitchString = info.currentFlashCard.backSide.data as string;
    const answer = this.state.detectedPitch.pitch.toOneAccidentalAmbiguousString(false, true);

    const answerDifficulty = (answer === correctPitchString)
      ? AnswerDifficulty.Easy
      : AnswerDifficulty.Incorrect;
    info.onAnswer(answerDifficulty, answer);
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
          pitch2.toOneAccidentalAmbiguousString(false, true)
        ),
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
    return (
    <IntervalEarTrainingFlashCardMultiSelect
      enableHarmonicIntervals={false}
      studySessionInfo={studySessionInfo}
      hasFlashCardPerFirstPitch={true}
      onChange={onChange}
    />
    );
  };

  const initialConfigData: IConfigData = {
    enabledFirstPitches: firstPitches.slice(),
    enabledIntervals: intervals.slice(),
    enabledDirections: directions.slice()
  };
  
  const flashCardSet = new FlashCardSet(flashCardSetId,
    "Interval Singing",
    createFlashCards
  );
  flashCardSet.configDataToEnabledFlashCardIds = (
    flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
  ) => configDataToEnabledFlashCardIds(false, true, flashCardSet, flashCards, configData);
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = (info: FlashCardStudySessionInfo) =>
    <FlashCardAnswerSelect info={info} />;
  flashCardSet.containerHeight = "120px";
  
  return flashCardSet;
}