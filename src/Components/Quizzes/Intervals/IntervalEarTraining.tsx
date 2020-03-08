import * as React from "react";

import * as Utils from "../../../lib/Core/Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard, FlashCardId, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo, FlashCardLevel } from "../../../FlashCardSet";
import { Pitch } from "../../../lib/TheoryLib/Pitch";
import { playPitches, playPitchesSequentially } from "../../../Piano";
import {
  IConfigData,
  firstPitches,
  intervals,
  directionsWithHarmonic as directions,
  IntervalEarTrainingFlashCardMultiSelect,
  configDataToEnabledFlashCardIds,
  forEachInterval
} from "../../Utils/IntervalEarTrainingFlashCardMultiSelect";
import { Button } from "@material-ui/core";
import { createIntervalLevels } from '../../../lib/TheoryLib/Interval';
import { randomElement } from '../../../lib/Core/Random';
import { arrayContains } from '../../../lib/Core/ArrayUtils';

const flashCardSetId = "intervalEarTraining";

export interface IFlashCardFrontSideProps {
  interval: string;
  direction: string;
}
export interface IFlashCardFrontSideState {
  pitches: Array<Pitch>;
}
export class FlashCardFrontSide extends React.Component<IFlashCardFrontSideProps, IFlashCardFrontSideState> {
  public constructor(props: IFlashCardFrontSideProps) {
    super(props);

    const pitch1 = randomElement(firstPitches);

    const intervalIndex = intervals.indexOf(this.props.interval);
    const intervalHalfSteps = (this.props.direction === "↑")
      ? intervalIndex + 1
      : -(intervalIndex + 1);
    const pitch2 = Pitch.createFromMidiNumber(pitch1.midiNumber + intervalHalfSteps);

    this.state = {
      pitches: [pitch1, pitch2]
    };
  }

  public componentDidMount() {
    //this.playAudio();
  }

  public render(): JSX.Element {
    return (
      <div>
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

  private playAudio(): void {
    if (this.stopSoundsFunc) {
      this.stopSoundsFunc();
      this.stopSoundsFunc = null;
    }

    if (this.props.direction === "harmonic") {
      const sounds = playPitches(this.state.pitches)[0]
        .then(sounds => {
          this.stopSoundsFunc = () => {
            for (const sound of sounds) {
              sound.stop();
            }
          };
        });
    } else {
      const cutOffSounds = true;
      this.stopSoundsFunc = playPitchesSequentially(this.state.pitches, 500, cutOffSounds);
    }
  }
}

export function createFlashCards(): Array<FlashCard> {
  let flashCards = new Array<FlashCard>();

  const includeHarmonicIntervals = true;
  forEachInterval([firstPitches[0]],
    (interval, direction, pitch1, pitch2, isHarmonicInterval, i) => {
      const deserializedId = {
        set: flashCardSetId,
        interval: interval,
        direction: direction
      };
      const id = JSON.stringify(deserializedId);

      flashCards.push(new FlashCard(
        id,
        new FlashCardSide(
          () => <FlashCardFrontSide key={i} interval={interval} direction={direction} />
        ),
        new FlashCardSide(
          interval, interval
        )
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
    return (
    <IntervalEarTrainingFlashCardMultiSelect
      studySessionInfo={studySessionInfo}
      hasFlashCardPerFirstPitch={false}
      onChange={onChange}
      enableHarmonicIntervals={true}
    />
    );
  };

  const flashCardSet = new FlashCardSet(flashCardSetId,
    "Interval Ear Training",
    createFlashCards
  );
  flashCardSet.configDataToEnabledFlashCardIds = (
    flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
  ) => configDataToEnabledFlashCardIds(true, false, flashCardSet, flashCards, configData);
  flashCardSet.getInitialConfigData = (): IConfigData => ({
    enabledFirstPitches: firstPitches.slice(),
    enabledIntervals: intervals.slice(),
    enabledDirections: directions.slice()
  });
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.moreInfoUri = "https://www.youtube.com/watch?v=_aDCO3h_xik";
  flashCardSet.containerHeight = "120px";
  flashCardSet.createFlashCardLevels = (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => (
    createIntervalLevels(false, false)
      .map(level => new FlashCardLevel(
        level.name,
        flashCards
          .filter(fc => {
            const intervalString = fc.backSide.data as string;
            return arrayContains(level.intervalStrings, intervalString);
          })
          .map(fc => fc.id),
        (curConfigData: IConfigData) => (
          {
            enabledFirstPitches: firstPitches.slice(),
            enabledIntervals: level.intervalStrings.slice(),
            enabledDirections: directions.slice()
          } as IConfigData
        )
      ))
  );

  return flashCardSet;
}

export const flashCardSet = createFlashCardSet();