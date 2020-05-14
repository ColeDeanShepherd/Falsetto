import * as React from "react";
import { Button } from "@material-ui/core";

import { arrayContains } from '../../../lib/Core/ArrayUtils';

import { playPitches } from '../../../Audio/PianoAudio';

import { PianoKeyboard, PianoKeyboardMetrics, renderPianoKeyboardKeyLabels } from "../../Utils/PianoKeyboard";
import { Pitch } from '../../../lib/TheoryLib/Pitch';
import { PitchLetter } from '../../../lib/TheoryLib/PitchLetter';

import { createStudyFlashCardSetComponent } from '../../../StudyFlashCards/View';

import { Rect2D } from '../../../lib/Core/Rect2D';
import { Vector2D } from '../../../lib/Core/Vector2D';
import { Size2D } from '../../../lib/Core/Size2D';
import { Margin } from '../../../lib/Core/Margin';
import { ScaleType, Scale } from '../../../lib/TheoryLib/Scale';
import { Chord } from "../../../lib/TheoryLib/Chord";
import { ChordType } from "../../../lib/TheoryLib/ChordType";
import { PitchesAudioPlayer } from '../../Utils/PitchesAudioPlayer';
import { SectionProps, Term, SectionTitle, SubSectionTitle, renderIntervalLabel, renderPianoKeyLabel } from './EssentialMusicTheory';

import { NavLinkView } from "../../../NavLinkView";

import * as ChordProgressionsQuiz from "../../Quizzes/Chords/ChordProgressionsQuiz";
import * as ChordHarmonicFunctions from "../../Quizzes/Chords/ChordFamilies";
import { NoteText } from "../../Utils/NoteText";
import { getPianoKeyboardAspectRatio } from '../../Utils/PianoUtils';
import { getRomanNumerals } from '../../../lib/Core/Utils';

export const FiveChordDiagram: React.FunctionComponent<{}> = props => {
  const lowestPitch = new Pitch(PitchLetter.C, 0, 4);
  const highestPitch = new Pitch(PitchLetter.B, 0, 5);
  const maxWidth = 300;
  const aspectRatio = getPianoKeyboardAspectRatio(/*octaveCount*/ 2);
  const margin = new Margin(0, 80, 0, 80);
  const style = { width: "100%", maxWidth: `${maxWidth}px`, height: "auto" };
  const chord = new Chord(ChordType.Dom7, new Pitch(PitchLetter.G, 0, 4));
  const pitches = chord.getPitches();
  const scaleDegreeLabels = ["5", "7", "2", "4"];

  function renderLabels(metrics: PianoKeyboardMetrics): JSX.Element {
    const getKeyScaleDegreeLabels = (pitch: Pitch) => {
      const pitchIndex = pitches.findIndex(p => p.midiNumber === pitch.midiNumber);
      return (pitchIndex >= 0)
        ? [scaleDegreeLabels[pitchIndex], pitch.toOneAccidentalAmbiguousString(false)]
        : null;
    };

    return (
      <g>
        {renderPianoKeyboardKeyLabels(metrics, true, getKeyScaleDegreeLabels)}
        {renderIntervalLabel(metrics, pitches[1], pitches[3], "tritone", true)}
        {renderPianoKeyLabel(metrics, pitches[1], "leading tone", false, new Vector2D(-40, 0))}
        {renderPianoKeyLabel(metrics, new Pitch(PitchLetter.C, 0, 5), "root note", false, new Vector2D(40, 0))}
      </g>
    );
  }

  function onKeyPress(p: Pitch) {
    const pitchMidiNumbers = pitches.map(p => p.midiNumber);

    if (arrayContains(pitchMidiNumbers, p.midiNumber)) {
      playPitches([p]);
    }
  }

  return (
    <div>
      <p><PitchesAudioPlayer pitches={pitches} playSequentially={false} /></p>
      <PianoKeyboard
        rect={new Rect2D(new Size2D(aspectRatio * 100, 100), new Vector2D(0, 0))}
        margin={margin}
        lowestPitch={lowestPitch}
        highestPitch={highestPitch}
        pressedPitches={[]}
        onKeyPress={onKeyPress}
        renderExtrasFn={renderLabels}
        style={style} />
    </div>
  );
};

