import * as React from "react";

import { Checkbox } from "@material-ui/core";

import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";
import { Pitch, getPitchRange } from "../../../lib/TheoryLib/Pitch";

import { FlashCard, FlashCardSide, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";

import { Button } from "../../Button/Button";
import { playPitches } from "../../../Audio/PianoAudio";
import { SingNoteAnswerSelect } from "../../Utils/SingNoteAnswerSelect";

export interface IConfigData{
  preferUseMic: boolean;
}

const flashCardSetId = "noteSinging1Octave";

const lowestPitch = new Pitch(PitchLetter.C, 0, 4);
const highestPitch = new Pitch(PitchLetter.B, 0, 4);

const allPitches = getPitchRange(lowestPitch, highestPitch);

export interface IFlashCardFrontSideProps {
  pitch: Pitch;
}

export class FlashCardFrontSide extends React.Component<IFlashCardFrontSideProps, {}> {
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

    this.stopSoundsFunc = playPitches([this.props.pitch])[1];
  }
}

interface IFlashCardBackSideData {
  pitch: Pitch;
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
          Play
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

function renderAnswerSelect(
  info: FlashCardStudySessionInfo
) {
  const correctAnswer = [info.currentFlashCard.frontSide.data as Pitch];
  
  return <SingNoteAnswerSelect
    info={info}
    preferUseMic={(info.configData as IConfigData).preferUseMic}
    correctPitch={(info.currentFlashCard.backSide.data as IFlashCardBackSideData).pitch} />
}

function renderFlashCardMultiSelect (
  studySessionInfo: FlashCardStudySessionInfo,
  onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
): JSX.Element {
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
              preferUseMic: checked
            };
            onChange(studySessionInfo.enabledFlashCardIds, newConfigData);
          }}
        />
      </div>
    </div>
  );
};

export function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Note Singing", createFlashCards);
  flashCardSet.getInitialConfigData = (): IConfigData => ({
    preferUseMic: true
  });
  flashCardSet.configDataToEnabledFlashCardIds = (
    flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
  ) => flashCards.map(fc => fc.id);
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.containerHeight = `${200}px`;

  return flashCardSet;
}

function createFlashCards(): FlashCard[] {
  return allPitches
    .map((pitch, i) => {
      const deserializedId = {
        set: flashCardSetId,
        note: pitch.toOneAccidentalAmbiguousString(false, false)
      };
      const id = JSON.stringify(deserializedId);

      const pitchString = pitch.toOneAccidentalAmbiguousString(false, true);

      return new FlashCard(
        id,
        new FlashCardSide(
          () => <FlashCardFrontSide
            key={i}
            pitch={pitch}
          />
        ),
        new FlashCardSide(
          () => <FlashCardBackSide
            key={i.toString() + "b"}
            pitch={pitch}
          />,
          { pitch } as IFlashCardBackSideData
        )
      );
    }
  );
}

export const flashCardSet = createFlashCardSet();