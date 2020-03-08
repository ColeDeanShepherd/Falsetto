import * as React from "react";
import * as Vex from "vexflow";

import { IRhythmNote, RhythmPlayer } from "../../RhythmPlayer";
import { Button, Card, CardContent, Typography } from "@material-ui/core";
import { VexFlowComponent } from "../Utils/VexFlowComponent";
import { Rational } from "../../lib/Core/Rational";
import { noteDurationToVexFlowStr } from '../../VexFlowUtils';
import { TimeSignature } from '../../lib/TheoryLib/TimeSignature';
import { Size2D } from '../../lib/Core/Size2D';
import { randomElement, randomBoolean } from '../../lib/Core/Random';

const canvasSize = new Size2D(800, 100);

// Add an actual generation algorithm.
/// params: (measures, allowed notes, frequencies???)

// Add a start button.
// Add a stop/restart button.
// Add a skip button.

/*
First, need to be able to generate random rhythms.
Maybe using random subdivisions?
Each second (bar, note) can be subdivided in half or in thirds
Thirds should be less common
Need a way of detecting the closeness of hits to rhythms
Need a way of thresholding or categorizing distance to notes.
Might depend on the value of the note too.
Need a metronome sound
Need a note sound
Need to handle different time signatures too.
Need a way of configuring options
Add space tapping
*/

interface IRhythmTapperProps {
  isEmbedded?: boolean;
}
interface IRhythmTapperState {
  rhythmNotes: Array<IRhythmNote>;
  beatsPerMinute: number;
  isPlaying: boolean;
  timeStartedPlaying: number;
}

export class RhythmTapper extends React.Component<IRhythmTapperProps, IRhythmTapperState> {
  public constructor(props: IRhythmTapperProps) {
    super(props);

    const initialState: IRhythmTapperState = {
      rhythmNotes: generateRandomRhythm(),
      beatsPerMinute: 60,
      isPlaying: false,
      timeStartedPlaying: 0
    };

    this.rhythmPlayer = new RhythmPlayer(
      new TimeSignature(4, 4),
      initialState.rhythmNotes,
      initialState.beatsPerMinute,
      null
    );

    this.state = initialState;
  }

  public render(): JSX.Element {
    const vexFlowRender = this.vexFlowRender.bind(this);

    return (
      <Card>
        <CardContent>
          <div style={{display: "flex"}}>
            <Typography gutterBottom={true} variant="h5" component="h2" style={{flexGrow: 1}}>
              Rhythm Tapper
            </Typography>
          </div>

          <VexFlowComponent
            size={canvasSize}
            vexFlowRender={vexFlowRender}
          />

          <Button
            onClick={event => this.startTappingRhythm()}
            disableRipple={true}
            disableFocusRipple={true}
            variant="contained"
          >
            Start
          </Button>
          
          <Button
            onClick={event => this.tap()}
            variant="contained"
          >
            Tap
          </Button>

          <Button
            onClick={event => this.skipRhythm()}
            variant="contained"
          >
            Skip
          </Button>
        </CardContent>
      </Card>
    );
  }

  private keyDownListener: ((ev: KeyboardEvent) => any) | null = null;
  public componentDidMount() {
    this.keyDownListener = ev => {
      if (!ev.repeat) {
        this.tap();
      }

      ev.preventDefault();
      ev.stopPropagation();
    };
    document.addEventListener("keydown", this.keyDownListener);
  }
  public componentWillUnmount() {
    if (this.keyDownListener) {
      document.removeEventListener("keydown", this.keyDownListener);
    }
  }

  private rhythmPlayer: RhythmPlayer;

  private get playTimeInSeconds(): number {
    return (window.performance.now() - this.state.timeStartedPlaying) / 1000;
  }

