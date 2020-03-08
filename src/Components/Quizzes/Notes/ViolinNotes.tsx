import * as React from "react";

import { Size2D } from "../../../lib/Core/Size2D";
import * as FlashCardUtils from "../Utils";
import { ViolinFingerboard } from "../../Utils/ViolinFingerboard";
import { standardViolinTuning } from "../../Utils/StringedInstrumentTuning";
import { FlashCard, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { StringedInstrumentNote } from '../../../lib/TheoryLib/StringedInstrumentNote';
import {
  IConfigData,
  StringedInstrumentNotesFlashCardMultiSelect,
  configDataToEnabledFlashCardIds,
  createFlashCards as baseCreateFlashCards
} from '../../Utils/StringedInstrumentNotes';

const flashCardSetId = "violinNotes";

const violinTuning = standardViolinTuning;

const MAX_MAX_FRET_NUMBER = 13;

function createFlashCardSet(notes?: Array<StringedInstrumentNote>): FlashCardSet {
  const renderFlashCardMultiSelect = (
    studySessionInfo: FlashCardStudySessionInfo,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return <StringedInstrumentNotesFlashCardMultiSelect
      tuning={violinTuning}
      maxMaxFretNumber={MAX_MAX_FRET_NUMBER}
      studySessionInfo={studySessionInfo}
      onChange={onChange}
    />;
  };

  const flashCardSet = new FlashCardSet(flashCardSetId, "Violin Notes", () => createFlashCards(notes));
  flashCardSet.configDataToEnabledFlashCardIds = (
    flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
  ) => configDataToEnabledFlashCardIds(violinTuning, MAX_MAX_FRET_NUMBER, undefined, flashCardSet, flashCards, configData);
  flashCardSet.getInitialConfigData = (): IConfigData => ({
    maxFret: MAX_MAX_FRET_NUMBER
  });
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderNoteAnswerSelect;
  //flashCardSet.moreInfoUri = "https://medium.com/@aslushnikov/memorizing-fretboard-a9f4f28dbf03";
  flashCardSet.containerHeight = "160px";

  return flashCardSet;
}

export function createFlashCards(notes?: Array<StringedInstrumentNote>): FlashCard[] {
  const size = new Size2D(500, 140);
  const style: any = { width: "100%", maxWidth: `${size.width}px` };

  return baseCreateFlashCards(
    flashCardSetId, violinTuning, MAX_MAX_FRET_NUMBER,
    (tuning, maxMaxFretNumber, note) => (
      <ViolinFingerboard
        width={size.width} height={size.height}
        tuning={tuning}
        fretCount={maxMaxFretNumber}
        pressedNotes={[note]}
        style={style}
      />
    )
  );
}

export const flashCardSet = createFlashCardSet();