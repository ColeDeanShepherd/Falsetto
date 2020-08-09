import { Midi, Track } from '@tonejs/midi';
import { Scale } from '../TheoryLib/Scale';
import { reverseIterateArray } from '../Core/ArrayUtils';
import { Chord } from '../TheoryLib/Chord';
import { Pitch } from "../TheoryLib/Pitch";

export function addAscendingScale(
  midiTrack: Track,
  scale: Scale,
  startTimeTicks: number,
  noteDurationTicks: number
) {
  const scalePitches = scale.getPitches();
  addSequentialPitches(midiTrack, scalePitches, startTimeTicks, noteDurationTicks);
}

export function addDescendingScale(
  midiTrack: Track,
  scale: Scale,
  startTimeTicks: number,
  noteDurationTicks: number
) {
  const scalePitches = scale.getPitches();
  addSequentialPitches(midiTrack, reverseIterateArray(scalePitches), startTimeTicks, noteDurationTicks);
}

export function addSequentialPitches(
  midiTrack: Track,
  pitches: Iterable<Pitch>,
  startTimeTicks: number,
  noteDurationTicks: number,
  noteSpacingTicks?: number
) {
  noteSpacingTicks = (noteSpacingTicks !== undefined) ? noteSpacingTicks : noteDurationTicks;

  let noteStartTimeTicks = startTimeTicks;

  for (const pitch of pitches) {
    const noteEndTimeTicks = noteStartTimeTicks + noteSpacingTicks;

    midiTrack.addNote({
      midi: pitch.midiNumber,
      ticks: noteStartTimeTicks,
      durationTicks: noteDurationTicks,
    });

    noteStartTimeTicks = noteEndTimeTicks;
  }
}

export function addChord(
  midiTrack: Track,
  chord: Chord,
  startTimeTicks: number,
  noteDurationTicks: number,
  inversion?: number
) {
  const chordPitches = chord.getPitches();
  addSequentialPitches(midiTrack, chordPitches, startTimeTicks, noteDurationTicks, /*noteSpacingTicks*/0);
}

export function addAscendingArpeggio(
  midiTrack: Track,
  chord: Chord,
  startTimeTicks: number,
  noteDurationTicks: number
) {
  const chordPitches = chord.getPitches();
  addSequentialPitches(midiTrack, chordPitches, startTimeTicks, noteDurationTicks);
}

export function addDescendingArpeggio(
  midiTrack: Track,
  chord: Chord,
  startTimeTicks: number,
  noteDurationTicks: number
) {
  const chordPitches = chord.getPitches();
  addSequentialPitches(midiTrack, reverseIterateArray(chordPitches), startTimeTicks, noteDurationTicks);
}