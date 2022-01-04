import * as React from "react";

import { SlideGroup, Slide } from "../Slideshow/Slideshow";
import { ChordType, getUriComponent as getChordTypeUriComponent } from '../../lib/TheoryLib/ChordType';
import { ChordView } from '../../ui/Utils/ChordView';
import { Chord, getUriComponent as getChordUriComponent } from "../../lib/TheoryLib/Chord";
import { LimitedWidthContentContainer } from "../../ui/Utils/LimitedWidthContentContainer";
import { createStudyFlashCardSetComponent } from "../StudyFlashCards/View";
import * as PianoChords from "../../ui/Quizzes/Chords/PianoChords";

export function createSlideGroups(chordType: ChordType): Array<SlideGroup> {
  const chordTypeName = chordType.name;
  const chordTypeUriComponent = getChordTypeUriComponent(chordType);
  const rootPitches = getValidKeyPitches(/*preferredOctaveNumber*/ 4);

  const formulaString = chordType.formula.toString(/*useSymbols*/ true);

  const slideGroup = new SlideGroup(
    `${chordTypeName} Chords`,
    "",
    [
      new Slide("introduction", () => (
        <div>
          <h1>{chordTypeName} Chords Lesson</h1>
          <p>The <strong>{chordTypeName}</strong> chord is a chord with the following major-scale-relative formula: <strong>{formulaString}</strong></p>
          <p>We will learn {chordTypeName} chords for each possible root note in the following slides.</p>
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
              /*hideMoreInfoUri*/ true,
              /*title*/ undefined,
              /*style*/ undefined,
              /*enableSettings*/ undefined,
              /*renderCard*/ false)}
          </div>
        </LimitedWidthContentContainer>
      ))
    ])
  );

  return [slideGroup];
  
}
