import * as React from 'react';
import { Card, CardContent, Typography, Button } from '@material-ui/core';
import * as Vex from 'vexflow';

import * as Utils from '../Utils';
import { VexFlowComponent } from "./VexFlowComponent";
import { PitchLetter } from "../PitchLetter";
import { FlashCard } from 'src/FlashCard';
import { renderFlashCardSide } from "./FlashCard";
import Pitch from 'src/Pitch';

export function createFlashCards(): FlashCard[] {
  const clefs = [
    {
      name: "treble",
      bottomLinePitch: new Pitch(PitchLetter.E, 0, 4)
    },
    {
      name: "bass",
      bottomLinePitch: new Pitch(PitchLetter.G, 0, 2)
    }
  ];
  return Utils.flattenArrays(
    clefs.map(clef => Utils.range(0, 20)
      .map(i => Utils.range(-1, 1)
        .map(signedAccidental => {
          const pitch = Pitch.addPitchLetters(clef.bottomLinePitch, -6 + i);
          pitch.signedAccidental = signedAccidental;

          const pitchAccidentalString = pitch.getAccidentalString();
          const vexFlowPitchString = `${PitchLetter[pitch.letter].toLowerCase()}${pitchAccidentalString}/${pitch.octaveNumber}`;
          
          const isTrebleNote = (clef.name === "treble");
          const trebleNotes = [
            new Vex.Flow.StaveNote({
              clef: "treble",
              keys: isTrebleNote ? [vexFlowPitchString] : ["b/4"],
              duration: isTrebleNote ? "w" : "wr"
            })
          ];
          const bassNotes = [
            new Vex.Flow.StaveNote({
              clef: "bass",
              keys: !isTrebleNote ? [vexFlowPitchString] : ["d/3"],
              duration: !isTrebleNote ? "w" : "wr"
            })
          ];

          if (signedAccidental !== 0) {
            if (isTrebleNote) {
              for (const note of trebleNotes) {
                note.addAccidental(0, new Vex.Flow.Accidental(pitchAccidentalString));
              }
            } else {
              for (const note of bassNotes) {
                note.addAccidental(0, new Vex.Flow.Accidental(pitchAccidentalString));
              }
            }
          }

          return new FlashCard(
            () => (
              <SheetMusicSingleNote
                width={150} height={200}
                trebleNotes={trebleNotes}
                bassNotes={bassNotes}
              />
            ),
            `${PitchLetter[pitch.letter]}${pitchAccidentalString}`
          );
        })
      )
    )
  );
}

export interface ISheetMusicSingleNoteProps {
  width: number;
  height: number;
  trebleNotes: Array<Vex.Flow.StaveNote>;
  bassNotes: Array<Vex.Flow.StaveNote>;
}
export class SheetMusicSingleNote extends React.Component<ISheetMusicSingleNoteProps, {}> {
  public render(): JSX.Element {
    const vexFlowRender = this.vexFlowRender.bind(this);
    return <VexFlowComponent width={this.props.width} height={this.props.height} vexFlowRender={vexFlowRender} />;
  }

  private vexFlowRender(context: Vex.IRenderContext) {
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
    
    voiceTreble.addTickables(this.props.trebleNotes).setStave(topStaff);
    voiceBass.addTickables(this.props.bassNotes).setStave(bottomStaff);
    
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

export interface ISheetMusicNotesState {
  isShowingFront: boolean;
  trebleNotes: Array<Vex.Flow.StaveNote>;
  bassNotes: Array<Vex.Flow.StaveNote>;
}
export class SheetMusicNotes extends React.Component<{}, ISheetMusicNotesState> {
  constructor(props: {}) {
    super(props);

    const trebleNotes = [];
    const bassNotes = [];

    for (let i = 0; i < 1; i++) {
      const notes = this.getRandomNotes();
      trebleNotes.push(notes.trebleNote);
      bassNotes.push(notes.bassNote);
    }

    this.state = {
      isShowingFront: true,
      trebleNotes: trebleNotes,
      bassNotes: bassNotes
    };
  }

  public render(): JSX.Element {
    const currentNoteName = !this.state.trebleNotes[0].isRest()
      ? this.state.trebleNotes[0].getKeyProps()[0].key
      : this.state.bassNotes[0].getKeyProps()[0].key;
    const flashCard = new FlashCard(
      () => (
        <SheetMusicSingleNote
          width={300} height={200}
          trebleNotes={this.state.trebleNotes}
          bassNotes={this.state.bassNotes}
        />
      ),
      currentNoteName
    );

    return (
      <Card>
        <CardContent>
          <Typography gutterBottom={true} variant="h5" component="h2">
            Sheet Music Notes
          </Typography>

          {this.state.isShowingFront
            ? <div style={{textAlign: "center", fontSize: "2em"}}>{renderFlashCardSide(flashCard.frontSide)}</div>
            : <div style={{textAlign: "center", fontSize: "2em", height: 200}}>{renderFlashCardSide(flashCard.backSide)}</div>
          }
          
          <Button onClick={event => this.flipFlashCard()} variant="outlined" color="primary">Flip</Button>
          <Button onClick={event => this.moveToNextNote()} variant="outlined" color="primary">Next</Button>
        </CardContent>
      </Card>
    );
  }
  
  private getRandomNotes() {
    const isTrebleNote = Utils.randomBoolean();

    return {
      trebleNote: new Vex.Flow.StaveNote({
        clef: "treble",
        keys: isTrebleNote ? [this.getRandomTreblePitch()] : ["b/4"],
        duration: isTrebleNote ? "w" : "wr"
      }),
      bassNote: new Vex.Flow.StaveNote({
        clef: "bass",
        keys: !isTrebleNote ? [this.getRandomBassPitch()] : ["d/3"],
        duration: !isTrebleNote ? "w" : "wr"
      }),
    };
  }
  private getRandomTreblePitch(): string {
    return this.getRandomStaffPitch(new Pitch(PitchLetter.F, 0, 3));
  }
  private getRandomBassPitch(): string {
    return this.getRandomStaffPitch(new Pitch(PitchLetter.A, 0, 1));
  }
  private getRandomStaffPitch(bottomPitch: Pitch): string {
    const pitch = Pitch.addPitchLetters(bottomPitch, Utils.randomInt(0, 20));
    return `${PitchLetter[pitch.letter].toLowerCase()}/${pitch.octaveNumber}`;
  }

  private flipFlashCard() {
    this.setState({ isShowingFront: !this.state.isShowingFront });
  }
  private moveToNextNote() {
    const notes = this.getRandomNotes();

    const newTrebleNotes = this.state.trebleNotes;
    newTrebleNotes.splice(0, 1);
    newTrebleNotes.push(notes.trebleNote);

    const newBassNotes = this.state.bassNotes;
    newBassNotes.splice(0, 1);
    newBassNotes.push(notes.bassNote);
    
    this.setState({
      isShowingFront: true,
      trebleNotes: newTrebleNotes,
      bassNotes: newBassNotes
    });
  }
}