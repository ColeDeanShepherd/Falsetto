import * as React from "react";

import {  Scale } from "../lib/TheoryLib/Scale";

import { createStudyFlashCardSetComponent } from "../StudyFlashCards/View";

import * as ScalesQuiz from "./ScalesQuiz";

import { LimitedWidthContentContainer } from "../Components/Utils/LimitedWidthContentContainer";
import { PianoScaleMajorRelativeFormulaDiagram } from "../Components/Utils/PianoScaleMajorRelativeFormulaDiagram";
import { NavLinkView } from "../NavLinkView";
import { SlideGroup, Slide, maxTwoOctavePianoWidth } from "./PianoTheory";
import * as PianoScaleDegrees from "../Components/Quizzes/Scales/PianoScaleDegrees";
import { NoteText } from "../Components/Utils/NoteText";

export function createSlideGroups(scale: Scale): Array<SlideGroup> {
  const scaleName = `${scale.rootPitch.toString(/*includeOctaveNumber*/ false)} ${scale.type.name}`;
  const scalePitches = scale.getPitches();
  const scalePitchesString = scalePitches
    .map(p => p.toString(/*includeOctaveNumber*/ false, /*useSymbols*/ true))
    .join(' ');
  const majorScaleRelativeFormulaString = scale.type.formula.toString(/*useSymbols*/ true);

  return [
    new SlideGroup("Scales", [
      new Slide("introduction", () => (
        <div>
          <h1>{scaleName} Lesson</h1>
          <p>The <strong>{scaleName}</strong> is a {scale.type.numPitches} note scale with the following notes:</p>
          <p><strong>Notes:</strong> {scalePitchesString}</p>
          <p>All <strong>{scale.type.name}</strong> scales have the following formula relative to the major scale:</p>
          <p><strong>Formula (Relative to the Major Scale)</strong>: {majorScaleRelativeFormulaString}</p>
          <p>Below is an interactive diagram of the <strong>{scaleName}</strong> scale. Try pressing the piano keys below to get a feel for how the scale sounds.</p>
          <p><PianoScaleMajorRelativeFormulaDiagram scale={scale} octaveCount={2} maxWidth={maxTwoOctavePianoWidth} /></p>
          <p>Study this slide, then move to the next slide to test your knowledge of the notes in the <strong>{scaleName}</strong> with a quiz.</p>
          <div style={{ display: "inline-block" }}><NoteText>We recommend playing the scale forwards and backwards in various intervals (2nds, 3rds, etc.) to effectively memorize it.</NoteText></div>
        </div>
      )),

      new Slide("scale-degrees-quiz", () => (
        <LimitedWidthContentContainer>
          <div style={{ marginTop: "1em" }}>
            {createStudyFlashCardSetComponent(
              PianoScaleDegrees.createFlashCardSet(scale),
              /*isEmbedded*/ false,
              /*hideMoreInfoUri*/ true,
              /*title*/ undefined,
              /*style*/ undefined,
              /*enableSettings*/ undefined,
              /*showRelatedExercises*/ false)}
          </div>
        </LimitedWidthContentContainer>
      )),

      // TODO: fingering
      // TODO: play in different intervals?
      // TODO: diatonic chords (triads, seventh, extended)
      //PianoDiatonicChords.createFlashCardSet(scale, numChordPitches))
    ]),
    
    new SlideGroup("Coming Soon", [
      new Slide("coming-soon", () => <h3>More coming soon!</h3>)
    ])
  ];
}