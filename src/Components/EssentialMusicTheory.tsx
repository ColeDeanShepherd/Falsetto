import * as React from "react";
import { CardContent, Card, Table, TableHead, TableBody, TableRow, TableCell } from "@material-ui/core";

import App from './App';

import * as Utils from "../Utils";

import { playPitches, playPitchesSequentially } from "../Piano";

import { YouTubeVideo } from "./YouTubeVideo";
import { TimeSignature } from "../TimeSignature";

import { PianoKeyboard, renderPianoKeyboardNoteNames, PianoKeyboardMetrics } from "./PianoKeyboard";
import { Pitch } from '../Pitch';
import { PitchLetter } from '../PitchLetter';

import * as PianoNotes from "./Quizzes/PianoNotes";
import * as GuitarNotes from "./Quizzes/GuitarNotes";
import * as SheetMusicNotes from "./Quizzes/SheetMusicNotes";

import { createStudyFlashCardGroupComponent } from './StudyFlashCards';

import { Metronome } from "./Metronome";

import * as RhythymTermsQuiz from "./Quizzes/RhythmTermsQuiz";
import * as NoteDurations from "./Quizzes/NoteDurations";
import * as NoteValueNumbers from "./Quizzes/NoteValueNumbers";

import intervalQualityChart from "../img/interval-qualities.svg";

import * as IntervalNamesToHalfSteps from "./Quizzes/IntervalNamesToHalfSteps";
import * as IntervalEarTraining from "./Quizzes/IntervalEarTraining";
import * as IntervalQualitySymbols from "./Quizzes/IntervalQualitySymbolsToQualities";
import * as IntervalsToConsonanceDissonance from "./Quizzes/IntervalsToConsonanceDissonance";
import * as IntervalNotes from "./Quizzes/IntervalNotes";
import * as SheetMusicIntervalRecognition from "./Quizzes/SheetMusicIntervalRecognition";
import * as GuitarIntervals from "./Quizzes/GuitarIntervals";
import * as Interval2ndNotes from "./Quizzes/Interval2ndNotes";
import * as Interval2ndNoteEarTraining from "./Quizzes/Interval2ndNoteEarTraining";
import * as Interval2ndNoteEarTrainingPiano from "./Quizzes/Interval2ndNoteEarTrainingPiano";

import * as ScaleNotes from "./Quizzes/ScaleNotes";
import * as PianoScales from "./Quizzes/PianoScales";
import * as PianoChords from "./Quizzes/PianoChords";
import * as ScaleEarTraining from "./Quizzes/ScaleEarTraining";
import { ScaleViewer } from "./ScaleViewer";

import * as ChordNotes from "./Quizzes/ChordNotes";
import * as GuitarScales from "./Quizzes/GuitarScales";
import * as GuitarChords from "./Quizzes/GuitarChords";
import * as ChordEarTraining from "./Quizzes/ChordEarTraining";
import { ChordViewer } from "./ChordViewer";

import measures from "../img/sheet-music/measures.svg";
import timeSignatureDiagram from "../img/sheet-music/time-signature.svg";
import notesRestsDiagram from "../img/sheet-music/notes-and-rests.svg";

import wholeNote from "../img/sheet-music/whole-note.svg";
import wholeRest from "../img/sheet-music/whole-rest.svg";
import halfNote from "../img/sheet-music/half-note.svg";
import halfRest from "../img/sheet-music/half-rest.svg";
import quarterNote from "../img/sheet-music/quarter-note.svg";
import quarterRest from "../img/sheet-music/quarter-rest.svg";
import eighthNote from "../img/sheet-music/eighth-note.svg";
import eighthRest from "../img/sheet-music/eighth-rest.svg";
import sixteenthNote from "../img/sheet-music/sixteenth-note.svg";
import sixteenthRest from "../img/sheet-music/sixteenth-rest.svg";
import _32ndNote from "../img/sheet-music/32nd-note.svg";
import _32ndRest from "../img/sheet-music/32nd-rest.svg";

import timeSignature44 from "../img/sheet-music/time-signature-4-4.svg";
import timeSignature34 from "../img/sheet-music/time-signature-3-4.svg";

import becomeAPatronButton from "../img/become_a_patron_button.png";

import { TimeSignaturePlayer } from './TimeSignaturePlayer';
import { NoteValuePlayer } from './NoteValuePlayer';

import * as NotesQuiz from "./Quizzes/NotesQuiz";

import { MAX_MAIN_CARD_WIDTH } from './Style';
import { Rect2D } from '../Rect2D';
import { Vector2D } from '../Vector2D';
import { Size2D } from '../Size2D';
import { Margin } from '../Margin';
import { NavLink } from 'react-router-dom';
import { Scale } from '../Scale';
import { doesKeyUseSharps } from '../Key';
import { PianoScaleDronePlayer } from './PianoScaleDronePlayer';
import { basicTriads, seventhChords } from "../Chord";

const pianoKeyboardStyle = { width: "100%", maxWidth: "400px", height: "auto" };

const MainTitle: React.FunctionComponent<{}> = props => <h1>{props.children}</h1>;
const SectionTitle: React.FunctionComponent<{}> = props => <h2>{props.children}</h2>;
const SubSectionTitle: React.FunctionComponent<{}> = props => <h3>{props.children}</h3>;

const NoteText: React.FunctionComponent<{}> = props => <p style={{ color: "#004085", backgroundColor: "#cce5ff", padding: "1em", border: "1px solid #b8daff", borderRadius: "4px" }}>NOTE: {props.children}</p>;

const OctavesPlayer: React.FunctionComponent<{}> = props => {
  return (
    <PianoKeyboard
      rect={new Rect2D(new Size2D(300, 150), new Vector2D(0, 0))}
      lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
      highestPitch={new Pitch(PitchLetter.B, 0, 4)}
      pressedPitches={[]}
      onKeyPress={p => playPitchesSequentially(Utils.range(0, 3).map(i => new Pitch(p.letter, p.signedAccidental, p.octaveNumber - 2 + i)), 500, true)}
      renderExtrasFn={renderPianoKeyboardNoteNames}
      style={pianoKeyboardStyle} />
  );
};

const Term: React.FunctionComponent<{}> = props => <span style={{ fontWeight: "bold" }}>{props.children}</span>;

const BecomeAPatronSection: React.FunctionComponent<{}> = props => (
  <div style={{ margin: "2em 0" }}>
    <p style={{ textAlign: "center", marginBottom: "0.5em", fontWeight: "bold" }}>Enjoying these lessons? Help support us and</p>
    <p style={{ textAlign: "center", marginTop: 0 }}>
      <a href="https://www.patreon.com/bePatron?u=4644571" target="_blank">
        <img src={becomeAPatronButton} alt="Become a Patron!" style={{width: "176px", borderRadius: "9999px"}} />
      </a>
    </p>
  </div>
);

