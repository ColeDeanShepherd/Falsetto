import * as React from "react";
import { Table, TableHead, TableBody, TableRow, TableCell } from "@material-ui/core";

import { Pitch } from "../../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";

import { createStudyFlashCardSetComponent } from "../../../StudyFlashCards/View";

import * as ScaleNotes from "../../Quizzes/Scales/ScaleFormulas";
import * as PianoScales from "../../Quizzes/Scales/PianoScales";
import * as ScaleEarTraining from "../../Quizzes/Scales/ScaleEarTraining";
import { ScaleViewer } from "../../Tools/ScaleViewer";

import * as GuitarScales from "../../Quizzes/Scales/GuitarScales";

import { ScaleType, Scale } from "../../../lib/TheoryLib/Scale";
import { PianoScaleDronePlayer } from "../../Utils/PianoScaleDronePlayer";
import { ScaleAudioPlayer } from "../../Utils/ScaleAudioPlayer";
import { SectionProps, Term, SectionTitle, SubSectionTitle, defaultRootPitch } from "./EssentialMusicTheory";
import { NavLinkView } from "../../../NavLinkView";
import { PianoScaleFormulaDiagram } from "../../Utils/PianoScaleFormulaDiagram";
import { NoteText } from "../../Utils/NoteText";

export const ScalesAndModesSection: React.FunctionComponent<SectionProps> = props => (
  <div>
    <p style={{ textAlign: "center" }}><NavLinkView to="/essential-music-theory/intervals">{"<< Previous: Intervals"}</NavLinkView> | <NavLinkView to="/essential-music-theory/chords">{"Next: Chords >>"}</NavLinkView></p>

    <SectionTitle>Scales &amp; Modes</SectionTitle>
    <SubSectionTitle>Scales</SubSectionTitle>
    <p><Term>Scales</Term> are sets of notes forming particular intervals with a tonal center called a <Term>root note</Term>. Most scales in Western music consist of 7 notes, so each scale selectively leaves out 5 notes to invoke a particular feeling in listeners.</p>
    <p><Term>Melody</Term> and <Term>harmony</Term> are built on the notes of scales (non-scale notes are used as well, with care). <Term>Melody</Term> is the arrangement of individual notes over time, with no two notes playing simultaneously. When you sing a song, you sing the <Term>melody</Term>. <Term>Harmony</Term> is the arrangement of multiple notes at the same time to form <Term>chords</Term>. We will explore <Term>harmony</Term> in the next lesson.</p>

    <SubSectionTitle>The Major Scale</SubSectionTitle>
    <p>One of the most common scales, upon which other scales are often built by modifying notes, is the <Term>major scale</Term>. The <Term>major scale</Term> is a 7 note scale which can be built using the formula: "R W W H W W W", where "R" denotes the root name, "W" means the next note is a whole step higher, and "H" means the next note is a half step higher.</p>
    <p>So, a C major scale, a scale with a <Term>root note</Term> of C following the major scale formula, is comprised of the notes: C, D, E, F, G, A, B.</p>
    <p style={{ textAlign: "center" }}><PianoScaleFormulaDiagram scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))} octaveCount={1} maxWidth={400} /></p>

    <NoteText>Though the notes of scales are often given in ascending order, they can be played in any order or repeated any number of times and still be considered the same scale. What makes a scale distinct is simply the set of notes it contains, not the order or the count of the notes.</NoteText>

    <p>Every scale has a <Term>root note</Term> which we naturally gravitate towards and compare other notes in the scale to. Every note in a scale forms a particular interval with the root note, and thinking about scales in terms of intervals from the root note can be helpful when analyzing why a particular scale or melody sounds the way it does. Because of this, sometimes scales are denoted in terms of intervals from the root note, like so:</p>
    <p>C Major scale formula: R, M2, M3, P4, P5, M6, M7</p>

    <p>Major scales often sound "happy" or "bright". Try playing the piano keyboard below to hear each note of the C major scale at the same time as the root note to internalize the sound of the major scale yourself.</p>
    <p style={{ textAlign: "center" }}><PianoScaleDronePlayer scale={new Scale(ScaleType.Ionian, new Pitch(PitchLetter.C, 0, 4))} octaveCount={1} maxWidth={400} /></p>
    
    <SubSectionTitle>Scale Degrees</SubSectionTitle>
    <p>Each note in a scale is sometimes called a <Term>scale degree</Term>, with the first note (the <Term>root note</Term>) called the 1st scale degree (C in C major), the next note above that called the 2nd scale degree (D in C major), the next note above that called the 3rd scale degree (E in C major), and so on.</p>
    <p>The major scale has the following scale degrees: 1 2 3 4 5 6 7. This is obvious, but listing the scale degrees of the major scale is useful because other scales can be built from major by adding sharps and flats to its scale degrees. We will notate scale formulas in this way from now on, starting with the <Term>natural minor scale</Term>:</p>
    <p>The <Term>natural minor scale</Term> (commonly referred to simply as the <Term>minor scale</Term>) is another common scale with a "darker" sound. Relative to the major scale, the natural minor scale has the following formula: 1 2 b3 4 5 b6 b7, meaning the natural minor scale is a major scale with the 3rd, 6th, and 7th scale degrees flattened. So, a C natural minor scale is comprised of the notes C, D, E♭, F, G, A♭, B♭.</p>
    
    <p>Try playing the piano keyboard below to get a feel for the natural minor scale.</p>
    <p style={{ textAlign: "center" }}><PianoScaleDronePlayer scale={new Scale(ScaleType.Aeolian, new Pitch(PitchLetter.C, 0, 4))} octaveCount={1} maxWidth={400} /></p>

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
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(ScaleNotes.flashCardSet, props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(PianoScales.flashCardSet, props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(GuitarScales.flashCardSet, props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(ScaleEarTraining.flashCardSet, props.isEmbedded, props.hideMoreInfoUri)}</div>

    <p style={{ textAlign: "center" }}><NavLinkView to="/essential-music-theory/intervals">{"<< Previous: Intervals"}</NavLinkView> | <NavLinkView to="/essential-music-theory/chords">{"Next: Chords >>"}</NavLinkView></p>
  </div>
);