import * as React from "react";
import { CircularProgress } from "@material-ui/core";

import * as Audio from "../../Audio/Audio";
import { unwrapMaybe } from '../../lib/Core/Utils';
import { Card } from "../../ui/Card/Card";
import { Button } from "../../ui/Button/Button";
import { Howl } from "howler";

const clickAudioPath = "/audio/metronome_click.wav";

export function getBeatIntervalS(bpm: number): number {
  const bps = bpm / 60;
  const beatIntervalS = 1 / bps;
  return beatIntervalS;
}
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
  hideTitle?: boolean;
}
interface IMetronomeState {
  bpm: number;
  isLoadingSounds: boolean;
  isPlaying: boolean;
  isTappingTempo: boolean;
}

export class Metronome extends React.Component<IMetronomeProps, IMetronomeState> {
  public constructor(props: IMetronomeProps) {
    super(props);

    this.state = {
      bpm: 120,
      isLoadingSounds: false,
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
      <Card style={{ maxWidth: "420px", margin: "0 auto", textAlign: "center" }}>
        {!this.props.hideTitle
          ? (
            <h2 className="h5 margin-bottom" style={{flexGrow: 1}}>
              Metronome
            </h2>
          ) : null}

        {!this.state.isTappingTempo ? this.renderMetronomeControls() : this.renderTempoTappingControls()}
      </Card>
    );
  }
  private renderTempoText(bpm: number | null): JSX.Element {
    return <span className="h3">{bpm ? Math.round(bpm) : "?"} <span style={{ fontSize: "0.35em" }}>BPM</span></span>;
  }
  private renderMetronomeControls(): JSX.Element {
    return (
      <div>
        {this.renderTempoText(this.state.bpm)}
        <input type="range" min={this.MIN_BPM} max={this.MAX_BPM} value={this.state.bpm} onChange={e => this.onBpmChange(parseInt(e.target.value, 10))} style={this.SLIDER_STYLE} />
        <div>
          {!this.state.isPlaying ? (
            <Button onClick={e => this.play()} disabled={this.state.isLoadingSounds}>
              {!this.state.isLoadingSounds ? <i className="material-icons">play_arrow</i> : <CircularProgress size={20} disableShrink={true} />}
            </Button>
          ) : (
            <Button onClick={e => this.pause()}><i className="material-icons">pause</i></Button>
          )}
          <Button onClick={e => this.startTappingTempo()} disabled={this.state.isPlaying}>Tap Tempo</Button>
        </div>
      </div>
    );
  }
  private renderTempoTappingControls(): JSX.Element {
    return (
      <div>
        {this.renderTempoText(this.tempoTapper.tappedBpm)}
        <div><Button onPointerDown={e => this.tapTempo()} touch-action="none">Tap</Button></div>
        <div>
          <Button onClick={e => this.confirmTappedTempo()}>OK</Button>
          <Button onClick={e => this.cancelTappingTempo()}>Cancel</Button>
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
  private clickSound: Howl | null = null;
  private tempoTapper = new TempoTapper(this.MAX_NUM_TAPPED_TEMPO_SAMPLES, this.TAPPED_TEMPO_TIMEOUT_S);

  private onBpmChange(value: number) {
    if (this.state.isPlaying) {
      this.resetClickInterval(value);
    }

    this.setState({ bpm: value });
  }
  private play() {
    if (!this.clickSound) {
      Audio.loadSoundAsync(clickAudioPath)
        .then(clickSound => {
          this.clickSound = clickSound;
          this.playAfterSoundsLoaded();
        })
        .catch(error => {
          window.alert(`Failed loading sounds: ${error}`);
          this.setState({ isLoadingSounds: false });
        });
      
      this.setState({ isLoadingSounds: true });
    } else {
      this.playAfterSoundsLoaded();
    }
  }
  private playAfterSoundsLoaded() {
    unwrapMaybe(this.clickSound).play();
    this.resetClickInterval(this.state.bpm);

    this.setState({ isPlaying: true, isLoadingSounds: false });
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

    this.clickIntervalId = window.setInterval(() => unwrapMaybe(this.clickSound).play(), getBeatIntervalMs(bpm));
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