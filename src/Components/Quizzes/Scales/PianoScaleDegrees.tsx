import * as React from "react";

import { Vector2D } from '../../../lib/Core/Vector2D';
import { Size2D } from "../../../lib/Core/Size2D";
import { Rect2D } from '../../../lib/Core/Rect2D';
import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { FlashCard, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";

import { Pitch, tryWrapPitchOctave } from '../../../lib/TheoryLib/Pitch';
import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";
import { Scale, getUriComponent } from '../../../lib/TheoryLib/Scale';

import { PianoKeysAnswerSelect } from '../../Utils/PianoKeysAnswerSelect';
import { getPianoKeyboardAspectRatio } from '../../Utils/PianoUtils';
import { unwrapValueOrUndefined } from '../../../lib/Core/Utils';

function getFlashCardSetId(scale: Scale): string {
  return `${scale.id}ScaleDegrees`;
}

const octaveNumber = 4;
const lowestPitch = new Pitch(PitchLetter.C, 0, octaveNumber);
const highestPitch = new Pitch(PitchLetter.B, 0, octaveNumber);

const pianoKeyboardAspectRatio = getPianoKeyboardAspectRatio(/*octaveCount*/ 1);
const pianoKeyboardRect = new Rect2D(new Size2D(pianoKeyboardAspectRatio * 100, 100), new Vector2D(0, 0));
const pianoMaxWidth = 200;
const pianoStyle = { width: "100%", maxWidth: `${pianoMaxWidth}px`, height: "auto" };

function renderAnswerSelect(
  info: FlashCardStudySessionInfo
) {
  const key = info.flashCards.indexOf(info.currentFlashCard);
  const correctAnswer = [(info.currentFlashCard.frontSide.data as Pitch)];
  
  return <PianoKeysAnswerSelect
    key={key} aspectRatio={pianoKeyboardAspectRatio} maxWidth={pianoMaxWidth} lowestPitch={lowestPitch} highestPitch={highestPitch}
    correctAnswer={correctAnswer}
    onAnswer={info.onAnswer} maxNumPitches={1} lastCorrectAnswer={info.lastCorrectAnswer}
    incorrectAnswers={info.incorrectAnswers} instantConfirm={true} wrapOctave={true} />;
}

export function createFlashCardSet(scale: Scale): FlashCardSet {
  const flashCardSetId = getFlashCardSetId(scale);
  const flashCardSet = new FlashCardSet(
    flashCardSetId,
    `${scale.rootPitch.toString(/*includeOctaveNumber*/ false)} ${scale.type.name} Scale Degrees`,
    () => createFlashCards(flashCardSetId, scale));
  flashCardSet.route = `scale/${getUriComponent(scale)}/degrees-exercise`;
  flashCardSet.containerHeight = `${200}px`;
  flashCardSet.moreInfoUri = "/essential-music-theory/notes";
  flashCardSet.renderAnswerSelect = renderAnswerSelect;

  return flashCardSet;
}

function createFlashCards(flashCardSetId: string, scale: Scale): FlashCard[] {
  const scalePitches = scale.getPitches()
    .map(p => unwrapValueOrUndefined(tryWrapPitchOctave(p, lowestPitch, highestPitch)));

  // Create flash cards.
  return scalePitches
    .map((pitch, i) => {
      const scaleDegreeNumber = 1 + i;

      const deserializedId = {
        set: flashCardSetId,
        degree: scaleDegreeNumber
      };
      const id = JSON.stringify(deserializedId);

      return new FlashCard(
        id,
        new FlashCardSide(
          `Degree ${scaleDegreeNumber}`,
          pitch
        ),
        new FlashCardSide(
          () => (
            <PianoKeyboard
              rect={pianoKeyboardRect}
              lowestPitch={lowestPitch}
              highestPitch={highestPitch}
              pressedPitches={[pitch]}
              style={pianoStyle}
            />
          )
        )
      );
    }
  );
}