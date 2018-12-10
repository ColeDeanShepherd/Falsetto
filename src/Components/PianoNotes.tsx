import * as React from 'react';

import { PianoKeyboard } from './PianoKeyboard';
import { FlashCard } from 'src/FlashCard';

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