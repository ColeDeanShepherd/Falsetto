import * as React from "react";

import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { GuitarFretboard} from "../../Utils/GuitarFretboard";
import { standard6StringGuitarTuning } from "../../Utils/StringedInstrumentTuning";
import { FlashCard, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { StringedInstrumentNote } from '../../../StringedInstrumentNote';
import {
  IConfigData,
  StringedInstrumentNotesFlashCardMultiSelect,
  configDataToEnabledFlashCardIds,
  createFlashCards as baseCreateFlashCards
} from '../../Utils/StringedInstrumentNotes';

const flashCardSetId = "guitarNotes";
const guitarTuning = standard6StringGuitarTuning;
const MAX_MAX_FRET_NUMBER = 11;

export function createFlashCardSet(guitarNotes?: Array<StringedInstrumentNote>): FlashCardSet {
  const renderFlashCardMultiSelect = (
    studySessionInfo: FlashCardStudySessionInfo,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return <StringedInstrumentNotesFlashCardMultiSelect
      tuning={guitarTuning}
      maxMaxFretNumber={MAX_MAX_FRET_NUMBER}
      studySessionInfo={studySessionInfo}
      onChange={onChange}
    />;
  };

  const initialConfigData: IConfigData = {
    maxFret: MAX_MAX_FRET_NUMBER
  };

  const flashCardSet = new FlashCardSet(flashCardSetId, "Guitar Notes", () => createFlashCards(guitarNotes));
  flashCardSet.configDataToEnabledFlashCardIds = (
    flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
  ) => configDataToEnabledFlashCardIds(guitarTuning, MAX_MAX_FRET_NUMBER, flashCardSet, flashCards, configData);
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderNoteAnswerSelect;
  flashCardSet.moreInfoUri = "/learn-guitar-notes-in-10-steps";
  flashCardSet.containerHeight = "120px";

  return flashCardSet;
}

export function createFlashCards(guitarNotes?: Array<StringedInstrumentNote>): FlashCard[] {
  const guitarStyle: any = { width: "400px", maxWidth: "100%" };

  return baseCreateFlashCards(
    flashCardSetId, guitarTuning, MAX_MAX_FRET_NUMBER,
    (tuning, maxMaxFretNumber, note) => (
      <GuitarFretboard
        width={400} height={140}
        tuning={tuning}
        fretCount={maxMaxFretNumber}
        pressedNotes={[note]}
        style={guitarStyle}
      />
    )
  );
}