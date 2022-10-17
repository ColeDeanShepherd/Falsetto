import * as React from "react";

import { FlashCard, FlashCardSide, createFlashCardId } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";
import { getStandardGuitarTuning, StringedInstrumentTuning } from '../../../lib/TheoryLib/StringedInstrumentTuning';
import { StringedInstrumentNote } from "../../../lib/TheoryLib/StringedInstrumentNote";
import { GuitarFretboard, renderGuitarNoteHighlightsAndLabels } from "../../Utils/GuitarFretboard";
import { renderDistinctFlashCardSideAnswerSelect } from "../Utils";

const flashCardSetId = "guitarChords";
const guitarTuning: StringedInstrumentTuning = getStandardGuitarTuning(/*stringCount*/ 6);
const guitarStyle = { width: "100%", maxWidth: "400px" };

const flashCardsData = [
  { frontSide: [undefined, 3, 2, 0, 1, 0], backSide: "Open C Major" }, 
  { frontSide: [undefined, 0, 2, 2, 2, 0], backSide: "Open A Major" }, 
  { frontSide: [undefined, 0, 2, 2, 1, 0], backSide: "Open A Minor" }, 
  { frontSide: [3, 2, 0, 0, 0, 3], backSide: "Open G Major" }, 
  { frontSide: [0, 2, 2, 1, 0, 0], backSide: "Open E Major" }, 
  { frontSide: [0, 2, 2, 0, 0, 0], backSide: "Open E Minor" }, 
  { frontSide: [undefined, undefined, 0, 2, 3, 2], backSide: "Open D Major" }, 
  { frontSide: [undefined, undefined, 0, 2, 3, 1], backSide: "Open D Minor" }, 
  { frontSide: [5, 7, 7, 6, 5, 5], backSide: "Barred A Major" }, 
  { frontSide: [5, 7, 7, 5, 5, 5], backSide: "Barred A Minor" }, 
  { frontSide: [5, 7, 5, 6, 5, 5], backSide: "Barred A7" }, 
  { frontSide: [5, 7, 5, 5, 5, 5], backSide: "Barred Am7" }, 
  { frontSide: [5, 6, 5, 5, undefined, undefined], backSide: "Barred Am7b5" }, 
  { frontSide: [undefined, 5, 7, 7, 7, 5], backSide: "Barred D Major" }, 
  { frontSide: [undefined, 5, 7, 7, 6, 5], backSide: "Barred D Minor" }, 
  { frontSide: [undefined, 5, 7, 5, 7, 5], backSide: "Barred D7" }, 
  { frontSide: [undefined, 5, 7, 5, 6, 5], backSide: "Barred Dm7" }, 
  { frontSide: [undefined, 5, 6, 5, 6, undefined], backSide: "Barred Dm7b5" }, 
  { frontSide: [undefined, undefined, 5, 7, 8, 7], backSide: "G Major" }, 
  { frontSide: [undefined, undefined, 5, 7, 8, 6], backSide: "G Minor" }, 
  { frontSide: [undefined, undefined, 5, 7, 6, 7], backSide: "G7" }, 
  { frontSide: [undefined, undefined, 5, 7, 6, 6], backSide: "Gm7" }
];

function createFlashCardSet() {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Guitar Chords", createFlashCards);
  flashCardSet.renderAnswerSelect = renderDistinctFlashCardSideAnswerSelect;
  return flashCardSet;
}

const getGuitarNotes = (fretNumbers: Array<number | undefined>): Array<StringedInstrumentNote> =>
  fretNumbers
    .map((n, i) => (n !== undefined)
      ? guitarTuning.getNote(i, n)
      : undefined)
    .filter(x => x !== undefined)
    .map(x => x as StringedInstrumentNote);

export const createFlashCards = (): FlashCard[] =>
  flashCardsData
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
              getGuitarNotes(d.frontSide),
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

export const flashCardSet = createFlashCardSet();