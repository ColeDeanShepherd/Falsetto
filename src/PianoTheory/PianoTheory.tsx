import { History, UnregisterCallback } from "history";
import * as React from "react";
import * as QueryString from "query-string";
import { Button } from "@material-ui/core";

import { flattenArrays } from '../lib/Core/ArrayUtils';
import { Margin } from "../lib/Core/Margin";
import { Vector2D } from "../lib/Core/Vector2D";

import { Pitch, getPitchRange } from '../lib/TheoryLib/Pitch';
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

import { createStudyFlashCardSetComponent, StudyFlashCardsView } from "../StudyFlashCards/View";

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
import { fullPianoLowestPitch, fullPianoHighestPitch, fullPianoNumWhiteKeys } from '../Components/Utils/PianoUtils';
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
import { FlashCard } from "../FlashCard";
import { majorScaleFormulaFlashCard, minorScaleFormulaFlashCard, createPressAllScaleNotesFlashCard } from './ScalesQuiz';
import { FlashCardSet } from "../FlashCardSet";
import { PressPianoKeysAllOctavesView } from "../Components/Utils/PressPianoKeysAllOctavesView";
import { fifthIntervalFlashCard } from "./ChordsIntroQuiz";

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
    maxWidth={maxPianoWidth}
    lowestPitch={fullPianoLowestPitch}
    highestPitch={fullPianoHighestPitch} />
);

export const oneOctavePianoLowestPitch = new Pitch(PitchLetter.C, 0, 4);
export const oneOctavePianoHighestPitch = new Pitch(PitchLetter.B, 0, 4);

export const OneOctavePiano: React.FunctionComponent<{}> = props => (
  <PlayablePianoKeyboard
    maxWidth={maxOneOctavePianoWidth}
    lowestPitch={oneOctavePianoLowestPitch}
    highestPitch={oneOctavePianoHighestPitch} />
);

export const twoOctavePianoLowestPitch = new Pitch(PitchLetter.C, 0, 3);
export const twoOctavePianoHighestPitch = new Pitch(PitchLetter.B, 0, 4);

export const TwoOctavePiano: React.FunctionComponent<{}> = props => (
  <PlayablePianoKeyboard
    maxWidth={maxTwoOctavePianoWidth}
    lowestPitch={twoOctavePianoLowestPitch}
    highestPitch={twoOctavePianoHighestPitch} />
);

const PianoKeyTwoBlackKeysPatternDiagram: React.FunctionComponent<{}> = props => {
  const lowestPitch = new Pitch(PitchLetter.C, 0, 4);
  const highestPitch = new Pitch(PitchLetter.E, 0, 4);
  const maxWidth = maxPianoWidth * (3 / fullPianoNumWhiteKeys);

  return (
    <PlayablePianoKeyboard
      maxWidth={maxWidth}
      lowestPitch={lowestPitch}
      highestPitch={highestPitch}
      wrapOctave={true} />
  );
};

const PianoKeyThreeBlackKeysPatternDiagram: React.FunctionComponent<{}> = props => {
  const lowestPitch = new Pitch(PitchLetter.F, 0, 4);
  const highestPitch = new Pitch(PitchLetter.B, 0, 4);
  const maxWidth = maxPianoWidth * (4 / fullPianoNumWhiteKeys);

  return (
    <PlayablePianoKeyboard
      maxWidth={maxWidth}
      lowestPitch={lowestPitch}
      highestPitch={highestPitch}
      wrapOctave={true} />
  );
};

const PianoKeyPatternDiagram: React.FunctionComponent<{}> = props => {
  const margin = new Margin(0, 0, 0, 20);
  
  function renderPatternHighlight(
    metrics: PianoKeyboardMetrics,
    patternOccurrenceIndex: number,
    color: string
  ): JSX.Element {
    const octaveNumber = patternOccurrenceIndex;

    const leftPitch = Pitch.max(new Pitch(PitchLetter.C, 0, octaveNumber), fullPianoLowestPitch);
    const rightPitch = Pitch.min(new Pitch(PitchLetter.B, 0, octaveNumber), fullPianoHighestPitch);

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
      "darkred",
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "indigo",
      "violet",
      "palevioletred"
    ];

    return (
      <g>
        {range(0, 8)
          .map(i => renderPatternHighlight(metrics, i, highlightColors[i]))}
      </g>
    );
  }

  return (
    <PlayablePianoKeyboard
      maxWidth={maxPianoWidth}
      margin={margin}
      lowestPitch={fullPianoLowestPitch}
      highestPitch={fullPianoHighestPitch}
      renderExtrasFn={renderPatternHighlights} />
  );
};

export interface IPianoNoteDiagramProps {
  key?: React.Key;
  pitch: Pitch,
  labelWhiteKeys: boolean,
  labelBlackKeys: boolean,
  showLetterPredicate?: (pitch: Pitch) => boolean,
  useSharps?: boolean,
  onKeyPress?: (keyPitch: Pitch) => void
}

function renderPianoNoteDiagram(props: IPianoNoteDiagramProps) {
  const { key, pitch, labelWhiteKeys, labelBlackKeys, showLetterPredicate, useSharps, onKeyPress }  = props;

  const lowestPitch = new Pitch(PitchLetter.C, 0, 4);
  const highestPitch = new Pitch(PitchLetter.B, 0, 4);

  return (
    <PianoNotesDiagram
      key={key}
      lowestPitch={lowestPitch}
      highestPitch={highestPitch}
      maxWidth={maxOneOctavePianoWidth}
      labelWhiteKeys={labelWhiteKeys}
      labelBlackKeys={labelBlackKeys}
      highlightedPitch={pitch}
      showLetterPredicate={showLetterPredicate}
      useSharps={useSharps}
      onKeyPress={onKeyPress} />
  );
};

