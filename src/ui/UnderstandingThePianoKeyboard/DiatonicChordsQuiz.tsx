import * as React from "react";

import * as FlashCardUtils from "../../ui/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardSet } from "../../FlashCardSet";
import { renderUserDeterminedCorrectnessAnswerSelect, renderStringAnswerSelect } from '../../ui/Quizzes/Utils';
import { Scale, ScaleType } from '../../lib/TheoryLib/Scale';
import { Pitch } from "../../lib/TheoryLib/Pitch";
import { PitchLetter } from '../../lib/TheoryLib/PitchLetter';
import { getOrdinalNumeral } from "../../lib/Core/Utils";
import { createChordNotesFlashCard } from "../../ui/Quizzes/Chords/PianoDiatonicChords";

const flashCardSetId = "ptDiatonicChordsQuiz";
const diatonicTriadTypeStrings = ["Major", "Minor", "Diminished"];

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Diatonic Chords Quiz", createFlashCards);
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardSet;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "diatonicChordDef" }),
      "What is a diatonic chord?",
      "a chord consisting solely of notes from a particular scale",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "triadDef" }),
      "What is a triad?",
      "a chord with with 3 distinct notes",
      renderUserDeterminedCorrectnessAnswerSelect
    )
  ]
  .concat(
    (new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4)))
      .getDiatonicCanonicalChords(/*numChordPitches*/ 3)
      .map((canonicalChord, i) => {
        const scaleDegreeNumber = 1 + i;
        
        return createChordNotesFlashCard(
          flashCardSetId,
          canonicalChord,
          `What notes are in the ${getOrdinalNumeral(scaleDegreeNumber)} diatonic triad of the C Major scale?`
        );
      })
  )
  .concat([
      FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "majorDiatonicTriad1" }),
      "What type of triad is built with thirds on the 1st note of the major scale?",
      "Major",
      info => renderStringAnswerSelect(diatonicTriadTypeStrings, info)
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "majorDiatonicTriad2" }),
      "What type of triad is built with thirds on the 2nd note of the major scale?",
      "Minor",
      info => renderStringAnswerSelect(diatonicTriadTypeStrings, info)
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "majorDiatonicTriad3" }),
      "What type of triad is built with thirds on the 3rd note of the major scale?",
      "Minor",
      info => renderStringAnswerSelect(diatonicTriadTypeStrings, info)
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "majorDiatonicTriad4" }),
      "What type of triad is built with thirds on the 4th note of the major scale?",
      "Major",
      info => renderStringAnswerSelect(diatonicTriadTypeStrings, info)
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "majorDiatonicTriad5" }),
      "What type of triad is built with thirds on the 5th note of the major scale?",
      "Major",
      info => renderStringAnswerSelect(diatonicTriadTypeStrings, info)
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "majorDiatonicTriad6" }),
      "What type of triad is built with thirds on the 6th note of the major scale?",
      "Minor",
      info => renderStringAnswerSelect(diatonicTriadTypeStrings, info)
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "majorDiatonicTriad7" }),
      "What type of triad is built with thirds on the 7th note of the major scale?",
      "Diminished",
      info => renderStringAnswerSelect(diatonicTriadTypeStrings, info)
    )
  ]);
}

export const flashCardSet = createFlashCardSet();