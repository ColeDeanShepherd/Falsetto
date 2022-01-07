import * as React from "react";

import { getRomanNumerals } from "../../../lib/Core/Utils";

import { createPitch, Pitch } from "../../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";
import { Scale, getUriComponent } from "../../../lib/TheoryLib/Scale";

import { createFlashCardId, FlashCard, FlashCardSide, FlashCardSideRenderFn } from '../../../FlashCard';
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";

import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { PianoKeysAnswerSelect } from "../../Utils/PianoKeysAnswerSelect";
import { canonicalChordTypeToString, getPitchClasses, CanonicalChord } from '../../../lib/TheoryLib/CanonicalChord';
import { getChordExtensionTypeName } from "../../../lib/TheoryLib/ChordType";
import { toString } from "../../../lib/TheoryLib/PitchClass";
import { createFromPitchClass, getPitch } from "../../../lib/TheoryLib/PitchName";
import { PitchClassName } from "../../../lib/TheoryLib/PitchClassName";

const pianoLowestPitch = createPitch(PitchLetter.C, 0, 4);
const pianoHighestPitch = createPitch(PitchLetter.B, 0, 5);

const pianoMaxWidth = 300;

export function getFlashCardSetId(scale: Scale, numChordPitches: number): string {
  return `${scale.id}${numChordPitches}NoteDiatonicChords`;
}

export function createFlashCardSet(scale: Scale, numChordPitches: number): FlashCardSet {
  const chordExtensionTypeName = getChordExtensionTypeName(numChordPitches, /*capitalize*/ true);
  const flashCardSetId = getFlashCardSetId(scale, numChordPitches);

  const flashCardSet = new FlashCardSet(
    flashCardSetId,
    `${toString(scale.rootPitchClass, /*includeOctaveNumber*/ false)} ${scale.type.name} Diatonic ${chordExtensionTypeName}s`,
    () => createFlashCards(flashCardSetId, scale, numChordPitches));
  flashCardSet.route = `scale/${getUriComponent(scale)}/diatonic-${numChordPitches}-note-chords-exercise`;
  flashCardSet.renderAnswerSelect = renderChordNotesFlashCardAnswerSelect;

  return flashCardSet;
}

export function createFlashCards(flashCardSetId: string, scale: Scale, numChordPitches: number): FlashCard[] {
  const diatonicCanonicalChords = scale.getDiatonicCanonicalChords(numChordPitches);

  return diatonicCanonicalChords
    .map((canonicalChord, i) => {
      const scaleDegreeRomanNumerals = getRomanNumerals(1 + i);
      return createChordNotesFlashCard(flashCardSetId, canonicalChord, scaleDegreeRomanNumerals);
    });
}

export function createChordNotesFlashCard(
  flashCardSetId: string,
  canonicalChord: CanonicalChord,
  frontSideRenderFn: FlashCardSideRenderFn
): FlashCard {
  const chordPitches = getPitchClasses(canonicalChord)
    .map(pitchClass => {
      const pitchName = createFromPitchClass(
        pitchClass,
        /*octaveNumber*/ 4,
        /*useSharps*/ true
      );
      return getPitch(pitchName);
    });

  return new FlashCard(
    createFlashCardId(flashCardSetId, { chord: `${canonicalChord.rootPitchClass.toString()} ${canonicalChordTypeToString(canonicalChord.type)}` }),

    new FlashCardSide(
      frontSideRenderFn,
      chordPitches
    ),

    new FlashCardSide(
      size => {
        return (
          <PianoKeyboard
            maxWidth={pianoMaxWidth}
            lowestPitch={pianoLowestPitch}
            highestPitch={pianoHighestPitch}
            pressedPitches={chordPitches}
          />
        );
      },
      canonicalChord
    ),

    renderChordNotesFlashCardAnswerSelect
  );
}

export function renderChordNotesFlashCardAnswerSelect(
  info: FlashCardStudySessionInfo
) {
  const correctAnswer = info.currentFlashCard.frontSide.data as Array<Pitch>;

  return <PianoKeysAnswerSelect
    maxWidth={pianoMaxWidth}
    lowestPitch={pianoLowestPitch} highestPitch={pianoHighestPitch}
    correctAnswer={correctAnswer} onAnswer={info.onAnswer}
    lastCorrectAnswer={info.lastCorrectAnswer} incorrectAnswers={info.incorrectAnswers}
    instantConfirm={false} wrapOctave={true} />;
}