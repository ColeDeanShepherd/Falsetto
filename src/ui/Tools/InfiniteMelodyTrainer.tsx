import * as React from "react";

import { Pitch } from "../../lib/TheoryLib/Pitch";
import { playPitches, playPitchesSequentially } from "../../Audio/PianoAudio";
import { PianoKeyboard } from "../Utils/PianoKeyboard";
import { PitchLetter } from "../../lib/TheoryLib/PitchLetter";
import { Card } from "../Card/Card";
import { randomInt } from "../../lib/Core/Random";
import { Button } from "../Button/Button";

const minPitch = new Pitch(PitchLetter.C, 0, 4);
const maxPitch = new Pitch(PitchLetter.B, 0, 4);
const pianoMaxHeight = 140;

interface IInfiniteMelodyTrainerProps {}

interface IInfiniteMelodyTrainerState {
  currentNote: Pitch;
}

export class InfiniteMelodyTrainer extends React.Component<IInfiniteMelodyTrainerProps, IInfiniteMelodyTrainerState> {
  public constructor(props: IInfiniteMelodyTrainerProps) {
    super(props);

    this.state = {
      currentNote: minPitch
    };
  }

  public render(): JSX.Element {
    return (
      <Card style={{ maxWidth: "420px", margin: "0 auto", textAlign: "center" }}>
        <h2 className="h5 margin-bottom" style={{flexGrow: 1}}>
          Infinite Melody Trainer
        </h2>

        {<Button onClick={() => this.playPitch(this.state.currentNote)}>Play Current Note</Button>}

        <p>The first note is the lowest note!</p>

        <PianoKeyboard
          maxHeight={pianoMaxHeight}
          lowestPitch={minPitch}
          highestPitch={maxPitch}
          onKeyPress={this.onKeyPress.bind(this)}
        />
      </Card>
    );
  }
  
  private stopSoundsFunc: (() => void) | null = null;

  private playPitch(pitch: Pitch) {
    if (this.stopSoundsFunc !== null) {
      this.stopSoundsFunc();
      this.stopSoundsFunc = null;
    }

    const result = playPitches([pitch]);
    this.stopSoundsFunc = result[1];
  }

  private onKeyPress(keyPitch: Pitch) {
    if (keyPitch.equals(this.state.currentNote)) {
      let newPitchMidiNumber: number;

      do {
        newPitchMidiNumber = randomInt(minPitch.midiNumber, maxPitch.midiNumber);
      } while (newPitchMidiNumber === this.state.currentNote.midiNumber);

      const newPitch = Pitch.createFromMidiNumber(newPitchMidiNumber);

      this.setState({ currentNote: newPitch });
      this.playPitch(newPitch);
    } else {
    }
  }
}