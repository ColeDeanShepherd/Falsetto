import * as Utils from "./Utils";

export class Microphone {
  public audioContext: AudioContext | null = null;
  public mediaStream: MediaStream | null = null;

  public startRecording(setupMediaStream?: () => void) {
    try {
      this.audioContext = new AudioContext();

      navigator.mediaDevices.getUserMedia({ audio: { noiseSuppression: true } })
        .then(mediaStream => {
          this.mediaStream = mediaStream;

          if (setupMediaStream) {
            setupMediaStream();
          }
        })
        .catch(error => {
          console.error(error);
          alert(`Failed initializing microphone! Error: ${error}`);
        });
    } catch (e) {
      console.error(e);
      alert("Microphone input is not supported in this browser!");
    }
  }
  public stopRecording() {
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
    Utils.precondition(this.audioContext !== null);
    Utils.precondition(this.mediaStream !== null);
  
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