import { Midi, Track } from '@tonejs/midi';
import { Scale } from '../TheoryLib/Scale';
import { reverseIterateArray, sortNumbersAscendingInPlace, repeatElement, arrayMax, arrayMaxSelector } from '../Core/ArrayUtils';
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
  probability: number;
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

      const keyProbabilities = calculateKeyProbabilities(noteStatistics);

      const mostProbableKey = arrayMaxSelector(keyProbabilities, x => x[1]);

      if (mostProbableKey[1] >= 0.8) {
        const detectedKey: DetectedKey = {
          key: mostProbableKey[0],
          tickRange: tickRange,
          probability: mostProbableKey[1]
        };

        registerDetectedKey(analysis.keys, detectedKey);
        
        //const keyProbabilitiesStr = keyProbabilitiesToString(keyProbabilities);
      }
    }
  }

  debugger;
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
    if (tickRange.containsExclusiveMax(note.ticks) || tickRange.containsExclusiveMax(note.ticks + note.durationTicks)) {
      yield note;
    }
  }
}

function calculateKeyProbabilities(noteStatistics: NoteStatistics): Array<[Key, number]> {
  const keys = Key.MajorKeys;
  const keyProbabilities = new Array<[Key, number]>(keys.length);
  
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const probability = calculateKeyProbability(key, noteStatistics);
    keyProbabilities[i] = [key, probability];
  }

  return keyProbabilities;
}

function calculateKeyProbability(key: Key, noteStatistics: NoteStatistics): number {
  const keyPitchClasses = key.getPitchClasses();

  let numDiatonicNotes = 0;
  let numChromaticNotes = 0;
  let numNotes = 0;

  const seenDiatonicPitchClasses = new Set<number>();

  // count diatonic, chromatic, & total notes
  for (let pitchClass = 0; pitchClass < 12; pitchClass++) {
    const numOccurrences = noteStatistics.numOccurrencesPerPitchClass[pitchClass];
    if (numOccurrences === 0) { continue; }
    
    const isInKey = keyPitchClasses.has(pitchClass);

    if (isInKey) {
      numDiatonicNotes += numOccurrences;
      seenDiatonicPitchClasses.add(pitchClass);
    } else {
      numChromaticNotes += numOccurrences;
    }
    
    numNotes += numOccurrences;
  }

  const pctDiatonicPitchesSeen = seenDiatonicPitchClasses.size / keyPitchClasses.size;

  const pctPitchesInKey = (numNotes > 0)
    ? (numDiatonicNotes / numNotes)
    : 0;

  return pctDiatonicPitchesSeen * pctPitchesInKey;
}

function keyProbabilitiesToString(keyProbabilities: Array<[Key, number]>): string {
  return keyProbabilities
    .map(x => `${x[0].toString()}: ${x[1]}`)
    .join('\n');
}

function registerDetectedKey(detectedKeys: Array<DetectedKey>, detectedKey: DetectedKey) {
  // TODO: merge like keys
  
  let previouslyDetectedKeyIndex = 0;

  // skip over keys detected before the new detected key
  while (
    (previouslyDetectedKeyIndex < detectedKeys.length) &&
    (detectedKeys[previouslyDetectedKeyIndex].tickRange.maxValue <= detectedKey.tickRange.minValue)
  ) {
    previouslyDetectedKeyIndex++;
  }
  
  // if we've skipped all the keys, push the new detected key
  if (!(previouslyDetectedKeyIndex < detectedKeys.length)) {
    const detectedKeyWithCorrectTickRange: DetectedKey = {
      key: detectedKey.key,
      tickRange: detectedKey.tickRange,
      probability: detectedKey.probability
    };
    detectedKeys.push(detectedKeyWithCorrectTickRange);
    return;
  }

  // iterate over all keys intersecting with newly detected key
  // replace intersecting keys if probability lower
  let tickRangeToRegister = new NumberRange(detectedKey.tickRange.minValue, detectedKey.tickRange.minValue);

  while (
    (previouslyDetectedKeyIndex < detectedKeys.length) &&
    (detectedKeys[previouslyDetectedKeyIndex].tickRange.intersectsRangeExclusiveMax(detectedKey.tickRange))
  ) {
    const previouslyDetectedKey = detectedKeys[previouslyDetectedKeyIndex];

    // if the newly detected key's probability is higher than the previously detected key's probability,
    // then we need to update the analysis
    if (previouslyDetectedKey.probability < detectedKey.probability) {
      tickRangeToRegister.maxValue = previouslyDetectedKey.tickRange.maxValue;

      // remove the previously detected key if it's fully contained by the newly detected key
      if (detectedKey.tickRange.fullyContainsRangeExclusiveMax(previouslyDetectedKey.tickRange)) {
        detectedKeys.splice(previouslyDetectedKeyIndex, 1);
      }
      // if the newly detected key's min ticks is inside the previously detected key's tick range,
      // update the previously detected key's max ticks
      else if (detectedKey.tickRange.minValue > previouslyDetectedKey.tickRange.minValue) {
        previouslyDetectedKey.tickRange.maxValue = detectedKey.tickRange.minValue;
        previouslyDetectedKeyIndex++;
      }
      // if the newly detected key's max ticks is inside the previously detected key's tick range,
      // update the previously detected key's min ticks and break out of the loop
      else if (detectedKey.tickRange.minValue > previouslyDetectedKey.tickRange.minValue) {
        previouslyDetectedKey.tickRange.minValue = detectedKey.tickRange.maxValue;
        previouslyDetectedKeyIndex++;
        break;
      }
    }
    // if the newly detected key's probability isn't higher than the previously detected key's probability,
    // then we need to update the current tick range to register and maybe insert it
    else {
      if (!tickRangeToRegister.isEmptyExclusiveMax()) {
        const detectedKeyWithCorrectTickRange: DetectedKey = {
          key: detectedKey.key,
          tickRange: tickRangeToRegister,
          probability: detectedKey.probability
        };
        detectedKeys.splice(previouslyDetectedKeyIndex, 0, detectedKeyWithCorrectTickRange);
      }

      tickRangeToRegister = new NumberRange(previouslyDetectedKey.tickRange.maxValue, previouslyDetectedKey.tickRange.maxValue);
      
      previouslyDetectedKeyIndex++;
    }
  }
}

export function getDetectedKeyAtTicks(analysis: MidiNotesAnalysis, ticks: number): Key | undefined {
  for (const detectedKey of analysis.keys) {
    if (detectedKey.tickRange.containsExclusiveMax(ticks)) {
      return detectedKey.key;
    }
  }

  return undefined;
}

// #endregion Helper Functions