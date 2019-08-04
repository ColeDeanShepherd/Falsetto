import * as React from "react";

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

const flashCardSetId = "intervalEarTraining";

export interface IFlashCardFrontSideProps {
  pitch1: Pitch;
  pitch2: Pitch;
  isHarmonicInterval: boolean;
}
export class FlashCardFrontSide extends React.Component<IFlashCardFrontSideProps, {}> {
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

    if (this.props.isHarmonicInterval) {
      const sounds = playPitches([this.props.pitch1, this.props.pitch2])
        .then(sounds => {
          this.stopSoundsFunc = () => {
            for (const sound of sounds) {
              sound.stop();
            }
          };
        });
    } else {
      const cutOffSounds = true;
      this.stopSoundsFunc = playPitchesSequentially([this.props.pitch1, this.props.pitch2], 500, cutOffSounds);
    }
  }
}

export function createFlashCards(): Array<FlashCard> {
  let flashCards = new Array<FlashCard>();

  const includeHarmonicIntervals = true;
  forEachInterval(rootNotes,
    (interval, pitch1, pitch2, isHarmonicInterval, i) => {
      const deserializedId = {
        set: flashCardSetId,
        isHarmonic: isHarmonicInterval,
        pitches: [pitch1.toString(true), pitch2.toString(true)]
      };
      const id = JSON.stringify(deserializedId);

      flashCards.push(FlashCard.fromRenderFns(
        id,
        () => <FlashCardFrontSide key={i} pitch1={pitch1} pitch2={pitch2} isHarmonicInterval={isHarmonicInterval} />,
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
  flashCardSet.initialSelectedFlashCardIndices = configDataToEnabledQuestionIds(true, initialConfigData);
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.enableInvertFlashCards = false;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.moreInfoUri = "https://www.youtube.com/watch?v=_aDCO3h_xik";
  flashCardSet.containerHeight = "120px";

  return flashCardSet;
}