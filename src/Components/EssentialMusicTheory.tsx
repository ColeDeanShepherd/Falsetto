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
            
          <div>
            <PianoKeyboard
              width={300} height={150}
              lowestPitch={new Pitch(PitchLetter.C, 0, 3)}
              highestPitch={new Pitch(PitchLetter.B, 0, 4)}
              pressedPitches={[]}
              renderExtrasFn={renderPianoKeyboardNoteNames} />
          </div>

          <p>The white note are "natural" notes, and the black notes are "accidentals". All of the black notes have two names - one using a sharp (#), which means we think about the note as a slightly raised version of the natural note to the left, and one using a flat (b), which means we think about the note as a slightly lowered version of the natural note to the right.</p>
          <p>Note that the notes repeat as you move higher or lower. This is because notes with the same name sound similar to us, just higher or lower versions of the same note.</p>

          <SubSectionTitle>Non-essentials</SubSectionTitle>
          <p>Why are only 7 natural notes, with the rest being sharps &amp; flats? Why don't we just call the 12 notes A, B, C, D, E, F, G, H, I, J, K, and L? Why aren't there accidental notes in between B &amp; C and E &amp; F?</p>
          <p>This seems counter-intuitive at first, but the answer to all of these questions is: to make navigating instruments easier, and to work well with 7-note scales that most Western music is based on. Imagine trying to play a piano made entirely of white notes. It would be difficult to name any particular note because there is no frame of reference. That is possible to remedy by adding visual markers, but ideally you should be able to play an instruments by feel, without looking at them. Also, most Western music is based on 7-note scales, and having only 7 natural notes allows us to easily express each scale using the 7 natural notes which are then modified by sharps and flats.</p>

          <SectionTitle>Intervals</SectionTitle>
          <ul>
            <li>Overview</li>
            <li>The 12 Simple Intervals (whole steps &amp; half steps, semitones &amp; tones). Tunes to go with them</li>
            <li>Compound Intervals</li>
            <li>Consonance &amp; Dissonance</li>
            <li>Ear Training</li>
          </ul>
          {createStudyFlashCardGroupComponent(IntervalNamesToHalfSteps.createFlashCardGroup(), this.isEmbedded, this.hideMoreInfoUri)}
          {createStudyFlashCardGroupComponent(IntervalEarTraining.createFlashCardGroup(), this.isEmbedded, this.hideMoreInfoUri)}

          <SectionTitle>Scales &amp; Modes</SectionTitle>
          <ul>
            <li>Overview</li>
            <li>Chromatic Scale</li>
            <li>Major Scale</li>
            <li>7 Modes of the Major Scale</li>
            <li>Other Minor Scales</li>
            <li>Pentatonic Scales</li>
            <li>Whole Tone Scale</li>
            <li>Diminished Scales</li>
            <li>Blues Scale</li>
            <li></li>
          </ul>
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