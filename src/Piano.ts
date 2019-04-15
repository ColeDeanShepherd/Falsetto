import { Pitch } from "./Pitch";
import { playSoundsSequentially, playSoundsSimultaneously } from './Audio';

export const pianoAudioFilePathsByMidiNumber = new Array<[number, string]>();
pianoAudioFilePathsByMidiNumber.push([21, "audio/piano/A0.mp3"]);
pianoAudioFilePathsByMidiNumber.push([22, "audio/piano/As0.mp3"]);
pianoAudioFilePathsByMidiNumber.push([23, "audio/piano/B0.mp3"]);
pianoAudioFilePathsByMidiNumber.push([24, "audio/piano/C1.mp3"]);
pianoAudioFilePathsByMidiNumber.push([25, "audio/piano/Cs1.mp3"]);
pianoAudioFilePathsByMidiNumber.push([26, "audio/piano/D1.mp3"]);
pianoAudioFilePathsByMidiNumber.push([27, "audio/piano/Ds1.mp3"]);
pianoAudioFilePathsByMidiNumber.push([28, "audio/piano/E1.mp3"]);
pianoAudioFilePathsByMidiNumber.push([29, "audio/piano/F1.mp3"]);
pianoAudioFilePathsByMidiNumber.push([30, "audio/piano/Fs1.mp3"]);
pianoAudioFilePathsByMidiNumber.push([31, "audio/piano/G1.mp3"]);
pianoAudioFilePathsByMidiNumber.push([32, "audio/piano/Gs1.mp3"]);
pianoAudioFilePathsByMidiNumber.push([33, "audio/piano/A1.mp3"]);
pianoAudioFilePathsByMidiNumber.push([34, "audio/piano/As1.mp3"]);
pianoAudioFilePathsByMidiNumber.push([35, "audio/piano/B1.mp3"]);
pianoAudioFilePathsByMidiNumber.push([36, "audio/piano/C2.mp3"]);
pianoAudioFilePathsByMidiNumber.push([37, "audio/piano/Cs2.mp3"]);
pianoAudioFilePathsByMidiNumber.push([38, "audio/piano/D2.mp3"]);
pianoAudioFilePathsByMidiNumber.push([39, "audio/piano/Ds2.mp3"]);
pianoAudioFilePathsByMidiNumber.push([40, "audio/piano/E2.mp3"]);
pianoAudioFilePathsByMidiNumber.push([41, "audio/piano/F2.mp3"]);
pianoAudioFilePathsByMidiNumber.push([42, "audio/piano/Fs2.mp3"]);
pianoAudioFilePathsByMidiNumber.push([43, "audio/piano/G2.mp3"]);
pianoAudioFilePathsByMidiNumber.push([44, "audio/piano/Gs2.mp3"]);
pianoAudioFilePathsByMidiNumber.push([45, "audio/piano/A2.mp3"]);
pianoAudioFilePathsByMidiNumber.push([46, "audio/piano/As2.mp3"]);
pianoAudioFilePathsByMidiNumber.push([47, "audio/piano/B2.mp3"]);
pianoAudioFilePathsByMidiNumber.push([48, "audio/piano/C3.mp3"]);
pianoAudioFilePathsByMidiNumber.push([49, "audio/piano/Cs3.mp3"]);
pianoAudioFilePathsByMidiNumber.push([50, "audio/piano/D3.mp3"]);
pianoAudioFilePathsByMidiNumber.push([51, "audio/piano/Ds3.mp3"]);
pianoAudioFilePathsByMidiNumber.push([52, "audio/piano/E3.mp3"]);
pianoAudioFilePathsByMidiNumber.push([53, "audio/piano/F3.mp3"]);
pianoAudioFilePathsByMidiNumber.push([54, "audio/piano/Fs3.mp3"]);
pianoAudioFilePathsByMidiNumber.push([55, "audio/piano/G3.mp3"]);
pianoAudioFilePathsByMidiNumber.push([56, "audio/piano/Gs3.mp3"]);
pianoAudioFilePathsByMidiNumber.push([57, "audio/piano/A3.mp3"]);
pianoAudioFilePathsByMidiNumber.push([58, "audio/piano/As3.mp3"]);
pianoAudioFilePathsByMidiNumber.push([59, "audio/piano/B3.mp3"]);
pianoAudioFilePathsByMidiNumber.push([60, "audio/piano/C4.mp3"]);
pianoAudioFilePathsByMidiNumber.push([61, "audio/piano/Cs4.mp3"]);
pianoAudioFilePathsByMidiNumber.push([62, "audio/piano/D4.mp3"]);
pianoAudioFilePathsByMidiNumber.push([63, "audio/piano/Ds4.mp3"]);
pianoAudioFilePathsByMidiNumber.push([64, "audio/piano/E4.mp3"]);
pianoAudioFilePathsByMidiNumber.push([65, "audio/piano/F4.mp3"]);
pianoAudioFilePathsByMidiNumber.push([66, "audio/piano/Fs4.mp3"]);
pianoAudioFilePathsByMidiNumber.push([67, "audio/piano/G4.mp3"]);
pianoAudioFilePathsByMidiNumber.push([68, "audio/piano/Gs4.mp3"]);
pianoAudioFilePathsByMidiNumber.push([69, "audio/piano/A4.mp3"]);
pianoAudioFilePathsByMidiNumber.push([70, "audio/piano/As4.mp3"]);
pianoAudioFilePathsByMidiNumber.push([71, "audio/piano/B4.mp3"]);
pianoAudioFilePathsByMidiNumber.push([72, "audio/piano/C5.mp3"]);
pianoAudioFilePathsByMidiNumber.push([73, "audio/piano/Cs5.mp3"]);
pianoAudioFilePathsByMidiNumber.push([74, "audio/piano/D5.mp3"]);
pianoAudioFilePathsByMidiNumber.push([75, "audio/piano/Ds5.mp3"]);
pianoAudioFilePathsByMidiNumber.push([76, "audio/piano/E5.mp3"]);
pianoAudioFilePathsByMidiNumber.push([77, "audio/piano/F5.mp3"]);
pianoAudioFilePathsByMidiNumber.push([78, "audio/piano/Fs5.mp3"]);
pianoAudioFilePathsByMidiNumber.push([79, "audio/piano/G5.mp3"]);
pianoAudioFilePathsByMidiNumber.push([80, "audio/piano/Gs5.mp3"]);
pianoAudioFilePathsByMidiNumber.push([81, "audio/piano/A5.mp3"]);
pianoAudioFilePathsByMidiNumber.push([82, "audio/piano/As5.mp3"]);
pianoAudioFilePathsByMidiNumber.push([83, "audio/piano/B5.mp3"]);
pianoAudioFilePathsByMidiNumber.push([84, "audio/piano/C6.mp3"]);
pianoAudioFilePathsByMidiNumber.push([85, "audio/piano/Cs6.mp3"]);
pianoAudioFilePathsByMidiNumber.push([86, "audio/piano/D6.mp3"]);
pianoAudioFilePathsByMidiNumber.push([87, "audio/piano/Ds6.mp3"]);
pianoAudioFilePathsByMidiNumber.push([88, "audio/piano/E6.mp3"]);
pianoAudioFilePathsByMidiNumber.push([89, "audio/piano/F6.mp3"]);
pianoAudioFilePathsByMidiNumber.push([90, "audio/piano/Fs6.mp3"]);
pianoAudioFilePathsByMidiNumber.push([91, "audio/piano/G6.mp3"]);
pianoAudioFilePathsByMidiNumber.push([92, "audio/piano/Gs6.mp3"]);
pianoAudioFilePathsByMidiNumber.push([93, "audio/piano/A6.mp3"]);
pianoAudioFilePathsByMidiNumber.push([94, "audio/piano/As6.mp3"]);
pianoAudioFilePathsByMidiNumber.push([95, "audio/piano/B6.mp3"]);
pianoAudioFilePathsByMidiNumber.push([96, "audio/piano/C7.mp3"]);
pianoAudioFilePathsByMidiNumber.push([97, "audio/piano/Cs7.mp3"]);
pianoAudioFilePathsByMidiNumber.push([98, "audio/piano/D7.mp3"]);
pianoAudioFilePathsByMidiNumber.push([99, "audio/piano/Ds7.mp3"]);
pianoAudioFilePathsByMidiNumber.push([100, "audio/piano/E7.mp3"]);
pianoAudioFilePathsByMidiNumber.push([101, "audio/piano/F7.mp3"]);
pianoAudioFilePathsByMidiNumber.push([102, "audio/piano/Fs7.mp3"]);
pianoAudioFilePathsByMidiNumber.push([103, "audio/piano/G7.mp3"]);
pianoAudioFilePathsByMidiNumber.push([104, "audio/piano/Gs7.mp3"]);
pianoAudioFilePathsByMidiNumber.push([105, "audio/piano/A7.mp3"]);
pianoAudioFilePathsByMidiNumber.push([106, "audio/piano/As7.mp3"]);
pianoAudioFilePathsByMidiNumber.push([107, "audio/piano/B7.mp3"]);
pianoAudioFilePathsByMidiNumber.push([108, "audio/piano/C8.mp3"]);

export function getPitchAudioFilePath(pitch: Pitch): string | null {
  const kvp = pianoAudioFilePathsByMidiNumber
    .find(x => x[0] === pitch.midiNumber);
  if (!kvp) { return null; }

  return kvp[1];
}

export function playPitches(pitches: Array<Pitch>) {
  const soundFilePaths = pitches
    .map(getPitchAudioFilePath)
    .filter(fp => fp !== null)
    .map(fp => fp as string);

  playSoundsSimultaneously(soundFilePaths);
}

// returns: a cancellation function
export function playPitchesSequentially(pitches: Array<Pitch>, delayInMs: number, cutOffSounds: boolean = false): () => void {
  const soundFilePaths = pitches
    .map(getPitchAudioFilePath);
  
  return playSoundsSequentially(soundFilePaths, delayInMs, cutOffSounds);
}