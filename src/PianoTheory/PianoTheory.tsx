import { History } from "history";
import * as React from "react";
import { InputEventNoteon, InputEventNoteoff } from "webmidi";
import * as QueryString from "query-string";

import { PianoKeyboard } from '../Components/Utils/PianoKeyboard';
import { Rect2D } from '../lib/Core/Rect2D';
import { Size2D } from '../lib/Core/Size2D';
import { Vector2D } from '../lib/Core/Vector2D';
import { Pitch } from '../lib/TheoryLib/Pitch';
import { PitchLetter } from '../lib/TheoryLib/PitchLetter';
import { PianoAudio } from '../Audio/PianoAudio';
import { flattenArrays, immutableAddIfNotFoundInArray, immutableRemoveIfFoundInArray } from '../lib/Core/ArrayUtils';
import { AppModel } from '../App/Model';
import { MidiDeviceConnectedAction, MidiDeviceDisconnectedAction, MidiInputDeviceChangedAction } from '../App/Actions';
import { IAction } from '../IAction';
import { ActionHandler, ActionBus } from '../ActionBus';
import { Button } from '@material-ui/core';
import { createStudyFlashCardSetComponent } from '../StudyFlashCards/View';
import * as IntroQuiz from "./IntroQuiz";
import { LimitedWidthContentContainer } from '../Components/Utils/LimitedWidthContentContainer';
import { DependencyInjector } from '../DependencyInjector';
import { clamp } from '../lib/Core/MathUtils';

const pianoAudio = new PianoAudio();

// #region Helper Components

export interface IMidiNoteEventListenerProps {
  onNoteOn: (pitch: Pitch, velocity: number) => void,
  onNoteOff: (pitch: Pitch) => void
}

export class MidiNoteEventListener extends React.Component<IMidiNoteEventListenerProps, {}> {
  public constructor(props: IMidiNoteEventListenerProps) {
    super(props);

    this.boundHandleAction = this.handleAction.bind(this);
  }

  private boundHandleAction: ActionHandler;
  
  public componentDidMount() {
    this.reinitializeMidi();
    ActionBus.instance.subscribe(this.boundHandleAction);
  }

  public componentWillUnmount() {
    ActionBus.instance.unsubscribe(this.boundHandleAction);
    pianoAudio.releaseAllKeys();
    this.uninitializeMidi();
  }

  public render() { return null; }
  
  private handleAction(action: IAction) {
    switch (action.getId()) {
      case MidiDeviceConnectedAction.Id:
      case MidiDeviceDisconnectedAction.Id:
      case MidiInputDeviceChangedAction.Id:
        this.reinitializeMidi();
    }
  }
  private onNoteOn: ((event: InputEventNoteon) => void) | undefined = undefined;
  private onNoteOff: ((event: InputEventNoteoff) => void) | undefined = undefined;
  private disconnectFromMidiInput: (() => void) | undefined = undefined;

  private async reinitializeMidi() {
    await AppModel.instance.initializeMidiPromise;

    this.uninitializeMidi();
    
    const midiInput = AppModel.instance.getMidiInput();

    if (midiInput) {
      this.onNoteOn = event => {
        const pitch = Pitch.createFromMidiNumber(event.note.number);
        
        if (this.props.onNoteOn) {
          this.props.onNoteOn(pitch, event.velocity);
        }
      };
      this.onNoteOff = event => {
        const pitch = Pitch.createFromMidiNumber(event.note.number);
        
        if (this.props.onNoteOff) {
          this.props.onNoteOff(pitch);
        }
      };

      this.disconnectFromMidiInput = () => {
        if (midiInput) {
          if (this.onNoteOn) {
            midiInput.removeListener("noteon", "all", this.onNoteOn);
          }
          
          if (this.onNoteOff) {
            midiInput.removeListener("noteoff", "all", this.onNoteOff);
          }
        }
      };
  
      midiInput.addListener("noteon", "all", this.onNoteOn);
      midiInput.addListener("noteoff", "all", this.onNoteOff);
    }
  }

