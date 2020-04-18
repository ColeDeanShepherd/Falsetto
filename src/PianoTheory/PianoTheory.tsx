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
import { LimitedWidthContentContainer } from "../Components/Utils/LimitedWidthContentContainer";

import { PianoKeyboard, renderPianoKeyboardNoteNames } from "../Components/Utils/PianoKeyboard";
import * as IntroQuiz from "./IntroQuiz";
import * as PianoNotes from "../Components/Quizzes/Notes/PianoNotes";
import { naturalPitches, accidentalPitches, allPitches } from "../Components/Quizzes/Notes/PianoNotes";
import { PianoScaleFormulaDiagram } from "../Components/Utils/PianoScaleFormulaDiagram";
import { PianoScaleDronePlayer } from "../Components/Utils/PianoScaleDronePlayer";
import { PianoScaleFingeringDiagram } from "../Components/Utils/PianoScaleFingeringDiagram";
import { MidiInputDeviceSelect } from "../Components/Utils/MidiInputDeviceSelect";
import { fullPianoLowestPitch, fullPianoHighestPitch } from "../Components/Utils/PianoUtils";
import { MidiNoteEventListener } from "../Components/Utils/MidiNoteEventListener";
import { AppModel } from "../App/Model";
import { MidiPianoRangeInput } from "../Components/Utils/MidiPianoRangeInput";

// #region Helper Components

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
    aspectRatio={new Size2D(400, 50)}
    maxWidth={400}
    lowestPitch={fullPianoLowestPitch}
    highestPitch={fullPianoHighestPitch} />
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

export const PianoNoteDiagram: React.FunctionComponent<{
  pitch: Pitch,
  labelWhiteKeys: boolean,
  labelBlackKeys: boolean,
  showLetterPredicate?: (pitch: Pitch) => boolean,
  useSharps?: boolean
}> = props => (
  <PianoKeyboard
    rect={new Rect2D(new Size2D(150, 100), new Vector2D(0, 0))}
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
    style={{ width: "100%", maxWidth: "300px", height: "auto" }} />
);

