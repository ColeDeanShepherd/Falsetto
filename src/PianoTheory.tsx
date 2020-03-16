import * as React from "react";
import { PianoKeyboard } from './Components/Utils/PianoKeyboard';
import { Rect2D } from './lib/Core/Rect2D';
import { Size2D } from './lib/Core/Size2D';
import { Vector2D } from './lib/Core/Vector2D';
import { Pitch } from './lib/TheoryLib/Pitch';
import { PitchLetter } from './lib/TheoryLib/PitchLetter';
import { playPitches } from './Audio/GuitarAudio';
import { flattenArrays } from './lib/Core/ArrayUtils';

class Slide {
  public constructor(public renderFn: () => JSX.Element) {}
}
class SlideGroup {
  public constructor(public name: string, public slides: Array<Slide>) {}
}

class KeyBinding {
  // key
  // press/release/repeat actions
}

// TODO: dynamic width/height
// TODO: quizzes
// TODO: slide links
// TODO: use symbols
const slideGroups = [
  new SlideGroup("Introduction", [
    new Slide(() => <span>Introduction to format (when format is determined)</span>),
    new Slide(() => <span>This is a piano (when figure out start &amp; end)</span>),
    new Slide(() => <span>Pianos are made of white &amp; black "keys".</span>),
    new Slide(() => <span>Standard pianos have 88 white &amp; black keys. Some pianos/keyboards are smaller.</span>),
    new Slide(() => <span>These lessons will generally only show a portion of the 88 keys due to screen size limitations.</span>),

    new Slide(() => <span>Each key produces a particular "pitch" &ndash; the "highness" or "lowness" of a sound &ndash; when pressed. Try pressing some of the keys on your screen, or try connecting a MIDI keyboard and physically pressing keys, to hear the pitches they produce.</span>),
    new Slide(() => <span>Keys further to the left produce lower pitches, and keys further to the right produce higher pitches.</span>),

    // quiz

    new Slide(() => <span>Each pitch has a specific name</span>),
    new Slide(() => <span>Let's first focus on the white keys in a small section of the keyboard.</span>),
    new Slide(() => <span>This key, immediately to the left of the group of 3 black keys, is called C.</span>),
    new Slide(() => <span>This key is called D.</span>),
    new Slide(() => <span>This key is called E.</span>),
    new Slide(() => <span>This key is called F.</span>),
    new Slide(() => <span>This key is called G.</span>),
    new Slide(() => <span>This key is called A.</span>),
    new Slide(() => <span>This key is called B.</span>),
    // quiz
    
    new Slide(() => <span>Now let's learn the names of the black keys.</span>),
    new Slide(() => <span>This key, like all black keys, has multiple names. One of the names for it is C#. Another name for it is Db. The reason for multiple names will be explained later.</span>),
    new Slide(() => <span>Sharps &amp; flats explanation.</span>),
    new Slide(() => <span>This key is called D#, or Eb.</span>),
    new Slide(() => <span>This key is called F#, or Gb.</span>),
    new Slide(() => <span>This key is called G#, or Ab.</span>),
    new Slide(() => <span>This key is called A#, or Bb.</span>),
    // quiz

    new Slide(() => <span>Now that we've learned the names of the keys in the section, let's zoom out.</span>),
    new Slide(() => <span>You can see that the piano keys are simply a repetition of the pattern we've learned.</span>),
    new Slide(() => <span>Each repetition of the pattern has the same pitch names, so we've now learned all the notes on the piano!</span>),
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
        onKeyPress={p => playPitches([p])}
        style={{ width: "100%", maxWidth: "300px", height: "auto" }} />
    )),
    new Slide(() => <span>Slide 2</span>),
    new Slide(() => <span>Slide 3</span>)
  ])
];

// TODO: optimize
const slides = flattenArrays<Slide>(slideGroups.map(sg => sg.slides));

export interface IPianoTheoryProps {
}
export interface IPianoTheoryState {
  slideIndex: number;
}
export class PianoTheory extends React.Component<IPianoTheoryProps, IPianoTheoryState> {
  public constructor(props: IPianoTheoryProps) {
    super(props);

    this.state = {
      slideIndex: 0
    };
  }

  public componentDidMount() {
    this.boundOnKeyDown = this.onKeyDown.bind(this);
    window.addEventListener("keydown", this.boundOnKeyDown);
    
    this.boundOnKeyUp = this.onKeyUp.bind(this);
    window.addEventListener("keyup", this.boundOnKeyUp);
  }

  public componentWillUnmount() {
    if (this.boundOnKeyDown) {
      window.removeEventListener("keydown", this.boundOnKeyDown);
      this.boundOnKeyDown = undefined;
    }

    if (this.boundOnKeyUp) {
      window.removeEventListener("keyup", this.boundOnKeyUp);
      this.boundOnKeyUp = undefined;
    }
  }

  // TODO: show slide group
  public render(): JSX.Element {
    const { slideIndex } = this.state;

    const slideNumber = slideIndex + 1;
    const numSlides = slides.length;
    const renderedSlide = slides[slideIndex].renderFn();

    return (
      <div style={{ width: "100%", height: "100vh" }}>
        <div>{slideNumber} / {numSlides}</div>
        {renderedSlide}
      </div>
    );
  }
  
  private boundOnKeyDown: ((event: KeyboardEvent) => void) | undefined;
  private boundOnKeyUp: ((event: KeyboardEvent) => void) | undefined;

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
}