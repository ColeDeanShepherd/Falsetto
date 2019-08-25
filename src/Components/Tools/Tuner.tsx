import * as React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";

import * as Utils from "../../Utils";
import { Pitch } from '../../Pitch';
import { detectPitch } from '../PitchDetection';
import { Size2D } from '../../Size2D';
import { Microphone } from '../../Microphone';

export interface ITunerCentsIndicatorProps {
  detuneCents: number;
}
export interface ITunerCentsIndicatorState {}

export class TunerCentsIndicator
  extends React.Component<ITunerCentsIndicatorProps, ITunerCentsIndicatorState>
{
  public render(): JSX.Element {
    // svg horizontal scale
    const svgSize = new Size2D(100, 5);
    const style: any = {
      width: "100%",
      height: "5px"
    };

    const { detuneCents } = this.props;

    const centsInHalfStep = 100;
    const centsBarWidthPct = Math.abs(detuneCents) / (centsInHalfStep / 2);
    const centsBarWidth = centsBarWidthPct * (svgSize.width / 2);
    const centsBarX = (detuneCents > 0)
      ? (svgSize.width / 2)
      : ((svgSize.width / 2) - centsBarWidth);

    return (
      <svg
        width={svgSize.width} height={svgSize.height}
        viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
        version="1.1" xmlns="http://www.w3.org/2000/svg"
        style={style}
      >
        <rect
          x={0} y={0}
          width={svgSize.width} height={svgSize.height}
          fill="gray"
        />
        <rect
          x={centsBarX} y={0}
          width={centsBarWidth} height={svgSize.height}
          fill="lightgreen"
        />
      </svg>
    );
  }
}

const fftSize = 2048;

export interface ITunerProps {}
export interface ITunerState {
  detectedPitch: Pitch | null;
  detectedPitchDetuneCents: number | null;
}
export class Tuner extends React.Component<ITunerProps, ITunerState> {
  public constructor(props: ITunerProps) {
    super(props);

    this.state = {
      detectedPitch: null,
      detectedPitchDetuneCents: null
    };
  }

  public componentDidMount() {
    this.microphone = new Microphone();
    this.microphone.startRecording(() => {
      if (!this.microphone) { return; }

      this.microphone.connectAnalyzer(
        analyzer => {
          analyzer.fftSize = fftSize;
          analyzer.smoothingTimeConstant = 0.2;
        },
        analyzer => {
          if (!this.microphone || !this.microphone.audioContext) { return; }

          const detectedPitch = detectPitch(
            this.microphone.audioContext,
            analyzer,
            this.sampleBuffer
          );
          if (detectedPitch) {
            this.setState({
              detectedPitch: Pitch.createFromMidiNumber(detectedPitch.midiNumber),
              detectedPitchDetuneCents: detectedPitch.detuneCents
            });
          } else {
            this.setState({
              detectedPitch: null,
              detectedPitchDetuneCents: null
            });
          }
        }
      );
    });
  }
  public componentWillUnmount() {
    if (this.microphone) {
      this.microphone.stopRecording();
    }
  }

  public render(): JSX.Element {
    return (
      <Card style={{ maxWidth: "420px", margin: "0 auto", textAlign: "center" }}>
        <CardContent>
          <div style={{display: "flex"}}>
            <Typography gutterBottom={true} variant="h5" component="h2" style={{flexGrow: 1}}>
              Tuner
            </Typography>
          </div>

          <div>
            {this.state.detectedPitch ? (
              <div style={{ fontSize: "2em" }}>{this.state.detectedPitch.toOneAccidentalAmbiguousString(true, true)}</div>
            ) : <div style={{ fontSize: "2em" }}>No pitch detected</div>}
            {this.state.detectedPitchDetuneCents ? (
              <div>
                <div>
                  <TunerCentsIndicator detuneCents={this.state.detectedPitchDetuneCents} />
                </div>
                <div>
                  {(this.state.detectedPitchDetuneCents > 0) ? "+" : ""}
                  {this.state.detectedPitchDetuneCents} cents
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    );
  }

  private microphone: Microphone | null = null;
  private sampleBuffer = new Float32Array(fftSize);
}