export const ChordDiagram: React.FunctionComponent<{ 
  pitches: Array<Pitch>,
  scale: Scale,
  canListen?: boolean,
  maxWidth?: number,
  isArpeggio?: boolean,
  showScaleDegreeNumbers?: boolean;
}> = props => {
  const canListen = (props.canListen !== undefined) ? props.canListen : true;
  const isArpeggio = (props.isArpeggio !== undefined) ? props.isArpeggio : false;

  return (
    <div>
      {canListen ? <p><PitchesAudioPlayer pitches={props.pitches} playSequentially={isArpeggio} /></p> : null}
      {React.createElement(ChordDiagramInternal, props)}
    </div>
  );
}

function renderChordDiagramLabels(
  metrics: PianoKeyboardMetrics,
  pitches: Array<Pitch>,
  scale: Scale,
  showScaleDegreeNumbers: boolean
): JSX.Element {
  const scalePitches = scale.getPitches();
  const scaleDegreeLabels = pitches
    .map(p => 1 + scalePitches.findIndex(sp => sp.midiNumberNoOctave == p.midiNumberNoOctave));

  const getKeyScaleDegreeLabels = (pitch: Pitch) => {
    const pitchIndex = pitches.findIndex(p => p.midiNumber === pitch.midiNumber);
    return (pitchIndex >= 0)
      ? (
        showScaleDegreeNumbers
          ? [scaleDegreeLabels[pitchIndex].toString(), pitch.toOneAccidentalAmbiguousString(false)]
          : [pitch.toOneAccidentalAmbiguousString(false)]
      )
      : null;
  };

  return (
    <g>
      {renderPianoKeyboardKeyLabels(metrics, true, getKeyScaleDegreeLabels)}
    </g>
  );
}

const ChordDiagramInternal: React.FunctionComponent<{
  pitches: Array<Pitch>,
  scale: Scale,
  canListen?: boolean,
  maxWidth?: number,
  position?: Vector2D,
  lowestPitch?: Pitch,
  showScaleDegreeNumbers?: boolean;
}> = props => {
  const { pitches, scale } = props;

  const position = (props.position !== undefined) ? props.position : new Vector2D(0, 0);
  const lowestPitch = (props.lowestPitch !== undefined) ? props.lowestPitch : new Pitch(PitchLetter.C, 0, 4);
  const showScaleDegreeNumbers = (props.showScaleDegreeNumbers !== undefined) ? props.showScaleDegreeNumbers : true;

  const highestPitch = new Pitch(PitchLetter.B, 0, 5);

  const maxWidth = (props.maxWidth !== undefined) ? props.maxWidth : 300;
  const aspectRatio = getPianoKeyboardAspectRatio(/*octaveCount*/ 2);
  const margin = new Margin(0, 0, 0, 0);
  const style = { width: "100%", maxWidth: `${maxWidth}px`, height: "auto" };

  function onKeyPress(p: Pitch) {
    const pitchMidiNumbers = pitches.map(p => p.midiNumber);

    if (arrayContains(pitchMidiNumbers, p.midiNumber)) {
      playPitches([p]);
    }
  }

  return (
    <PianoKeyboard
      rect={new Rect2D(new Size2D(aspectRatio * 100, 100), position)}
      margin={margin}
      lowestPitch={lowestPitch}
      highestPitch={highestPitch}
      pressedPitches={[]}
      onKeyPress={onKeyPress}
      renderExtrasFn={metrics => renderChordDiagramLabels(metrics,pitches, scale, showScaleDegreeNumbers)}
      style={style} />
  );
};

export interface IChordProgressionPlayerProps {
  chords: Array<Chord>;
  chordsPitches: Array<Array<Pitch>>;
  scale: Scale;
  chordScaleDegreeNumbers: Array<number>;
  showRomanNumerals?: boolean;
  maxWidth?: number;
}

export interface IChordProgressionPlayerState {
  currentChordIndex: number | undefined;
  isPlaying: boolean;
}

export class ChordProgressionPlayer extends React.Component<IChordProgressionPlayerProps, IChordProgressionPlayerState> {
  public constructor(props: IChordProgressionPlayerProps) {
    super(props);

    this.state = {
      currentChordIndex: undefined,
      isPlaying: false
    };
  }

  public componentWillReceiveProps() {
    this.stop();
  }

  public componentWillUnmount() {
    this.stopAudio();
  }

