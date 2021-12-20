import * as React from "react";

import { createStudyFlashCardSetComponent } from '../../ui/StudyFlashCards/View';
import { Card } from "../../ui/Card/Card";
import { Scale, ScaleType } from "../../lib/TheoryLib/Scale";
import { FlashCardSet } from "../../FlashCardSet";
import { FlashCard, FlashCardSide } from "../../FlashCard";
import { commonKeyPitchesOctave0 } from "../../lib/TheoryLib/Key";
import { PianoKeyboard, renderPianoKeyHighlights as renderPianoKeyHighlights } from "../Utils/PianoKeyboard";
import { PitchLetter } from "../../lib/TheoryLib/PitchLetter";
import { getPitchRange, Pitch } from "../../lib/TheoryLib/Pitch";
import { flashCardSet as pianoNotesFlashCardSet } from '../Quizzes/Notes/PianoNotes';

const pianoKeyboardLowestPitch = new Pitch(PitchLetter.C, 0, 4);
const pianoKeyboardHighestPitch = new Pitch(PitchLetter.B, 0, 5);

// #region Scale Shape Flash Cards

export function createPianoScaleShapesFlashCardSet(scaleType: ScaleType): FlashCardSet {
  const id = `pianoScaleShape${scaleType.id}`;
  const flashCardSet = new FlashCardSet(id, `${scaleType.name} Scales`, () => createScaleShapesFlashCards(id, scaleType));
  return flashCardSet;
}

export function createScaleShapesFlashCards(flashCardSetId: string, scaleType: ScaleType): Array<FlashCard> {
  return commonKeyPitchesOctave0
    .map(rootPitch => createScaleShapeFlashCard(flashCardSetId, new Scale(scaleType, rootPitch)));
}

export function createScaleShapeFlashCard(flashCardSetId: string, scale: Scale): FlashCard {
  const deserializedId = {
    set: flashCardSetId,
    scale: `${scale.rootPitch.toString(false)} ${scale.type.name}`
  };
  const id = JSON.stringify(deserializedId);

  const scalePitchMidiNumberNoOcttaves = new Set<number>(
    scale.getPitches()
      .map(p => p.midiNumberNoOctave)
  );

  const pressedPitches = getPitchRange(pianoKeyboardLowestPitch, pianoKeyboardHighestPitch)
    .filter(p => scalePitchMidiNumberNoOcttaves.has(p.midiNumberNoOctave));

  return new FlashCard(
    id,
    new FlashCardSide(
      scale.rootPitch.toString(false, true) + " " + scale.type.name,
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
  const deserializedId = {
    set: flashCardSetId,
    scale: `${scale.rootPitch.toString(false)} ${scale.type.name}`
  };
  const id = JSON.stringify(deserializedId);

  const pianoKeyboardPitches = getPitchRange(pianoKeyboardLowestPitch, pianoKeyboardHighestPitch);

  const chordPitchMidiNumberNoOctaves = new Set<number>(
    scale.getDiatonicChord(1, /*numChordPitches*/4).getPitches()
      .map(p => p.midiNumberNoOctave)
  );

  const highlightedChordPitches = pianoKeyboardPitches
    .filter(p => chordPitchMidiNumberNoOctaves.has(p.midiNumberNoOctave));

  const scalePitchMidiNumberNoOctaves = new Set<number>(
    scale.getPitches()
      .map(p => p.midiNumberNoOctave)
  );

  const pressedPitches = pianoKeyboardPitches
    .filter(p => scalePitchMidiNumberNoOctaves.has(p.midiNumberNoOctave));

  const highlightFill = "DodgerBlue";

  return new FlashCard(
    id,
    new FlashCardSide(
      scale.rootPitch.toString(false, true) + " " + scale.type.name,
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
  return commonKeyPitchesOctave0
    .map(rootPitch => createChordShapeFlashCard(flashCardSetId, new Scale(scaleType, rootPitch)));
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