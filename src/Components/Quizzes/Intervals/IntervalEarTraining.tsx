import * as React from "react";

import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";
import { Pitch } from "../../../Pitch";
import { playPitches, playPitchesSequentially } from "../../../Piano";
import {
  IConfigData,
  rootNotes,
  intervals,
  directionsWithHarmonic as directions,
  IntervalEarTrainingFlashCardMultiSelect,
  configDataToEnabledQuestionIds,
  forEachInterval
} from "../../Utils/IntervalEarTrainingFlashCardMultiSelect";
import { Button } from "@material-ui/core";
import { VerticalDirection } from '../../../VerticalDirection';

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

    const pitch1 = Utils.randomElement(rootNotes);

    const intervalIndex = intervals.indexOf(this.props.interval);
    const intervalHalfSteps = (this.props.direction === "↓")
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
      const sounds = playPitches(this.state.pitches)
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
  forEachInterval([rootNotes[0]],
    (interval, direction, pitch1, pitch2, isHarmonicInterval, i) => {
      const deserializedId = {
        set: flashCardSetId,
        interval: interval,
        direction: direction
      };
      const id = JSON.stringify(deserializedId);

      flashCards.push(FlashCard.fromRenderFns(
        id,
        () => <FlashCardFrontSide key={i} interval={interval} direction={direction} />,
        interval.toString()
      ));
    },
    includeHarmonicIntervals);

  return flashCards;
}
export function createFlashCardSet(): FlashCardSet {
  const renderFlashCardMultiSelect = (
    flashCards: Array<FlashCard>,
    selectedFlashCardIndices: number[],
    configData: any,
    onChange: (newValue: number[], newConfigData: any) => void
  ): JSX.Element => {
    return (
    <IntervalEarTrainingFlashCardMultiSelect
      flashCards={flashCards}
      configData={configData}
      selectedFlashCardIndices={selectedFlashCardIndices}
      hasFlashCardPerRootNote={false}
      onChange={onChange}
      enableHarmonicIntervals={true}
    />
    );
  };

  const initialConfigData: IConfigData = {
    enabledRootNotes: rootNotes.slice(),
    enabledIntervals: intervals.slice(),
    enabledDirections: directions.slice()
  };
  
  const flashCardSet = new FlashCardSet(flashCardSetId,
    "Interval Ear Training",
    createFlashCards
  );
  flashCardSet.initialSelectedFlashCardIndices = configDataToEnabledQuestionIds(
    true, false, initialConfigData);
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.enableInvertFlashCards = false;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.moreInfoUri = "https://www.youtube.com/watch?v=_aDCO3h_xik";
  flashCardSet.containerHeight = "120px";

  return flashCardSet;
}