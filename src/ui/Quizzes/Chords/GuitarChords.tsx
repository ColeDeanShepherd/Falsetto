import * as React from "react";

import { FlashCard, FlashCardSide, createFlashCardId } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";
import { getStandardGuitarTuning, StringedInstrumentTuning } from '../../Utils/StringedInstrumentTuning';
import { StringedInstrumentNote } from "../../../lib/TheoryLib/StringedInstrumentNote";
import { GuitarFretboard, renderGuitarNoteHighlightsAndLabels } from "../../Utils/GuitarFretboard";
import { renderDistinctFlashCardSideAnswerSelect } from "../Utils";

const flashCardSetId = "guitarChords";
const guitarTuning: StringedInstrumentTuning = getStandardGuitarTuning(/*stringCount*/ 6);

function createFlashCardSet() {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Guitar Chords", createFlashCards);
  flashCardSet.renderAnswerSelect = renderDistinctFlashCardSideAnswerSelect;
  return flashCardSet;
}

const flashCardsData = [
  {
    frontSide: {
      lowestNote: guitarTuning.getNote(/*stringIndex*/1, /*fretNumber*/3),
      higherStringFretOffsets: [-1, -3, -2, -3]
    },
    backSide: "Open C Major"
  },
  {
    frontSide: {
      lowestNote: guitarTuning.getNote(/*stringIndex*/1, /*fretNumber*/0),
      higherStringFretOffsets: [2, 2, 2, 0]
    },
    backSide: "Open A Major"
  },
  {
    frontSide: {
      lowestNote: guitarTuning.getNote(/*stringIndex*/1, /*fretNumber*/0),
      higherStringFretOffsets: [2, 2, 1, 0]
    },
    backSide: "Open A Minor"
  },
  {
    frontSide: {
      lowestNote: guitarTuning.getNote(/*stringIndex*/0, /*fretNumber*/3),
      higherStringFretOffsets: [-1, -3, -3, -3, 0]
    },
    backSide: "Open G Major"
  },
  {
    frontSide: {
      lowestNote: guitarTuning.getNote(/*stringIndex*/0, /*fretNumber*/0),
      higherStringFretOffsets: [2, 2, 1, 0, 0]
    },
    backSide: "Open E Major"
  },
  {
    frontSide: {
      lowestNote: guitarTuning.getNote(/*stringIndex*/0, /*fretNumber*/0),
      higherStringFretOffsets: [2, 2, 0, 0, 0]
    },
    backSide: "Open E Minor"
  },
  {
    frontSide: {
      lowestNote: guitarTuning.getNote(/*stringIndex*/2, /*fretNumber*/0),
      higherStringFretOffsets: [2, 3, 2]
    },
    backSide: "Open D Major"
  },
  {
    frontSide: {
      lowestNote: guitarTuning.getNote(/*stringIndex*/2, /*fretNumber*/0),
      higherStringFretOffsets: [2, 3, 1]
    },
    backSide: "Open D Minor"
  },
  {
    frontSide: {
      lowestNote: guitarTuning.getNote(/*stringIndex*/0, /*fretNumber*/5),
      higherStringFretOffsets: [2, 2, 1, 0, 0]
    },
    backSide: "Barred A Major"
  },
  {
    frontSide: {
      lowestNote: guitarTuning.getNote(/*stringIndex*/0, /*fretNumber*/5),
      higherStringFretOffsets: [2, 2, 0, 0, 0]
    },
    backSide: "Barred A Minor"
  },
  {
    frontSide: {
      lowestNote: guitarTuning.getNote(/*stringIndex*/0, /*fretNumber*/5),
      higherStringFretOffsets: [2, 0, 1, 0, 0]
    },
    backSide: "Barred A7"
  },
  {
    frontSide: {
      lowestNote: guitarTuning.getNote(/*stringIndex*/0, /*fretNumber*/5),
      higherStringFretOffsets: [2, 0, 0, 0, 0]
    },
    backSide: "Barred Am7"
  },
  {
    frontSide: {
      lowestNote: guitarTuning.getNote(/*stringIndex*/0, /*fretNumber*/5),
      higherStringFretOffsets: [1, 0, 0, undefined, undefined]
    },
    backSide: "Barred Am7b5"
  },
  {
    frontSide: {
      lowestNote: guitarTuning.getNote(/*stringIndex*/1, /*fretNumber*/5),
      higherStringFretOffsets: [2, 2, 2, 0]
    },
    backSide: "Barred D Major"
  },
  {
    frontSide: {
      lowestNote: guitarTuning.getNote(/*stringIndex*/1, /*fretNumber*/5),
      higherStringFretOffsets: [2, 2, 1, 0]
    },
    backSide: "Barred D Minor"
  },
  {
    frontSide: {
      lowestNote: guitarTuning.getNote(/*stringIndex*/1, /*fretNumber*/5),
      higherStringFretOffsets: [2, 0, 2, 0]
    },
    backSide: "Barred D7"
  },
  {
    frontSide: {
      lowestNote: guitarTuning.getNote(/*stringIndex*/1, /*fretNumber*/5),
      higherStringFretOffsets: [2, 0, 1, 0]
    },
    backSide: "Barred Dm7"
  },
  {
    frontSide: {
      lowestNote: guitarTuning.getNote(/*stringIndex*/1, /*fretNumber*/5),
      higherStringFretOffsets: [1, 0, 1]
    },
    backSide: "Barred Dm7b5"
  },
  {
    frontSide: {
      lowestNote: guitarTuning.getNote(/*stringIndex*/2, /*fretNumber*/5),
      higherStringFretOffsets: [2, 3, 2]
    },
    backSide: "G Major"
  },
  {
    frontSide: {
      lowestNote: guitarTuning.getNote(/*stringIndex*/2, /*fretNumber*/5),
      higherStringFretOffsets: [2, 3, 1]
    },
    backSide: "G Minor"
  },
  {
    frontSide: {
      lowestNote: guitarTuning.getNote(/*stringIndex*/2, /*fretNumber*/5),
      higherStringFretOffsets: [2, 1, 2]
    },
    backSide: "G7"
  },
  {
    frontSide: {
      lowestNote: guitarTuning.getNote(/*stringIndex*/2, /*fretNumber*/5),
      higherStringFretOffsets: [2, 1, 1]
    },
    backSide: "Gm7"
  },
];

