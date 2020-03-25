import * as React from "react";
import WebMidi, { InputEventNoteon, InputEventNoteoff, Input as MidiInput } from "webmidi";

import { PianoKeyboard } from './Components/Utils/PianoKeyboard';
import { Rect2D } from './lib/Core/Rect2D';
import { Size2D } from './lib/Core/Size2D';
import { Vector2D } from './lib/Core/Vector2D';
import { Pitch } from './lib/TheoryLib/Pitch';
import { PitchLetter } from './lib/TheoryLib/PitchLetter';
import { PianoAudio } from './Audio/PianoAudio';
import { flattenArrays } from './lib/Core/ArrayUtils';
import { AppModel } from './App/Model';
import { MidiDeviceConnectedAction, MidiDeviceDisconnectedAction, MidiInputDeviceChangedAction } from './App/Actions';
import { IAction } from './IAction';
import { ActionHandler, ActionBus } from './ActionBus';

const pianoAudio = new PianoAudio();

// #region Helper Components

export const FullPiano: React.FunctionComponent<{}> = props => (
  <PianoKeyboard
    rect={new Rect2D(new Size2D(400, 50), new Vector2D(0, 0))}
    lowestPitch={new Pitch(PitchLetter.A, 0, 0)}
    highestPitch={new Pitch(PitchLetter.C, 0, 8)}
    onKeyPress={p => pianoAudio.pressKey(p, 1)}
    onKeyRelease={p => pianoAudio.releaseKey(p)}
    style={{ width: "100%", maxWidth: "400px", height: "auto" }} />
);

export const TwoOctavePiano: React.FunctionComponent<{}> = props => (
  <PianoKeyboard
    rect={new Rect2D(new Size2D(300, 100), new Vector2D(0, 0))}
    lowestPitch={new Pitch(PitchLetter.C, 0, 3)}
    highestPitch={new Pitch(PitchLetter.B, 0, 4)}
    onKeyPress={p => pianoAudio.pressKey(p, 1)}
    onKeyRelease={p => pianoAudio.releaseKey(p)}
    style={{ width: "100%", maxWidth: "300px", height: "auto" }} />
);

export const OneOctavePiano: React.FunctionComponent<{}> = props => (
  <PianoKeyboard
    rect={new Rect2D(new Size2D(150, 100), new Vector2D(0, 0))}
    lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
    highestPitch={new Pitch(PitchLetter.B, 0, 4)}
    onKeyPress={p => pianoAudio.pressKey(p, 1)}
    onKeyRelease={p => pianoAudio.releaseKey(p)}
    style={{ width: "100%", maxWidth: "300px", height: "auto" }} />
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
        <p>Welcome to Falsetto's "Piano Theory" course.</p>
        <p>This is an interactive course designed to teach you the essentials of piano and music theory in a hands-on manner.</p>
        <p>It is highly recommended to connect a MIDI piano keyboard to your computer to follow along with these lessons.</p>
      </div>
    )),
    new Slide(() => (
      <div>
        <p>This is a piano.</p>
        <FullPiano />
      </div>
    )),
    new Slide(() => (
      <div>
        <p>Pianos are made of white &amp; black "keys".</p>
        <FullPiano />
      </div>
    )),
    new Slide(() => (
      <div>
        <p>Standard pianos have 88 white &amp; black keys. Some pianos/keyboards are smaller.</p>
        <FullPiano />
      </div>
    )),
    new Slide(() => (
      <div>
        <p>These lessons will generally only show a portion of the 88 keys due to screen size limitations.</p>
        <TwoOctavePiano />
      </div>
    )),

    new Slide(() => (
      <div>
        <p>Each key produces a particular "pitch" &ndash; the "highness" or "lowness" of a sound &ndash; when pressed. Try pressing some of the keys on your screen, or try connecting a MIDI keyboard and physically pressing keys, to hear the pitches they produce.</p>
        <TwoOctavePiano />
      </div>
    )),
    new Slide(() => (
      <div>
        <p>Keys further to the left produce lower pitches, and keys further to the right produce higher pitches.</p>
        <TwoOctavePiano />
      </div>
    )),

    // quiz

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
    // quiz
    
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
    // quiz

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

export interface IPianoTheoryProps {
}
export interface IPianoTheoryState {
  slideIndex: number;
}
export class PianoTheory extends React.Component<IPianoTheoryProps, IPianoTheoryState> {
  public constructor(props: IPianoTheoryProps) {
    super(props);

    this.boundHandleAction = this.handleAction.bind(this);

    this.state = {
      slideIndex: 0
    };
  }

  // #region React Functions

  private boundHandleAction: ActionHandler;
  
  public componentDidMount() {
    this.registerKeyEventHandlers();
    this.reinitializeMidi();
    ActionBus.instance.subscribe(this.boundHandleAction);
  }

  public componentWillUnmount() {
    ActionBus.instance.unsubscribe(this.boundHandleAction);
    pianoAudio.releaseAllKeys();
    this.uninitializeMidi();
    this.unregisterKeyEventHandlers();
  }

  // TODO: show slide group
  public render(): JSX.Element {
    const { slideIndex } = this.state;

    const slideNumber = slideIndex + 1;
    const numSlides = slides.length;
    const renderedSlide = slides[slideIndex].renderFn();

    return (
      <div style={{ width: "100%", height: "100vh", textAlign: "center" }}>
        <div>{slideNumber} / {numSlides}</div>
        {renderedSlide}
      </div>
    );
  }

  // #endregion React Functions

  // #region Action Handlers
  
  private handleAction(action: IAction) {
    switch (action.getId()) {
      case MidiDeviceConnectedAction.Id:
      case MidiDeviceDisconnectedAction.Id:
      case MidiInputDeviceChangedAction.Id:
        this.reinitializeMidi();
    }
  }

  // #endregion
  
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

  // #region MIDI

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
        pianoAudio.pressKey(pitch, event.velocity);
      };
      this.onNoteOff = event => {
        const pitch = Pitch.createFromMidiNumber(event.note.number);
        pianoAudio.releaseKey(pitch);
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

  // #endregion

  // #region Actions

  private moveToNextSlide() {
    const { slideIndex } = this.state;

    const newSlideIndex = slideIndex + 1;
    if (newSlideIndex == slides.length) { return; }

    this.setState({ slideIndex: newSlideIndex });
  }
  private moveToPreviousSlide() {
    const { slideIndex } = this.state;

    if (slideIndex === 0) { return; }

    this.setState({ slideIndex: slideIndex - 1 });
  }

  // #endregion Actions
}