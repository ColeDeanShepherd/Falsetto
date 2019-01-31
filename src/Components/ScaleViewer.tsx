import * as React from 'react';
import { PitchLetter } from 'src/PitchLetter';
import { scales as allScales } from "src/Scale";
import { Pitch } from 'src/Pitch';
import { Button, Card, CardContent, Typography } from '@material-ui/core';
import { Chord } from 'src/Chord';
import { PianoKeyboard } from './PianoKeyboard';

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

            <PianoKeyboard
              width={400} height={100}
              lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
              highestPitch={new Pitch(PitchLetter.B, 0, 5)}
              pressedPitches={pitches}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

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