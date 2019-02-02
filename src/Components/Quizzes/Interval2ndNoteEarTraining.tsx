import * as React from 'react';

import * as Utils from '../../Utils';
import * as FlashCardUtils from "./Utils";
import { FlashCard } from 'src/FlashCard';
import { FlashCardGroup } from 'src/FlashCardGroup';
import { Pitch } from 'src/Pitch';
import { VerticalDirection } from 'src/VerticalDirection';
import { Interval, intervalQualityStringToNumber } from 'src/Interval';
import { playPitchesSequentially } from 'src/Piano';
import {
  IConfigData,
  rootNotes,
  intervals,
  directions,
  IntervalEarTrainingFlashCardMultiSelect,
  configDataToEnabledQuestionIds
} from "src/Components/IntervalEarTrainingFlashCardMultiSelect";
import { Button } from '@material-ui/core';

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
        <div>{this.props.pitch1.toOneAccidentalAmbiguousString(false) + ", _"}</div>
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

export function createFlashCardGroup(): FlashCardGroup {
  let i = 0;

  const flashCards = Utils.flattenArrays<FlashCard>(rootNotes
    .map(rootPitch => intervals
      .map(interval => directions
        .map(direction => {
          const intervalQuality = interval[0];
          const intervalQualityNum = intervalQualityStringToNumber(intervalQuality);

          const genericInterval = interval[1];
          const genericIntervalNum = parseInt(genericInterval, 10);

          const newPitch = Pitch.addInterval(
            rootPitch,
            (direction === "↑") ? VerticalDirection.Up : VerticalDirection.Down,
            new Interval(genericIntervalNum, intervalQualityNum)
          );

          const iCopy = i;
          i++;
          
          return FlashCard.fromRenderFns(
            () => <FlashCardFrontSide key={iCopy} pitch1={rootPitch} pitch2={newPitch} />,
            newPitch.toOneAccidentalAmbiguousString(false)
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
    />
    );
  };

  const initialConfigData: IConfigData = {
    enabledRootNotes: rootNotes.slice(),
    enabledIntervals: intervals.slice(),
    enabledDirections: directions.slice()
  };
  
  const group = new FlashCardGroup(
    "Interval 2nd Note Ear Training",
    flashCards
  );
  group.initialSelectedFlashCardIndices = configDataToEnabledQuestionIds(false, initialConfigData);
  group.initialConfigData = initialConfigData;
  group.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  group.enableInvertFlashCards = false;
  group.renderAnswerSelect = FlashCardUtils.renderNoteAnswerSelect;
  
  return group;
}