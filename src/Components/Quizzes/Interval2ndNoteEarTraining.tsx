import * as React from 'react';

import * as Utils from '../../Utils';
import * as FlashCardUtils from "./Utils";
import { FlashCard } from 'src/FlashCard';
import { FlashCardGroup } from 'src/FlashCardGroup';
import { Pitch, ambiguousPitchStrings } from 'src/Pitch';
import { VerticalDirection } from 'src/VerticalDirection';
import { Interval, intervalQualityStringToNumber } from 'src/Interval';
import { playPitch } from 'src/Piano';
import {
  IConfigData,
  rootNotes,
  intervals,
  signs,
  IntervalEarTrainingFlashCardMultiSelect,
  configDataToEnabledQuestionIds
} from "src/Components/IntervalEarTrainingFlashCardMultiSelect";

export interface IFlashCardFrontSideProps {
  pitch1: Pitch;
  pitch2: Pitch;
}
export class FlashCardFrontSide extends React.Component<IFlashCardFrontSideProps, {}> {
  public componentDidMount() {
    playPitch(this.props.pitch1);
    setTimeout(() => playPitch(this.props.pitch2), 1000);
  }

  public render(): JSX.Element {
    return <span>{this.props.pitch1.toOneAccidentalAmbiguousString(false) + ", _"}</span>;
  }
}

export function createFlashCardGroup(): FlashCardGroup {
  let i = 0;

  const flashCards = Utils.flattenArrays<FlashCard>(rootNotes
    .map(rootPitch => intervals
      .map(interval => signs
        .map(sign => {
          const intervalQuality = interval[0];
          const intervalQualityNum = intervalQualityStringToNumber(intervalQuality);

          const genericInterval = interval[1];
          const genericIntervalNum = parseInt(genericInterval, 10);

          const newPitch = Pitch.addInterval(
            rootPitch,
            (sign === "+") ? VerticalDirection.Up : VerticalDirection.Down,
            new Interval(genericIntervalNum, intervalQualityNum)
          );

          const iCopy = i;
          i++;
          
          return new FlashCard(
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
    enabledSigns: signs.slice()
  };
  
  const group = new FlashCardGroup(
    "Interval 2nd Note Ear Training",
    flashCards
  );
  group.initialSelectedFlashCardIndices = configDataToEnabledQuestionIds(initialConfigData);
  group.initialConfigData = initialConfigData;
  group.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  group.enableInvertFlashCards = false;
  group.renderAnswerSelect = FlashCardUtils.renderStringAnswerSelect.bind(
    null,
    ambiguousPitchStrings
  );
  
  return group;
}