export interface IPianoNotesDiagramProps {
  lowestPitch: Pitch;
  highestPitch: Pitch;
  maxWidth: number;
  labelWhiteKeys: boolean;
  labelBlackKeys: boolean;
  highlightedPitch?: Pitch;
  showLetterPredicate?: (pitch: Pitch) => boolean;
  useSharps?: boolean;
  onKeyPress?: (keyPitch: Pitch) => void;
}

export class PianoNotesDiagram extends React.Component<IPianoNotesDiagramProps, {}> {
  public render(): JSX.Element {
    const { lowestPitch, highestPitch, maxWidth, highlightedPitch, showLetterPredicate, useSharps }  = this.props;

    const labelWhiteKeys = (this.props.labelWhiteKeys !== undefined) ? this.props.labelWhiteKeys : true;
    const labelBlackKeys = (this.props.labelBlackKeys !== undefined) ? this.props.labelBlackKeys : true;
  
    return (
      <PlayablePianoKeyboard
        maxWidth={maxWidth}
        lowestPitch={lowestPitch}
        highestPitch={highestPitch}
        onKeyPress={p => this.onKeyPress(p)}
        onKeyRelease={p => this.onKeyRelease(p)}
        forcePressedPitches={highlightedPitch ? [highlightedPitch] : undefined}
        renderExtrasFn={metrics => renderPianoKeyboardNoteNames(
          metrics,
          /*useSharps*/ useSharps,
          /*showLetterPredicate*/ showLetterPredicate
            ? showLetterPredicate
            : p => (
              highlightedPitch
                ? ((labelWhiteKeys && p.isWhiteKey) || (labelBlackKeys && p.isBlackKey)) && (p.midiNumber <= highlightedPitch.midiNumber)
                : (p.isWhiteKey ? labelWhiteKeys : labelBlackKeys)
            )
        )}
        wrapOctave={true} />
    );
  }

  private onKeyPress(pitch: Pitch) {
    const { onKeyPress } = this.props;

    if (onKeyPress) {
      onKeyPress(pitch);
    }
  }

  private onKeyRelease(pitch: Pitch) {}
}

