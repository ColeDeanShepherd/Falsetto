import * as React from "react";

import * as Utils from "../Utils";
import { Size2D } from "../Size2D";
import { PitchLetter } from "../PitchLetter";
import { scales as allScales } from "../Scale";
import { Pitch } from "../Pitch";
import { Button, Card, CardContent, Typography } from "@material-ui/core";
import { Chord } from "../Chord";
import { PianoKeyboard } from "./PianoKeyboard";
import { GuitarFretboard, GuitarNote, standardGuitarTuning, GuitarFretboardMetrics } from "./GuitarFretboard";
import ResizeObserver from 'resize-observer-polyfill';

const validSharpKeyPitches = [
  null,
  null,
  new Pitch(PitchLetter.C, 1, 4),
  new Pitch(PitchLetter.D, 1, 4),
  null,
  new Pitch(PitchLetter.F, 1, 4),
  null
];
const validNaturalKeyPitches = [
  new Pitch(PitchLetter.A, 0, 4),
  new Pitch(PitchLetter.B, 0, 4),
  new Pitch(PitchLetter.C, 0, 4),
  new Pitch(PitchLetter.D, 0, 4),
  new Pitch(PitchLetter.E, 0, 4),
  new Pitch(PitchLetter.F, 0, 4),
  new Pitch(PitchLetter.G, 0, 4)
];
const validFlatKeyPitches = [
  new Pitch(PitchLetter.A, -1, 4),
  new Pitch(PitchLetter.B, -1, 4),
  new Pitch(PitchLetter.C, -1, 4),
  new Pitch(PitchLetter.D, -1, 4),
  null,
  null,
  new Pitch(PitchLetter.G, -1, 4)
];

interface IScaleViewerProps {
  scales?: Array<{ type: string, formulaString: string }>;
  typeTitle?: string;
}
interface IScaleViewerState {
  rootPitch: Pitch;
  scale: { type: string, formulaString: string };
}

export class ScaleViewer extends React.Component<IScaleViewerProps, IScaleViewerState> {
  public constructor(props: IScaleViewerProps) {
    super(props);

    this.instrumentsContainerRef = React.createRef();
    this.instrumentsContainerResizeObserver = null;

    this.state = {
      rootPitch: new Pitch(PitchLetter.C, 0, 4),
      scale: this.scales[0]
    };
  }

