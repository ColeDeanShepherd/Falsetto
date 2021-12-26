import * as React from "react";
import wu from "wu";

import * as FlashCardUtils from "../../ui/Quizzes/Utils";
import { createFlashCardId, FlashCard, FlashCardSide } from "../../FlashCard";
import { FlashCardSet } from "../../FlashCardSet";
import { renderUserDeterminedCorrectnessAnswerSelect } from '../../ui/Quizzes/Utils';
import { ScaleFormulaAnswerSelect } from "../../ui/Utils/ScaleFormulaAnswerSelect";
import { MajorScaleRelativeScaleFormulaAnswerSelect } from '../../ui/Utils/MajorScaleRelativeScaleFormulaAnswerSelect';
import { PianoKeyboard } from "../../ui/Utils/PianoKeyboard";
import { Pitch, getPitchesInRange } from '../../lib/TheoryLib/Pitch';
import { PitchLetter } from "../../lib/TheoryLib/PitchLetter";
import { Scale } from "../../lib/TheoryLib/Scale";
import { PianoScaleNotesAnswerSelect } from '../../ui/Utils/PianoScaleNotesAnswerSelect';

const flashCardSetId = "ptScalesQuiz";

const pianoLowestPitch = new Pitch(PitchLetter.C, 0, 4);
const pianoHighestPitch = new Pitch(PitchLetter.B, 0, 5);
const pianoMaxWidth = 240;

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Scales Exercise", createFlashCards);
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardSet;
}

export function createPressAllScaleNotesFlashCard(id: string, scale: Scale, scaleTypeName: string): FlashCard {
  const scaleName = `${scale.rootPitchClass.toString(/*includeOctaveNumber*/ false)} ${scaleTypeName}`;
  
  return new FlashCard(
    createFlashCardId(flashCardSetId, { id: id }),
    new FlashCardSide(`Press at least one of each note in the ${scaleName} scale.`),
    new FlashCardSide(
      () => {
        const scalePitchMidiNumbersNoOctave = new Set<number>(
          scale.getPitchClasses()
            .map(p => p.midiNumberNoOctave)
        );
        const possibleCorrectPitches = wu(getPitchesInRange(pianoLowestPitch, pianoHighestPitch))
          .filter(p => scalePitchMidiNumbersNoOctave.has(p.midiNumberNoOctave))
          .toArray();

        return (
          <PianoKeyboard
            maxWidth={pianoMaxWidth}
            lowestPitch={pianoLowestPitch}
            highestPitch={pianoHighestPitch}
            pressedPitches={possibleCorrectPitches}
          />
        );
      }
    ),
    info => {
      return <PianoScaleNotesAnswerSelect
        maxWidth={pianoMaxWidth}
        lowestPitch={pianoLowestPitch}
        highestPitch={pianoHighestPitch}
        info={info}
        scale={scale} />;
    }
  );
}

export const majorScaleFormulaFlashCard = FlashCard.fromRenderFns(
  createFlashCardId(flashCardSetId, { id: "majorScaleFormula" }),
  "What is the formula for major scales?",
  "W W H W W W",
  info => <ScaleFormulaAnswerSelect info={info} correctAnswer={["W", "W", "H", "W", "W", "W"]} />
);

export const minorScaleFormulaFlashCard = FlashCard.fromRenderFns(
  createFlashCardId(flashCardSetId, { id: "natMinorScaleFormula" }),
  "What is the major-scale-relative formula for natural minor scales?",
  "1 2 3♭ 4 5 6♭ 7♭",
  info => <MajorScaleRelativeScaleFormulaAnswerSelect info={info} correctAnswer={[0, 0, -1, 0, 0, -1, -1]} />
);

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "scaleDef" }),
      "What is a scale?",
      "a set of notes with a designated root note",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "rootNoteDef" }),
      "What is the root note of a scale?",
      "the note that generally \"sounds like home\" in the scale",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "formulaHDef" }),
      "What does \"H\" mean in scale formulas?",
      "the next note in the scale is a half step higher than the previous note",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "formulaWDef" }),
      "What does \"W\" mean in scale formulas?",
      "the next note in the scale is a whole step higher than the previous note",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "halfStepDef" }),
      "How many keys does a half step span?",
      "one",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "wholeStepDef" }),
      "How many keys does a whole step span?",
      "two",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "scaleUnordered" }),
      "Do scale notes need to be played in the same order as they are defined in scale formulas?",
      "no",
      renderUserDeterminedCorrectnessAnswerSelect
    ),
    majorScaleFormulaFlashCard,
    minorScaleFormulaFlashCard,
    createPressAllScaleNotesFlashCard("cMajorNotes", new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4)), "Major"),
    createPressAllScaleNotesFlashCard("cMinorNotes", new Scale(ScaleType.Aeolian, new Pitch(PitchLetter.C, 0, 4)), "Natural Minor")
  ];
}

export const flashCardSet = createFlashCardSet();