const HalfStepsDiagram: React.FunctionComponent<{}> = props => {
  const width = 300;
  const height = 200;
  const margin = new Margin(0, 50, 0, 0);
  const style = { width: "100%", maxWidth: "300px", height: "auto" };
  
  function renderHalfStepLabels(metrics: PianoKeyboardMetrics): JSX.Element {
    function renderHalfStepLabel(leftPitch: Pitch): JSX.Element {
      const rightPitch = Pitch.createFromMidiNumber(leftPitch.midiNumber + 1);
      const leftKeyRect = metrics.getKeyRect(leftPitch);
      const rightKeyRect = metrics.getKeyRect(rightPitch);

      const textPos = new Vector2D(leftKeyRect.right, -35);
      const textStyle: any = {
        textAnchor: "middle"
      };
      const halfStepConnectionPos = new Vector2D(textPos.x, textPos.y + 5);
      const leftKeyLinePos = new Vector2D(leftKeyRect.center.x, 20);
      const rightKeyLinePos = new Vector2D(rightKeyRect.center.x, 20);

      return (
        <g>
          <text
            x={textPos.x} y={textPos.y}
            style={textStyle}>
            Half Step
          </text>
          <line
            x1={halfStepConnectionPos.x} y1={halfStepConnectionPos.y}
            x2={leftKeyLinePos.x} y2={leftKeyLinePos.y}
            stroke="red" strokeWidth={4} />
          <line
            x1={halfStepConnectionPos.x} y1={halfStepConnectionPos.y}
            x2={rightKeyLinePos.x} y2={rightKeyLinePos.y}
            stroke="red" strokeWidth={4} />
        </g>
      );
    }

    return (
      <g>
        {renderHalfStepLabel(new Pitch(PitchLetter.E, 0, 4))}
        {renderHalfStepLabel(new Pitch(PitchLetter.A, -1, 4))}
      </g>
    );
  }

  return (
    <PianoKeyboard
      rect={new Rect2D(new Size2D(width, height), new Vector2D(0, 0))}
      margin={margin}
      lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
      highestPitch={new Pitch(PitchLetter.B, 0, 4)}
      pressedPitches={[]}
      onKeyPress={p => playPitches([p])}
      renderExtrasFn={renderHalfStepLabels}
      style={style} />
  );
};
const PianoScaleFormulaDiagram: React.FunctionComponent<{ scale: Scale }> = props => {
  const width = 300;
  const height = 200;
  const margin = new Margin(0, 50, 0, 0);
  const style = { width: "100%", maxWidth: "300px", height: "auto" };
  const rootPitch = new Pitch(PitchLetter.C, 0, 4);
  const pitches = props.scale.getPitches(rootPitch);
  const pitchMidiNumberNoOctaves = pitches.map(p => p.midiNumberNoOctave);
  
  function renderExtrasFn(metrics: PianoKeyboardMetrics): JSX.Element {
    return (
      <g>
        {renderScaleStepLabels(metrics)}
        {renderPianoKeyboardNoteNames(metrics, doesKeyUseSharps(rootPitch.letter, rootPitch.signedAccidental), p => Utils.arrayContains(pitchMidiNumberNoOctaves, p.midiNumberNoOctave))}
      </g>
    );
  }
  function renderScaleStepLabels(metrics: PianoKeyboardMetrics): JSX.Element {
    return <g>{pitches.map((_, i) => renderScaleStepLabel(metrics, i))}</g>;
  }
  function renderScaleStepLabel(metrics: PianoKeyboardMetrics, scaleStepIndex: number): JSX.Element {
    const leftPitch = pitches[(scaleStepIndex === 0) ? 0 : scaleStepIndex - 1];
    const rightPitch = pitches[(scaleStepIndex === 0) ? 0 : scaleStepIndex];

    const leftKeyRect = metrics.getKeyRect(leftPitch);
    const rightKeyRect = metrics.getKeyRect(rightPitch);

    const textPos = new Vector2D(
      (scaleStepIndex === 0) ? leftKeyRect.position.x + (leftKeyRect.size.width / 2) : leftKeyRect.right,
      -35
    );
    const textStyle: any = {
      textAnchor: "middle"
    };
    const halfStepConnectionPos = new Vector2D(textPos.x, textPos.y + 5);
    const leftKeyLinePos = new Vector2D(leftKeyRect.center.x, 20);
    const rightKeyLinePos = new Vector2D(rightKeyRect.center.x, 20);

    const halfSteps = rightPitch.midiNumber - leftPitch.midiNumber;
    const formulaPart = (scaleStepIndex === 0) ? 'R' : ((halfSteps === 1) ? 'H' : 'W');

    return (
      <g>
        <text x={textPos.x} y={textPos.y} style={textStyle}>
          {formulaPart}
        </text>
        <line
          x1={halfStepConnectionPos.x} y1={halfStepConnectionPos.y}
          x2={leftKeyLinePos.x} y2={leftKeyLinePos.y}
          stroke="red" strokeWidth={4} />
        {(scaleStepIndex > 0) ? (
          <line
            x1={halfStepConnectionPos.x} y1={halfStepConnectionPos.y}
            x2={rightKeyLinePos.x} y2={rightKeyLinePos.y}
            stroke="red" strokeWidth={4} />
        ) : null}
      </g>
    );
  }

  return (
    <PianoKeyboard
      rect={new Rect2D(new Size2D(width, height), new Vector2D(0, 0))}
      margin={margin}
      lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
      highestPitch={new Pitch(PitchLetter.B, 0, 4)}
      pressedPitches={[]}
      onKeyPress={p => {
        if (Utils.arrayContains(pitchMidiNumberNoOctaves, p.midiNumberNoOctave)) {
          playPitches([p]);
        }
      }}
      renderExtrasFn={renderExtrasFn}
      style={style} />
  );
};

