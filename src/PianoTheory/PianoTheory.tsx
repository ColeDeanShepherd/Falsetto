import { History, UnregisterCallback } from "history";
import * as React from "react";
import * as QueryString from "query-string";
import { Button } from "@material-ui/core";

import { flattenArrays, immutableAddIfNotFoundInArray, immutableRemoveIfFoundInArray } from "../lib/Core/ArrayUtils";
import { clamp } from "../lib/Core/MathUtils";
import { Rect2D } from "../lib/Core/Rect2D";
import { Size2D } from "../lib/Core/Size2D";
import { Vector2D } from "../lib/Core/Vector2D";

import { Pitch } from "../lib/TheoryLib/Pitch";
import { PitchLetter } from "../lib/TheoryLib/PitchLetter";
import { ScaleType, Scale } from "../lib/TheoryLib/Scale";
import { ChordTypeGroup } from "../lib/TheoryLib/ChordTypeGroup";
import { ChordType } from "../lib/TheoryLib/ChordType";

import { DependencyInjector } from "../DependencyInjector";

import { serializeMidiInputDeviceSettings } from '../Persistence';
import { ActionBus, ActionHandler } from "../ActionBus";
import { IAction } from "../IAction";

import { WebMidiInitializedAction, MidiDeviceConnectedAction, MidiDeviceDisconnectedAction,
  MidiInputDeviceChangedAction, MidiInputDevicePitchRangeChangedAction } from "../AppMidi/Actions";
  import { AppModel } from "../App/Model";

import { createStudyFlashCardSetComponent } from "../StudyFlashCards/View";

import { PianoKeyboard, renderPianoKeyboardNoteNames } from "../Components/Utils/PianoKeyboard";

import * as IntroQuiz from "./IntroQuiz";
import * as PianoNotes from "../Components/Quizzes/Notes/PianoNotes";
import * as ScalesQuiz from "./ScalesQuiz";

import { naturalPitches, accidentalPitches, allPitches } from "../Components/Quizzes/Notes/PianoNotes";
import { PianoScaleFormulaDiagram } from "../Components/Utils/PianoScaleFormulaDiagram";
import { PianoScaleDronePlayer, onKeyPress } from '../Components/Utils/PianoScaleDronePlayer';
import { MidiInputDeviceSelect } from "../Components/Utils/MidiInputDeviceSelect";
import { fullPianoLowestPitch, fullPianoHighestPitch, fullPianoAspectRatio, getPianoKeyboardAspectRatio } from '../Components/Utils/PianoUtils';
import { MidiNoteEventListener } from "../Components/Utils/MidiNoteEventListener";
import { MidiPianoRangeInput } from "../Components/Utils/MidiPianoRangeInput";
import { LimitedWidthContentContainer } from "../Components/Utils/LimitedWidthContentContainer";
import { NoteText } from '../Components/Utils/NoteText';
import { PianoScaleMajorRelativeFormulaDiagram } from "../Components/Utils/PianoScaleMajorRelativeFormulaDiagram";
import { NavLinkView } from "../NavLinkView";
import { ChordViewer } from "../Components/Tools/ChordViewer";

const maxPianoWidth = 1000;
const maxOneOctavePianoWidth = 400;
const maxTwoOctavePianoWidth = 500;

// #region Helper Components

export interface IPlayablePianoProps {
  aspectRatio: number,
  maxWidth: number,
  lowestPitch: Pitch,
  highestPitch: Pitch
}
export interface IPlayablePianoState {
  pressedPitches: Array<Pitch>
}
export class PlayablePiano extends React.Component<IPlayablePianoProps, IPlayablePianoState> {
  public constructor(props: IPlayablePianoProps) {
    super(props);

    this.state = {
      pressedPitches: []
    };
  }
  public render(): JSX.Element {
    const { aspectRatio, maxWidth, lowestPitch, highestPitch } = this.props;
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
          style={{ width: "100%", maxWidth: `${maxWidth}px`, height: "auto" }} />
        <MidiNoteEventListener
          onNoteOn={(pitch, velocity) => this.onKeyPress(pitch)}
          onNoteOff={pitch => this.onKeyRelease(pitch)} />
      </div>
    );
  }

  private onKeyPress(pitch: Pitch) {
    AppModel.instance.pianoAudio.pressKey(pitch, /*velocity*/ 1);

    if (Pitch.isInRange(pitch, this.props.lowestPitch, this.props.highestPitch)) {
      this.setState((prevState, props) => {
        return { pressedPitches: immutableAddIfNotFoundInArray(prevState.pressedPitches, pitch, (p, i) => p.equals(pitch)) };
      });
    }
  }

  private onKeyRelease(pitch: Pitch) {
    AppModel.instance.pianoAudio.releaseKey(pitch);

    this.setState((prevState, props) => {
      return { pressedPitches: immutableRemoveIfFoundInArray(prevState.pressedPitches, (p, i) => p.equals(pitch)) };
    });
  }
}

export const FullPiano: React.FunctionComponent<{}> = props => (
  <PlayablePiano
    aspectRatio={fullPianoAspectRatio}
    maxWidth={maxPianoWidth}
    lowestPitch={fullPianoLowestPitch}
    highestPitch={fullPianoHighestPitch} />
);

export const OneOctavePiano: React.FunctionComponent<{}> = props => (
  <PlayablePiano
    aspectRatio={getPianoKeyboardAspectRatio(/*octaveCount*/ 1)}
    maxWidth={maxOneOctavePianoWidth}
    lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
    highestPitch={new Pitch(PitchLetter.B, 0, 4)} />
);

export const TwoOctavePiano: React.FunctionComponent<{}> = props => (
  <PlayablePiano
    aspectRatio={getPianoKeyboardAspectRatio(/*octaveCount*/ 2)}
    maxWidth={maxTwoOctavePianoWidth}
    lowestPitch={new Pitch(PitchLetter.C, 0, 3)}
    highestPitch={new Pitch(PitchLetter.B, 0, 4)} />
);

