import * as React from "react";

import { Margin } from "../../lib/Core/Margin";
import { Vector2D } from "../../lib/Core/Vector2D";

import { Pitch } from '../../lib/TheoryLib/Pitch';
import { PitchLetter } from '../../lib/TheoryLib/PitchLetter';
import { ScaleType, Scale } from "../../lib/TheoryLib/Scale";
import { ChordType } from "../../lib/TheoryLib/ChordType";
import { Chord, getUriComponent } from "../../lib/TheoryLib/Chord";

import { ActionBus, ActionHandler } from "../../ActionBus";
import { IAction } from "../../IAction";

import { WebMidiInitializedAction, MidiDeviceConnectedAction, MidiDeviceDisconnectedAction,
  MidiInputDeviceChangedAction, MidiInputDevicePitchRangeChangedAction } from "../../AppMidi/Actions";
  import { AppModel } from "../../App/Model";

import { createStudyFlashCardSetComponent, StudyFlashCardsView } from "../StudyFlashCards/View";

import { NavLinkView } from "../NavLinkView";

import { renderPianoKeyboardNoteNames, PianoKeyboardMetrics, PianoKeyboard } from "../Utils/PianoKeyboard";

import * as PianoNotes from "../Quizzes/Notes/PianoNotes";
import * as ScalesQuiz from "./ScalesQuiz";
import * as ChordsIntroQuiz from "./ChordsIntroQuiz";
import * as DiatonicChordsQuiz from "./DiatonicChordsQuiz";
import * as ChordProgressionsQuiz from "./ChordProgressionsQuiz";

import { naturalPitches, accidentalPitches, allPitches } from "../Quizzes/Notes/PianoNotes";
import { PianoScaleFormulaDiagram } from "../Utils/PianoScaleFormulaDiagram";
import { PianoScaleDronePlayer } from '../Utils/PianoScaleDronePlayer';
import { MidiInputDeviceSelect } from "../Utils/MidiInputDeviceSelect";
import { fullPianoLowestPitch, fullPianoHighestPitch, fullPianoNumWhiteKeys } from '../Utils/PianoUtils';
import { MidiPianoRangeInput } from "../Utils/MidiPianoRangeInput";
import { PianoScaleMajorRelativeFormulaDiagram } from "../Utils/PianoScaleMajorRelativeFormulaDiagram";
import { PlayablePianoKeyboard } from "../Utils/PlayablePianoKeyboard";
import { ChordView } from '../Utils/ChordView';
import { ChordDiagram, ChordProgressionPlayer } from "../Lessons/EssentialMusicTheory/ChordProgressions";

import { range } from '../../lib/Core/MathUtils';
import { Size2D } from '../../lib/Core/Size2D';
import { createFlashCardId, FlashCard } from "../../FlashCard";
import { majorScaleFormulaFlashCard, minorScaleFormulaFlashCard } from './ScalesQuiz';
import { FlashCardSet } from "../../FlashCardSet";
import { PressPianoKeysAllOctavesView } from "../Utils/PressPianoKeysAllOctavesView";
import { fifthIntervalFlashCard } from "./ChordsIntroQuiz";
import { renderNextButtonAnswerSelect, renderUserDeterminedCorrectnessAnswerSelect, renderStringAnswerSelect } from '../Quizzes/Utils';
import { ChordProgressionAnswerSelectView } from '../Utils/ChordProgressionAnswerSelectView';
import { Slide, Slideshow, SlideGroup } from "../Slideshow/Slideshow";
import { NoteText } from "../Utils/NoteText";

export const maxPianoWidth = 1000;
export const maxOneOctavePianoWidth = 400;
export const maxTwoOctavePianoWidth = 500;
const studyFlashCardsViewRenderCard = false;

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
        fillOpacity={0.2}
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
          <p>We recommend connecting a MIDI piano keyboard to follow along with this course.</p>
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
    new Slide(slideUrl, slideshow => (
      <MiniQuizSlide
        slideUrl={slideUrl}
        flashCards={flashCards}
        slideshow={slideshow} />
    ))
  );
}

interface IMiniQuizSlideProps {
  slideUrl: string;
  flashCards: Array<FlashCard>;
  slideshow: Slideshow;
}

class MiniQuizSlide extends React.Component<IMiniQuizSlideProps, {}> {
  public static readonly DelayAfterCorrectMs = 1000;

  public constructor(props: IMiniQuizSlideProps) {
    super(props);
    
    this.slideIndex = this.props.slideshow.getSlideIndex();
    this.boundOnQuizFinished = this.onQuizFinished.bind(this);
  }

  public componentWillUnmount() {
    if (this.delayAfterCorrectTimeoutId !== undefined) {
      window.clearTimeout(this.delayAfterCorrectTimeoutId);
      this.delayAfterCorrectTimeoutId = undefined;
    }
  }

  public render(): JSX.Element {
    const { slideUrl, flashCards } = this.props;

    const flashCardSetId = `ptMiniQuiz.${slideUrl}`;
    const flashCardSet = new FlashCardSet(flashCardSetId, /*name*/ "Piano Notes", () => flashCards);

    return (
      <div style={exerciseContainerStyle}>
        <StudyFlashCardsView
          key={flashCardSet.route}
          flashCardSet={flashCardSet}
          title=""
          quizMode={true}
          onQuizFinished={this.boundOnQuizFinished}
          hideMoreInfoUri={false}
          renderCard={studyFlashCardsViewRenderCard}
        />
      </div>
    );
  }

  private slideIndex: number;
  private boundOnQuizFinished: () => void;
  private delayAfterCorrectTimeoutId: number | undefined;

  private onQuizFinished() {
    const { slideshow } = this.props;

    this.delayAfterCorrectTimeoutId = window.setTimeout(() => {
      if (slideshow.getSlideIndex() === this.slideIndex) { // TODO: remove when bug is figured out
        slideshow.tryToMoveToNextSlide();
      }
    }, MiniQuizSlide.DelayAfterCorrectMs);
  }
}

interface IPressPianoKeysAllOctavesSlideProps {
  slideshow: Slideshow;
  pitches: Array<Pitch>;
}

class PressPianoKeysAllOctavesSlide extends React.Component<IPressPianoKeysAllOctavesSlideProps, {}> {
  public static readonly DelayAfterCorrectMs = 1000;

  public constructor(props: IPressPianoKeysAllOctavesSlideProps) {
    super(props);
    
    this.slideIndex = this.props.slideshow.getSlideIndex();
  }

