import * as React from 'react';

import * as Utils from '../../Utils';
import * as FlashCardUtils from "./Utils";
import { FlashCard } from '../../FlashCard';
import { FlashCardGroup } from '../../FlashCardGroup';
import { Pitch } from '../../Pitch';
import { VerticalDirection } from '../../VerticalDirection';
import { Interval, intervalQualityStringToNumber } from '../../Interval';
import { playPitches, playPitchesSequentially } from '../../Piano';
import {
  IConfigData,
  rootNotes,
  intervals,
  directionsWithHarmonic as directions,
  IntervalEarTrainingFlashCardMultiSelect,
  configDataToEnabledQuestionIds
} from "../../Components/IntervalEarTrainingFlashCardMultiSelect";
import { Button } from '@material-ui/core';

export interface IFlashCardFrontSideProps {
  pitch1: Pitch;
  pitch2: Pitch;
  isHarmonicInterval: boolean;
}
export class FlashCardFrontSide extends React.Component<IFlashCardFrontSideProps, {}> {
  public componentDidMount() {
    this.playAudio();
  }

  public render(): JSX.Element {
    return (
      <div>
        <div>sound is playing</div>
        <Button
          onClick={event => this.playAudio()}
          variant="contained"
        >
          Replay
        </Button>
      </div>
    );
  }

  private playAudio(): void {
    if (this.props.isHarmonicInterval) {
      playPitches([this.props.pitch1, this.props.pitch2]);
    } else {
      playPitchesSequentially([this.props.pitch1, this.props.pitch2], 500);
    }
  }
}

export function createFlashCardGroup(): FlashCardGroup {
  let i = 0;

  const flashCards = Utils.flattenArrays<FlashCard>(rootNotes
    .map(rootPitch => intervals
      .map(intervalStr => directions
        .map(direction => {
          const intervalQuality = intervalStr[0];
          const intervalQualityNum = intervalQualityStringToNumber(intervalQuality);

          const genericInterval = intervalStr[1];
          const genericIntervalNum = parseInt(genericInterval, 10);

          const interval = new Interval(genericIntervalNum, intervalQualityNum);

          const newPitch = Pitch.addInterval(
            rootPitch,
            (direction !== "↓") ? VerticalDirection.Up : VerticalDirection.Down,
            interval
          );

          const isHarmonicInterval = direction === "harmonic";

          const iCopy = i;
          i++;
          
          return FlashCard.fromRenderFns(
            () => <FlashCardFrontSide key={iCopy} pitch1={rootPitch} pitch2={newPitch} isHarmonicInterval={isHarmonicInterval} />,
            interval.toString()
          );
        })
      )
    )
  );
  const renderFlashCardMultiSelect = (
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
  
  const group = new FlashCardGroup(
    "Interval Ear Training",
    flashCards
  );
  group.initialSelectedFlashCardIndices = configDataToEnabledQuestionIds(true, initialConfigData);
  group.initialConfigData = initialConfigData;
  group.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  group.enableInvertFlashCards = false;
  group.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  group.moreInfoUri = "https://www.youtube.com/watch?v=_aDCO3h_xik";

  return group;
}