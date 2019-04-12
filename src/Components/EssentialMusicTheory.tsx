import * as React from "react";
import { CardContent, Card } from "@material-ui/core";

import { PianoKeyboard, renderPianoKeyboardNoteNames } from "./PianoKeyboard";
import { Pitch } from '../Pitch';
import { PitchLetter } from '../PitchLetter';
import { createStudyFlashCardGroupComponent } from './StudyFlashCards';

import * as NoteDurations from "./Quizzes/NoteDurations";

import * as IntervalNamesToHalfSteps from "./Quizzes/IntervalNamesToHalfSteps";
import * as IntervalEarTraining from "./Quizzes/IntervalEarTraining";

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

const MainTitle: React.FunctionComponent<{}> = props => <h1>{props.children}</h1>;
const SectionTitle: React.FunctionComponent<{}> = props => <h2>{props.children}</h2>;
const SubSectionTitle: React.FunctionComponent<{}> = props => <h3>{props.children}</h3>;

export class EssentialMusicTheory extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <Card>
        <CardContent>
          <MainTitle>Essential Music Theory</MainTitle>
          <p>This is designed to teach students of all levels the essentials of Western music theory in a no-frills manner with accompanying interactive exercises to test and apply your knowledge. As you work your way through this lesson, keep in mind that music theory is descriptive, not prescriptive, meaning a lot of what you learn here are guidelines, not hard rules. The goal with learning music theory is not to restrict ourselves, but to understand how existing music works, how to apply this understanding to your own music, and how to break the rules effectively, and with intent.</p>
          <p>Let's get started!</p>

          <SectionTitle>Rhythm</SectionTitle>
          <p>Rhythym is the arrangement of sounds over time. Rhythym is arguably the most fundamental element of music, as any sound can be arranged rhythmically to make music, and without rhythym, melodies and harmonies can lose their impact.</p>

          <SubSectionTitle>Tempo</SubSectionTitle>
          <p>Tempo is the speed of the beat, and the beat is the repeating pulse in a piece of music. Tempo is often given as beats per minute (BPM). 120 BPM, for example, means there are two beats per second.</p>
          <p>METRONOME HERE</p>

          <SubSectionTitle>Measures, Time Signatures, and Note Durations</SubSectionTitle>
          <p>A measure is a small section of music with a fixed duration, the smallest division of a piece of music after individual beats.</p>
          <p>A time signature describes the type and number of beats that make up a measure.</p>
          <p>The most common time signature is 4/4. The number on top means the number of beats in a measure. The number on bottom denotes the type of beat making up the measure.</p>
          <p>So, 4/4 means there are 4 quarter notes in a measure. 3/4 means there are 3 quarter notes in a measure. 5/8 means there are 5 eighth notes in a measure. And so on...</p>
          <p>The most common types of notes, and the numbers they are denoted by in the bottom of a time signature, are:</p>
          <ul>
            <li>Whole Note - 1</li>
            <li>Half Note - 2</li>
            <li>Quarter Note - 4</li>
            <li>Eighth Note - 8</li>
            <li>16th Note - 16</li>
            <li>32nd Note - 32</li>
            <li>64th Note - 64</li>
            <li>And so on...</li>
          </ul>
          <p>All note durations that are used when denoting time signatures are powers of two (1, 2, 4, 8, ...), but you can also divide these note durations into any number of notes, like:</p>
          <ul>
            <li>triplets</li>
            <li>quintuplets</li>
            <li>sextuplets</li>
            <li>septuplets</li>
            <li>etc...</li>
          </ul>

          <SubSectionTitle>Strong and Weak Beats</SubSectionTitle>
          <p>The beats in a measure are classified into strong and weak beats. Strong beats carry the most weight in a rhythm, and weak beats carry less weight.</p>
          <p>In 4/4, the first beat carries the most weight, and is a strong beat. The second beat carries less weight, and is a weak beat. The third beat carries more weight than the second beat, but less than the first, and is considered a strong beat. The fourth beat is considered a weak beat.</p>
          <p>In 3/4, only the first beat is considered a strong beat.</p>
          <p>TODO: more examples</p>
          <p>TODO: interactive exercise</p>

          <SubSectionTitle>Rubato</SubSectionTitle>
          <p>Though almost all music is structured using time signatures, performers and composers sometimes use rubato, or intentional deviation from the tempo to invoke a particular feeling in listeners.</p>
          <p>TODO: examples</p>
          
          <p>RHYTHYM TAPPER HERE</p>
          {createStudyFlashCardGroupComponent(NoteDurations.createFlashCardGroup(), this.isEmbedded, this.hideMoreInfoUri)}

          <SectionTitle>Notes</SectionTitle>
          <p>All Western music is made with 12 notes, as seen on the piano below.</p>
          
          <div>
            <PianoKeyboard
              width={300} height={150}
              lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
              highestPitch={new Pitch(PitchLetter.B, 0, 4)}
              pressedPitches={[]}
              renderExtrasFn={renderPianoKeyboardNoteNames} />
          </div>

          <p>The white note are "natural" notes, and the black notes are "accidentals". All of the black notes have two names - one using a sharp (#), which means we think about the note as a slightly raised version of the natural note to the left, and one using a flat (b), which means we think about the note as a slightly lowered version of the natural note to the right.</p>
          <p>Note that the notes repeat as you move higher or lower:</p>

          <div>
            <PianoKeyboard
              width={300} height={150}
              lowestPitch={new Pitch(PitchLetter.C, 0, 3)}
              highestPitch={new Pitch(PitchLetter.B, 0, 4)}
              pressedPitches={[]}
              renderExtrasFn={renderPianoKeyboardNoteNames} />
          </div>

          <p>This is because notes with the same name sound similar to us, just higher or lower versions of the same note.</p>

          <SubSectionTitle>Non-essentials</SubSectionTitle>
          <p>Why are only 7 natural notes, with the rest being sharps &amp; flats? Why don't we just call the 12 notes A, B, C, D, E, F, G, H, I, J, K, and L? Why aren't there accidental notes in between B &amp; C and E &amp; F?</p>
          <p>This seems counter-intuitive at first, but the answer to all of these questions is: to make navigating instruments easier, and to work well with 7-note scales that most Western music is based on. Imagine trying to play a piano made entirely of white notes. It would be difficult to name any particular note because there is no frame of reference. That is possible to remedy by adding visual markers, but ideally you should be able to play an instruments by feel, without looking at them. Also, most Western music is based on 7-note scales, and having only 7 natural notes allows us to easily express each scale using the 7 natural notes which are then modified by sharps and flats.</p>

          <SectionTitle>Intervals</SectionTitle>
          <p>An interval is the distance between two notes. Understanding intervals, and training your ear to be able to recognize them, is one of the most important skills as a composer and/or musician, as a firm grasp on intervals establishes a link between your mind, your instrument, and your emotions.</p>
          <p>Intervals are measured by the number of "half steps" or "semitones" between the notes. Half steps are the smallest interval (aside from unison) that can be made between two notes. For example, there is one half step between:</p>
          <ul>
            <li>C &amp; D#</li>
            <li>A &amp; Ab</li>
            <li>E &amp; F</li>
            <li>C &amp; B</li>
          </ul>

          <SectionTitle>Simple Intervals</SectionTitle>
          <p>There are 13 "simple" intervals:</p>
          <ul>
            <li>Unison - 0 half steps</li>
            <li>Minor 2nd (m2) - 1 half step</li>
            <li>Major 2nd (M2) - 2 half steps, also called a "whole step" or a "tone"</li>
            <li>Minor 3rd (m3) - 3 half steps</li>
            <li>Major 3rd (M3) - 4 half steps</li>
            <li>Perfect 4th (P4) - 5 half steps</li>
            <li>Tritone (A4/d5) - 6 half steps</li>
            <li>Perfect 5th (P5) - 7 half steps</li>
            <li>Minor 6th (m6) - 8 half steps</li>
            <li>Major 6th (M6) - 9 half steps</li>
            <li>Minor 7th  (m7) - 10 half steps</li>
            <li>Major 7th (M7) - 11 half steps</li>
            <li>Octave (P8) - 12 half steps</li>
          </ul>
          <p>"Simple" intervals are intervals as large, or smaller than, an octave.</p>

          <SectionTitle>Compound Intervals</SectionTitle>
          <p>Beyond the "simple" intervals, there are "compound" intervals, for example:</p>
          <ul>
            <li>Minor 9th (m9) - 13 half steps, or 1 octave and 1 half step</li>
            <li>Perfect 16th (P16) - 24 half steps, or 2 octaves</li>
            <li>Major 17th (M17) - 26 half steps, or 2 octaves and 2 half steps</li>
            <li>and so on...</li>
          </ul>
          <p>but when analyzing intervals, it is often useful to reduce compound intervals to simple intervals by subtracting octaves until you are left with a simple interval.</p>
          <p>TODO: examples?</p>

          <p>TODO: ascending &amp; descending</p>
          
          <SectionTitle>Interval Qualities</SectionTitle>
          <p>TODO: Explain minor/major/perfect/augmented/diminished</p>

          <SectionTitle>Interval Numbering Explained</SectionTitle>
          <p>TODO: Explain 2nd, 3rd, etc, and enharmonic intervals</p>

          <SectionTitle>Consonance &amp; Dissonance</SectionTitle>
          <table>
            <thead>
              <tr>
                <th>Interval</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Minor 2nd</td>
                <td>Sharp Dissonance</td>
              </tr>
              <tr>
                <td>Major 2nd</td>
                <td>Mild Dissonance</td>
              </tr>
              <tr>
                <td>Minor 3rd</td>
                <td>Soft Consonance</td>
              </tr>
              <tr>
                <td>Major 3rd</td>
                <td>Soft Consonance</td>
              </tr>
              <tr>
                <td>Perfect 4th</td>
                <td>Context-Dependent</td>
              </tr>
              <tr>
                <td>Tritone</td>
                <td>Neutral? Restless? Sharp Dissonance?</td>
              </tr>
              <tr>
                <td>Perfect 5th</td>
                <td>Open Consonance</td>
              </tr>
              <tr>
                <td>Minor 6th</td>
                <td>Soft Consonance</td>
              </tr>
              <tr>
                <td>Major 6th</td>
                <td>Soft Consonance</td>
              </tr>
              <tr>
                <td>Minor 7th</td>
                <td>Mild Dissonance</td>
              </tr>
              <tr>
                <td>Major 7th</td>
                <td>Sharp Dissonance</td>
              </tr>
              <tr>
                <td>Octave</td>
                <td>Open Consonance</td>
              </tr>
            </tbody>
          </table>

          <SectionTitle>Interval Ear Training</SectionTitle>
          <p>It is important to train your ear to recognize intervals quickly, and your inner ear to be able to produce intervals of a certain type, to be able to express yourself on an instrument or on paper.</p>
          <p>One way to train your ear to recognize intervals is by associating each interval with a song.</p>
          <p>Here are some example songs for each interval.</p>
          <table>
            <thead>
              <tr>
                <th>Interval</th>
                <th>Song</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Minor 2nd</td>
                <td>Fur Elise, Jaws Theme</td>
              </tr>
              <tr>
                <td>Major 2nd</td>
                <td></td>
              </tr>
              <tr>
                <td>Minor 3rd</td>
                <td></td>
              </tr>
              <tr>
                <td>Major 3rd</td>
                <td></td>
              </tr>
              <tr>
                <td>Perfect 4th</td>
                <td>Amazing Grace</td>
              </tr>
              <tr>
                <td>Tritone</td>
                <td>The Simpsons Theme Song</td>
              </tr>
              <tr>
                <td>Perfect 5th</td>
                <td></td>
              </tr>
              <tr>
                <td>Minor 6th</td>
                <td>Valse Op 64. No 2. - Chopin</td>
              </tr>
              <tr>
                <td>Major 6th</td>
                <td>Nocturne Opus 9 No. 2 - Chopin</td>
              </tr>
              <tr>
                <td>Minor 7th</td>
                <td></td>
              </tr>
              <tr>
                <td>Major 7th</td>
                <td></td>
              </tr>
              <tr>
                <td>Octave</td>
                <td>Somewhere Over The Rainbow</td>
              </tr>
            </tbody>
          </table>

          {createStudyFlashCardGroupComponent(IntervalNamesToHalfSteps.createFlashCardGroup(), this.isEmbedded, this.hideMoreInfoUri)}
          {createStudyFlashCardGroupComponent(IntervalEarTraining.createFlashCardGroup(), this.isEmbedded, this.hideMoreInfoUri)}

          <SectionTitle>Scales &amp; Modes</SectionTitle>
          <SubSectionTitle>Scales</SubSectionTitle>
          <p>Scales are fundamental to music and lay the groundwork for both melody and harmony in music. Melody is the arrangement of individual notes, none playing simultaneously, over time. When you sing a song, you are singing the melody of that song.</p>
          <p>Scales are nothing more than sets of notes forming particular intervals with a tonal center called a root note. Most scales in western music have 7 notes in them, so each scale selectively leaves out 5 notes to produce a certain feeling.</p>
          <p>One of the most common scales, upon which other scales are often built by modifying a few notes, is the major scale. The major scale is a 7 note scale which can be built using the formula: "R W W H W W W", where "R" means the root name, "W" means a whole step, and "H" means a half step.</p>
          <p>So, a C major scale, a scale with a root note of C following the major scale formula, is comprised of the notes: C, D, E, F, G, A, B.</p>
          <p>TODO: interactive diagram</p>
          <p>Though the notes of a scale are often given in ascending order, they can be played in any order, and repeated any number of times,and still be considered the same scale. What makes a scale distinct from other scales is simply the set of notes it contains.</p>

          <p>Each note in a scale is sometimes called a "scale degree", with the first &amp; "root" note called the 1st scale degree (C in C major), the next note above that called the 2nd scale degree (D in C major), the next note above that called the 3rd scale degree (E in C major), and so on.</p>
          <p>So, the major scale has the following scale degrees: 1 2 3 4 5 6 7, and other scales can be built by adding sharps and flats to the notes of of the major scale.</p>
          <p>Another common scale with a darker sound is the natural minor scale. Relative to the major scale, the natural minor scale has the following formula: 1 2 b3 4 5 b6 b7, meaning the natural minor scale is a major scale with the 3rd, 6th, and 7th scale degrees flattened. So, a C natural minor scale (commonly referred to simply as a C minor scale) is comprised of the notes C, D, Eb, F, G, Ab, Bb.</p>

          <SubSectionTitle>Modes</SubSectionTitle>
          <p>Modes are simply scales that can be built by starting a particular scale on different notes and considering that starting note the root note.</p>
          <p>So, the modes of the C major scale are the following scales:</p>
          <ul>
            <li>C D E F G A B</li>
            <li>D E F G A B C</li>
            <li>E F G A B C D</li>
            <li>F G A B C D E</li>
            <li>G A B C D E F</li>
            <li>A B C D E F G</li>
            <li>B C D E F G A</li>
          </ul>

          <p>Because there are 7 notes in the C major scale, there are 7 modes that can be built from it.</p>
          <p>Note that each of the modes of a scale (except the 1st mode) has a different formula than the major scale, and often has a special name. The modes of the major scale have the following names and formulas:</p>

          <table>
            <thead>
              <tr>
                <th>Mode Name</th>
                <th>Root Note as Scale Degree of Major Scale</th>
                <th>Mode Formula (relative to major scale)</th>
                <th>Mode Formula (using whole steps and half steps)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ionian (a.k.a. major)</td>
                <td>1</td>
                <td>1 2 3 4 5 6 7</td>
                <td>R W W H W W W</td>
              </tr>
              <tr>
                <td>Dorian</td>
                <td>2</td>
                <td>1 2 b3 4 5 6 7</td>
                <td>R W H W W W H</td>
              </tr>
              <tr>
                <td>Phrygian</td>
                <td>3</td>
                <td>1 b2 b3 4 5 b6 b7</td>
                <td>R H W W W H W</td>
              </tr>
              <tr>
                <td>Lydian</td>
                <td>4</td>
                <td>1 2 3 b4 5 6 7</td>
                <td>R W W W H W W</td>
              </tr>
              <tr>
                <td>Mixolydian</td>
                <td>5</td>
                <td>1 2 3 4 5 6 b7</td>
                <td>R W W H W W H</td>
              </tr>
              <tr>
                <td>Aeolian (a.k.a natural minor)</td>
                <td>6</td>
                <td>1 2 b3 4 5 b6 b7</td>
                <td>R W H W W H W</td>
              </tr>
              <tr>
                <td>Locrian</td>
                <td>7</td>
                <td>1 b2 b3 b4 5 b6 b7</td>
                <td>R H W W H W W</td>
              </tr>
            </tbody>
          </table>

          <p>To get a feeling for a scale, try playing the scale with a droned, or sustained and repeated, root note. This will bring out the sound of the intervals in the scale.</p>

          <SubSectionTitle>Other Common Scales</SubSectionTitle>
          <p>There are many other common, named scales (and keep in mind that a mode can be built off each scale degree in each scale), including:</p>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Formula (relative to major scale)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Harmonic Minor Scale</td>
                <td>Version of the minor scale often used to build chords due to the tendency of the 7th scale degree to lean towards the root note above it.</td>
                <td>1 2 b3 4 5 b6 7</td>
              </tr>
              <tr>
                <td>Major Pentatonic Scale</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Minor Pentatonic Scale</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Blues Scale</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Tonic Diminished Scale</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Dominant Diminished Scale</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Whole Tone Scale</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Chromatic Scale</td>
                <td>Contains all 12 notes.</td>
                <td>R H H H H H H H H H H H</td>
              </tr>
            </tbody>
          </table>

          <ScaleViewer isEmbedded={this.isEmbedded} />
          {createStudyFlashCardGroupComponent(ScaleNotes.createFlashCardGroup(), this.isEmbedded, this.hideMoreInfoUri)}
          {createStudyFlashCardGroupComponent(PianoScales.createFlashCardGroup(), this.isEmbedded, this.hideMoreInfoUri)}
          {createStudyFlashCardGroupComponent(GuitarScales.createFlashCardGroup(), this.isEmbedded, this.hideMoreInfoUri)}
          {createStudyFlashCardGroupComponent(ScaleEarTraining.createFlashCardGroup(), this.isEmbedded, this.hideMoreInfoUri)}

          <SectionTitle>Chords</SectionTitle>
          <ul>
            <li>Overview</li>
            <li>Triads</li>
            <li>Suspended Chords</li>
            <li>Seventh Chords</li>
            <li>Extended Chords</li>
            <li>Chord Scales</li>
            <li>Diatonic Chords</li>
            <li>Power Chords</li>
            <li>Ear Training</li>
          </ul>
          <ChordViewer isEmbedded={this.isEmbedded} />
          {createStudyFlashCardGroupComponent(ChordNotes.createFlashCardGroup(), this.isEmbedded, this.hideMoreInfoUri)}
          {createStudyFlashCardGroupComponent(PianoChords.createFlashCardGroup(), this.isEmbedded, this.hideMoreInfoUri)}
          {createStudyFlashCardGroupComponent(GuitarChords.createFlashCardGroup(), this.isEmbedded, this.hideMoreInfoUri)}
          {createStudyFlashCardGroupComponent(ChordEarTraining.createFlashCardGroup(), this.isEmbedded, this.hideMoreInfoUri)}

          <SectionTitle>Chord Progressions</SectionTitle>
          <ul>
            <li>Overview</li>
            <li>II - V - I</li>
            <li>Blues</li>
            <li>Cadences?</li>
            <li>Tension &amp; Resolution</li>
            <li>Ear Training</li>
          </ul>

        </CardContent>
      </Card>
    );
  }

  private isEmbedded: boolean = false;
  private hideMoreInfoUri: boolean = true;
}