  private async uninitializeMidi() {
    if (this.disconnectFromMidiInput) {
      this.disconnectFromMidiInput();
      this.disconnectFromMidiInput = undefined;
    }
  }
}

export interface IPlayablePianoProps {
  aspectRatio: Size2D,
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
          rect={new Rect2D(aspectRatio, new Vector2D(0, 0))}
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
    pianoAudio.pressKey(pitch, /*velocity*/ 1);
    this.setState((prevState, props) => {
      return { pressedPitches: immutableAddIfNotFoundInArray(prevState.pressedPitches, pitch, (p, i) => p.equals(pitch)) };
    });
  }
  private onKeyRelease(pitch: Pitch) {
    pianoAudio.releaseKey(pitch);
    this.setState((prevState, props) => {
      return { pressedPitches: immutableRemoveIfFoundInArray(prevState.pressedPitches, (p, i) => p.equals(pitch)) };
    });
  }
}

export const FullPiano: React.FunctionComponent<{}> = props => (
  <PlayablePiano
    aspectRatio={new Size2D(400, 50)}
    maxWidth={400}
    lowestPitch={new Pitch(PitchLetter.A, 0, 0)}
    highestPitch={new Pitch(PitchLetter.C, 0, 8)} />
);

export const TwoOctavePiano: React.FunctionComponent<{}> = props => (
  <PlayablePiano
    aspectRatio={new Size2D(300, 100)}
    maxWidth={300}
    lowestPitch={new Pitch(PitchLetter.C, 0, 3)}
    highestPitch={new Pitch(PitchLetter.B, 0, 4)} />
);

export const OneOctavePiano: React.FunctionComponent<{}> = props => (
  <PlayablePiano
    aspectRatio={new Size2D(150, 100)}
    maxWidth={300}
    lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
    highestPitch={new Pitch(PitchLetter.B, 0, 4)} />
);

export const PianoNoteDiagram: React.FunctionComponent<{ pitch: Pitch }> = props => (
  <PianoKeyboard
    rect={new Rect2D(new Size2D(150, 100), new Vector2D(0, 0))}
    lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
    highestPitch={new Pitch(PitchLetter.B, 0, 4)}
    onKeyPress={p => pianoAudio.pressKey(p, 1)}
    onKeyRelease={p => pianoAudio.releaseKey(p)}
    pressedPitches={[props.pitch]}
    style={{ width: "100%", maxWidth: "300px", height: "auto" }} />
);

// #endregion Helper Components

class KeyActions {
  public constructor(
    public onKeyPress: () => void,
    public onKeyRelease: () => void
  ) {}
}

// #region Slides

class Slide {
  public constructor(public renderFn: () => JSX.Element) {}
}
class SlideGroup {
  public constructor(public name: string, public slides: Array<Slide>) {}
}

