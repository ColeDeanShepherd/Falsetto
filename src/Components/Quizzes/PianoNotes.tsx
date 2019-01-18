import * as React from 'react';

import * as FlashCardUtils from "./Utils";
import { PianoKeyboard } from '../PianoKeyboard';
import { FlashCard } from 'src/FlashCard';
import { FlashCardGroup } from 'src/FlashCardGroup';
import { AnswerDifficulty } from 'src/StudyAlgorithm';

const notes = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();

  const group = new FlashCardGroup("Piano Notes", flashCards);
  group.renderAnswerSelect = renderAnswerSelect;

  return group;
}
export function createFlashCards(): FlashCard[] {
  return notes
    .map((_, i) => new FlashCard(
      () => (
        <PianoKeyboard
          width={200} height={100}
          noteIndex={i}
        />
      ),
      notes[i]
    ));
}
export function renderAnswerSelect(
  flashCards: FlashCard[],
  areFlashCardsInverted: boolean,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
) {
  return (
    <div>
      {!areFlashCardsInverted ? FlashCardUtils.renderNoteAnswerSelect(flashCards, areFlashCardsInverted, flashCard, onAnswer) : null}
      {areFlashCardsInverted ? FlashCardUtils.renderDistinctFlashCardSideAnswerSelect(flashCards, areFlashCardsInverted, flashCard, onAnswer) : null}
    </div>
  );
}