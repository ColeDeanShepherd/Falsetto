import * as React from "react";

import { Pitch } from "../../lib/TheoryLib/Pitch";
import { playPitchesSequentially } from "../../Audio/PianoAudio";
import { PianoKeyboard } from "../Utils/PianoKeyboard";
import { PitchLetter } from "../../lib/TheoryLib/PitchLetter";
import { Card } from "../Card/Card";
import { randomInt } from "../../lib/Core/Random";
import { Button } from "../Button/Button";

const minPitch = new Pitch(PitchLetter.C, 0, 4);
const maxPitch = new Pitch(PitchLetter.B, 0, 5);
const pianoMaxHeight = 170;
const maxIntervalDistance = 12;

interface IInfiniteMelodyTrainerProps {}

interface IInfiniteMelodyTrainerState {
  lastNote: Pitch;
  currentNote: Pitch;
}

export class InfiniteMelodyTrainer extends React.Component<IInfiniteMelodyTrainerProps, IInfiniteMelodyTrainerState> {
  public constructor(props: IInfiniteMelodyTrainerProps) {
    super(props);

    this.state = {
      lastNote: minPitch,
      currentNote: this.getNewRandomPitch(minPitch)
    };
  }

  public render(): JSX.Element {
    return (
      <Card style={{ maxWidth: "420px", margin: "0 auto", textAlign: "center" }}>
        <h2 className="h5 margin-bottom" style={{flexGrow: 1}}>
          Infinite Melody Ear Trainer
        </h2>

        {<Button onClick={() => this.playPitches()}>Play Notes</Button>}

        <p></p>

        <PianoKeyboard
          maxHeight={pianoMaxHeight}
          lowestPitch={minPitch}
          highestPitch={maxPitch}
          onKeyPress={this.onKeyPress.bind(this)}
          pressedPitches={[this.state.lastNote]}
        />
      </Card>
    );
  }
  
  private stopSoundsFunc: (() => void) | null = null;

  private playPitches() {
    if (this.stopSoundsFunc !== null) {
      this.stopSoundsFunc();
      this.stopSoundsFunc = null;
    }

    const result = playPitchesSequentially([this.state.lastNote, this.state.currentNote], 1000, true);
    this.stopSoundsFunc = result;
  }

  private onKeyPress(keyPitch: Pitch) {
    if (keyPitch.equals(this.state.currentNote)) {
      const newPitch = this.getNewRandomPitch(this.state.currentNote);

      this.setState(
        { lastNote: this.state.currentNote, currentNote: newPitch },
        () => this.playPitches());
    }
  }

  private getNewRandomPitch(currentNote: Pitch): Pitch {
    let newPitchMidiNumber: number;

    do {
      newPitchMidiNumber = randomInt(minPitch.midiNumber, maxPitch.midiNumber);
    } while ((newPitchMidiNumber === currentNote.midiNumber) || (Math.abs(newPitchMidiNumber - currentNote.midiNumber) > maxIntervalDistance));

    const newPitch = Pitch.createFromMidiNumber(newPitchMidiNumber);
    return newPitch;
  }
}