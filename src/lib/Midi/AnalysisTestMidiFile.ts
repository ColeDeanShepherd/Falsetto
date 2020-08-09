import { Midi, Track } from "@tonejs/midi";
import * as _ from "lodash";

import { addAscendingScale, addDescendingScale, addChord, addAscendingArpeggio, addDescendingArpeggio, addSequentialPitches } from './MidiGeneration';
import { Scale, ScaleType } from "../TheoryLib/Scale";
import { Pitch, invertPitches } from '../TheoryLib/Pitch';
import { PitchLetter } from "../TheoryLib/PitchLetter";
import { Chord, getNeapolitanChord } from '../TheoryLib/Chord';
import { ChordType } from "../TheoryLib/ChordType";

function addTwoHanded251(
  midiTrack: Track,
  scale: Scale,
  startTimeTicks: number,
  chordDurationTicks: number
) {
  const chords = [
    scale.getDiatonicChord(2, 4),
    scale.getDiatonicChord(5, 4),
    scale.getDiatonicChord(1, 4)
  ];

  for (const chord of chords) {
    chord.rootPitch.octaveNumber -= 2;
  }

  let chordStartTimeTicks = startTimeTicks;

  for (const chord of chords) {
    const chordEndTimeTicks = chordStartTimeTicks + chordDurationTicks;

    addChord(midiTrack, chord, chordStartTimeTicks, chordDurationTicks);
    addAscendingScale(midiTrack, scale, chordStartTimeTicks, chordDurationTicks / scale.type.numPitches);

    chordStartTimeTicks = chordEndTimeTicks;
  }
}

function addTwoHandedNeapolitan651(
  midiTrack: Track,
  scale: Scale,
  startTimeTicks: number,
  chordDurationTicks: number
) {
  scale.rootPitch.octaveNumber -= 2;

  const neapolitanChord = getNeapolitanChord(scale);

  const neapolitanSixthPitches = neapolitanChord.getPitches();
  invertPitches(neapolitanSixthPitches, 1)

  const chordsPitches = [
    neapolitanSixthPitches,
    scale.getDiatonicChord(5, 4).getPitches(),
    scale.getDiatonicChord(1, 4).getPitches()
  ];

  scale.rootPitch.octaveNumber += 2;

  let chordStartTimeTicks = startTimeTicks;

  for (const chordPitches of chordsPitches) {
    const chordEndTimeTicks = chordStartTimeTicks + chordDurationTicks;

    addSequentialPitches(midiTrack, chordPitches, chordStartTimeTicks, chordDurationTicks, /*noteSpacingTicks*/ 0);
    addAscendingScale(midiTrack, scale, chordStartTimeTicks, chordDurationTicks / scale.type.numPitches);

    chordStartTimeTicks = chordEndTimeTicks;
  }
}

export function createAnalysisTestMidi(): Midi {
  const midi = new Midi();
  midi.header.setTempo(256);

  const testSpacingTicks = midi.header.ppq * 2;

  const track = midi.addTrack();

  addTwoHanded251(
    track,
    new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 5)),
    /*startTimeTicks*/ 0,
    /*durationTicks*/ 8 * midi.header.ppq);

  addTwoHanded251(
    track,
    new Scale(ScaleType.Major, new Pitch(PitchLetter.E, 0, 4)),
    /*startTimeTicks*/ track.durationTicks + testSpacingTicks,
    /*durationTicks*/ 8 * midi.header.ppq);
    
  addTwoHandedNeapolitan651(
    track,
    new Scale(ScaleType.Aeolian, new Pitch(PitchLetter.F, 0, 4)),
    /*startTimeTicks*/ track.durationTicks + testSpacingTicks,
    /*durationTicks*/ 8 * midi.header.ppq);
  
  addAscendingScale(
    track,
    new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4)),
    /*startTimeTicks*/ track.durationTicks + testSpacingTicks,
    /*durationTicks*/ midi.header.ppq);

  addDescendingScale(
    track,
    new Scale(ScaleType.Major, new Pitch(PitchLetter.E, 0, 4)),
    /*startTimeTicks*/ track.durationTicks + testSpacingTicks,
    /*durationTicks*/ midi.header.ppq);
    
  // shuffled scale
  addSequentialPitches(
    track,
    _.shuffle((new Scale(ScaleType.Mixolydian, new Pitch(PitchLetter.F, 0, 4))).getPitches()),
    /*startTimeTicks*/ track.durationTicks + testSpacingTicks,
    /*durationTicks*/ midi.header.ppq);
    
  // scale with chromatic notes
  {
    const scale = new Scale(ScaleType.Aeolian, new Pitch(PitchLetter.A, 0, 4));
    const pitches = scale.getPitches();

    // add flat 5
    pitches.splice(4, 0, new Pitch(PitchLetter.E, -1, 5));

    // add sharp 7
    pitches.splice(8, 0, new Pitch(PitchLetter.G, 1, 5));
    
    addSequentialPitches(
      track,
      pitches,
      /*startTimeTicks*/ track.durationTicks + testSpacingTicks,
      /*durationTicks*/ midi.header.ppq);
  }

  // chromatic scale
  addAscendingScale(
    track,
    new Scale(ScaleType.Chromatic, new Pitch(PitchLetter.C, 0, 4)),
    /*startTimeTicks*/ track.durationTicks + testSpacingTicks,
    /*durationTicks*/ midi.header.ppq);

  addChord(
    track,
    new Chord(ChordType.Dom7, new Pitch(PitchLetter.A, 0, 3)),
    /*startTimeTicks*/ track.durationTicks + testSpacingTicks,
    /*durationTicks*/ 4 * midi.header.ppq
  );

  // staggered chord
  addSequentialPitches(
    track,
    (new Chord(ChordType.Dom7, new Pitch(PitchLetter.A, 0, 3))).getPitches(),
    /*startTimeTicks*/ track.durationTicks + testSpacingTicks,
    /*durationTicks*/ 4 * midi.header.ppq,
    /*noteSpacingTicks*/ midi.header.ppq / 2
  );
  
  // chord inversions
  for (let i = 1; i < 4; i++) {
    const pitches = (new Chord(ChordType.Min7, new Pitch(PitchLetter.B, 0, 3))).getPitches();
    invertPitches(pitches, i);

    addSequentialPitches(
      track,
      pitches,
      /*startTimeTicks*/ track.durationTicks + testSpacingTicks,
      /*durationTicks*/ 4 * midi.header.ppq,
      /*noteSpacingTicks*/ 0
    );
  }

  addAscendingArpeggio(
    track,
    new Chord(ChordType.Dom7, new Pitch(PitchLetter.F, 0, 3)),
    /*startTimeTicks*/ track.durationTicks + testSpacingTicks,
    /*durationTicks*/ midi.header.ppq
  );

  addDescendingArpeggio(
    track,
    new Chord(ChordType.Dom7, new Pitch(PitchLetter.G, 0, 3)),
    /*startTimeTicks*/ track.durationTicks + testSpacingTicks,
    /*durationTicks*/ midi.header.ppq
  );

  return midi;
}