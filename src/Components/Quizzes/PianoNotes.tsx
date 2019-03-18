import * as React from "react";

import * as FlashCardUtils from "./Utils";
import { PianoKeyboard } from "../PianoKeyboard";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from "../../FlashCardGroup";
import { AnswerDifficulty } from "../../StudyAlgorithm";
import { Pitch } from "../../Pitch";
import { PitchLetter } from "../../PitchLetter";

const notes = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();

  const group = new FlashCardGroup("Piano Notes", flashCards);
  group.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/the-basics/overview/";
  group.renderAnswerSelect = renderAnswerSelect;

  return group;
}
export function createFlashCards(): FlashCard[] {
  return notes
    .map((_, i) => FlashCard.fromRenderFns(
      () => (
        <PianoKeyboard
          width={200} height={100}
          lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
          highestPitch={new Pitch(PitchLetter.B, 0, 4)}
          pressedPitches={[Pitch.createFromMidiNumber((new Pitch(PitchLetter.C, 0, 4)).midiNumber + i)]}
        />
      ),
      notes[i]
    ));
}
export function renderAnswerSelect(
  width: number, height: number,
  flashCards: FlashCard[],
  enabledFlashCardIndices: number[],
  areFlashCardsInverted: boolean,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
) {
  return (
    <div>
      {!areFlashCardsInverted ? FlashCardUtils.renderNoteAnswerSelect(width, height, flashCards, enabledFlashCardIndices, areFlashCardsInverted, flashCard, onAnswer) : null}
      {areFlashCardsInverted ? FlashCardUtils.renderDistinctFlashCardSideAnswerSelect(width, height, flashCards, enabledFlashCardIndices, areFlashCardsInverted, flashCard, onAnswer) : null}
    </div>
  );
}