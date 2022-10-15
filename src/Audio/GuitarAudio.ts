import { Howl } from "howler";
import { Pitch } from "../lib/TheoryLib/Pitch";
import { loadAndPlaySoundsSequentially, loadAndPlaySoundsSimultaneously } from './Audio';
import { IPitchesAudio } from "./IPitchesAudio";

export const GuitarPitchesAudio: IPitchesAudio = {
  getAudioFilePath: getPitchAudioFilePath
};

export const guitarAudioFilePathsByMidiNumber = new Array<[number, string]>();
guitarAudioFilePathsByMidiNumber.push([21, "/audio/guitar/A0.mp3"]);
guitarAudioFilePathsByMidiNumber.push([22, "/audio/guitar/As0.mp3"]);
guitarAudioFilePathsByMidiNumber.push([23, "/audio/guitar/B0.mp3"]);
guitarAudioFilePathsByMidiNumber.push([24, "/audio/guitar/C1.mp3"]);
guitarAudioFilePathsByMidiNumber.push([25, "/audio/guitar/Cs1.mp3"]);
guitarAudioFilePathsByMidiNumber.push([26, "/audio/guitar/D1.mp3"]);
guitarAudioFilePathsByMidiNumber.push([27, "/audio/guitar/Ds1.mp3"]);
guitarAudioFilePathsByMidiNumber.push([28, "/audio/guitar/E1.mp3"]);
guitarAudioFilePathsByMidiNumber.push([29, "/audio/guitar/F1.mp3"]);
guitarAudioFilePathsByMidiNumber.push([30, "/audio/guitar/Fs1.mp3"]);
guitarAudioFilePathsByMidiNumber.push([31, "/audio/guitar/G1.mp3"]);
guitarAudioFilePathsByMidiNumber.push([32, "/audio/guitar/Gs1.mp3"]);
guitarAudioFilePathsByMidiNumber.push([33, "/audio/guitar/A1.mp3"]);
guitarAudioFilePathsByMidiNumber.push([34, "/audio/guitar/As1.mp3"]);
guitarAudioFilePathsByMidiNumber.push([35, "/audio/guitar/B1.mp3"]);
guitarAudioFilePathsByMidiNumber.push([36, "/audio/guitar/C2.mp3"]);
guitarAudioFilePathsByMidiNumber.push([37, "/audio/guitar/Cs2.mp3"]);
guitarAudioFilePathsByMidiNumber.push([38, "/audio/guitar/D2.mp3"]);
guitarAudioFilePathsByMidiNumber.push([39, "/audio/guitar/Ds2.mp3"]);
guitarAudioFilePathsByMidiNumber.push([40, "/audio/guitar/E2.mp3"]);
guitarAudioFilePathsByMidiNumber.push([41, "/audio/guitar/F2.mp3"]);
guitarAudioFilePathsByMidiNumber.push([42, "/audio/guitar/Fs2.mp3"]);
guitarAudioFilePathsByMidiNumber.push([43, "/audio/guitar/G2.mp3"]);
guitarAudioFilePathsByMidiNumber.push([44, "/audio/guitar/Gs2.mp3"]);
guitarAudioFilePathsByMidiNumber.push([45, "/audio/guitar/A2.mp3"]);
guitarAudioFilePathsByMidiNumber.push([46, "/audio/guitar/As2.mp3"]);
guitarAudioFilePathsByMidiNumber.push([47, "/audio/guitar/B2.mp3"]);
guitarAudioFilePathsByMidiNumber.push([48, "/audio/guitar/C3.mp3"]);
guitarAudioFilePathsByMidiNumber.push([49, "/audio/guitar/Cs3.mp3"]);
guitarAudioFilePathsByMidiNumber.push([50, "/audio/guitar/D3.mp3"]);
guitarAudioFilePathsByMidiNumber.push([51, "/audio/guitar/Ds3.mp3"]);
guitarAudioFilePathsByMidiNumber.push([52, "/audio/guitar/E3.mp3"]);
guitarAudioFilePathsByMidiNumber.push([53, "/audio/guitar/F3.mp3"]);
guitarAudioFilePathsByMidiNumber.push([54, "/audio/guitar/Fs3.mp3"]);
guitarAudioFilePathsByMidiNumber.push([55, "/audio/guitar/G3.mp3"]);
guitarAudioFilePathsByMidiNumber.push([56, "/audio/guitar/Gs3.mp3"]);
guitarAudioFilePathsByMidiNumber.push([57, "/audio/guitar/A3.mp3"]);
guitarAudioFilePathsByMidiNumber.push([58, "/audio/guitar/As3.mp3"]);
guitarAudioFilePathsByMidiNumber.push([59, "/audio/guitar/B3.mp3"]);
guitarAudioFilePathsByMidiNumber.push([60, "/audio/guitar/C4.mp3"]);
guitarAudioFilePathsByMidiNumber.push([61, "/audio/guitar/Cs4.mp3"]);
guitarAudioFilePathsByMidiNumber.push([62, "/audio/guitar/D4.mp3"]);
guitarAudioFilePathsByMidiNumber.push([63, "/audio/guitar/Ds4.mp3"]);
guitarAudioFilePathsByMidiNumber.push([64, "/audio/guitar/E4.mp3"]);
guitarAudioFilePathsByMidiNumber.push([65, "/audio/guitar/F4.mp3"]);
guitarAudioFilePathsByMidiNumber.push([66, "/audio/guitar/Fs4.mp3"]);
guitarAudioFilePathsByMidiNumber.push([67, "/audio/guitar/G4.mp3"]);
guitarAudioFilePathsByMidiNumber.push([68, "/audio/guitar/Gs4.mp3"]);
guitarAudioFilePathsByMidiNumber.push([69, "/audio/guitar/A4.mp3"]);
guitarAudioFilePathsByMidiNumber.push([70, "/audio/guitar/As4.mp3"]);
guitarAudioFilePathsByMidiNumber.push([71, "/audio/guitar/B4.mp3"]);
guitarAudioFilePathsByMidiNumber.push([72, "/audio/guitar/C5.mp3"]);
guitarAudioFilePathsByMidiNumber.push([73, "/audio/guitar/Cs5.mp3"]);
guitarAudioFilePathsByMidiNumber.push([74, "/audio/guitar/D5.mp3"]);
guitarAudioFilePathsByMidiNumber.push([75, "/audio/guitar/Ds5.mp3"]);
guitarAudioFilePathsByMidiNumber.push([76, "/audio/guitar/E5.mp3"]);
guitarAudioFilePathsByMidiNumber.push([77, "/audio/guitar/F5.mp3"]);
guitarAudioFilePathsByMidiNumber.push([78, "/audio/guitar/Fs5.mp3"]);
guitarAudioFilePathsByMidiNumber.push([79, "/audio/guitar/G5.mp3"]);
guitarAudioFilePathsByMidiNumber.push([80, "/audio/guitar/Gs5.mp3"]);
guitarAudioFilePathsByMidiNumber.push([81, "/audio/guitar/A5.mp3"]);
guitarAudioFilePathsByMidiNumber.push([82, "/audio/guitar/As5.mp3"]);
guitarAudioFilePathsByMidiNumber.push([83, "/audio/guitar/B5.mp3"]);
guitarAudioFilePathsByMidiNumber.push([84, "/audio/guitar/C6.mp3"]);
guitarAudioFilePathsByMidiNumber.push([85, "/audio/guitar/Cs6.mp3"]);
guitarAudioFilePathsByMidiNumber.push([86, "/audio/guitar/D6.mp3"]);
guitarAudioFilePathsByMidiNumber.push([87, "/audio/guitar/Ds6.mp3"]);
guitarAudioFilePathsByMidiNumber.push([88, "/audio/guitar/E6.mp3"]);
guitarAudioFilePathsByMidiNumber.push([89, "/audio/guitar/F6.mp3"]);
guitarAudioFilePathsByMidiNumber.push([90, "/audio/guitar/Fs6.mp3"]);
guitarAudioFilePathsByMidiNumber.push([91, "/audio/guitar/G6.mp3"]);
guitarAudioFilePathsByMidiNumber.push([92, "/audio/guitar/Gs6.mp3"]);
guitarAudioFilePathsByMidiNumber.push([93, "/audio/guitar/A6.mp3"]);
guitarAudioFilePathsByMidiNumber.push([94, "/audio/guitar/As6.mp3"]);
guitarAudioFilePathsByMidiNumber.push([95, "/audio/guitar/B6.mp3"]);
guitarAudioFilePathsByMidiNumber.push([96, "/audio/guitar/C7.mp3"]);
guitarAudioFilePathsByMidiNumber.push([97, "/audio/guitar/Cs7.mp3"]);
guitarAudioFilePathsByMidiNumber.push([98, "/audio/guitar/D7.mp3"]);
guitarAudioFilePathsByMidiNumber.push([99, "/audio/guitar/Ds7.mp3"]);
guitarAudioFilePathsByMidiNumber.push([100, "/audio/guitar/E7.mp3"]);
guitarAudioFilePathsByMidiNumber.push([101, "/audio/guitar/F7.mp3"]);
guitarAudioFilePathsByMidiNumber.push([102, "/audio/guitar/Fs7.mp3"]);
guitarAudioFilePathsByMidiNumber.push([103, "/audio/guitar/G7.mp3"]);
guitarAudioFilePathsByMidiNumber.push([104, "/audio/guitar/Gs7.mp3"]);
guitarAudioFilePathsByMidiNumber.push([105, "/audio/guitar/A7.mp3"]);
guitarAudioFilePathsByMidiNumber.push([106, "/audio/guitar/As7.mp3"]);
guitarAudioFilePathsByMidiNumber.push([107, "/audio/guitar/B7.mp3"]);
guitarAudioFilePathsByMidiNumber.push([108, "/audio/guitar/C8.mp3"]);

export function getPitchAudioFilePath(pitch: Pitch): string | undefined {
  const kvp = guitarAudioFilePathsByMidiNumber
    .find(x => x[0] === pitch.midiNumber);
  if (!kvp) { return undefined; }

  return kvp[1];
}

export function playPitches(pitches: Array<Pitch>): [Promise<Array<Howl>>, () => void] {
  const soundFilePaths = pitches
    .map(getPitchAudioFilePath)
    .filter(fp => fp !== undefined)
    .map(fp => fp as string);

  return loadAndPlaySoundsSimultaneously(soundFilePaths);
}

// returns: a cancellation function
export function playPitchesSequentially(pitches: Array<Pitch>, delayInMs: number, cutOffSounds: boolean = false): () => void {
  const soundFilePaths = pitches
    .map(getPitchAudioFilePath)
    .filter(fp => fp !== undefined)
    .map(fp => fp as string);
  
  return loadAndPlaySoundsSequentially(soundFilePaths, delayInMs, cutOffSounds);
}