  public render(): JSX.Element {
    const { chordsPitches, chords, scale, chordScaleDegreeNumbers } = this.props;
    const { currentChordIndex, isPlaying } = this.state;

    const chordPitches = (currentChordIndex !== undefined)
      ? chordsPitches[currentChordIndex]
      : [];
      
    const showRomanNumerals = (this.props.showRomanNumerals !== undefined)
      ? this.props.showRomanNumerals
      : true;
    
    const textStyle = { fontSize: "1.25em" };
    
    const lowestPitch = new Pitch(PitchLetter.C, 0, 4);
    const highestPitch = new Pitch(PitchLetter.B, 0, 5);
    const maxWidth = (this.props.maxWidth !== undefined) ? this.props.maxWidth : 300;
    const aspectRatio = getPianoKeyboardAspectRatio(/*octaveCount*/ 2);
    const pianoStyle = { width: "100%", maxWidth: `${maxWidth}px`, height: "auto" };

    return (
      <div>
        <p>
          {!isPlaying
            ? (
              <Button variant="contained" onClick={e => this.play()}>
                <i className="material-icons">play_arrow</i>
              </Button>
            )
            : (
              <Button variant="contained" onClick={e => this.stop()}>
                <i className="material-icons">stop</i>
              </Button>
            )
          }
        </p>

        {(currentChordIndex !== undefined)
          ? <p style={textStyle}>
            {(showRomanNumerals) ? <span>{getRomanNumerals(chordScaleDegreeNumbers[currentChordIndex])} - </span> : null}
            {chords[currentChordIndex].rootPitch.toString(/*includeOctaveNumber*/ false)} {chords[currentChordIndex].type.name}
          </p>
          : <p style={textStyle}>Press the play button to hear the chord progression.</p>}

        <PianoKeyboard
          rect={new Rect2D(new Size2D(aspectRatio * 100, 100), new Vector2D(0, 0))}
          lowestPitch={lowestPitch}
          highestPitch={highestPitch}
          pressedPitches={chordPitches}
          renderExtrasFn={metrics => renderChordDiagramLabels(metrics, chordPitches, scale, /*showScaleDegreeNumbers*/ true)}
          style={pianoStyle} />
      </div>
    );
  }

  private readonly delayInMs: number = 1500;

  private timeoutIds: Array<number> | undefined = undefined;
  private cancelAudioFn: (() => void) | undefined = undefined;

  // TODO: prevent playing if still loading

  private play() {
    const { delayInMs } = this;
    const { chordsPitches } = this.props;

    this.timeoutIds = new Array<number>(chordsPitches.length + 1);

    for (let i = 0; i < chordsPitches.length; i++) {
      this.timeoutIds[i] = window.setTimeout(() => {
        // stop playing the previous chord
        if (this.cancelAudioFn) {
          this.cancelAudioFn();
          this.cancelAudioFn = undefined;
        }
      
        // play the new chord
        this.cancelAudioFn = playPitches(chordsPitches[i])[1];
        this.setState({ currentChordIndex: i, isPlaying: true });
      }, delayInMs * i);
    }

    // set a timeout to clear the stop button
    this.timeoutIds[chordsPitches.length] = window.setTimeout(() => {
      this.stop();
    }, delayInMs * (chordsPitches.length + 2));
  }

  private stop() {
    this.stopAudio();
    this.setState({ currentChordIndex: undefined, isPlaying: false });
  }

  private stopAudio() {
    // stop currently playing audio
    if (this.cancelAudioFn) {
      this.cancelAudioFn();
      this.cancelAudioFn = undefined;
    }

    // cancel audio scheduled in the future
    if (this.timeoutIds) {
      for (const timeoutId of this.timeoutIds) {
        window.clearInterval(timeoutId);
      }

      this.timeoutIds = undefined;
    }
  }
}