function getGuitarNotes(
  lowestNote: StringedInstrumentNote,
  higherStringFretOffsets: Array<number | undefined>
): Array<StringedInstrumentNote> {
  return [lowestNote]
    .concat(
      higherStringFretOffsets
        .map((x, i) => (x !== undefined)
          ? guitarTuning.getNote(lowestNote.stringIndex + 1 + i, lowestNote.getFretNumber(guitarTuning) + x)
          : undefined)
        .filter(x => x !== undefined)
        .map(x => x as StringedInstrumentNote)
      );
}

export function createFlashCards(): FlashCard[] {
  const guitarStyle = { width: "100%", maxWidth: "400px" };

  return flashCardsData
    .map((d, i) => new FlashCard(
      createFlashCardId(flashCardSetId, i + '.' + d.backSide),
      new FlashCardSide(
        size => (
          <GuitarFretboard
            width={400} height={140}
            tuning={guitarTuning}
            minFretNumber={0} fretCount={11}
            renderExtrasFn={metrics => renderGuitarNoteHighlightsAndLabels(
              metrics,
              getGuitarNotes(d.frontSide.lowestNote, d.frontSide.higherStringFretOffsets),
              "lightblue",
              (n, i) => ""
            )}
            style={guitarStyle}
          />
        ),
        d.frontSide
      ),
      new FlashCardSide(d.backSide, d.backSide)
    ));
}

export const flashCardSet = createFlashCardSet();