export interface IPianoNoteDiagramProps {
  pitch: Pitch,
  labelWhiteKeys: boolean,
  labelBlackKeys: boolean,
  showLetterPredicate?: (pitch: Pitch) => boolean,
  useSharps?: boolean,
  onKeyPress?: (keyPitch: Pitch) => void
}
export class PianoNoteDiagram extends React.Component<IPianoNoteDiagramProps, {}> {
  public render(): JSX.Element {
    const { pitch, labelWhiteKeys, labelBlackKeys, showLetterPredicate, useSharps }  = this.props;

    return (
      <div>
        <PianoKeyboard
          rect={new Rect2D(new Size2D(getPianoKeyboardAspectRatio(/*octaveCount*/ 1) * 100, 100), new Vector2D(0, 0))}
          lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
          highestPitch={new Pitch(PitchLetter.B, 0, 4)}
          onKeyPress={p => this.onKeyPress(p)}
          onKeyRelease={p => this.onKeyRelease(p)}
          pressedPitches={[pitch]}
          renderExtrasFn={metrics => renderPianoKeyboardNoteNames(
            metrics,
            /*useSharps*/ useSharps,
            /*showLetterPredicate*/ showLetterPredicate
              ? showLetterPredicate
              : p => ((labelWhiteKeys && p.isWhiteKey) || (labelBlackKeys && p.isBlackKey)) && (p.midiNumber <= pitch.midiNumber)
          )}
          style={{ width: "100%", maxWidth: `${maxOneOctavePianoWidth}px`, height: "auto" }} />
        <MidiNoteEventListener
          onNoteOn={(pitch, velocity) => this.onKeyPress(pitch)}
          onNoteOff={pitch => this.onKeyRelease(pitch)} />
      </div>
    );
  }

  private onKeyPress(pitch: Pitch) {
    const { onKeyPress } = this.props;

    AppModel.instance.pianoAudio.pressKey(pitch, 1);

    if (onKeyPress) {
      onKeyPress(pitch);
    }
  }

  private onKeyRelease(pitch: Pitch) {
    AppModel.instance.pianoAudio.releaseKey(pitch);
  }
};

export const PianoNotesDiagram: React.FunctionComponent<{
  lowestPitch: Pitch,
  highestPitch: Pitch,
  maxWidth: number,
  labelWhiteKeys?: boolean,
  labelBlackKeys?: boolean
}> = props => {
  const labelWhiteKeys = (props.labelWhiteKeys !== undefined) ? props.labelWhiteKeys : true;
  const labelBlackKeys = (props.labelBlackKeys !== undefined) ? props.labelBlackKeys : true;
  const octaveCount = Math.ceil((props.highestPitch.midiNumber - props.lowestPitch.midiNumber) / 12);

  return (
    <PianoKeyboard
      rect={new Rect2D(new Size2D(getPianoKeyboardAspectRatio(octaveCount) * 100, 100), new Vector2D(0, 0))}
      lowestPitch={props.lowestPitch}
      highestPitch={props.highestPitch}
      onKeyPress={p => AppModel.instance.pianoAudio.pressKey(p, 1)}
      onKeyRelease={p => AppModel.instance.pianoAudio.releaseKey(p)}
      pressedPitches={[]}
      renderExtrasFn={metrics => renderPianoKeyboardNoteNames(
        metrics,
        /*useSharps*/ undefined,
        /*showLetterPredicate*/ p => p.isWhiteKey ? labelWhiteKeys : labelBlackKeys
      )}
      style={{ width: "100%", maxWidth: `${props.maxWidth}px`, height: "auto" }} />
  );
}

// #endregion Helper Components

class KeyActions {
  public constructor(
    public onKeyPress: () => void,
    public onKeyRelease: () => void
  ) {}
}

// #region Slides

class Slide {
  public constructor(
    public url: string,
    public renderFn: (pianoTheory: PianoTheory) => JSX.Element
  ) {}
}
class SlideGroup {
  public constructor(public name: string, public slides: Array<Slide>) {}
}

const GreenCheckmarkView: React.FunctionComponent<{}> = props => (
  <i
    className="material-icons"
    style={{
      color: "green",
      verticalAlign: "bottom",
      display: "inline-block"
    }}>
    check_circle
  </i>
);

const RedXView: React.FunctionComponent<{}> = props => (
  <i
    className="material-icons"
    style={{
      color: "red",
      verticalAlign: "bottom",
      display: "inline-block"
    }}>
    cancel
  </i>
);

export class SetupSlideView extends React.Component<{}, {}> {
  public constructor(props: {}) {
    super(props);

    this.boundHandleAction = this.handleAction.bind(this);
  }

  // #region React Lifecycle Methods

  public componentDidMount() {
    ActionBus.instance.subscribe(this.boundHandleAction);
  }

  public componentWillUnmount() {
    ActionBus.instance.unsubscribe(this.boundHandleAction);
  }

  public render(): JSX.Element {
    const isStep1Complete = AppModel.instance.midiModel.getMidiInput() !== undefined;
    const isStep2Complete = isStep1Complete && AppModel.instance.midiModel.getMidiInputPitchRange() !== undefined;
    const isMidiKeyboardSetup = AppModel.instance.midiModel.isMidiInputDeviceSetup;

    return (
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <div>
          <p>It is highly recommended to connect a MIDI piano keyboard to follow along with the course interactively.</p>
          <p>Note that, at the time of writing, <a href="https://www.google.com/chrome/" target="_blank">Chrome</a> is the only web browser supporting MIDI input devices (<a href="https://caniuse.com/#feat=midi" target="_blank">click here for an up-to-date list of browsers supporting MIDI</a>).</p>
          <p>Follow the steps below to setup your MIDI piano keyboard if you have one, then continue to the next slide.</p>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "space-evenly" }}>
          <p>
            <strong>Step 1: Connect a MIDI piano keyboard and select it below.</strong>
            {isStep1Complete ? <GreenCheckmarkView /> : <RedXView />}
          </p>
          <p><MidiInputDeviceSelect /></p>

