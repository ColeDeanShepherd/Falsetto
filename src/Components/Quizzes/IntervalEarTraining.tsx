import * as React from 'react';

import * as Utils from '../../Utils';
import * as FlashCardUtils from "./Utils";
import { FlashCard } from 'src/FlashCard';
import { FlashCardGroup } from 'src/FlashCardGroup';
import { Pitch } from 'src/Pitch';
import { VerticalDirection } from 'src/VerticalDirection';
import { Interval, intervalQualityStringToNumber } from 'src/Interval';
import { playPitch } from 'src/Piano';
import {
  IConfigData,
  rootNotes,
  intervals,
  directionsWithHarmonic as directions,
  IntervalEarTrainingFlashCardMultiSelect,
  configDataToEnabledQuestionIds
} from "src/Components/IntervalEarTrainingFlashCardMultiSelect";

export interface IFlashCardFrontSideProps {
  pitch1: Pitch;
  pitch2: Pitch;
  isHarmonicInterval: boolean;
}
export class FlashCardFrontSide extends React.Component<IFlashCardFrontSideProps, {}> {
  public componentDidMount() {
    playPitch(this.props.pitch1);

    if (this.props.isHarmonicInterval) {
      playPitch(this.props.pitch2);
    } else {
      setTimeout(() => playPitch(this.props.pitch2), 1000);
    }
  }

  public render(): JSX.Element {
    return <span>sound is playing</span>;
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
          
          return new FlashCard(
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
  group.renderAnswerSelect = FlashCardUtils.renderStringAnswerSelect.bind(null, intervals);

  return group;
}