const IntervalsTable: React.FunctionComponent<{ showExamples?: boolean, showCategories?: boolean }> = props => {
  const showExamples = (props.showExamples != undefined) ? props.showExamples : true;
  const showCategories = (props.showCategories != undefined) ? props.showCategories : true;

  let playingSounds: Array<Howl> | null = null;
  const playInterval = (halfSteps: number) => {
    if (playingSounds !== null) {
      for (const playingSound of playingSounds) {
        playingSound.stop();
      }
      
      playingSounds = null;
    }

    const basePitch = new Pitch(PitchLetter.C, 0, 4);
    const pitches = (halfSteps === 0)
      ? [basePitch]
      : [basePitch, Pitch.createFromMidiNumber(basePitch.midiNumber + halfSteps)];
    playPitches(pitches)
      .then(sounds => { playingSounds = sounds; });
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell># of Half Steps</TableCell>
          <TableCell>Common Name</TableCell>
          <TableCell>Symbol</TableCell>
          {showExamples ? <TableCell>Play</TableCell> : null}
          {showExamples ? <TableCell>Ascending Example</TableCell> : null}
          {showExamples ? <TableCell>Descending Example</TableCell> : null}
          {showCategories ? <TableCell>Category</TableCell> : null}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>0</TableCell>
          <TableCell>Unison</TableCell>
          <TableCell>P1</TableCell>
          {showExamples ? <TableCell><i className="cursor-pointer material-icons" onClick={e => playInterval(0)}>play_arrow</i></TableCell> : null}
          {showExamples ? <TableCell>N/A</TableCell> : null}
          {showExamples ? <TableCell>N/A</TableCell> : null}
          {showCategories ? <TableCell>Perfect Consonance</TableCell> : null}
        </TableRow>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell>Minor 2nd, "whole step", "tone"</TableCell>
          <TableCell>m2</TableCell>
          {showExamples ? <TableCell><i className="cursor-pointer material-icons" onClick={e => playInterval(1)}>play_arrow</i></TableCell> : null}
          {showExamples ? <TableCell>Jaws (Theme) - <a href="https://www.youtube.com/watch?v=ZvCI-gNK_y4#t=0s">YouTube</a></TableCell> : null}
          {showExamples ? <TableCell>Für Elise (Beethoven) - <a href="https://www.youtube.com/watch?v=LQTTFUtMSvQ#t=0s">YouTube</a></TableCell> : null}
          {showCategories ? <TableCell>Sharp Dissonance</TableCell> : null}
        </TableRow>
        <TableRow>
          <TableCell>2</TableCell>
          <TableCell>Major 2nd</TableCell>
          <TableCell>M2</TableCell>
          {showExamples ? <TableCell><i className="cursor-pointer material-icons" onClick={e => playInterval(2)}>play_arrow</i></TableCell> : null}
          {showExamples ? <TableCell>Happy Birthday to You - <a href="https://www.youtube.com/watch?v=90w2RegGf9w#t=7s">YouTube</a></TableCell> : null}
          {showExamples ? <TableCell>Mary Had a Little Lamb - <a href="https://www.youtube.com/watch?v=Zq-MtHpRhVk#t=11s">YouTube</a></TableCell> : null}
          {showCategories ? <TableCell>Mild Dissonance</TableCell> : null}
        </TableRow>
        <TableRow>
          <TableCell>3</TableCell>
          <TableCell>Minor 3rd</TableCell>
          <TableCell>m3</TableCell>
          {showExamples ? <TableCell><i className="cursor-pointer material-icons" onClick={e => playInterval(3)}>play_arrow</i></TableCell> : null}
          {showExamples ? <TableCell>Smoke on the Water (Deep Purple) - <a href="https://www.youtube.com/watch?v=arpZ3fCwDEw#t=23s">YouTube</a></TableCell> : null}
          {showExamples ? <TableCell>Frosty the Snowman - <a href="Smoke on the Water (Deep Purple) - youtube">YouTube</a></TableCell> : null}
          {showCategories ? <TableCell>Imperfect Consonance</TableCell> : null}
        </TableRow>
        <TableRow>
          <TableCell>4</TableCell>
          <TableCell>Major 3rd</TableCell>
          <TableCell>M3</TableCell>
          {showExamples ? <TableCell><i className="cursor-pointer material-icons" onClick={e => playInterval(4)}>play_arrow</i></TableCell> : null}
          {showExamples ? <TableCell>Oh, when the Saints - <a href="https://www.youtube.com/watch?v=UREnLVrHv4A#t=27s">YouTube</a></TableCell> : null}
          {showExamples ? <TableCell>Fate - Symphoni No.5 (Beethoven) - <a href="https://www.youtube.com/watch?v=6z4KK7RWjmk#t=8s">YouTube</a></TableCell> : null}
          {showCategories ? <TableCell>Imperfect Consonance</TableCell> : null}
        </TableRow>
        <TableRow>
          <TableCell>5</TableCell>
          <TableCell>Perfect 4th</TableCell>
          <TableCell>P4</TableCell>
          {showExamples ? <TableCell><i className="cursor-pointer material-icons" onClick={e => playInterval(5)}>play_arrow</i></TableCell> : null}
          {showExamples ? <TableCell>Here Comes the Bride - <a href="https://www.youtube.com/watch?v=oBt6Myv75jk#t=30s">YouTube</a></TableCell> : null}
          {showExamples ? <TableCell>Eine Kleine Nachtmusik (Mozart) - <a href="https://www.youtube.com/watch?v=Qb_jQBgzU-I#t=28s">YouTube</a></TableCell> : null}
          {showCategories ? <TableCell>Context Dependent</TableCell> : null}
        </TableRow>
        <TableRow>
          <TableCell>6</TableCell>
          <TableCell>Tritone</TableCell>
          <TableCell>A4/d5</TableCell>
          {showExamples ? <TableCell><i className="cursor-pointer material-icons" onClick={e => playInterval(6)}>play_arrow</i></TableCell> : null}
          {showExamples ? <TableCell>The Simpsons (Theme) - <a href="https://www.youtube.com/watch?v=Xqog63KOANc#t=2s">YouTube</a></TableCell> : null}
          {showExamples ? <TableCell>Even Flow (Pearl Jam) - <a href="https://www.youtube.com/watch?v=CxKWTzr-k6s#t=26s">YouTube</a></TableCell> : null}
          {showCategories ? <TableCell>Sharp Dissonance</TableCell> : null}
        </TableRow>
        <TableRow>
          <TableCell>7</TableCell>
          <TableCell>Perfect 5th</TableCell>
          <TableCell>P5</TableCell>
          {showExamples ? <TableCell><i className="cursor-pointer material-icons" onClick={e => playInterval(7)}>play_arrow</i></TableCell> : null}
          {showExamples ? <TableCell>Twinkle Twinkle Little Star (Mozart) - <a href="https://www.youtube.com/watch?v=yCjJyiqpAuU#t=20s">YouTube</a></TableCell> : null}
          {showExamples ? <TableCell>What do you do with a Drunken Sailor - <a href="https://www.youtube.com/watch?v=qGyPuey-1Jw#t=4s">YouTube</a></TableCell> : null}
          {showCategories ? <TableCell>Perfect Consonance</TableCell> : null}
        </TableRow>
        <TableRow>
          <TableCell>8</TableCell>
          <TableCell>Minor 6th</TableCell>
          <TableCell>m6</TableCell>
          {showExamples ? <TableCell><i className="cursor-pointer material-icons" onClick={e => playInterval(8)}>play_arrow</i></TableCell> : null}
          {showExamples ? <TableCell>Waltz Op.64 No.2 (Chopin) - <a href="https://www.youtube.com/watch?v=C9r-0sL6jL0#t=4s">YouTube</a></TableCell> : null}
          {showExamples ? <TableCell>Five for Fighting - (100 Years) - <a href="https://www.youtube.com/watch?v=tR-qQcNT_fY#t=16s">YouTube</a></TableCell> : null}
          {showCategories ? <TableCell>Imperfect Consonance</TableCell> : null}
        </TableRow>
        <TableRow>
          <TableCell>9</TableCell>
          <TableCell>Major 6th</TableCell>
          <TableCell>M6</TableCell>
          {showExamples ? <TableCell><i className="cursor-pointer material-icons" onClick={e => playInterval(9)}>play_arrow</i></TableCell> : null}
          {showExamples ? <TableCell>Dashing Through the Snow - <a href="https://www.youtube.com/watch?v=UPeol7oEzrw#t=9s">YouTube</a></TableCell> : null}
          {showExamples ? <TableCell>The Music of the Night (Phantom of the Opera) - <a href="https://www.youtube.com/watch?v=EPXPwRgV-NM#t=0s">YouTube</a></TableCell> : null}
          {showCategories ? <TableCell>Imperfect Consonance</TableCell> : null}
        </TableRow>
        <TableRow>
          <TableCell>10</TableCell>
          <TableCell>Minor 7th </TableCell>
          <TableCell>m7</TableCell>
          {showExamples ? <TableCell><i className="cursor-pointer material-icons" onClick={e => playInterval(10)}>play_arrow</i></TableCell> : null}
          {showExamples ? <TableCell>Somewhere - (West side story)<a href="https://www.youtube.com/watch?v=HtO2iC0KIQ8#t=67s">YouTube</a></TableCell> : null}
          {showExamples ? <TableCell>An American in Paris (Gershwin) - <a href="https://www.youtube.com/watch?v=MWzlivSzpJM#t=0s">YouTube</a></TableCell> : null}
          {showCategories ? <TableCell>Mild Dissonance</TableCell> : null}
        </TableRow>
        <TableRow>
          <TableCell>11</TableCell>
          <TableCell>Major 7th</TableCell>
          <TableCell>M7</TableCell>
          {showExamples ? <TableCell><i className="cursor-pointer material-icons" onClick={e => playInterval(11)}>play_arrow</i></TableCell> : null}
          {showExamples ? <TableCell>Take on Me (A-Ha) - <a href="https://www.youtube.com/watch?v=djV11Xbc914#t=53s">YouTube</a></TableCell> : null}
          {showExamples ? <TableCell>I Love You (Cole Porter) - <a href="https://www.youtube.com/watch?v=nXIXknT-iQ8#t=15s">YouTube</a></TableCell> : null}
          {showCategories ? <TableCell>Sharp Dissonance</TableCell> : null}
        </TableRow>
        <TableRow>
          <TableCell>12</TableCell>
          <TableCell>Octave</TableCell>
          <TableCell>P8</TableCell>
          {showExamples ? <TableCell><i className="cursor-pointer material-icons" onClick={e => playInterval(12)}>play_arrow</i></TableCell> : null}
          {showExamples ? <TableCell>Somewhere Over the Rainbow - <a href="https://www.youtube.com/watch?v=PSZxmZmBfnU">YouTube</a></TableCell> : null}
          {showExamples ? <TableCell>The Lonely Goatherd (The Sound of Music) - <a href="https://www.youtube.com/watch?v=gRo0NlLYvwE#t=13s">YouTube</a></TableCell> : null}
          {showCategories ? <TableCell>Perfect Consonance</TableCell> : null}
        </TableRow>
      </TableBody>
    </Table>
  );
};

