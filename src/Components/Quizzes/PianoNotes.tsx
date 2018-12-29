import * as React from 'react';

import * as FlashCardUtils from "./Utils";
import { PianoKeyboard } from '../PianoKeyboard';
import { FlashCard } from 'src/FlashCard';
import { FlashCardGroup } from 'src/FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();

  const group = new FlashCardGroup("Piano Notes", flashCards);
  group.renderAnswerSelect = FlashCardUtils.renderNoteAnswerSelect;

  return group;
}
export function createFlashCards(): FlashCard[] {
  const notes = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];
  return notes
    .map((note, i) => new FlashCard(
      () => (
        <PianoKeyboard
          width={200} height={100}
          noteIndex={i}
        />
      ),
      notes[i]
    ));
}