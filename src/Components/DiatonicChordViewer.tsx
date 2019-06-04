import * as React from "react";
import { CardContent, Typography, Card, Table, TableHead, TableBody, TableRow, TableCell, Button, Checkbox } from '@material-ui/core';

import * as Utils from "../Utils";
import { Chord, ChordType } from '../Chord';
import { PitchesAudioPlayer } from './PitchesAudioPlayer';
import { Pitch } from '../Pitch';
import { PitchLetter } from '../PitchLetter';
import { Scale } from '../Scale';
import { validSharpKeyPitches, validNaturalKeyPitches, validFlatKeyPitches } from '../Key';

export const defaultScales = [
  Scale.Ionian,
  Scale.Dorian,
  Scale.Phrygian,
  Scale.Lydian,
  Scale.Mixolydian,
  Scale.Aeolian,
  Scale.Locrian,
  Scale.MelodicMinor,
  Scale.HarmonicMinor
];

export interface IDiatonicChordViewerProps {
  scales?: Array<Scale>;
}
export interface IDiatonicChordViewerState {
  rootPitch: Pitch;
  playDrone: boolean;
}
export class DiatonicChordViewer extends React.Component<IDiatonicChordViewerProps, IDiatonicChordViewerState> {
  public constructor(props: IDiatonicChordViewerProps) {
    super(props);

    this.state = {
      rootPitch: new Pitch(PitchLetter.C, 0, 4),
      playDrone: true
    };
  }
  public render(): JSX.Element {
    const scalesRootPitch = this.state.rootPitch;
    const scales = this.props.scales ? this.props.scales : defaultScales;
    const rows = scales
      .map(scale => {
        const scalePitches = scale.getPitches(scalesRootPitch);

        const triadCells = scale.getDiatonicChordTypes(3)
          .map((chordType, i) => this.renderCell(scalesRootPitch, 1 + i, chordType, scalePitches[i]));
        const seventhChordCells = scale.getDiatonicChordTypes(4)
          .map((chordType, i) => this.renderCell(scalesRootPitch, 1 + i, chordType, scalePitches[i]));
        
        return [
          (
            <TableRow>
              <TableCell rowSpan={2}>{scale.type}</TableCell>
              {triadCells}
            </TableRow>
          ),
          (
            <TableRow>
              {seventhChordCells}
            </TableRow>
          )
        ];
      });

    return (
      <Card>
        <CardContent>
          <div style={{display: "flex"}}>
            <Typography gutterBottom={true} variant="h5" component="h2" style={{flexGrow: 1}}>
              Diatonic Chord Viewer
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
          </div>
          
          <p style={{textAlign: "center"}}>
            <Checkbox checked={this.state.playDrone} onChange={event => this.togglePlayDrone()} />
            <span>Play Scale Root in Bass</span>
          </p>

          <Table key={this.state.rootPitch.midiNumber}>
            <TableHead>
              <TableRow>
                <TableCell>Scale</TableCell>
                <TableCell>1</TableCell>
                <TableCell>2</TableCell>
                <TableCell>3</TableCell>
                <TableCell>4</TableCell>
                <TableCell>5</TableCell>
                <TableCell>6</TableCell>
                <TableCell>7</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows}
            </TableBody>
          </Table>
        
          <div style={{textAlign: "center"}}></div>
        </CardContent>
      </Card>
    );
  }

  private renderCell(scaleRootPitch: Pitch, scaleDegree: number, chordType: ChordType, chordRootPitch: Pitch): JSX.Element {
    const romanNumeral = chordType.isMajorType
      ? Utils.getRomanNumerals(scaleDegree)
      : Utils.getRomanNumerals(scaleDegree).toLowerCase();

    let pitches = Chord.fromPitchAndFormulaString(chordRootPitch, chordType.formulaString)
      .pitches;
    if (this.state.playDrone) {
      pitches.push(new Pitch(
        scaleRootPitch.letter,
        scaleRootPitch.signedAccidental,
        scaleRootPitch.octaveNumber - 1
      ));
    }

    return (
      <TableCell>
        <PitchesAudioPlayer
          pitches={pitches}
          playSequentially={false}>
          {romanNumeral}<sup>{chordType.symbols[0]}</sup>
        </PitchesAudioPlayer>
      </TableCell>
    );
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
  private togglePlayDrone() {
    this.setState({ playDrone: !this.state.playDrone });
  }
}