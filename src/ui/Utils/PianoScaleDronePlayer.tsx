import * as React from "react";

import { Scale } from '../../lib/TheoryLib/Scale';
import { createPitch, equals, getClass, isInRange, Pitch, tryWrapPitchOctave } from '../../lib/TheoryLib/Pitch';
import { PitchLetter } from '../../lib/TheoryLib/PitchLetter';
import { renderPianoKeyboardNoteNames, PianoKeyboard, PianoKeyboardMetrics } from './PianoKeyboard';
import { doesKeyUseSharps } from '../../lib/TheoryLib/Key';
import { arrayContains, immutableAddIfNotFoundInArray, immutableRemoveIfFoundInArray, addIfNotFoundInArray, removeIfFoundInArray } from '../../lib/Core/ArrayUtils';
import { MidiNoteEventListener } from "./MidiNoteEventListener";
import { unwrapValueOrUndefined } from "../../lib/Core/Utils";
import { Margin } from "../../lib/Core/Margin";
import { AppModel } from "../../App/Model";

const lowestPitch = createPitch(PitchLetter.C, 0, 4);
const wrapOctave = true;

export function onKeyPress(scale: Scale, keyPitch: Pitch) {
  const scalePitches = scale.getPitchClasses();
  const pitchMidiNumberNoOctaves = scalePitches.map(p => getClass(p));

  if (arrayContains(pitchMidiNumberNoOctaves, getClass(keyPitch))) {
    return onKeyPressInternal(scale, keyPitch);
  }

  return undefined;
}

function onKeyPressInternal(scale: Scale, keyPitch: Pitch) {
  // If the key is already pressed, don't press it again.
  if (AppModel.instance.pianoAudio.isKeyPressed(keyPitch)) {
    return;
  }

  // always release the root note so it plays again
  AppModel.instance.pianoAudio.releaseKey(scale.rootPitchClass);

  const keyPresses: Array<[Pitch, number]> = (keyPitch === scale.rootPitchClass)
      ? [[scale.rootPitchClass, 1]]
      : [[scale.rootPitchClass, 1], [keyPitch, 1]];
  
  AppModel.instance.pianoAudio.pressKeys(keyPresses);
}

function onKeyReleaseInternal() {

}

export function renderExtrasFn(metrics: PianoKeyboardMetrics, pitches: Array<Pitch>, rootPitch: Pitch): JSX.Element {
  const pitchMidiNumberNoOctaves = pitches.map(p => getClass(p));

  return renderPianoKeyboardNoteNames(
    metrics,
    doesKeyUseSharps(rootPitch.letter, rootPitch.signedAccidental),
    p => arrayContains(pitchMidiNumberNoOctaves, getClass(p))
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
    
    const pitches = scale.getPitchClasses();
  
    return (
      <div>
        <PianoKeyboard
          maxWidth={maxWidth}
          lowestPitch={lowestPitch}
          highestPitch={this.highestPitch}
          pressedPitches={this.state.pressedPitches}
          renderExtrasFn={metrics => (
            <g>
              {renderDefaultExtras ? renderExtrasFn(metrics, pitches, scale.rootPitchClass) : null}
              {this.props.renderExtrasFn ? this.props.renderExtrasFn(metrics) : null}
            </g>
          )}
          onKeyPress={pitch => this.onKeyPress(pitch, /*velocity*/ 1)}
          onKeyRelease={pitch => this.onKeyRelease(pitch)}
          margin={margin} />
        <MidiNoteEventListener
          onNoteOn={(pitch, velocity) => this.onKeyPress(pitch, velocity)}
          onNoteOff={pitch => this.onKeyRelease(pitch)}
          isComputerKeyboardPlayable={true} />
      </div>
    );
  }

  private get highestPitch(): Pitch {
    const { octaveCount } = this.props;

    return createPitch(PitchLetter.B, 0, 4 + (octaveCount - 1));
  }

  private getStateFromProps(props: IPianoScaleDronePlayerProps) : IPianoScaleDronePlayerState {
    return {
      pressedPitches: []
    };
  }

  private onKeyPress(pitch: Pitch, velocity: number) {
    const { scale } = this.props;

    const scalePitches = scale.getPitchClasses();
    const pitchMidiNumberNoOctaves = scalePitches.map(p => getClass(p));
  
    if (arrayContains(pitchMidiNumberNoOctaves, getClass(pitch))) {
      const wrappedPitch = wrapOctave
        ? unwrapValueOrUndefined(tryWrapPitchOctave(pitch, lowestPitch, this.highestPitch))
        : pitch;
      
      onKeyPressInternal(scale, wrappedPitch);

      if (isInRange(wrappedPitch, lowestPitch, this.highestPitch)) {
        this.setState((prevState, props) => {
          // Add the pressed pitch.
          let newPressedPitches = immutableAddIfNotFoundInArray(prevState.pressedPitches, wrappedPitch, p => equals(p, wrappedPitch));

          // Add the root pitch of the scale.
          addIfNotFoundInArray(newPressedPitches, scale.rootPitchClass, p => equals(p, scale.rootPitchClass));
          
          return { pressedPitches: newPressedPitches };
        });
      }
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
      let newPressedPitches: Array<Pitch>;

      // Remove the released pitch if it's not the root pitch of the scale.
      if (!equals(wrappedPitch, scale.rootPitchClass)) {
        newPressedPitches = immutableRemoveIfFoundInArray(prevState.pressedPitches, p => equals(p, wrappedPitch));
        AppModel.instance.pianoAudio.releaseKey(wrappedPitch);
      } else {
        newPressedPitches = prevState.pressedPitches.slice();
      }

      // Remove the root pitch of the scale if no other pitches are still pressed.
      if ((newPressedPitches.length === 1) && newPressedPitches.find(p => equals(p, scale.rootPitchClass))) {
        removeIfFoundInArray(newPressedPitches, p => equals(p, scale.rootPitchClass));
        AppModel.instance.pianoAudio.releaseKey(scale.rootPitchClass);
      }

      return { pressedPitches: newPressedPitches };
    });
  }
}