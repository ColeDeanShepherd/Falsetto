import * as React from "react";

import * as PianoNotes from "../../Quizzes/Notes/PianoNotes";
import * as GuitarNotes from "../../Quizzes/Notes/GuitarNotes";
import * as SheetMusicNotes from "../../Quizzes/Sheet Music/SheetMusicNotes";

import { createStudyFlashCardSetComponent } from '../../../ui/StudyFlashCards/View';

import * as NotesQuiz from "../../Quizzes/Notes/NotesQuiz";

import { SectionTitle, Term, OctavesPlayer, SectionProps, SubSectionTitle } from './EssentialMusicTheory';
import { NavLinkView } from "../../../ui/NavLinkView";
import { NoteText } from "../../Utils/NoteText";

export const NotesSection: React.FunctionComponent<SectionProps> = props => (
  <div>
    <p style={{ textAlign: "center" }}><NavLinkView to="/essential-music-theory/rhythm">{"<< Previous: Rhythm"}</NavLinkView> | <NavLinkView to="/essential-music-theory/intervals">{"Next: Intervals >>"}</NavLinkView></p>

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
    <p>If your instrument of choice is piano, there is an interactive exercise below. If your instrument of choise is guitar, there is an interactive exercise below, and a comprehensive lesson: <NavLinkView to="/learn-guitar-notes-in-10-steps">Learn the Notes on Guitar in 10 Easy Steps</NavLinkView></p>

    <SubSectionTitle>Interactive Exercises</SubSectionTitle>
    <div style={{ marginBottom: "2em" }}>
      {createStudyFlashCardSetComponent(NotesQuiz.flashCardSet, props.isEmbedded, props.hideMoreInfoUri)}
    </div>
    <div style={{ marginBottom: "2em" }}>
      {createStudyFlashCardSetComponent(PianoNotes.flashCardSet, props.isEmbedded, props.hideMoreInfoUri)}
    </div>
    <div style={{ marginBottom: "2em" }}>
      {createStudyFlashCardSetComponent(GuitarNotes.flashCardSet, props.isEmbedded, props.hideMoreInfoUri)}
    </div>
    <div style={{ marginBottom: "2em" }}>
      {createStudyFlashCardSetComponent(SheetMusicNotes.flashCardSet, props.isEmbedded, props.hideMoreInfoUri)}
    </div>
    
    <p style={{ textAlign: "center" }}><NavLinkView to="/essential-music-theory/rhythm">{"<< Previous: Rhythm"}</NavLinkView> | <NavLinkView to="/essential-music-theory/intervals">{"Next: Intervals >>"}</NavLinkView></p>
  </div>
);