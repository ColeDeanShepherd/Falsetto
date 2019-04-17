import * as React from "react";
import { Card, CardContent, Typography, Button } from "@material-ui/core";

import * as Audio from "../Audio";

var clickAudioPath = "audio/metronome_click.wav";

export function getBeatIntervalMs(bpm: number): number {
  const bps = bpm / 60;
  const beatIntervalS = 1 / bps;
  return 1000 * beatIntervalS;
}
export function getBpmFromBeatIntervalMs(beatIntervalMs: number): number {
  const beatIntervalS = beatIntervalMs / 1000;
  const bps = 1 / beatIntervalS;
  return 60 * bps;
}

export class TempoTapper {
  public constructor(public maxNumTappedTempoSamples: number, public tappedTempoTimeousS: number) {
    this.tapTimesMs = [];
  }

  public get tappedBpm(): number | null {
    const numTempoSamples = this.tapTimesMs.length - 1;
    if (numTempoSamples == 0) { return null; }
    
    let totalBpm = 0;
    for (let i = 0; (i < this.tapTimesMs.length - 1); i++) {
      const beatIntervalMs = this.tapTimesMs[i + 1] - this.tapTimesMs[i];
      const bpm = getBpmFromBeatIntervalMs(beatIntervalMs);
      totalBpm += bpm;
    }
  
    const bpm = totalBpm / numTempoSamples;
    return bpm;
  }

  public reset() {
    this.tapTimesMs = [];
  }
  public tap(tapTimeMs: number | undefined = undefined) {
    tapTimeMs = (tapTimeMs !== undefined) ? tapTimeMs : window.performance.now();
    
    // Clear old taps if necesary.
    if (this.tapTimesMs.length > 0) {
      const minLastTapTimeMs = tapTimeMs - (1000 * this.tappedTempoTimeousS);
      const lastTapTime = this.tapTimesMs[this.tapTimesMs.length - 1];
  
      if (lastTapTime < minLastTapTimeMs) {
        this.tapTimesMs = [];
      }
    }

    // Add the tap.
    this.tapTimesMs.push(tapTimeMs);
    
    // Cap the number of taps.
    if (this.tapTimesMs.length > (this.maxNumTappedTempoSamples + 1)) {
      this.tapTimesMs = this.tapTimesMs.slice(1);
    }
  }

  private tapTimesMs: Array<number>;
}

interface IMetronomeProps {
}
interface IMetronomeState {
  bpm: number;
  isPlaying: boolean;

  isTappingTempo: boolean;
}

export class Metronome extends React.Component<IMetronomeProps, IMetronomeState> {
  public constructor(props: IMetronomeProps) {
    super(props);

    this.state = {
      bpm: 120,
      isPlaying: false,
      isTappingTempo: false
    };
  }

  public componentWillUnmount() {
    if (this.clickIntervalId >= 0) {
      window.clearInterval(this.clickIntervalId);
      this.clickIntervalId = -1;
    }
  }

  public render(): JSX.Element {
    return (
      <Card>
        <CardContent>
          <Typography gutterBottom={true} variant="h5" component="h2" style={{flexGrow: 1}}>
            Metronome
          </Typography>

          {!this.state.isTappingTempo ? this.renderMetronomeControls() : this.renderTempoTappingControls()}
        </CardContent>
      </Card>
    );
  }
  private renderMetronomeControls(): JSX.Element {
    return (
      <div>
        <Typography>BPM: {this.state.bpm}</Typography>
          <input type="range" min={this.MIN_BPM} max={this.MAX_BPM} value={this.state.bpm} onChange={e => this.onBpmChange(parseInt(e.target.value))} style={this.SLIDER_STYLE} />
          <div>
            {!this.state.isPlaying ? <Button variant="contained" onClick={e => this.play()}><i className="material-icons">play_arrow</i></Button> : <Button variant="contained" onClick={e => this.pause()}><i className="material-icons">pause</i></Button>}
            {!this.state.isPlaying ? <Button variant="contained" onClick={e => this.startTappingTempo()}>Tap</Button> : null}
          </div>
      </div>
    );
  }
  private renderTempoTappingControls(): JSX.Element {
    return (
      <div>
        <Typography variant="h4">{this.tempoTapper.tappedBpm ? Math.round(this.tempoTapper.tappedBpm) : "?"} BPM</Typography>
        <div><Button variant="contained" onMouseDown={e => this.tapTempo()}>Tap</Button></div>
        <div>
          <Button variant="contained" onClick={e => this.confirmTappedTempo()}>OK</Button>
          <Button variant="contained" onClick={e => this.cancelTappingTempo()}>Cancel</Button>
        </div>
      </div>
    );
  }

  private readonly SLIDER_STYLE: any = {
    width: "100%",
    maxWidth: "400px"
  };

  private readonly MIN_BPM = 30;
  private readonly MAX_BPM = 300;
  private readonly MAX_NUM_TAPPED_TEMPO_SAMPLES = 10;
  private readonly TAPPED_TEMPO_TIMEOUT_S = 3;

  private clickIntervalId: number = -1;
  private tempoTapper = new TempoTapper(this.MAX_NUM_TAPPED_TEMPO_SAMPLES, this.TAPPED_TEMPO_TIMEOUT_S);

  private onBpmChange(value: number) {
    if (this.state.isPlaying) {
      this.resetClickInterval(value);
    }

    this.setState({ bpm: value });
  }
  private play() {
    Audio.playSound(clickAudioPath);
    this.resetClickInterval(this.state.bpm);

    this.setState({ isPlaying: true });
  }
  private pause() {
    window.clearInterval(this.clickIntervalId);
    this.clickIntervalId = -1;

    this.setState({ isPlaying: false });
  }

  private resetClickInterval(bpm: number) {
    if (this.clickIntervalId >= 0) {
      window.clearInterval(this.clickIntervalId);
    }

    this.clickIntervalId = window.setInterval(() => Audio.playSound(clickAudioPath), getBeatIntervalMs(bpm));
  }

  private startTappingTempo() {
    this.setState({ isTappingTempo: true });
  }
  private tapTempo() {
    this.tempoTapper.tap();
    this.forceUpdate();
  }
  private cancelTappingTempo() {
    this.setState({ isTappingTempo: false });
  }
  private confirmTappedTempo() {
    const stateDelta: any = { isTappingTempo: false };
    if (this.tempoTapper.tappedBpm) {
      stateDelta.bpm = Math.round(this.tempoTapper.tappedBpm);
    }

    this.setState(stateDelta);
  }
}