import { Midi, Track } from '@tonejs/midi';
import { Scale } from '../TheoryLib/Scale';
import { reverseIterateArray } from '../Core/ArrayUtils';
import { Chord } from '../TheoryLib/Chord';

export function addAscendingScale(
  midiTrack: Track,
  scale: Scale,
  startTimeTicks: number,
  noteDurationTicks: number
) {
  const scalePitches = scale.getPitches();
  let noteStartTimeTicks = startTimeTicks;

  for (const pitch of scalePitches) {
    const noteEndTimeTicks = noteStartTimeTicks + noteDurationTicks;

    midiTrack.addNote({
      midi: pitch.midiNumber,
      ticks: noteStartTimeTicks,
      durationTicks: noteDurationTicks,
    });

    noteStartTimeTicks = noteEndTimeTicks;
  }
}

export function addDescendingScale(
  midiTrack: Track,
  scale: Scale,
  startTimeTicks: number,
  noteDurationTicks: number
) {
  const scalePitches = scale.getPitches();
  let noteStartTimeTicks = startTimeTicks;

  for (const pitch of reverseIterateArray(scalePitches)) {
    const noteEndTimeTicks = noteStartTimeTicks + noteDurationTicks;

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
  noteDurationTicks: number
) {
  const chordPitches = chord.getPitches();

  for (const pitch of chordPitches) {
    midiTrack.addNote({
      midi: pitch.midiNumber,
      ticks: startTimeTicks,
      durationTicks: noteDurationTicks,
    });
  }
}

export function addAscendingArpeggio(
  midiTrack: Track,
  chord: Chord,
  startTimeTicks: number,
  noteDurationTicks: number
) {
  const scalePitches = chord.getPitches();
  let noteStartTimeTicks = startTimeTicks;

  for (const pitch of scalePitches) {
    const noteEndTimeTicks = noteStartTimeTicks + noteDurationTicks;

    midiTrack.addNote({
      midi: pitch.midiNumber,
      ticks: noteStartTimeTicks,
      durationTicks: noteDurationTicks,
    });

    noteStartTimeTicks = noteEndTimeTicks;
  }
}

export function addDescendingArpeggio(
  midiTrack: Track,
  chord: Chord,
  startTimeTicks: number,
  noteDurationTicks: number
) {
  const scalePitches = chord.getPitches();
  let noteStartTimeTicks = startTimeTicks;

  for (const pitch of reverseIterateArray(scalePitches)) {
    const noteEndTimeTicks = noteStartTimeTicks + noteDurationTicks;

    midiTrack.addNote({
      midi: pitch.midiNumber,
      ticks: noteStartTimeTicks,
      durationTicks: noteDurationTicks,
    });

    noteStartTimeTicks = noteEndTimeTicks;
  }
}