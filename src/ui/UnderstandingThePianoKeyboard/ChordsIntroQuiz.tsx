import * as React from "react";

import * as FlashCardUtils from "../../ui/Quizzes/Utils";
import { createFlashCardId, FlashCard } from "../../FlashCard";
import { FlashCardSet } from "../../FlashCardSet";
import { renderUserDeterminedCorrectnessAnswerSelect, renderStringAnswerSelect } from '../../ui/Quizzes/Utils';
import { MajorScaleRelativeFormulaAnswerSelect } from "../../ui/Utils/MajorScaleRelativeFormulaAnswerSelect";

const flashCardSetId = "ptChordsIntroQuiz";

export const fifthIntervalFlashCard = FlashCard.fromRenderFns(
  JSON.stringify({ id: "fifthInterval" }),
  "What is the interval from A to E?",
  "fifth",
  info => renderStringAnswerSelect(["first", "second", "third", "fourth", "fifth", "sixth", "seventh"], info)
);

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Chords Introduction Quiz", createFlashCards);
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardSet;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "chordDef" }),
      "What is a chord?",
      "two or more notes played simultaneously",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "chordUnorderedRepeat" }),
      "Are you allowed to re-order and/or repeat the notes in a chord?",
      "yes",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "intervalDef" }),
      "What is an interval?",
      "the distance between two notes",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "mostlyTertialChords" }),
      "In practice, most chords are built with what interval?",
      "thirds",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "thirdDef" }),
      "What is a third?",
      "an interval that spans three letters",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "tertialRootNote" }),
      "When we say that a chord is built with thirds, we only care that chord notes are thirds apart when starting with which note in the chord?",
      "root note",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "tertialNoteOrder" }),
      "When we say that a chord is built with thirds, we only care that chord notes are thirds apart when listed in what order?",
      "left-to-right on the piano keyboard",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "majorChordFormula" }),
      "What is the major-scale-relative formula for major chords?",
      "1 3 5",
      info => <MajorScaleRelativeFormulaAnswerSelect
        info={info}
        correctAnswer={[0, 0, 0]}
        scaleDegreeNumbers={[1, 3, 5]} />
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "minorChordFormula" }),
      "What is the major-scale-relative formula for minor chords?",
      "1 3♭ 5",
      info => <MajorScaleRelativeFormulaAnswerSelect
        info={info}
        correctAnswer={[0, -1, 0]}
        scaleDegreeNumbers={[1, 3, 5]} />
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "diminishedChordFormula" }),
      "What is the major-scale-relative formula for diminished chords?",
      "1 3♭ 5♭",
      info => <MajorScaleRelativeFormulaAnswerSelect
        info={info}
        correctAnswer={[0, -1, -1]}
        scaleDegreeNumbers={[1, 3, 5]} />
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "dominant7ChordFormula" }),
      "What is the major-scale-relative formula for dominant 7th chords?",
      "1 3♭ 5 7♭",
      info => <MajorScaleRelativeFormulaAnswerSelect
        info={info}
        correctAnswer={[0, -1, 0, -1]}
        scaleDegreeNumbers={[1, 3, 5, 7]} />
    ),
  ];
}

export const flashCardSet = createFlashCardSet();