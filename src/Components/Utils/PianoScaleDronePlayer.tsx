import * as React from "react";

import { Scale } from '../../lib/TheoryLib/Scale';
import { Pitch, tryWrapPitchOctave } from '../../lib/TheoryLib/Pitch';
import { playPitches } from '../../Audio/PianoAudio';
import { Rect2D } from '../../lib/Core/Rect2D';
import { Size2D } from '../../lib/Core/Size2D';
import { Vector2D } from '../../lib/Core/Vector2D';
import { PitchLetter } from '../../lib/TheoryLib/PitchLetter';
import { renderPianoKeyboardNoteNames, PianoKeyboard, PianoKeyboardMetrics } from './PianoKeyboard';
import { doesKeyUseSharps } from '../../lib/TheoryLib/Key';
import { arrayContains, immutableAddIfNotFoundInArray, immutableRemoveIfFoundInArray, addIfNotFoundInArray, removeIfFoundInArray } from '../../lib/Core/ArrayUtils';
import { getPianoKeyboardAspectRatio } from './PianoUtils';
import { MidiNoteEventListener } from "./MidiNoteEventListener";
import { unwrapValueOrUndefined } from "../../lib/Core/Utils";
import { Margin } from "../../lib/Core/Margin";

const lowestPitch = new Pitch(PitchLetter.C, 0, 4);

export function onKeyPress(scale: Scale, keyPitch: Pitch): (() => void) | undefined {
  const scalePitches = scale.getPitches();
  const pitchMidiNumberNoOctaves = scalePitches.map(p => p.midiNumberNoOctave);

  if (arrayContains(pitchMidiNumberNoOctaves, keyPitch.midiNumberNoOctave)) {
    return onKeyPressInternal(scale, keyPitch);
  }

  return undefined;
}

function onKeyPressInternal(scale: Scale, keyPitch: Pitch): (() => void) | undefined {
  const pitches = (keyPitch.midiNumber === scale.rootPitch.midiNumber)
      ? [scale.rootPitch]
      : [scale.rootPitch, keyPitch];
  
  const audioCancellationFn = playPitches(pitches)[1];
  return audioCancellationFn;
}

export function renderExtrasFn(metrics: PianoKeyboardMetrics, pitches: Array<Pitch>, rootPitch: Pitch): JSX.Element {
  const pitchMidiNumberNoOctaves = pitches.map(p => p.midiNumberNoOctave);

  return renderPianoKeyboardNoteNames(
    metrics,
    doesKeyUseSharps(rootPitch.letter, rootPitch.signedAccidental),
    p => arrayContains(pitchMidiNumberNoOctaves, p.midiNumberNoOctave)
  );
}

export interface IPianoScaleDronePlayerProps {
  scale: Scale;
  octaveCount: number;
  maxWidth: number;
  renderDefaultExtras?: boolean;
  renderExtrasFn?: (metrics: PianoKeyboardMetrics) => JSX.Element;
  margin?: Margin;
}

export interface IPianoScaleDronePlayerState {
  pressedPitches: Array<Pitch>
}

export class PianoScaleDronePlayer extends React.Component<IPianoScaleDronePlayerProps, IPianoScaleDronePlayerState> {
  public constructor(props: IPianoScaleDronePlayerProps) {
    super(props);

    this.state = this.getStateFromProps(props);
  }
  
  public componentWillReceiveProps(nextProps: IPianoScaleDronePlayerProps) {
    this.setState(this.getStateFromProps(nextProps));
  }

