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

export interface IPlayablePianoKeyboardProps {
  aspectRatio: number,
  maxWidth: number,
  lowestPitch: Pitch,
  highestPitch: Pitch,
  forcePressedPitches?: Array<Pitch>;
  renderExtrasFn?: (metrics: PianoKeyboardMetrics) => JSX.Element;
  onKeyPress?: (keyPitch: Pitch, velocity: number) => void;
  onKeyRelease?: (keyPitch: Pitch) => void;
  wrapOctave?: boolean;
}

export interface IPlayablePianoKeyboardState {
  pressedPitches: Array<Pitch>
}

export class PlayablePianoKeyboard extends React.Component<IPlayablePianoKeyboardProps, IPlayablePianoKeyboardState> {
  public constructor(props: IPlayablePianoKeyboardProps) {
    super(props);

    this.state = this.getStateFromProps(props);
  }

  public componentWillReceiveProps(nextProps: IPlayablePianoKeyboardProps) {
    this.setState(this.getStateFromProps(nextProps));
  }

  public render(): JSX.Element {
    const { aspectRatio, maxWidth, lowestPitch, highestPitch, renderExtrasFn } = this.props;
    const { pressedPitches } = this.state; 

    return (
      <div>
        <PianoKeyboard
          rect={new Rect2D(new Size2D(aspectRatio * 100, 100), new Vector2D(0, 0))}
          lowestPitch={lowestPitch}
          highestPitch={highestPitch}
          pressedPitches={pressedPitches}
          onKeyPress={p => this.onKeyPress(p)}
          onKeyRelease={p => this.onKeyRelease(p)}
          renderExtrasFn={renderExtrasFn}
          style={{ width: "100%", maxWidth: `${maxWidth}px`, height: "auto" }} />
        <MidiNoteEventListener
          onNoteOn={(pitch, velocity) => this.onKeyPress(pitch)}
          onNoteOff={pitch => this.onKeyRelease(pitch)} />
      </div>
    );
  }

  private getStateFromProps(props: IPlayablePianoKeyboardProps) : IPlayablePianoKeyboardState {
    return {
      pressedPitches: props.forcePressedPitches
        ? props.forcePressedPitches.slice()
        : []
    };
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
        return { pressedPitches: immutableAddIfNotFoundInArray(prevState.pressedPitches, wrappedPitch, (p, i) => p.equals(wrappedPitch)) };
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
        return { pressedPitches: immutableRemoveIfFoundInArray(prevState.pressedPitches, (p, i) => p.equals(wrappedPitch)) };
      });
    }

    if (onKeyRelease) {
      onKeyRelease(pitch);
    }
  }
}
 