import * as React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";

import * as Utils from "../../Utils";
import { Size2D } from "../../Size2D";
import { Vector2D } from "../../Vector2D";
import { Rect2D } from "../../Rect2D";

export function getRMS(spectrum: Uint8Array) {
  let rms = 0;
  for (let i = 0; i < spectrum.length; i++) {
    rms += spectrum[i] * spectrum[i];
  }
  rms = Math.sqrt(rms / spectrum.length);
  return rms;
}

export class Microphone {
  public audioContext: AudioContext;
  public fftSize = 1024;
  public spectrum: Uint8Array | null = null;
  public volume = 0;
  public peakVolume = 0;

  public constructor() {
    // polyfill
    const windowAny = window as any;
    windowAny.AudioContext = windowAny.AudioContext || windowAny.webkitAudioContext;

    const navigatorAny = navigator as any;
    navigatorAny.getUserMedia = navigatorAny.getUserMedia || navigatorAny.webkitGetUserMedia;

    this.audioContext = new AudioContext();
  }

  public startRecording(onAudioProcess?: (microphone: Microphone) => void) {
    this.onAudioProcess = onAudioProcess;

    try {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(this.connectAnalyzer.bind(this))
        .catch(error => {
          console.error(error);
          alert(`Failed initializing microphone! Error: ${error}`);
        });
    } catch (e) {
      console.error(e);
      alert("Microphone input is not supported in this browser!");
    }
  }

  private onAudioProcess: ((microphone: Microphone) => void) | undefined = undefined;

  private connectAnalyzer(mediaStream: MediaStream) {
    const analyzer = this.audioContext.createAnalyser();
    analyzer.smoothingTimeConstant = 0.2;
    analyzer.fftSize = this.fftSize;

    const processor = this.audioContext.createScriptProcessor(
      2 * this.fftSize, 1, 1
    );
    processor.onaudioprocess = () => {
      this.spectrum = new Uint8Array(analyzer.frequencyBinCount);
      analyzer.getByteFrequencyData(this.spectrum);
      
      this.volume = getRMS(this.spectrum);
      this.peakVolume = Math.max(this.volume, this.peakVolume);

      if (this.onAudioProcess) {
        this.onAudioProcess(this);
      }
    };

    const streamSource = this.audioContext.createMediaStreamSource(mediaStream);
    streamSource.connect(analyzer);
    analyzer.connect(processor);
    processor.connect(this.audioContext.destination);
  }
}

export interface IAudioSpectrumProps {
  spectrum: Uint8Array;
  rect: Rect2D;
  style?: any;
}
export class AudioSpectrum extends React.Component<IAudioSpectrumProps, {}> {
  public render(): JSX.Element {
    const { spectrum, style } = this.props;
    const svgRect = this.props.rect;

    const numBars = spectrum.length;
    const barMarginX = 1;
    const totalMarginX = barMarginX * (numBars - 1);
    const barWidth = (svgRect.size.width - totalMarginX) / numBars
    const maxValue = Utils.uint8ArrayMax(spectrum);

    const bars = Utils.uint8ArrayMap(
      spectrum,
      (v, i) => {
        const barHeight = svgRect.size.height * (v / maxValue);
        const rect = new Rect2D(
          new Size2D(barWidth, barHeight),
          new Vector2D(i * (barWidth + barMarginX), svgRect.size.height - barHeight)
        );
        
        return (
          <rect
            key={i}
            x={rect.position.x} y={rect.position.y}
            width={rect.size.width} height={rect.size.height}
            fill="black"
          />
        );
      });

    return (
      <svg
        width={svgRect.size.width} height={svgRect.size.height}
        x={svgRect.position.x} y={svgRect.position.y}
        viewBox={`0 0 ${svgRect.size.width} ${svgRect.size.height}`}
        version="1.1" xmlns="http://www.w3.org/2000/svg"
        style={style}
      >
        {bars}
      </svg>
    );
  }
}

export interface ITunerProps {}
export interface ITunerState {}
export class Tuner extends React.Component<ITunerProps, ITunerState> {
  public constructor(props: ITunerProps) {
    super(props);

    this.state = {
      pressedPitches: []
    };
  }

  public componentDidMount() {
    this.microphone = new Microphone();
    this.microphone.startRecording(mic => this.forceUpdate());
  }
  public componentWillUnmount() {
  }

  public render(): JSX.Element {
    const audioSpectrumRect = new Rect2D(
      new Size2D(1024, 100),
      new Vector2D(0, 0)
    );

    return (
      <Card>
        <CardContent>
          <div style={{display: "flex"}}>
            <Typography gutterBottom={true} variant="h5" component="h2" style={{flexGrow: 1}}>
              Tuner
            </Typography>
          </div>
        
          <div>
            {(this.microphone && this.microphone.spectrum) ? (
              <AudioSpectrum
                spectrum={this.microphone.spectrum}
                rect={audioSpectrumRect}
              />
            ) : null}
          </div>
        </CardContent>
      </Card>
    );
  }

  private microphone: Microphone | null = null;
}