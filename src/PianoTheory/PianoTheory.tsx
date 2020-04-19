import { History } from "history";
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

import { DependencyInjector } from "../DependencyInjector";

import { createStudyFlashCardSetComponent } from "../StudyFlashCards/View";

import { PianoKeyboard, renderPianoKeyboardNoteNames } from "../Components/Utils/PianoKeyboard";
import * as IntroQuiz from "./IntroQuiz";
import * as PianoNotes from "../Components/Quizzes/Notes/PianoNotes";
import { naturalPitches, accidentalPitches, allPitches } from "../Components/Quizzes/Notes/PianoNotes";
import { PianoScaleFormulaDiagram } from "../Components/Utils/PianoScaleFormulaDiagram";
import { PianoScaleDronePlayer } from "../Components/Utils/PianoScaleDronePlayer";
import { MidiInputDeviceSelect } from "../Components/Utils/MidiInputDeviceSelect";
import { fullPianoLowestPitch, fullPianoHighestPitch, fullPianoAspectRatio, getPianoKeyboardAspectRatio } from '../Components/Utils/PianoUtils';
import { MidiNoteEventListener } from "../Components/Utils/MidiNoteEventListener";
import { AppModel } from "../App/Model";
import { MidiPianoRangeInput } from "../Components/Utils/MidiPianoRangeInput";
import { LimitedWidthContentContainer } from "../Components/Utils/LimitedWidthContentContainer";

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

