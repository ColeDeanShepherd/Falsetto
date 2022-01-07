import * as React from "react";

import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { createFlashCardId, FlashCard, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";

import { createPitch, Pitch, tryWrapPitchOctave } from '../../../lib/TheoryLib/Pitch';
import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";
import { Scale, getUriComponent } from '../../../lib/TheoryLib/Scale';

import { PianoKeysAnswerSelect } from '../../Utils/PianoKeysAnswerSelect';
import { unwrapValueOrUndefined } from '../../../lib/Core/Utils';

function getFlashCardSetId(scale: Scale): string {
  return `${scale.id}ScaleDegrees`;
}

const octaveNumber = 4;
const lowestPitch = createPitch(PitchLetter.C, 0, octaveNumber);
const highestPitch = createPitch(PitchLetter.B, 0, octaveNumber);

const pianoMaxWidth = 200;

function renderAnswerSelect(
  info: FlashCardStudySessionInfo
) {
  const correctAnswer = [(info.currentFlashCard.frontSide.data as Pitch)];
  
  return <PianoKeysAnswerSelect
    maxWidth={pianoMaxWidth} lowestPitch={lowestPitch} highestPitch={highestPitch}
    correctAnswer={correctAnswer}
    onAnswer={info.onAnswer} lastCorrectAnswer={info.lastCorrectAnswer}
    incorrectAnswers={info.incorrectAnswers} instantConfirm={true} wrapOctave={true} />;
}

export function createFlashCardSet(scale: Scale): FlashCardSet {
  const flashCardSetId = getFlashCardSetId(scale);
  const flashCardSet = new FlashCardSet(
    flashCardSetId,
    `${scale.rootPitchClass.toString(/*includeOctaveNumber*/ false)} ${scale.type.name} Scale Degrees`,
    () => createFlashCards(flashCardSetId, scale));
  flashCardSet.route = `scale/${getUriComponent(scale)}/degrees-exercise`;
  flashCardSet.moreInfoUri = "/essential-music-theory/notes";
  flashCardSet.renderAnswerSelect = renderAnswerSelect;

  return flashCardSet;
}

function createFlashCards(flashCardSetId: string, scale: Scale): FlashCard[] {
  const scalePitches = scale.getPitchClasses()
    .map(p => unwrapValueOrUndefined(tryWrapPitchOctave(p, lowestPitch, highestPitch)));

  // Create flash cards.
  return scalePitches
    .map((pitch, i) => {
      const scaleDegreeNumber = 1 + i;

      return new FlashCard(
        createFlashCardId(flashCardSetId, { degree: scaleDegreeNumber }),
        new FlashCardSide(
          `Degree ${scaleDegreeNumber}`,
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