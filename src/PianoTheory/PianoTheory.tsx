import { History, UnregisterCallback } from "history";
import * as React from "react";
import * as QueryString from "query-string";
import { Button } from "@material-ui/core";

import { flattenArrays } from '../lib/Core/ArrayUtils';
import { Margin } from "../lib/Core/Margin";
import { Vector2D } from "../lib/Core/Vector2D";

import { Pitch } from '../lib/TheoryLib/Pitch';
import { PitchLetter } from '../lib/TheoryLib/PitchLetter';
import { ScaleType, Scale } from "../lib/TheoryLib/Scale";
import { ChordType } from "../lib/TheoryLib/ChordType";
import { Chord } from "../lib/TheoryLib/Chord";

import { DependencyInjector } from "../DependencyInjector";

import { ActionBus, ActionHandler } from "../ActionBus";
import { IAction } from "../IAction";

import { WebMidiInitializedAction, MidiDeviceConnectedAction, MidiDeviceDisconnectedAction,
  MidiInputDeviceChangedAction, MidiInputDevicePitchRangeChangedAction } from "../AppMidi/Actions";
  import { AppModel } from "../App/Model";

import { createStudyFlashCardSetComponent } from "../StudyFlashCards/View";

import { NavLinkView } from "../NavLinkView";

import { renderPianoKeyboardNoteNames, PianoKeyboardMetrics, PianoKeyboard } from "../Components/Utils/PianoKeyboard";

import * as PianoNotes from "../Components/Quizzes/Notes/PianoNotes";
import * as ScalesQuiz from "./ScalesQuiz";
import * as ChordsIntroQuiz from "./ChordsIntroQuiz";
import * as DiatonicChordsQuiz from "./DiatonicChordsQuiz";
import * as ChordProgressionsQuiz from "./ChordProgressionsQuiz";

import { naturalPitches, accidentalPitches, allPitches } from "../Components/Quizzes/Notes/PianoNotes";
import { PianoScaleFormulaDiagram } from "../Components/Utils/PianoScaleFormulaDiagram";
import { PianoScaleDronePlayer } from '../Components/Utils/PianoScaleDronePlayer';
import { MidiInputDeviceSelect } from "../Components/Utils/MidiInputDeviceSelect";
import { fullPianoLowestPitch, fullPianoHighestPitch, fullPianoAspectRatio, getPianoKeyboardAspectRatio } from '../Components/Utils/PianoUtils';
import { MidiPianoRangeInput } from "../Components/Utils/MidiPianoRangeInput";
import { LimitedWidthContentContainer } from "../Components/Utils/LimitedWidthContentContainer";
import { NoteText } from '../Components/Utils/NoteText';
import { PianoScaleMajorRelativeFormulaDiagram } from "../Components/Utils/PianoScaleMajorRelativeFormulaDiagram";
import { PlayablePianoKeyboard } from "../Components/Utils/PlayablePianoKeyboard";
import { ChordView } from '../Components/Utils/ChordView';
import { ChordDiagram, ChordProgressionPlayer } from "../Components/Lessons/EssentialMusicTheory/ChordProgressions";

import "./Stylesheet.css"; // TODO: use a CSS preprocessor and split this into multiple files
import { range } from '../lib/Core/MathUtils';
import { Size2D } from '../lib/Core/Size2D';

export const maxPianoWidth = 1000;
export const maxOneOctavePianoWidth = 400;
export const maxTwoOctavePianoWidth = 500;

// #region Helper Components

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

export const FullPiano: React.FunctionComponent<{}> = props => (
  <PlayablePianoKeyboard
    aspectRatio={fullPianoAspectRatio}
    maxWidth={maxPianoWidth}
    lowestPitch={fullPianoLowestPitch}
    highestPitch={fullPianoHighestPitch} />
);

export const OneOctavePiano: React.FunctionComponent<{}> = props => (
  <PlayablePianoKeyboard
    aspectRatio={getPianoKeyboardAspectRatio(/*octaveCount*/ 1)}
    maxWidth={maxOneOctavePianoWidth}
    lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
    highestPitch={new Pitch(PitchLetter.B, 0, 4)} />
);

export const TwoOctavePiano: React.FunctionComponent<{}> = props => (
  <PlayablePianoKeyboard
    aspectRatio={getPianoKeyboardAspectRatio(/*octaveCount*/ 2)}
    maxWidth={maxTwoOctavePianoWidth}
    lowestPitch={new Pitch(PitchLetter.C, 0, 3)}
    highestPitch={new Pitch(PitchLetter.B, 0, 4)} />
);

const PianoKeyPatternDiagram: React.FunctionComponent<{}> = props => {
  const margin = new Margin(0, 0, 0, 20);
  
  function renderPatternHighlight(
    metrics: PianoKeyboardMetrics,
    patternOccurrenceIndex: number,
    color: string
  ): JSX.Element {
    const octaveNumber = 1 + patternOccurrenceIndex;

    const leftPitch = new Pitch(PitchLetter.C, 0, octaveNumber);
    const rightPitch = new Pitch(PitchLetter.B, 0, octaveNumber);

    const leftKeyRect = metrics.getKeyRect(leftPitch);
    const rightKeyRect = metrics.getKeyRect(rightPitch);

    const highlightSize = new Size2D(
      rightKeyRect.right - leftKeyRect.left,
      leftKeyRect.size.height
    );

    return (
      <rect
        x={leftKeyRect.left} y={leftKeyRect.top}
        width={highlightSize.width} height={highlightSize.height}
        fill={color}
        fillOpacity={0.3}
        className="pass-through-click">
      </rect>
    );
  }

  function renderPatternHighlights(metrics: PianoKeyboardMetrics): JSX.Element {
    const highlightColors = [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "indigo",
      "violet"
    ];

    return (
      <g>
        {range(0, 6)
          .map(i => renderPatternHighlight(metrics, i, highlightColors[i]))}
      </g>
    );
  }

  return (
    <PlayablePianoKeyboard
      aspectRatio={fullPianoAspectRatio}
      maxWidth={maxPianoWidth}
      margin={margin}
      lowestPitch={fullPianoLowestPitch}
      highestPitch={fullPianoHighestPitch}
      renderExtrasFn={renderPatternHighlights} />
  );
};

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
    const aspectRatio = getPianoKeyboardAspectRatio(/*octaveCount*/ 1);
    const lowestPitch = new Pitch(PitchLetter.C, 0, 4);
    const highestPitch = new Pitch(PitchLetter.B, 0, 4);

    return (
      <div>
        <PlayablePianoKeyboard
          aspectRatio={aspectRatio}
          maxWidth={maxOneOctavePianoWidth}
          lowestPitch={lowestPitch}
          highestPitch={highestPitch}
          onKeyPress={p => this.onKeyPress(p)}
          onKeyRelease={p => this.onKeyRelease(p)}
          forcePressedPitches={[pitch]}
          renderExtrasFn={metrics => renderPianoKeyboardNoteNames(
            metrics,
            /*useSharps*/ useSharps,
            /*showLetterPredicate*/ showLetterPredicate
              ? showLetterPredicate
              : p => ((labelWhiteKeys && p.isWhiteKey) || (labelBlackKeys && p.isBlackKey)) && (p.midiNumber <= pitch.midiNumber)
          )}
          wrapOctave={true} />
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
  const aspectRatio = getPianoKeyboardAspectRatio(octaveCount);

  return (
    <PlayablePianoKeyboard
      aspectRatio={aspectRatio}
      maxWidth={props.maxWidth}
      lowestPitch={props.lowestPitch}
      highestPitch={props.highestPitch}
      renderExtrasFn={metrics => renderPianoKeyboardNoteNames(
        metrics,
        /*useSharps*/ undefined,
        /*showLetterPredicate*/ p => p.isWhiteKey ? labelWhiteKeys : labelBlackKeys
      )}
      wrapOctave={true} />
  );
}

