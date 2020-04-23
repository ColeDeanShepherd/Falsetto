import * as React from "react";

import { Vector2D } from '../../../lib/Core/Vector2D';
import { Size2D } from "../../../lib/Core/Size2D";
import { Rect2D } from '../../../lib/Core/Rect2D';
import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { FlashCard, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { Pitch } from "../../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";
import { getPianoKeyboardAspectRatio } from '../../Utils/PianoUtils';
import { PianoKeysAnswerSelect } from "../../Utils/PianoKeysAnswerSelect";
import { Scale } from "../../../lib/TheoryLib/Scale";
import { getRomanNumerals } from "../../../lib/Core/Utils";

function getFlashCardSetId(scale: Scale, numChordPitches: number): string {
  return `${scale.id}${numChordPitches}NoteDiatonicChords`;
}

const pianoLowestPitch = new Pitch(PitchLetter.C, 0, 4);
const pianoHighestPitch = new Pitch(PitchLetter.B, 0, 5);

const pianoAspectRatio = getPianoKeyboardAspectRatio(/*octaveCount*/ 2);
const pianoMaxWidth = 300;
const pianoStyle = { width: `${pianoMaxWidth}px`, maxWidth: "100%", height: "auto" };

export function createFlashCardSet(scale: Scale, numChordPitches: number): FlashCardSet {
  const flashCardSetId = getFlashCardSetId(scale, numChordPitches);
  const flashCardSet = new FlashCardSet(
    flashCardSetId,
    `${scale.rootPitch.toString(/*includeOctaveNumber*/ false)} ${scale.type.name} ${numChordPitches}-Note Diatonic Chords`,
    () => createFlashCards(flashCardSetId, scale, numChordPitches));
  flashCardSet.route = `scale/${encodeURIComponent(scale.id)}/diatonic-${numChordPitches}-note-chords-exercise`;
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.containerHeight = `${150}px`;

  return flashCardSet;
}

export function createFlashCards(flashCardSetId: string, scale: Scale, numChordPitches: number): FlashCard[] {
  const diatonicChords = scale.getDiatonicChords(numChordPitches);

  return diatonicChords
    .map((chord, i) => {
      const deserializedId = {
        set: flashCardSetId,
        chord: `${chord.rootPitch.toString(false)} ${chord.type.name}`
      };
      const id = JSON.stringify(deserializedId);

      const romanNumerals = getRomanNumerals(1 + i);

      const pitches = chord.getPitches();

      return new FlashCard(
        id,

        new FlashCardSide(
          romanNumerals,
          pitches
        ),

        new FlashCardSide(
          size => {
            return (
              <PianoKeyboard
                rect={new Rect2D(new Size2D(pianoAspectRatio * 100, 100), new Vector2D(0, 0))}
                lowestPitch={pianoLowestPitch}
                highestPitch={pianoHighestPitch}
                pressedPitches={pitches}
                style={pianoStyle}
              />
            );
          },
          chord
        )
      );
    });
}

export function renderAnswerSelect(
  info: FlashCardStudySessionInfo
) {
  const correctAnswer = info.currentFlashCard.frontSide.data as Array<Pitch>;

  return <PianoKeysAnswerSelect
    aspectRatio={pianoAspectRatio} maxWidth={pianoMaxWidth} lowestPitch={pianoLowestPitch} highestPitch={pianoHighestPitch}
    correctAnswer={correctAnswer}
    onAnswer={info.onAnswer} lastCorrectAnswer={info.lastCorrectAnswer}
    incorrectAnswers={info.incorrectAnswers} instantConfirm={false} wrapOctave={true} />;
}