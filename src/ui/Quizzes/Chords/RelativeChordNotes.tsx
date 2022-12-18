import * as React from "react";

import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { createFlashCardId, FlashCard, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";

import { Pitch } from '../../../lib/TheoryLib/Pitch';
import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";

import { PianoKeysAnswerSelect } from '../../Utils/PianoKeysAnswerSelect';
import { commonKeyPitchesOctave0 } from "../../../lib/TheoryLib/Key";

const chordNoteIntervalsAndNames = [
  { interval: 0, name: "1" },
  { interval: 1, name: "♭9" },
  { interval: 2, name: "9" },
  { interval: 3, name: "♭3" },
  { interval: 4, name: "3" },
  { interval: 5, name: "11" },
  { interval: 6, name: "#11" },
  { interval: 7, name: "5" },
  { interval: 8, name: "♭13" },
  { interval: 9, name: "13" },
  { interval: 10, name: "♭7" },
  { interval: 11, name: "7" },
];

const octaveNumber = 4;
const lowestPitch = new Pitch(PitchLetter.C, 0, octaveNumber);
const highestPitch = new Pitch(PitchLetter.B, 0, octaveNumber);

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

function createFlashCardSet(): FlashCardSet {
  const flashCardSetId = "RelativeChordNotes";
  const flashCardSet = new FlashCardSet(
    flashCardSetId,
    "Relative Chord Notes",
    () => createFlashCards(flashCardSetId));
  flashCardSet.renderAnswerSelect = renderAnswerSelect;

  return flashCardSet;
}

function createFlashCards(flashCardSetId: string): FlashCard[] {
  return commonKeyPitchesOctave0
    .flatMap(rootPitch =>
      chordNoteIntervalsAndNames
        .map((p, i) => {
          const pitch = Pitch.addHalfSteps(rootPitch, p.interval);
          pitch.octaveNumber = octaveNumber;

          return new FlashCard(
            createFlashCardId(flashCardSetId, { rootPitchClass: rootPitch.class, interval: p.interval }),
            new FlashCardSide(
              `${p.name} of ${rootPitch.toString(false, true)}`,
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
        })
    );
}

export const flashCardSet = createFlashCardSet();