const ChordTransitionDiagram: React.FunctionComponent<{
  chord1Pitches: Array<Pitch>,
  chord1Name: string,
  chord2Pitches: Array<Pitch>,
  chord2Name: string,
  scale: Scale,
  lowestPitch?: Pitch
}> = props => {
  const width = 600;
  const height = 500;
  const chordDiagram2Position = new Vector2D(0, 300);
  const style = { width: "100%", maxWidth: "300px", height: "auto" };
  const lowestPitch = (props.lowestPitch !== undefined) ? props.lowestPitch : new Pitch(PitchLetter.C, 0, 4);
  
  const pianoMetrics = new PianoKeyboardMetrics(width, 200, lowestPitch, new Pitch(PitchLetter.B, 0, 5));
  const arrowPianoPadding = 15;

  const arrows = props.chord1Pitches
    .map((p1, i) => {
      const p2 = props.chord2Pitches[i];

      const p1Pos = new Vector2D(
        pianoMetrics.getKeyRect(p1).center.x,
        pianoMetrics.height - arrowPianoPadding
      );
      const arrowTipPos = new Vector2D(
        pianoMetrics.getKeyRect(p2).center.x,
        chordDiagram2Position.y + arrowPianoPadding
      );
      const p2Pos = p1Pos.plus(arrowTipPos.minus(p1Pos).plusLength(-8));

      return (
        <line
          x1={p1Pos.x} y1={p1Pos.y}
          x2={p2Pos.x} y2={p2Pos.y}
          stroke="red" strokeWidth={4}
          marker-end="url(#arrow)" />
      );
    });

  return (
    <div>
      <div style={{ padding: "1em" }}>
        <span style={{ paddingRight: "0.5em" }}>
          <PitchesAudioPlayer pitches={props.chord1Pitches} playSequentially={false} cutOffSounds={true}>
            <div><i className="material-icons">play_arrow</i></div>
            <span>{props.chord1Name}</span>
          </PitchesAudioPlayer>
        </span>
        <span>
          <PitchesAudioPlayer pitches={props.chord2Pitches} playSequentially={false} cutOffSounds={true}>
            <div><i className="material-icons">play_arrow</i></div>
            <span>{props.chord2Name}</span>
          </PitchesAudioPlayer>
        </span>
      </div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={style}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
              markerWidth="6" markerHeight="6"
              orient="auto-start-reverse">
            <path d="M 0 2 L 10 5 L 0 8 z" fill="red" />
          </marker>
        </defs>

        <ChordDiagramInternal pitches={props.chord1Pitches} scale={props.scale} canListen={false} lowestPitch={props.lowestPitch} />
        <ChordDiagramInternal pitches={props.chord2Pitches} scale={props.scale} canListen={false} position={chordDiagram2Position} lowestPitch={props.lowestPitch} />
        {arrows}
      </svg>
    </div>
  );
};

