import * as React from "react";
import { Table, TableHead, TableBody, TableRow, TableCell, Checkbox } from '@material-ui/core';

import * as Utils from "../../lib/Core/Utils";
import { Chord } from '../../lib/TheoryLib/Chord';
import { PitchesAudioPlayer } from '../Utils/PitchesAudioPlayer';
import { Pitch } from '../../lib/TheoryLib/Pitch';
import { PitchLetter } from '../../lib/TheoryLib/PitchLetter';
import { ScaleType } from '../../lib/TheoryLib/Scale';
import { ValidKeyPitchSelect } from '../Utils/ValidKeyPitchSelect';
import { getRomanNumerals } from '../../lib/Core/Utils';
import { ChordType } from "../../lib/TheoryLib/ChordType";
import { Card } from "../../ui/Card/Card";

export const defaultScales = [
  ScaleType.Ionian,
  ScaleType.Dorian,
  ScaleType.Phrygian,
  ScaleType.Lydian,
  ScaleType.Mixolydian,
  ScaleType.Aeolian,
  ScaleType.Locrian,
  ScaleType.MelodicMinor,
  ScaleType.HarmonicMinor
];

export function getChordRomanNumeralNotation(chord: Chord, scaleDegree: number): JSX.Element {
  const romanNumeral = chord.type.isMajorType
    ? getRomanNumerals(scaleDegree)
    : getRomanNumerals(scaleDegree).toLowerCase();

  return (
    <span>
      {romanNumeral}
      {(chord.type !== ChordType.Minor) ? <sup>{chord.type.symbols[0]}</sup> : null}
    </span>
  );
}

export interface IDiatonicChordPlayerProps {
  scales?: Array<ScaleType>;
}
export interface IDiatonicChordPlayerState {
  rootPitch: Pitch;
  playDrone: boolean;
}
export class DiatonicChordPlayer extends React.Component<IDiatonicChordPlayerProps, IDiatonicChordPlayerState> {
  public constructor(props: IDiatonicChordPlayerProps) {
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
          .map((chordType, i) => this.renderCell(scalesRootPitch, 1 + i, new Chord(chordType, scalePitches[i])));
        const seventhChordCells = scale.getDiatonicChordTypes(4)
          .map((chordType, i) => this.renderCell(scalesRootPitch, 1 + i, new Chord(chordType, scalePitches[i])));
        
        return [
          (
            <TableRow>
              <TableCell rowSpan={2}>{scale.name}</TableCell>
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
        <div style={{display: "flex"}}>
          <h2 className="h5 margin-bottom" style={{flexGrow: 1}}>
            Diatonic Chord Player
          </h2>
        </div>

        <div style={{textAlign: "center"}}>
          <h4 className="h6 margin-bottom">
            Root Pitch
          </h4>
          <div style={{padding: "1em 0"}}>
            <ValidKeyPitchSelect
              preferredOctaveNumber={4}
              value={[this.state.rootPitch]}
              onChange={rootPitches => this.onRootPitchClick(rootPitches[0])}
            />
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
      </Card>
    );
  }

  private renderCell(scaleRootPitch: Pitch, scaleDegree: number, chord: Chord): JSX.Element {
    let pitches = chord.getPitches();
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
          {getChordRomanNumeralNotation(chord, scaleDegree)}
        </PitchesAudioPlayer>
      </TableCell>
    );
  }

  private onRootPitchClick(rootPitch: Pitch) {
    this.setState({ rootPitch: rootPitch });
  }
  private togglePlayDrone() {
    this.setState({ playDrone: !this.state.playDrone });
  }
}