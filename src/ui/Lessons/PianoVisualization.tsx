import * as React from "react";
import wu from "wu";

import { createStudyFlashCardSetComponent } from '../../ui/StudyFlashCards/View';
import { Card } from "../../ui/Card/Card";
import { Scale } from "../../lib/TheoryLib/Scale";
import { FlashCardSet } from "../../FlashCardSet";
import { createFlashCardId, FlashCard, FlashCardSide } from "../../FlashCard";
import { PianoKeyboard, renderPianoKeyHighlights as renderPianoKeyHighlights } from "../Utils/PianoKeyboard";
import { PitchLetter } from "../../lib/TheoryLib/PitchLetter";
import { getPitchesInRange, Pitch } from "../../lib/TheoryLib/Pitch";
import { flashCardSet as pianoNotesFlashCardSet } from '../Quizzes/Notes/PianoNotes';
import { pitchClasses } from "../../lib/TheoryLib/PitchClass";
import { ScaleType } from "../../lib/TheoryLib/ScaleType";

const pianoKeyboardLowestPitch = new Pitch(PitchLetter.C, 0, 4);
const pianoKeyboardHighestPitch = new Pitch(PitchLetter.B, 0, 5);

// #region Scale Shape Flash Cards

export function createPianoScaleShapesFlashCardSet(scaleType: ScaleType): FlashCardSet {
  const id = `pianoScaleShape${scaleType.id}`;
  return new FlashCardSet(id, `${scaleType.name} Scales`, () => createScaleShapeFlashCards(id, scaleType));
}

export function createScaleShapeFlashCards(flashCardSetId: string, scaleType: ScaleType): Array<FlashCard> {
  return pitchClasses
    .map(rootPitchClass => createScaleShapeFlashCard(
      flashCardSetId,
      new Scale(scaleType, rootPitchClass)
      )
    );
}

export function createScaleShapeFlashCard(flashCardSetId: string, scale: Scale): FlashCard {
  const scalePitchMidiNumberNoOctaves = new Set<number>(
    scale.getPitches()
      .map(p => p.midiNumberNoOctave)
  );

  const pressedPitches = wu(getPitchesInRange(pianoKeyboardLowestPitch, pianoKeyboardHighestPitch))
    .filter(p => scalePitchMidiNumberNoOctaves.has(p.midiNumberNoOctave))
    .toArray();

  return new FlashCard(
    createFlashCardId(flashCardSetId, { scale: `${scale.rootPitchClass.toString(false)} ${scale.type.name}` }),
    new FlashCardSide(
      scale.rootPitchClass.toString(false, true) + " " + scale.type.name,
      scale
    ),
    new FlashCardSide(
      size => (
        <PianoKeyboard
          maxWidth={240}
          lowestPitch={pianoKeyboardLowestPitch}
          highestPitch={pianoKeyboardHighestPitch}
          pressedPitches={pressedPitches}
        />
      ),
      pressedPitches
    )
  );
}

const scaleShapesFlashCardSetScaleTypes = [
  ScaleType.Major,
  ScaleType.MelodicMinor,
  ScaleType.DominantDiminished,
  ScaleType.TonicDiminished,
  ScaleType.WholeTone,
  ScaleType.MajorPentatonic
];

const scaleShapeFlashCardSets = scaleShapesFlashCardSetScaleTypes
  .map(createPianoScaleShapesFlashCardSet);

// #endregion Scale Shape Flash Cards

// #region Chord Shape Flash Cards

export function createChordShapeFlashCard(flashCardSetId: string, scale: Scale): FlashCard {
  const pianoKeyboardPitches = getPitchesInRange(pianoKeyboardLowestPitch, pianoKeyboardHighestPitch);

  const chordPitchMidiNumberNoOctaves = new Set<number>(
    scale.getDiatonicChord(1, /*numChordPitches*/4).getPitches()
      .map(p => p.midiNumberNoOctave)
  );

  const highlightedChordPitches = wu(pianoKeyboardPitches)
    .filter(p => chordPitchMidiNumberNoOctaves.has(p.midiNumberNoOctave))
    .toArray();

  const scalePitchMidiNumberNoOctaves = new Set<number>(
    scale.getPitches()
      .map(p => p.midiNumberNoOctave)
  );

  const pressedPitches = wu(pianoKeyboardPitches)
    .filter(p => scalePitchMidiNumberNoOctaves.has(p.midiNumberNoOctave))
    .toArray();

  const highlightFill = "DodgerBlue";

  return new FlashCard(
    createFlashCardId(flashCardSetId, { scale: `${scale.rootPitchClass.toString(false)} ${scale.type.name}` }),
    new FlashCardSide(
      scale.rootPitchClass.toString(false, true) + " " + scale.type.name,
      scale
    ),
    new FlashCardSide(
      size => (
        <PianoKeyboard
          maxWidth={240}
          lowestPitch={pianoKeyboardLowestPitch}
          highestPitch={pianoKeyboardHighestPitch}
          pressedPitches={pressedPitches}
          renderLayeredExtrasFn={metrics => ({
            whiteKeyLayerExtras: renderPianoKeyHighlights(metrics, highlightedChordPitches.filter(p => p.isWhiteKey), highlightFill),
            blackKeyLayerExtras: renderPianoKeyHighlights(metrics, highlightedChordPitches.filter(p => p.isBlackKey), highlightFill)
          })}
        />
      ),
      pressedPitches
    )
  );
}

export function createChordShapesFlashCards(flashCardSetId: string, scaleType: ScaleType): Array<FlashCard> {
  return pitchClasses
    .map(rootPitchClass => createChordShapeFlashCard(
        flashCardSetId,
        new Scale(scaleType, rootPitchClass)
      )
    );
}

export function createChordShapesFlashCardSet(scaleType: ScaleType): FlashCardSet {
  const id = `pianoChordShape${scaleType.id}`;
  const flashCardSet = new FlashCardSet(id, `${scaleType.name} chords`, () => createChordShapesFlashCards(id, scaleType));
  return flashCardSet;
}

const chordShapesFlashCardSetScaleTypes = [
  ScaleType.Major,
  ScaleType.Mixolydian,
  ScaleType.Dorian,
  ScaleType.MelodicMinor
];

const chordShapeFlashCardSets = chordShapesFlashCardSetScaleTypes
  .map(createChordShapesFlashCardSet);

// #endregion Chord Shape Flash Cards

export function PianoVisualization(props: {}): JSX.Element {
  return (
    <Card>
      <h1>Piano Visualization Master Class</h1>
      
      <h3>Notes</h3>

      <p>
        {createStudyFlashCardSetComponent(pianoNotesFlashCardSet, true)}
      </p>

      <h3>Scale Shapes</h3>

      {scaleShapeFlashCardSets
        .map(set => <p>{createStudyFlashCardSetComponent(set, true)}</p>)}

      <h3>Chord Shapes</h3>

      {chordShapeFlashCardSets
        .map(set => <p>{createStudyFlashCardSetComponent(set, true)}</p>)}

    </Card>
  );
}