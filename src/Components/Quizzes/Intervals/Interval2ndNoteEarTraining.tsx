import * as React from "react";

import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";
import { Pitch } from "../../../Pitch";
import { playPitchesSequentially } from "../../../Piano";
import {
  IConfigData,
  rootNotes,
  intervals,
  directions,
  IntervalEarTrainingFlashCardMultiSelect,
  configDataToEnabledQuestionIds,
  forEachInterval
} from "../../Utils/IntervalEarTrainingFlashCardMultiSelect";
import { Button } from "@material-ui/core";

const flashCardSetId = "nextNoteEarTraining";

export interface IFlashCardFrontSideProps {
  pitch1: Pitch;
  pitch2: Pitch;
}
export class FlashCardFrontSide extends React.Component<IFlashCardFrontSideProps, {}> {
  public componentDidMount() {
    //this.playAudio();
  }

  public render(): JSX.Element {
    return (
      <div>
        <div>{this.props.pitch1.toOneAccidentalAmbiguousString(false, true) + ", _"}</div>
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

  private playAudio() {
    if (this.stopSoundsFunc !== null) {
      this.stopSoundsFunc();
      this.stopSoundsFunc = null;
    }

    const cutOffSounds = true;
    this.stopSoundsFunc = playPitchesSequentially([this.props.pitch1, this.props.pitch2], 500, cutOffSounds);
  }
}

export function createFlashCards(): Array<FlashCard> {
  let flashCards = new Array<FlashCard>();

  const includeHarmonicIntervals = false;
  forEachInterval(rootNotes,
    (interval, direction, pitch1, pitch2, isHarmonicInterval, i) => {
      const deserializedId = {
        set: flashCardSetId,
        isHarmonic: isHarmonicInterval,
        pitches: [pitch1.toString(true), pitch2.toString(true)]
      };
      const id = JSON.stringify(deserializedId);

      flashCards.push(FlashCard.fromRenderFns(
        id,
        () => <FlashCardFrontSide key={i} pitch1={pitch1} pitch2={pitch2} />,
        pitch2.toOneAccidentalAmbiguousString(false, true)
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
      hasFlashCardPerRootNote={true}
      onChange={onChange}
    />
    );
  };

  const initialConfigData: IConfigData = {
    enabledRootNotes: rootNotes.slice(),
    enabledIntervals: intervals.slice(),
    enabledDirections: directions.slice()
  };
  
  const flashCardSet = new FlashCardSet(flashCardSetId,
    "Interval 2nd Note Ear Training",
    createFlashCards
  );
  flashCardSet.initialSelectedFlashCardIndices = configDataToEnabledQuestionIds(
    false, true, initialConfigData);
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.enableInvertFlashCards = false;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderNoteAnswerSelect;
  flashCardSet.containerHeight = "120px";
  
  return flashCardSet;
}