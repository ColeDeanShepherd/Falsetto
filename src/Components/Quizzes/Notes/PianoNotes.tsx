import * as React from "react";

import { Vector2D } from '../../../Vector2D';
import { Size2D } from "../../../Size2D";
import { Rect2D } from '../../../Rect2D';
import * as FlashCardUtils from "../Utils";
import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { FlashCard, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, RenderAnswerSelectArgs, FlashCardLevel } from "../../../FlashCardSet";
import { Pitch } from "../../../Pitch";
import { PitchLetter } from "../../../PitchLetter";

const flashCardSetId = "pianoNotesOneOctave";

const notes = ["C", "C#/D♭", "D", "D#/E♭", "E", "F", "F#/G♭", "G", "G#/A♭", "A", "A#/B♭", "B"];

export function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Piano Notes", createFlashCards);
  flashCardSet.containerHeight = "120px";
  flashCardSet.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/the-basics/overview/";
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.createFlashCardLevels = (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => (
    [
      new FlashCardLevel(
        "Natural Notes",
        flashCards
          .map<[FlashCard, number]>((fc, i) => [fc, i])
          .filter(t => (t[0].backSide.data as string).length === 1)
          .map(t => t[1])
      )
    ]
  );

  return flashCardSet;
}
export function createFlashCards(): FlashCard[] {
  return notes
    .map((_, i) => {
      const pitch = Pitch.createFromMidiNumber((new Pitch(PitchLetter.C, 0, 4)).midiNumber + i);
      const deserializedId = {
        set: flashCardSetId,
        midiNumberNoOctave: pitch.midiNumberNoOctave
      };
      const id = JSON.stringify(deserializedId);

      return new FlashCard(
        id,
        new FlashCardSide(
          () => (
            <PianoKeyboard
              rect={new Rect2D(new Size2D(200, 100), new Vector2D(0, 0))}
              lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
              highestPitch={new Pitch(PitchLetter.B, 0, 4)}
              pressedPitches={[pitch]}
            />
          )
        ),
        new FlashCardSide(
          notes[i],
          notes[i]
        )
      );
    }
  );
}
export function renderAnswerSelect(
  state: RenderAnswerSelectArgs
) {
  return (
    <div>
      {!state.areFlashCardsInverted ? FlashCardUtils.renderNoteAnswerSelect(state) : null}
      {state.areFlashCardsInverted ? FlashCardUtils.renderDistinctFlashCardSideAnswerSelect(state) : null}
    </div>
  );
}