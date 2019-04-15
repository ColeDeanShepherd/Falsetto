import * as React from "react";
import { Card, CardContent, Typography, Button } from "@material-ui/core";

import * as Audio from "../Audio";

var clickAudioPath = "audio/metronome_click.wav";

export function getBeatIntervalMs(bpm: number): number {
  const bps = bpm / 60;
  const beatIntervalS = 1 / bps;
  return 1000 * beatIntervalS;
}

interface IMetronomeProps {
}
interface IMetronomeState {
  bpm: number;
  isPlaying: boolean;
}

export class Metronome extends React.Component<IMetronomeProps, IMetronomeState> {
  public constructor(props: IMetronomeProps) {
    super(props);

    this.state = {
      bpm: 120,
      isPlaying: false
    };
  }

  public render(): JSX.Element {
    return (
      <Card>
        <CardContent>
          <Typography gutterBottom={true} variant="h5" component="h2" style={{flexGrow: 1}}>
            Metronome
          </Typography>
          <Typography>BPM: {this.state.bpm}</Typography>
          <input type="range" min={this.MIN_BPM} max={this.MAX_BPM} value={this.state.bpm} onChange={e => this.onBpmChange(parseInt(e.target.value))} style={this.SLIDER_STYLE} />
          <div>{!this.state.isPlaying ? <Button variant="contained" onClick={e => this.play()}><i className="material-icons">play_arrow</i></Button> : <Button variant="contained" onClick={e => this.pause()}><i className="material-icons">pause</i></Button>}</div>
        </CardContent>
      </Card>
    );
  }

  private readonly SLIDER_STYLE: any = {
    width: "100%",
    maxWidth: "400px"
  };

  private readonly MIN_BPM = 30;
  private readonly MAX_BPM = 300;

  private clickIntervalId: number = -1;

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
}