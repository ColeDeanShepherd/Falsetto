import * as React from "react";
import { Table, TableHead, TableBody, TableRow, TableCell } from "@material-ui/core";

import App from '../../App';

import * as Utils from "../../../Utils";

import { playPitches } from "../../../Piano";

import { PianoKeyboard, renderPianoKeyboardNoteNames, PianoKeyboardMetrics } from "../../Utils/PianoKeyboard";
import { Pitch } from '../../../Pitch';
import { PitchLetter } from '../../../PitchLetter';

import { createStudyFlashCardSetComponent } from '../../StudyFlashCards';

import * as ScaleNotes from "../../Quizzes/Scales/ScaleNotes";
import * as PianoScales from "../../Quizzes/Scales/PianoScales";
import * as ScaleEarTraining from "../../Quizzes/Scales/ScaleEarTraining";
import { ScaleViewer } from "../../Tools/ScaleViewer";

import * as GuitarScales from "../../Quizzes/Scales/GuitarScales";

import { Rect2D } from '../../../Rect2D';
import { Vector2D } from '../../../Vector2D';
import { Size2D } from '../../../Size2D';
import { Margin } from '../../../Margin';
import { ScaleType, Scale } from '../../../Scale';
import { doesKeyUseSharps } from '../../../Key';
import { PianoScaleDronePlayer } from '../../Utils/PianoScaleDronePlayer';
import { ScaleAudioPlayer } from '../../Utils/ScaleAudioPlayer';
import { SectionProps, Term, SectionTitle, SubSectionTitle, NoteText, defaultRootPitch, pianoKeyboardStyle } from './EssentialMusicTheory';

