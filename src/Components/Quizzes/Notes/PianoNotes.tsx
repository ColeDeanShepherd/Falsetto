import * as React from "react";

import { Vector2D } from '../../../lib/Core/Vector2D';
import { Size2D } from "../../../lib/Core/Size2D";
import { Rect2D } from '../../../lib/Core/Rect2D';
import * as FlashCardUtils from "../Utils";
import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { FlashCard, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardLevel } from "../../../FlashCardSet";
import { Pitch, getPitchRange } from "../../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";

const flashCardSetId = "pianoNotes1Octave";

const minPitch = new Pitch(PitchLetter.C, 0, 4);
const maxPitch = new Pitch(PitchLetter.B, 0, 4);
const pitches = getPitchRange(minPitch, maxPitch);

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Piano Notes", createFlashCards);
  flashCardSet.containerHeight = "120px";
  flashCardSet.moreInfoUri = "/essential-music-theory/notes";
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderNoteAnswerSelect;
  flashCardSet.createFlashCardLevels = (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => (
    [
      new FlashCardLevel(
        "Natural Notes",
        flashCards
          .filter(fc => (fc.backSide.data as Pitch).isNatural)
          .map(fc => fc.id),
        (curConfigData: any) => null
      ),
      new FlashCardLevel(
        "All Notes",
        flashCards.map(fc => fc.id),
        (curConfigData: any) => null
      )
    ]
  );

  return flashCardSet;
}

function createFlashCards(): FlashCard[] {
  const pianoKeyboardRect = new Rect2D(new Size2D(200, 100), new Vector2D(0, 0));
  const pianoStyle = { width: "100%", maxWidth: "200px" };

  return pitches
    .map((pitch, i) => {
      const deserializedId = {
        set: flashCardSetId,
        note: pitch.toOneAccidentalAmbiguousString(false, false)
      };
      const id = JSON.stringify(deserializedId);

      const pitchString = pitch.toOneAccidentalAmbiguousString(false, true);

      return new FlashCard(
        id,
        new FlashCardSide(
          () => (
            <PianoKeyboard
              rect={pianoKeyboardRect}
              lowestPitch={minPitch}
              highestPitch={maxPitch}
              pressedPitches={[pitch]}
              style={pianoStyle}
            />
          )
        ),
        new FlashCardSide(
          pitchString,
          pitch
        )
      );
    }
  );
}

export const flashCardSet = createFlashCardSet();