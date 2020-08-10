import { Midi, Track } from '@tonejs/midi';
import { Scale } from '../TheoryLib/Scale';
import { reverseIterateArray, sortNumbersAscendingInPlace, repeatElement } from '../Core/ArrayUtils';
import { Chord } from '../TheoryLib/Chord';
import { Pitch } from "../TheoryLib/Pitch";
import { NumberRange } from '../Core/NumberRange';
import { Key } from "../TheoryLib/Key";

export interface NoteStatistics {
  numOccurrencesPerPitchClass: Array<number>;
}

export interface DetectedKey {
  key: Key;
  tickRange: NumberRange;
}

export interface MidiNotesAnalysis {
  keys: Array<DetectedKey>;
}

export function analyzeMidiNotes(midi: Midi): MidiNotesAnalysis {
  const analysis: MidiNotesAnalysis = {
    keys: []
  };

  // detect keys
  {
    // try to find the largest ranges of time when detecting keys
    // can have multiple notes at the same time, but we don't want to consider only some of them
    // so we need to look at distinct times
    // iterate through time ranges
    const orderedDistinctNoteStartEndTicks = getOrderedDistinctNoteStartEndTicks(midi);
    const combinedTrack = combineTracks(midi);

    for (const tickRange of generateAllTickRanges(orderedDistinctNoteStartEndTicks)) {
      const noteStatistics: NoteStatistics = {
        numOccurrencesPerPitchClass: repeatElement(0, 12)
      };

      // get notes in tick range
      for (const note of generateNotesInTickRange(combinedTrack, tickRange)) {
        const pitch = Pitch.createFromMidiNumber(note.midi);
        noteStatistics.numOccurrencesPerPitchClass[pitch.class]++;
      }

      console.log(tickRange, noteStatistics);
    }
  }

  return analysis;
}

// #region Helper Functions

function getOrderedDistinctNoteStartEndTicks(midi: Midi): Array<number> {
   // get distinct note start/end ticks
   const distinctNoteStartEndTicks = new Set<number>();

   for (const track of midi.tracks) {
     for (const note of track.notes) {
       distinctNoteStartEndTicks.add(note.ticks);
       distinctNoteStartEndTicks.add(note.ticks + note.durationTicks);
     }
   }

   // order note start/end ticks
   const orderedDistinctNoteStartEndTicks = new Array<number>(...distinctNoteStartEndTicks);
   sortNumbersAscendingInPlace(orderedDistinctNoteStartEndTicks);

   // return the result
   return orderedDistinctNoteStartEndTicks;
}

function* generateAllTickRanges(ticks: Array<number>) {
  for (let i = 0; i < (ticks.length - 1); i++) {
    for (let j = i + 1; j < ticks.length; j++) {
      yield new NumberRange(ticks[i], ticks[j]);
    }
  }
}

function combineTracks(midi: Midi): Track {
  const combinedTrack = new Track(/*trackData*/ undefined, midi.header);

  for (const track of midi.tracks) {
    for (const note of track.notes) {
      combinedTrack.addNote(note);
    }
  }

  return combinedTrack;
}

function* generateNotesInTickRange(track: Track, tickRange: NumberRange) {
  for (const note of track.notes) {
    if (tickRange.contains(note.ticks) || tickRange.contains(note.ticks + note.durationTicks)) {
      yield note;
    }
  }
}

// #endregion Helper Functions