import { immutableAddIfNotFoundInArray, immutableRemoveIfFoundInArray } from '../../lib/Core/ArrayUtils';
import { Rect2D } from "../../lib/Core/Rect2D";
import { Size2D } from "../../lib/Core/Size2D";
import { Vector2D } from "../../lib/Core/Vector2D";
import { Pitch, tryWrapPitchOctave } from '../../lib/TheoryLib/Pitch';
import { AppModel } from "../../App/Model";
import { PianoKeyboard, PianoKeyboardMetrics } from "./PianoKeyboard";
import { MidiNoteEventListener } from "./MidiNoteEventListener";
import React from "react";
import { unwrapValueOrUndefined } from '../../lib/Core/Utils';
import { Margin } from "../../lib/Core/Margin";

export interface IPlayablePianoKeyboardProps {
  aspectRatio: number,
  maxWidth: number,
  lowestPitch: Pitch,
  highestPitch: Pitch,
  forcePressedPitches?: Array<Pitch>;
  margin?: Margin;
  renderExtrasFn?: (metrics: PianoKeyboardMetrics) => JSX.Element;
  onKeyPress?: (keyPitch: Pitch, velocity: number) => void;
  onKeyRelease?: (keyPitch: Pitch) => void;
  wrapOctave?: boolean;
}

export interface IPlayablePianoKeyboardState {
  userPressedPitches: Array<Pitch>
}

export class PlayablePianoKeyboard extends React.Component<IPlayablePianoKeyboardProps, IPlayablePianoKeyboardState> {
  public constructor(props: IPlayablePianoKeyboardProps) {
    super(props);

    this.state = {
      userPressedPitches: []
    };
  }

  public render(): JSX.Element {
    const { aspectRatio, maxWidth, lowestPitch, highestPitch, margin, renderExtrasFn } = this.props;

    const pressedPitches = this.getPressedPitches();

    return (
      <div>
        <PianoKeyboard
          rect={new Rect2D(new Size2D(aspectRatio * 100, 100), new Vector2D(0, 0))}
          margin={margin}
          lowestPitch={lowestPitch}
          highestPitch={highestPitch}
          pressedPitches={pressedPitches}
          onKeyPress={p => this.onKeyPress(p)}
          onKeyRelease={p => this.onKeyRelease(p)}
          renderExtrasFn={renderExtrasFn}
          style={{ width: "100%", maxWidth: `${maxWidth}px`, height: "auto" }} />
        <MidiNoteEventListener
          onNoteOn={(pitch, velocity) => this.onKeyPress(pitch)}
          onNoteOff={pitch => this.onKeyRelease(pitch)}
          isComputerKeyboardPlayable={true} />
      </div>
    );
  }

  private getPressedPitches(): Array<Pitch> {
    const { forcePressedPitches } = this.props;
    const { userPressedPitches } = this.state;

    const pitchMidiNumbers = new Set<number>(
      userPressedPitches
        .map(p => p.midiNumber)
    );
    
    if (forcePressedPitches) {
      for (const pitch of forcePressedPitches) {
        pitchMidiNumbers.add(pitch.midiNumber);
      }
    }

    const pitches = [...pitchMidiNumbers]
      .map(n => Pitch.createFromMidiNumber(n, /*useSharps*/ true));

    return pitches;
  }

  private onKeyPress(pitch: Pitch) {
    const { lowestPitch, highestPitch, onKeyPress } = this.props;

    const velocity = 1;

    AppModel.instance.pianoAudio.pressKey(pitch, velocity);

    const wrapOctave = (this.props.wrapOctave !== undefined)
      ? this.props.wrapOctave
      : false;
    
    const wrappedPitch = wrapOctave
      ? unwrapValueOrUndefined(tryWrapPitchOctave(pitch, lowestPitch, highestPitch))
      : pitch;

    if (Pitch.isInRange(wrappedPitch, lowestPitch, highestPitch)) {
      this.setState((prevState, props) => {
        return { userPressedPitches: immutableAddIfNotFoundInArray(prevState.userPressedPitches, wrappedPitch, (p, i) => p.equals(wrappedPitch)) };
      });
    }

    if (onKeyPress) {
      onKeyPress(pitch, velocity);
    }
  }

  private onKeyRelease(pitch: Pitch) {
    const { lowestPitch, highestPitch, forcePressedPitches, onKeyRelease } = this.props;

    AppModel.instance.pianoAudio.releaseKey(pitch);

    const wrapOctave = (this.props.wrapOctave !== undefined)
      ? this.props.wrapOctave
      : false;

    const wrappedPitch = wrapOctave
      ? unwrapValueOrUndefined(tryWrapPitchOctave(pitch, lowestPitch, highestPitch))
      : pitch;
    
    const isWrappedPitchForcePressed = forcePressedPitches && forcePressedPitches.some(p => p.equals(wrappedPitch));
    if (!isWrappedPitchForcePressed) {
      this.setState((prevState, props) => {
        return { userPressedPitches: immutableRemoveIfFoundInArray(prevState.userPressedPitches, (p, i) => p.equals(wrappedPitch)) };
      });
    }

    if (onKeyRelease) {
      onKeyRelease(pitch);
    }
  }
}
 