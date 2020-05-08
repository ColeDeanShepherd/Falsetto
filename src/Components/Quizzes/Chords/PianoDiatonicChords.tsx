import * as React from "react";

import { getRomanNumerals } from "../../../lib/Core/Utils";
import { Vector2D } from '../../../lib/Core/Vector2D';
import { Size2D } from "../../../lib/Core/Size2D";
import { Rect2D } from '../../../lib/Core/Rect2D';

import { Pitch } from "../../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";
import { Scale, getUriComponent } from "../../../lib/TheoryLib/Scale";

import { FlashCard, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";

import { getPianoKeyboardAspectRatio } from '../../Utils/PianoUtils';
import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { PianoKeysAnswerSelect } from "../../Utils/PianoKeysAnswerSelect";
import { canonicalChordTypeToString, getPitchClasses } from '../../../lib/TheoryLib/CanonicalChord';
import { getChordExtensionTypeName } from "../../../lib/TheoryLib/ChordType";

const pianoLowestPitch = new Pitch(PitchLetter.C, 0, 4);
const pianoHighestPitch = new Pitch(PitchLetter.B, 0, 5);

const pianoAspectRatio = getPianoKeyboardAspectRatio(/*octaveCount*/ 2);
const pianoMaxWidth = 300;
const pianoStyle = { width: `${pianoMaxWidth}px`, maxWidth: "100%", height: "auto" };

export function getFlashCardSetId(scale: Scale, numChordPitches: number): string {
  return `${scale.id}${numChordPitches}NoteDiatonicChords`;
}

export function createFlashCardSet(scale: Scale, numChordPitches: number): FlashCardSet {
  const chordExtensionTypeName = getChordExtensionTypeName(numChordPitches, /*capitalize*/ true);
  const flashCardSetId = getFlashCardSetId(scale, numChordPitches);

  const flashCardSet = new FlashCardSet(
    flashCardSetId,
    `${scale.rootPitch.toString(/*includeOctaveNumber*/ false)} ${scale.type.name} Diatonic ${chordExtensionTypeName}s`,
    () => createFlashCards(flashCardSetId, scale, numChordPitches));
  flashCardSet.route = `scale/${getUriComponent(scale)}/diatonic-${numChordPitches}-note-chords-exercise`;
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.containerHeight = `${150}px`;

  return flashCardSet;
}

export function createFlashCards(flashCardSetId: string, scale: Scale, numChordPitches: number): FlashCard[] {
  const diatonicCanonicalChords = scale.getDiatonicCanonicalChords(numChordPitches);

  return diatonicCanonicalChords
    .map((canonicalChord, i) => {
      const deserializedId = {
        set: flashCardSetId,
        chord: `${canonicalChord.rootPitchClass.toString()} ${canonicalChordTypeToString(canonicalChord.type)}`
      };
      const id = JSON.stringify(deserializedId);

      const scaleDegreeRomanNumerals = getRomanNumerals(1 + i);

      const chordPitches = getPitchClasses(canonicalChord)
        .map(pitchClass => Pitch.createFromPitchClass(
          pitchClass,
          /*octaveNumber*/ 4,
          /*useSharps*/ true
        ));

      return new FlashCard(
        id,

        new FlashCardSide(
          scaleDegreeRomanNumerals,
          chordPitches
        ),

        new FlashCardSide(
          size => {
            return (
              <PianoKeyboard
                rect={new Rect2D(new Size2D(pianoAspectRatio * 100, 100), new Vector2D(0, 0))}
                lowestPitch={pianoLowestPitch}
                highestPitch={pianoHighestPitch}
                pressedPitches={chordPitches}
                style={pianoStyle}
              />
            );
          },
          canonicalChord
        )
      );
    });
}

export function renderAnswerSelect(
  info: FlashCardStudySessionInfo
) {
  const correctAnswer = info.currentFlashCard.frontSide.data as Array<Pitch>;

  return <PianoKeysAnswerSelect
    aspectRatio={pianoAspectRatio} maxWidth={pianoMaxWidth}
    lowestPitch={pianoLowestPitch} highestPitch={pianoHighestPitch}
    correctAnswer={correctAnswer} onAnswer={info.onAnswer}
    lastCorrectAnswer={info.lastCorrectAnswer} incorrectAnswers={info.incorrectAnswers}
    instantConfirm={false} wrapOctave={true} />;
}