import * as React from "react";
import { Table, TableHead, TableBody, TableRow, TableCell } from "@material-ui/core";

import { createStudyFlashCardSetComponent } from '../../StudyFlashCards/View';

import * as PianoChords from "../../Quizzes/Chords/PianoChords";

import * as ChordNotes from "../../Quizzes/Chords/ChordNotes";
import * as GuitarChords from "../../Quizzes/Chords/GuitarChords";
import * as ChordEarTraining from "../../Quizzes/Chords/ChordEarTraining";
import { ChordViewer } from "../../Tools/ChordViewer";

import { DiatonicChordPlayer } from '../../Tools/DiatonicChordPlayer';
import { ChordAudioPlayer } from "../../Utils/ChordAudioPlayer";
import { SectionProps, Term, SectionTitle, SubSectionTitle, NoteText, defaultRootPitch } from './EssentialMusicTheory';
import { Chord, ChordType, ChordTypeGroup } from '../../../Chord';
import { NavLinkView } from '../../../NavLinkView';

export const ChordsSection: React.FunctionComponent<SectionProps> = props => (
  <div>
    <p style={{ textAlign: "center" }}><NavLinkView to="/essential-music-theory/scales-and-modes">{"<< Previous: Scales & Modes"}</NavLinkView> | <NavLinkView to="/essential-music-theory/chord-progressions">{"Next: Chord Progressions >>"}</NavLinkView></p>

    <SectionTitle>Chords</SectionTitle>
    <p><Term>Chords</Term> are groups of three or more notes played simultaneously. Chords make up <Term>harmony</Term> in music &mdash; the sounds or feelings that result from multiple notes being played simultaneously. <Term>Harmony</Term> is the third and final fundamental element of music we will study, now that we have explored the first two: <Term>rhythm</Term> and <Term>melody</Term>.</p>

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
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Major Triad</TableCell>
          <TableCell>no symbol, M, Maj, Δ</TableCell>
          <TableCell>R, M3, m3</TableCell>
          <TableCell>R, M3, P5</TableCell>
          <TableCell>1, 3, 5</TableCell>
          <TableCell>
            <ChordAudioPlayer chord={new Chord(ChordType.Major, defaultRootPitch)} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Minor Triad</TableCell>
          <TableCell>m, min, −, lowercase pitch letter</TableCell>
          <TableCell>R, m3, M3</TableCell>
          <TableCell>R, m3, P5</TableCell>
          <TableCell>1, b3, 5</TableCell>
          <TableCell>
            <ChordAudioPlayer chord={new Chord(ChordType.Minor, defaultRootPitch)} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Diminished Triad</TableCell>
          <TableCell>dim, °</TableCell>
          <TableCell>R, m3, m3</TableCell>
          <TableCell>R, m3, d5</TableCell>
          <TableCell>1, b3, b5</TableCell>
          <TableCell>
            <ChordAudioPlayer chord={new Chord(ChordType.Diminished, defaultRootPitch)} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Augmented Triad</TableCell>
          <TableCell>aug, +</TableCell>
          <TableCell>R, M3, M3</TableCell>
          <TableCell>R, M3, A5</TableCell>
          <TableCell>1, #3, #5</TableCell>
          <TableCell>
            <ChordAudioPlayer chord={new Chord(ChordType.Augmented, defaultRootPitch)} />
          </TableCell>
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

    <ChordViewer title={"Triad Viewer"} chordTypeGroups={[new ChordTypeGroup("Basic Triads", ChordType.BasicTriads)]} showGuitarFretboard={false} />

    <SubSectionTitle>Inversions</SubSectionTitle>
    <p><strong>You are free to play the notes of a chord in any order, spaced out as close or as far as you like, and any note in a chord can be repeated in different octaves.</strong> Whichever note you decide to play in the bass (the lowest note) of a chord determines which "inversion" a chord is in. If the root note is in the bass, the chord is considered in "root position". If "3rd" of the chord is in the bass, the chord is in "1st inversion". If the "5th" of the chord is in the bass, the chord is in "2nd inversion". And so on for the 7th, 9th, 11th, and 13th (more on seventh chords and extended chords later).</p>

    <SubSectionTitle>Seventh Chords</SubSectionTitle>
    <p>Triads are built with two 3rds, but chords can be built with even more &mdash; <Term>seventh chords</Term>, for example, are built with three 3rds. Seventh chords are more "colorful" than triads, and are heavily used (and built upon) in Jazz music.</p>
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
          <TableCell></TableCell>
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
          <TableCell>
            <ChordAudioPlayer chord={new Chord(ChordType.Dom7, defaultRootPitch)} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Major Seventh Chord</TableCell>
          <TableCell>M7, Maj7</TableCell>
          <TableCell>R, M3, m3, M3</TableCell>
          <TableCell>R, M3, P5, M7</TableCell>
          <TableCell>Major</TableCell>
          <TableCell>1, 3, 5, 7</TableCell>
          <TableCell>
            <ChordAudioPlayer chord={new Chord(ChordType.Maj7, defaultRootPitch)} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Minor Seventh Chord</TableCell>
          <TableCell>m7</TableCell>
          <TableCell>R, m3, M3, m3</TableCell>
          <TableCell>R, m3, P5, m7</TableCell>
          <TableCell>Minor</TableCell>
          <TableCell>1, b3, 5, b7</TableCell>
          <TableCell>
            <ChordAudioPlayer chord={new Chord(ChordType.Min7, defaultRootPitch)} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Minor-Major Seventh Chord</TableCell>
          <TableCell>minMaj7</TableCell>
          <TableCell>R, m3, M3, M3</TableCell>
          <TableCell>R, m3, P5, M7</TableCell>
          <TableCell>Minor</TableCell>
          <TableCell>1, b3, 5, 7</TableCell>
          <TableCell>
            <ChordAudioPlayer chord={new Chord(ChordType.MinMaj7, defaultRootPitch)} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Diminished Seventh Chord</TableCell>
          <TableCell>°7, dim7</TableCell>
          <TableCell>R, m3, m3, m3</TableCell>
          <TableCell>R, m3, d5, d7</TableCell>
          <TableCell>Diminished</TableCell>
          <TableCell>1, b3, b5, bb7</TableCell>
          <TableCell>
            <ChordAudioPlayer chord={new Chord(ChordType.Dim7, defaultRootPitch)} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Half-Diminished Seventh Chord</TableCell>
          <TableCell><sup>ø7</sup>, m<sup>7b5</sup></TableCell>
          <TableCell>R, m3, m3, M3</TableCell>
          <TableCell>R, m3, d5, m7</TableCell>
          <TableCell>Diminished</TableCell>
          <TableCell>1, b3, b5, b7</TableCell>
          <TableCell>
            <ChordAudioPlayer chord={new Chord(ChordType.HalfDim7, defaultRootPitch)} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Augmented Seventh Chord</TableCell>
          <TableCell>+<sup>7</sup>, aug<sup>7</sup>, <sup>7#5</sup></TableCell>
          <TableCell>R, M3, M3, d3</TableCell>
          <TableCell>R, M3, A5, m7</TableCell>
          <TableCell>Augmented</TableCell>
          <TableCell>1, #3, #5, b7</TableCell>
          <TableCell>
            <ChordAudioPlayer chord={new Chord(ChordType.Aug7, defaultRootPitch)} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Augmented Major Seventh Chord</TableCell>
          <TableCell>aug<sup>M7</sup>, +<sup>M7</sup>, M<sup>7(#5)</sup></TableCell>
          <TableCell>R, M3, M3, m3</TableCell>
          <TableCell>R, M3, A5, M7</TableCell>
          <TableCell>Augmented</TableCell>
          <TableCell>1, #3, #5, 7</TableCell>
          <TableCell>
            <ChordAudioPlayer chord={new Chord(ChordType.AugMaj7, defaultRootPitch)} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <NoteText>Note that if you try to build a seventh chord with the root and 3 major thirds, you end up with an augmented triad with a repeated root an octave higher.</NoteText>

    <p>Use the interactive diagram below to explore the basic seventh chords:</p>
    <ChordViewer title={"Seventh Chord Viewer"} chordTypeGroups={[new ChordTypeGroup("Seventh Chords", ChordType.SimpleSeventhChords)]} showGuitarFretboard={false} />

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
    <p>Use the interactive digram below to explore extended chords (and other chords we haven't covered):</p>
    <ChordViewer isEmbedded={props.isEmbedded} />

    <SubSectionTitle>Diatonic Chords &amp; Roman Numeral Notation</SubSectionTitle>
    <p>One way to build chords is to exclusively pick notes out from a scale, separated by thirds. Because these chords are built solely with scale notes, they naturally "fit" well with the underlying scale, and lend themselves well to accompanying melodies built with the same scale. Chords which are derived in this manner are called <Term>diatonic chords</Term>, which make up <strong>most</strong> of the chords you find in Western music.</p>
    <p>For example, you could take a C major scale and pick out the 1st, 3rd, and 5th scale degrees (C, E, G). These notes form a <Term>major triad</Term> with C, the 1st scale degree of the major scale, as the root note.</p>
    <p><Term>Diatonic chords</Term> are commonly written in <Term>roman numeral notation</Term>, which uses roman numerals of scale degrees instead of letters to designate the root note. With <Term>roman numeral notation</Term>, the Cmaj (a.k.a. "C") chord above could instead be notated as a Imaj chord (a.k.a "I"). Note that "C" is not in the name of the chord at all. With <Term>roman numeral notation</Term>, any chord made with the 1st, 3rd, and 5th degrees of <strong>any</strong> major scale has the same name &mdash; I. This allows us to specify and analyze sequences of chords without concern for what key the composer decided to write the music in.</p>
    <p>There is one more thing to know about roman numeral notation &mdash; minor and diminished chords are written with lower case roman numerals. So, because a chord built with the 2nd, 4th, and 6th notes of a major scale is a minor chord, it would be written as ii, <strong>not</strong> II.</p>
    <p>Use the interactive diagram below to explore diatonic triads and seventh chords in common scales:</p>
    
    <DiatonicChordPlayer />

    <SubSectionTitle>Arpeggios</SubSectionTitle>
    <p>Though chords are groups of notes played simultaneously, you can also choose to play the notes of a chord individually in a melody, to create something called an <Term>arpeggio</Term>. Arpeggios are another way to add harmonic content to music by <strong>implying</strong> the chords instead of playing them outright.</p>

    <SubSectionTitle>Interactive Exercises</SubSectionTitle>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(ChordNotes.flashCardSet, props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(PianoChords.flashCardSet, props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(GuitarChords.flashCardSet, props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(ChordEarTraining.flashCardSet, props.isEmbedded, props.hideMoreInfoUri)}</div>

    <p style={{ textAlign: "center" }}><NavLinkView to="/essential-music-theory/scales-and-modes">{"<< Previous: Scales & Modes"}</NavLinkView> | <NavLinkView to="/essential-music-theory/chord-progressions">{"Next: Chord Progressions >>"}</NavLinkView></p>
  </div>
);