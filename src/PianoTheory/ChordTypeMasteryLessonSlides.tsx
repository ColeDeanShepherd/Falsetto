import * as React from "react";

import { SlideGroup, Slide } from "./PianoTheory";
import { ChordType, getUriComponent as getChordTypeUriComponent } from '../lib/TheoryLib/ChordType';
import { ChordView } from '../Components/Utils/ChordView';
import { getValidKeyPitches } from '../lib/TheoryLib/Key';
import { Chord, getUriComponent as getChordUriComponent } from "../lib/TheoryLib/Chord";
import { LimitedWidthContentContainer } from "../Components/Utils/LimitedWidthContentContainer";
import { createStudyFlashCardSetComponent } from "../StudyFlashCards/View";
import * as PianoChords from "../Components/Quizzes/Chords/PianoChords";

export function createSlideGroups(chordType: ChordType): Array<SlideGroup> {
  const chordTypeName = chordType.name;
  const chordTypeUriComponent = getChordTypeUriComponent(chordType);
  const rootPitches = getValidKeyPitches(/*preferredOctaveNumber*/ 4);

  const formulaString = chordType.formula.toString(/*useSymbols*/ true);

  const slideGroup = new SlideGroup(
    `${chordTypeName} Chords`,
    [
      new Slide("introduction", () => (
        <div>
          <h1>{chordTypeName} Chords Lesson</h1>
          <p>The <strong>{chordTypeName}</strong> chord is a chord with the following major-scale-relative formula: <strong>{formulaString}</strong></p>
          <p>The following slides are {chordTypeName} chords for each possible root note.</p>
        </div>
      )),
    ]
    .concat(
      rootPitches.map(rootPitch => {
        const chord = new Chord(chordType, rootPitch);
        const slideId = getChordUriComponent(chord);

        return new Slide(
          slideId,
          () => (
            <div>
              <ChordView
                chord={chord}
                maxWidth={500} />
            </div>
          )
        );
      })
    )
    .concat([
      new Slide(`chords-quiz`, () => (
        <LimitedWidthContentContainer>
          <div style={{ marginTop: "1em" }}>
            {createStudyFlashCardSetComponent(
              PianoChords.createFlashCardSet([chordType]),
              /*isEmbedded*/ false,
              /*hideMoreInfoUri*/ true,
              /*title*/ undefined,
              /*style*/ undefined,
              /*enableSettings*/ undefined,
              /*showRelatedExercises*/ false)}
          </div>
        </LimitedWidthContentContainer>
      ))
    ])
  );

      // new Slide("scale-degrees-quiz", () => (
      //   <LimitedWidthContentContainer>
      //     <div style={{ marginTop: "1em" }}>
      //       {createStudyFlashCardSetComponent(
      //         PianoScaleDegrees.createFlashCardSet(scale),
      //         /*isEmbedded*/ false,
      //         /*hideMoreInfoUri*/ true,
      //         /*title*/ undefined,
      //         /*style*/ undefined,
      //         /*enableSettings*/ undefined,
      //         /*showRelatedExercises*/ false)}
      //     </div>
      //   </LimitedWidthContentContainer>
      // )),);

  return [slideGroup];
  // return [notesSlideGroup]
  //   .concat([3, 4]
  //     .map(numChordPitches => {
  //       // TODO: fix this
  //       try {
  //         const chordExtensionTypeName = getChordExtensionTypeName(numChordPitches, /*capitalize*/ true);

  //         return (
  //           new SlideGroup(
  //             `Diatonic ${chordExtensionTypeName}s`,
  //             range(1, scale.type.numPitches)
  //               .map(scaleDegreeNumber => {
  //                 const scaleDegreeRomanNumerals = getRomanNumerals(scaleDegreeNumber);
        
  //                 const chord = scale.getDiatonicChord(scaleDegreeNumber, numChordPitches);
  //                 const chordScaleDegreeNumbers = scale.type.getDiatonicChordScaleDegreeNumbers(scaleDegreeNumber, numChordPitches);
  //                 const chordScaleDegreesString = chordScaleDegreeNumbers.join(' ');
  //                 const chordName = `${chord.rootPitch.toString(/*includeOctaveNumber*/ false)} ${chord.type.name}`;
  //                 const chordPitches = chord.getPitches();
  //                 const chordPitchesString = chordPitches
  //                   .map(p => p.toString(/*includeOctaveNumber*/ false, /*useSymbols*/ true))
  //                   .join(' ');
        
  //                 return (
  //                   new Slide(`${numChordPitches}-note-diatonic-chord-${scaleDegreeRomanNumerals}`, () => (
  //                     <div>
  //                       <p>The {scaleDegreeRomanNumerals} {chordExtensionTypeName} of {chordTypeName} is <strong>{chordName}</strong>, which consists of the notes <strong>{chordPitchesString}</strong> (scale degrees <strong>{chordScaleDegreesString}</strong>).</p>
  //                       <ChordView
  //                         chord={chord}
  //                         showChordInfoText={false} />
  //                     </div>
  //                   ))
  //                 );
  //               })
  //               .concat([
  //                 new Slide(`${numChordPitches}-note-diatonic-chords-quiz`, () => (
  //                   <LimitedWidthContentContainer>
  //                     <div style={{ marginTop: "1em" }}>
  //                       {createStudyFlashCardSetComponent(
  //                         PianoDiatonicChords.createFlashCardSet(scale, numChordPitches),
  //                         /*isEmbedded*/ false,
  //                         /*hideMoreInfoUri*/ true,
  //                         /*title*/ undefined,
  //                         /*style*/ undefined,
  //                         /*enableSettings*/ undefined,
  //                         /*showRelatedExercises*/ false)}
  //                     </div>
  //                   </LimitedWidthContentContainer>
  //                 ))
  //               ])
  //           )
  //         );
  //       } catch {
  //         console.error(scale);
  //         return null;
  //       }
  //     })
  //     .filter(x => x !== null)
  //     .map(x => unwrapMaybe(x))
  //   );
}