const ThirdsDiagram: React.FunctionComponent<{}> = props => {
  const aspectRatio = getPianoKeyboardAspectRatio(/*octaveCount*/ 2);
  const maxWidth = maxTwoOctavePianoWidth;
  const margin = new Margin(0, 0, 0, 20);
  const style = { width: "100%", maxWidth: `${maxWidth}px`, height: "auto" };

  const pitches = [
    new Pitch(PitchLetter.C, 0, 4),
    new Pitch(PitchLetter.E, 0, 4),
    new Pitch(PitchLetter.G, 0, 4),
  ];
  
  function renderIntervalLabels(metrics: PianoKeyboardMetrics): JSX.Element {
    function renderIntervalLabel(leftPitch: Pitch, rightPitch: Pitch): JSX.Element {
      const leftKeyRect = metrics.getKeyRect(leftPitch);
      const rightKeyRect = metrics.getKeyRect(rightPitch);

      const textOffsetY = metrics.height / 8;
      const fontSize = metrics.height / 15;
      const textPos = new Vector2D(
        (leftKeyRect.left + rightKeyRect.right) / 2,
        metrics.height + textOffsetY
      );
      const textStyle: any = {
        textAnchor: "middle",
        fontSize: fontSize
      };

      const lineOffsetY = textOffsetY - (2.5 * fontSize);
      const lineShrinkX = metrics.height / 50;
      const leftKeyLinePos = new Vector2D(leftKeyRect.center.x + lineShrinkX, leftKeyRect.bottom - lineOffsetY);
      const rightKeyLinePos = new Vector2D(rightKeyRect.center.x - lineShrinkX, leftKeyRect.bottom - lineOffsetY);
      const strokeWidth = metrics.height / 80;

      return (
        <g>
          <text
            x={textPos.x} y={textPos.y}
            style={textStyle}>
            Third
          </text>
          <line
            x1={leftKeyLinePos.x} y1={leftKeyLinePos.y}
            x2={rightKeyLinePos.x} y2={rightKeyLinePos.y}
            stroke="red" strokeWidth={strokeWidth} />
        </g>
      );
    }

    return (
      <g>
        {renderIntervalLabel(pitches[0], pitches[1])}
        {renderIntervalLabel(pitches[1], pitches[2])}
      </g>
    );
  }
  
  function renderExtrasFn(metrics: PianoKeyboardMetrics): JSX.Element {
    return (
      <g>
        {renderPianoKeyboardNoteNames(
            metrics,
            /*useSharps*/ true,
            /*showLetterPredicate*/ p => pitches.some(pitch => pitch.midiNumberNoOctave === p.midiNumberNoOctave)
          )}
        {renderIntervalLabels(metrics)}
      </g>
    );
  }

  return (
    <PlayablePianoKeyboard
      aspectRatio={aspectRatio}
      maxWidth={maxWidth}
      margin={margin}
      lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
      highestPitch={new Pitch(PitchLetter.B, 0, 5)}
      renderExtrasFn={renderExtrasFn} />
  );
};

// #endregion Helper Components

class KeyActions {
  public constructor(
    public onKeyPress: () => void,
    public onKeyRelease: () => void
  ) {}
}

// #region Slides

export class Slide {
  public constructor(
    public url: string,
    public renderFn: (slideshow: PianoTheory) => JSX.Element
  ) {}
}

