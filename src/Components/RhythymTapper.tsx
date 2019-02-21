import * as React from 'react';
import * as Vex from 'vexflow';

import * as Utils from "../Utils";
import { Button, Card, CardContent, Typography } from '@material-ui/core';
import { VexFlowComponent } from './VexFlowComponent';
import { Rational } from '../Rational';

const width = 800;
const height = 100;

// Add an actual generation algorithm.
/// params: (measures, allowed notes, frequencies???)

// Add a start button.
// Add a stop/restart button.
// Add a skip button.

/*
First, need to be able to generate random rhythyms.
Maybe using random subdivisions?
Each second (bar, note) can be subdivided in half or in thirds
THirds should be less common
Need a way of detecting the closeness of hits to rhythyms
Need a way of thresholding or categorizing distance to notes.
Might depend on the value of the note too.
Need a metronome sound
Need a note sound
Need to handle different time signatures too.
Need a way of configuring options
Add space tapping
*/

interface IRhythymNote {
  duration: Rational;
  isRest: boolean;
}

interface IRhythymTapperProps {
}
interface IRhythymTapperState {
  rhythymNotes: Array<IRhythymNote>;
  beatsPerMinute: number;
  isPlaying: boolean;
  timeStartedPlaying: number;
}

export class RhythymTapper extends React.Component<IRhythymTapperProps, IRhythymTapperState> {
  public constructor(props: IRhythymTapperProps) {
    super(props);

    const initialState: IRhythymTapperState = {
      rhythymNotes: generateRandomRhythym(),
      beatsPerMinute: 60,
      isPlaying: false,
      timeStartedPlaying: 0
    };
    this.state = initialState;
  }

  public render(): JSX.Element {
    const vexFlowRender = this.vexFlowRender.bind(this);

    return (
      <Card>
        <CardContent>
          <div style={{display: "flex"}}>
            <Typography gutterBottom={true} variant="h5" component="h2" style={{flexGrow: 1}}>
              Rhythym Tapper
            </Typography>
          </div>

          <VexFlowComponent
            width={width} height={height}
            vexFlowRender={vexFlowRender}
          />

          <Button
            onClick={event => this.startTappingRhythym()}
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
            onClick={event => this.skipRhythym()}
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

  private get playTimeInSeconds(): number {
    return (window.performance.now() - this.state.timeStartedPlaying) / 1000;
  }

  private vexFlowRender(context: Vex.IRenderContext) {
    context
      .setFont("Arial", 10)
      .setBackgroundFillStyle("#eed");
  
    const stave = new Vex.Flow.Stave(0, 0, width);
    stave.addClef("treble").addTimeSignature("4/4");
    stave.setContext(context).draw();
    
    const vexFlowNotes = this.rhythymNotesToVexFlowNotes(this.state.rhythymNotes);
    
    const voice = new Vex.Flow.Voice({num_beats: 4, beat_value: 4});
    voice.addTickables(vexFlowNotes);
    
    const formatter = new Vex.Flow.Formatter();
    formatter.joinVoices([voice]).format([voice], width);
    
    voice.draw(context, stave);

    if (this.state.isPlaying) {
      // render time bar
      const timeBarNoteIndex = this.getCurrentNoteIndex(this.playTimeInSeconds);

      if (timeBarNoteIndex < this.state.rhythymNotes.length) {
        const timeBarWidth = 3;
        const timeBarHeight = height;
        const timeBarX = vexFlowNotes[timeBarNoteIndex].getAbsoluteX();
        const timeBarY = 0;
        
        context.fillRect(timeBarX, timeBarY, timeBarWidth, timeBarHeight);
      }
    }
  }

  private startTappingRhythym() {
    this.setState(
      { isPlaying: true, timeStartedPlaying: window.performance.now() },
      () => requestAnimationFrame(this.playUpdate.bind(this))
    );
  }
  private skipRhythym() {
    this.setState({
      rhythymNotes: generateRandomRhythym(),
      isPlaying: false
    });
  }
  private tap() {
    // the note we're tapping should probably be the note with
    // the closest start time that we haven't already tapped
    // need to keep track of what we've tapped
    // need to find current tap time
    // need to find current (if hasn't been tapped) & next note times
    // need to find closer tap time? (maybe with threshold for next note)
    // thresholds might be dependent on note duration
    console.log("tap");
  }

  private playUpdate() {
    if (!this.state.isPlaying) { return; }

    const newPlayTimeInSeconds = (window.performance.now() - this.state.timeStartedPlaying) / 1000;

    if (this.getCurrentNoteIndex(newPlayTimeInSeconds) < this.state.rhythymNotes.length) {
      this.forceUpdate();
      requestAnimationFrame(this.playUpdate.bind(this));
    } else {
      this.setState({
        isPlaying: false
      });
    }
  }

  // TODO: add support for time signatures
  private getMeasureDurationInSeconds(): number {
    // Assuming 4/4.
    const beatsPerSecond = this.state.beatsPerMinute / 60;
    const beatsPerMeasure = 4;
    return beatsPerMeasure / beatsPerSecond;
  }
  private getCurrentNoteIndex(playTimeInSeconds: number): number {
    const currentTimeInMeasures = playTimeInSeconds / this.getMeasureDurationInSeconds();

    let timeInMeasures = 0;
    let noteIndex = 0;

    while (noteIndex < this.state.rhythymNotes.length) {
      timeInMeasures += this.state.rhythymNotes[noteIndex].duration.asReal;
      if (currentTimeInMeasures >= timeInMeasures) {
        noteIndex++;
      } else {
        break;
      }
    }

    return noteIndex;
  }
  private getNoteStartTimeInSeconds(noteIndex: number): number {
    let noteOffsetInMeasures = 0;

    for (let i = 0; i < noteIndex; i++) {
      noteOffsetInMeasures += this.state.rhythymNotes[i].duration.asReal;
    }

    return noteOffsetInMeasures * this.getMeasureDurationInSeconds();
  }
  private rhythymNotesToVexFlowNotes(rhythymNotes: Array<IRhythymNote>): Array<Vex.Flow.StaveNote> {
    return rhythymNotes
      .map(rn => {
        const durationStr = this.noteDurationToVexFlowStr(rn.duration) + (rn.isRest ? "r" : "");

        return new Vex.Flow.StaveNote({
          clef: "treble",
          keys: ["b/4"],
          duration: durationStr
        })
      });
  }
  private noteDurationToVexFlowStr(noteDuration: Rational): string {
    if (noteDuration.equals(new Rational(1, 1))) {
      return "w";
    } else if (noteDuration.equals(new Rational(1, 2))) {
      return "h";
    } else if (noteDuration.equals(new Rational(1, 4))) {
      return "q";
    } else if (noteDuration.equals(new Rational(1, 8))) {
      return "8";
    } else {
      throw new Error(`Duration not implemented: ${noteDuration.toString()}`)
    }
  }
}

function generateRandomRhythym(): Array<IRhythymNote> {
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
  const notes = new Array<IRhythymNote>();

  while (durationLeft.numerator > 0) {
    // TODO: optimize
    const noteDuration = Utils.randomElement(
      noteDurations
        .filter(nd => nd.duration.isLessThanOrEqualTo(durationLeft))
    );
    
    durationLeft = durationLeft.subtract(noteDuration.duration);
    
    const isRest = Utils.randomBoolean();

    notes.push({
      duration: noteDuration.duration,
      isRest: isRest
    });
  }

  return notes;
}