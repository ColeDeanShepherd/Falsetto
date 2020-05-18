import * as React from "react";

import * as FlashCardUtils from "../Components/Quizzes/Utils";
import { FlashCard } from "../FlashCard";
import { FlashCardSet } from "../FlashCardSet";
import { renderUserDeterminedCorrectnessAnswerSelect } from '../Components/Quizzes/Utils';

const flashCardSetId = "ptScalesQuiz";

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Chord Progressions Quiz", createFlashCards);
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.containerHeight = "160px";

  return flashCardSet;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "chordProgressionDef" }),
      "What is a chord progression?",
      "a sequence of chords",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "romanNumeralNotationDef" }),
      "_ is a concise, scale-independent way to represent diatonic chord progressions.",
      "roman numeral notation",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "romanNumeralNotationNumeralDef" }),
      "In roman numeral notation, the roman numeral represents _?",
      "the number of the scale note that the chord is built on",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "romanNumeralUpperCase" }),
      "In roman numeral notation, chords based on the major triad are _.",
      "upper-case",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "romanNumeralLowerCase" }),
      "In roman numeral notation, chords based on the minor triad are _.",
      "lower-case",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "descendingFifthCommon" }),
      "One of the strongest sounding, and most common, chord progressions is the _.",
      "descending fifth",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "descendingFifthProgression" }),
      "In a descending fifth chord progression, the 2nd chord is _.",
      "a fifth below the first chord",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "v7IProgression" }),
      "One of the strongest descending fifth progressions is _.",
      "V7 - I",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "circleProgressionDef" }),
      "What is a circle progression?",
      "a chain of descending fifth progressions",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "voiceLeadingDef" }),
      "What is voice leading?",
      "the arrangement of chord notes in a progression to create smooth transitions between chords",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "voiceLeadingMostImportantRule" }),
      "What is the most important rule of voice leading?",
      "using the smallest possible movements when transitioning from one chord to the next",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "chordSubstitutionDef" }),
      "What is chord substitution?",
      "replacing chords in a progression with different chords that often sound similar or have a similar \"feel\" in the progression",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "chordSimilarNotesSub" }),
      "Chords that share many notes generally sound _, and can be used as chord substitutes.",
      "similar",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
  ];
}

export const flashCardSet = createFlashCardSet();