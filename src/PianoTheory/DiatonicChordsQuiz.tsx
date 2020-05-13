import * as React from "react";

import * as FlashCardUtils from "../Components/Quizzes/Utils";
import { FlashCard, FlashCardSide } from "../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../FlashCardSet";
import { renderUserDeterminedCorrectnessAnswerSelect, renderStringAnswerSelect } from '../Components/Quizzes/Utils';
import { Scale, ScaleType } from '../lib/TheoryLib/Scale';
import { Pitch } from "../lib/TheoryLib/Pitch";
import { PitchLetter } from '../lib/TheoryLib/PitchLetter';
import { getPitchClasses } from "../lib/TheoryLib/CanonicalChord";
import { getOrdinalNumeral } from "../lib/Core/Utils";
import { PianoKeyboard } from "../Components/Utils/PianoKeyboard";
import { Rect2D } from "../lib/Core/Rect2D";
import { Size2D } from "../lib/Core/Size2D";
import { Vector2D } from "../lib/Core/Vector2D";
import { getPianoKeyboardAspectRatio } from "../Components/Utils/PianoUtils";
import { PianoKeysAnswerSelect } from "../Components/Utils/PianoKeysAnswerSelect";

const flashCardSetId = "ptChordsIntroQuiz";
const diatonicTriadTypeStrings = ["Major", "Minor", "Diminished"];

const pianoLowestPitch = new Pitch(PitchLetter.C, 0, 4);
const pianoHighestPitch = new Pitch(PitchLetter.B, 0, 5);

const pianoAspectRatio = getPianoKeyboardAspectRatio(/*octaveCount*/ 2);
const pianoMaxWidth = 300;
const pianoStyle = { width: `${pianoMaxWidth}px`, maxWidth: "100%", height: "auto" };

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Diatonic Chords Quiz", createFlashCards);
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.containerHeight = "160px";

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

        const chordPitches = getPitchClasses(canonicalChord)
          .map(pitchClass => Pitch.createFromPitchClass(
            pitchClass,
            /*octaveNumber*/ 4,
            /*useSharps*/ true
          ));

        return (
          new FlashCard(
            `cMajorDiatonicTriad${scaleDegreeNumber}`,
            new FlashCardSide(
              `What notes are in the ${getOrdinalNumeral(scaleDegreeNumber)} diatonic triad of the C Major scale?`,
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
            ),
            renderDiatonicTriadNotesAnswerSelect
          )
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

export function renderDiatonicTriadNotesAnswerSelect(
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

export const flashCardSet = createFlashCardSet();