  private vexFlowRender(context: Vex.IRenderContext) {
    context
      .setFont("Arial", 10)
      .setBackgroundFillStyle("#eed");
  
    const stave = new Vex.Flow.Stave(0, 0, canvasSize.width);
    stave.addClef("treble").addTimeSignature("4/4");
    stave.setContext(context).draw();
    
    const vexFlowNotes = this.rhythmNotesToVexFlowNotes(this.state.rhythmNotes);
    
    const voice = new Vex.Flow.Voice({num_beats: 4, beat_value: 4});
    voice.addTickables(vexFlowNotes);
    
    const formatter = new Vex.Flow.Formatter();
    formatter.joinVoices([voice]).format([voice], canvasSize.width);
    
    voice.draw(context, stave);

    if (this.state.isPlaying) {
      // render time bar
      const timeBarNoteIndex = this.rhythmPlayer.getCurrentNoteIndex(this.playTimeInSeconds);

      if (timeBarNoteIndex < this.state.rhythmNotes.length) {
        const timeBarWidth = 3;
        const timeBarHeight = canvasSize.height;
        const timeBarX = vexFlowNotes[timeBarNoteIndex].getAbsoluteX();
        const timeBarY = 0;
        
        context.fillRect(timeBarX, timeBarY, timeBarWidth, timeBarHeight);
      }
    }
  }

  private startTappingRhythm() {
    this.setState(
      { isPlaying: true, timeStartedPlaying: window.performance.now() },
      () => requestAnimationFrame(this.playUpdate.bind(this))
    );
  }
  private skipRhythm() {
    const stateDelta = {
      rhythmNotes: generateRandomRhythm(),
      isPlaying: false
    };

    this.rhythmPlayer.stop();
    this.rhythmPlayer.rhythmNotes = stateDelta.rhythmNotes;

    this.setState(stateDelta);
  }
  private tap() {
    // the note we"re tapping should probably be the note with
    // the closest start time that we haven"t already tapped
    // need to keep track of what we"ve tapped
    // need to find current tap time
    // need to find current (if hasn"t been tapped) & next note times
    // need to find closer tap time? (maybe with threshold for next note)
    // thresholds might be dependent on note duration
    console.log("tap");
  }

  private playUpdate() {
    if (!this.state.isPlaying) { return; }

    const newPlayTimeInSeconds = (window.performance.now() - this.state.timeStartedPlaying) / 1000;

    if (this.rhythmPlayer.getCurrentNoteIndex(newPlayTimeInSeconds) < this.state.rhythmNotes.length) {
      this.forceUpdate();
      requestAnimationFrame(this.playUpdate.bind(this));
    } else {
      this.setState({
        isPlaying: false
      });
    }
  }

  private rhythmNotesToVexFlowNotes(rhythmNotes: Array<IRhythmNote>): Array<Vex.Flow.StaveNote> {
    return rhythmNotes
      .map(rn => {
        const durationStr = noteDurationToVexFlowStr(rn.duration) + (rn.isRest ? "r" : "");

        return new Vex.Flow.StaveNote({
          clef: "treble",
          keys: ["b/4"],
          duration: durationStr
        })
      });
  }
}

function generateRandomRhythm(): Array<IRhythmNote> {
  // TODO: add triplets
  // TODO: add support for multiple time signatures
  const noteDurations = [
    { name: "w", duration: new Rational(1, 1) },
    { name: "h", duration: new Rational(1, 2) },
    { name: "q", duration: new Rational(1, 4) },
    { name: "8", duration: new Rational(1, 8) },
    //{ name: "16", duration: new Rational(1, 16) }
  ];
  
  let durationLeft = new Rational(1, 1);
  const notes = new Array<IRhythmNote>();

  while (durationLeft.numerator > 0) {
    // TODO: optimize
    const noteDuration = randomElement(
      noteDurations
        .filter(nd => nd.duration.isLessThanOrEqualTo(durationLeft))
    );
    
    durationLeft = durationLeft.subtract(noteDuration.duration);
    
    const isRest = randomBoolean();

    notes.push({
      duration: noteDuration.duration,
      isRest: isRest
    });
  }

  return notes;
}