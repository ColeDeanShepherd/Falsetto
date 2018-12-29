import * as React from 'react';
import * as Vex from 'vexflow';

import * as Utils from '../Utils';
import { Pitch } from 'src/Pitch';
import { PitchLetter } from 'src/PitchLetter';
import { VexFlowComponent } from './VexFlowComponent';

export interface ISheetMusicChordProps {
  width: number;
  height: number;
  pitches: Array<Pitch>;
}
export class SheetMusicChord extends React.Component<ISheetMusicChordProps, {}> {
  public render(): JSX.Element {
    const vexFlowRender = this.vexFlowRender.bind(this);
    return <VexFlowComponent width={this.props.width} height={this.props.height} vexFlowRender={vexFlowRender} />;
  }

  private vexFlowRender(context: Vex.IRenderContext) {
    Utils.assert(this.props.pitches.length >= 2);

    context.setFont("Arial", 10).setBackgroundFillStyle("#eed");

    // Create the staves
    const staveLength = this.props.width;
    const staveX = 20;

    const topStaff = new Vex.Flow.Stave(staveX, 0, staveLength);
    topStaff.addClef('treble');
    //topStaff.addTimeSignature("4/4");

    const bottomStaff = new Vex.Flow.Stave(staveX, 80, staveLength);
    bottomStaff.addClef('bass');
    //bottomStaff.addTimeSignature("4/4");

    const brace = new Vex.Flow.StaveConnector(topStaff, bottomStaff).setType(3);
    const lineLeft = new Vex.Flow.StaveConnector(topStaff, bottomStaff).setType(1);
    const lineRight = new Vex.Flow.StaveConnector(topStaff, bottomStaff).setType(6);

    topStaff.setContext(context).draw();
    bottomStaff.setContext(context).draw();

    brace.setContext(context).draw();
    lineLeft.setContext(context).draw();
    lineRight.setContext(context).draw();

    const voiceTreble = new Vex.Flow.Voice({num_beats:4, beat_value: 4, resolution:Vex.Flow.RESOLUTION});
    const voiceBass = new Vex.Flow.Voice({num_beats:4, beat_value: 4, resolution:Vex.Flow.RESOLUTION});
    
    const lowestTrebleClefPitch = new Pitch(PitchLetter.C, 0, 4);
    const isPitchInTrebleClef = (pitch: Pitch) => pitch.midiNumber >= lowestTrebleClefPitch.midiNumber;

    // TODO: need to add accidentals
    const treblePitches = this.props.pitches
      .filter(p => isPitchInTrebleClef(p));
    const trebleVexFlowNotes = (treblePitches.length > 0) ? [
      new Vex.Flow.StaveNote({
        clef: "treble",
        keys: treblePitches.map(p => p.toVexFlowString()),
        duration: "w"
      })
    ] : [
      new Vex.Flow.StaveNote({
        clef: "treble",
        keys: ["b/4"],
        duration: "wr"
      })
    ];
    // add treble clef accidentals to VexFlow
    for (let i = 0; i < treblePitches.length; i++) {
      const pitch = treblePitches[i];

      if (pitch.signedAccidental !== 0) {
        trebleVexFlowNotes[0].addAccidental(i, new Vex.Flow.Accidental(pitch.getAccidentalString()))
      }
    }

    const bassPitches = this.props.pitches
      .filter(p => !isPitchInTrebleClef(p));
    const bassVexFlowNotes = (bassPitches.length > 0) ? [
      new Vex.Flow.StaveNote({
        clef: "bass",
        keys: bassPitches.map(p => p.toVexFlowString()),
        duration: "w"
      })
    ] : [
      new Vex.Flow.StaveNote({
        clef: "bass",
        keys: ["d/3"],
        duration: "wr"
      })
    ];
    // add bass clef accidentals to VexFlow
    for (let i = 0; i < bassPitches.length; i++) {
      const pitch = bassPitches[i];

      if (pitch.signedAccidental !== 0) {
        bassVexFlowNotes[0].addAccidental(i, new Vex.Flow.Accidental(pitch.getAccidentalString()))
      }
    }

    voiceTreble.addTickables(trebleVexFlowNotes).setStave(topStaff);
    voiceBass.addTickables(bassVexFlowNotes).setStave(bottomStaff);
    
    const formatter = new Vex.Flow.Formatter();
    
    // Make sure the staves have the same starting point for notes
    const startX = Math.max(topStaff.getNoteStartX(), bottomStaff.getNoteStartX());
    topStaff.setNoteStartX(startX);
    bottomStaff.setNoteStartX(startX);
    
    // the treble and bass are joined independently but formatted together
    formatter.joinVoices([voiceTreble]);
    formatter.joinVoices([voiceBass]);
    formatter.format([voiceTreble, voiceBass], staveLength - (startX - staveX));
    
    voiceTreble.draw(context);
    voiceBass.draw(context);
  }
}