  public render(): JSX.Element {
    const typeTitle = this.props.typeTitle
      ? this.props.typeTitle
      : "Scale";
    const pitches = Chord.fromPitchAndFormulaString(
      this.state.rootPitch,
      this.state.scale.formulaString
    )
      .pitches;
    const pitchStrings = pitches
      .map(pitch => pitch.toString(false));
    const pitchesString = pitchStrings.join(", ");

    const guitarNotes = GuitarNote.allNotesOfPitches(
      standardGuitarTuning,
      pitches,
      11
    );

    const renderExtras = (metrics: GuitarFretboardMetrics) => {
      const rootPitchGuitarNotes = GuitarNote.allNotesOfPitches(
        standardGuitarTuning,
        [this.state.rootPitch],
        11
      );

      const rootPitchFretDots = rootPitchGuitarNotes
        .map((guitarNote, noteIndex) => {
          const x = metrics.getNoteX(guitarNote.getFretNumber(standardGuitarTuning));
          const y = metrics.getStringY(guitarNote.stringIndex);
          return <circle key={noteIndex} cx={x} cy={y} r={metrics.fretDotRadius} fill="green" strokeWidth="0" />;
        });
      
      return <g>{rootPitchFretDots}</g>;
    };

    let width = 0;
    let height = 0;

    if (this.instrumentsContainerRef && (this.instrumentsContainerRef as any).current) {
      const containerElement = (this.instrumentsContainerRef as any).current;

      width = containerElement.offsetWidth;
      height = containerElement.offsetHeight;
    }

    const pianoSize = Utils.shrinkRectToFit(new Size2D(width, height), new Size2D(400, 100));
    const guitarSize = pianoSize;

    return (
      <Card>
        <CardContent>
          <div style={{display: "flex"}}>
            <Typography gutterBottom={true} variant="h5" component="h2" style={{flexGrow: 1}}>
              {typeTitle} Viewer
            </Typography>
          </div>
        
          <div style={{textAlign: "center"}}>
            <Typography gutterBottom={true} variant="h6" component="h4">
              Root Pitch
            </Typography>
            <div style={{padding: "1em 0"}}>
              {this.renderRootPitchRow(validSharpKeyPitches)}
              {this.renderRootPitchRow(validNaturalKeyPitches)}
              {this.renderRootPitchRow(validFlatKeyPitches)}
            </div>
            
            <Typography gutterBottom={true} variant="h6" component="h4">
              {typeTitle}
            </Typography>
            <div style={{padding: "1em 0"}}>
              {this.scales.map(scale => {
                const style: any = { textTransform: "none" };
                
                const isPressed = scale.type === this.state.scale.type;
                if (isPressed) {
                  style.backgroundColor = "#959595";
                }

                return (
                  <Button
                    key={scale.type}
                    onClick={event => this.onScaleClick(scale)}
                    variant="contained"
                    style={style}
                  >
                    {scale.type}
                  </Button>
                );
              })}
            </div>
            <div style={{fontSize: "1.5em"}}>
              <p>{this.state.rootPitch.toString(false)} {this.state.scale.type}</p>
              <p>{pitchesString}</p>
              <p>{this.state.scale.formulaString}</p>
            </div>

            <div ref={this.instrumentsContainerRef}>
              <div>
                <PianoKeyboard
                  width={pianoSize.width} height={pianoSize.height}
                  lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
                  highestPitch={new Pitch(PitchLetter.B, 0, 5)}
                  pressedPitches={pitches}
                />
              </div>

              <div style={{marginTop: "1em"}}>
                <GuitarFretboard
                  width={guitarSize.width} height={guitarSize.height}
                  pressedNotes={guitarNotes}
                  renderExtrasFn={renderExtras}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  public componentDidMount() {
    this.instrumentsContainerResizeObserver = new ResizeObserver((entries, observer) => {
      this.forceUpdate();
    });
    
    this.instrumentsContainerResizeObserver.observe((this.instrumentsContainerRef as any).current);

    this.forceUpdate();
  }
  public componentWillUnmount() {
    if (this.instrumentsContainerResizeObserver) {
      this.instrumentsContainerResizeObserver.disconnect();
    }
  }

  private instrumentsContainerRef: React.Ref<HTMLDivElement>;
  private instrumentsContainerResizeObserver: ResizeObserver | null;

  private get scales(): Array<{ type: string, formulaString: string }> {
    return this.props.scales
      ? this.props.scales
      : allScales;
  }
  private renderRootPitchRow(rootPitches: Array<Pitch | null>): JSX.Element {
    return (
      <div>
        {rootPitches.map(pitch => {
          const style: any = { textTransform: "none" };
          
          const isPressed = pitch && (pitch.equals(this.state.rootPitch));
          if (isPressed) {
            style.backgroundColor = "#959595";
          }

          return (
            pitch
              ? (
                <Button
                  onClick={event => this.onRootPitchClick(pitch)}
                  variant="contained"
                  style={style}
                >
                  {pitch.toString(false)}
                </Button>
              )
              : (
                <Button
                  variant="contained"
                  style={{ visibility: "hidden" }}
                />
              )
          );
        })}
      </div>
    );
  }

  private onRootPitchClick(rootPitch: Pitch) {
    this.setState({ rootPitch: rootPitch });
  }
  private onScaleClick(scale: { type: string, formulaString: string }) {
    this.setState({ scale: scale });
  }
}