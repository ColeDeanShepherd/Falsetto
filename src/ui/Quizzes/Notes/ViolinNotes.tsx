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
  createFlashCards as baseCreateFlashCards,
  getNoteFlashCardId
} from '../../Utils/StringedInstrumentNotes';
import { AnswerDifficulty } from "../../../Study/AnswerDifficulty";
import { renderStringedInstrumentNoteInputs } from "../../Utils/StringedInstrumentUtils";
import { arrayContains } from "../../../lib/Core/ArrayUtils";

const flashCardSetId = "violinNotes";

const violinTuning = standardViolinTuning;

const size = new Size2D(500, 140);
const violinStyle: any = { width: "100%", maxWidth: `${size.width}px` };

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
    maxFret: MAX_MAX_FRET_NUMBER,
    enabledStringIndexes: new Set<number>(violinTuning.openStringPitches.map((_, i) => i))
  });
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;

  flashCardSet.renderAnswerSelect = (info: FlashCardStudySessionInfo) => {
    const { currentFlashCard } = info;

    const configData = (info.configData as IConfigData);

    // TODO: violin notes
    return (
      <ViolinFingerboard
        width={400} height={140}
        tuning={violinTuning}
        fretCount={configData.maxFret}
        renderExtrasFn={metrics => renderStringedInstrumentNoteInputs(
          metrics,
          violinTuning,
          note => arrayContains(info.enabledFlashCardIds, getNoteFlashCardId(flashCardSetId, violinTuning, note)),
          [],
          note => {
            const correctNote = currentFlashCard.backSide.data as StringedInstrumentNote;
            const isCorrect = note.equals(correctNote);

            info.onAnswer(isCorrect ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect, note)
          })}
        style={violinStyle}
      />
    );
  };

  //flashCardSet.moreInfoUri = "https://medium.com/@aslushnikov/memorizing-fretboard-a9f4f28dbf03";
  flashCardSet.containerHeight = "160px";

  return flashCardSet;
}

export function createFlashCards(notes?: Array<StringedInstrumentNote>): FlashCard[] {

  return baseCreateFlashCards(
    flashCardSetId, violinTuning, MAX_MAX_FRET_NUMBER,
    (tuning, maxMaxFretNumber, note) => (
      <ViolinFingerboard
        width={size.width} height={size.height}
        tuning={tuning}
        fretCount={maxMaxFretNumber}
        pressedNotes={[note]}
        style={violinStyle}
      />
    )
  );
}

export const flashCardSet = createFlashCardSet();