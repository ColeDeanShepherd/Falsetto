import * as React from "react";

import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { GuitarFretboard} from "../../Utils/GuitarFretboard";
import { standard6StringGuitarTuning } from "../../Utils/StringedInstrumentTuning";
import { FlashCard, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { StringedInstrumentNote } from '../../../GuitarNote';
import {
  IConfigData,
  StringedInstrumentNotesFlashCardMultiSelect,
  configDataToEnabledFlashCardIds
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
  guitarNotes = !guitarNotes
    ? Utils.flattenArrays(Utils.range(0, guitarTuning.stringCount - 1)
    .map(stringIndex => Utils.range(0, MAX_MAX_FRET_NUMBER)
      .map(fretNumber => {
        return guitarTuning.getNote(
          stringIndex, fretNumber
        );
      })
    ))
    : guitarNotes;
  
  const guitarStyle: any = { width: "400px", maxWidth: "100%" };

  return guitarNotes
    .map(guitarNote => {
      const deserializedId = {
        set: flashCardSetId,
        tuning: guitarTuning.openStringPitches.map(p => p.toString(true, false)),
        stringIndex: guitarNote.stringIndex,
        fretNumber: guitarNote.getFretNumber(guitarTuning)
      };
      const id = JSON.stringify(deserializedId);

      return FlashCard.fromRenderFns(
        id,
        (width, height) => {
          return (
            <GuitarFretboard
              width={400} height={140}
              tuning={guitarTuning}
              pressedNotes={[guitarNote]}
              style={guitarStyle}
            />
          );
        },
        guitarNote.pitch.toOneAccidentalAmbiguousString(false, true)
      );
    });
}