          <p>
            <strong>Step 2: Detect the # of keys your MIDI piano keyboard has.</strong>
            {isStep2Complete ? <GreenCheckmarkView /> : <RedXView />}
          </p>
          <div style={{ width: `${maxPianoWidth}px`, margin: "0 auto" }}><MidiPianoRangeInput /></div>

          <p>{isMidiKeyboardSetup ? (
            <span>
              <GreenCheckmarkView />
              
              <span style={{ paddingLeft: "0.5em" }}>Setup Complete</span>
            </span>
          ) : (
            <span>
              <RedXView />
              
              <span style={{ paddingLeft: "0.5em" }}>Setup Incomplete</span>
            </span>
          )}</p>
        </div>
      </div>
    );
  }

  // #endregion
  
  private boundHandleAction: ActionHandler;
  
  private handleAction(action: IAction) {
    switch (action.getId()) {
      case WebMidiInitializedAction.Id:
      case MidiDeviceConnectedAction.Id:
      case MidiDeviceDisconnectedAction.Id:
      case MidiInputDeviceChangedAction.Id:
      case MidiInputDevicePitchRangeChangedAction.Id:
        this.forceUpdate();
    }
  }
}

// TODO: dynamic width/height
// TODO: quizzes
// TODO: slide links
// TODO: use symbols
const slideGroups = [
  new SlideGroup("Introduction & Setup", [
    new Slide("introduction", () => (
      <div>
        <div>
          <h1>Piano Theory Course by Falsetto</h1>
          <h2>Section 1: Introduction &amp; Setup</h2>
          <p>Welcome to Falsetto's "Piano Theory" course!</p>
          <p>This is an interactive course designed to teach you the essentials of piano and music theory in a hands-on manner.</p>
          <p>This course is designed to be viewed on tablets and computer monitors, not on mobile phones.</p>
          <p>Press the ">" arrow button at the top of this page, or press the right arrow key on your computer keyboard, to move to the next slide.</p>
        </div>
      </div>
    )),
    new Slide("setup", () => <SetupSlideView />),
    new Slide("piano-basics", () => (
      <div>
        <p>This is a standard-size piano which has 88 white &amp; black keys.</p>
        <p>When pressed, each key produces a particular "pitch" &ndash; the "highness" or "lowness" of a sound.</p>
        <p>Keys further to the left produce lower pitches, and keys further to the right produce higher pitches.</p>
        <p>Note that it is common to use the word "note" interchangably with "pitch", and we may do so in this course.</p>
        <p>Try pressing the keys of your MIDI piano keyboard, or pressing the keys on your screen, to hear how the produced pitches change as you move left and right.</p>
        <FullPiano />
      </div>
    ))
  ]),

  new SlideGroup("Notes", [
    new Slide("note-c", (pianoTheory) => (
      <div>
        <h2>Section 2: Notes</h2>
        <p>Every piano key has one or more names, which we must learn in order to navigate the instrument and communicate with other musicians.</p>
        <p>We will start with the 7 white keys in the small section of a piano keyboard below. The highlighted key below, to the left of the group of 2 black keys, is called <strong>C</strong>.</p>
        <p>Press a <strong>C</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          pitch={new Pitch(PitchLetter.C, 0, 4)}
          onKeyPress={pitch => {
            if ((pitch.letter === PitchLetter.C) && (pitch.signedAccidental === 0)) {
              pianoTheory.tryToMoveToNextSlide();
            }
          }}
          labelWhiteKeys={true}
          labelBlackKeys={false} />
      </div>
    )),
    
    new Slide("note-d", (pianoTheory) => (
      <div>
        <p>When moving one white key to the right, we also move forward by one letter in the English alphabet, so this key is called <strong>D</strong>.</p>
        <p>Press a <strong>D</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          pitch={new Pitch(PitchLetter.D, 0, 4)}
          onKeyPress={pitch => {
            if ((pitch.letter === PitchLetter.D) && (pitch.signedAccidental === 0)) {
              pianoTheory.tryToMoveToNextSlide();
            }
          }}
          labelWhiteKeys={true}
          labelBlackKeys={false} />
      </div>
    )),
    
    new Slide("note-e", (pianoTheory) => (
      <div>
        <p>This key is called <strong>E</strong>.</p>
        <p>Press an <strong>E</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          pitch={new Pitch(PitchLetter.E, 0, 4)}
          onKeyPress={pitch => {
            if ((pitch.letter === PitchLetter.E) && (pitch.signedAccidental === 0)) {
              pianoTheory.tryToMoveToNextSlide();
            }
          }}
          labelWhiteKeys={true}
          labelBlackKeys={false} />
      </div>
    )),
    
    new Slide("note-f", (pianoTheory) => (
      <div>
        <p>This key is called <strong>F</strong>.</p>
        <p>Press an <strong>F</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          pitch={new Pitch(PitchLetter.F, 0, 4)}
          onKeyPress={pitch => {
            if ((pitch.letter === PitchLetter.F) && (pitch.signedAccidental === 0)) {
              pianoTheory.tryToMoveToNextSlide();
            }
          }}
          labelWhiteKeys={true}
          labelBlackKeys={false} />
      </div>
    )),
    
    new Slide("note-g", (pianoTheory) => (
      <div>
        <p>This key is called <strong>G</strong>.</p>
        <p>Press a <strong>G</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          pitch={new Pitch(PitchLetter.G, 0, 4)}
          onKeyPress={pitch => {
            if ((pitch.letter === PitchLetter.G) && (pitch.signedAccidental === 0)) {
              pianoTheory.tryToMoveToNextSlide();
            }
          }}
          labelWhiteKeys={true}
          labelBlackKeys={false} />
      </div>
    )),
    
    new Slide("note-a", (pianoTheory) => (
      <div>
        <p>After "G" there is no "H" key &mdash; instead we jump backwards through the English alphabet to <strong>A</strong>.</p>
        <p>Press an <strong>A</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          pitch={new Pitch(PitchLetter.A, 0, 4)}
          onKeyPress={pitch => {
            if ((pitch.letter === PitchLetter.A) && (pitch.signedAccidental === 0)) {
              pianoTheory.tryToMoveToNextSlide();
            }
          }}
          labelWhiteKeys={true}
          labelBlackKeys={false} />
      </div>
    )),
    
    new Slide("note-b", (pianoTheory) => (
      <div>
        <p>The last white key is called <strong>B</strong>.</p>
        <p>Press a <strong>B</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          pitch={new Pitch(PitchLetter.B, 0, 4)}
          onKeyPress={pitch => {
            if ((pitch.letter === PitchLetter.B) && (pitch.signedAccidental === 0)) {
              pianoTheory.tryToMoveToNextSlide();
            }
          }}
          labelWhiteKeys={true}
          labelBlackKeys={false} />
      </div>
    )),
    
    new Slide("white-notes-summary", () => (
      <div>
        <p>Study this slide, then move to the next slide to test your knowledge of white key names with a quiz.</p>
        <PianoNotesDiagram
          lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
          highestPitch={new Pitch(PitchLetter.B, 0, 4)}
          maxWidth={maxOneOctavePianoWidth}
          labelBlackKeys={false} />
      </div>
    )),
    
    new Slide("white-notes-quiz", () => (
      <LimitedWidthContentContainer>
        <div style={{ marginTop: "1em" }}>
          {createStudyFlashCardSetComponent(
            PianoNotes.createFlashCardSet(naturalPitches),
            /*isEmbedded*/ false,
            /*hideMoreInfoUri*/ true,
            /*title*/ "White Piano Key Names Exercise",
            /*style*/ undefined,
            /*enableSettings*/ undefined,
            /*showRelatedExercises*/ false)}
        </div>
      </LimitedWidthContentContainer>
    )),
    
    new Slide("note-c-sharp", (pianoTheory) => (
      <div>
        <p>Now let's learn the names of the 5 black piano keys in this section of the piano.</p>
        <p>The key highlighted below, like all black keys, has multiple names. One name for it is <strong>C♯</strong> (pronounced "C sharp").</p>
        <p>The '♯' ("sharp") symbol means the pitch is raised by one key, so C♯ means "the key to the right of C".</p>
        <p>Press a <strong>C♯</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          pitch={new Pitch(PitchLetter.C, 1, 4)}
          onKeyPress={pitch => {
            if (pitch.midiNumberNoOctave === (new Pitch(PitchLetter.C, 1, 4)).midiNumberNoOctave) {
              pianoTheory.tryToMoveToNextSlide();
            }
          }}
          labelWhiteKeys={true}
          labelBlackKeys={true}
          useSharps={true}
          showLetterPredicate={p => (p.midiNumber <= (new Pitch(PitchLetter.C, 1, 4)).midiNumber)} />
      </div>
    )),
    
    new Slide("note-d-flat", (pianoTheory) => (
      <div>
        <p>Another name for the same key is <strong>D♭</strong> (pronounced "D flat").</p>
        <p>The '♭' ("flat") symbol means the pitch is lowered by one key, so D♭ means "the key to the left of D".</p>
        <p>Press a <strong>D♭</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          pitch={new Pitch(PitchLetter.C, 1, 4)}
          onKeyPress={pitch => {
            if (pitch.midiNumberNoOctave === (new Pitch(PitchLetter.C, 1, 4)).midiNumberNoOctave) {
              pianoTheory.tryToMoveToNextSlide();
            }
          }}
          labelWhiteKeys={true}
          labelBlackKeys={true}
          useSharps={false}
          showLetterPredicate={p => p.isEnharmonic(new Pitch(PitchLetter.D, 0, 4)) || p.isEnharmonic(new Pitch(PitchLetter.D, -1, 4))} />
      </div>
    )),
    
    new Slide("note-d-sharp-e-flat", (pianoTheory) => (
      <div>
        <p>This key is called <strong>D♯</strong>, or <strong>E♭</strong>.</p>
        <p>Press a <strong>D♯/E♭</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          pitch={new Pitch(PitchLetter.D, 1, 4)}
          onKeyPress={pitch => {
            if (pitch.midiNumberNoOctave === (new Pitch(PitchLetter.D, 1, 4)).midiNumberNoOctave) {
              pianoTheory.tryToMoveToNextSlide();
            }
          }}
          labelWhiteKeys={false}
          labelBlackKeys={true} />
      </div>
    )),

    new Slide("note-f-sharp-g-flat", (pianoTheory) => (
      <div>
        <p>This key is called <strong>F♯</strong>, or <strong>G♭</strong>.</p>
        <p>Press a <strong>F♯/G♭</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.F, 1, 4)}
          onKeyPress={pitch => {
            if (pitch.midiNumberNoOctave === (new Pitch(PitchLetter.F, 1, 4)).midiNumberNoOctave) {
              pianoTheory.tryToMoveToNextSlide();
            }
          }}
        labelWhiteKeys={false}
        labelBlackKeys={true} />
      </div>
    )),

    new Slide("note-g-sharp-a-flat", (pianoTheory) => (
      <div>
        <p>This key is called <strong>G♯</strong>, or <strong>A♭</strong>.</p>
        <p>Press a <strong>G♯/A♭</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          pitch={new Pitch(PitchLetter.G, 1, 4)}
          onKeyPress={pitch => {
            if (pitch.midiNumberNoOctave === (new Pitch(PitchLetter.G, 1, 4)).midiNumberNoOctave) {
              pianoTheory.tryToMoveToNextSlide();
            }
          }}
          labelWhiteKeys={false}
          labelBlackKeys={true} />
      </div>
    )),

    new Slide("note-a-sharp-b-flat", (pianoTheory) => (
      <div>
        <p>The last black key is called <strong>A♯</strong>, or <strong>B♭</strong>.</p>
        <p>Press a <strong>A♯/B♭</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          pitch={new Pitch(PitchLetter.B, -1, 4)}
          onKeyPress={pitch => {
            if (pitch.midiNumberNoOctave === (new Pitch(PitchLetter.B, -1, 4)).midiNumberNoOctave) {
              pianoTheory.tryToMoveToNextSlide();
            }
          }}
          labelWhiteKeys={false}
          labelBlackKeys={true} />
      </div>
    )),
    
    new Slide("black-notes-summary", () => (
      <div>
        <p>Study this slide, then move to the next slide to test your knowledge of black key names with a quiz.</p>
        <PianoNotesDiagram
          lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
          highestPitch={new Pitch(PitchLetter.B, 0, 4)}
          maxWidth={maxOneOctavePianoWidth}
          labelWhiteKeys={false} />
      </div>
    )),
    
    new Slide("black-notes-quiz", () => (
      <LimitedWidthContentContainer>
        <div style={{ marginTop: "1em" }}>
          {createStudyFlashCardSetComponent(
            PianoNotes.createFlashCardSet(accidentalPitches),
            /*isEmbedded*/ false,
            /*hideMoreInfoUri*/ true,
            /*title*/ "Black Piano Key Names Exercise",
            /*style*/ undefined,
            /*enableSettings*/ undefined,
            /*showRelatedExercises*/ false)}
        </div>
      </LimitedWidthContentContainer>
    )),
    
    new Slide("all-notes", () => (
      <div>
        <p>You have now learned the names of all 12 keys in this small section of the piano!</p>
        <p>
          <PianoNotesDiagram
            lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
            highestPitch={new Pitch(PitchLetter.B, 0, 4)}
            maxWidth={maxOneOctavePianoWidth / 2}
            labelWhiteKeys={false} />
        </p>
        <p>But what about the rest of the piano? Let's zoom out...</p>
        <p>Here we see that the names of the other keys are simply repetitions of the pattern you've learned. So you have actually learned the names of all 88 piano keys!</p>
        <PianoNotesDiagram
          lowestPitch={fullPianoLowestPitch}
          highestPitch={fullPianoHighestPitch}
          maxWidth={maxPianoWidth} />
      </div>
    )),
    
    new Slide("notes-summary", () => (
      <div>
        <p>Study this slide, then move to the next slide to comprehensively test your knowledge of piano key names with a quiz.</p>
        <PianoNotesDiagram
          lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
          highestPitch={new Pitch(PitchLetter.B, 0, 4)}
          maxWidth={maxOneOctavePianoWidth} />
      </div>
    )),

    new Slide("notes-quiz", () => (
      <LimitedWidthContentContainer>
        <div style={{ marginTop: "1em" }}>
          {createStudyFlashCardSetComponent(
            PianoNotes.createFlashCardSet(allPitches),
            /*isEmbedded*/ false,
            /*hideMoreInfoUri*/ true,
            /*title*/ "Piano Notes Exercise",
            /*style*/ undefined,
            /*enableSettings*/ undefined,
            /*showRelatedExercises*/ false)}
        </div>
      </LimitedWidthContentContainer>
    )),
  ]),

  new SlideGroup("Scales", [
    new Slide("scales-introduction", () => (
      <div>
        <h2>Section 3: Scales</h2>
        <p>As you've learned, there are 12 different piano key names.</p>
        <p>Though musicians are free to use any of the 12 keys at any time, it is common to restrict the choice of keys to the keys in a particular <strong>scale</strong>.</p>
        <p><strong>Scales</strong> are sets of notes with a designated "root note" that generally "sounds like home" in the scale.</p>
        <p>Below is an interactive diagram of the <strong>C Major</strong> scale, which has a root note of <strong>C</strong> (indicated by the <strong>C</strong> scale's name) and comprises of the 7 notes: <strong>C, D, E, F, G, A, B</strong>.</p>
        <p>Try pressing the piano keys below to get a feel for how the scale sounds. Pressing keys will play both the pressed note and the lowest root note (C) in the diagram, which helps convey the "feeling" of the scale.</p>
        <p><PianoScaleDronePlayer scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))} octaveCount={2} maxWidth={maxOneOctavePianoWidth} /></p>
      </div>
    )),
    new Slide("major-scale", () => (
      <div>
        <p>Major scales, like the <strong>C Major</strong> scale we saw on the last slide, are very common in music.</p>
        <p>All major scales are built with the same formula: "<strong>R W W H W W W</strong>", where:</p>
        <p>
          <strong>"R"</strong> means the <strong>root note</strong> (<strong>C</strong> in the case of the <strong>C Major</strong> scale)
          <br />
          <strong>"W"</strong> means the next note is a <strong>whole step</strong> (2 keys) higher than the previous note.
          <br />
          <strong>"H"</strong> means the next note is a <strong>half step</strong> (1 key) higher than of the previous note.
        </p>
        <p>Below is an interactive diagram of the C Major scale and the major scale formula.</p>
        <p><PianoScaleFormulaDiagram scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))} octaveCount={2} maxWidth={maxTwoOctavePianoWidth} /></p>
        <div style={{ display: "inline-block" }}><NoteText>Though scale formulas define the notes of a scale in a particular order starting with the root note, you are free to play the notes in any order you like.</NoteText></div>
      </div>
    )),
    new Slide("another-major-scale", () => (
      <div>
        <p>To figure out the notes in any other major scale, you simply pick a root note and follow the major scale formula.</p>
        <p>For example, picking a root note of <strong>E</strong> and following the formula gives you the <strong>E Major</strong> scale below:</p>
        <p><PianoScaleFormulaDiagram scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.E, 0, 4))} octaveCount={2} maxWidth={maxTwoOctavePianoWidth} /></p>
      </div>
    )),
    new Slide("natural-minor-scale", () => (
      <div>
        <p><strong>Natural Minor</strong> scales (sometimes simply called <strong>Minor</strong> scales) are another common type of scale, and they are built with the formula: "<strong>R W H W W H W</strong>".</p>
        <p>We can use this formula to find the notes in any natural minor scale, for example the <strong>C Natural Minor</strong> scale, which comprises of the 7 notes: <strong>C, D, E♭, F, G, A♭, B♭</strong></p>
        <p>Below is an interactive diagram of the <strong>C Natural Minor</strong> scale, along with the natural minor scale formula.</p>
        <p>Press the piano keys below to get a feel for how the scale sounds.</p>
        <p><PianoScaleFormulaDiagram scale={new Scale(ScaleType.Aeolian, new Pitch(PitchLetter.C, 0, 4))} octaveCount={2} maxWidth={maxTwoOctavePianoWidth} /></p>
      </div>
    )),
    new Slide("natural-minor-scale-2", () => (
      <div>
        <p>Another common way to write scale formulas is <strong>relative to the major scale</strong>.</p>
        <p>Recall the notes of the following scales:</p>
        <p><strong>C Major</strong>: C, D, E, F, G, A, B</p>
        <p><strong>C Minor</strong>: C, D, E♭, F, G, A♭, B♭</p>
        <p>Note that the <strong>C Minor</strong> scale is almost the same as the <strong>C Major</strong> scale, but the <strong>3rd</strong>, <strong>6th</strong>, and <strong>7th</strong> notes are flattened.</p>
        <p>We can use this knowledge to write formulas for the major &amp; minor scales like this:</p>
        <p><strong>C Major</strong>: 1, 2, 3, 4, 5, 6, 7</p>
        <p><strong>C Minor</strong>: 1, 2, 3♭, 4, 5, 6♭, 7♭</p>
        <p>This is useful to quickly find scales similar to major scales you have already memorized.</p>
        <p>Below is an interactive diagram of the <strong>C Natural Minor</strong> scale, along with its major-scale-relative formula.</p>
        <p><PianoScaleMajorRelativeFormulaDiagram scale={new Scale(ScaleType.Aeolian, new Pitch(PitchLetter.C, 0, 4))} octaveCount={2} maxWidth={maxTwoOctavePianoWidth} /></p>
      </div>
    )),
    new Slide("scales-summary", () => (
      <div>
        <p>There are many other scales you can learn about in your own time here: <NavLinkView to="/scale-exercises" openNewTab={true}>Self-Paced Scale Mastery</NavLinkView>.</p>
        <p>For now, take some time to review material below, then move to the next slide to test your knowledge of scales with a quiz.</p>
        <br />
        <p>Scales are <strong>sets of notes with a designated "root note"</strong> that generally "sounds like home" in the scale.</p>
        <p>The formula for all major scales is <strong>R W W H W W W</strong>.</p>
        <p>In scale formulas, <strong>"R" means "root note"</strong>.</p>
        <p>In scale formulas, <strong>"H" means the next note is a "half step" (1 key) to the right of the previous note</strong>.</p>
        <p>In scale formulas, <strong>"W" means the next note is a "whole step" (2 keys) to the right of the previous note</strong>.</p>
        <p>Though scale formulas define the notes of a scale in a particular order starting with the root note, <strong>you are free to play the notes in any order you like</strong>.</p>
        <p>The major-scale-relative formula for all natural minor scales (also simply called "minor scales") is <strong>1, 2, 3♭, 4, 5, 6♭, 7♭</strong>.</p>
      </div>
    )),
    new Slide("scales-quiz", () => (
      <LimitedWidthContentContainer>
        <div style={{ marginTop: "1em" }}>
          {createStudyFlashCardSetComponent(
            ScalesQuiz.flashCardSet,
            /*isEmbedded*/ false,
            /*hideMoreInfoUri*/ true,
            /*title*/ undefined,
            /*style*/ undefined,
            /*enableSettings*/ undefined,
            /*showRelatedExercises*/ false)}
        </div>
      </LimitedWidthContentContainer>
    )),
  ]),

  new SlideGroup("Chords", [
    new Slide("chords-introduction", () => (
      <div>
        <h2>Section 4: Chords</h2>
        <p><strong>Chords</strong> are sets of two or more notes played simultaneously.</p>
        <p>For example, here is a <strong>C Major</strong> chord, which consists of the notes <strong>C, E, G</strong>.</p>
        <ChordViewer
          title={"C Major Chord"}
          chordTypeGroups={[new ChordTypeGroup("Basic Triads", ChordType.BasicTriads)]}
          renderOnCard={false}
          showChordSelect={false}
          showChordInfoText={false}
          showGuitarFretboard={false} />
      </div>
    )),
    new Slide("needs-name-1", () => (
      <div>
        <p>There are many possible chords, but generally musicians will restrict themselves (mostly) to the chords derived from the notes of a specific scale.</p>
        <p>Notes that are part of a particular scale are called "diatonic", and the other notes are called "chromatic".</p>
        <p>The same terminology can extend to chords as well. Chords consisting only of notes in a scale are "diatonic", other chords are "chromatic".</p>
        <p>For example, let's take the C Major scale, which consists of the notes: C, D, E, F, G, A, B</p>
        <p>Within this scale, any combination of two or more notes is a unique chord.</p>
        <p>That is still a lot of chords. Musicians generally limit themselves even further than that.</p>
        <p>The most common chords are built in thirds and consist of 3 to 5 notes.</p>
        <p>Built in thirds means each note in the chord is a third above the previous note in the chords.</p>
        <p>A note being a third above another note means the two notes span 3 scale notes (there's one excluded scale note in the middle).</p>
      </div>
    )),
    new Slide("needs-name-2", () => (
      <div>
        <p>The C Major chord we saw, which consists of the notes C, E, G, is built in this way - it has 3 notes, and each note is a third apart from the previous note.</p>
        <p>Note that, in practice, you can play the notes of a chord in any order, and repeat notes if you'd like.</p>
        <p>If we take a look at all the 3-note chords (also called "triads") built in the C Major scale, we get 7 chords.</p>
        <ul>
          <li>C E G - called C Major</li>
          <li>D F A - called D Minor</li>
          <li>E G B - called E Minor</li>
          <li>F A C - called F Major</li>
          <li>G B D - called G Major</li>
          <li>A C E - called A Minor</li>
          <li>B D F - called B Diminished</li>
        </ul>
        <p>"Major" in triad names means the 2nd note in the chord (called the 3rd because it's a 3rd away from the root note of the chord) is a major third above the root note.</p>
        <p>Major 3rds are 4 half steps</p>
        <p>"Minor" in triad names means the 3rd is a minor third away from the root note.</p>
        <p>Minor 3rds are 3 half steps</p>
      </div>
    )),
    new Slide("needs-name-3", () => (
      <div>
        <p>Again, you are free to play the notes of chords in any order, with any number of repeat notes.</p>
        <p>Whichever note you choose to play in the bass (the lowest of the notes) determines the "inversion" the chord is in.</p>
        <p>root position means the root is in the bass</p>
        <p>1st inversion means the 3rd is in the bass</p>
        <p>2nd inversion means the 5th is in the bass</p>
        <p>If a chord has 4 notes it can be in 3rd inversion, where the 7th is in the bass.</p>
        <p>The pattern continues:</p>
        <p>4th inversion - 9th in the bass</p>
        <p>5th inversion - 11th in the bass</p>
        <p>6th inversion - 13th in the bass</p>
        <p>Notice we're referring to "9th", "11th", and "13th", yet there are only 7 notes in the C Major scale.</p>
        <p>9th is equivalent to the 2nd note in the scale</p>
        <p>11th is equivalent to the 4th note in the scale</p>
        <p>13th is equivalent to the 6th note in the scale.</p>
        <p>There is no 15th, you're back to the root note!</p>
        <p>Note about inversions - only the bass note determines the inversion! The other, higher notes can be in any order!</p>
        <p>Arpeggios are the notes of the chords played separately.</p>
      </div>
    )),
    new Slide("chords-quiz", () => (
      <div>
        <p>QUIZ</p>
      </div>
    )),
  ]),

  new SlideGroup("Chord Progressions", [
    new Slide("chord-progressions-introduction", () => (
      <div>
        <h2>Section 5: Chord Progressions</h2>
      </div>
    )),
    new Slide("needs-name-4", () => (
      <div>
        <p>Chord progressions are sequences of chords.</p>
        <p>We often label diatonic chords with roman numerals.</p>
        <p>Chords built on the 1st scale degree are "I" chords.</p>
        <p>Chords built on the 2nd scale degree are "II" chords.</p>
        <p>And so on, until the 7th scale degree.</p>
        <p>In C Major, the I chord is C E G (C Major), the II chord is D F A (D Minor), the III chord is E G B (E Minor), and so on.</p>
        <p>With roman numerals, we can write out chord progressions independent of the scale the progression is in.</p>
      </div>
    )),
    new Slide("needs-name-5", () => (
      <div>
        <p>One of the most common chord progressions is V - I.</p>
        <p>This is one of the strongest progressions, especially if the V is a seventh chord, because of the voices of the chord.</p>
        <p>The voices of V all lead into I.</p>
        <p>You can extend the V - I progression by adding the V of V - II - to make II - V - I.</p>
        <p>You can keep extending this if you like to make: IV - VII - III - VI - II - V - I</p>
        <p>This is the circle progression, one of the strongest progressions.</p>
      </div>
    )),
    new Slide("needs-name-6", () => (
      <div>
        <p>You can use chord substitutions to spice up your progressions - similar chords.</p>
        <p>Chords are similar if they share notes or make similar resolutions.</p>
        <p>Also, voice leading is very important. Arrange the notes of your chords in such a way that the movement between the notes of the two chords is small.</p>
        <p>Experiment with chord progressions!</p>
      </div>
    )),
    new Slide("chord-progressions-quiz", () => (
      <div>
        <p>QUIZ</p>
      </div>
    )),
  ])
];

function getSlideGroup(slideIndex: number): [SlideGroup, number] | undefined {
  let numSlidesSeen = 0;

  for (let slideGroupIndex = 0; slideGroupIndex < slideGroups.length; slideGroupIndex++) {
    const slideGroup = slideGroups[slideGroupIndex];
    const newNumSlidesSeen = numSlidesSeen + slideGroup.slides.length;

    if (newNumSlidesSeen > slideIndex) {
      return [slideGroup, slideIndex - numSlidesSeen];
    } else {
      numSlidesSeen = newNumSlidesSeen;
    }
  }

  return undefined;
}

// TODO: optimize
let slides = flattenArrays<Slide>(slideGroups.map(sg => sg.slides))
//  .slice(0, 43)
  .concat([new Slide("coming-soon", () => <h3>More coming soon!</h3>)]);

// #endregion Slides

export interface IPianoTheoryProps { }
export interface IPianoTheoryState {
  slideIndex: number;
}
export class PianoTheory extends React.Component<IPianoTheoryProps, IPianoTheoryState> {
  public constructor(props: IPianoTheoryProps) {
    super(props);
    
    this.history = DependencyInjector.instance.getRequiredService<History<any>>("History");

    this.state = {
      slideIndex: this.getSlideIndexFromUriParams(this.history.location.search)
    };
  }

  public tryToMoveToNextSlide() {
    if (!this.canMoveToNextSlide()) { return; }

    this.moveToNextSlideInternal();
  }
  
  public tryToMoveToPreviousSlide() {
    if (!this.canMoveToPreviousSlide()) { return; }

    this.moveToPreviousSlideInternal();
  }

  // #region React Functions
  
  public componentDidMount() {
    this.historyUnregisterCallback = this.history.listen((location, action) => {
      this.setState({
        slideIndex: this.getSlideIndexFromUriParams(location.search)
      });
    });
    this.registerKeyEventHandlers();
  }

  public componentWillUnmount() {
    AppModel.instance.pianoAudio.releaseAllKeys();

    this.unregisterKeyEventHandlers();

    if (this.historyUnregisterCallback) {
      this.historyUnregisterCallback();
      this.historyUnregisterCallback = undefined;
    }
  }

  // TODO: show slide group
  public render(): JSX.Element {
    const { slideIndex } = this.state;

    const renderedSlide = slides[slideIndex].renderFn(this);

    return (
      <div style={{ height: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", textAlign: "center", height: "100%" }}>
          {this.renderSlideControls()}
          {renderedSlide}
        </div>

        <MidiNoteEventListener
          onNoteOn={(pitch, velocity) => AppModel.instance.pianoAudio.pressKey(pitch, velocity)}
          onNoteOff={pitch => AppModel.instance.pianoAudio.releaseKey(pitch)} />
      </div>
    );
  }

  private renderSlideControls(): JSX.Element {
    return (
      <div>
        <Button
          variant="contained"
          disabled={!this.canMoveToPreviousSlide()}
          onClick={_ => this.moveToPreviousSlideInternal()}
          style={{ textTransform: "none" }}
        >
          &lt;
        </Button>

        {this.renderSlideLocation()}

        <Button
          variant="contained"
          disabled={!this.canMoveToNextSlide()}
          onClick={_ => this.moveToNextSlideInternal()}
          style={{ textTransform: "none" }}
        >
          &gt;
        </Button>
      </div>
    );
  }

  private renderSlideLocation(): JSX.Element {
    const { slideIndex } = this.state;

    const slideGroupInfo = getSlideGroup(slideIndex);
    if (!slideGroupInfo) {
      return <span style={{ padding: "0 1em" }}>Falsetto - Piano Theory</span>;
    }

    const slideGroup = slideGroupInfo[0];
    const indexOfSlideInGroup = slideGroupInfo[1];
    const slideNumberInGroup = 1 + indexOfSlideInGroup;

    return (
      <span style={{ padding: "0 1em" }}>{slideGroup.name} - Slide {slideNumberInGroup} / {slideGroup.slides.length}</span>
    );
  }
  
  private history: History<any>;
  private historyUnregisterCallback: UnregisterCallback | undefined;

  // #endregion React Functions

  // #region Event Handlers

  private boundOnKeyDown: ((event: KeyboardEvent) => void) | undefined;
  private boundOnKeyUp: ((event: KeyboardEvent) => void) | undefined;

  private registerKeyEventHandlers() {
    this.boundOnKeyDown = this.onKeyDown.bind(this);
    window.addEventListener("keydown", this.boundOnKeyDown);
    
    this.boundOnKeyUp = this.onKeyUp.bind(this);
    window.addEventListener("keyup", this.boundOnKeyUp);
  }

  private unregisterKeyEventHandlers() {
    if (this.boundOnKeyDown) {
      window.removeEventListener("keydown", this.boundOnKeyDown);
      this.boundOnKeyDown = undefined;
    }

    if (this.boundOnKeyUp) {
      window.removeEventListener("keyup", this.boundOnKeyUp);
      this.boundOnKeyUp = undefined;
    }
  }

  // TODO: data-based bindings
  private onKeyDown(event: KeyboardEvent) {
    if (event.type === "keydown") {
      // ArrowLeft
      if (event.keyCode === 37) {
        this.moveToPreviousSlideInternal();
      }
      // ArrowRight
      else if (event.keyCode === 39) {
        this.moveToNextSlideInternal();
      }
    }
  }
  private onKeyUp(event: KeyboardEvent) {
  }

  // #endregion 

  // #region Actions

  private canMoveToNextSlide(): boolean {
    const { slideIndex } = this.state;
    return (slideIndex + 1) < slides.length;
  }

  private moveToNextSlideInternal() {
    const { slideIndex } = this.state;

    const newSlideIndex = slideIndex + 1;
    if (newSlideIndex == slides.length) { return; }

    this.moveToSlide(newSlideIndex);
  }

  private canMoveToPreviousSlide(): boolean {
    const { slideIndex } = this.state;
    return slideIndex > 0;
  }

  private moveToPreviousSlideInternal() {
    const { slideIndex } = this.state;

    if (slideIndex === 0) { return; }

    this.moveToSlide(slideIndex - 1);
  }

  private moveToSlide(slideIndex: number) {
    this.setState({ slideIndex: slideIndex }, () => {
      const oldSearchParams = QueryString.parse(this.history.location.search);
      const newSearchParams = { ...oldSearchParams, slide: slides[slideIndex].url };

      this.history.push({
        pathname: this.history.location.pathname,
        search: `?${QueryString.stringify(newSearchParams)}`
      });
    });
  }

  // #endregion Actions

  private getSlideIndexFromUriParams(search: string): number {
    const urlSearchParams = QueryString.parse(search);
    if (!(urlSearchParams.slide && (typeof urlSearchParams.slide === 'string'))) { return 0; }

    const slideIndex = slides.findIndex(s => s.url === urlSearchParams.slide);
    return Math.max(slideIndex, 0);
  }
}