// TODO: dynamic width/height
// TODO: quizzes
// TODO: slide links
// TODO: use symbols
const slideGroups = [
  new SlideGroup("Introduction", [
    new Slide(() => (
      <div>
        <h2>Welcome to Falsetto's "Piano Theory" course!</h2>
        <p>This is an interactive course designed to teach you the essentials of piano and music theory in a hands-on manner.</p>
        <p>It is highly recommended to connect a MIDI piano keyboard to your computer to follow along with these lessons.</p>
        <p>Click the settings icon (<i className="material-icons" style={{ verticalAlign: "bottom" }}>settings</i>) in the bar at the top of the screen to configure your MIDI input device.</p>
        <p>If your MIDI input device and audio settings are configured properly, then pressing keys will produce piano sounds.</p>
      </div>
    )),
    new Slide(() => (
      <div>
        <p>This is a piano.</p>
        <p>Pianos are made of white &amp; black "keys".</p>
        <FullPiano />
      </div>
    )),
    new Slide(() => (
      <div>
        <p>Standard pianos have 88 white &amp; black keys.</p>
        <p>These lessons will generally only show a portion of the 88 keys due to screen size limitations.</p>
        <p>This slide is only showing the middle 24 keys of a standard piano.</p>
        <TwoOctavePiano />
      </div>
    )),

    new Slide(() => (
      <div>
        <p>Each key produces a particular "pitch" &ndash; the "highness" or "lowness" of a sound &ndash; when pressed.</p>
        <p>Keys further to the left produce lower pitches, and keys further to the right produce higher pitches.</p>
        <p>Try pressing some of the keys on your screen, or try connecting a MIDI keyboard and physically pressing keys, to hear the pitches they produce.</p>
        <TwoOctavePiano />
      </div>
    )),

    new Slide(() => (
      <div>
        {createStudyFlashCardSetComponent(
          IntroQuiz.flashCardSet,
          /*isEmbedded*/ false,
          /*hideMoreInfoUri*/ false,
          /*title*/ undefined,
          /*style*/ undefined,
          /*enableSettings*/ undefined,
          /*showRelatedExercises*/ false)}
      </div>
    )),

    new Slide(() => (
      <div>
        <p>Each pitch has a specific name.</p>
        <TwoOctavePiano />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>Let's first focus on the white keys in a small section of the keyboard.</p>
        <OneOctavePiano />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key, immediately to the left of the group of 3 black keys, is called C.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.C, 0, 4)} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key is called D.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.D, 0, 4)} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key is called E.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.E, 0, 4)} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key is called F.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.F, 0, 4)} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key is called G.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.G, 0, 4)} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key is called A.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.A, 0, 4)} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key is called B.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.B, 0, 4)} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>QUIZ</p>
      </div>
    )),
    
    new Slide(() => <span>Now let's learn the names of the black keys.</span>),
    
    new Slide(() => (
      <div>
        <p>This key, like all black keys, has multiple names. One of the names for it is C#. Another name for it is Db. The reason for multiple names will be explained later.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.C, 1, 4)} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>Sharps &amp; flats explanation.</p>
        <OneOctavePiano />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key is called D#, or Eb.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.D, 1, 4)} />
      </div>
    )),

    new Slide(() => (
      <div>
        <p>This key is called F#, or Gb.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.F, 1, 4)} />
      </div>
    )),

    new Slide(() => (
      <div>
        <p>This key is called G#, or Ab.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.G, 1, 4)} />
      </div>
    )),

    new Slide(() => (
      <div>
        <p>This key is called A#, or Bb.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.B, -1, 4)} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>QUIZ</p>
      </div>
    )),

    new Slide(() => (
      <div>
        <p>Now that we've learned the names of the keys in the section, let's zoom out.</p>
        <TwoOctavePiano />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>You can see that the piano keys are simply a repetition of the pattern we've learned.</p>
        <TwoOctavePiano />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>Each repetition of the pattern has the same pitch names, so we've now learned all the notes on the piano!</p>
        <TwoOctavePiano />
      </div>
    )),

    // quiz?

    new Slide(() => <span>Now let's learn about scales.</span>),
    new Slide(() => <span>Scales are ...</span>),
    new Slide(() => <span>Most music is based on only a few scales.</span>),
    new Slide(() => <span>Here is an example of a scale.</span>),
    new Slide(() => <span>C major scale</span>),

    new Slide(() => <span>Here is another example of a scale.</span>),
    new Slide(() => <span>Bb major scale.</span>),
    
    new Slide(() => <span>Both scales are classified as "major" scales, and have the same "formula".</span>),
    new Slide(() => <span>Major scale formula.</span>),
    
    new Slide(() => <span>You can derive other major scales with the formula.</span>),
    new Slide(() => <span>Cover all the other scales.</span>),




    new Slide(() => (
      <PianoKeyboard
        rect={new Rect2D(new Size2D(300, 200), new Vector2D(0, 0))}
        lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
        highestPitch={new Pitch(PitchLetter.B, 0, 4)}
        onKeyPress={p => pianoAudio.pressKey(p, 1)}
        onKeyRelease={p => pianoAudio.releaseKey(p)}
        style={{ width: "100%", maxWidth: "300px", height: "auto" }} />
    )),
    new Slide(() => <span>Slide 2</span>),
    new Slide(() => <span>Slide 3</span>)
  ])
];

