import * as React from "react";

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
import { Checkbox } from "@material-ui/core";
import { Tuner } from '../../Tools/Tuner';
import { DetectedPitch } from '../../PitchDetection';
import { AnswerDifficulty } from '../../../Study/AnswerDifficulty';
import { PitchesAudioPlayer } from '../../Utils/PitchesAudioPlayer';
import { createIntervalLevels } from '../../../lib/TheoryLib/Interval';
import { arrayContains } from '../../../lib/Core/ArrayUtils';
import { Button } from "../../../ui/Button/Button";

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
    const buttonStyle: any = { textTransform: "none" };

    return (
      <div>
        <div>{this.props.pitch1.toOneAccidentalAmbiguousString(false, true) + " " + this.props.direction + " " + this.props.interval}</div>
        <Button
          onClick={event => this.playAudio()}
          style={buttonStyle}
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

export interface IFlashCardAnswerSelectProps {
  info: FlashCardStudySessionInfo
}
export interface IFlashCardAnswerSelectState {
  detectedPitch: DetectedPitch | null;
  useMicrophone: boolean;
}
export class FlashCardAnswerSelect
  extends React.Component<IFlashCardAnswerSelectProps, IFlashCardAnswerSelectState> {
  public constructor(props: IFlashCardAnswerSelectProps) {
    super(props);

    this.state = {
      detectedPitch: null,
      useMicrophone: true
    };
  }

  public render() {
    const configData = this.props.info.configData as IConfigData;
    const useMicrophone = this.state.useMicrophone && configData.preferUseMic;
    
    const buttonStyle: any = { textTransform: "none" };

    return useMicrophone ? (
      <div>
        <Tuner
          isStandalone={false}
          showOctaveNumbers={false}
          alwaysShowLastPitch={true}
          onPitchChange={detectedPitch => this.setState({ detectedPitch: detectedPitch })}
          onMicrophoneError={error => this.onMicrophoneError(error)}
        />
        <div style={{padding: "1em 0"}}>
          <Button
            onClick={event => this.confirmAnswer()}
            disabled={!this.state.detectedPitch}
          >
            Confirm Answer
          </Button>
        </div>
      </div>
    ) : (
      <div style={{ fontSize: "1.5em", margin: "0 0 2em 0" }}>
        <div style={{ marginBottom: "0.5em" }}>
          <PitchesAudioPlayer pitches={[this.getCorrectPitch()]} playSequentially={false}>
            Play Answer
          </PitchesAudioPlayer>
        </div>
        <div>
          <Button
            onClick={event => this.onUserProvidedCorrectness(AnswerDifficulty.Easy)}
            style={buttonStyle}
          >
            I Was Correct
          </Button>
          <Button
            onClick={event => this.onUserProvidedCorrectness(AnswerDifficulty.Incorrect)}
            style={buttonStyle}
          >
            I Was Incorrect
          </Button>
        </div>
      </div>
    );
  }

  private getCorrectPitch(): Pitch {
    return (this.props.info.currentFlashCard.backSide.data as IFlashCardBackSideData).pitch;
  }

  private confirmAnswer() {
    if (!this.state.detectedPitch) { return; }

    const { info } = this.props;
    const correctPitch = this.getCorrectPitch();
    const answer = this.state.detectedPitch.pitch;

    const answerDifficulty = (answer.midiNumberNoOctave === correctPitch.midiNumberNoOctave)
      ? AnswerDifficulty.Easy
      : AnswerDifficulty.Incorrect;
    info.onAnswer(answerDifficulty, answer);
  }
  private onUserProvidedCorrectness(answerDifficulty: AnswerDifficulty) {
    const { info } = this.props;
    info.onAnswer(answerDifficulty, AnswerDifficulty[answerDifficulty]);

    if (answerDifficulty === AnswerDifficulty.Incorrect) {
      info.skipFlashCard();
    }
  }
  private onMicrophoneError(error: any) {
    alert("Failed initializing microphone. You must check your answers yourself. Error: " + error);
    this.setState({ useMicrophone: false });
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
        ),
      ));
    },
    includeHarmonicIntervals);

  return flashCards;
}
function createFlashCardSet(): FlashCardSet {
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
    <FlashCardAnswerSelect info={info} />;
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