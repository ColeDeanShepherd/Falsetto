import * as React from "react";

import { GuitarFretboard } from "../../Utils/GuitarFretboard";
import { standard6StringGuitarTuning } from "../../Utils/StringedInstrumentTuning";
import { FlashCard, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo, FlashCardLevel } from "../../../FlashCardSet";
import { StringedInstrumentNote } from '../../../lib/TheoryLib/StringedInstrumentNote';
import {
  IConfigData,
  StringedInstrumentNotesFlashCardMultiSelect,
  configDataToEnabledFlashCardIds,
  createFlashCards as baseCreateFlashCards
} from '../../Utils/StringedInstrumentNotes';
import { levelsNotes } from '../../Lessons/GuitarNotesLesson';
import { AnswerDifficulty } from "../../../Study/AnswerDifficulty";
import { renderStringedInstrumentNoteInputs } from '../../Utils/StringedInstrumentUtils';
import { arrayContains } from '../../../lib/Core/ArrayUtils';
import { getNoteFlashCardId } from '../../Utils/StringedInstrumentNotes';

const flashCardSetId = "guitarNotes";
const guitarTuning = standard6StringGuitarTuning;
const MAX_MAX_FRET_NUMBER = 11;

const guitarStyle: any = { width: "400px", maxWidth: "100%" };

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

  const flashCardSet = new FlashCardSet(flashCardSetId, "Guitar Notes", () => createFlashCards(guitarNotes));
  flashCardSet.configDataToEnabledFlashCardIds = (
    flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
  ) => configDataToEnabledFlashCardIds(guitarTuning, MAX_MAX_FRET_NUMBER, guitarNotes, flashCardSet, flashCards, configData);
  flashCardSet.getInitialConfigData = (): IConfigData => ({
    maxFret: MAX_MAX_FRET_NUMBER,
    enabledStringIndexes: new Set<number>(guitarTuning.openStringPitches.map((_, i) => i))
  });
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = (info: FlashCardStudySessionInfo) => {
    const { currentFlashCard } = info;

    const configData = (info.configData as IConfigData);

    // TODO: violin notes
    return (
      <GuitarFretboard
        width={400} height={140}
        tuning={guitarTuning}
        fretCount={configData.maxFret}
        renderExtrasFn={metrics => renderStringedInstrumentNoteInputs(
          metrics,
          guitarTuning,
          note => arrayContains(info.enabledFlashCardIds, getNoteFlashCardId(flashCardSetId, guitarTuning, note)),
          [],
          note => {
            const correctNote = currentFlashCard.backSide.data as StringedInstrumentNote;
            const isCorrect = note.equals(correctNote);

            info.onAnswer(isCorrect ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect, note)
          })}
        style={guitarStyle}
      />
    );
  };
  
  flashCardSet.moreInfoUri = "/learn-guitar-notes-in-10-steps";

  if (!guitarNotes) {
    flashCardSet.createFlashCardLevels = (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => (
      levelsNotes
        .map(levelNotes => new FlashCardLevel(
          "",
          flashCards
            .filter(fc => {
              const note = fc.backSide.data as StringedInstrumentNote;
              return levelNotes.some(n => n.equals(note));
            })
            .map(fc => fc.id),
          (curConfigData: IConfigData) => (
            {
              maxFret: curConfigData.maxFret,
              enabledStringIndexes: new Set<number>(guitarTuning.openStringPitches.map((_, i) => i))
            } as IConfigData
          )
        ))
        .concat([
          new FlashCardLevel(
          "All Notes",
          flashCards.map(fc => fc.id),
          (curConfigData: IConfigData) => (
            {
              maxFret: MAX_MAX_FRET_NUMBER,
              enabledStringIndexes: new Set<number>(guitarTuning.openStringPitches.map((_, i) => i))
            } as IConfigData
          ))
        ])
    );
  }

  return flashCardSet;
}

export function createFlashCards(guitarNotes?: Array<StringedInstrumentNote>): FlashCard[] {
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
    ), guitarNotes
  );
}

export const flashCardSet = createFlashCardSet();