export const PianoScaleFormulaDiagram: React.FunctionComponent<{ scale: ScaleType }> = props => {
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

export const ScalesAndModesSection: React.FunctionComponent<SectionProps> = props => (
  <div>
    <p style={{ textAlign: "center" }}>{App.instance.renderNavLink("/essential-music-theory/intervals", "<< Previous: Intervals")} | {App.instance.renderNavLink("/essential-music-theory/chords", "Next: Chords >>")}</p>

    <SectionTitle>Scales &amp; Modes</SectionTitle>
    <SubSectionTitle>Scales</SubSectionTitle>
    <p><Term>Scales</Term> are sets of notes forming particular intervals with a tonal center called a <Term>root note</Term>. Most scales in Western music consist of 7 notes, so each scale selectively leaves out 5 notes to invoke a particular feeling in listeners.</p>
    <p><Term>Melody</Term> and <Term>harmony</Term> are built on the notes of scales (non-scale notes are used as well, with care). <Term>Melody</Term> is the arrangement of individual notes over time, with no two notes playing simultaneously. When you sing a song, you sing the <Term>melody</Term>. <Term>Harmony</Term> is the arrangement of multiple notes at the same time to form <Term>chords</Term>. We will explore <Term>harmony</Term> and <Term>in the next lesson</Term>.</p>

    <SubSectionTitle>The Major Scale</SubSectionTitle>
    <p>One of the most common scales, upon which other scales are often built by modifying notes, is the <Term>major scale</Term>. The <Term>major scale</Term> is a 7 note scale which can be built using the formula: "R W W H W W W", where "R" denotes the root name, "W" means the next note is a whole step higher, and "H" means the next note is a half step higher.</p>
    <p>So, a C major scale, a scale with a <Term>root note</Term> of C following the major scale formula, is comprised of the notes: C, D, E, F, G, A, B.</p>
    <p style={{ textAlign: "center" }}><PianoScaleFormulaDiagram scale={ScaleType.Ionian} /></p>

    <NoteText>Though the notes of scales are often given in ascending order, they can be played in any order or repeated any number of times and still be considered the same scale. What makes a scale distinct is simply the set of notes it contains, not the order or the count of the notes.</NoteText>

    <p>Every scale has a <Term>root note</Term> which we naturally gravitate towards and compare other notes in the scale to. Every note in a scale forms a particular interval with the root note, and thinking about scales in terms of intervals from the root note can be helpful when analyzing why a particular scale or melody sounds the way it does. Because of this, sometimes scales are denoted in terms of intervals from the root note, like so:</p>
    <p>C Major scale formula: R, M2, M3, P4, P5, M6, M7</p>

    <p>Major scales often sound "happy" or "bright". Try playing the piano keyboard below to hear each note of the C major scale at the same time as the root note to internalize the sound of the major scale yourself.</p>
    <p style={{ textAlign: "center" }}><PianoScaleDronePlayer scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))} style={pianoKeyboardStyle} /></p>
    
    <SubSectionTitle>Scale Degrees</SubSectionTitle>
    <p>Each note in a scale is sometimes called a <Term>scale degree</Term>, with the first note (the <Term>root note</Term>) called the 1st scale degree (C in C major), the next note above that called the 2nd scale degree (D in C major), the next note above that called the 3rd scale degree (E in C major), and so on.</p>
    <p>The major scale has the following scale degrees: 1 2 3 4 5 6 7. This is obvious, but listing the scale degrees of the major scale is useful because other scales can be built from major by adding sharps and flats to its scale degrees. We will notate scale formulas in this way from now on, starting with the <Term>natural minor scale</Term>:</p>
    <p>The <Term>natural minor scale</Term> (commonly referred to simply as the <Term>minor scale</Term>) is another common scale with a "darker" sound. Relative to the major scale, the natural minor scale has the following formula: 1 2 b3 4 5 b6 b7, meaning the natural minor scale is a major scale with the 3rd, 6th, and 7th scale degrees flattened. So, a C natural minor scale is comprised of the notes C, D, E♭, F, G, A♭, B♭.</p>
    
    <p>Try playing the piano keyboard below to get a feel for the natural minor scale.</p>
    <p style={{ textAlign: "center" }}><PianoScaleDronePlayer scale={new Scale(ScaleType.Aeolian, new Pitch(PitchLetter.C, 0, 4))} style={pianoKeyboardStyle} /></p>

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
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>C</TableCell>
          <TableCell>C D E F G A B</TableCell>
          <TableCell>Ionian (a.k.a "Major")</TableCell>
          <TableCell>1 2 3 4 5 6 7</TableCell>
          <TableCell><ScaleAudioPlayer scale={new Scale(ScaleType.Ionian, defaultRootPitch)} /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>D</TableCell>
          <TableCell>D E F G A B C</TableCell>
          <TableCell>Dorian</TableCell>
          <TableCell>1 2 b3 4 5 6 b7</TableCell>
          <TableCell><ScaleAudioPlayer scale={new Scale(ScaleType.Dorian, defaultRootPitch)} /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>E</TableCell>
          <TableCell>E F G A B C D</TableCell>
          <TableCell>Phrygian</TableCell>
          <TableCell>1 b2 b3 4 5 b6 b7</TableCell>
          <TableCell><ScaleAudioPlayer scale={new Scale(ScaleType.Phrygian, defaultRootPitch)} /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>F</TableCell>
          <TableCell>F G A B C D E</TableCell>
          <TableCell>Lydian</TableCell>
          <TableCell>1 2 3 #4 5 6 7</TableCell>
          <TableCell><ScaleAudioPlayer scale={new Scale(ScaleType.Lydian, defaultRootPitch)} /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>G</TableCell>
          <TableCell>G A B C D E F</TableCell>
          <TableCell>Mixolydian</TableCell>
          <TableCell>1 2 3 4 5 6 b7</TableCell>
          <TableCell><ScaleAudioPlayer scale={new Scale(ScaleType.Mixolydian, defaultRootPitch)} /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>A</TableCell>
          <TableCell>A B C D E F G</TableCell>
          <TableCell>Aeolian (a.k.a "Natural Minor")</TableCell>
          <TableCell>1 2 b3 4 5 b6 b7</TableCell>
          <TableCell><ScaleAudioPlayer scale={new Scale(ScaleType.Aeolian, defaultRootPitch)} /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>B</TableCell>
          <TableCell>B C D E F G A</TableCell>
          <TableCell>Locrian</TableCell>
          <TableCell>1 b2 b3 4 b5 b6 b7</TableCell>
          <TableCell><ScaleAudioPlayer scale={new Scale(ScaleType.Locrian, defaultRootPitch)} /></TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <p>You can build modes on any base scale, and not all modes have names! Some common modes and scales are below:</p>

    <SubSectionTitle>Other Common Scales &amp; Modes</SubSectionTitle>
    <p>There are many other common, named scales (and keep in mind that a mode can be built off each scale degree in each scale). Explore them below with the interactive diagram below:</p>
    <ScaleViewer renderAllScaleShapes={false} isEmbedded={props.isEmbedded} />

    <SubSectionTitle>Interactive Exercises</SubSectionTitle>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(ScaleNotes.createFlashCardSet(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(PianoScales.createFlashCardSet(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(GuitarScales.createFlashCardSet(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(ScaleEarTraining.createFlashCardSet(), props.isEmbedded, props.hideMoreInfoUri)}</div>

    <p style={{ textAlign: "center" }}>{App.instance.renderNavLink("/essential-music-theory/intervals", "<< Previous: Intervals")} | {App.instance.renderNavLink("/essential-music-theory/chords", "Next: Chords >>")}</p>
  </div>
);