export const PianoNoteDiagram: React.FunctionComponent<{
  pitch: Pitch,
  labelWhiteKeys: boolean,
  labelBlackKeys: boolean,
  showLetterPredicate?: (pitch: Pitch) => boolean,
  useSharps?: boolean
}> = props => (
  <PianoKeyboard
    rect={new Rect2D(new Size2D(getPianoKeyboardAspectRatio(/*octaveCount*/ 1) * 100, 100), new Vector2D(0, 0))}
    lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
    highestPitch={new Pitch(PitchLetter.B, 0, 4)}
    onKeyPress={p => AppModel.instance.pianoAudio.pressKey(p, 1)}
    onKeyRelease={p => AppModel.instance.pianoAudio.releaseKey(p)}
    pressedPitches={[props.pitch]}
    renderExtrasFn={metrics => renderPianoKeyboardNoteNames(
      metrics,
      /*useSharps*/ props.useSharps,
      /*showLetterPredicate*/ props.showLetterPredicate
        ? props.showLetterPredicate
        : p => ((props.labelWhiteKeys && p.isWhiteKey) || (props.labelBlackKeys && p.isBlackKey)) && (p.midiNumber <= props.pitch.midiNumber)
    )}
    style={{ width: "100%", maxWidth: `${maxOneOctavePianoWidth}px`, height: "auto" }} />
);

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
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "space-evenly" }}>
        <div>
          <h2>Welcome to Falsetto's "Piano Theory" course!</h2>
          <p>This is an interactive course designed to teach you the essentials of piano and music theory in a hands-on manner.</p>
          <p>This course is designed to be viewed on tablets and computer monitors.</p>
          <p>It is highly recommended to connect a MIDI piano keyboard to follow along.</p>
        </div>

        <p><strong>Step 1: Connect a MIDI piano keyboard and select it below.</strong></p>
        <p><MidiInputDeviceSelect /></p>

        <p><strong>Step 2: Press the leftmost and rightmost keys on your MIDI keyboard to detect the number of keys it has.</strong></p>
        <div style={{ width: `${maxPianoWidth}px`, margin: "0 auto" }}><MidiPianoRangeInput /></div>

        <p><strong>Step 3: Press the ">" arrow button at the top of this page, or press the right arrow key on your computer keyboard, to move to the next slide.</strong></p>
      </div>
    )),
    new Slide(() => (
      <div>
        <p>This is a standard-size piano which has 88 white &amp; black keys.</p>
        <p>When pressed, each key produces a particular "pitch" &ndash; the "highness" or "lowness" of a sound.</p>
        <p>Keys further to the left produce lower pitches, and keys further to the right produce higher pitches.</p>
        <p>Try pressing they keys of your MIDI piano keyboard, or clicking the keys, to hear how the produced pitches change as you move left and right.</p>
        <FullPiano />
      </div>
    ))
  ]),
  new SlideGroup("Notes", [
    new Slide(() => (
      <div>
        <p>Every piano key has one or more names that we must learn, starting with the white keys in the small section of a piano keyboard below.</p>
        <p>The highlighted key below, to the left of the group of 2 black keys, is called <strong>C</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.C, 0, 4)} labelWhiteKeys={true} labelBlackKeys={false} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key is called <strong>D</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.D, 0, 4)} labelWhiteKeys={true} labelBlackKeys={false} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key is called <strong>E</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.E, 0, 4)} labelWhiteKeys={true} labelBlackKeys={false} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key is called <strong>F</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.F, 0, 4)} labelWhiteKeys={true} labelBlackKeys={false} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key is called <strong>G</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.G, 0, 4)} labelWhiteKeys={true} labelBlackKeys={false} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key is called <strong>A</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.A, 0, 4)} labelWhiteKeys={true} labelBlackKeys={false} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key is called <strong>B</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.B, 0, 4)} labelWhiteKeys={true} labelBlackKeys={false} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>Notice that the names are simply letters of the English alphabet, and that they jump to <strong>A</strong> to the right of the <strong>G</strong> key.</p>
        <p>Study this slide, then move to the next slide to test your knowledge of white key names with a quiz.</p>
        <PianoNotesDiagram
          lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
          highestPitch={new Pitch(PitchLetter.B, 0, 4)}
          maxWidth={maxOneOctavePianoWidth}
          labelBlackKeys={false} />
      </div>
    )),
    
    new Slide(() => (
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
    
    new Slide(() => (
      <div>
        <p>Now let's learn the names of the pitches that black piano keys produce.</p>
        <p>This key, like all black keys, has multiple names &ndash; one name for it is <strong>C♯</strong>, and another name for it is <strong>D♭</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.C, 1, 4)} labelWhiteKeys={false} labelBlackKeys={true} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>The '♯' symbol means the pitch is raised by one key, so C♯ means "the key to the right of C".</p>
        <PianoNoteDiagram
          pitch={new Pitch(PitchLetter.C, 1, 4)}
          labelWhiteKeys={true}
          labelBlackKeys={true}
          useSharps={true}
          showLetterPredicate={p => (p.midiNumber <= (new Pitch(PitchLetter.C, 1, 4)).midiNumber)} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>The '♭' symbol means the pitch is lowered by one key, so D♭ means "the key to the left of D".</p>
        <PianoNoteDiagram
          pitch={new Pitch(PitchLetter.C, 1, 4)}
          labelWhiteKeys={true}
          labelBlackKeys={true}
          useSharps={false}
          showLetterPredicate={p => p.isEnharmonic(new Pitch(PitchLetter.D, 0, 4)) || p.isEnharmonic(new Pitch(PitchLetter.D, -1, 4))} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key is called <strong>D♯</strong>, or <strong>E♭</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.D, 1, 4)} labelWhiteKeys={false} labelBlackKeys={true} />
      </div>
    )),

    new Slide(() => (
      <div>
        <p>This key is called <strong>F♯</strong>, or <strong>G♭</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.F, 1, 4)} labelWhiteKeys={false} labelBlackKeys={true} />
      </div>
    )),

    new Slide(() => (
      <div>
        <p>This key is called <strong>G♯</strong>, or <strong>A♭</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.G, 1, 4)} labelWhiteKeys={false} labelBlackKeys={true} />
      </div>
    )),

    new Slide(() => (
      <div>
        <p>This key is called <strong>A♯</strong>, or <strong>B♭</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.B, -1, 4)} labelWhiteKeys={false} labelBlackKeys={true} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>Study this slide, then move to the next slide to test your knowledge of black key names with a quiz.</p>
        <PianoNotesDiagram
          lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
          highestPitch={new Pitch(PitchLetter.B, 0, 4)}
          maxWidth={maxOneOctavePianoWidth}
          labelWhiteKeys={false} />
      </div>
    )),
    
    new Slide(() => (
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
    
    new Slide(() => (
      <div>
        <p>You have now learned all of the names of the keys in this section of the piano!</p>
        <PianoNotesDiagram
          lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
          highestPitch={new Pitch(PitchLetter.B, 0, 4)}
          maxWidth={maxOneOctavePianoWidth} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>Now let's zoom out. The names of the other keys are simply repetitions of the pattern we've learned, so you have actually learned the names of all 88 piano keys!</p>
        <PianoNotesDiagram
          lowestPitch={fullPianoLowestPitch}
          highestPitch={fullPianoHighestPitch}
          maxWidth={maxPianoWidth} />
      </div>
    )),

    
    new Slide(() => (
      <div>
        <p>Study this slide, then move to the next slide to comprehensively test your knowledge of piano key names with a quiz.</p>
        <PianoNotesDiagram
          lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
          highestPitch={new Pitch(PitchLetter.B, 0, 4)}
          maxWidth={maxOneOctavePianoWidth} />
      </div>
    )),

    new Slide(() => (
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
  new SlideGroup("Major Scales", [
    new Slide(() => (
      <div>
        <p>Now let's learn about scales.</p>
        <p>Scales are sets of notes (usually 7 notes in Western musical scales) with a designated "root note" (which generally "sounds like home" in the scale).</p>
        <p>Below is an interactive diagram of the "C Major" scale, which has a root note of C and comprises of the notes: C, D, E, F, G, A, B.</p>
        <p>Try pressing the piano keys below to get a feel for how the scale sounds. Pressing keys will play both the pressed note and the root note (C).</p>
        <p><PianoScaleDronePlayer scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))} octaveCount={1} maxWidth={maxOneOctavePianoWidth} /></p>
      </div>
    )),
    new Slide(() => (
      <div>
        <p>Major scales are very commonly used, and are built with the same formula: "R W W H W W W H", where:</p>
        <p><strong>"R"</strong> means the root note<br /><strong>"W"</strong> means the next note is a whole step (2 keys) to the right of the previous note<br /><strong>"H"</strong> means the next note is a half step (1 key) to the right of the previous note.</p>
        <p>Below is another diagram of the C major scale along with its formula.</p>
        <p><PianoScaleFormulaDiagram scaleType={ScaleType.Ionian} /></p>
      </div>
    )),
    new Slide(() => (
      <div>
        <p>QUIZ</p>
      </div>
    )),
  ])
];

