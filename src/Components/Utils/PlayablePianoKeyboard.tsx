import { immutableAddIfNotFoundInArray, immutableRemoveIfFoundInArray, immutableToggleArrayElementCustomEquals } from '../../lib/Core/ArrayUtils';
import { Pitch, tryWrapPitchOctave } from '../../lib/TheoryLib/Pitch';
import { AppModel } from "../../App/Model";
import { PianoKeyboard, PianoKeyboardMetrics } from "./PianoKeyboard";
import { MidiNoteEventListener } from "./MidiNoteEventListener";
import React from "react";
import { unwrapValueOrUndefined } from '../../lib/Core/Utils';
import { Margin } from "../../lib/Core/Margin";

export interface IPlayablePianoKeyboardExports {
  getPressedPitches: () => Array<Pitch>;
  clearPressedPitches: () => void;
}

export interface IPlayablePianoKeyboardProps {
  maxWidth?: number;
  maxHeight?: number;
  lowestPitch: Pitch,
  highestPitch: Pitch,
  forcePressedPitches?: Array<Pitch>;
  margin?: Margin;
  onKeyPress?: (keyPitch: Pitch, velocity: number, wasClick: boolean) => void;
  onKeyRelease?: (keyPitch: Pitch, wasClick: boolean) => void;
  wrapOctave?: boolean;
  toggleKeys?: boolean;
  onGetExports?: (exports: IPlayablePianoKeyboardExports) => void;
  renderExtrasFn?: (metrics: PianoKeyboardMetrics) => JSX.Element;
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
    
    if (props.onGetExports) {
      props.onGetExports({
        getPressedPitches: this.getPressedPitches.bind(this),
        clearPressedPitches: this.clearPressedPitches.bind(this)
      } as IPlayablePianoKeyboardExports);
    }
  }

  public render(): JSX.Element {
    const { maxWidth, maxHeight, lowestPitch, highestPitch, margin, toggleKeys, renderExtrasFn } = this.props;

    const pressedPitches = this.getPressedPitches();

    return (
      <div>
        <PianoKeyboard
          maxWidth={maxWidth}
          maxHeight={maxHeight}
          margin={margin}
          lowestPitch={lowestPitch}
          highestPitch={highestPitch}
          pressedPitches={pressedPitches}
          onKeyPress={p => this.onKeyPress(p, /*wasClick*/ true)}
          onKeyRelease={p => this.onKeyRelease(p, true)}
          renderExtrasFn={renderExtrasFn}
          allowDragPresses={!toggleKeys} />
        <MidiNoteEventListener
          onNoteOn={(pitch, velocity) => this.onKeyPress(pitch, /*wasClick*/ false)}
          onNoteOff={pitch => this.onKeyRelease(pitch, /*wasClick*/ false)}
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

  private onKeyPress(pitch: Pitch, wasClick: boolean) {
    const { lowestPitch, highestPitch, toggleKeys, onKeyPress } = this.props;

    const velocity = 1;

    const wrapOctave = (this.props.wrapOctave !== undefined)
      ? this.props.wrapOctave
      : false;
    
    const wrappedPitch = wrapOctave
      ? tryWrapPitchOctave(pitch, lowestPitch, highestPitch)
      : pitch;

    if (wrappedPitch && Pitch.isInRange(wrappedPitch, lowestPitch, highestPitch)) {
      let isConsideredKeyPress: boolean;

      this.setState((prevState, props) => {
        //#region Get new selected pitches
  
        let newUserPressedPitches: Pitch[];
  
        // If click event, toggle key.
        if (toggleKeys && wasClick) {
          newUserPressedPitches = immutableToggleArrayElementCustomEquals(
            prevState.userPressedPitches,
            wrappedPitch,
            p => p.equals(pitch)
          );
        }
        // If MIDI event, press key.
        else {
          newUserPressedPitches = immutableAddIfNotFoundInArray(
            prevState.userPressedPitches,
            wrappedPitch,
            p => p.equals(pitch)
          );
        }
  
        //#endregion
        
        isConsideredKeyPress = !prevState.userPressedPitches.find(p => p.equals(pitch));

        return { userPressedPitches: newUserPressedPitches };
      }, () => {
        if (isConsideredKeyPress) {
          AppModel.instance.pianoAudio.pressKey(pitch, velocity);

          if (onKeyPress) {
            onKeyPress(pitch, velocity, wasClick);
          }
        }
      });
    }
  }

  private onKeyRelease(pitch: Pitch, wasClick: boolean) {
    const { lowestPitch, highestPitch, forcePressedPitches, toggleKeys, onKeyRelease } = this.props;

    AppModel.instance.pianoAudio.releaseKey(pitch);

    const wrapOctave = (this.props.wrapOctave !== undefined)
      ? this.props.wrapOctave
      : false;

    const wrappedPitch = wrapOctave
      ? tryWrapPitchOctave(pitch, lowestPitch, highestPitch)
      : pitch;
    
    if (wrappedPitch && (!wasClick || !toggleKeys)) {
      this.setState((prevState, props) => {
        return {
          userPressedPitches: immutableRemoveIfFoundInArray(
            prevState.userPressedPitches,
            (p, i) => p.equals(unwrapValueOrUndefined(wrappedPitch))
          )
        };
      });
    }

    if (onKeyRelease) {
      onKeyRelease(pitch, wasClick);
    }
  }

  private clearPressedPitches() {
    this.setState({
      userPressedPitches: []
    });
  }
}
 