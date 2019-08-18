
import * as React from "react";
import { Table, TableHead, TableBody, TableRow, TableCell } from "@material-ui/core";

import App from '../../App';

import { playPitches } from "../../../Piano";

import { PianoKeyboard, PianoKeyboardMetrics } from "../../Utils/PianoKeyboard";
import { Pitch } from '../../../Pitch';
import { PitchLetter } from '../../../PitchLetter';

import { createStudyFlashCardSetComponent } from '../../StudyFlashCards';

import intervalQualityChart from "../../../img/interval-qualities.svg";

import * as IntervalNamesToHalfSteps from "../../Quizzes/Intervals/IntervalNamesToHalfSteps";
import * as IntervalEarTraining from "../../Quizzes/Intervals/IntervalEarTraining";
import * as IntervalQualitySymbols from "../../Quizzes/Intervals/IntervalQualitySymbolsToQualities";
import * as IntervalsToConsonanceDissonance from "../../Quizzes/Intervals/IntervalsToConsonanceDissonance";
import * as IntervalNotes from "../../Quizzes/Intervals/IntervalNotes";
import * as SheetMusicIntervalRecognition from "../../Quizzes/Sheet Music/SheetMusicIntervalRecognition";
import * as GuitarIntervals from "../../Quizzes/Intervals/GuitarIntervals";
import * as Interval2ndNotes from "../../Quizzes/Intervals/Interval2ndNotes";
import * as Interval2ndNoteEarTraining from "../../Quizzes/Intervals/Interval2ndNoteEarTraining";
import * as Interval2ndNoteEarTrainingPiano from "../../Quizzes/Intervals/Interval2ndNoteEarTrainingPiano";

import _32ndNote from "../../../img/sheet-music/32nd-note.svg";
import _32ndRest from "../../../img/sheet-music/32nd-rest.svg";

import { Rect2D } from '../../../Rect2D';
import { Vector2D } from '../../../Vector2D';
import { Size2D } from '../../../Size2D';
import { Margin } from '../../../Margin';
import { SectionProps, Term, SectionTitle, SubSectionTitle, NoteText } from './EssentialMusicTheory';

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
    playPitches(pitches)[0]
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
      <li>M2 &mdash; Major 2nd</li>
      <li>P4 &mdash; Perfect 4th</li>
      <li>d5 &mdash; Diminished 5th</li>
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

    <NoteText>Some intervals (such as from C to D♯♯) require interval qualities that exceed the ones in the chart above. In these cases, you can simply use "doubly augmented" (AA), "triply augmented" (AAA), and so on, or "doubly diminished" (dd), "triply diminished" (ddd), and so on.</NoteText>

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
  
    <SubSectionTitle>Interactive Exercises</SubSectionTitle>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(IntervalQualitySymbols.createFlashCardSet(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(IntervalNamesToHalfSteps.createFlashCardSet(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(IntervalNotes.createFlashCardSet(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(Interval2ndNotes.createFlashCardSet(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(SheetMusicIntervalRecognition.createFlashCardSet(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(GuitarIntervals.createFlashCardSet(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(IntervalsToConsonanceDissonance.createFlashCardSet(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(IntervalEarTraining.createFlashCardSet(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(Interval2ndNoteEarTraining.createFlashCardSet(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    <div style={{ marginBottom: "2em" }}>{createStudyFlashCardSetComponent(Interval2ndNoteEarTrainingPiano.createFlashCardSet(), props.isEmbedded, props.hideMoreInfoUri)}</div>
    
    <p style={{ textAlign: "center" }}>{App.instance.renderNavLink("/essential-music-theory/notes", "<< Previous: Notes")} | {App.instance.renderNavLink("/essential-music-theory/scales-and-modes", "Next: Scales & Modes >>")}</p>
  </div>
);