export const PianoNotesDiagram: React.FunctionComponent<{
  octaveCount: number,
  labelWhiteKeys?: boolean,
  labelBlackKeys?: boolean
}> = props => {
  const labelWhiteKeys = (props.labelWhiteKeys !== undefined) ? props.labelWhiteKeys : true;
  const labelBlackKeys = (props.labelBlackKeys !== undefined) ? props.labelBlackKeys : true;

  return (
    <PianoKeyboard
      rect={new Rect2D(new Size2D(props.octaveCount * 150, 100), new Vector2D(0, 0))}
      lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
      highestPitch={new Pitch(PitchLetter.B, 0, 4 + (props.octaveCount - 1))}
      onKeyPress={p => AppModel.instance.pianoAudio.pressKey(p, 1)}
      onKeyRelease={p => AppModel.instance.pianoAudio.releaseKey(p)}
      pressedPitches={[]}
      renderExtrasFn={metrics => renderPianoKeyboardNoteNames(
        metrics,
        /*useSharps*/ undefined,
        /*showLetterPredicate*/ p => p.isWhiteKey ? labelWhiteKeys : labelBlackKeys
      )}
      style={{ width: "100%", maxWidth: "300px", height: "auto" }} />
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
        <p><MidiPianoRangeInput /></p>

        <p><strong>Step 3: Press the ">" arrow button at the top of this page, or press the right arrow key on your computer keyboard, to move to the next slide.</strong></p>
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
      <div style={{ marginTop: "1em" }}>
        {createStudyFlashCardSetComponent(
          IntroQuiz.flashCardSet,
          /*isEmbedded*/ false,
          /*hideMoreInfoUri*/ true,
          /*title*/ undefined,
          /*style*/ undefined,
          /*enableSettings*/ undefined,
          /*showRelatedExercises*/ false)}
      </div>
    ))
  ]),
  new SlideGroup("Notes", [
    new Slide(() => (
      <div>
        <p>Now let's learn the names of the pitches that piano keys produce.</p>
        <p>Let's first focus on the white keys in the small section of piano keyboard below.</p>
        <OneOctavePiano />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key, immediately to the left of the group of 2 black keys, is called C.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.C, 0, 4)} labelWhiteKeys={true} labelBlackKeys={false} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key is called D.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.D, 0, 4)} labelWhiteKeys={true} labelBlackKeys={false} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key is called E.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.E, 0, 4)} labelWhiteKeys={true} labelBlackKeys={false} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key, immediately to the left of the group of 3 black keys, is called F.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.F, 0, 4)} labelWhiteKeys={true} labelBlackKeys={false} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key is called G.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.G, 0, 4)} labelWhiteKeys={true} labelBlackKeys={false} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key is called A.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.A, 0, 4)} labelWhiteKeys={true} labelBlackKeys={false} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key is called B.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.B, 0, 4)} labelWhiteKeys={true} labelBlackKeys={false} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>You have now learned the names of all of the white piano keys in this section of the piano!</p>
        <p>Study this slide, then move to the next slide to test your knowledge with a quiz.</p>
        <PianoNotesDiagram octaveCount={1} labelBlackKeys={false} />
      </div>
    )),
    
    new Slide(() => (
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
    )),
    
    new Slide(() => (
      <div>
        <p>Now let's learn the names of the pitches that black piano keys produce.</p>
        <OneOctavePiano />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>This key, like all black keys, has multiple names &ndash; one name for it is C♯, and another name for it is D♭.</p>
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
        <p>This key is called D#, or Eb.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.D, 1, 4)} labelWhiteKeys={false} labelBlackKeys={true} />
      </div>
    )),

    new Slide(() => (
      <div>
        <p>This key is called F#, or Gb.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.F, 1, 4)} labelWhiteKeys={false} labelBlackKeys={true} />
      </div>
    )),

    new Slide(() => (
      <div>
        <p>This key is called G#, or Ab.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.G, 1, 4)} labelWhiteKeys={false} labelBlackKeys={true} />
      </div>
    )),

    new Slide(() => (
      <div>
        <p>This key is called A#, or Bb.</p>
        <PianoNoteDiagram pitch={new Pitch(PitchLetter.B, -1, 4)} labelWhiteKeys={false} labelBlackKeys={true} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>You have now learned the names of all of the black piano keys in this section of the piano!</p>
        <p>Study this slide, then move to the next slide to test your knowledge with a quiz.</p>
        <PianoNotesDiagram octaveCount={1} labelWhiteKeys={false} />
      </div>
    )),
    
    new Slide(() => (
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
    )),
    
    new Slide(() => (
      <div>
        <p>You have now learned all of the names of the keys in this section of the piano!</p>
        <PianoNotesDiagram octaveCount={1} />
      </div>
    )),
    
    new Slide(() => (
      <div>
        <p>Now let's zoom out.</p>
        <p>The names of the other keys are simply repetitions of the pattern we've learned, so you have actually learned the names of all 88 piano keys!</p>
        <PianoNotesDiagram octaveCount={2} />
      </div>
    )),

    
    new Slide(() => (
      <div>
        <p>Study this slide, then move to the next slide to comprehensively test your knowledge of piano key names with a quiz.</p>
        <PianoNotesDiagram octaveCount={1} />
      </div>
    )),

    new Slide(() => (
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
    )),
  ]),
  new SlideGroup("Major Scales", [
    new Slide(() => (
      <div>
        <p>Now let's learn about scales.</p>
        <p>Scales are sets of notes (usually 7 notes in Western musical scales) with a designated "root note" (which generally "sounds like home" in the scale).</p>
        <p>Below is an interactive diagram of the "C Major" scale, which has a root note of C and comprises of the notes: C, D, E, F, G, A, B.</p>
        <p>Try pressing the piano keys below to get a feel for how the scale sounds. Pressing keys will play both the pressed note and the root note (C).</p>
        <p><PianoScaleDronePlayer scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))} octaveCount={1} maxWidth={300} /></p>
      </div>
    )),
    new Slide(() => (
      <div>
        <p>Major scales are very commonly used, and are built with the same formula: "R W W H W W W H", where:</p>
        <ul>
          <li>"R" means the root note</li>
          <li>"W" means the next note is a whole step (2 keys) to the right of the previous note</li>
          <li>"H" means the next note is a half step (1 key) to the right of the previous note.</li>
        </ul>
        <p>Below is another diagram of the C major scale along with its formula.</p>
        <p><PianoScaleFormulaDiagram scaleType={ScaleType.Ionian} /></p>
      </div>
    )),
    new Slide(() => (
      <div>
        <p>This is the C Major scale.</p>
        <p><PianoScaleDronePlayer scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))} octaveCount={2} maxWidth={300} /></p>
      </div>
    )),
    new Slide(() => (
      <div>
        <p>This is the C# Major scale.</p>
        <p><PianoScaleDronePlayer scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 1, 4))} octaveCount={2} maxWidth={300} /></p>
        <p>Another name for the C# Major scale is Db Major, which uses flats instead of sharps.</p>
        <p><PianoScaleDronePlayer scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.D, -1, 4))} octaveCount={2} maxWidth={300} /></p>
      </div>
    )),
    new Slide(() => (
      <div>
        <p>This is the D Major scale.</p>
        <p><PianoScaleDronePlayer scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.D, 0, 4))} octaveCount={2} maxWidth={300} /></p>
      </div>
    )),
    new Slide(() => (
      <div>
        <p>This is the Eb Major scale.</p>
        <p><PianoScaleDronePlayer scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.E, -1, 4))} octaveCount={2} maxWidth={300} /></p>
      </div>
    )),
    new Slide(() => (
      <div>
        <p>This is the E Major scale.</p>
        <p><PianoScaleDronePlayer scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.E, 0, 4))} octaveCount={2} maxWidth={300} /></p>
      </div>
    )),
    new Slide(() => (
      <div>
        <p>This is the F Major scale.</p>
        <p><PianoScaleDronePlayer scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.F, 0, 4))} octaveCount={2} maxWidth={300} /></p>
      </div>
    )),
    new Slide(() => (
      <div>
        <p>This is the F# Major scale.</p>
        <p><PianoScaleDronePlayer scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.F, 1, 4))} octaveCount={2} maxWidth={300} /></p>
        <p>Another name for the F# Major scale is Gb Major, which uses flats instead of sharps.</p>
        <p><PianoScaleDronePlayer scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.G, -1, 4))} octaveCount={2} maxWidth={300} /></p>
      </div>
    )),
    new Slide(() => (
      <div>
        <p>This is the G Major scale.</p>
        <p><PianoScaleDronePlayer scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.G, 0, 4))} octaveCount={2} maxWidth={300} /></p>
      </div>
    )),
    new Slide(() => (
      <div>
        <p>This is the Ab Major scale.</p>
        <p><PianoScaleDronePlayer scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.A, -1, 4))} octaveCount={2} maxWidth={300} /></p>
      </div>
    )),
    new Slide(() => (
      <div>
        <p>This is the A Major scale.</p>
        <p><PianoScaleDronePlayer scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.A, 0, 4))} octaveCount={2} maxWidth={300} /></p>
      </div>
    )),
    new Slide(() => (
      <div>
        <p>This is the Bb Major scale.</p>
        <p><PianoScaleDronePlayer scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.B, -1, 4))} octaveCount={2} maxWidth={300} /></p>
      </div>
    )),
    new Slide(() => (
      <div>
        <p>This is the B Major scale.</p>
        <p><PianoScaleDronePlayer scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.B, 0, 4))} octaveCount={2} maxWidth={300} /></p>
        <p>Another name for the B Major scale is Cb Major, which uses flats instead of sharps.</p>
        <p><PianoScaleDronePlayer scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.G, -1, 4))} octaveCount={2} maxWidth={300} /></p>
      </div>
    )),

    // Quiz



    /*new Slide(() => (
      <div>
        <p>Here is a common "fingering" &mdash; instructions for which fingers to use when playing piano keys &mdash; for playing the C major scale with your left hand:</p>
        <p><PianoScaleFingeringDiagram scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))} /></p>
      </div>
    )),*/
    new Slide(() => (
      <div>
        <p></p>
      </div>
    )),




    new Slide(() => (
      <PianoKeyboard
        rect={new Rect2D(new Size2D(300, 200), new Vector2D(0, 0))}
        lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
        highestPitch={new Pitch(PitchLetter.B, 0, 4)}
        onKeyPress={p => AppModel.instance.pianoAudio.pressKey(p, 1)}
        onKeyRelease={p => AppModel.instance.pianoAudio.releaseKey(p)}
        style={{ width: "100%", maxWidth: "300px", height: "auto" }} />
    )),
    new Slide(() => <span>Slide 2</span>),
    new Slide(() => <span>Slide 3</span>)])
];

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
            <span style={{ padding: "0 1em" }}>Slide {slideNumber} / {numSlides}</span>
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