  public componentWillUnmount() {
    if (this.delayAfterCorrectTimeoutId !== undefined) {
      window.clearTimeout(this.delayAfterCorrectTimeoutId);
      this.delayAfterCorrectTimeoutId = undefined;
    }
  }

  public render(): JSX.Element {
    const { pitches } = this.props;

    return (
      <PressPianoKeysAllOctavesView
        pitches={pitches}
        maxWidth={maxPianoWidth}
        onAllCorrectKeysPressed={() => this.onAllCorrectKeysPressed()}
        />
    );
  }

  private slideIndex: number;
  private delayAfterCorrectTimeoutId: number | undefined;

  private onAllCorrectKeysPressed() {
    const { slideshow } = this.props;

    this.delayAfterCorrectTimeoutId = window.setTimeout(() => {
      if (slideshow.getSlideIndex() === this.slideIndex) { // TODO: remove when bug is figured out
        slideshow.tryToMoveToNextSlide();
      }
    }, PressPianoKeysAllOctavesSlide.DelayAfterCorrectMs);
  }
}

function renderOrdinalNumeral(x: number): JSX.Element {
  switch (x) {
    case 1: return <span>1<sup>st</sup></span>;
    case 2: return <span>2<sup>nd</sup></span>;
    case 3: return <span>3<sup>rd</sup></span>;
    case 4: return <span>4<sup>th</sup></span>;
    case 5: return <span>5<sup>th</sup></span>;
    case 6: return <span>6<sup>th</sup></span>;
    case 7: return <span>7<sup>th</sup></span>;
    case 8: return <span>8<sup>th</sup></span>;
    case 9: return <span>9<sup>th</sup></span>;
    default: throw new Error();
  }
}

function renderDiatonicTriadSlideContents(scaleDegreeNumber: number): JSX.Element {
  const scale = new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4));
  const chord = scale.getDiatonicChord(scaleDegreeNumber, /*numChordPitches*/ 3);

  const chordTypeName = chord.type.name;
  const chordPitchStrings = chord.getPitches()
    .map(p => p.toString(/*includeOctaveNumber*/ false, /*useSymbols*/ true));
  const chordPitchesString = chordPitchStrings.join(", ");
  const chordName = `${chordPitchStrings[0]} ${chordTypeName}`;

  const renderedScaleDegree = renderOrdinalNumeral(scaleDegreeNumber);

  return (
    <div>
        <p>The diatonic triad built on the {renderedScaleDegree} degree of any major scale is always a <strong>{chordTypeName}</strong> chord.</p>
        <p>In the C major scale (C, D, E, F, G, A, B), this chord is <strong>{chordName}</strong>, which has a root note of <strong>{chordPitchStrings[0]}</strong> and consists of the notes <strong>{chordPitchesString}</strong>:</p>
        <ChordView
          chord={chord}
          showChordInfoText={false}
          scale={scale}
          showScaleDegreesOnPiano={true} />
      </div>
  );
}

function createDiatonicTriadSlide(scaleDegreeNumber: number): Slide {
  return new Slide(
    `c-major-diatonic-triad-${scaleDegreeNumber}`,
    () => renderDiatonicTriadSlideContents(scaleDegreeNumber)
  );
}

function createDiatonicTriadNotesQuizSlide(scaleDegreeNumber: number): Slide {
  const scale = new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4));
  const chord = scale.getDiatonicChord(scaleDegreeNumber, /*numChordPitches*/ 3);

  const chordPitches = chord.getPitches();

  const chordTypeName = chord.type.name;
  const chordRootPitchString = chord.rootPitch.toString(/*includeOctaveNumber*/ false, /*useSymbols*/ true);
  const chordName = `${chordRootPitchString} ${chordTypeName}`;

  const chordUriComponent = getUriComponent(chord);

  return new Slide(
    `${chordUriComponent}-chord-notes-quiz`,
    (slideshow) => (
      <div>
        <p>Press all the keys in the <strong>{chordName}</strong> on your MIDI keyboard (or on-screen) to continue.</p>
        <PressPianoKeysAllOctavesSlide
          slideshow={slideshow}
          pitches={chordPitches}
        />
      </div>
  ));
}