export class SlideGroup {
  public constructor(public name: string, public slides: Array<Slide>) {}
}

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
          <p>We recommend connecting a MIDI piano keyboard to follow along with the course.</p>
          <p>At the time of writing, <a href="https://www.google.com/chrome/" target="_blank">Chrome</a> &amp; <a href="https://www.microsoft.com/en-us/edge" target="_blank">Edge</a> are the only desktop web browsers supporting MIDI input devices (<a href="https://caniuse.com/#feat=midi" target="_blank">click here for an up-to-date list of browsers supporting MIDI input devices</a>).</p>
          <p>If you have a MIDI piano keyboard, follow the steps below to set it up.</p>
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
export const pianoTheorySlideGroups = [
  new SlideGroup("Introduction & Setup", [
    new Slide("introduction", () => (
      <div>
        <div>
          <h1>Music Theory on Piano</h1>
          <h2>Section 1: Introduction &amp; Setup</h2>
          <p>This is an interactive course designed to teach you the essentials of piano and music theory in a hands-on manner.</p>
          <p>This course is designed to be viewed on tablets and computer monitors, not on mobile phones.</p>
          <p>Press the "<i className="material-icons" style={{ verticalAlign: "bottom" }}>keyboard_arrow_right</i>" on the right of this page, or press the right arrow key on your computer keyboard, to move to the next slide.</p>
        </div>
      </div>
    )),
    new Slide("setup", () => <SetupSlideView />)
  ]),

  new SlideGroup("Notes", [
    new Slide("notes-introduction", () => (
      <div>
        <h2>Section 2: Notes</h2>
        <p>This is a standard-size piano, which has a total of 88 white &amp; black keys:</p>
        <FullPiano />
        <p>When pressed, each key produces a particular <strong>note</strong> &ndash; the "highness" or "lowness" of a sound.</p>
        <p>Keys further to the left produce lower notes, and keys further to the right produce higher notes.</p>
        <p>Try pressing the keys of your MIDI piano keyboard (or your computer keyboard, or click the piano above) to hear the notes that the keys produce.</p>
      </div>
    )),

    new Slide("piano-notes-repeat", () => (
      <div>
        <p>Every note has one or more names, which we must learn in order to navigate the instrument and communicate with other musicians.</p>
        <p>Luckily, we don't need to learn 88 different names because piano keys are laid out in a repeating pattern, and every occurrence of this pattern uses the same names.</p>
        <p>The pattern is: two black keys surrounded by three white keys, then three black keys surrounded by four white keys.</p>
        <PianoKeyPatternDiagram />
      </div>
    )),

    new Slide("note-c", (slideshow) => (
      <div>
        <p>We will start by learning the names of the notes produced by the 7 white keys in the repeating pattern.</p>
        <p>The highlighted key below, to the left of the group of 2 black keys, produces a note called <strong>C</strong>.</p>
        <PianoNoteDiagram
          key="pianoNoteDiagram" // prevent the component from unmounting when changing slides
          pitch={new Pitch(PitchLetter.C, 0, 4)}
          onKeyPress={pitch => {
            if ((pitch.letter === PitchLetter.C) && (pitch.signedAccidental === 0)) {
              slideshow.tryToMoveToNextSlide();
            }
          }}
          labelWhiteKeys={true}
          labelBlackKeys={false} />
        <p>Play a <strong>C</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
      </div>
    )),
    
    new Slide("note-d", (slideshow) => (
      <div>
        <p>When moving one white key to the right, we also move forward by one letter in the English alphabet, so this key is called <strong>D</strong>.</p>
        <p>Play a <strong>D</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          key="pianoNoteDiagram" // prevent the component from unmounting when changing slides
          pitch={new Pitch(PitchLetter.D, 0, 4)}
          onKeyPress={pitch => {
            if ((pitch.letter === PitchLetter.D) && (pitch.signedAccidental === 0)) {
              slideshow.tryToMoveToNextSlide();
            }
          }}
          labelWhiteKeys={true}
          labelBlackKeys={false} />
      </div>
    )),
    
    new Slide("note-e", (slideshow) => (
      <div>
        <p>This key is called <strong>E</strong>.</p>
        <p>Play an <strong>E</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          key="pianoNoteDiagram" // prevent the component from unmounting when changing slides
          pitch={new Pitch(PitchLetter.E, 0, 4)}
          onKeyPress={pitch => {
            if ((pitch.letter === PitchLetter.E) && (pitch.signedAccidental === 0)) {
              slideshow.tryToMoveToNextSlide();
            }
          }}
          labelWhiteKeys={true}
          labelBlackKeys={false} />
      </div>
    )),
    
    new Slide("note-f", (slideshow) => (
      <div>
        <p>This key is called <strong>F</strong>.</p>
        <p>Play an <strong>F</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          key="pianoNoteDiagram" // prevent the component from unmounting when changing slides
          pitch={new Pitch(PitchLetter.F, 0, 4)}
          onKeyPress={pitch => {
            if ((pitch.letter === PitchLetter.F) && (pitch.signedAccidental === 0)) {
              slideshow.tryToMoveToNextSlide();
            }
          }}
          labelWhiteKeys={true}
          labelBlackKeys={false} />
      </div>
    )),
    
    new Slide("note-g", (slideshow) => (
      <div>
        <p>This key is called <strong>G</strong>.</p>
        <p>Play a <strong>G</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          key="pianoNoteDiagram" // prevent the component from unmounting when changing slides
          pitch={new Pitch(PitchLetter.G, 0, 4)}
          onKeyPress={pitch => {
            if ((pitch.letter === PitchLetter.G) && (pitch.signedAccidental === 0)) {
              slideshow.tryToMoveToNextSlide();
            }
          }}
          labelWhiteKeys={true}
          labelBlackKeys={false} />
      </div>
    )),
    
    new Slide("note-a", (slideshow) => (
      <div>
        <p>After "G" there is no "H" key &mdash; instead we jump backwards through the English alphabet to <strong>A</strong>.</p>
        <p>Play an <strong>A</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          key="pianoNoteDiagram" // prevent the component from unmounting when changing slides
          pitch={new Pitch(PitchLetter.A, 0, 4)}
          onKeyPress={pitch => {
            if ((pitch.letter === PitchLetter.A) && (pitch.signedAccidental === 0)) {
              slideshow.tryToMoveToNextSlide();
            }
          }}
          labelWhiteKeys={true}
          labelBlackKeys={false} />
      </div>
    )),
    
    new Slide("note-b", (slideshow) => (
      <div>
        <p>The last white key is called <strong>B</strong>.</p>
        <p>Play a <strong>B</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          key="pianoNoteDiagram" // prevent the component from unmounting when changing slides
          pitch={new Pitch(PitchLetter.B, 0, 4)}
          onKeyPress={pitch => {
            if ((pitch.letter === PitchLetter.B) && (pitch.signedAccidental === 0)) {
              slideshow.tryToMoveToNextSlide();
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
          key="pianoNoteDiagram" // prevent the component from unmounting when changing slides
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
    
    new Slide("note-c-sharp", (slideshow) => (
      <div>
        <p>Now let's learn the names of the 5 black piano keys in this section of the piano.</p>
        <p>The key highlighted below, like all black keys, has multiple names. One name for it is <strong>C♯</strong> (pronounced "C sharp").</p>
        <p>The '♯' ("sharp") symbol means the pitch is raised by one key, so C♯ means "the key to the right of C".</p>
        <p>Play a <strong>C♯</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          key="pianoNoteDiagram" // prevent the component from unmounting when changing slides
          pitch={new Pitch(PitchLetter.C, 1, 4)}
          onKeyPress={pitch => {
            if (pitch.midiNumberNoOctave === (new Pitch(PitchLetter.C, 1, 4)).midiNumberNoOctave) {
              slideshow.tryToMoveToNextSlide();
            }
          }}
          labelWhiteKeys={true}
          labelBlackKeys={true}
          useSharps={true}
          showLetterPredicate={p => (p.midiNumber <= (new Pitch(PitchLetter.C, 1, 4)).midiNumber)} />
      </div>
    )),
    
    new Slide("note-d-flat", (slideshow) => (
      <div>
        <p>Another name for the same key is <strong>D♭</strong> (pronounced "D flat").</p>
        <p>The '♭' ("flat") symbol means the pitch is lowered by one key, so D♭ means "the key to the left of D".</p>
        <p>Play a <strong>D♭</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          key="pianoNoteDiagram" // prevent the component from unmounting when changing slides
          pitch={new Pitch(PitchLetter.C, 1, 4)}
          onKeyPress={pitch => {
            if (pitch.midiNumberNoOctave === (new Pitch(PitchLetter.C, 1, 4)).midiNumberNoOctave) {
              slideshow.tryToMoveToNextSlide();
            }
          }}
          labelWhiteKeys={true}
          labelBlackKeys={true}
          useSharps={false}
          showLetterPredicate={p => p.isEnharmonic(new Pitch(PitchLetter.D, 0, 4)) || p.isEnharmonic(new Pitch(PitchLetter.D, -1, 4))} />
      </div>
    )),
    
    new Slide("note-d-sharp-e-flat", (slideshow) => (
      <div>
        <p>This key is called <strong>D♯</strong>, or <strong>E♭</strong>.</p>
        <p>Play a <strong>D♯/E♭</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          key="pianoNoteDiagram" // prevent the component from unmounting when changing slides
          pitch={new Pitch(PitchLetter.D, 1, 4)}
          onKeyPress={pitch => {
            if (pitch.midiNumberNoOctave === (new Pitch(PitchLetter.D, 1, 4)).midiNumberNoOctave) {
              slideshow.tryToMoveToNextSlide();
            }
          }}
          labelWhiteKeys={false}
          labelBlackKeys={true} />
      </div>
    )),

    new Slide("note-f-sharp-g-flat", (slideshow) => (
      <div>
        <p>This key is called <strong>F♯</strong>, or <strong>G♭</strong>.</p>
        <p>Play a <strong>F♯/G♭</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          key="pianoNoteDiagram" // prevent the component from unmounting when changing slides
          pitch={new Pitch(PitchLetter.F, 1, 4)}
            onKeyPress={pitch => {
              if (pitch.midiNumberNoOctave === (new Pitch(PitchLetter.F, 1, 4)).midiNumberNoOctave) {
                slideshow.tryToMoveToNextSlide();
              }
            }}
          labelWhiteKeys={false}
          labelBlackKeys={true} />
      </div>
    )),

    new Slide("note-g-sharp-a-flat", (slideshow) => (
      <div>
        <p>This key is called <strong>G♯</strong>, or <strong>A♭</strong>.</p>
        <p>Play a <strong>G♯/A♭</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          key="pianoNoteDiagram" // prevent the component from unmounting when changing slides
          pitch={new Pitch(PitchLetter.G, 1, 4)}
          onKeyPress={pitch => {
            if (pitch.midiNumberNoOctave === (new Pitch(PitchLetter.G, 1, 4)).midiNumberNoOctave) {
              slideshow.tryToMoveToNextSlide();
            }
          }}
          labelWhiteKeys={false}
          labelBlackKeys={true} />
      </div>
    )),

    new Slide("note-a-sharp-b-flat", (slideshow) => (
      <div>
        <p>The last black key is called <strong>A♯</strong>, or <strong>B♭</strong>.</p>
        <p>Play a <strong>A♯/B♭</strong> on your MIDI keyboard (or on-screen) to continue to the next slide.</p>
        <PianoNoteDiagram
          key="pianoNoteDiagram" // prevent the component from unmounting when changing slides
          pitch={new Pitch(PitchLetter.B, -1, 4)}
          onKeyPress={pitch => {
            if (pitch.midiNumberNoOctave === (new Pitch(PitchLetter.B, -1, 4)).midiNumberNoOctave) {
              slideshow.tryToMoveToNextSlide();
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
          key="pianoNoteDiagram" // prevent the component from unmounting when changing slides
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
        <p>You have now learned the names of all the notes in the repeating pattern of piano keys!</p>
        <p>
          <PianoNotesDiagram
            lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
            highestPitch={new Pitch(PitchLetter.B, 0, 4)}
            maxWidth={maxOneOctavePianoWidth / 2}
            labelWhiteKeys={true} />
        </p>
        <p>And here are all the note names on an 88 key piano keyboard:</p>
        <PianoNotesDiagram
          lowestPitch={fullPianoLowestPitch}
          highestPitch={fullPianoHighestPitch}
          maxWidth={maxPianoWidth} />
      </div>
    )),
    
    new Slide("notes-summary", () => (
      <div>
        <p>Study this note names, then move to the next slide to test your knowledge with a quiz.</p>
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
        <p>
          <PianoScaleDronePlayer
            scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))}
            octaveCount={2}
            maxWidth={maxOneOctavePianoWidth} />
        </p>
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
        <p>
          <PianoScaleMajorRelativeFormulaDiagram
            scale={new Scale(ScaleType.Aeolian, new Pitch(PitchLetter.C, 0, 4))}
            octaveCount={2}
            maxWidth={maxTwoOctavePianoWidth} />
        </p>
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
        <p>For example, here is a <strong>C Major</strong> chord, which consists of the three notes <strong>C, E, G</strong>, and has a root note of <strong>C</strong>.</p>
        <ChordView
          chord={new Chord(ChordType.Major, new Pitch(PitchLetter.C, 0, 4))}
          showChordInfoText={false}
          showChordFormulaOnPiano={false}
          maxWidth={maxTwoOctavePianoWidth} />
      </div>
    )),

    new Slide("chord-note-order-repeats", () => (
      <div>
        <p>It is important to note that you are free to repeat chord notes as many times as you like and play chord notes in any order.</p>
        <p>The following is still considered a <strong>C Major</strong> chord because it consists of the notes C, E, G:</p>
        <ChordDiagram
          pitches={[new Pitch(PitchLetter.E, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.C, 0, 5), new Pitch(PitchLetter.G, 0, 5),]}
          scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))}
          showScaleDegreeNumbers={false}
          maxWidth={maxTwoOctavePianoWidth} />
      </div>
    )),
    
    new Slide("tertial-chords", () => (
      <div>
        <LimitedWidthContentContainer maxWidth={1000}>
          <p>In practice, most chords are built with <strong>thirds</strong>.</p>
          <p>A <strong>third</strong> in this context is an <strong>interval</strong> (a distance between two notes) that spans three letters.</p>
          <p>A chord is built with thirds if, when you list the notes of the chord starting with the root note and proceeding in left-to-right order on the piano keyboard, each pair of adjacent notes is a third apart.</p>
          <p>For example, the <strong>C Major chord</strong> we've seen is built with thirds: C &amp; E are a third apart (they span 3 letters &mdash; C, D, E), and E &amp; G are a third apart (they span 3 letters &mdash; E, F, G)</p>
          <ThirdsDiagram />
        </LimitedWidthContentContainer>
      </div>
    )),

    new Slide("chord-major-relative-formula", () => (
      <div>
        <LimitedWidthContentContainer>
          <p>Like scales, chords have major-scale-relative formulas.</p>
          <p>For example, the major-scale-relative formula for all <strong>Major chords</strong> is <strong>1 3 5</strong>, meaning major chords consist of the 1st, 3rd, and 5th notes of the major scale associated with the root note of the chord.</p>
          <p>So, C Major chords consist the 1st, 3rd, and 5th notes of the C Major scale: C, E, G.</p>
          
          <p style={{fontSize: "1.25em", fontWeight: "bold", textDecoration: "underline", textAlign: "center"}}>C Major</p>
          <ChordView
            chord={new Chord(ChordType.Major, new Pitch(PitchLetter.C, 0, 4))}
            showChordInfoText={false}
            showChordFormulaOnPiano={true} />
        </LimitedWidthContentContainer>
      </div>
    )),
    
    new Slide("minor-chord-formula", () => (
      <div>
        <LimitedWidthContentContainer>
          <p>Another important type of chord is the <strong>Minor chord</strong>.</p>

          <p>All <strong>Minor chords</strong> have the major-scale-relative formula: <strong>1 3♭ 5</strong></p>
          <p><p>So, C Minor chords, for example, consist the 1st, flattened 3rd, and 5th notes of the C Major scale: C, E♭, G.</p></p>
          <p style={{fontSize: "1.25em", fontWeight: "bold", textDecoration: "underline", textAlign: "center"}}>C Minor</p>
          <ChordView
            chord={new Chord(ChordType.Minor, new Pitch(PitchLetter.C, 0, 4))}
            showChordInfoText={false}
            showChordFormulaOnPiano={true} />
        </LimitedWidthContentContainer>
      </div>
    )),

    new Slide("diminished-chord-formula", () => (
      <div>
        <LimitedWidthContentContainer>
          <p>Another important type of chord is the <strong>Diminished chord</strong>.</p>

          <p>All <strong>Diminished chords</strong> have the major-scale-relative formula: <strong>1 3♭ 5♭</strong></p>
          <p style={{fontSize: "1.25em", fontWeight: "bold", textDecoration: "underline", textAlign: "center"}}>C Diminished</p>
          <ChordView
            chord={new Chord(ChordType.Diminished, new Pitch(PitchLetter.C, 0, 4))}
            showChordInfoText={false}
            showChordFormulaOnPiano={true} />

        </LimitedWidthContentContainer>
      </div>
    )),
    
    new Slide("dominant-7-chord-formula", () => (
      <div>
        <LimitedWidthContentContainer>
          <p>One last important type of chord is the <strong>Dominant 7th chord</strong> (also simply called the <strong>7th chord</strong>).</p>

          <p>All <strong>Dominant 7th chords</strong> have the major-scale-relative formula: <strong>1 3 5 7♭</strong></p>
          <p style={{fontSize: "1.25em", fontWeight: "bold", textDecoration: "underline", textAlign: "center"}}>C Dominant 7</p>
          <ChordView
            chord={new Chord(ChordType.Dom7, new Pitch(PitchLetter.C, 0, 4))}
            showChordInfoText={false}
            showChordFormulaOnPiano={true} />

        </LimitedWidthContentContainer>
      </div>
    )),
    
    new Slide("chords-introduction-review", () => (
      <div>
        <LimitedWidthContentContainer maxWidth={1000}>
          <p>Review material below, then move to the next slide to test your knowledge of chords with a quiz.</p>
          <br />
          <p>Chords are sets of <strong>two or more notes played simultaneously</strong>.</p>
          <p>You are free to repeat chord notes as many times as you like, and play chord notes in any order, when playing a chord.</p>
          <p>In practice, most chords are built with <strong>thirds</strong>.</p>
          <p>An <strong>interval</strong> is the distance between two notes.</p>
          <p>A <strong>third</strong> is an interval that spans three letters.</p>
          <p>When we say that a chord is built in thirds, we only care that chord notes are thirds apart when <strong>starting from the root note</strong> and <strong>listing the remaining notes in left-to-right order</strong> on the piano keyboard.</p>
          <p>The major-scale-relative formula for <strong>major chords</strong> is: <strong>1 3 5</strong></p>
          <p>The major-scale-relative formula for <strong>minor chords</strong> is: <strong>1 3♭ 5</strong></p>
          <p>The major-scale-relative formula for <strong>diminished chords</strong> is: <strong>1 3♭ 5♭</strong></p>
          <p>The major-scale-relative formula for <strong>dominant 7th</strong> chords is: <strong>1 3 5 7♭</strong></p>
        </LimitedWidthContentContainer>
      </div>
    )),
    
    new Slide("chords-introduction-quiz", () => (
      <LimitedWidthContentContainer>
        <div style={{ marginTop: "1em" }}>
          {createStudyFlashCardSetComponent(
            ChordsIntroQuiz.flashCardSet,
            /*isEmbedded*/ false,
            /*hideMoreInfoUri*/ true,
            /*title*/ undefined,
            /*style*/ undefined,
            /*enableSettings*/ undefined,
            /*showRelatedExercises*/ false)}
        </div>
      </LimitedWidthContentContainer>
    )),

    new Slide("diatonic-chords", () => (
      <div>
        <LimitedWidthContentContainer maxWidth={1000}>
          <p>Generally, in a section of music, musicians will restrict themselves to the chords consisting solely of notes from a particular scale &mdash; <strong>diatonic chords</strong>.</p>
          <p>For example, let's take the C Major scale, which consists of the notes: C, D, E, F, G, A, B. Any combination of two or more of these notes is a <strong>diatonic chord</strong> of the C Major scale.</p>
          <p>One example of a diatonic triad in the C Major scale is <strong>G Major</strong>, which has a root note of <strong>G</strong> (the 5th note in the C Major scale) and consists of the notes <strong>G, B, D</strong>, all of which are in the C Major scale:</p>
          <p>
            <ChordView
              chord={new Chord(ChordType.Major, new Pitch(PitchLetter.G, 0, 4))}
              showChordInfoText={false}
              scale={new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4))}
              showScaleDegreesOnPiano={true} />
          </p>
        </LimitedWidthContentContainer>
      </div>
    )),

    new Slide("c-major-diatonic-triad-1", () => (
      <div>
        <p>Earlier, we said that most chords are built with thirds, and diatonic chords are no exception.</p>
        <p>Let's take a look at all the 3-note diatonic chords (chords with 3 distinct notes are also called <strong>triads</strong>) built with thirds in the C Major scale.</p>
        <p>The C Major scale consists of 7 notes (C, D, E, F, G, A, B) and has 7 diatonic triads built with thirds &mdash; one triad for each note in the scale.</p>
        <p>The 1st diatonic triad in the C Major scale built with thirds is <strong>C Major</strong>, which has a root note of <strong>C</strong> and consists of the notes <strong>C, E, G</strong>:</p>
        <ChordView
          chord={new Chord(ChordType.Major, new Pitch(PitchLetter.C, 0, 4))}
          showChordInfoText={false}
          scale={new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4))}
          showScaleDegreesOnPiano={true} />
      </div>
    )),
    new Slide("c-major-diatonic-triad-2", () => (
      <div>
        <p>The 2nd diatonic triad in the C Major scale built with thirds is <strong>D Minor</strong>, which has a root note of <strong>D</strong> and consists of the notes <strong>D, F, A</strong>:</p>
        <ChordView
          chord={new Chord(ChordType.Minor, new Pitch(PitchLetter.D, 0, 4))}
          showChordInfoText={false}
          scale={new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4))}
          showScaleDegreesOnPiano={true} />
      </div>
    )),
    new Slide("c-major-diatonic-triad-3", () => (
      <div>
        <p>The 3rd diatonic triad in the C Major scale built with thirds is <strong>E Minor</strong>, which has a root note of <strong>E</strong> and consists of the notes <strong>E, G, B</strong>:</p>
        <ChordView
          chord={new Chord(ChordType.Minor, new Pitch(PitchLetter.E, 0, 4))}
          showChordInfoText={false}
          scale={new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4))}
          showScaleDegreesOnPiano={true} />
      </div>
    )),
    new Slide("c-major-diatonic-triad-4", () => (
      <div>
        <p>The 4th diatonic triad in the C Major scale built with thirds is <strong>F Major</strong>, which has a root note of <strong>F</strong> and consists of the notes <strong>F, A, C</strong>:</p>
        <ChordView
          chord={new Chord(ChordType.Major, new Pitch(PitchLetter.F, 0, 4))}
          showChordInfoText={false}
          scale={new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4))}
          showScaleDegreesOnPiano={true} />
      </div>
    )),
    new Slide("c-major-diatonic-triad-5", () => (
      <div>
        <p>The 5th diatonic triad in the C Major scale built with thirds is <strong>G Major</strong>, which has a root note of <strong>G</strong> and consists of the notes <strong>G, B, D</strong>:</p>
        <ChordView
          chord={new Chord(ChordType.Major, new Pitch(PitchLetter.G, 0, 4))}
          showChordInfoText={false}
          scale={new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4))}
          showScaleDegreesOnPiano={true} />
      </div>
    )),
    new Slide("c-major-diatonic-triad-6", () => (
      <div>
        <p>The 6th diatonic triad in the C Major scale built with thirds is <strong>A Minor</strong>, which has a root note of <strong>A</strong> and consists of the notes <strong>A, C, E</strong>:</p>
        <ChordView
          chord={new Chord(ChordType.Minor, new Pitch(PitchLetter.A, 0, 4))}
          showChordInfoText={false}
          scale={new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4))}
          showScaleDegreesOnPiano={true} />
      </div>
    )),
    new Slide("c-major-diatonic-triad-7", () => (
      <div>
        <p>The 7th, and last, diatonic triad in the C Major scale built with thirds is <strong>B Diminished</strong>, which has a root note of <strong>B</strong> and consists of the notes <strong>B, D, F</strong>:</p>
        <ChordView
          chord={new Chord(ChordType.Diminished, new Pitch(PitchLetter.B, 0, 4))}
          showChordInfoText={false}
          scale={new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4))}
          showScaleDegreesOnPiano={true} />
      </div>
    )),

    new Slide("major-diatonic-triad-types", () => (
      <div>
        <p>All major scales have the same types of triads built with thirds associated with each note in the scale, so you can easily figure out these triads for any major scale:</p>
        <p>1st scale note &mdash; Major Triad</p>
        <p>2nd scale note &mdash; Minor Triad</p>
        <p>3rd scale note &mdash; Minor Triad</p>
        <p>4th scale note &mdash; Major Triad</p>
        <p>5th scale note &mdash; Major Triad</p>
        <p>6th scale note &mdash; Minor Triad</p>
        <p>7th scale note &mdash; Diminished Triad</p>
      </div>
    )),
    
    new Slide("diatonic-chords-review", () => (
      <div>
        <p>Review material below, then move to the next slide to test your knowledge of diatonic chords with a quiz.</p>
        <br />
        <p><strong>Diatonic chords</strong> are chords consisting solely of notes from a particular scale.</p>
        <p><strong>Triads</strong> are chords with 3 distinct notes.</p>
        <br />
        <p>The 1st diatonic triad in the C Major scale built with thirds is <strong>C Major</strong>, which has a root note of <strong>C</strong> and consists of the notes <strong>C, E, G</strong>.</p>
        <p>The 2nd diatonic triad in the C Major scale built with thirds is <strong>D Minor</strong>, which has a root note of <strong>D</strong> and consists of the notes <strong>D, F, A</strong>.</p>
        <p>The 3rd diatonic triad in the C Major scale built with thirds is <strong>E Minor</strong>, which has a root note of <strong>E</strong> and consists of the notes <strong>E, G, B</strong>.</p>
        <p>The 4th diatonic triad in the C Major scale built with thirds is <strong>F Major</strong>, which has a root note of <strong>F</strong> and consists of the notes <strong>F, A, C</strong>.</p>
        <p>The 5th diatonic triad in the C Major scale built with thirds is <strong>G Major</strong>, which has a root note of <strong>G</strong> and consists of the notes <strong>G, B, D</strong>.</p>
        <p>The 6th diatonic triad in the C Major scale built with thirds is <strong>A Minor</strong>, which has a root note of <strong>A</strong> and consists of the notes <strong>A, C, E</strong>.</p>
        <p>The 7th, and last, diatonic triad in the C Major scale built with thirds is <strong>B Diminished</strong>, which has a root note of <strong>B</strong> and consists of the notes <strong>B, D, F</strong>.</p>
        <br />
        <p>All major scales have the same types of triads built with thirds associated with each note in the scale:</p>
        <p>1st scale note &mdash; Major Triad</p>
        <p>2nd scale note &mdash; Minor Triad</p>
        <p>3rd scale note &mdash; Minor Triad</p>
        <p>4th scale note &mdash; Major Triad</p>
        <p>5th scale note &mdash; Major Triad</p>
        <p>6th scale note &mdash; Minor Triad</p>
        <p>7th scale note &mdash; Diminished Triad</p>
      </div>
    )),
    
    new Slide("diatonic-chords-quiz", () => (
      <LimitedWidthContentContainer>
        <div style={{ marginTop: "1em" }}>
          {createStudyFlashCardSetComponent(
            DiatonicChordsQuiz.flashCardSet,
            /*isEmbedded*/ false,
            /*hideMoreInfoUri*/ true,
            /*title*/ undefined,
            /*style*/ undefined,
            /*enableSettings*/ undefined,
            /*showRelatedExercises*/ false)}
        </div>
      </LimitedWidthContentContainer>
    )),
    
    /*new Slide("root-position", () => (
      <div>
        <p>The note you choose to make the lowest note in the chord (the bass) determines which <strong>inversion</strong> the chord is in.</p>
        <p>For example, a C Major chord played with a C (the root note) in the bass is said to be in <strong>root position</strong>:</p>
        <ChordDiagram
          pitches={[new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.C, 0, 5), new Pitch(PitchLetter.E, 0, 5),]}
          scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))}
          maxWidth={maxTwoOctavePianoWidth} />
      </div>
    )),
    new Slide("1st-inversion", () => (
      <div>
        <p>A C Major chord played with an E (the 2nd chord note up from the root note) in the bass is said to be in <strong>1st inversion</strong>:</p>
        <ChordDiagram
          pitches={[new Pitch(PitchLetter.E, 0, 4), new Pitch(PitchLetter.C, 0, 5), new Pitch(PitchLetter.E, 0, 5), new Pitch(PitchLetter.G, 0, 5)]}
          scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))}
          maxWidth={maxTwoOctavePianoWidth} />
      </div>
    )),
    new Slide("2nd-inversion", () => (
      <div>
        <p>A C Major chord played with an G (the 3rd chord note up from the root note) in the bass is said to be in <strong>2nd inversion</strong>:</p>
        <ChordDiagram
          pitches={[new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.C, 0, 5), new Pitch(PitchLetter.E, 0, 5), new Pitch(PitchLetter.G, 0, 5)]}
          scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))}
          maxWidth={maxTwoOctavePianoWidth} />
        <p>And so on for chords with more than 3 notes...</p>
      </div>
    )),
    new Slide("arpeggio", () => (
      <div>
        <p>You are also free to play the notes of a chord separately instead of simultaneously.</p>
        <p>In this case, we say that you are playing an <strong>arpeggio</strong>, or an <strong>arpeggiated chord</strong>.</p>
        <p>Listen to the diagram below to hear a C Major arpeggio.</p>
        <ChordDiagram
          pitches={[new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.E, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.C, 0, 5), new Pitch(PitchLetter.E, 0, 5), new Pitch(PitchLetter.G, 0, 5)]}
          scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))}
          isArpeggio={true}
          maxWidth={maxTwoOctavePianoWidth} />
      </div>
    )),

    new Slide("chords-review-3", () => (
      <div>
        <p>Review material below, then move to the next slide to test your knowledge of chords with a quiz.</p>
        <br />
        <p>The note you choose to make the <strong>lowest note in the chord (the bass)</strong> determines which <strong>inversion</strong> the chord is in.</p>
        <p>A chord played with the <strong>root note</strong> in the bass is said to be in <strong>root position</strong>.</p>
        <p>A chord played with the <strong>3rd</strong> in the bass is said to be in <strong>1st inversion</strong>.</p>
        <p>A chord played with the <strong>5th</strong> in the bass is said to be in <strong>2nd inversion</strong>.</p>
        <p><strong>Arpeggios</strong> are sequences of chord notes played separately instead of simultaneously.</p>
        <p>Chords notes are sometimes referred to by <strong>the number of the note in the scale they come from</strong> (ex: "E" in C Major may be called the 3rd).</p>
      </div>
    )),

    new Slide("chords-quiz-3", () => (
      <div>
        <p>QUIZ</p>
      </div>
    )),*/
  ]),

  new SlideGroup("Chord Progressions", [
    new Slide("chord-progressions-introduction", () => (
      <div>
        <h2>Section 5: Chord Progressions</h2>
        <p><strong>Chord progressions</strong> are sequences of chords.</p>
        <p>Below is an example of a chord progression consisting of the chords: D Minor, G Dominant 7 (abbreviated as "G7"), C Major</p>
        <ChordProgressionPlayer
          chordsPitches={[
            [new Pitch(PitchLetter.D, 0, 4), new Pitch(PitchLetter.F, 0, 4), new Pitch(PitchLetter.A, 0, 4)],
            [new Pitch(PitchLetter.D, 0, 4), new Pitch(PitchLetter.F, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.B, 0, 4)],
            [new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.E, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.C, 0, 5)]
          ]}
          chords={[
            new Chord(ChordType.Minor, new Pitch(PitchLetter.D, 0, 4)),
            new Chord(ChordType.Dom7, new Pitch(PitchLetter.G, 0, 4)),
            new Chord(ChordType.Major, new Pitch(PitchLetter.C, 0, 4))
          ]}
          scale={new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4))}
          chordScaleDegreeNumbers={[2, 5, 1]}
          showRomanNumerals={false}
          maxWidth={maxTwoOctavePianoWidth} />
      </div>
    )),
    new Slide("chord-progressions-diatonic", () => (
      <div>
        <p>Chord progressions are generally built with <strong>diatonic chords</strong> (chords build solely with notes in a particular scale).</p>
        <p>The chord progression we just saw, for example (<strong>D Minor</strong>, <strong>G7</strong>, <strong>C Major</strong>), consists solely of chords diatonic to the <strong>C Major scale</strong>.</p>
        <p>In diatonic chord progressions, each chord has a root note associated with a <strong>scale note number</strong>. Using the chord progression above as an example:</p>
        <p><strong>D Minor</strong> has a root note of <strong>D</strong>, which is the <strong>2nd</strong> note in the C Major scale.</p>
        <p><strong>G7</strong> has a root note of <strong>G</strong>, which is the <strong>5th</strong> note in the C Major scale.</p>
        <p><strong>C Major</strong> has a root note of <strong>C</strong>, which is the <strong>1st</strong> note in the C Major scale.</p>
        <p>We can take advantage of this and represent diatonic chord progressions in a compact, scale-independent way with <strong>roman numeral notation</strong>.</p>
      </div>
    )),
    new Slide("roman-numeral-notation", () => (
      <div>
        <p>In <strong>roman numeral notation</strong>, the chord progression (<strong>D Minor</strong>, <strong>G7</strong>, <strong>C Major</strong>) in the <strong>C Major scale</strong> would be written as: <strong>ii - V7 - I</strong>:</p>
        <p><strong>ii</strong> is the roman numeral for <strong>2</strong>, meaning it represents the diatonic chord with the <strong>2nd</strong> scale note (<strong>D</strong> in this example) as a root note.</p>
        <p><strong>ii</strong> is also lower-case, which signifies that the chord is a <strong>minor</strong> chord.</p>
        <p>The <strong>V</strong> in <strong>V7</strong> represents the diatonic chord with the <strong>5th</strong> scale note (<strong>G</strong> in this example) as a root note.</p>
        <p><strong>V</strong> is upper-case to signify that the chord is based on a <strong>major</strong> chord (dominant 7th chords are major triads with an added note).</p>
        <p>And the <strong>7</strong> in <strong>V7</strong> signifies that the chord is a <strong>dominant 7th chord</strong>.</p>
        <p>Lastly, <strong>I</strong> signifies a major chord with the <strong>1st</strong> scale note (<strong>C</strong> in this example) as a root note.</p>
        <p>So, writing "<strong>ii - V7 - I</strong>" in C Major is equivalent to writing "<strong>D Minor, G7, C Major</strong>."</p>
      </div>
    )),
    new Slide("roman-numeral-notation-key-independent", () => (
      <div>
        <p>Using roman numeral notation is not only shorter than writing out entire chord names, it also allows us to understand and write diatonic chord progressions <strong>independent of the underlying scale</strong>:</p>
        <p>To play a <strong>ii - V7 - I</strong> chord progression in another scale &mdash; <strong>D Major</strong> for example &mdash; we just translate roman numerals into notes in the other scale:</p>
        <p><strong>ii</strong> in the D Major scale is <strong>E Minor</strong>, <strong>V7</strong> in the D Major scale is <strong>A7</strong>, and <strong>I</strong> in the D Major scale is <strong>D Major</strong>.</p>
        <p>Roman numeral chord progressions should have a similar feel regardless of which scale you play them in, as you'll hear in the diagram below:</p>
        <ChordProgressionPlayer
          chordsPitches={[
            [new Pitch(PitchLetter.E, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.B, 0, 4)],
            [new Pitch(PitchLetter.E, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.A, 0, 4), new Pitch(PitchLetter.C, 1, 5)],
            [new Pitch(PitchLetter.D, 0, 4), new Pitch(PitchLetter.F, 1, 4), new Pitch(PitchLetter.A, 0, 4), new Pitch(PitchLetter.D, 0, 5)]
          ]}
          chords={[
            new Chord(ChordType.Minor, new Pitch(PitchLetter.E, 0, 4)),
            new Chord(ChordType.Dom7, new Pitch(PitchLetter.A, 0, 4)),
            new Chord(ChordType.Major, new Pitch(PitchLetter.D, 0, 4))
          ]}
          scale={new Scale(ScaleType.Major, new Pitch(PitchLetter.D, 0, 4))}
          chordScaleDegreeNumbers={[2, 5, 1]}
          showRomanNumerals={true}
          maxWidth={maxTwoOctavePianoWidth} />
      </div>
    )),
    new Slide("descending-fifth-progression", () => (
      <div>
        <p>One of the strongest sounding, and most common, chord progressions is the <strong>descending fifth</strong>.</p>
        <p>This can take many forms &mdash; some examples being: <strong>V7 - I</strong>, <strong>ii - V</strong>, <strong>iii - vi</strong>, and more.</p>
        <p>What all these have in common is: <strong>the 2nd chord is a "fifth" below the first chord</strong>:</p>
        <p>In the <strong>C Major scale</strong>, for example, <strong>V7 - I</strong> is <strong>G7 - C Major</strong>, and <strong>C</strong> is a fifth below <strong>G</strong> (they span five letters: C, D, E, F, G)</p>
        <p>In the <strong>C Major scale</strong>, for example, <strong>ii - V</strong> is <strong>D Minor - G Major</strong>, and <strong>G</strong> is a fifth below <strong>D</strong> (they span five letters: G, A, B, C, D)</p>
        <p>In the <strong>C Major scale</strong>, for example, <strong>iii - vi</strong> is <strong>E Minor - A Minor</strong>, and <strong>A</strong> is a fifth below <strong>E</strong> (they span five letters: A, B, C, D, E)</p>
        <br />
        <p>The <strong>V7 - I</strong> chord progression in particular is one of the strongest sounding chord progressions there is, and you often hear it at the end of pieces of classical music.</p>
        <ChordProgressionPlayer
          chordsPitches={[
            [new Pitch(PitchLetter.G, 0, 3), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.D, 0, 5), new Pitch(PitchLetter.B, 0, 5)],
            [new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.E, 0, 5), new Pitch(PitchLetter.C, 0, 6)]
          ]}
          chords={[
            new Chord(ChordType.Dom7, new Pitch(PitchLetter.G, 0, 4)),
            new Chord(ChordType.Major, new Pitch(PitchLetter.C, 0, 4))
          ]}
          scale={new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4))}
          chordScaleDegreeNumbers={[5, 1]}
          lowestPitch={new Pitch(PitchLetter.C, 0, 3)}
          highestPitch={new Pitch(PitchLetter.B, 0, 6)}
          octaveCount={4}
          showRomanNumerals={true}
          maxWidth={maxTwoOctavePianoWidth} />
      </div>
    )),
    new Slide("circle-progression", () => (
      <div>
        <LimitedWidthContentContainer>
          <p>You can repeatedly chain together descending fifth progressions to create a <strong>circle progression</strong>, which progresses through all 7 diatonic chords of a scale:</p>
          <p>Starting with <strong>I</strong> in a major scale and chaining together descending fifth progressions, we get: <strong>I - IV - vii° - iii - vi - ii - V - I</strong>:</p>
        <ChordProgressionPlayer
          chordsPitches={[
            [new Pitch(PitchLetter.C, 0, 3), new Pitch(PitchLetter.G, 0, 3), new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.E, 0, 4)],
            [new Pitch(PitchLetter.F, 0, 2), new Pitch(PitchLetter.A, 0, 3), new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.F, 0, 4)],
            [new Pitch(PitchLetter.B, 0, 2), new Pitch(PitchLetter.F, 0, 3), new Pitch(PitchLetter.B, 0, 3), new Pitch(PitchLetter.D, 0, 4)],
            [new Pitch(PitchLetter.E, 0, 2), new Pitch(PitchLetter.G, 0, 3), new Pitch(PitchLetter.B, 0, 3), new Pitch(PitchLetter.E, 0, 4)],
            [new Pitch(PitchLetter.A, 0, 2), new Pitch(PitchLetter.E, 0, 3), new Pitch(PitchLetter.A, 0, 3), new Pitch(PitchLetter.C, 0, 4)],
            [new Pitch(PitchLetter.D, 0, 2), new Pitch(PitchLetter.F, 0, 3), new Pitch(PitchLetter.A, 0, 3), new Pitch(PitchLetter.D, 0, 4)],
            [new Pitch(PitchLetter.G, 0, 2), new Pitch(PitchLetter.D, 0, 3), new Pitch(PitchLetter.G, 0, 3), new Pitch(PitchLetter.B, 0, 3)],
            [new Pitch(PitchLetter.C, 0, 2), new Pitch(PitchLetter.E, 0, 3), new Pitch(PitchLetter.G, 0, 3), new Pitch(PitchLetter.C, 0, 4)],
          ]}
          chords={[
            new Chord(ChordType.Major, new Pitch(PitchLetter.C, 0, 3)),
            new Chord(ChordType.Major, new Pitch(PitchLetter.F, 0, 2)),
            new Chord(ChordType.Diminished, new Pitch(PitchLetter.B, 0, 2)),
            new Chord(ChordType.Minor, new Pitch(PitchLetter.E, 0, 2)),
            new Chord(ChordType.Minor, new Pitch(PitchLetter.A, 0, 2)),
            new Chord(ChordType.Minor, new Pitch(PitchLetter.D, 0, 2)),
            new Chord(ChordType.Major, new Pitch(PitchLetter.G, 0, 2)),
            new Chord(ChordType.Major, new Pitch(PitchLetter.C, 0, 2)),
          ]}
          scale={new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4))}
          chordScaleDegreeNumbers={[1, 4, 7, 3, 6, 2, 5, 1]}
          lowestPitch={new Pitch(PitchLetter.C, 0, 2)}
          highestPitch={new Pitch(PitchLetter.B, 0, 5)}
          octaveCount={4}
          showRomanNumerals={true}
          maxWidth={maxTwoOctavePianoWidth} />
          <NoteText>Lower-case roman numerals with a <strong>°</strong> symbol means the chord is a <strong>diminished</strong> chord.</NoteText>
        </LimitedWidthContentContainer>
      </div>
    )),
    new Slide("voice-leading", () => (
      <div>
        <LimitedWidthContentContainer>
          <p>It is important to use good <strong>voice leading</strong> when playing chord progressions.</p>
          <p><strong>Voice leading</strong> is the arrangement of chord notes in a progression to create smooth transitions between chords.</p>
          <p>The most important rule of voice leading is to use the smallest possible movements when transitioning from one chord from the next.</p>

          <p>Here is an example of "bad" voice leading in a ii - V7 - I progression, which makes big jumps between each chord:</p>
          <ChordProgressionPlayer
            chordsPitches={[
              [new Pitch(PitchLetter.D, 0, 5), new Pitch(PitchLetter.F, 0, 5), new Pitch(PitchLetter.A, 0, 5)],
              [new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.B, 0, 4), new Pitch(PitchLetter.D, 0, 5), new Pitch(PitchLetter.F, 0, 5)],
              [new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.E, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.C, 0, 5)]
            ]}
            chords={[
              new Chord(ChordType.Minor, new Pitch(PitchLetter.D, 0, 4)),
              new Chord(ChordType.Dom7, new Pitch(PitchLetter.G, 0, 4)),
              new Chord(ChordType.Major, new Pitch(PitchLetter.C, 0, 4))
            ]}
            scale={new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4))}
            chordScaleDegreeNumbers={[2, 5, 1]}
            maxWidth={maxTwoOctavePianoWidth} />

          <p>And here is an example of good voice leading:</p>
          <ChordProgressionPlayer
            chordsPitches={[
              [new Pitch(PitchLetter.D, 0, 4), new Pitch(PitchLetter.F, 0, 4), new Pitch(PitchLetter.A, 0, 4)],
              [new Pitch(PitchLetter.D, 0, 4), new Pitch(PitchLetter.F, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.B, 0, 4)],
              [new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.E, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.C, 0, 5)]
            ]}
            chords={[
              new Chord(ChordType.Minor, new Pitch(PitchLetter.D, 0, 4)),
              new Chord(ChordType.Dom7, new Pitch(PitchLetter.G, 0, 4)),
              new Chord(ChordType.Major, new Pitch(PitchLetter.C, 0, 4))
            ]}
            scale={new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4))}
            chordScaleDegreeNumbers={[2, 5, 1]}
            maxWidth={maxTwoOctavePianoWidth} />
        </LimitedWidthContentContainer>
      </div>
    )),
    new Slide("chord-substitution", () => (
      <div>
        <LimitedWidthContentContainer>
          <p>One common technique used to spice up chord progressions is <strong>chord substitution</strong>.</p>
          <p><strong>Chord substitution</strong> is replacing one chord with another that sounds similar or has a similar "feel" in the progression.</p>
          <p>One way to find chords that sound similar to another chord is looking for chords which share many of the same notes.</p>
          <p>For example, in C Major, the <strong>ii</strong> chord (D minor - D F A) and the <strong>IV</strong> chord (F Major - F A C) share two notes in common (F and A), so they have a similar sound and work as substitutes for each other in chord progressions.</p>

          <p>So, we can take a ii - V - I progression:</p>
          <ChordProgressionPlayer
            chordsPitches={[
              [new Pitch(PitchLetter.D, 0, 4), new Pitch(PitchLetter.F, 0, 4), new Pitch(PitchLetter.A, 0, 4)],
              [new Pitch(PitchLetter.D, 0, 4), new Pitch(PitchLetter.F, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.B, 0, 4)],
              [new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.E, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.C, 0, 5)]
            ]}
            chords={[
              new Chord(ChordType.Minor, new Pitch(PitchLetter.D, 0, 4)),
              new Chord(ChordType.Dom7, new Pitch(PitchLetter.G, 0, 4)),
              new Chord(ChordType.Major, new Pitch(PitchLetter.C, 0, 4))
            ]}
            scale={new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4))}
            chordScaleDegreeNumbers={[2, 5, 1]}
            maxWidth={maxTwoOctavePianoWidth} />
          
          <p>And use chord substitution to create a new chord progression - IV - V - I:</p>
          <ChordProgressionPlayer
            chordsPitches={[
              [new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.F, 0, 4), new Pitch(PitchLetter.A, 0, 4)],
              [new Pitch(PitchLetter.D, 0, 4), new Pitch(PitchLetter.F, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.B, 0, 4)],
              [new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.E, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.C, 0, 5)]
            ]}
            chords={[
              new Chord(ChordType.Major, new Pitch(PitchLetter.F, 0, 4)),
              new Chord(ChordType.Dom7, new Pitch(PitchLetter.G, 0, 4)),
              new Chord(ChordType.Major, new Pitch(PitchLetter.C, 0, 4))
            ]}
            scale={new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4))}
            chordScaleDegreeNumbers={[4, 5, 1]}
            maxWidth={maxTwoOctavePianoWidth} />
        </LimitedWidthContentContainer>
      </div>
    )),
    /*new Slide("needs-name-700", () => (
      <div>
        <LimitedWidthContentContainer>
          <p>Another way to do chord substitution is by looking for chords which perform a similar function (building or releasing tension) to another chord.</p>
          <p>Example ii - V7 - I and II - bII7 - I</p>
          <p>V7 vs bII7 voice resolution</p>

          <p>So, we can take a ii - V - I progression:</p>
          <ChordProgressionPlayer
            chordsPitches={[
              [new Pitch(PitchLetter.D, 0, 4), new Pitch(PitchLetter.F, 0, 4), new Pitch(PitchLetter.A, 0, 4)],
              [new Pitch(PitchLetter.D, 0, 4), new Pitch(PitchLetter.F, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.B, 0, 4)],
              [new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.E, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.C, 0, 5)]
            ]}
            chords={[
              new Chord(ChordType.Minor, new Pitch(PitchLetter.D, 0, 4)),
              new Chord(ChordType.Dom7, new Pitch(PitchLetter.G, 0, 4)),
              new Chord(ChordType.Major, new Pitch(PitchLetter.C, 0, 4))
            ]}
            scale={new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4))}
            chordScaleDegreeNumbers={[2, 5, 1]}
            maxWidth={maxTwoOctavePianoWidth} />
          
          <p>And use chord substitution to create a new chord progression - IV - V - I:</p>
          <ChordProgressionPlayer
            chordsPitches={[
              [new Pitch(PitchLetter.D, 0, 4), new Pitch(PitchLetter.F, 0, 4), new Pitch(PitchLetter.A, 0, 4)],
              [new Pitch(PitchLetter.C, 1, 4), new Pitch(PitchLetter.E, 1, 4), new Pitch(PitchLetter.G, 1, 4), new Pitch(PitchLetter.B, 0, 4)],
              [new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.E, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.C, 0, 5)]
            ]}
            chords={[
              new Chord(ChordType.Minor, new Pitch(PitchLetter.D, 0, 4)),
              new Chord(ChordType.Dom7, new Pitch(PitchLetter.C, 1, 4)),
              new Chord(ChordType.Major, new Pitch(PitchLetter.C, 0, 4))
            ]}
            scale={new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4))}
            chordScaleDegreeNumbers={[2, 2, 1]}
            chordScaleDegreeSignedAccidentals={[0, -1, 0]}
            maxWidth={maxTwoOctavePianoWidth} />
        </LimitedWidthContentContainer>
      </div>
    )),*/

    new Slide("chord-progressions-review", () => (
      <div>
        <p>Review material below, then move to the next slide to test your knowledge of chord progressions with a quiz.</p>
        <br />
        <p><strong>Chord progressions</strong> are sequences of chords.</p>
        <p><strong>Chord progressions</strong> are generally built with <strong>diatonic chords</strong>.</p>
        <p><strong>Roman numeral notation</strong> is a concise, scale-independent way to represent chord progressions.</p>
        <p>In roman numeral notation, the roman numeral represents the number of the scale note that the chord is built on.</p>
        <p>In roman numeral notation, chords based on the major triad are upper-case (ex: IV, V7).</p>
        <p>In roman numeral notation, chords based on the minor triad are lower-case. (ex: ii, vii°)</p>
        <p>One of the strongest sounding, and most common, chord progressions is the <strong>descending fifth</strong>.</p>
        <p>In the <strong>descending fifth</strong> chord progression, the 2nd chord is a fifth below the first chord.</p>
        <p>One of the strongest descending fifth progressions is <strong>V7 - I</strong>.</p>
        <p>The <strong>circle progression</strong> is a chain of descending fifth progressions.</p>
        <p><strong>Voice leading</strong> is the arrangement of chord notes in a progression to create smooth transitions between chords.</p>
        <p>The most important rule of voice leading is to use the smallest possible movements when transitioning from one chord to the next.</p>
        <p><strong>Chord substitution</strong> is replacing chords in a progression with different chords that often sound similar or have a similar "feel" in the progression.</p>
        <p>Chords that share many notes generally sound similar, and can be used as chord substitutes.</p>
      </div>
    )),

    new Slide("chord-progressions-quiz", () => (
      <LimitedWidthContentContainer>
        <div style={{ marginTop: "1em" }}>
          {createStudyFlashCardSetComponent(
            ChordProgressionsQuiz.flashCardSet,
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
  
  new SlideGroup("Coming Soon", [
    new Slide("coming-soon", () => <h3>More coming soon!</h3>)
  ])
];

function getSlideGroup(slideGroups: Array<SlideGroup>, slideIndex: number): [SlideGroup, number] | undefined {
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

// #endregion Slides

export interface IPianoTheoryProps {
  slideGroups: Array<SlideGroup>;
}

export interface IPianoTheoryState {
  slideIndex: number;
}

export class PianoTheory extends React.Component<IPianoTheoryProps, IPianoTheoryState> {
  public constructor(props: IPianoTheoryProps) {
    super(props);
    
    this.history = DependencyInjector.instance.getRequiredService<History<any>>("History");

    [this.state, this.slides] = this.getStateFromProps(props);
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
    const { slides } = this;

    AppModel.instance.pianoAudio.preloadSounds();
    
    this.historyUnregisterCallback = this.history.listen((location, action) => {
      this.setState({
        slideIndex: this.getSlideIndexFromUriParams(slides, location.search)
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
    const { slides } = this;
    const { slideIndex } = this.state;

    const renderedSlide = slides[slideIndex].renderFn(this);

    return (
      <div className="music-theory-for-piano" style={{ height: "100%" }}>
        <div style={{ display: "flex", height: "100%", padding: "0 1em" }}>
          <div>
            {this.canMoveToPreviousSlide()
              ? (
                <Button
                  variant="contained"
                  onClick={_ => this.moveToPreviousSlideInternal()}
                  className="slide-nav"
                >
                  <i className="material-icons" style={{ fontSize: "4em" }}>keyboard_arrow_left</i>
                </Button>
              )
              : null
            }
          </div>

          <div style={{ display: "flex", flexDirection: "column", textAlign: "center", flexGrow: 1, height: "100%" }}>
            {this.renderSlideLocation()}
            {renderedSlide}
          </div>

          <div>
            {this.canMoveToNextSlide()
              ? (
                <Button
                  variant="contained"
                  onClick={_ => this.moveToNextSlideInternal()}
                  className="slide-nav"
                >
                  <i className="material-icons" style={{ fontSize: "4em" }}>keyboard_arrow_right</i>
                </Button>
              )
              : null}
          </div>
        </div>
      </div>
    );
  }

  private slides: Array<Slide>;

  private getStateFromProps(props: IPianoTheoryProps): [IPianoTheoryState, Array<Slide>] {
    const slides = flattenArrays<Slide>(props.slideGroups.map(sg => sg.slides));

    const state = {
      slideIndex: this.getSlideIndexFromUriParams(slides, this.history.location.search)
    } as IPianoTheoryState;

    return [state, slides];
  }

  private renderSlideLocation(): JSX.Element {
    const { slideGroups } = this.props;
    const { slideIndex } = this.state;

    const slideGroupInfo = getSlideGroup(slideGroups, slideIndex);
    if (!slideGroupInfo) {
      return <span style={{ padding: "0 1em" }}>Music Theory for Piano - Falsetto</span>;
    }

    const slideGroup = slideGroupInfo[0];
    const indexOfSlideInGroup = slideGroupInfo[1];
    const slideNumberInGroup = 1 + indexOfSlideInGroup;

    return (
      <span style={{ textDecoration: "underline", padding: "0 1em" }}>{slideGroup.name} - Slide {slideNumberInGroup} / {slideGroup.slides.length}</span>
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

  private onKeyUp(event: KeyboardEvent) {}

  // #endregion 

  // #region Actions

  private canMoveToNextSlide(): boolean {
    const { slides } = this;
    const { slideIndex } = this.state;

    return (slideIndex + 1) < slides.length;
  }

  private moveToNextSlideInternal() {
    const { slides } = this;
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
    const { slides } = this;

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

  private getSlideIndexFromUriParams(slides: Array<Slide>, search: string): number {
    const urlSearchParams = QueryString.parse(search);
    if (!(urlSearchParams.slide && (typeof urlSearchParams.slide === 'string'))) { return 0; }

    const slideIndex = slides.findIndex(s => s.url === urlSearchParams.slide);
    return Math.max(slideIndex, 0);
  }
}