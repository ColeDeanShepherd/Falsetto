import * as React from "react";

import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { FlashCard, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardLevel, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { Pitch, getPitchRange } from "../../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";
import { PianoKeysAnswerSelect } from '../../Utils/PianoKeysAnswerSelect';

const flashCardSetId = "pianoNotes1Octave";

const lowestPitch = new Pitch(PitchLetter.C, 0, 4);
const highestPitch = new Pitch(PitchLetter.B, 0, 4);

export const allPitches = getPitchRange(lowestPitch, highestPitch);
export const naturalPitches = allPitches
  .filter(p => p.isNatural);
export const accidentalPitches = allPitches
  .filter(p => !p.isNatural);

const pianoMaxWidth = 200;

function renderAnswerSelect(
  info: FlashCardStudySessionInfo
) {
  const correctAnswer = [info.currentFlashCard.frontSide.data as Pitch];
  
  return <PianoKeysAnswerSelect
    maxWidth={pianoMaxWidth} lowestPitch={lowestPitch} highestPitch={highestPitch}
    correctAnswer={correctAnswer}
    onAnswer={info.onAnswer} lastCorrectAnswer={info.lastCorrectAnswer}
    incorrectAnswers={info.incorrectAnswers} instantConfirm={true} wrapOctave={true} />;
}

export function createFlashCardSet(pitches?: Array<Pitch>): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Piano Notes", () => createFlashCards(pitches));
  flashCardSet.moreInfoUri = "/essential-music-theory/notes";
  flashCardSet.renderAnswerSelect = renderAnswerSelect;

  // Don't create levels if we specified which set of pitches to use.
  if (!pitches) {
    flashCardSet.createFlashCardLevels = (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => (
      [
        new FlashCardLevel(
          "Natural Notes",
          flashCards
            .filter(fc => (fc.frontSide.data as Pitch).isNatural)
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
  }

  return flashCardSet;
}

function createFlashCards(pitches?: Array<Pitch>): FlashCard[] {
  return (pitches ? pitches : allPitches)
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
          `Press ${pitchString}`,
          pitch
        ),
        new FlashCardSide(
          () => (
            <PianoKeyboard
              maxWidth={pianoMaxWidth}
              lowestPitch={lowestPitch}
              highestPitch={highestPitch}
              pressedPitches={[pitch]}
            />
          )
        )
      );
    }
  );
}

export const flashCardSet = createFlashCardSet();