export const ChordProgressionsSection: React.FunctionComponent<SectionProps> = props => (
  <div>
    <p style={{ textAlign: "center" }}><NavLinkView to="/essential-music-theory/chords">{"<< Previous: Chords"}</NavLinkView> | <NavLinkView to="/essential-music-theory/next-steps">{"Next Steps >>"}</NavLinkView></p>

    <SectionTitle>Chord Progressions</SectionTitle>
    <p><Term>Chord progressions</Term> are simply sequences of chords. <Term>Chord progressions</Term> are often written with roman numeral notation instead of with pitch letters, allowing chord progressions to be described independent of the key they are played in. There are three fundamental concepts you must know to understand and compose effective chord progressions: the <Term>V - I progression</Term>, <Term>chord substitution</Term>, and <Term>voice leading</Term>.</p>

    <SectionTitle>V - I Chord Progression</SectionTitle>
    <p>One of the most common patterns in chord progressions is the descending fifth &mdash; the movement from one chord (the "V" chord, also called the "dominant" chord) to another chord with a root note a fifth below (the "I" chord, also called the "tonic" chord). For example: from G to C, or from F# to B.</p>
    <NoteText>These chords can be played in any inversion. Though we are descending a fifth to find the I chord in a V - I progression, the I chord <strong>does not</strong> need to be positioned a perfect fifth below the first chord and <strong>does not</strong> need to be in root position.</NoteText>

    <p>A particularly common form of the V - I progression is the V7 to I (or, in minor keys, V7 - i) progression. In major keys, the V7 chord consists of scale degrees 5, 7, 2, &amp; 4, and the I chord consists of scale degrees 1, 3, &amp; 5.</p>
    <p>The V7 chord is tense because of the dissonant tritone interval between scale degrees 7 and 4 (the 2nd &amp; 4th notes of the chord) and because it contains the leading tone (the 7th scale degree) which strongly leans towards the root note of the scale:</p>
    
    <p style={{fontSize: "1.25em", fontWeight: "bold", textDecoration: "underline", textAlign: "center"}}>V7</p>
    <p style={{textAlign: "center"}}><FiveChordDiagram /></p>

    <p>The I chord releases the tension because it resolves the tritone by moving the leading tone to the scale's root note, and moving the 4th scale degree down to the 3rd scale degree to form a major 3rd:</p>
    
    <p style={{fontSize: "1.25em", fontWeight: "bold", textDecoration: "underline", textAlign: "center"}}>I (2nd inversion)</p>
    <p style={{textAlign: "center"}}><ChordDiagram pitches={[new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.C, 0, 5), new Pitch(PitchLetter.E, 0, 5)]} scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))} /></p>

    <p>This dominant - tonic resolution can be used between scale degrees other than 5 &amp; 1 as well. For example, another common chord progression is II - V - I, which works because II is the dominant chord of V (because scale degree 2 is a perfect fifth above scale degree 5), and because V is the dominant chord of I. So, a II - V - I chord progression is essentially two successive V - I chord progressions:</p>
    
    <p style={{fontSize: "1.25em", fontWeight: "bold", textDecoration: "underline", textAlign: "center"}}>ii (2nd inversion)</p>
    <p style={{textAlign: "center"}}><ChordDiagram pitches={[new Pitch(PitchLetter.A, 0, 4), new Pitch(PitchLetter.D, 0, 5), new Pitch(PitchLetter.F, 0, 5)]} scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))} /></p>
    
    <p style={{fontSize: "1.25em", fontWeight: "bold", textDecoration: "underline", textAlign: "center"}}>V7</p>
    <p style={{textAlign: "center"}}><ChordDiagram pitches={new Chord(ChordType.Dom7, new Pitch(PitchLetter.G, 0, 4)).getPitches()} scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))} /></p>
    
    <p style={{fontSize: "1.25em", fontWeight: "bold", textDecoration: "underline", textAlign: "center"}}>I</p>
    <p style={{textAlign: "center"}}><ChordDiagram pitches={[new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.C, 0, 5), new Pitch(PitchLetter.E, 0, 5)]} scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))} /></p>

    <p>Just about every chord progression there is can be analyzed in terms of V - I progressions when combined with the next important concept: chord substitution.</p>

    <SectionTitle>Chord Substitution</SectionTitle>
    <p><Term>Chord substitution</Term> is simply replacing a chord in a chord progression with a similar chord. Chords are considered "similar" if they share many notes or if they resolve in similar ways to the next chord in a chord progression.</p>
    <p>The simplest chord substitutions change only one note in a chord. A common way to change one note in a diatonic chord is to instead use a diatonic chord up or down a 3rd.</p>
    <p>In C major, for example, the I triad consists of the notes C, E, &amp; G:</p>
    <p style={{fontSize: "1.25em", fontWeight: "bold", textDecoration: "underline", textAlign: "center"}}>I</p>
    <p style={{textAlign: "center"}}><ChordDiagram pitches={[new Pitch(PitchLetter.C, 0, 5), new Pitch(PitchLetter.E, 0, 5), new Pitch(PitchLetter.G, 0, 5)]} scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))} /></p>

    <p>The iii triad, a 3rd up from I, consists of the notes E, G, &amp; B, which shares the E and the G with I triad:</p>
    <p style={{fontSize: "1.25em", fontWeight: "bold", textDecoration: "underline", textAlign: "center"}}>iii (2nd inversion)</p>
    <p style={{textAlign: "center"}}><ChordDiagram pitches={[new Pitch(PitchLetter.B, 0, 4), new Pitch(PitchLetter.E, 0, 5), new Pitch(PitchLetter.G, 0, 5)]} scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))} /></p>

    <p>The vi triad, a 3rd down from I, consists of the notes A, C, &amp; E, which shares the C and the E with the I triad:</p>
    <p style={{fontSize: "1.25em", fontWeight: "bold", textDecoration: "underline", textAlign: "center"}}>vi (1st inversion)</p>
    <p style={{textAlign: "center"}}><ChordDiagram pitches={[new Pitch(PitchLetter.C, 0, 5), new Pitch(PitchLetter.E, 0, 5), new Pitch(PitchLetter.A, 0, 5)]} scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))} /></p>

    <p>Because both the iii chord and the vi chord share 2 of 3 notes with the I chord, they can both substitute for the I chord, and they are all categorized as "tonic" chords. The same can be applied other chords that are a 3rd apart, like the ii &amp; IV chords (considered "pre-dominant" chord because they generally lead to "dominant" chords), the V &amp; vii chords ("dominant" chords), and so on.</p>

    <p>You can create more complex chord substitutions changing more than one note in a chord, adding notes to a chord (forming extended chords), or removing notes from a chord.</p>
    <NoteText>You do not always have to <strong>replace</strong> chords with similar chords in chord progressions &mdash; you can also <strong>add</strong> additional chords to chord progressions instead.</NoteText>

    <SubSectionTitle>Important Chord Tones</SubSectionTitle>
    <p>One thing to keep in mind when using chord substitution is that some chord tones are more important than others in giving a chord a specific sound and harmonic function, and these important chord tones may be worth preserving in substitute chords.</p>
    <p>The two most important notes in any chord are the root and the 3rd. The root is important because it lays the foundation for chords &mdash; we can't have a C chord without a C! The 3rd is important because it determines whether the chord is major or minor, which plays a huge role in how the chord sounds.</p>
    <p>Beyond the root and the 3rd, the 7th is the next important chord tone because it determines the type of 7th chord that is formed. Next are chord extensions &mdash; the 9th, the 11th, and the 13th. The least important chord tone in most chords is the 5th because in most cases it does not play any role in determining the type of chord that is formed.</p>
    <NoteText>Though the 5th is not an important chord tone in most chords, it <strong>is</strong> important if it is altered in some way &mdash; for example, the #5 in an augmented triad, or the b5 in a diminished triad.</NoteText>

    <SectionTitle>Voice Leading</SectionTitle>
    <p>The last fundamental concept you must know to understand and compose effective chord progressions is <Term>voice leading</Term>, which is the arrangement of the notes in chord progressions (called "voices") to create smooth, flowing transitions between chords. Good voice leading can make just about any set of chords work together in a chord progression.</p>
    <p><strong>The most important rule of voice leading is to use the smallest possible movements when moving the voices of one chord to the next chord.</strong></p>
    <p>Take the V7 - I chord progression in C major (G7 - C) as an example. One way we can voice these chords is by playing both of them in root position, with the C chord below the G7 chord. These root position chords are an example of ineffective voice leading, because each voice in the G7 chord has to jump a long way to the corresponding voice in the C chord:</p>

    <ul>
      <li>G moves down a P5 to C</li>
      <li>B moves down a P5 to an E</li>
      <li>D moves down a P5 to a G</li>
      <li>F moves down a P4 to a C</li>
    </ul>
    
    <p style={{textAlign: "center"}}>
      <ChordTransitionDiagram
        chord1Pitches={new Chord(ChordType.Dom7, new Pitch(PitchLetter.G, 0, 4)).getPitches()}
        chord1Name="V7"
        chord2Pitches={[new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.E, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.C, 0, 5)]}
        chord2Name="I"
        scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))} />
    </p>

    <p>Contrast this with a better example of voice leading, where V7 is in 2nd inversion and I is in root position, allowing for small movements between the voices in each chord:</p>
    <ul>
      <li>D moves down a M2 to a C</li>
      <li>F moves down a m2 to an E</li>
      <li>G does not move at all</li>
      <li>B moves up a m2 to a C</li>
    </ul>
    
    <p style={{textAlign: "center"}}>
      <ChordTransitionDiagram
        chord1Pitches={[new Pitch(PitchLetter.D, 0, 4), new Pitch(PitchLetter.F, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.B, 0, 4)]}
        chord1Name="V7"
        chord2Pitches={[new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.E, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.C, 0, 5)]}
        chord2Name="I"
        scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))} />
    </p>

    <p>You can hear that this voicing is much smoother, because the individual chord voices move small distances.</p>

    <NoteText>
      Large jumps in the bass voice (the lowest notes) of chords are sometimes acceptable, as they are more pleasing to the ear than large jumps with other chord voices. The example below illustrates this: both the V7 chord and the I chord are in root position, and the bass voice jumps down by a P5, but the chord progression still sounds good.
      <p style={{textAlign: "center"}}>
        <ChordTransitionDiagram
          chord1Pitches={new Chord(ChordType.Dom7, new Pitch(PitchLetter.G, 0, 4)).getPitches()}
          chord1Name="V7"
          chord2Pitches={[new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.C, 0, 5), new Pitch(PitchLetter.E, 0, 5)]}
          chord2Name="I"
          scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))} />
      </p>
    </NoteText>

    <SubSectionTitle>Interactive Exercises</SubSectionTitle>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(ChordProgressionsQuiz.flashCardSet, props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em"}}>{createStudyFlashCardSetComponent(ChordHarmonicFunctions.flashCardSet, props.isEmbedded, props.hideMoreInfoUri)}</div>

    <p style={{ textAlign: "center" }}><NavLinkView to="/essential-music-theory/chords">{"<< Previous: Chords"}</NavLinkView> | <NavLinkView to="/essential-music-theory/next-steps">{"Next Steps >>"}</NavLinkView></p>
  </div>
);