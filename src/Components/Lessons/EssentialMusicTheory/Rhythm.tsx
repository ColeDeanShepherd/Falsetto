import * as React from "react";
import { Table, TableHead, TableBody, TableRow, TableCell } from "@material-ui/core";


import { YouTubeVideo } from "../../Utils/YouTubeVideo";
import { TimeSignature } from "../../../lib/TheoryLib/TimeSignature";

import { createStudyFlashCardSetComponent } from '../../StudyFlashCards/View';

import { Metronome } from "../../Tools/Metronome";

import * as RhythmQuiz from "./RhythmQuiz";
import * as NoteDurations from "../../Quizzes/Sheet Music/SheetMusicNoteDurations";
import * as NoteValueNumbers from "../../Quizzes/Notes/NoteValueNumbers";

import measures from "../../../img/sheet-music/measures.svg";
import timeSignatureDiagram from "../../../img/sheet-music/time-signature.svg";
import notesRestsDiagram from "../../../img/sheet-music/notes-and-rests.svg";

import wholeNote from "../../../img/sheet-music/whole-note.svg";
import wholeRest from "../../../img/sheet-music/whole-rest.svg";
import halfNote from "../../../img/sheet-music/half-note.svg";
import halfRest from "../../../img/sheet-music/half-rest.svg";
import quarterNote from "../../../img/sheet-music/quarter-note.svg";
import quarterRest from "../../../img/sheet-music/quarter-rest.svg";
import eighthNote from "../../../img/sheet-music/eighth-note.svg";
import eighthRest from "../../../img/sheet-music/eighth-rest.svg";
import sixteenthNote from "../../../img/sheet-music/sixteenth-note.svg";
import sixteenthRest from "../../../img/sheet-music/sixteenth-rest.svg";
import _32ndNote from "../../../img/sheet-music/32nd-note.svg";
import _32ndRest from "../../../img/sheet-music/32nd-rest.svg";

import timeSignature44 from "../../../img/sheet-music/time-signature-4-4.svg";
import timeSignature34 from "../../../img/sheet-music/time-signature-3-4.svg";

import { TimeSignaturePlayer } from '../../Tools/TimeSignaturePlayer';
import { NoteValuePlayer } from '../../Tools/NoteValuePlayer';
import { SectionProps, SectionTitle, Term, SubSectionTitle, NoteText } from './EssentialMusicTheory';
import { NavLinkView } from '../../../NavLinkView';

const noteValueTableImgWidth = 24;

export const RhythmSection: React.FunctionComponent<SectionProps> = props => (
  <div>
    <p style={{ textAlign: "center" }}><NavLinkView to="/essential-music-theory">{"<< Previous: Introduction"}</NavLinkView> | <NavLinkView to="/essential-music-theory/notes">{"Next: Notes >>"}</NavLinkView></p>

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
    
    <SubSectionTitle>Interactive Exercises</SubSectionTitle>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(RhythmQuiz.flashCardSet, props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(NoteDurations.flashCardSet, props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(NoteValueNumbers.flashCardSet, props.isEmbedded, props.hideMoreInfoUri)}</div>

    <p style={{ textAlign: "center" }}><NavLinkView to="/essential-music-theory">{"<< Previous: Introduction"}</NavLinkView> | <NavLinkView to="/essential-music-theory/notes">{"Next: Notes >>"}</NavLinkView></p>
  </div>
);