const ThirdsDiagram: React.FunctionComponent<{}> = props => {
  const maxWidth = maxTwoOctavePianoWidth;
  const margin = new Margin(0, 0, 0, maxWidth / 10);

  const pitches = [
    new Pitch(PitchLetter.C, 0, 4),
    new Pitch(PitchLetter.E, 0, 4),
    new Pitch(PitchLetter.G, 0, 4),
  ];
  
  function renderIntervalLabels(metrics: PianoKeyboardMetrics): JSX.Element {
    function renderIntervalLabel(leftPitch: Pitch, rightPitch: Pitch): JSX.Element {
      const leftKeyRect = metrics.getKeyRect(leftPitch);
      const rightKeyRect = metrics.getKeyRect(rightPitch);

      const textOffsetY = metrics.svgSize.height / 8;
      const fontSize = metrics.svgSize.height / 12;
      const textPos = new Vector2D(
        (leftKeyRect.left + rightKeyRect.right) / 2,
        metrics.svgSize.height + textOffsetY
      );
      const textStyle: any = {
        textAnchor: "middle",
        fontSize: fontSize
      };

      const lineOffsetY = textOffsetY - (1.9 * fontSize);
      const lineShrinkX = metrics.svgSize.height / 50;
      const leftKeyLinePos = new Vector2D(leftKeyRect.center.x + lineShrinkX, leftKeyRect.bottom - lineOffsetY);
      const rightKeyLinePos = new Vector2D(rightKeyRect.center.x - lineShrinkX, leftKeyRect.bottom - lineOffsetY);
      const strokeWidth = metrics.svgSize.height / 80;

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
      maxWidth={maxWidth}
      margin={margin}
      lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
      highestPitch={new Pitch(PitchLetter.B, 0, 5)}
      canPressKeyFn={p => new Set<number>(pitches.map(p => p.midiNumberNoOctave)).has(p.midiNumberNoOctave)}
      wrapOctave={true}
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
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
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

const exerciseContainerStyle: any = { height: "100%" };

function createMiniQuizSlide(
  slideUrl: string,
  flashCards: Array<FlashCard>
) {
  const flashCardSetId = `ptMiniQuiz.${slideUrl}`;
  const flashCardSet = new FlashCardSet(flashCardSetId, /*name*/ "Piano Notes", () => flashCards);

  return (
    new Slide(slideUrl, () => (
      <div style={exerciseContainerStyle}>
        <StudyFlashCardsView
          key={flashCardSet.route}
          flashCardSet={flashCardSet}
          title=""
          quizMode={true}
          hideMoreInfoUri={false}
        />
      </div>
    ))
  );
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
        <p>Luckily, we don't need to learn 88 different names because the names repeat as you move up and down the piano keyboard.</p>
        <p>Note names repeat because we percieve notes with the same name as very similar, just played higher or lower.</p>

        <br />

        <p>Piano keys are arranged in a repeating 12-note pattern, where each occurrence of the pattern has the same note names. The pattern has two parts:</p>

        <div style={{ display: "flex", width: "100%", justifyContent: "space-evenly" }}>
          <div>
            <p><strong>Part 1:</strong> two black keys surrounded by three white keys:</p>
            <PianoKeyTwoBlackKeysPatternDiagram />
          </div>
          <div>
            <p><strong>Part 2:</strong> followed by three black keys surrounded by four white keys:</p>
            <PianoKeyThreeBlackKeysPatternDiagram />
          </div>
        </div>

        <br />

        <p>Below are occurrences of the pattern on an 88-key piano keyboard highlighted in different colors. Try pressing keys in different sections of the keyboard, and notice how the same keys (relative to the repeating pattern) in different sections of the keyboard sound similar.</p>
        <PianoKeyPatternDiagram />
      </div>
    )),

    new Slide("note-c", (slideshow) => (
      <div>
        <p>We will start by learning the names of the notes produced by the 7 white keys in the repeating pattern.</p>
        <p>All note names are based on english letters. The highlighted key below, to the left of the group of 2 black keys, produces a note called <strong>C</strong>.</p>
        {renderPianoNoteDiagram({
          key: "pianoNoteDiagram", // prevent the component from unmounting when changing slides
          pitch: new Pitch(PitchLetter.C, 0, 4),
          labelWhiteKeys: true,
          labelBlackKeys: false
        })}
      </div>
    )),
    
    new Slide("note-c-exercise", (slideshow) => (
      <div>
        <p>Press all the <strong>C</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
        <PressPianoKeysAllOctavesView
          pitches={[new Pitch(PitchLetter.C, 0, 4)]}
          maxWidth={maxPianoWidth}
          onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
          />
      </div>
    )),
    
    new Slide("note-d", (slideshow) => (
      <div>
        <p>When moving one white key to the right, we also move forward by one letter in the English alphabet, so this key is called <strong>D</strong>.</p>
        {renderPianoNoteDiagram({
          key: "pianoNoteDiagram", // prevent the component from unmounting when changing slides
          pitch: new Pitch(PitchLetter.D, 0, 4),
          labelWhiteKeys: true,
          labelBlackKeys: false
        })}
      </div>
    )),
    
    new Slide("note-d-exercise", (slideshow) => (
      <div>
        <p>Press all the <strong>D</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
        <PressPianoKeysAllOctavesView
          pitches={[new Pitch(PitchLetter.D, 0, 4)]}
          maxWidth={maxPianoWidth}
          onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
          />
      </div>
    )),
    
    new Slide("note-e", (slideshow) => (
      <div>
        <p>This key is called <strong>E</strong>.</p>
        {renderPianoNoteDiagram({
          key: "pianoNoteDiagram", // prevent the component from unmounting when changing slides
          pitch: new Pitch(PitchLetter.E, 0, 4),
          labelWhiteKeys: true,
          labelBlackKeys: false
        })}
      </div>
    )),
    
    new Slide("note-e-exercise", (slideshow) => (
      <div>
        <p>Press all the <strong>E</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
        <PressPianoKeysAllOctavesView
          pitches={[new Pitch(PitchLetter.E, 0, 4)]}
          maxWidth={maxPianoWidth}
          onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
          />
      </div>
    )),
    
    new Slide("note-f", (slideshow) => (
      <div>
        <p>This key is called <strong>F</strong>.</p>
        {renderPianoNoteDiagram({
          key: "pianoNoteDiagram", // prevent the component from unmounting when changing slides
          pitch: new Pitch(PitchLetter.F, 0, 4),
          labelWhiteKeys: true,
          labelBlackKeys: false
        })}
      </div>
    )),
    
    new Slide("note-f-exercise", (slideshow) => (
      <div>
        <p>Press all the <strong>F</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
        <PressPianoKeysAllOctavesView
          pitches={[new Pitch(PitchLetter.F, 0, 4)]}
          maxWidth={maxPianoWidth}
          onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
          />
      </div>
    )),
    
    new Slide("note-g", (slideshow) => (
      <div>
        <p>This key is called <strong>G</strong>.</p>
        {renderPianoNoteDiagram({
          key: "pianoNoteDiagram", // prevent the component from unmounting when changing slides
          pitch: new Pitch(PitchLetter.G, 0, 4),
          labelWhiteKeys: true,
          labelBlackKeys: false
        })}
      </div>
    )),
    
    new Slide("note-g-exercise", (slideshow) => (
      <div>
        <p>Press all the <strong>G</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
        <PressPianoKeysAllOctavesView
          pitches={[new Pitch(PitchLetter.G, 0, 4)]}
          maxWidth={maxPianoWidth}
          onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
          />
      </div>
    )),
    
    new Slide("note-a", (slideshow) => (
      <div>
        <p>After "G" there is no "H" key &mdash; instead we jump backwards through the English alphabet to <strong>A</strong>.</p>
        {renderPianoNoteDiagram({
          key: "pianoNoteDiagram", // prevent the component from unmounting when changing slides
          pitch: new Pitch(PitchLetter.A, 0, 4),
          labelWhiteKeys: true,
          labelBlackKeys: false
        })}
      </div>
    )),
    
    new Slide("note-a-exercise", (slideshow) => (
      <div>
        <p>Press all the <strong>A</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
        <PressPianoKeysAllOctavesView
          pitches={[new Pitch(PitchLetter.A, 0, 4)]}
          maxWidth={maxPianoWidth}
          onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
          />
      </div>
    )),
    
    new Slide("note-b", (slideshow) => (
      <div>
        <p>The last white key is called <strong>B</strong>.</p>
        {renderPianoNoteDiagram({
          key: "pianoNoteDiagram", // prevent the component from unmounting when changing slides
          pitch: new Pitch(PitchLetter.B, 0, 4),
          labelWhiteKeys: true,
          labelBlackKeys: false
        })}
      </div>
    )),
    
    new Slide("note-b-exercise", (slideshow) => (
      <div>
        <p>Press all the <strong>B</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
        <PressPianoKeysAllOctavesView
          pitches={[new Pitch(PitchLetter.B, 0, 4)]}
          maxWidth={maxPianoWidth}
          onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
          />
      </div>
    )),
    
    new Slide("white-notes-summary", () => (
      <div>
        <p>Study this slide, then move to the next slide to practice your knowledge of white key names with an interactive exercise.</p>
        <PianoNotesDiagram
          key="pianoNoteDiagram" // prevent the component from unmounting when changing slides
          lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
          highestPitch={new Pitch(PitchLetter.B, 0, 4)}
          maxWidth={maxOneOctavePianoWidth}
          labelWhiteKeys={true}
          labelBlackKeys={false} />
      </div>
    )),
    
    new Slide("white-notes-quiz", () => (
      <div style={exerciseContainerStyle}>
        {createStudyFlashCardSetComponent(
          PianoNotes.createFlashCardSet(naturalPitches),
          /*isEmbedded*/ false,
          /*hideMoreInfoUri*/ true,
          /*title*/ "White Piano Key Names Exercise",
          /*style*/ undefined,
          /*enableSettings*/ undefined)}
        </div>
    )),
    
    new Slide("note-c-sharp", (slideshow) => (
      <div>
        <p>Now let's learn the names of the 5 black piano keys in this section of the piano.</p>
        <p>The key highlighted below, like all black keys, has multiple names. One name for it is <strong>C♯</strong> (pronounced "C sharp").</p>
        <p>The '♯' ("sharp") symbol means the note is raised by one key, so C♯ means "the key to the right of C".</p>
        {renderPianoNoteDiagram({
          key: "pianoNoteDiagram", // prevent the component from unmounting when changing slides
          pitch: new Pitch(PitchLetter.C, 1, 4),
          labelWhiteKeys: true,
          labelBlackKeys: true,
          useSharps: true,
          showLetterPredicate: p => (p.midiNumber <= (new Pitch(PitchLetter.C, 1, 4)).midiNumber)
        })}
      </div>
    )),
    
    new Slide("note-c-sharp-exercise", (slideshow) => (
      <div>
        <p>Press all the <strong>C♯</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
        <PressPianoKeysAllOctavesView
          pitches={[new Pitch(PitchLetter.C, 1, 4)]}
          maxWidth={maxPianoWidth}
          onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
          />
      </div>
    )),
    
    new Slide("note-d-flat", (slideshow) => (
      <div>
        <p>Another name for the same key is <strong>D♭</strong> (pronounced "D flat").</p>
        <p>The '♭' ("flat") symbol means the note is lowered by one key, so D♭ means "the key to the left of D".</p>
        {renderPianoNoteDiagram({
          key: "pianoNoteDiagram", // prevent the component from unmounting when changing slides
          pitch: new Pitch(PitchLetter.D, -1, 4),
          labelWhiteKeys: true,
          labelBlackKeys: true,
          useSharps: false,
          showLetterPredicate: p => p.isEnharmonic(new Pitch(PitchLetter.D, 0, 4)) || p.isEnharmonic(new Pitch(PitchLetter.D, -1, 4))
        })}
      </div>
    )),
    
    new Slide("note-d-flat-exercise", (slideshow) => (
      <div>
        <p>Press all the <strong>D♭</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
        <PressPianoKeysAllOctavesView
          pitches={[new Pitch(PitchLetter.D, -1, 4)]}
          maxWidth={maxPianoWidth}
          onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
          />
      </div>
    )),
    
    new Slide("note-d-sharp-e-flat", (slideshow) => (
      <div>
        <p>This key is called <strong>D♯</strong>, or <strong>E♭</strong>.</p>
        {renderPianoNoteDiagram({
          key: "pianoNoteDiagram", // prevent the component from unmounting when changing slides
          pitch: new Pitch(PitchLetter.D, 1, 4),
          labelWhiteKeys: false,
          labelBlackKeys: true
        })}
      </div>
    )),
    
    new Slide("note-d-sharp-e-flat-exercise", (slideshow) => (
      <div>
        <p>Press all the <strong>D♯/E♭</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
        <PressPianoKeysAllOctavesView
          pitches={[new Pitch(PitchLetter.D, 1, 4)]}
          maxWidth={maxPianoWidth}
          onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
          />
      </div>
    )),

    new Slide("note-f-sharp-g-flat", (slideshow) => (
      <div>
        <p>This key is called <strong>F♯</strong>, or <strong>G♭</strong>.</p>
        {renderPianoNoteDiagram({
          key: "pianoNoteDiagram", // prevent the component from unmounting when changing slides
          pitch: new Pitch(PitchLetter.F, 1, 4),
          labelWhiteKeys: false,
          labelBlackKeys: true
        })}
      </div>
    )),
    
    new Slide("note-f-sharp-g-flat-exercise", (slideshow) => (
      <div>
        <p>Press all the <strong>F♯/G♭</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
        <PressPianoKeysAllOctavesView
          pitches={[new Pitch(PitchLetter.F, 1, 4)]}
          maxWidth={maxPianoWidth}
          onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
          />
      </div>
    )),

    new Slide("note-g-sharp-a-flat", (slideshow) => (
      <div>
        <p>This key is called <strong>G♯</strong>, or <strong>A♭</strong>.</p>
        {renderPianoNoteDiagram({
          key: "pianoNoteDiagram", // prevent the component from unmounting when changing slides
          pitch: new Pitch(PitchLetter.G, 1, 4),
          labelWhiteKeys: false,
          labelBlackKeys: true
        })}
      </div>
    )),
    
    new Slide("note-g-sharp-a-flat-exercise", (slideshow) => (
      <div>
        <p>Press all the <strong>G♯/A♭</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
        <PressPianoKeysAllOctavesView
          pitches={[new Pitch(PitchLetter.G, 1, 4)]}
          maxWidth={maxPianoWidth}
          onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
          />
      </div>
    )),

    new Slide("note-a-sharp-b-flat", (slideshow) => (
      <div>
        <p>The last black key is called <strong>A♯</strong>, or <strong>B♭</strong>.</p>
        {renderPianoNoteDiagram({
          key: "pianoNoteDiagram", // prevent the component from unmounting when changing slides
          pitch: new Pitch(PitchLetter.B, -1, 4),
          labelWhiteKeys: false,
          labelBlackKeys: true
        })}
      </div>
    )),
    
    new Slide("note-a-sharp-b-flat-exercise", (slideshow) => (
      <div>
        <p>Press all the <strong>A♯/B♭</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
        <PressPianoKeysAllOctavesView
          pitches={[new Pitch(PitchLetter.A, 1, 4)]}
          maxWidth={maxPianoWidth}
          onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
          />
      </div>
    )),
    
    new Slide("black-notes-summary", () => (
      <div>
        <p>Study this slide, then move to the next slide to practice your knowledge of black key names with an interactive exercise.</p>
        <PianoNotesDiagram
          key="pianoNoteDiagram" // prevent the component from unmounting when changing slides
          lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
          highestPitch={new Pitch(PitchLetter.B, 0, 4)}
          maxWidth={maxOneOctavePianoWidth}
          labelWhiteKeys={false}
          labelBlackKeys={true} />
      </div>
    )),
    
    new Slide("black-notes-quiz", () => (
      <div style={exerciseContainerStyle}>
        {createStudyFlashCardSetComponent(
          PianoNotes.createFlashCardSet(accidentalPitches),
          /*isEmbedded*/ false,
          /*hideMoreInfoUri*/ true,
          /*title*/ "Black Piano Key Names Exercise",
          /*style*/ undefined,
          /*enableSettings*/ undefined)}
      </div>
    )),
    
    new Slide("notes-summary", () => (
      <div>
        <p>You have now learned the names of all the notes in the repeating pattern of piano keys!</p>
        <p>
          <PianoNotesDiagram
            lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
            highestPitch={new Pitch(PitchLetter.B, 0, 4)}
            maxWidth={maxOneOctavePianoWidth / 2}
            labelWhiteKeys={true}
            labelBlackKeys={true} />
        </p>
        <p>And here are all the note names on an 88 key piano keyboard:</p>
        <PianoNotesDiagram
          lowestPitch={fullPianoLowestPitch}
          highestPitch={fullPianoHighestPitch}
          maxWidth={maxPianoWidth}
          labelWhiteKeys={true}
          labelBlackKeys={true} />
          <p>Study these note names, then move to the next slide to practice your knowledge with an interactive exercise.</p>
      </div>
    )),

    new Slide("notes-quiz", () => (
      <div style={exerciseContainerStyle}>
        {createStudyFlashCardSetComponent(
          PianoNotes.createFlashCardSet(allPitches),
          /*isEmbedded*/ false,
          /*hideMoreInfoUri*/ true,
          /*title*/ "Piano Notes Exercise",
          /*style*/ undefined,
          /*enableSettings*/ undefined)}
      </div>
    )),
  ]),

  new SlideGroup("Scales", [
    new Slide("scales-introduction", () => (
      <div>
        <h2>Section 3: Scales</h2>
        <p>As you've learned, there are 12 different notes. Though musicians are free to use any of the 12 notes at any time, it is common to restrict the choice of keys to those in a particular <strong>scale</strong> &mdash; a set of notes.</p>
        <p>The <strong>C major scale</strong>, for example, consists of the 7 notes: <strong>C, D, E, F, G, A, B</strong>.</p>
        <p>Try pressing the piano keys below to get a feel for how the scale sounds. Pressing keys will play both the pressed note and the lowest C in the diagram, which helps convey the "feeling" of the scale.</p>
        <p>Also try starting and ending with <strong>C</strong> to hear how it sounds stable and "like home."</p>
        <p>
          <PianoScaleDronePlayer
            scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))}
            octaveCount={2}
            maxWidth={maxTwoOctavePianoWidth} />
        </p>
      </div>
    )),

    new Slide("c-major-scale-notes-quiz", (slideshow) => {
      const pitches = new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4)).getPitches();

      return (
        <div>
          <p>Press all the keys in the <strong>C major scale</strong> on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesView
            pitches={pitches}
            maxWidth={maxPianoWidth}
            onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
            />
        </div>
      );
    }),

    // createMiniQuizSlide(
    //   "c-major-scale-notes-quiz",
    //   [createPressAllScaleNotesFlashCard("cMajorScaleNotes", new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4)))]
    // ),

    new Slide("major-scale", () => (
      <div>
        <p>Major scales, like the <strong>C major</strong> scale we saw on the last slide, are very common in music.</p>
        <p>All major scales are built with the same formula: "<strong>W W H W W W</strong>", where:</p>
        <p>
          <strong>"W"</strong> means the next note is a <strong>whole step</strong> (2 keys) higher than the previous note.
          <br />
          <strong>"H"</strong> means the next note is a <strong>half step</strong> (1 key) higher than of the previous note.
        </p>
        <p>So, to figure out the notes in any major scale, you simply pick a note and follow the major scale formula.</p>

        <p>Below is an interactive diagram of the C major scale and the major scale formula.</p>
        <p>
          <PianoScaleFormulaDiagram
            scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))}
            octaveCount={2}
            maxWidth={maxTwoOctavePianoWidth} />
        </p>
        <div style={{ display: "inline-block" }}><NoteText>Though scale formulas define the notes of a scale in a particular order, you are free to play the notes in any order you like.</NoteText></div>
      </div>
    )),
    createMiniQuizSlide("major-scale-formula-quiz", [majorScaleFormulaFlashCard]),

    new Slide("natural-minor-scale", () => (
      <div>
        <p>Another way to write scale formulas is <strong>relative to the major scale</strong>.</p>
        <p>Let's assign a number to each note in the major scale &mdash; <strong>1</strong> for the 1st note (ex: <strong>C</strong> in <strong>C major</strong>), <strong>2</strong> for the 2nd note (in ascending order &ndash; ex: <strong>D</strong> in <strong>C major</strong>), and so on.</p>
        <p>Now the major scale can be written as: <strong className="no-wrap">1, 2, 3, 4, 5, 6, 7</strong>.</p>
        <p>We can then raise or lower the notes with sharps or flats to write formulas for other scales relative to the major scale.</p>
        
        <br />
        <NoteText>The 1st note of a scale is sometimes referred to as the <strong>1st degree</strong> of the scale, and <strong>generally sounds stable and "like home"</strong>. The 2nd note is sometimes referred to as the <strong>2nd degree</strong> scale, the 3rd note as the <strong>3rd degree</strong> and so on.</NoteText>
        <br />

        <p>For example, another common type of scale is the <strong>natural minor scale</strong> (sometimes simply called the <strong>minor</strong> scale), which has a major-scale-relative formula of: <strong className="no-wrap">1, 2, 3♭, 4, 5, 6♭, 7♭</strong>.</p>
        <p>We can use this formula to figure out the notes of the <strong>C minor scale</strong>, for example, by taking the notes of the <strong>C major scale</strong> (<span className="no-wrap">C, D, E, F, G, A, B</span>) and flattening degrees 3, 6, &amp; 7, giving us: <strong className="no-wrap">C, D, E♭, F, G, A♭, B♭</strong>.</p>
        
        <br />

        <p>Below is an interactive diagram of the <strong>C minor</strong> scale, along its major-scale-relative fomula. Press the piano keys below to get a feel for how the scale sounds!</p>
        <p><PianoScaleMajorRelativeFormulaDiagram
          scale={new Scale(ScaleType.Aeolian, new Pitch(PitchLetter.C, 0, 4))}
          octaveCount={2}
          maxWidth={maxTwoOctavePianoWidth} /></p>
      </div>
    )),

    createMiniQuizSlide("minor-scale-formula-quiz", [minorScaleFormulaFlashCard]),
    
    new Slide("c-minor-scale-notes-quiz", (slideshow) => {
      const pitches = new Scale(ScaleType.Aeolian, new Pitch(PitchLetter.C, 0, 4)).getPitches();

      return (
        <div>
          <p>Press all the keys in the <strong>C minor scale</strong> on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesView
            pitches={pitches}
            maxWidth={maxPianoWidth}
            onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
            />
        </div>
      );
    }),

    new Slide("scales-summary", () => (
      <div>
        <p>There are many other scales you can learn about in your own time here: <NavLinkView to="/scale-exercises" openNewTab={true}>Self-Paced Scale Mastery</NavLinkView>.</p>
        
        <br />

        <p>For now, take some time to review material below, then move to the next slide to practice your knowledge of scales with an interactive exercise.</p>
        
        <br />
        
        <p>Scales are <strong>sets of notes</strong>.</p>
        <p>The formula for all major scales is <strong>W W H W W W</strong>.</p>
        <p>In scale formulas, <strong>"H" means the next note is a "half step" (1 key) to the right of the previous note</strong>.</p>
        <p>In scale formulas, <strong>"W" means the next note is a "whole step" (2 keys) to the right of the previous note</strong>.</p>
        <p>Though scale formulas define the notes of a scale in a particular order, <strong>you are free to play the notes in any order you like</strong>.</p>
        <p>A <strong>scale degree</strong> is the number of a note in a scale, in ascending order, starting from 1.</p>
        <p>The 1st degree of a scale <strong>generally sounds stable and "like home."</strong></p>
        <p>The major-scale-relative formula for all <strong>natural minor scales</strong> (also simply called <strong>minor scales</strong>) is <strong>1, 2, 3♭, 4, 5, 6♭, 7♭</strong>.</p>
      </div>
    )),
    new Slide("scales-quiz", () => (
      <div style={exerciseContainerStyle}>
        {createStudyFlashCardSetComponent(
          ScalesQuiz.flashCardSet,
          /*isEmbedded*/ false,
          /*hideMoreInfoUri*/ true,
          /*title*/ undefined,
          /*style*/ undefined,
          /*enableSettings*/ undefined)}
      </div>
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
    
    new Slide("c-major-chord-notes-quiz", (slideshow) => {
      const pitches = new Chord(ChordType.Major, new Pitch(PitchLetter.C, 0, 4)).getPitches();

      return (
        <div>
          <p>Press all the keys in the <strong>C major chord</strong> on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesView
            pitches={pitches}
            maxWidth={maxPianoWidth}
            onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
            />
        </div>
      );
    }),
    
    new Slide("tertial-chords", () => (
      <div>
        <p>In practice, most chords are built with <strong>thirds</strong>.</p>
        <p>A <strong>third</strong> in this context is an <strong>interval</strong> (a distance between two notes) that spans three letters.</p>
        <p>A chord is built with thirds if, when you list the notes of the chord starting with the root note and proceeding in left-to-right order on the piano keyboard, each pair of adjacent notes is a third apart.</p>
        <p>For example, the <strong>C Major chord</strong> we've seen is built with thirds: C &amp; E are a third apart (they span 3 letters &mdash; C, D, E), and E &amp; G are a third apart (they span 3 letters &mdash; E, F, G)</p>
        <ThirdsDiagram />
      </div>
    )),
    
    createMiniQuizSlide("interval-quiz", [fifthIntervalFlashCard]),

    new Slide("chord-major-relative-formula", () => (
      <div>
        <p>Like scales, chords have major-scale-relative formulas.</p>
        <p>For example, the major-scale-relative formula for all <strong>Major chords</strong> is <strong>1 3 5</strong>, meaning major chords consist of the 1st, 3rd, and 5th notes of the major scale associated with the root note of the chord.</p>
        <p>So, C Major chords consist the 1st, 3rd, and 5th notes of the C Major scale: C, E, G.</p>
        
        <p style={{fontSize: "1.25em", fontWeight: "bold", textDecoration: "underline", textAlign: "center"}}>C Major</p>
        <ChordView
          chord={new Chord(ChordType.Major, new Pitch(PitchLetter.C, 0, 4))}
          showChordInfoText={false}
          showChordFormulaOnPiano={true} />
      </div>
    )),
    
    new Slide("minor-chord-formula", () => (
      <div>
        <p>Another important type of chord is the <strong>Minor chord</strong>.</p>

        <p>All <strong>Minor chords</strong> have the major-scale-relative formula: <strong>1 3♭ 5</strong></p>
        <p><p>So, C Minor chords, for example, consist the 1st, flattened 3rd, and 5th notes of the C Major scale: C, E♭, G.</p></p>
        <p style={{fontSize: "1.25em", fontWeight: "bold", textDecoration: "underline", textAlign: "center"}}>C Minor</p>
        <ChordView
          chord={new Chord(ChordType.Minor, new Pitch(PitchLetter.C, 0, 4))}
          showChordInfoText={false}
          showChordFormulaOnPiano={true} />
      </div>
    )),
    
    new Slide("c-minor-chord-notes-quiz", (slideshow) => {
      const pitches = new Chord(ChordType.Minor, new Pitch(PitchLetter.C, 0, 4)).getPitches();

      return (
        <div>
          <p>Press all the keys in the <strong>C minor chord</strong> on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesView
            pitches={pitches}
            maxWidth={maxPianoWidth}
            onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
            />
        </div>
      );
    }),

    new Slide("diminished-chord-formula", () => (
      <div>
        <p>Another important type of chord is the <strong>Diminished chord</strong>.</p>

        <p>All <strong>Diminished chords</strong> have the major-scale-relative formula: <strong>1 3♭ 5♭</strong></p>
        <p style={{fontSize: "1.25em", fontWeight: "bold", textDecoration: "underline", textAlign: "center"}}>C Diminished</p>
        <ChordView
          chord={new Chord(ChordType.Diminished, new Pitch(PitchLetter.C, 0, 4))}
          showChordInfoText={false}
          showChordFormulaOnPiano={true} />
      </div>
    )),
    
    new Slide("c-diminished-chord-notes-quiz", (slideshow) => {
      const pitches = new Chord(ChordType.Diminished, new Pitch(PitchLetter.C, 0, 4)).getPitches();

      return (
        <div>
          <p>Press all the keys in the <strong>C diminished chord</strong> on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesView
            pitches={pitches}
            maxWidth={maxPianoWidth}
            onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
            />
        </div>
      );
    }),
    
    new Slide("dominant-7-chord-formula", () => (
      <div>
        <p>One last important type of chord is the <strong>Dominant 7th chord</strong> (also simply called the <strong>7th chord</strong>).</p>

        <p>All <strong>Dominant 7th chords</strong> have the major-scale-relative formula: <strong>1 3 5 7♭</strong></p>
        <p style={{fontSize: "1.25em", fontWeight: "bold", textDecoration: "underline", textAlign: "center"}}>C Dominant 7</p>
        <ChordView
          chord={new Chord(ChordType.Dom7, new Pitch(PitchLetter.C, 0, 4))}
          showChordInfoText={false}
          showChordFormulaOnPiano={true} />
      </div>
    )),
    
    new Slide("c-dominant-7-chord-notes-quiz", (slideshow) => {
      const pitches = new Chord(ChordType.Dom7, new Pitch(PitchLetter.C, 0, 4)).getPitches();

      return (
        <div>
          <p>Press all the keys in the <strong>C dominant 7th chord</strong> on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesView
            pitches={pitches}
            maxWidth={maxPianoWidth}
            onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
            />
        </div>
      );
    }),
    
    new Slide("chords-introduction-review", () => (
      <div>
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
      </div>
    )),
    
    new Slide("chords-introduction-quiz", () => (
      <div style={exerciseContainerStyle}>
        {createStudyFlashCardSetComponent(
          ChordsIntroQuiz.flashCardSet,
          /*isEmbedded*/ false,
          /*hideMoreInfoUri*/ true,
          /*title*/ undefined,
          /*style*/ undefined,
          /*enableSettings*/ undefined)}
      </div>
    )),

    new Slide("diatonic-chords", () => (
      <div>
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
    new Slide("d-minor-chord-notes-quiz", (slideshow) => {
      const pitches = new Chord(ChordType.Minor, new Pitch(PitchLetter.D, 0, 4)).getPitches();

      return (
        <div>
          <p>Press all the keys in the <strong>D minor chord</strong> on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesView
            pitches={pitches}
            maxWidth={maxPianoWidth}
            onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
            />
        </div>
      );
    }),
    
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
    new Slide("e-minor-chord-notes-quiz", (slideshow) => {
      const pitches = new Chord(ChordType.Minor, new Pitch(PitchLetter.E, 0, 4)).getPitches();

      return (
        <div>
          <p>Press all the keys in the <strong>E minor chord</strong> on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesView
            pitches={pitches}
            maxWidth={maxPianoWidth}
            onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
            />
        </div>
      );
    }),

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
    new Slide("f-major-chord-notes-quiz", (slideshow) => {
      const pitches = new Chord(ChordType.Major, new Pitch(PitchLetter.F, 0, 4)).getPitches();

      return (
        <div>
          <p>Press all the keys in the <strong>F major chord</strong> on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesView
            pitches={pitches}
            maxWidth={maxPianoWidth}
            onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
            />
        </div>
      );
    }),

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
    new Slide("g-major-chord-notes-quiz", (slideshow) => {
      const pitches = new Chord(ChordType.Major, new Pitch(PitchLetter.G, 0, 4)).getPitches();

      return (
        <div>
          <p>Press all the keys in the <strong>G major chord</strong> on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesView
            pitches={pitches}
            maxWidth={maxPianoWidth}
            onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
            />
        </div>
      );
    }),

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
    new Slide("a-minor-chord-notes-quiz", (slideshow) => {
      const pitches = new Chord(ChordType.Minor, new Pitch(PitchLetter.A, 0, 4)).getPitches();

      return (
        <div>
          <p>Press all the keys in the <strong>A minor chord</strong> on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesView
            pitches={pitches}
            maxWidth={maxPianoWidth}
            onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
            />
        </div>
      );
    }),

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
    new Slide("b-diminished-chord-notes-quiz", (slideshow) => {
      const pitches = new Chord(ChordType.Diminished, new Pitch(PitchLetter.B, 0, 4)).getPitches();

      return (
        <div>
          <p>Press all the keys in the <strong>B diminished chord</strong> on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesView
            pitches={pitches}
            maxWidth={maxPianoWidth}
            onAllCorrectKeysPressed={() => slideshow.tryToMoveToNextSlide()}
            />
        </div>
      );
    }),

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
      <div style={exerciseContainerStyle}>
        {createStudyFlashCardSetComponent(
          DiatonicChordsQuiz.flashCardSet,
          /*isEmbedded*/ false,
          /*hideMoreInfoUri*/ true,
          /*title*/ undefined,
          /*style*/ undefined,
          /*enableSettings*/ undefined)}
      </div>
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
      </div>
    )),
    new Slide("voice-leading", () => (
      <div>
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
      </div>
    )),
    new Slide("chord-substitution", () => (
      <div>
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
      </div>
    )),
    /*new Slide("needs-name-700", () => (
      <div>
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
      <div style={exerciseContainerStyle}>
        {createStudyFlashCardSetComponent(
          ChordProgressionsQuiz.flashCardSet,
          /*isEmbedded*/ false,
          /*hideMoreInfoUri*/ true,
          /*title*/ undefined,
          /*style*/ undefined,
          /*enableSettings*/ undefined)}
      </div>
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
            <Button
              variant="contained"
              onClick={_ => this.moveToPreviousSlideInternal()}
              className="slide-nav"
              style={{ visibility: this.canMoveToPreviousSlide() ? "visible" : "hidden", padding: 0 }}
            >
              <i className="material-icons" style={{ fontSize: "4em" }}>keyboard_arrow_left</i>
            </Button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", textAlign: "center", flexGrow: 1, height: "100%" }}>
            {false ? this.renderSlideLocation() : null}
            <LimitedWidthContentContainer style={{ flexGrow: 1 }}>
              {renderedSlide}
            </LimitedWidthContentContainer>
          </div>

          <div>
            <Button
              variant="contained"
              onClick={_ => this.moveToNextSlideInternal()}
              className="slide-nav"
              style={{ visibility: this.canMoveToNextSlide() ? "visible" : "hidden", padding: 0 }}
            >
              <i className="material-icons" style={{ fontSize: "4em" }}>keyboard_arrow_right</i>
            </Button>
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
      <p style={{ textDecoration: "underline", textAlign: "center" }}>{slideGroup.name} - Slide {slideNumberInGroup} / {slideGroup.slides.length}</p>
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