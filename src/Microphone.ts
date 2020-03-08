import * as Utils from "./lib/Core/Utils";
import { precondition } from './lib/Core/Dbc';

export class Microphone {
  public audioContext: AudioContext | null = null;
  public mediaStream: MediaStream | null = null;

  // returns an error
  public async startRecording(): Promise<void> {
    this.audioContext = new AudioContext();
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: { noiseSuppression: true }
    });
  }

  public stopRecording() {
    if (!this.audioContext) { return; }
    if (!this.mediaStream) { return; }

    const audioTracks = this.mediaStream.getAudioTracks();
    for (const audioTrack of audioTracks) {
      audioTrack.stop();
    }

    this.audioContext = null;
    this.mediaStream = null;
  }

  public connectAnalyzer(
    configureAnalyzer: (analyzer: AnalyserNode) => void,
    onAudioProcess?: (analyzer: AnalyserNode) => void
  ): AnalyserNode {
    precondition(this.audioContext !== null);
    precondition(this.mediaStream !== null);
  
    const audioContext = Utils.unwrapMaybe(this.audioContext);
    const mediaStream = Utils.unwrapMaybe(this.mediaStream);
  
    const analyzer = audioContext.createAnalyser();
    configureAnalyzer(analyzer);
  
    const processor = audioContext.createScriptProcessor(
      2 * analyzer.fftSize, 1, 1
    );
    processor.onaudioprocess = () => {
      if (onAudioProcess) {
        onAudioProcess(analyzer);
      }
    };
  
    const streamSource = audioContext.createMediaStreamSource(
      Utils.unwrapMaybe(mediaStream)
    );
    streamSource.connect(analyzer);
    analyzer.connect(processor);
    processor.connect(audioContext.destination);
  
    return analyzer;
  }
}