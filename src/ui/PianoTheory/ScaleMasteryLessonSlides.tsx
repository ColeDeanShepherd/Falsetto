// TODO: fingering
// TODO: play in different intervals?
// TODO: diatonic chords (triads, seventh, extended)

import * as React from "react";

import {  Scale } from "../../lib/TheoryLib/Scale";

import { createStudyFlashCardSetComponent } from "../StudyFlashCards/View";

import { LimitedWidthContentContainer } from "../../ui/Utils/LimitedWidthContentContainer";
import { PianoScaleMajorRelativeFormulaDiagram } from "../../ui/Utils/PianoScaleMajorRelativeFormulaDiagram";
import { SlideGroup, Slide, maxTwoOctavePianoWidth } from "./PianoTheory";
import * as PianoScaleDegrees from "../../ui/Quizzes/Scales/PianoScaleDegrees";
import * as PianoDiatonicChords from "../../ui/Quizzes/Chords/PianoDiatonicChords";
import { NoteText } from "../../ui/Utils/NoteText";
import { getRomanNumerals, unwrapMaybe } from '../../lib/Core/Utils';
import { range } from "../../lib/Core/MathUtils";
import { getChordExtensionTypeName } from '../../lib/TheoryLib/ChordType';
import { ChordView } from '../../ui/Utils/ChordView';

export function createSlideGroups(scale: Scale): Array<SlideGroup> {
  const scaleName = `${scale.rootPitch.toString(/*includeOctaveNumber*/ false)} ${scale.type.name}`;
  const scalePitches = scale.getPitches();
  const scalePitchesString = scalePitches
    .map(p => p.toString(/*includeOctaveNumber*/ false, /*useSymbols*/ true))
    .join(' ');
  const majorScaleRelativeFormulaString = scale.type.formula.toString(/*useSymbols*/ true);

  const notesSlideGroup = new SlideGroup(
    "Notes", [
      new Slide("introduction", () => (
        <div>
          <h1>{scaleName} Lesson</h1>
          <p>The <strong>{scaleName}</strong> is a {scale.type.numPitches} note scale with the following notes:</p>
          <p><strong>Notes:</strong> {scalePitchesString}</p>
          <p>All <strong>{scale.type.name}</strong> scales have the following formula relative to the major scale:</p>
          <p><strong>Formula (Relative to the Major Scale)</strong>: {majorScaleRelativeFormulaString}</p>
          <p>Below is an interactive diagram of the <strong>{scaleName}</strong> scale, including the major-scale-relative formula and note names.</p>
          <p>Try pressing the piano keys below (or on your MIDI keyboard) to get a feel for how the scale sounds.</p>
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
              /*renderCard*/ false)}
          </div>
        </LimitedWidthContentContainer>
      )),
    ]);

  return [notesSlideGroup]
    .concat([3, 4]
      .map(numChordPitches => {
        // TODO: fix this
        try {
          const chordExtensionTypeName = getChordExtensionTypeName(numChordPitches, /*capitalize*/ true);

          return (
            new SlideGroup(
              `Diatonic ${chordExtensionTypeName}s`,
              range(1, scale.type.numPitches)
                .map(scaleDegreeNumber => {
                  const scaleDegreeRomanNumerals = getRomanNumerals(scaleDegreeNumber);
        
                  const chord = scale.getDiatonicChord(scaleDegreeNumber, numChordPitches);
                  const chordScaleDegreeNumbers = scale.type.getDiatonicChordScaleDegreeNumbers(scaleDegreeNumber, numChordPitches);
                  const chordScaleDegreesString = chordScaleDegreeNumbers.join(' ');
                  const chordName = `${chord.rootPitch.toString(/*includeOctaveNumber*/ false)} ${chord.type.name}`;
                  const chordPitches = chord.getPitches();
                  const chordPitchesString = chordPitches
                    .map(p => p.toString(/*includeOctaveNumber*/ false, /*useSymbols*/ true))
                    .join(' ');
        
                  return (
                    new Slide(`${numChordPitches}-note-diatonic-chord-${scaleDegreeRomanNumerals}`, () => (
                      <div>
                        <p>The <strong>{scaleDegreeRomanNumerals}</strong> {chordExtensionTypeName} of {scaleName} is <strong>{chordName}</strong>, which consists of the notes <strong>{chordPitchesString}</strong> (scale degrees <strong>{chordScaleDegreesString}</strong>).</p>
                        <ChordView
                          chord={chord}
                          showChordInfoText={false} />
                      </div>
                    ))
                  );
                })
                .concat([
                  new Slide(`${numChordPitches}-note-diatonic-chords-quiz`, () => (
                    <LimitedWidthContentContainer>
                      <div style={{ marginTop: "1em" }}>
                        {createStudyFlashCardSetComponent(
                          PianoDiatonicChords.createFlashCardSet(scale, numChordPitches),
                          /*isEmbedded*/ false,
                          /*hideMoreInfoUri*/ true,
                          /*title*/ undefined,
                          /*style*/ undefined,
                          /*enableSettings*/ undefined,
                          /*renderCard*/ false)}
                      </div>
                    </LimitedWidthContentContainer>
                  ))
                ])
            )
          );
        } catch {
          console.error(scale);
          return null;
        }
      })
      .filter(x => x !== null)
      .map(x => unwrapMaybe(x))
    );
}
