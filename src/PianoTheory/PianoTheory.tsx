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
import { serializeMidiInputDeviceSettings } from '../Persistence';

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
  public constructor(public url: string, public renderFn: () => JSX.Element) {}
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
    new Slide("introduction", () => (
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "space-evenly" }}>
        <div>
          <h2>Section 1: Introduction</h2>
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
    new Slide("note-c", () => (
      <div>
        <h2>Section 2: Notes</h2>
        <p>Every piano key has one or more names, which we must learn in order to navigate the instrument and communicate with other musicians.</p>
        <p>We will start with the white keys in the small section of a piano keyboard below. The highlighted key below, to the left of the group of 2 black keys, is called <strong>C</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.C, 0, 4)} labelWhiteKeys={true} labelBlackKeys={false} />
      </div>
    )),
    
    new Slide("note-d", () => (
      <div>
        <p>When moving one white key to the right, we also move forward by one letter in the English alphabet, so this key is called <strong>D</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.D, 0, 4)} labelWhiteKeys={true} labelBlackKeys={false} />
      </div>
    )),
    
    new Slide("note-e", () => (
      <div>
        <p>This key is called <strong>E</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.E, 0, 4)} labelWhiteKeys={true} labelBlackKeys={false} />
      </div>
    )),
    
    new Slide("note-f", () => (
      <div>
        <p>This key is called <strong>F</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.F, 0, 4)} labelWhiteKeys={true} labelBlackKeys={false} />
      </div>
    )),
    
    new Slide("note-g", () => (
      <div>
        <p>This key is called <strong>G</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.G, 0, 4)} labelWhiteKeys={true} labelBlackKeys={false} />
      </div>
    )),
    
    new Slide("note-a", () => (
      <div>
        <p>After "G" there is no "H" key &mdash; instead we jump backwards through the English alphabet to <strong>A</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.A, 0, 4)} labelWhiteKeys={true} labelBlackKeys={false} />
      </div>
    )),
    
    new Slide("note-b", () => (
      <div>
        <p>The last white key is called <strong>B</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.B, 0, 4)} labelWhiteKeys={true} labelBlackKeys={false} />
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
    
    new Slide("note-c-sharp", () => (
      <div>
        <p>Now let's learn the names of the black piano keys in this section of the piano.</p>
        <p>The key highlighted below, like all black keys, has multiple names. One name for it is <strong>C♯</strong> (pronounced "C sharp").</p>
        <p>The '♯' ("sharp") symbol means the pitch is raised by one key, so C♯ means "the key to the right of C".</p>
        <PianoNoteDiagram
          pitch={new Pitch(PitchLetter.C, 1, 4)}
          labelWhiteKeys={true}
          labelBlackKeys={true}
          useSharps={true}
          showLetterPredicate={p => (p.midiNumber <= (new Pitch(PitchLetter.C, 1, 4)).midiNumber)} />
      </div>
    )),
    
    new Slide("note-d-flat", () => (
      <div>
        <p>Another name for the same key is <strong>D♭</strong> (pronounced "D flat").</p>
        <p>The '♭' ("flat") symbol means the pitch is lowered by one key, so D♭ means "the key to the left of D".</p>
        <PianoNoteDiagram
          pitch={new Pitch(PitchLetter.C, 1, 4)}
          labelWhiteKeys={true}
          labelBlackKeys={true}
          useSharps={false}
          showLetterPredicate={p => p.isEnharmonic(new Pitch(PitchLetter.D, 0, 4)) || p.isEnharmonic(new Pitch(PitchLetter.D, -1, 4))} />
      </div>
    )),
    
    new Slide("note-d-sharp-e-flat", () => (
      <div>
        <p>This key is called <strong>D♯</strong>, or <strong>E♭</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.D, 1, 4)} labelWhiteKeys={false} labelBlackKeys={true} />
      </div>
    )),

    new Slide("note-f-sharp-g-flat", () => (
      <div>
        <p>This key is called <strong>F♯</strong>, or <strong>G♭</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.F, 1, 4)} labelWhiteKeys={false} labelBlackKeys={true} />
      </div>
    )),

    new Slide("note-g-sharp-a-flat", () => (
      <div>
        <p>This key is called <strong>G♯</strong>, or <strong>A♭</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.G, 1, 4)} labelWhiteKeys={false} labelBlackKeys={true} />
      </div>
    )),

    new Slide("note-a-sharp-b-flat", () => (
      <div>
        <p>The last black key is called <strong>A♯</strong>, or <strong>B♭</strong>.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.B, -1, 4)} labelWhiteKeys={false} labelBlackKeys={true} />
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
        <p>You have learned the names of all the keys in this section of the piano!</p>
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
        <p>Now let's learn about <strong>scales</strong>. Scales are sets of notes with a designated "root note" that generally "sounds like home" in the scale.</p>
        <p>Scales are important to learn about because it's common for pieces of music to mostly use notes from a small handful of scales.</p>
        <p>Below is an interactive diagram of the <strong>C Major</strong> scale, which has a root note of C and comprises of the notes: C, D, E, F, G, A, B.</p>
        <p>Try pressing the piano keys below to get a feel for how the scale sounds. Pressing keys will play both the pressed note <strong>and</strong> the root note (C), which helps convey the "feeling" of the scale.</p>
        <p><PianoScaleDronePlayer scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))} octaveCount={1} maxWidth={maxOneOctavePianoWidth} /></p>
      </div>
    )),
    new Slide("major-scale", () => (
      <div>
        <p>Major scales, like the "C Major" scale we saw on the last slide, are very common in music.</p>
        <p>All major scales are built with the same formula: "<strong>R W W H W W W</strong>", where:</p>
        <p>
          <strong>"R"</strong> means the <strong>root note</strong> ("C" in the case of the C Major scale)
          <br />
          <strong>"W"</strong> means the next note is a <strong>whole step</strong> (2 keys) to the right of the previous note
          <br />
          <strong>"H"</strong> means the next note is a <strong>half step</strong> (1 key) to the right of the previous note.
        </p>
        <p>Though scale formulas define the notes of a scale in a particular order starting with the root note, you are free to play the notes in any order you like.</p>
        <p>Below is another interactive diagram of the C Major scale, along with the major scale formula.</p>
        <p><PianoScaleFormulaDiagram scaleType={ScaleType.Ionian} /></p>
      </div>
    )),
    new Slide("natural-minor-scale", () => (
      <div>
        <p>"Natural Minor" scales are also common in music, and are built with the formula: "<strong>R W H W W H W</strong>".</p>
        <p>Below is an interactive diagram of the <strong>C Natural Minor</strong> scale, along with the natural minor scale formula.</p>
        <p>Press the piano keys below to get a feel for how the scale sounds.</p>
        <p><PianoScaleFormulaDiagram scaleType={ScaleType.Aeolian} /></p>
      </div>
    )),
    new Slide("scales-summary", () => (
      <div>
        <p>There are many other scales, but we will cover them later.</p>
        <p>For now, take some time to review material below, then move to the next slide to test your knowledge of scales a quiz.</p>
        <br />
        <p><strong>Scales are sets of notes with a designated "root note"</strong> that generally "sounds like home" in the scale.</p>
        <p>Though scale formulas define the notes of a scale in a particular order starting with the root note, <strong>you are free to play the notes in any order you like</strong>.</p>
        <p>In scale formulas, <strong>"R" means "root note"</strong>.</p>
        <p>In scale formulas, <strong>"H" means the next note is a "half step" (1 key) to the right of the previous note</strong>.</p>
        <p>In scale formulas, <strong>"W" means the next note is a "whole step" (2 keys) to the right of the previous note</strong>.</p>
        <p>The formula for all major scales is <strong>R W W H W W W</strong>.</p>
        <p>The formula for all natural minor scales is <strong>R W H W W H W</strong>.</p>
      </div>
    )),
    new Slide("scales-quiz", () => (
      <div>
        <p>QUIZ</p>
      </div>
    )),
  ]),

  new SlideGroup("Chords", [
    new Slide("chords-introduction", () => (
      <div>
        <h2>Section 4: Chords</h2>
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
    new Slide("chord-progressions-quiz", () => (
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
      slideIndex: this.getSlideIndexFromUriParams()
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
      const newSearchParams = { ...oldSearchParams, slide: slides[slideIndex].url };

      this.history.push({
        pathname: this.history.location.pathname,
        search: `?${QueryString.stringify(newSearchParams)}`
      });
    });
  }

  // #endregion Actions

  private getSlideIndexFromUriParams(): number {
    const urlSearchParams = QueryString.parse(this.history.location.search);
    if (!(urlSearchParams.slide && (typeof urlSearchParams.slide === 'string'))) { return 0; }

    const slideIndex = slides.findIndex(s => s.url === urlSearchParams.slide);
    return Math.max(slideIndex, 0);
  }
}