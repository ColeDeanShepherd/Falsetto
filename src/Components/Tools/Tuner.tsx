import * as React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";

import { DetectedPitch, IPitchDetector, DatalantPitchDetector } from '../PitchDetection';
import { Size2D } from '../../Size2D';
import { Microphone } from '../../Microphone';

export interface ITunerCentsIndicatorProps {
  detuneCents: number;
}
export class TunerCentsIndicator extends React.Component<ITunerCentsIndicatorProps, {}>
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

export interface IDetectedPitchIndicatorProps {
  detectedPitch: DetectedPitch | null;
  showOctaveNumbers: boolean;
}
export class DetectedPitchIndicator extends React.Component<IDetectedPitchIndicatorProps, {}> {
  public render(): JSX.Element {
    const { detectedPitch, showOctaveNumbers } = this.props;

    return (
      <div>
        {detectedPitch ? (
          <div>
            <div style={{ fontSize: "2em" }}>
              {detectedPitch.pitch.toOneAccidentalAmbiguousString(showOctaveNumbers, true)}
            </div>
            <div>
              <TunerCentsIndicator detuneCents={detectedPitch.detuneCents} />
            </div>
            <div>
              {(detectedPitch.detuneCents > 0) ? "+" : ""}
              {detectedPitch.detuneCents} cents
            </div>
          </div>
        ) : (
          <div style={{ fontSize: "2em" }}>No pitch detected</div>
        )}
      </div>
    );
  }
}

const fftSize = 2048;

export interface ITunerProps {
  pitchDetector?: IPitchDetector;
  isStandalone?: boolean;
  showOctaveNumbers?: boolean;
  alwaysShowLastPitch?: boolean;
  onPitchChange?: (detectedPitch: DetectedPitch | null) => void;
}
export interface ITunerState {
  detectedPitch: DetectedPitch | null;
}
export class Tuner extends React.Component<ITunerProps, ITunerState> {
  public constructor(props: ITunerProps) {
    super(props);

    this.state = {
      detectedPitch: null
    };
  }

  public componentDidMount() {
    const pitchDetector = (this.props.pitchDetector !== undefined)
      ? this.props.pitchDetector
      : new DatalantPitchDetector();

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

          analyzer.getFloatTimeDomainData(this.sampleBuffer);

          const detectedPitch = pitchDetector.detectPitch(
            this.sampleBuffer,
            this.microphone.audioContext.sampleRate
          );
          if (detectedPitch || !this.props.alwaysShowLastPitch) {
            this.setState({
              detectedPitch: detectedPitch
            });
            
            if (this.props.onPitchChange) {
              this.props.onPitchChange(detectedPitch);
            }
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
    const isStandalone = (this.props.isStandalone !== undefined) ? this.props.isStandalone : true;
    const showOctaveNumbers = (this.props.showOctaveNumbers !== undefined) ? this.props.showOctaveNumbers : true;

    const contents = (
      <DetectedPitchIndicator
        detectedPitch={this.state.detectedPitch}
        showOctaveNumbers={showOctaveNumbers}
      />
    );

    return isStandalone ? (
      <Card style={{ maxWidth: "420px", margin: "0 auto", textAlign: "center" }}>
        <CardContent>
          {isStandalone ? (
            <div style={{display: "flex"}}>
              <Typography gutterBottom={true} variant="h5" component="h2" style={{flexGrow: 1}}>
                Tuner
              </Typography>
            </div>
          ) : null}

          {contents}
        </CardContent>
      </Card>
    ) : contents;
  }

  private microphone: Microphone | null = null;
  private sampleBuffer = new Float32Array(fftSize);
}