// TODO: optimize
const slides = flattenArrays<Slide>(slideGroups.map(sg => sg.slides));

// #endregion Slides

export interface IPianoTheoryProps { }
export interface IPianoTheoryState {
  slideIndex: number;
}
export class PianoTheory extends React.Component<IPianoTheoryProps, IPianoTheoryState> {
  public constructor(props: IPianoTheoryProps) {
    super(props);
    
    this.history = DependencyInjector.instance.getRequiredService<History<any>>("History");
    const urlSearchParams = QueryString.parse(this.history.location.search);

    this.state = {
      slideIndex: (urlSearchParams.slide && (typeof urlSearchParams.slide === 'string'))
        ? clamp(parseInt(urlSearchParams.slide, 10) - 1, 0, slides.length - 1)
        : 0
    };
  }

  // #region React Functions
  
  public componentDidMount() {
    this.registerKeyEventHandlers();
  }

  public componentWillUnmount() {
    pianoAudio.releaseAllKeys();
    this.unregisterKeyEventHandlers();
  }

  // TODO: show slide group
  public render(): JSX.Element {
    const { slideIndex } = this.state;

    const slideNumber = slideIndex + 1;
    const numSlides = slides.length;
    const renderedSlide = slides[slideIndex].renderFn();

    return (
      <LimitedWidthContentContainer>
        <div style={{ textAlign: "center" }}>
          <div>
            <Button
              variant="contained"
              disabled={!this.canMoveToPreviousSlide()}
              onClick={_ => this.moveToPreviousSlide()}
              style={{ textTransform: "none" }}
            >
              &lt;
            </Button>
            <span style={{ padding: "0 1em" }}>{slideNumber} / {numSlides}</span>
            <Button
              variant="contained"
              disabled={!this.canMoveToNextSlide()}
              onClick={_ => this.moveToNextSlide()}
              style={{ textTransform: "none" }}
            >
              &gt;
            </Button>
          </div>
          {renderedSlide}
        </div>

        <MidiNoteEventListener
          onNoteOn={(pitch, velocity) => pianoAudio.pressKey(pitch, velocity)}
          onNoteOff={pitch => pianoAudio.releaseKey(pitch)} />
      </LimitedWidthContentContainer>
    );
  }
  
  private history: History<any>;

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
        this.moveToPreviousSlide();
      }
      // ArrowRight
      else if (event.keyCode === 39) {
        this.moveToNextSlide();
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

  private moveToNextSlide() {
    const { slideIndex } = this.state;

    const newSlideIndex = slideIndex + 1;
    if (newSlideIndex == slides.length) { return; }

    this.moveToSlide(newSlideIndex);
  }

  private canMoveToPreviousSlide(): boolean {
    const { slideIndex } = this.state;
    return slideIndex > 0;
  }

  private moveToPreviousSlide() {
    const { slideIndex } = this.state;

    if (slideIndex === 0) { return; }

    this.moveToSlide(slideIndex - 1);
  }

  private moveToSlide(slideIndex: number) {
    this.setState({ slideIndex: slideIndex }, () => {
      const oldSearchParams = QueryString.parse(this.history.location.search);
      const newSearchParams = { ...oldSearchParams, slide: slideIndex + 1 };

      this.history.push({
        pathname: this.history.location.pathname,
        search: `?${QueryString.stringify(newSearchParams)}`
      });
    });
  }

  // #endregion Actions
}