  public render(): JSX.Element {
    const { scale, octaveCount, maxWidth, margin } = this.props;

    const renderDefaultExtras = (this.props.renderDefaultExtras !== undefined)
      ? this.props.renderDefaultExtras
      : true;
    
    const pitches = scale.getPitches();
    const aspectRatio = getPianoKeyboardAspectRatio(octaveCount);
    const style = { width: "100%", maxWidth: `${maxWidth}px`, height: "auto" };
  
    return (
      <div>
        <PianoKeyboard
          rect={new Rect2D(new Size2D(aspectRatio * 100, 100), new Vector2D(0, 0))}
          lowestPitch={lowestPitch}
          highestPitch={this.highestPitch}
          pressedPitches={this.state.pressedPitches}
          renderExtrasFn={metrics => (
            <g>
              {renderDefaultExtras ? renderExtrasFn(metrics, pitches, scale.rootPitch) : null}
              {this.props.renderExtrasFn ? this.props.renderExtrasFn(metrics) : null}
            </g>
          )}
          onKeyPress={pitch => this.onKeyPress(pitch, /*velocity*/ 1)}
          onKeyRelease={pitch => this.onKeyRelease(pitch)}
          margin={margin}
          style={style} />
        <MidiNoteEventListener
          onNoteOn={(pitch, velocity) => this.onKeyPress(pitch, velocity)}
          onNoteOff={pitch => this.onKeyRelease(pitch)}
          isComputerKeyboardPlayable={true} />
      </div>
    );
  }

  private audioCancellationFn: (() => void) | undefined = undefined;

  private get highestPitch(): Pitch {
    const { octaveCount } = this.props;

    return new Pitch(PitchLetter.B, 0, 4 + (octaveCount - 1));
  }

  private getStateFromProps(props: IPianoScaleDronePlayerProps) : IPianoScaleDronePlayerState {
    return {
      pressedPitches: []
    };
  }

  private onKeyPress(pitch: Pitch, velocity: number) {
    const { scale } = this.props;

    if (this.audioCancellationFn) {
      this.audioCancellationFn();
    }

    const scalePitches = scale.getPitches();
    const pitchMidiNumberNoOctaves = scalePitches.map(p => p.midiNumberNoOctave);
  
    if (arrayContains(pitchMidiNumberNoOctaves, pitch.midiNumberNoOctave)) {
      this.audioCancellationFn = onKeyPressInternal(scale, pitch);
      
      const wrapOctave = true;
      const wrappedPitch = wrapOctave
        ? unwrapValueOrUndefined(tryWrapPitchOctave(pitch, lowestPitch, this.highestPitch))
        : pitch;

      if (Pitch.isInRange(wrappedPitch, lowestPitch, this.highestPitch)) {
        this.setState((prevState, props) => {
          // Add the pressed pitch.
          let newPressedPitches = immutableAddIfNotFoundInArray(prevState.pressedPitches, wrappedPitch, p => p.equals(wrappedPitch));

          // Add the root pitch of the scale.
          addIfNotFoundInArray(newPressedPitches, scale.rootPitch, p => p.equals(scale.rootPitch));
          
          return { pressedPitches: newPressedPitches };
        });
      }
    } else {
      this.audioCancellationFn = undefined;
    }
  }

  // TODO: stop playing when released
  // TODO: add computer keyboard support
  private onKeyRelease(pitch: Pitch) {
    const { scale } = this.props;

    const wrapOctave = true;
    const wrappedPitch = wrapOctave
      ? unwrapValueOrUndefined(tryWrapPitchOctave(pitch, lowestPitch, this.highestPitch))
      : pitch;
    
    this.setState((prevState, props) => {
      // Remove the released pitch if it's not the root pitch of the scale.
      let newPressedPitches = !wrappedPitch.equals(scale.rootPitch)
        ? immutableRemoveIfFoundInArray(prevState.pressedPitches, p => p.equals(wrappedPitch))
        : prevState.pressedPitches.slice();

      // Remove the root pitch of the scale if no other pitches are still pressed.
      if ((newPressedPitches.length === 1) && newPressedPitches.find(p => p.equals(scale.rootPitch))) {
        removeIfFoundInArray(newPressedPitches, p => p.equals(scale.rootPitch));
      }

      return { pressedPitches: newPressedPitches };
    });
  }
}