function getSlideGroup(slideIndex: number): SlideGroup | undefined {
  let numSlidesSeen = 0;

  for (let slideGroupIndex = 0; slideGroupIndex < slideGroups.length; slideGroupIndex++) {
    const slideGroup = slideGroups[slideGroupIndex];

    numSlidesSeen += slideGroup.slides.length;

    if (numSlidesSeen > slideIndex) {
      return slideGroup;
    }
  }

  return undefined;
}

// TODO: optimize
let slides = flattenArrays<Slide>(slideGroups.map(sg => sg.slides))
  .slice(0, 43)
  .concat([new Slide(() => <h3>More coming soon!</h3>)]);

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
    AppModel.instance.pianoAudio.releaseAllKeys();
    this.unregisterKeyEventHandlers();
  }

  // TODO: show slide group
  public render(): JSX.Element {
    const { slideIndex } = this.state;

    const slideNumber = slideIndex + 1;
    const numSlides = slides.length;
    const renderedSlide = slides[slideIndex].renderFn();
    const slideGroup = getSlideGroup(slideIndex);

    return (
      <div style={{ height: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", textAlign: "center", height: "100%" }}>
          <div>
            <Button
              variant="contained"
              disabled={!this.canMoveToPreviousSlide()}
              onClick={_ => this.moveToPreviousSlide()}
              style={{ textTransform: "none" }}
            >
              &lt;
            </Button>
            <span style={{ padding: "0 1em" }}>Slide {slideNumber} / {numSlides} - {slideGroup ? slideGroup.name : ""}</span>
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
          onNoteOn={(pitch, velocity) => AppModel.instance.pianoAudio.pressKey(pitch, velocity)}
          onNoteOff={pitch => AppModel.instance.pianoAudio.releaseKey(pitch)} />
      </div>
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