// TODO: dynamic width/height
export const pianoTheorySlideGroups = [
  new SlideGroup(
    "Introduction & Setup",
    "introduction",
    [
      new Slide("introduction", () => (
        <div>
          <div>
            <h1 style={{ marginBottom: "1em" }}>Understanding the Piano Keyboard</h1>
            <h2 style={{ marginBottom: "1em" }}>Section 1: Introduction &amp; Setup</h2>
            <p>Welcome to Falsetto's interactive course "Understanding the Piano Keyboard!"</p>
            <p>This is an interactive course designed to give you the tools to analyze the music you enjoy and compose your own music on the piano keyboard.</p>
            <p>This course is designed to be viewed on tablets and computer monitors, not on mobile phones due to screen space limitations.</p>
            <p>Without further ado, let's get started!</p>
            <p>Press the "<i className="material-icons" style={{ verticalAlign: "bottom" }}>keyboard_arrow_right</i>" on the right of this page, or press the right arrow key on your computer keyboard, to move to the next slide where we will set up your MIDI piano keyboard, if you have one.</p>
            <NoteText>This course is a work-in-progress. We are planning to add: intervals, scale fingerings, extended chords, more chord progressions, compositional tools, support for mobile devices, and more.</NoteText>
          </div>
        </div>
      )),
      new Slide("setup", () => <SetupSlideView />)
    ]
  ),

  new SlideGroup(
    "Notes",
    "notes",
    [
      new Slide("introduction", () => (
        <div>
          <h2>Section 2: Notes</h2>
          <p>This is a standard-size piano, which has a total of 88 white &amp; black keys:</p>
          <p><FullPiano /></p>
          <p>When pressed, each key produces a particular <strong>note</strong> &ndash; the "highness" or "lowness" of a sound.</p>
          <p>Keys further to the left produce lower notes, and keys further to the right produce higher notes.</p>
          <p>Try pressing the keys of your MIDI piano keyboard (or your computer keyboard, or click the piano above) to hear the notes that the keys produce.</p>
        </div>
      )),

      new Slide("piano-notes-repeat", () => (
        <div>
          <p>Every note has a name, which we must learn in order to navigate the instrument and communicate with other musicians.</p>
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
              <p><strong>Part 2:</strong> three black keys surrounded by four white keys:</p>
              <PianoKeyThreeBlackKeysPatternDiagram />
            </div>
          </div>

          <br />

          <p>Below are occurrences of the pattern on an 88-key piano keyboard highlighted in different colors. Try pressing keys in different sections of the keyboard, and notice how the same keys (relative to the repeating pattern) in different sections of the keyboard sound similar.</p>
          <PianoKeyPatternDiagram />
        </div>
      )),

      new Slide("c", (slideshow) => (
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
      
      new Slide("c-exercise", (slideshow) => (
        <div>
          <p>Press all the <strong>C</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesSlide
            slideshow={slideshow}
            pitches={[new Pitch(PitchLetter.C, 0, 4)]}
            />
        </div>
      )),
      
      new Slide("d", (slideshow) => (
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
      
      new Slide("d-exercise", (slideshow) => (
        <div>
          <p>Press all the <strong>D</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesSlide
            slideshow={slideshow}
            pitches={[new Pitch(PitchLetter.D, 0, 4)]}
            />
        </div>
      )),
      
      new Slide("e", (slideshow) => (
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
      
      new Slide("e-exercise", (slideshow) => (
        <div>
          <p>Press all the <strong>E</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesSlide
            slideshow={slideshow}
            pitches={[new Pitch(PitchLetter.E, 0, 4)]}
            />
        </div>
      )),
      
      new Slide("f", (slideshow) => (
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
      
      new Slide("f-exercise", (slideshow) => (
        <div>
          <p>Press all the <strong>F</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesSlide
            slideshow={slideshow}
            pitches={[new Pitch(PitchLetter.F, 0, 4)]}
            />
        </div>
      )),
      
      new Slide("g", (slideshow) => (
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
      
      new Slide("g-exercise", (slideshow) => (
        <div>
          <p>Press all the <strong>G</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesSlide
            slideshow={slideshow}
            pitches={[new Pitch(PitchLetter.G, 0, 4)]}
            />
        </div>
      )),
      
      new Slide("a", (slideshow) => (
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
      
      new Slide("a-exercise", (slideshow) => (
        <div>
          <p>Press all the <strong>A</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesSlide
            slideshow={slideshow}
            pitches={[new Pitch(PitchLetter.A, 0, 4)]}
            />
        </div>
      )),
      
      new Slide("b", (slideshow) => (
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
      
      new Slide("b-exercise", (slideshow) => (
        <div>
          <p>Press all the <strong>B</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesSlide
            slideshow={slideshow}
            pitches={[new Pitch(PitchLetter.B, 0, 4)]}
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
      
      new Slide("white-notes-exercise", () => (
        <div style={exerciseContainerStyle}>
          {createStudyFlashCardSetComponent(
            PianoNotes.createFlashCardSet(naturalPitches),
            /*hideMoreInfoUri*/ true,
            /*title*/ "White Piano Key Names Exercise",
            /*style*/ undefined,
            /*enableSettings*/ undefined,
            /*renderCard*/ studyFlashCardsViewRenderCard)}
          </div>
      )),
      
      new Slide("c-sharp", (slideshow) => (
        <div>
          <p>Now let's learn the names of the 5 black piano keys in the repeating pattern.</p>
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
      
      new Slide("c-sharp-exercise", (slideshow) => (
        <div>
          <p>Press all the <strong>C♯</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesSlide
            slideshow={slideshow}
            pitches={[new Pitch(PitchLetter.C, 1, 4)]}
            />
        </div>
      )),
      
      new Slide("d-flat", (slideshow) => (
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
      
      new Slide("d-flat-exercise", (slideshow) => (
        <div>
          <p>Press all the <strong>D♭</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesSlide
            slideshow={slideshow}
            pitches={[new Pitch(PitchLetter.D, -1, 4)]}
            />
        </div>
      )),
      
      new Slide("d-sharp-e-flat", (slideshow) => (
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
      
      new Slide("d-sharp-e-flat-exercise", (slideshow) => (
        <div>
          <p>Press all the <strong>D♯/E♭</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesSlide
            slideshow={slideshow}
            pitches={[new Pitch(PitchLetter.D, 1, 4)]}
            />
        </div>
      )),

      new Slide("f-sharp-g-flat", (slideshow) => (
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
      
      new Slide("f-sharp-g-flat-exercise", (slideshow) => (
        <div>
          <p>Press all the <strong>F♯/G♭</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesSlide
            slideshow={slideshow}
            pitches={[new Pitch(PitchLetter.F, 1, 4)]}
            />
        </div>
      )),

      new Slide("g-sharp-a-flat", (slideshow) => (
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
      
      new Slide("g-sharp-a-flat-exercise", (slideshow) => (
        <div>
          <p>Press all the <strong>G♯/A♭</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesSlide
            slideshow={slideshow}
            pitches={[new Pitch(PitchLetter.G, 1, 4)]}
            />
        </div>
      )),

      new Slide("a-sharp-b-flat", (slideshow) => (
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
      
      new Slide("a-sharp-b-flat-exercise", (slideshow) => (
        <div>
          <p>Press all the <strong>A♯/B♭</strong>'s on your MIDI keyboard (or on-screen) to continue.</p>
          <PressPianoKeysAllOctavesSlide
            slideshow={slideshow}
            pitches={[new Pitch(PitchLetter.A, 1, 4)]}
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
      
      new Slide("black-notes-exercise", () => (
        <div style={exerciseContainerStyle}>
          {createStudyFlashCardSetComponent(
            PianoNotes.createFlashCardSet(accidentalPitches),
            /*hideMoreInfoUri*/ true,
            /*title*/ "Black Piano Key Names Exercise",
            /*style*/ undefined,
            /*enableSettings*/ undefined,
            /*renderCard*/ studyFlashCardsViewRenderCard)}
        </div>
      )),
      
      new Slide("summary", () => (
        <div>
          <p>You have now learned the names of all 12 notes in the repeating pattern of piano keys!</p>
          <p>
            <PianoNotesDiagram
              lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
              highestPitch={new Pitch(PitchLetter.B, 0, 4)}
              maxWidth={maxOneOctavePianoWidth / 2}
              labelWhiteKeys={true}
              labelBlackKeys={true} />
          </p>
          <p>And here are all the note names on an 88 key piano keyboard:</p>
          <p>
            <PianoNotesDiagram
              lowestPitch={fullPianoLowestPitch}
              highestPitch={fullPianoHighestPitch}
              maxWidth={maxPianoWidth}
              labelWhiteKeys={true}
              labelBlackKeys={true} />
          </p>
          <p>Study these note names, then move to the next slide to practice your knowledge with an interactive exercise.</p>
        </div>
      )),

      new Slide("exercise", () => (
        <div style={exerciseContainerStyle}>
          {createStudyFlashCardSetComponent(
            PianoNotes.createFlashCardSet(allPitches),
            /*hideMoreInfoUri*/ true,
            /*title*/ "Piano Notes Exercise",
            /*style*/ undefined,
            /*enableSettings*/ undefined,
            /*renderCard*/ studyFlashCardsViewRenderCard)}
        </div>
      )),
    ]
  ),

  new SlideGroup(
    "Scales",
    "scales",
    [
      new Slide("introduction", () => (
        <div>
          <h2>Section 3: Scale Basics</h2>
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
            <PressPianoKeysAllOctavesSlide
            slideshow={slideshow}
              pitches={pitches}
              />
          </div>
        );
      }),

      // createMiniQuizSlide(
      //   "c-major-scale-notes-quiz",
      //   [createPressAllScaleNotesFlashCard("cMajorScaleNotes", new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4)))]
      // ),

      new Slide("major", () => (
        <div>
          <p>Major scales, like the <strong>C major</strong> scale we saw on the last slide, are very common in music.</p>
          <p>All major scales are built with the same formula: "<strong>W W H W W W</strong>", where:</p>
          <p>
            <strong>"W"</strong> means the next note is a <strong>whole step</strong> (2 keys) higher than the previous note.
            <br />
            <strong>"H"</strong> means the next note is a <strong>half step</strong> (1 key) higher than of the previous note.
          </p>
          <p>To figure out the notes in any major scale, you simply pick a note and follow the major scale formula.</p>

          <p>
            <PianoScaleFormulaDiagram
              scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))}
              octaveCount={2}
              maxWidth={maxTwoOctavePianoWidth} />
          </p>
          
        </div>
      )),
      createMiniQuizSlide("major-scale-formula-quiz", [majorScaleFormulaFlashCard]),
      
      new Slide("degrees", () => (
        <div>
          <p>The major scale formula (<strong>W W H W W W</strong>) gives us the notes of major scales in a particular order (ex: <strong>C, D, E, F, G, A, B</strong> for <strong>C major</strong>).</p>
          <p>Musicians sometimes number scale notes in this order and call the scale notes <strong>"degrees"</strong> &mdash; for example, we can say that C is the <strong>"1st degree"</strong>, of C major, that D is the <strong>"2nd degree"</strong> of C major, and so on.</p>
          <p>The 1st degree of a scale <strong>generally sounds stable and "like home"</strong>, and it is common for musical phrases to begin and/or end with this scale degree.</p>
          <p>Try coming up with musical phrases beginning and/or ending on the piano keyboard below to hear this for yourself!</p>
          <p>
            <PianoScaleDronePlayer
              scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))}
              octaveCount={2}
              maxWidth={maxTwoOctavePianoWidth} />
          </p>
          <NoteText>Though scale formulas define the notes of a scale in a particular order, you are free to play the notes in any order you like.</NoteText>
        </div>
      )),

      new Slide("natural-minor", () => (
        <div>
          <p>Another way to write scale formulas is <strong>relative to the major scale</strong>.</p>
          <p>If we assign a number to each note in the major scale, starting with 1, we have: <strong className="no-wrap">1, 2, 3, 4, 5, 6, 7</strong></p>
          <p>We can then raise or lower the notes with sharps or flats to write formulas for other scales relative to the major scale.</p>
          <p>For example, another common type of scale is the <strong>natural minor scale</strong> (sometimes simply called the <strong>minor</strong> scale), which has a major-scale-relative formula of: <strong className="no-wrap">1, 2, 3♭, 4, 5, 6♭, 7♭</strong>.</p>
          <p>To figure out the notes of the <strong>C minor scale</strong>, for example, using the major-scale-relative formula above, we can take the notes of the <strong>C major scale</strong> (<span className="no-wrap">C, D, E, F, G, A, B</span>) and flattening degrees 3, 6, &amp; 7, giving us: <strong className="no-wrap">C, D, E♭, F, G, A♭, B♭</strong>.</p>
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
            <PressPianoKeysAllOctavesSlide
              slideshow={slideshow}
              pitches={pitches}
              />
          </div>
        );
      }),

      new Slide("summary", () => (
        <div>
          <p>Take some time to review material below, then move to the next slide to practice your knowledge of scales with an interactive exercise.</p>
          
          <br />
          
          <p>Scales are <strong>sets of notes</strong>.</p>
          <p>The formula for all major scales is <strong>W W H W W W</strong>.</p>
          <p>In scale formulas, <strong>"H" means the next note is a "half step" (1 key) to the right of the previous note</strong>.</p>
          <p>In scale formulas, <strong>"W" means the next note is a "whole step" (2 keys) to the right of the previous note</strong>.</p>
          <p>Though scale formulas define the notes of a scale in a particular order, <strong>you are free to play the notes in any order you like</strong>.</p>
          <p>A <strong>scale degree</strong> is the number of a note in a scale, in ascending order, starting from 1.</p>
          <p>The 1st degree of a scale <strong>generally sounds stable and "like home."</strong></p>
          <p>The major-scale-relative formula for all <strong>natural minor scales</strong> (also simply called <strong>minor scales</strong>) is <strong>1, 2, 3♭, 4, 5, 6♭, 7♭</strong>.</p>
          <p>The <strong>C major scale</strong> consists of the notes <strong className="no-wrap">C, D, E, F, G, A, B</strong>.</p>
          <p>The <strong>C natural minor scale</strong> (a.k.a. the <strong>C minor scale</strong>) consists of the notes <strong className="no-wrap">C, D, E♭, F, G, A♭, B♭</strong>.</p>
        </div>
      )),

      new Slide("exercise", () => (
        <div style={exerciseContainerStyle}>
          {createStudyFlashCardSetComponent(
            ScalesQuiz.flashCardSet,
            /*hideMoreInfoUri*/ true,
            /*title*/ undefined,
            /*style*/ undefined,
            /*enableSettings*/ undefined,
            /*renderCard*/ studyFlashCardsViewRenderCard)}
        </div>
      )),

      new Slide("next-steps", () => (
        <div>
          <h2>Next Steps</h2>
          <p>You have now learned about scales, and memorized a couple of them, but there are 500+ scales you can familiarize yourself with in your own time in the <NavLinkView to="/scale-exercises" openNewTab={true}>Scale Mastery</NavLinkView> section of the course.</p>
          <p>For now, we will continue on to learn about <strong>chords</strong>.</p>
        </div>
      )),
    ],
    /*isPremium*/ true
  ),

  new SlideGroup(
    "Chords",
    "chords",
    [
      new Slide("introduction", () => (
        <div>
          <h2>Section 4.1: Chord Basics</h2>
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
            <PressPianoKeysAllOctavesSlide
              slideshow={slideshow}
              pitches={pitches}
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
            <PressPianoKeysAllOctavesSlide
              slideshow={slideshow}
              pitches={pitches}
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
            <PressPianoKeysAllOctavesSlide
              slideshow={slideshow}
              pitches={pitches}
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
            <PressPianoKeysAllOctavesSlide
              slideshow={slideshow}
              pitches={pitches}
              />
          </div>
        );
      }),
      
      new Slide("introduction-review", () => (
        <div>
          <p>Review material below, then move to the next slide to practice your knowledge of chords with an interactive exercise.</p>
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
      
      new Slide("introduction-exercise", () => (
        <div style={exerciseContainerStyle}>
          {createStudyFlashCardSetComponent(
            ChordsIntroQuiz.flashCardSet,
            /*hideMoreInfoUri*/ true,
            /*title*/ undefined,
            /*style*/ undefined,
            /*enableSettings*/ undefined,
            /*renderCard*/ studyFlashCardsViewRenderCard)}
        </div>
      )),

      new Slide("diatonic-chords", () => (
        <div>
          <h2>Section 4.2: Diatonic Chords</h2>
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
          <p>Let's take a look at all the 3-note diatonic chords built with thirds in the major scale.</p>
          <NoteText>Chords with 3 distinct notes are also called <strong>triads</strong>.</NoteText>
          <p>Each of the 7 degrees of the major scale has a particular type of diatonic triad built on top of it, so there are 7 diatonic triads in major scales.</p>
          <br />
          {renderDiatonicTriadSlideContents(/*scaleDegreeNumber*/ 1)}
        </div>
      )),
      new Slide("c-major-chord-notes-quiz", (slideshow) => {
        const pitches = new Chord(ChordType.Major, new Pitch(PitchLetter.C, 0, 4)).getPitches();

        return (
          <div>
            <p>Press all the keys in the <strong>C major chord</strong> on your MIDI keyboard (or on-screen) to continue.</p>
            <PressPianoKeysAllOctavesSlide
              slideshow={slideshow}
              pitches={pitches}
              />
          </div>
        );
      }),

      createDiatonicTriadSlide(/*scaleDegreeNumber*/ 2),
      new Slide("d-minor-chord-notes-quiz", (slideshow) => {
        const pitches = new Chord(ChordType.Minor, new Pitch(PitchLetter.D, 0, 4)).getPitches();

        return (
          <div>
            <p>Press all the keys in the <strong>D minor chord</strong> on your MIDI keyboard (or on-screen) to continue.</p>
            <PressPianoKeysAllOctavesSlide
              slideshow={slideshow}
              pitches={pitches}
              />
          </div>
        );
      }),
      
      createDiatonicTriadSlide(/*scaleDegreeNumber*/ 3),
      new Slide("e-minor-chord-notes-quiz", (slideshow) => {
        const pitches = new Chord(ChordType.Minor, new Pitch(PitchLetter.E, 0, 4)).getPitches();

        return (
          <div>
            <p>Press all the keys in the <strong>E minor chord</strong> on your MIDI keyboard (or on-screen) to continue.</p>
            <PressPianoKeysAllOctavesSlide
              slideshow={slideshow}
              pitches={pitches}
              />
          </div>
        );
      }),

      createDiatonicTriadSlide(/*scaleDegreeNumber*/ 4),
      new Slide("f-major-chord-notes-quiz", (slideshow) => {
        const pitches = new Chord(ChordType.Major, new Pitch(PitchLetter.F, 0, 4)).getPitches();

        return (
          <div>
            <p>Press all the keys in the <strong>F major chord</strong> on your MIDI keyboard (or on-screen) to continue.</p>
            <PressPianoKeysAllOctavesSlide
              slideshow={slideshow}
              pitches={pitches}
              />
          </div>
        );
      }),

      createDiatonicTriadSlide(/*scaleDegreeNumber*/ 5),
      new Slide("g-major-chord-notes-quiz", (slideshow) => {
        const pitches = new Chord(ChordType.Major, new Pitch(PitchLetter.G, 0, 4)).getPitches();

        return (
          <div>
            <p>Press all the keys in the <strong>G major chord</strong> on your MIDI keyboard (or on-screen) to continue.</p>
            <PressPianoKeysAllOctavesSlide
              slideshow={slideshow}
              pitches={pitches}
              />
          </div>
        );
      }),

      createDiatonicTriadSlide(/*scaleDegreeNumber*/ 6),
      new Slide("a-minor-chord-notes-quiz", (slideshow) => {
        const pitches = new Chord(ChordType.Minor, new Pitch(PitchLetter.A, 0, 4)).getPitches();

        return (
          <div>
            <p>Press all the keys in the <strong>A minor chord</strong> on your MIDI keyboard (or on-screen) to continue.</p>
            <PressPianoKeysAllOctavesSlide
              slideshow={slideshow}
              pitches={pitches}
              />
          </div>
        );
      }),

      createDiatonicTriadSlide(/*scaleDegreeNumber*/ 7),
      new Slide("b-diminished-chord-notes-quiz", (slideshow) => {
        const pitches = new Chord(ChordType.Diminished, new Pitch(PitchLetter.B, 0, 4)).getPitches();

        return (
          <div>
            <p>Press all the keys in the <strong>B diminished chord</strong> on your MIDI keyboard (or on-screen) to continue.</p>
            <PressPianoKeysAllOctavesSlide
              slideshow={slideshow}
              pitches={pitches}
              />
          </div>
        );
      }),
      
      new Slide("diatonic-chords-review", () => (
        <div>
          <p>Review material below, then move to the next slide to practice your knowledge of diatonic chords with an interactive exercise.</p>
          <br />
          <p><strong>Diatonic chords</strong> are chords consisting solely of notes from a particular scale.</p>
          <p><strong>Triads</strong> are chords with 3 distinct notes.</p>
          <br />
          <p>The diatonic triad build on the 1st degree of any major scale is always a <strong>major</strong> chord.<br />The 1st diatonic triad in the C Major scale built with thirds is <strong>C major</strong>, which has a root note of <strong>C</strong> and consists of the notes <strong>C, E, G</strong>.</p>
          <p>The diatonic triad build on the 2nd degree of any major scale is always a <strong>minor</strong> chord.<br />The 2nd diatonic triad in the C Major scale built with thirds is <strong>D minor</strong>, which has a root note of <strong>D</strong> and consists of the notes <strong>D, F, A</strong>.</p>
          <p>The diatonic triad build on the 3rd degree of any major scale is always a <strong>minor</strong> chord.<br />The 3rd diatonic triad in the C Major scale built with thirds is <strong>E minor</strong>, which has a root note of <strong>E</strong> and consists of the notes <strong>E, G, B</strong>.</p>
          <p>The diatonic triad build on the 4th degree of any major scale is always a <strong>major</strong> chord.<br />The 4th diatonic triad in the C Major scale built with thirds is <strong>F major</strong>, which has a root note of <strong>F</strong> and consists of the notes <strong>F, A, C</strong>.</p>
          <p>The diatonic triad build on the 5th degree of any major scale is always a <strong>major</strong> chord.<br />The 5th diatonic triad in the C Major scale built with thirds is <strong>G major</strong>, which has a root note of <strong>G</strong> and consists of the notes <strong>G, B, D</strong>.</p>
          <p>The diatonic triad build on the 6th degree of any major scale is always a <strong>minor</strong> chord.<br />The 6th diatonic triad in the C Major scale built with thirds is <strong>A minor</strong>, which has a root note of <strong>A</strong> and consists of the notes <strong>A, C, E</strong>.</p>
          <p>The diatonic triad build on the 7th degree of any major scale is always a <strong>diminished</strong> chord.<br />The 7th, and last, diatonic triad in the C Major scale built with thirds is <strong>B diminished</strong>, which has a root note of <strong>B</strong> and consists of the notes <strong>B, D, F</strong>.</p>
        </div>
      )),
      
      new Slide("diatonic-chords-exercise", () => (
        <div style={exerciseContainerStyle}>
          {createStudyFlashCardSetComponent(
            DiatonicChordsQuiz.flashCardSet,
            /*hideMoreInfoUri*/ true,
            /*title*/ undefined,
            /*style*/ undefined,
            /*enableSettings*/ undefined,
            /*renderCard*/ studyFlashCardsViewRenderCard)}
        </div>
      )),
      
      new Slide("next-steps", () => (
        <div>
          <h2>Next Steps</h2>
          <p>You have now learned the basics about chords and memorized a some of them, but there are 700+ chords you can familiarize yourself in your own time in the <NavLinkView to="/chord-exercises" openNewTab={true}>Chord Mastery</NavLinkView> section of the course.</p>
          <p>For now, we will continue on to cover <strong>chord progressions</strong>.</p>
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

      new Slide("review-3", () => (
        <div>
          <p>Review material below, then move to the next slide to test your knowledge of chords with an interactive exercise.</p>
          <br />
          <p>The note you choose to make the <strong>lowest note in the chord (the bass)</strong> determines which <strong>inversion</strong> the chord is in.</p>
          <p>A chord played with the <strong>root note</strong> in the bass is said to be in <strong>root position</strong>.</p>
          <p>A chord played with the <strong>3rd</strong> in the bass is said to be in <strong>1st inversion</strong>.</p>
          <p>A chord played with the <strong>5th</strong> in the bass is said to be in <strong>2nd inversion</strong>.</p>
          <p><strong>Arpeggios</strong> are sequences of chord notes played separately instead of simultaneously.</p>
          <p>Chords notes are sometimes referred to by <strong>the number of the note in the scale they come from</strong> (ex: "E" in C Major may be called the 3rd).</p>
        </div>
      )),

      new Slide("quiz-3", () => (
        <div>
          <p>QUIZ</p>
        </div>
      )),*/
    ],
    /*isPremium*/ true
  ),

  new SlideGroup(
    "Chord Progressions",
    "chord-progressions",
    [
      new Slide("introduction", () => (
        <div>
          <h2>Section 5: Chord Progression Basics</h2>
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
      new Slide("roman-numeral-notation", () => (
        <div>
          <p>Chord progressions are generally built with <strong>diatonic chords</strong> (chords build solely with notes in a particular scale).</p>
          <p>The chord progression we just saw, for example (<strong>D Minor</strong>, <strong>G7</strong>, <strong>C Major</strong>), consists solely of chords diatonic to the <strong>C Major scale</strong>.</p>
          <p>As we've learned, diatonic chords have root notes associated with scale degree. We can take advantage of this and represent diatonic chord progressions in a compact, scale-independent way with <strong>roman numeral notation</strong>, which uses upper-case &amp; lower-case roman numerals (an alternative way of writing numbers), with added symbols, to represent diatonic chords built on scale degrees.</p>
          <br />
          <p>If you aren't familiar with roman numerals, here are the roman numerals from 1 to 7:</p>
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>4</th>
                <th>5</th>
                <th>6</th>
                <th>7</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>upper-case</td>
                <td>I</td>
                <td>II</td>
                <td>III</td>
                <td>IV</td>
                <td>V</td>
                <td>VI</td>
                <td>VII</td>
              </tr>
              <tr>
                <td>lower-case</td>
                <td>i</td>
                <td>ii</td>
                <td>iii</td>
                <td>iv</td>
                <td>v</td>
                <td>vi</td>
                <td>vii</td>
              </tr>
            </tbody>
          </table>
          <br />
        </div>
      )),
      new Slide("roman-numeral-notation-2", () => (
        <div>
          <p>In <strong>roman numeral notation</strong>, the chord progression (<strong>D minor</strong>, <strong>G7</strong>, <strong>C major</strong>) in the <strong>C Major scale</strong> would be written with roman numerals, as: <strong>ii - V7 - I</strong>:</p>
          <br />
          <h4 style={{ textDecoration: "underline" }}>ii</h4>
          <p><strong>ii</strong> is the roman numeral for <strong>2</strong>, meaning it represents the diatonic chord with the <strong>2nd</strong> scale note (<strong>D</strong> in this example) as a root note.</p>
          <p><strong>ii</strong> is also lower-case, which signifies that the chord is a <strong>minor</strong> chord.</p>
          <p>So, <strong>ii</strong> means <strong>D minor</strong> in this example.</p>
          <br />
          <h4 style={{ textDecoration: "underline" }}>V7</h4>
          <p>The <strong>V</strong> in <strong>V7</strong> represents the diatonic chord with the <strong>5th</strong> scale note (<strong>G</strong> in this example) as a root note.</p>
          <p><strong>V</strong> is upper-case to signify that the chord is based on a <strong>major</strong> chord (dominant 7th chords are major triads with an added note).</p>
          <p>And the <strong>7</strong> in <strong>V7</strong> signifies that the chord is a <strong>dominant 7th chord</strong>.</p>
          <p>So, <strong>V7</strong> means <strong>G7</strong> in this example.</p>
          <br />
          <h4 style={{ textDecoration: "underline" }}>I</h4>
          <p>Lastly, <strong>I</strong> signifies a major chord with the <strong>1st</strong> scale note (<strong>C</strong> in this example) as a root note.</p>
          <p>So, <strong>I</strong> means <strong>C major</strong> in this example.</p>
          <br />
          <p>So, writing "<strong>ii - V7 - I</strong>" in C Major is equivalent to writing "<strong>D minor, G7, C major</strong>."</p>
        </div>
      )),
      
      createMiniQuizSlide("roman-numeral-notation-quiz", [
        FlashCard.fromRenderFns(
          createFlashCardId("roman-numeral-notation-quiz", { id: "numeral-meaning" }),
          "What does the roman numeral (ex: \"V\" in \"V7\") represent, ignoring upper-case/lower-case?",
          "the scale degree the chord is built on",
          renderNextButtonAnswerSelect
        ),
        FlashCard.fromRenderFns(
          createFlashCardId("roman-numeral-notation-quiz", { id: "upper-case-meaning" }),
          "What type of chord does an upper-case roman numeral represent?",
          "major",
          renderNextButtonAnswerSelect
        ),
        FlashCard.fromRenderFns(
          createFlashCardId("roman-numeral-notation-quiz", { id: "lower-case-meaning" }),
          "What type of chord does a lower-case roman numeral represent?",
          "minor",
          renderNextButtonAnswerSelect
        ),
        FlashCard.fromRenderFns(
          createFlashCardId("roman-numeral-notation-quiz", { id: "7-symbol-meaning" }),
          "What does the \"7\" in \"V7\" mean?",
          "the chord is a dominant 7th chord",
          renderNextButtonAnswerSelect
        ),
      ]),

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
          <br />
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
      
      createMiniQuizSlide("descending-fifth-progression-quiz", [
        FlashCard.fromRenderFns(
          createFlashCardId("descending-fifth-progression-quiz", "chord-after-4"),
          "What chord comes after IV in a descending fifth progression?",
          "vii°",
          info => renderStringAnswerSelect(["I", "ii", "iii", "IV", "V", "vi", "vii°"], info)
        ),
      ]),

      new Slide("circle-progression", () => (
        <div>
          <p>You can repeatedly chain together descending fifth progressions to create a <strong>circle progression</strong>, which progresses through all 7 diatonic chords of a scale:</p>
          <p>Starting with <strong>I</strong> in a major scale and chaining together descending fifth progressions, we get: <strong>I - IV - vii° - iii - vi - ii - V - I</strong>:</p>
          <p>
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
          </p>
          <NoteText>Lower-case roman numerals with a <strong>°</strong> symbol means the chord is a <strong>diminished</strong> chord.</NoteText>
        </div>
      )),

      createMiniQuizSlide("circle-progression-quiz", [
        FlashCard.fromRenderFns(
          createFlashCardId("circle-progression-quiz", { id: "circleProgression" }),
          "What chords are in the circle progression, starting and ending with I?",
          "I - IV - vii° - iii - vi - ii - V - I",
          info => <ChordProgressionAnswerSelectView info={info} correctAnswer={"I - IV - vii° - iii - vi - ii - V - I"} />
        ),
      ]),

      new Slide("voice-leading", () => (
        <div>
          <p>Using good <strong>voice leading</strong> can help chord progressions sound better when played.</p>
          <p><strong>Voice leading</strong> is the arrangement of chord notes in a progression to create smooth transitions between chords.</p>
          <p>The most important rule of voice leading is <strong>to use the smallest possible movements when transitioning from one chord from the next</strong>.</p>
          <br />
          <p>Press the play button below to hear "bad" voice leading in a ii - V7 - I progression, which makes big jumps between each chord, followed by good voice leading:</p>
          <p>
            <ChordProgressionPlayer
              chordsPitches={[
                [new Pitch(PitchLetter.D, 0, 5), new Pitch(PitchLetter.F, 0, 5), new Pitch(PitchLetter.A, 0, 5)],
                [new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.B, 0, 4), new Pitch(PitchLetter.D, 0, 5), new Pitch(PitchLetter.F, 0, 5)],
                [new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.E, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.C, 0, 5)],

                [new Pitch(PitchLetter.D, 0, 4), new Pitch(PitchLetter.F, 0, 4), new Pitch(PitchLetter.A, 0, 4)],
                [new Pitch(PitchLetter.D, 0, 4), new Pitch(PitchLetter.F, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.B, 0, 4)],
                [new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.E, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.C, 0, 5)]
              ]}
              chords={[
                new Chord(ChordType.Minor, new Pitch(PitchLetter.D, 0, 4)),
                new Chord(ChordType.Dom7, new Pitch(PitchLetter.G, 0, 4)),
                new Chord(ChordType.Major, new Pitch(PitchLetter.C, 0, 4)),
                
                new Chord(ChordType.Minor, new Pitch(PitchLetter.D, 0, 4)),
                new Chord(ChordType.Dom7, new Pitch(PitchLetter.G, 0, 4)),
                new Chord(ChordType.Major, new Pitch(PitchLetter.C, 0, 4))
              ]}
              chordStartDelaysMs={[0, 1500, 3000, 6000, 7500, 9000]}
              scale={new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4))}
              chordScaleDegreeNumbers={[2, 5, 1, 2, 5, 1]}
              maxWidth={maxTwoOctavePianoWidth} />
          </p>
          <NoteText>You are free to intentionally break this rule, just like any other "rule" in music theory, if doing so produces the sound you're looking for!</NoteText>
        </div>
      )),
      
      createMiniQuizSlide("voice-leading-quiz", [
        FlashCard.fromRenderFns(
          createFlashCardId("voice-leading-quiz", { id: "voiceLeadingMostImportantRule" }),
          "What is the most important rule of voice leading?",
          "use the smallest possible movements when transitioning from one chord from the next",
          renderUserDeterminedCorrectnessAnswerSelect
        ),
      ]),

      new Slide("chord-substitution", () => (
        <div>
          <p>One common technique used to spice up chord progressions is <strong>chord substitution</strong>.</p>
          <p><strong>Chord substitution</strong> is replacing one chord with another that sounds similar or has a similar "feel" in the progression.</p>
          <p>One way to find chords that sound similar to another chord is looking for chords which share many of the same notes.</p>
          <p>For example, in C Major, the <strong>ii</strong> chord (D minor - D F A) and the <strong>IV</strong> chord (F Major - F A C) share two notes in common (F and A), so they have a similar sound and work as substitutes for each other in chord progressions.</p>

          <p>So, we can take a ii - V7 - I progression, for example, and use chord substitution to create a new chord progression &ndash; IV - V7 - I. Press the play button below to hear both chord progressions:</p>
          <p>
            <ChordProgressionPlayer
              chordsPitches={[
                [new Pitch(PitchLetter.D, 0, 4), new Pitch(PitchLetter.F, 0, 4), new Pitch(PitchLetter.A, 0, 4)],
                [new Pitch(PitchLetter.D, 0, 4), new Pitch(PitchLetter.F, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.B, 0, 4)],
                [new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.E, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.C, 0, 5)],
                
                [new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.F, 0, 4), new Pitch(PitchLetter.A, 0, 4)],
                [new Pitch(PitchLetter.D, 0, 4), new Pitch(PitchLetter.F, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.B, 0, 4)],
                [new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.E, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.C, 0, 5)]
              ]}
              chords={[
                new Chord(ChordType.Minor, new Pitch(PitchLetter.D, 0, 4)),
                new Chord(ChordType.Dom7, new Pitch(PitchLetter.G, 0, 4)),
                new Chord(ChordType.Major, new Pitch(PitchLetter.C, 0, 4)),
                
                new Chord(ChordType.Major, new Pitch(PitchLetter.F, 0, 4)),
                new Chord(ChordType.Dom7, new Pitch(PitchLetter.G, 0, 4)),
                new Chord(ChordType.Major, new Pitch(PitchLetter.C, 0, 4))
              ]}
              chordStartDelaysMs={[0, 1500, 3000, 6000, 7500, 9000]}
              scale={new Scale(ScaleType.Major, new Pitch(PitchLetter.C, 0, 4))}
              chordScaleDegreeNumbers={[2, 5, 1, 4, 5, 1]}
              maxWidth={maxTwoOctavePianoWidth} />
          </p>
        </div>
      )),
      
      createMiniQuizSlide("chord-substitution-quiz", [
        FlashCard.fromRenderFns(
          createFlashCardId("chord-substitution-quiz", { id: "chordSubstitutionDef" }),
          "What is chord substitution?",
          "replacing one chord with another that sounds similar or has a similar \"feel\" in the progression",
          renderUserDeterminedCorrectnessAnswerSelect
        ),
        FlashCard.fromRenderFns(
          createFlashCardId("chord-substitution-quiz", { id: "chordsSharingNotesSimilar" }),
          "One way to find chords that sound similar to another chord is looking for chords which _.",
          "share many of the same notes",
          renderUserDeterminedCorrectnessAnswerSelect
        ),
      ]),

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

      new Slide("review", () => (
        <div>
          <p>Review material below, then move to the next slide to practice your knowledge of chord progressions with an interactive.</p>
          <br />
          <p><strong>Chord progressions</strong> are sequences of chords.</p>
          <p><strong>Chord progressions</strong> are generally built with <strong>diatonic chords</strong>.</p>
          <p><strong>Roman numeral notation</strong> is a concise, scale-independent way to represent chord progressions.</p>
          <p>In roman numeral notation, the roman numeral represents the number of the scale note that the chord is built on.</p>
          <p>In roman numeral notation, chords based on the major triad are <strong>upper-case</strong> (ex: IV, V7).</p>
          <p>In roman numeral notation, chords based on the minor triad are <strong>lower-case</strong>. (ex: ii, vii°)</p>
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

      new Slide("exercise", () => (
        <div style={exerciseContainerStyle}>
          {createStudyFlashCardSetComponent(
            ChordProgressionsQuiz.flashCardSet,
            /*hideMoreInfoUri*/ true,
            /*title*/ undefined,
            /*style*/ undefined,
            /*enableSettings*/ undefined,
            /*renderCard*/ studyFlashCardsViewRenderCard)}
        </div>
      )),
    ],
    /*isPremium*/ true
  ),
  
  new SlideGroup(
    "Conclusion",
    "conclusion",
    [
      new Slide("next-steps", () => (
        <div>
          <h2>Conclusion &amp; Next Steps</h2>
          <p>We have come to the end of the "Understanding the Piano Keyboard" course!</p>
          <p>With the essentials of music theory under your belt, you should now have a better understanding of music as a whole, and of the piano keyboard.</p>
          <p>We encourage you to continue your study of scales and chords with the <NavLinkView to="/scale-exercises" openNewTab={true}>Self-Paced Scale Mastery</NavLinkView> and <NavLinkView to="/chord-exercises" openNewTab={true}>Self-Paced Chord Mastery</NavLinkView> sections of this website, and to experiment with your knowledge to come up with original ideas and develop your musical voice.</p>
          <p>You are also equipped to tackle more advanced and specialized music theory in the musical genres that interest you, and we have included some useful links to other websites below to continue your studies in whatever direction you choose:</p>
          <ul>
            <li><a href="http://openmusictheory.com/contents.html" target="_blank">Open Music Theory</a></li>
            <li><a href="http://www.thejazzpianosite.com/jazz-piano-lessons/" target="_blank">www.thejazzpianosite.com</a> (and accompanying <a href="https://www.youtube.com/channel/UCk24OnGLcP5XlTBjZ9WBWvw" target="_black">YouTube channel</a>)</li>
            <li><a href="https://www.coursera.org/learn/classical-composition" target="_blank">Write Like Mozart - Coursera</a></li>
            <li><a href="https://www.udemy.com/orchestrationcourse/" target="_blank">Orchestration Course - Udemy</a></li>
            <li><a href="https://www.youtube.com/channel/UCJquYOG5EL82sKTfH9aMA9Q" target="_blank">Rick Beato's YouTube Channel</a></li>
            <li><a href="https://www.youtube.com/user/MangoldProject" target="_blank">Manigold Project YouTube Channel</a></li>
            <li><a href="https://www.youtube.com/channel/UCdmjw5sm9Kn83TB_rA_QBCw" target="_blank">Kent Hewitt's YouTube Channel (Jazz Lessons)</a></li>
            <li><a href="http://tobyrush.com/theorypages/index.html" target="_blank">Toby Rush's Music Theory Posters</a></li>
          </ul>
        </div>
      ))
    ],
    /*isPremium*/ true
  )
];

// #endregion Slides