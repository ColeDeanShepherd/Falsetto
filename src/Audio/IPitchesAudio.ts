import { Pitch } from "../lib/TheoryLib/Pitch";

export interface IPitchesAudio {
  getAudioFilePath(pitch: Pitch): string | undefined;
}