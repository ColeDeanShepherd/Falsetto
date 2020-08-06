import { Midi } from "@tonejs/midi";

import { addAscendingScale, addDescendingScale, addChord, addAscendingArpeggio, addDescendingArpeggio } from "./MidiGeneration";
import { Scale, ScaleType } from "../TheoryLib/Scale";
import { Pitch } from "../TheoryLib/Pitch";
import { PitchLetter } from "../TheoryLib/PitchLetter";
import { Chord } from "../TheoryLib/Chord";
import { ChordType } from "../TheoryLib/ChordType";

export function createAnalysisTestMidi(): Midi {
  const midi = new Midi();
  midi.header.setTempo(256);

  const testSpacingTicks = midi.header.ppq * 2;

  const track = midi.addTrack();
  addAscendingScale(
    track,
    new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4)),
    /*startTimeTicks*/ 0,
    /*durationTicks*/ midi.header.ppq);
  addDescendingScale(
    track,
    new Scale(ScaleType.Major, new Pitch(PitchLetter.E, 0, 4)),
    /*startTimeTicks*/ track.durationTicks + testSpacingTicks,
    /*durationTicks*/ midi.header.ppq);
  addChord(
    track,
    new Chord(ChordType.Dom7, new Pitch(PitchLetter.A, 0, 3)),
    /*startTimeTicks*/ track.durationTicks + testSpacingTicks,
    /*durationTicks*/ 4 * midi.header.ppq
  );
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