export interface SectionProps {
  isEmbedded: boolean;
  hideMoreInfoUri: boolean;
}
export const IntroSection: React.FunctionComponent<SectionProps> = props => (
  <div>
    <MainTitle>Essential Music Theory</MainTitle>
    <p>This course is designed to teach students the essentials of Western music theory interactively. As you work your way through this course, keep in mind that music theory is descriptive, not prescriptive. This means that there are no hard-rules, only guidelines based on music that already exists. The goal of learning music theory is not to restrict ourselves to doing only what is "correct", but to understand the music we hear on a deeper level, to apply this understanding to our music, and to know how to skillfully break the "rules" to fully express ourselves in our music.</p>
    <p>Without further ado, let's get started!</p>
    <p style={{ textAlign: "center" }}>{App.instance.renderNavLink("/essential-music-theory/rhythm", "Next: Rhythm >>")}</p>
  </div>
);
export const RhythmSection: React.FunctionComponent<SectionProps> = props => (
  <div>
    <p style={{ textAlign: "center" }}>{App.instance.renderNavLink("/essential-music-theory", "<< Previous: Introduction")} | {App.instance.renderNavLink("/essential-music-theory/notes", "Next: Notes >>")}</p>

    <SectionTitle>Rhythm</SectionTitle>
    <p><Term>Rhythm</Term> is the purposeful arrangement of sounds over time &mdash; what you dance to when listening to a piece of music. Rhythm is the basis of all music, and some music is based solely on rhythm:</p>

    <YouTubeVideo videoId="Qsq5PHoik-s" style={{ margin: "0 auto" }} />

    <SubSectionTitle>Beat &amp; Tempo</SubSectionTitle>
    <p>The <Term>beat</Term> is the repeating pulse you can feel when listening to a piece of music. The beat is the driving force of rhythm, and all sounds in music are arranged around it. If you tap your foot or bob your head to a song, you do it to the beat.</p>
    <p><Term>Tempo</Term> is the speed of the beat, often given as beats per minute (BPM). 120 BPM, for example, means there are two beats per second:</p>
    
    <Metronome hideTitle={true} />

    <p>Most music is roughly 60 BPM to 180 BPM, and tempo is one of the defining characterstics of musical genres.</p>
    
    <p style={{ textAlign: "center", textDecoration: "underline" }}>Slow Tempo</p>
    <YouTubeVideo videoId="SlTTgJau33Q" style={{ margin: "0 auto" }} />

    <p style={{ textAlign: "center", textDecoration: "underline" }}>Medium Tempo</p>
    <YouTubeVideo videoId="hwmRQ0PBtXU" style={{ margin: "0 auto" }} />
    
    <p style={{ textAlign: "center", textDecoration: "underline" }}>Fast Tempo</p>
    <YouTubeVideo videoId="jYUilB9ngs0" style={{ margin: "0 auto" }} />

    <p>Though most music holds a steady tempo, it can vary throughout a piece of music. Composers can designate places where the music changes to a new fixed tempo, or performers can slightly deviate from a fixed tempo in a smooth and flowing manner &mdash; a technique called <Term>rubato</Term>.</p>
    <p>The rendition below of "Nocturne op. 9 No. 2", a piece by <a href="https://www.youtube.com/watch?v=wygy721nzRc" target="_blank">Frédéric Chopin</a>, is a great example of rubato. As you listen, note how the tempo ebbs and flows, making the music more emotionally impactful than if it were played mechanically with an unwavering tempo.</p>
    
    <YouTubeVideo videoId="9E6b3swbnWg" style={{ margin: "0 auto" }} />

    <SubSectionTitle>Measures &amp; Note Durations</SubSectionTitle>
    <p>Music is divided into <Term>measures</Term> (or <Term>bars</Term>) &mdash; small sections containing a fixed number of beats.</p>
    <NoteText>We will use sheet music notation to visualize concepts in this section, but don't worry about understanding the notes or symbols if you are unfamiliar with sheet music.</NoteText>
    
    <p style={{ textAlign: "center" }}><img src={measures} style={{ maxWidth: "700px", width: "100%" }} /></p>

    <p>Each measure contains musical notes and rests. Notes are the what musicians actually play in a piece of music, and rests are periods of silence.</p>
    
    <p style={{ textAlign: "center" }}><img src={notesRestsDiagram} style={{ maxWidth: "700px", width: "100%" }} /></p>

    <p>For now, we are only concerned with the <Term>note values</Term>, or durations, of the notes and rests, which are represented by different symbols. Below are some of the note values you'll commonly find in music:</p>

    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Note Value</TableCell>
          <TableCell>Associated Number</TableCell>
          <TableCell>Note Symbol</TableCell>
          <TableCell>Rest Symbol</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Whole Note</TableCell>
          <TableCell>1</TableCell>
          <TableCell><img src={wholeNote} style={{ width: `${noteValueTableImgWidth}px` }} /></TableCell>
          <TableCell><img src={wholeRest} style={{ width: `${1.2 * noteValueTableImgWidth}px` }} /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Half Note</TableCell>
          <TableCell>2</TableCell>
          <TableCell><img src={halfNote} style={{ width: `${0.7 * noteValueTableImgWidth}px` }} /></TableCell>
          <TableCell><img src={halfRest} style={{ width: `${1.3 * noteValueTableImgWidth}px` }} /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Quarter Note</TableCell>
          <TableCell>4</TableCell>
          <TableCell><img src={quarterNote} style={{ width: `${0.7 * noteValueTableImgWidth}px` }} /></TableCell>
          <TableCell><img src={quarterRest} style={{ width: `${0.65 * noteValueTableImgWidth}px` }} /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Eighth Note</TableCell>
          <TableCell>8</TableCell>
          <TableCell><img src={eighthNote} style={{ width: `${noteValueTableImgWidth}px` }} /></TableCell>
          <TableCell><img src={eighthRest} style={{ width: `${0.9 * noteValueTableImgWidth}px` }} /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Sixteenth Note</TableCell>
          <TableCell>16</TableCell>
          <TableCell><img src={sixteenthNote} style={{ width: `${noteValueTableImgWidth}px` }} /></TableCell>
          <TableCell><img src={sixteenthRest} style={{ width: `${0.9 * noteValueTableImgWidth}px` }} /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Thirty-second Note</TableCell>
          <TableCell>32</TableCell>
          <TableCell><img src={_32ndNote} style={{ width: `${noteValueTableImgWidth}px` }} /></TableCell>
          <TableCell><img src={_32ndRest} style={{ width: `${0.9 * noteValueTableImgWidth}px` }} /></TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <p>Whole notes &amp; rests are twice as long as half notes &amp; rests, half notes &amp; rests are twice as long as quarter notes &amp; rests, quarter notes &amp; rests are twice as long as eighth notes &amp; rests, and so on...</p>
    
    <SubSectionTitle>Time Signatures</SubSectionTitle>
    <p>The number &amp; type of beats in a measure are specified by <Term>time signatures</Term>:</p>

    <p style={{ textAlign: "center" }}><img src={timeSignatureDiagram} style={{ maxWidth: "600px", width: "100%" }} /></p>

    <p>This time signature is read as "three-four" time. The top number is the number of beats in a measure, and the bottom number represents the note values of the beats relative to the tempo. So, the the "three-four" time signature above signifies that there are three quarter notes in each measure.</p>
    <p>The most common time signature is <img src={timeSignature44} style={{ width: "12px" }} />, in which there are 4 (top number) quarter notes (bottom number) in each measure.</p>

    <p>Because there are 4 quarter notes in each measure, you can also say that each measure contains:</p>
    <ul>
      <li>1 whole note</li>
      <li>2 half notes</li>
      <li>8 eighth notes</li>
      <li>16 sixteenth notes</li>
      <li>32 thirty-second notes</li>
      <li>and so on...</li>
    </ul>

    <p>This is what <img src={timeSignature44} style={{ width: "12px" }} /> time sounds and looks like:</p>
    <TimeSignaturePlayer timeSignature={new TimeSignature(4, 4)} />
    
    <p>As you can hear and see, the beats vary in weight throughout the measure: the first beat is the strongest beat, the third beat is a medium-strength note, and the second and fourth beats are weak notes. This is because time signatures, like <img src={timeSignature44} style={{ width: "12px" }} />, have <Term>strong beats</Term> and <Term>weak beats</Term> (and beats in-between).</p>

    <NoteText>The differing volumes and colors of notes is only a visual/aural aid to understanding strong &amp; weak beats in time signatures. In real music, the notes would not differ in color, and all notes would be the same volume unless otherwise indicated.</NoteText>

    <p>Another common time signature is <img src={timeSignature34} style={{ width: "12px" }} />, in which there are three quarter notes, the first beat is a strong beat, and the second and third notes are weak beats. <img src={timeSignature34} style={{ width: "12px" }} /> is used in waltzes, among other types of music, and it sounds like this:</p>
    <TimeSignaturePlayer timeSignature={new TimeSignature(3, 4)} />
    <p>In general, any time signature with a number of beats divisible by 3 will have a repeating pattern of one strong beat followed by two weak beats, and any time signature with a number of beats divisible by 4 (but not 3) will have a repeating pattern of: strong beat, weak beat, medium-strength beat, weak beat.</p>

    <p>Use the time signature selector below to listen to some common time signatures to get a feel for them.</p>
    <TimeSignaturePlayer showTimeSignatureSelect={true} />

    <p>Note that all of the note values (the bottom number) in time signatures are powers of two (1, 2, 4, 8, ...). This is true for almost all, if not all, time signatures in practice.</p>

    <p>Though time signature note values are generally powers of two, you are free to divide beats or measures into any number of notes:</p>

    <NoteValuePlayer notesPerBeat={3} maxNotesPerBeat={5} showNotesPerBeatSelect={true} />
    
    <BecomeAPatronSection />
    
    <SubSectionTitle>Interactive Exercises</SubSectionTitle>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(RhythymTermsQuiz.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(NoteDurations.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(NoteValueNumbers.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>

    <p style={{ textAlign: "center" }}>{App.instance.renderNavLink("/essential-music-theory", "<< Previous: Introduction")} | {App.instance.renderNavLink("/essential-music-theory/notes", "Next: Notes >>")}</p>
  </div>
);
export const NotesSection: React.FunctionComponent<SectionProps> = props => (
  <div>
    <p style={{ textAlign: "center" }}>{App.instance.renderNavLink("/essential-music-theory/rhythm", "<< Previous: Rhythm")} | {App.instance.renderNavLink("/essential-music-theory/intervals", "Next: Intervals >>")}</p>

    <SectionTitle>Notes</SectionTitle>
    <p>In music, a <Term>note</Term> is a sound with a distinct pitch and a duration, and a <Term>pitch</Term> is the "highness" or "lowness" of a sound.</p>
    <NoteText><Term>Note</Term> and <Term>pitch</Term> have slightly different meanings, but in practice these words are often used interchangably.</NoteText>
    <p>Technically, there are an infinite number of pitches, but the vast majority of music is composed of a standardized set of pitches with distinct names. These names, arranged on a small section of a piano, are:</p>

    <div style={{ textAlign: "center" }}><OctavesPlayer /></div>

    <p>A few things to notice:</p>
    <ul>
      <li>There are only 12 pitch names here! This is because humans hear all pitches with the same name as very similar, regardless of how high or low they are played on an instrument. So, the pitch names repeat as you go higher or lower. <strong>Try clicking the piano above to hear pitches of different highness/lowness with the same name!</strong></li>
      <li>The base of all pitch names is one of the seven letters: A, B, C, D, E, F, G. We do not use more than seven letters to name pitches because most Western music is based on 7-note <Term>scales</Term> which use each letter exactly once. We will cover <Term>scales</Term> in a future lesson.</li>
      <li>The 7 notes on white keys each have a one-letter name with no symbol. These are called <Term>natural</Term> notes.</li>
      <li>The black keys each have two names: one with a "#", read as "sharp" and meaning slightly raised, and one with a "b", read as "flat" and meaning slightly lowered. This is because Western music has 12 names for pitches but only uses 7 letters. To name the 5 pitches on the black piano keys we add sharps or flats &mdash; called <Term>accidentals</Term> &mdash; to the letters to indicate where the note is compared to an adjacent note.</li>
      <li>There are no black keys between B &amp; C and E &amp; F. This is because we are only left with 5 notes after naming all the natural notes &mdash; there has to be gaps somewhere! These "missing" black notes also create groups of 2 &amp; 3 black notes, which are useful for finding where you are on a piano by sight or by touch.</li>
    </ul>
    
    <NoteText>Though there are no black keys in-between B &amp; C and E &amp; F, you can &mdash; and sometimes must, as we will discover in a future lesson &mdash; use accidentals to name those notes relative to another. So, Cb is the same as B, B# is the same as C, Fb is the same as E, and E# is the same as F.</NoteText>
    
    <p>It is <strong>vitally</strong> important to learn where all the notes are on your instrument of choice. Please take some time to do so before moving on to the next lesson!</p>
    <p>If your instrument of choice is piano, there is an interactive exercise below. If your instrument of choise is guitar, there is an interactive exercise below, and a comprehensive lesson: <NavLink to="/learn-guitar-notes-in-10-steps" className="nav-link">Learn the Notes on Guitar in 10 Easy Steps</NavLink></p>

    <BecomeAPatronSection />
    
    <SubSectionTitle>Interactive Exercises</SubSectionTitle>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(NotesQuiz.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(PianoNotes.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(GuitarNotes.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(SheetMusicNotes.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    
    <p style={{ textAlign: "center" }}>{App.instance.renderNavLink("/essential-music-theory/rhythm", "<< Previous: Rhythm")} | {App.instance.renderNavLink("/essential-music-theory/intervals", "Next: Intervals >>")}</p>
  </div>
);
export const IntervalsSection: React.FunctionComponent<SectionProps> = props => (
  <div>
    <p style={{ textAlign: "center" }}>{App.instance.renderNavLink("/essential-music-theory/notes", "<< Previous: Notes")} | {App.instance.renderNavLink("/essential-music-theory/scales-and-modes", "Next: Scales & Modes >>")}</p>
      
    <SectionTitle>Intervals</SectionTitle>
    <p>An <Term>interval</Term> is simply the distance between two notes. Understanding intervals and training your ear to recognize them is one of the most important skills as a musician, because a firm grasp on intervals establishes a link between your mind, your instrument, and your emotions.</p>
    
    <p>Intervals are measured by the number of <Term>half steps</Term> (also called <Term>semitones</Term>) between two notes. <Term>Half steps</Term> are the smallest interval (aside from <Term>unisons</Term>, which are explained after the diagram) in Western music.</p>
    <p style={{ textAlign: "center" }}><HalfStepsDiagram /></p>

    <SubSectionTitle>Interval Numbers &amp; Qualities</SubSectionTitle>
    <p>Every interval is described by an <Term>interval number</Term> and an <Term>interval quality</Term>.</p>
    <p>The <Term>interval number</Term> is the number of letters that the interval spans:</p>
    <ul>
      <li>C to D (ascending) has an interval number of 2, because it spans the letters C &amp; D</li>
      <li>F# to Db (descending) has an interval number of 3, because it spans the letters F, E, &amp; D</li>
      <li>G to Db (ascending) has an interval number of 5, because it spans the letters G, A, B, C, &amp; D</li>
    </ul>
    <p>and so on...</p>

    <p>The <Term>interval quality</Term> describes the sound of the interval and helps specify the exact number of half steps in the interval. The possible <Term>interval qualities</Term> are:</p>
    <ul>
      <li>Perfect (P)</li>
      <li>Major (M)</li>
      <li>Minor (m)</li>
      <li>Diminished (d)</li>
      <li>Augmented (A)</li>
    </ul>
    <p>We will learn exactly what these <Term>interval qualities</Term> mean and how to use them soon, but we must learn some prerequisite knowledge first.</p>

    <p>To notate an interval, we write the <Term>interval quality</Term> followed by the <Term>interval number</Term>, for example:</p>
    <ul>
      <li>M2 &ndash; Major 2nd</li>
      <li>P4 &ndash; Perfect 4th</li>
      <li>d5 &ndash; Diminished 5th</li>
    </ul>

    <SubSectionTitle>Simple Intervals</SubSectionTitle>
    <p>There are 13 <Term>simple intervals</Term>, which are intervals spanning 12 half steps or less. Take some time to memorize them:</p>
    <IntervalsTable showExamples={false} showCategories={false} />

    <SubSectionTitle>More on Interval Qualities</SubSectionTitle>
    <p>To figure out what interval quality to use when naming an interval, you first need to know three things about the interval:</p>
    <ul>
      <li>the interval's number (which the number of letters the interval spans, as stated earlier)</li>
      <li>the number of half steps in the interval</li>
      <li>the common name for intervals with that number of half steps</li>
    </ul>
    <p>If the common name for that number of half steps matches with what you determined to be the interval number, you can simply use the common name.</p>

    <p>For the interval from C to E, for example:</p>
    <ul>
      <li>The interval number is 3.</li>
      <li>There are 4 half steps between the two notes.</li>
      <li>The common name for intervals with 4 half step is "Major 3rd".</li>
    </ul>
    <p>Because the common name is a 3rd, and the interval number between C and E is 3, we can simply name the interval a "Major 3rd" (M3).</p>

    <p>The interval from C to D#, for example, is not as straightforward to name:</p>
    <ul>
      <li>The interval number is 2.</li>
      <li>There are 3 half steps between the two notes.</li>
      <li>The common name for intervals with 3 half steps is "Minor 3rd".</li>
    </ul>
    <p>In this case, we can't use the common name for intervals with 3 half steps ("Minor 3rd") because it doesn't match our decided interval number of 2. Instead, we will keep the interval number of 2 and change the quality of the interval to make it span 3 half steps.</p>
    <p>We have memorized the simple intervals above, so we know that the largest interval with an interval number of 2 is a Major 2nd (M2), which spans 2 half steps. We need to change the quality to increase the number of spanned half steps to 3. To do this, we follow this chart which describes how interval qualities change as half steps are added (+) or removed (-):</p>
    <p style={{ textAlign: "center" }}><img src={intervalQualityChart} alt="Interval Qualities" style={{ width: "100%", maxWidth: "400px", height: "auto" }} /></p>
    <p>From the chart we see that, to change the Major 2nd interval's quality to make it span an additional half step, we need to change the quality to "Augmented". So, the name for the interval from C to D# is "Augmented 2nd" (A2).</p>

    <NoteText>Some intervals (such as from C to D##) require interval qualities that exceed the ones in the chart above. In these cases, you can simply use "doubly augmented" (AA), "triply augmented" (AAA), and so on, or "doubly diminished" (dd), "triply diminished" (ddd), and so on.</NoteText>

    <SubSectionTitle>Compound Intervals</SubSectionTitle>
    <p>Beyond the <Term>simple intervals</Term> there are <Term>compound intervals</Term>, which span more than 12 half steps (P8). Some examples of <Term>compound intervals</Term> are:</p>
    <ul>
      <li>Minor 9th (m9) - 13 half steps, or 1 octave and 1 half step</li>
      <li>Perfect 15th (P15) - 24 half steps, or 2 octaves</li>
      <li>Major 17th (M17) - 28 half steps, or 2 octaves and 4 half steps</li>
      <li>and so on...</li>
    </ul>
    <p>When analyzing the sound and function of <Term>compound intervals</Term>, however, we generally reduce compound intervals to simple intervals by subtracting octaves until you are left with a simple interval. So:</p>
    <ul>
      <li>m9 would reduce to m2</li>
      <li>P15 would reduce to P8</li>
      <li>M17 would reduce to M3</li>
    </ul>
    <p>and so on...</p>

    <SubSectionTitle>Ear Training</SubSectionTitle>
    <p>Finally we have come to one of the most important skills a musician should have: recognizing intervals by ear. This skill allows you to translate the music you hear in your mind (or in your ear) to your instrument, and helps you identify and understand fragments of music and why they make you feel a certain way.</p>
    <p>One way to train your ear is by associating every <Term>simple interval</Term> with a memorable part of a song. The table below associates each ascending and descending <Term>simple interval</Term> with a song, and also describes how <Term>consonant</Term> or <Term>dissonant</Term> each interval is.</p>
    <p><Term>Consonant</Term> intervals sound pleasing to the ear, and <Term>dissonant</Term> intervals sound harsh or tense to the ear. The categories of consonance/dissonance we will use, from most consonant to most dissonant, are:</p>
    <ul>
      <li>Perfect Consonance</li>
      <li>Imperfect Consonance</li>
      <li>Mild Dissonance</li>
      <li>Sharp Dissonance</li>
    </ul>
    <p>When training your ear to recognize intervals using the table below, pay close attention to how consonant or dissonant each interval is, and how each interval makes you feel.</p>
    <IntervalsTable />

    <BecomeAPatronSection />
  
    <SubSectionTitle>Interactive Exercises</SubSectionTitle>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(IntervalQualitySymbols.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(IntervalNamesToHalfSteps.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(IntervalNotes.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(Interval2ndNotes.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(SheetMusicIntervalRecognition.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(GuitarIntervals.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(IntervalsToConsonanceDissonance.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(IntervalEarTraining.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(Interval2ndNoteEarTraining.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(Interval2ndNoteEarTrainingPiano.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    
    <p style={{ textAlign: "center" }}>{App.instance.renderNavLink("/essential-music-theory/notes", "<< Previous: Notes")} | {App.instance.renderNavLink("/essential-music-theory/scales-and-modes", "Next: Scales & Modes >>")}</p>
  </div>
);
export const ScalesAndModesSection: React.FunctionComponent<SectionProps> = props => (
  <div>
    <p style={{ textAlign: "center" }}>{App.instance.renderNavLink("/essential-music-theory/intervals", "<< Previous: Intervals")} | Next: Chords (coming soon) >></p>

    <SectionTitle>Scales &amp; Modes</SectionTitle>
    <SubSectionTitle>Scales</SubSectionTitle>
    <p><Term>Scales</Term> are sets of notes forming particular intervals with a tonal center called a <Term>root note</Term>. Most scales in Western music consist of 7 notes, so each scale selectively leaves out 5 notes to invoke a particular feeling in listeners.</p>
    <p><Term>Melody</Term> and <Term>harmony</Term> are built on the notes of scales (non-scale notes are used as well, with care). <Term>Melody</Term> is the arrangement of individual notes over time, with no two notes playing simultaneously. When you sing a song, you sing the <Term>melody</Term>. <Term>Harmony</Term> is the arrangement of multiple notes at the same time to form <Term>chords</Term>. We will explore <Term>harmony</Term> and <Term>in the next lesson</Term>.</p>

    <SubSectionTitle>The Major Scale</SubSectionTitle>
    <p>One of the most common scales, upon which other scales are often built by modifying notes, is the <Term>major scale</Term>. The <Term>major scale</Term> is a 7 note scale which can be built using the formula: "R W W H W W W", where "R" denotes the root name, "W" means the next note is a whole step higher, and "H" means the next note is a half step higher.</p>
    <p>So, a C major scale, a scale with a <Term>root note</Term> of C following the major scale formula, is comprised of the notes: C, D, E, F, G, A, B.</p>
    <p style={{ textAlign: "center" }}><PianoScaleFormulaDiagram scale={Scale.Ionian} /></p>

    <NoteText>Though the notes of scales are often given in ascending order, they can be played in any order or repeated any number of times and still be considered the same scale. What makes a scale distinct is simply the set of notes it contains, not the order or the count of the notes.</NoteText>

    <p>Every scale has a <Term>root note</Term> which we naturally gravitate towards and compare other notes in the scale to. Every note in a scale forms a particular interval with the root note, and thinking about scales in terms of intervals from the root note can be helpful when analyzing why a particular scale or melody sounds the way it does. Because of this, sometimes scales are denoted in terms of intervals from the root note, like so:</p>
    <p>C Major scale formula: R, M2, M3, P4, P5, M6, M7</p>

    <p>Major scales often sound "happy" or "bright". Try playing the piano keyboard below to hear each note of the C major scale at the same time as the root note to internalize the sound of the major scale yourself.</p>
    <p style={{ textAlign: "center" }}><PianoScaleDronePlayer scale={Scale.Ionian} rootPitch={new Pitch(PitchLetter.C, 0, 4)} style={pianoKeyboardStyle} /></p>
    
    <SubSectionTitle>Scale Degrees</SubSectionTitle>
    <p>Each note in a scale is sometimes called a <Term>scale degree</Term>, with the first note (the <Term>root note</Term>) called the 1st scale degree (C in C major), the next note above that called the 2nd scale degree (D in C major), the next note above that called the 3rd scale degree (E in C major), and so on.</p>
    <p>The major scale has the following scale degrees: 1 2 3 4 5 6 7. This is obvious, but listing the scale degrees of the major scale is useful because other scales can be built from major by adding sharps and flats to its scale degrees. We will notate scale formulas in this way from now on, starting with the <Term>natural minor scale</Term>:</p>
    <p>The <Term>natural minor scale</Term> (commonly referred to simply as the <Term>minor scale</Term>) is another common scale with a "darker" sound. Relative to the major scale, the natural minor scale has the following formula: 1 2 b3 4 5 b6 b7, meaning the natural minor scale is a major scale with the 3rd, 6th, and 7th scale degrees flattened. So, a C natural minor scale is comprised of the notes C, D, Eb, F, G, Ab, Bb.</p>
    
    <p>Try playing the piano keyboard below to get a feel for the natural minor scale.</p>
    <p style={{ textAlign: "center" }}><PianoScaleDronePlayer scale={Scale.Aeolian} rootPitch={new Pitch(PitchLetter.C, 0, 4)} style={pianoKeyboardStyle} /></p>

    <SubSectionTitle>Modes</SubSectionTitle>
    <p>The <Term>modes</Term> of a scale are the different scales you get when you start on different notes of a "base" scale, and consider those starting notes the new <Term>root notes</Term>.</p>
    <p>Let's try starting the C major scale on different notes, and considering those starting notes to be the new <Term>root notes</Term>, to find the modes of the scale:</p>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Starting/Root Note</TableCell>
          <TableCell>Scale Notes in Ascending Order</TableCell>
          <TableCell>Mode Name</TableCell>
          <TableCell>Formula</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>C</TableCell>
          <TableCell>C D E F G A B</TableCell>
          <TableCell>Ionian (a.k.a "Major")</TableCell>
          <TableCell>1 2 3 4 5 6 7</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>D</TableCell>
          <TableCell>D E F G A B C</TableCell>
          <TableCell>Dorian</TableCell>
          <TableCell>1 2 b3 4 5 6 b7</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>E</TableCell>
          <TableCell>E F G A B C D</TableCell>
          <TableCell>Phrygian</TableCell>
          <TableCell>1 b2 b3 4 5 b6 b7</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>F</TableCell>
          <TableCell>F G A B C D E</TableCell>
          <TableCell>Lydian</TableCell>
          <TableCell>1 2 3 #4 5 6 7</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>G</TableCell>
          <TableCell>G A B C D E F</TableCell>
          <TableCell>Mixolydian</TableCell>
          <TableCell>1 2 3 4 5 6 b7</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>A</TableCell>
          <TableCell>A B C D E F G</TableCell>
          <TableCell>Aeolian (a.k.a "Natural Minor")</TableCell>
          <TableCell>1 2 b3 4 5 b6 b7</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>B</TableCell>
          <TableCell>B C D E F G A</TableCell>
          <TableCell>Locrian</TableCell>
          <TableCell>1 b2 b3 4 b5 b6 b7</TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <p>You can build modes on any base scale, and not all modes have names! Some common modes and scales are below:</p>

    <SubSectionTitle>Other Common Scales &amp; Modes</SubSectionTitle>
    <p>There are many other common, named scales (and keep in mind that a mode can be built off each scale degree in each scale). Explore them below with the interactive diagram below:</p>
    <ScaleViewer isEmbedded={props.isEmbedded} />

    <BecomeAPatronSection />

    <SubSectionTitle>Exercises</SubSectionTitle>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(ScaleNotes.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(PianoScales.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(GuitarScales.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(ScaleEarTraining.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>

    <p style={{ textAlign: "center" }}>{App.instance.renderNavLink("/essential-music-theory/intervals", "<< Previous: Intervals")} | Next: Chords (coming soon) >></p>
  </div>
);
export const ChordsSection: React.FunctionComponent<SectionProps> = props => (
  <div>
    <SectionTitle>Chords</SectionTitle>
    <p><Term>Chords</Term> are groups of three or more notes played simultaneously. Chords make up <Term>harmony</Term> in music &mdash; the sounds or feelings that result from multiple notes being played simultaneously. <Term>Harmony</Term> is the third and final fundamental element of music we will study now that we have explored <Term>rhythm</Term> and <Term>melody</Term>.</p>

    <SubSectionTitle>Triads</SubSectionTitle>
    <p>The simplest class of chords are the <Term>triads</Term>. <Term>Traids</Term> are chords made of exactly three notes.</p>
    <p>All chords have a root note, and the vast majority of chords are built with thirds (m3 and M3 intervals). Triads are no exception. To build a basic triad, we pick a root note, use a m3 or M3 to get to the 2nd note, and use another m3 or M3 (adding up to a 5th) to get to the 3rd note. Because there are 4 possible combinations of major and minor 3rds, there are 4 basic types of triads:</p>

    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Triad Type</TableCell>
          <TableCell>Symbols</TableCell>
          <TableCell>Stacked Intervals</TableCell>
          <TableCell>Intervals From Root Note</TableCell>
          <TableCell>Major Scale Based Formula</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Major Triad</TableCell>
          <TableCell>no symbol, M, Maj, Δ</TableCell>
          <TableCell>R, M3, m3</TableCell>
          <TableCell>R, M3, P5</TableCell>
          <TableCell>1, 3, 5</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Minor Triad</TableCell>
          <TableCell>m, min, −, lowercase pitch letter</TableCell>
          <TableCell>R, m3, M3</TableCell>
          <TableCell>R, m3, P5</TableCell>
          <TableCell>1, b3, 5</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Diminished Triad</TableCell>
          <TableCell>dim, °</TableCell>
          <TableCell>R, m3, m3</TableCell>
          <TableCell>R, m3, d5</TableCell>
          <TableCell>1, b3, b5</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Augmented Triad</TableCell>
          <TableCell>aug, +</TableCell>
          <TableCell>R, M3, M3</TableCell>
          <TableCell>R, M3, A5</TableCell>
          <TableCell>1, #3, #5</TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <NoteText>Looking at the "Intervals From Root Note" column of the table above, you can see that each triad has a root note, a note a 3rd above the root note, and a note a 5th above the root note. We call these chord notes the "root", the "3rd", and the "5th" accordingly.</NoteText>

    <p>We can use these triad formulas to easily find the three notes in each triad, for example:</p>
    <ul>
      <li>C major triad (C): C, E, G</li>
      <li>C minor triad (Cm): C, Eb, G</li>
      <li>C diminished triad (Cdim): C, Eb, Gb</li>
      <li>C augmented triad (Caug): C, E#, G#</li>
    </ul>

    <p>Use the interactive diagram below to explore these triads:</p>

    <ChordViewer title={"Triad Viewer"} chords={basicTriads} showGuitarFretboard={false} />

    <SubSectionTitle>Inversions</SubSectionTitle>
    <p><strong>You are free to play the notes of a chord in any order, spaced out as close or as far as you like, and any note in a chord can be repeated in different octaves.</strong> Whichever note you decide to play in the bass (the lowest note) of a chord determines which "inversion" a chord is in. If the root note is in the bass, the chord is considered in "root position". If "3rd" of the chord is in the bass, the chord is in "2nd inversion". If the "5th" of the chord is in the bass, the chord is in "2nd inversion". And so on for the 7th, 9th, 11th, and 13th (more on seventh chords and extended chords later).</p>

    <SubSectionTitle>Seventh Chords</SubSectionTitle>
    <p>Triads are built with two 3rds, but chords can be built with even more &ndash; <Term>seventh chords</Term>, for example, are built with three 3rds. Seventh chords are more "colorful" than triads, and are heavily used (and built upon) in Jazz music.</p>
    <p>You can find all of the basic seventh chords by adding additional major and minor 3rds to each of the 4 basic triads:</p>

    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Seventh Chord Type</TableCell>
          <TableCell>Common Symbols</TableCell>
          <TableCell>Stacked Intervals</TableCell>
          <TableCell>Intervals From Root Note</TableCell>
          <TableCell>Base Triad Type</TableCell>
          <TableCell>Major Scale Based Formula</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Dominant Seventh Chord</TableCell>
          <TableCell>7</TableCell>
          <TableCell>R, M3, m3, m3</TableCell>
          <TableCell>R, M3, P5, m7</TableCell>
          <TableCell>Major</TableCell>
          <TableCell>1, 3, 5, b7</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Major Seventh Chord</TableCell>
          <TableCell>M7, Maj7</TableCell>
          <TableCell>R, M3, m3, M3</TableCell>
          <TableCell>R, M3, P5, M7</TableCell>
          <TableCell>Major</TableCell>
          <TableCell>1, 3, 5, 7</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Minor Seventh Chord</TableCell>
          <TableCell>m7</TableCell>
          <TableCell>R, m3, M3, m3</TableCell>
          <TableCell>R, m3, P5, m7</TableCell>
          <TableCell>Minor</TableCell>
          <TableCell>1, b3, 5, b7</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Minor-Major Seventh Chord</TableCell>
          <TableCell>minMaj7</TableCell>
          <TableCell>R, m3, M3, M3</TableCell>
          <TableCell>R, m3, P5, M7</TableCell>
          <TableCell>Minor</TableCell>
          <TableCell>1, b3, 5, 7</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Diminished Seventh Chord</TableCell>
          <TableCell>°7, dim7</TableCell>
          <TableCell>R, m3, m3, m3</TableCell>
          <TableCell>R, m3, d5, d7</TableCell>
          <TableCell>Diminished</TableCell>
          <TableCell>1, b3, b5, bb7</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Half-Diminished Seventh Chord</TableCell>
          <TableCell><sup>ø7</sup>, m<sup>7b5</sup></TableCell>
          <TableCell>R, m3, m3, M3</TableCell>
          <TableCell>R, m3, d5, m7</TableCell>
          <TableCell>Diminished</TableCell>
          <TableCell>1, b3, b5, b7</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Augmented Seventh Chord</TableCell>
          <TableCell>+<sup>7</sup>, aug<sup>7</sup>, <sup>7#5</sup></TableCell>
          <TableCell>R, M3, M3, d3</TableCell>
          <TableCell>R, M3, A5, m7</TableCell>
          <TableCell>Augmented</TableCell>
          <TableCell>1, #3, #5, b7</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Augmented Major Seventh Chord</TableCell>
          <TableCell>aug<sup>M7</sup>, +<sup>M7</sup>, M<sup>7(#5)</sup></TableCell>
          <TableCell>R, M3, M3, m3</TableCell>
          <TableCell>R, M3, A5, M7</TableCell>
          <TableCell>Augmented</TableCell>
          <TableCell>1, #3, #5, 7</TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <NoteText>Note that if you try to build a seventh chord with the root and 3 major thirds, you end up with an augmented triad with a repeated root an octave higher.</NoteText>

    <p>Use the interactive diagram below to explore the basic seventh chords:</p>
    <ChordViewer title={"Seventh Chord Viewer"} chords={seventhChords} showGuitarFretboard={false} />

    <SubSectionTitle>Extended Chords &amp; Chord/Scale Relationships</SubSectionTitle>
    <p>You can continue to add 3rds to chords to form ninth chords (5 notes), eleventh chords (6 notes), and thirteenth (7 notes) chords. These chords are categorized as <Term>extended</Term> chords.</p>
    <p>Note that thirteenth chords have 7 notes in them. This is the same number of notes that make up most scales in Western music, so:</p>
    <ul>
      <li>we stop classifying chords at thirteenth chords, and instead chords with more notes are categorized as <Term>extended chords</Term> with added notes.</li>
      <li>you can think of a thirteenth chord as all the notes of one particular scale played together at the same time</li>
      <li>thirteenth chords and scales are really the same thing, just played differently</li>
    </ul>
    <p>As you omit notes from a thirteenth chord to form an eleventh chord, then a ninth chord, then a seventh chord, and lastly a triad, the chord has less notes (obviously) and therefore does not have to have as many notes in common with scales to "fit" with them. So chords with less notes can "fit" more scales, but are more ambiguous in meaning than chords with more notes.</p>
    <p>In this way, chords &amp; scales are inextricably tied in a relationship Jazz musicians call the "chord-scale system".</p>

    <SubSectionTitle>Diatonic Chords &amp; Roman Numeral Notation</SubSectionTitle>
    <p>One way to build chords is to exclusively pick notes out from a scale, separated by thirds. Because these chords are built solely with scale notes, they naturally "fit" well with the underlying scale, and lend themselves well to accompanying melodies built with the same scale. Chords which are derived in this manner are called <Term>diatonic chords</Term>, which make up <strong>most</strong> of the chords you find in Western music.</p>
    <p>For example, you could take a C major scale and pick out the 1st, 3rd, and 5th scale degrees (C, E, G). These notes form a <Term>major triad</Term> with C, the 1st scale degree of the major scale, as the root note.</p>
    <p><Term>Diatonic chords</Term> are commonly written in <Term>roman numeral notation</Term>, which uses roman numerals of scale degrees instead of letters to designate the root note. With <Term>roman numeral notation</Term>, the Cmaj (a.k.a. "C") chord above could instead be notated as a Imaj chord (a.k.a "I"). Note that "C" is not in the name of the chord at all. With <Term>roman numeral notation</Term>, any chord made with the 1st, 3rd, and 5th degrees of <strong>any</strong> major scale has the same name &ndash; I. This allows us to specify and analyze sequences of chords without concern for what key the composer decided to write the music in.</p>
    <p>There is one more thing to know about roman numeral notation &ndash; minor and diminished chords are written with lower case roman numerals. So, because a chord built with the 2nd, 4th, and 6th notes of a major scale is a minor chord, it would be written as ii, <strong>not</strong> II.</p>
    <p>Here are all the diatonic triads and seventh chords in some common scales:</p>

    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Scale</TableCell>
          <TableCell>Root Scale Degree</TableCell>
          <TableCell>Roman Numeral Notation</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell rowSpan={7}>Major</TableCell>
          <TableCell>1</TableCell>
          <TableCell>I<sup>M7</sup></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>2</TableCell>
          <TableCell>ii<sup>m7</sup></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>3</TableCell>
          <TableCell>iii<sup>m7</sup></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>4</TableCell>
          <TableCell>IV<sup>M7</sup></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>5</TableCell>
          <TableCell>V<sup>7</sup></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>6</TableCell>
          <TableCell>vi<sup>m7</sup></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>7</TableCell>
          <TableCell>vii<sup>ø7</sup></TableCell>
        </TableRow>
        <TableRow>
          <TableCell rowSpan={7}>Natural Minor</TableCell>
          <TableCell>1</TableCell>
          <TableCell>i<sup>m7</sup></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>2</TableCell>
          <TableCell>ii<sup>ø7</sup></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>3</TableCell>
          <TableCell>III<sup>M7</sup></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>4</TableCell>
          <TableCell>iv<sup>m7</sup></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>5</TableCell>
          <TableCell>v<sup>m7</sup></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>6</TableCell>
          <TableCell>vi<sup>M7</sup></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>7</TableCell>
          <TableCell>V<sup>7</sup></TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <p>TODO: listen to chords relative to root note</p>

    <SubSectionTitle>Other Chords</SubSectionTitle>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Chord Type</TableCell>
          <TableCell>Symbol</TableCell>
          <TableCell>Intervals</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Power Chord</TableCell>
          <TableCell>5</TableCell>
          <TableCell>R, P5</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Suspended 2nd Chord</TableCell>
          <TableCell>sus2</TableCell>
          <TableCell>R, M2, P5</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Suspended 4th Chord</TableCell>
          <TableCell>sus2</TableCell>
          <TableCell>R, P4, P5</TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <SubSectionTitle>Arpeggios</SubSectionTitle>
    <p>Arpeggios are simply the notes of a chord played separately in a melodic fashion.</p>

    <BecomeAPatronSection />
    
    <SubSectionTitle>Exercises</SubSectionTitle>
    <ChordViewer isEmbedded={props.isEmbedded} />
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(ChordNotes.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(PianoChords.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(GuitarChords.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardGroupComponent(ChordEarTraining.createFlashCardGroup(), props.isEmbedded, props.hideMoreInfoUri)}</div>
  </div>
);
export const ChordProgressionsSection: React.FunctionComponent<SectionProps> = props => (
  <div>
    <SectionTitle>Chord Progressions</SectionTitle>
    <p>Chord progressions are simply sequences of chords. Chord progressions are often notated with roman numerals, allowing written chord progressions to be independent of key.</p>
    <p>Chord progressions are built around tension &amp; resolution.</p>

    <SectionTitle>V - I Chord Progression</SectionTitle>
    <p>One of the most common and strongest patterns of tension &amp; resolution is the movement from a dominant (V7) chord to the tonic (I or i) chord. In major keys, the V7 chord is made of scale degrees 5, 7, 2, &amp; 4, and the I chord is made of scale degrees 1, 3, 5. The V7 chord carries tension and resolves to the I chord because of the tritone interval between scale degrees 7 and 4 (the 2nd &amp; 4th notes of the chord) and its resolution to the tonic and scale degree 3 in the tonic chord.</p>
    <p>This dominant - tonic resolution can be used between other scale degrees as well. A very common chord progression is II - V - I, which works because II is the dominant chord of V, and V is the dominant chord of I.</p>
    <p>Understanding the V - I resolution is key to understanding a vast majority of western chord progressions, which are often simply V - I progressions with alterations and added chords.</p>

    <SectionTitle>Voice Leading</SectionTitle>
    <p>The other key to understanding chord progressions is voice leading, which is the arrangement of the notes (called "voices") in chords to create smooth, flowing transitions between chords.</p>
    <p>The most important rule of voice leading is to use the smallest possible movements between the corresponding notes of each chord.</p>
    <p>Take the V7 - I chord progression in C major (G7 - C) as an example. One way we can voice these chords is by playing both of them in root position, with the C chord below the G7 chord.</p>

    <p>Diagram here</p>

    <p>The V7 chord contains the notes G, B, D, &amp; F, and the C major chord contains the notes C, E, &amp; G. These root position chords are an example of ineffective voice leading, because each voice in the G7 chord has to jump a long way to the corresponding voice in the C chord:</p>

    <ul>
      <li>G moves down a P5 to C</li>
      <li>B moves down a P5 to an E</li>
      <li>D moves down a P5 to a G</li>
      <li>F moves down a P4 to a C</li>
    </ul>

    <p>Contrast this with an example of good voice leading, where V7 is in 2nd inversion, and I is in root position.</p>
    
    <p>Diagram here</p>

    <p>You can hear that this voicing is much smoother. In this voicing, the voices move much less:</p>

    <ul>
      <li>D moves down a M2 to a C</li>
      <li>F moves down a m2 to an E</li>
      <li>G does not move at all</li>
      <li>B moves up a m2 to a C</li>
    </ul>

    <p>Smooth voice leading is enough to make a chord progression work, even without strong dominant - tonic movement.</p>
    
    <BecomeAPatronSection />

    <SubSectionTitle>Exercises</SubSectionTitle>
  </div>
);

const noteValueTableImgWidth = 24;

export interface ISectionProps {
  section: React.FunctionComponent<SectionProps>;
}
export class SectionContainer extends React.Component<ISectionProps, {}> {
  public render(): JSX.Element {
    return (
      <Card style={{ maxWidth: MAX_MAIN_CARD_WIDTH, marginBottom: "6em" }}>
        <CardContent>
          {React.createElement(this.props.section, { isEmbedded: this.isEmbedded, hideMoreInfoUri: this.hideMoreInfoUri })}
        </CardContent>
      </Card>
    );
  }

  private isEmbedded: boolean = false;
  private hideMoreInfoUri: boolean = true;
}