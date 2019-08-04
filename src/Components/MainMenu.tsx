import * as React from "react";
import { Router, Route, NavLink } from "react-router-dom";
import App from './App';

import {
  SectionContainer,
  IntroSection,
  RhythmSection,
  NotesSection,
  IntervalsSection,
  ScalesAndModesSection,
  ChordsSection,
  ChordProgressionsSection,
  NextStepsSection
} from "./Lessons/EssentialMusicTheory";
import * as IntervalNamesToHalfSteps from "./Quizzes/Intervals/IntervalNamesToHalfSteps";
import * as IntervalQualitySymbolsToQualities from "./Quizzes/Intervals/IntervalQualitySymbolsToQualities";
import * as GenericIntervalsToIntervalQualities from "./Quizzes/Intervals/GenericIntervalsToIntervalQualities";
import * as IntervalsToConsonanceDissonance from "./Quizzes/Intervals/IntervalsToConsonanceDissonance";
import * as ScaleDegreeModes from "./Quizzes/Scales/ScaleDegreeModes";
import * as ChordNotes from "./Quizzes/Chords/ChordNotes";
import * as ScaleNotes from "./Quizzes/Scales/ScaleNotes";
import * as ScaleChords from "./Quizzes/Chords/ScaleChords";
import * as ScaleCharacteristics from "./Quizzes/Scales/ScaleCharacteristics";
import * as ScaleFamilies from "./Quizzes/Scales/ScaleFamilies";
import * as ScaleDegreeNames from "./Quizzes/Scales/ScaleDegreeNames";
import * as ChordFamilies from "./Quizzes/Chords/ChordFamilies";
import * as ChordFamilyDefinitions from "./Quizzes/Chords/ChordFamilyDefinitions";
import * as AvailableChordTensions from "./Quizzes/Chords/AvailableChordTensions";
import * as DiatonicTriads from "./Quizzes/Chords/DiatonicTriads";
import * as DiatonicSeventhChords from "./Quizzes/Chords/DiatonicSeventhChords";
import * as RandomChordGenerator from "./Tools/RandomChordGenerator";
import * as GuitarNotes from "./Quizzes/Notes/GuitarNotes";
import * as ViolinNotes from "./Quizzes/Notes/ViolinNotes";
import * as PianoNotes from "./Quizzes/Notes/PianoNotes";
import * as PianoScales from "./Quizzes/Scales/PianoScales";
import * as PianoChords from "./Quizzes/Chords/PianoChords";
import * as GuitarScales from "./Quizzes/Scales/GuitarScales";
import * as GuitarChords from "./Quizzes/Chords/GuitarChords";
import * as SheetMusicNotes from "./Quizzes/Sheet Music/SheetMusicNotes";
import * as NoteDurations from "./Quizzes/Sheet Music/SheetMusicNoteDurations";
import * as KeyAccidentalCounts from "./Quizzes/Sheet Music/KeyAccidentalCounts";
import * as KeyAccidentalNotes from "./Quizzes/Sheet Music/KeyAccidentalNotes";
import * as KeySignatureIdentification from "./Quizzes/Sheet Music/KeySignatureIdentification";
import * as Interval2ndNotes from "./Quizzes/Intervals/Interval2ndNotes";
import * as IntervalNotes from "./Quizzes/Intervals/IntervalNotes";
import * as IntervalEarTraining from "./Quizzes/Intervals/IntervalEarTraining";
import * as Interval2ndNoteEarTraining from "./Quizzes/Intervals/Interval2ndNoteEarTraining";
import * as Interval2ndNoteEarTrainingPiano from "./Quizzes/Intervals/Interval2ndNoteEarTrainingPiano";
import * as SheetMusicIntervalRecognition from "./Quizzes/Sheet Music/SheetMusicIntervalRecognition";
import * as PianoIntervals from "./Quizzes/Intervals/PianoIntervals";
import * as GuitarIntervals from "./Quizzes/Intervals/GuitarIntervals";
import * as SheetMusicChordRecognition from "./Quizzes/Sheet Music/SheetMusicChordRecognition";
import * as ChordEarTraining from "./Quizzes/Chords/ChordEarTraining";
import * as ScaleEarTraining from "./Quizzes/Scales/ScaleEarTraining";
import { GuitarNotesLesson } from "./Lessons/GuitarNotesLesson";
import { GuitarScalesLesson } from "./Lessons/GuitarScalesLesson";
import { ScaleViewer } from "./Tools/ScaleViewer";
import { ChordViewer } from "./Tools/ChordViewer";
import { IntervalChordScaleFinder } from "./Tools/IntervalChordScaleFinder";
import { RhythmTapper } from "./Tools/RhythmTapper";
import { FlashCardGroup } from "../FlashCardGroup";
import { createStudyFlashCardGroupComponent } from "./StudyFlashCards";
import { AboutPage } from "./AboutPage";
import { SupportUsPage } from "./SupportUs";
import DocumentTitle from "react-document-title";
import { HomePage } from "./HomePage";
import ScrollToTop from './Utils/ScrollToTop';
import { MAX_MAIN_CARD_WIDTH } from './Style';

const NavSectionTitle: React.FunctionComponent<{ style?: any }> = props => <p style={Object.assign({ fontSize: "1.2em", fontWeight: "bold", textDecoration: "underline" }, props.style)}>{props.children}</p>;
const NavSectionSubTitle: React.FunctionComponent<{ style?: any }> = props => <p style={Object.assign({ textDecoration: "underline" }, props.style)}>{props.children}</p>;

const MenuCategory: React.FunctionComponent<{ title: string }> = props => (
  <div className="menu-category">
    <NavSectionSubTitle>{props.title}</NavSectionSubTitle>
    {props.children}
  </div>
);

export const MainMenu : React.FunctionComponent<{}> = props => (
  <div className="menu">
    <div className="row">
      <div className="column">
        <MenuCategory title="Essential Music Theory Course">
          {App.instance.renderNavLink("/essential-music-theory", "Introduction")}
          {App.instance.renderNavLink("/essential-music-theory/rhythm", "Rhythm")}
          {App.instance.renderNavLink("/essential-music-theory/notes", "Notes")}
          {App.instance.renderNavLink("/essential-music-theory/intervals", "Intervals")}
          {App.instance.renderNavLink("/essential-music-theory/scales-and-modes", "Scales & Modes")}
          {App.instance.renderNavLink("/essential-music-theory/chords", "Chords")}
          {App.instance.renderNavLink("/essential-music-theory/chord-progressions", "Chord Progressions")}
          {App.instance.renderNavLink("/essential-music-theory/next-steps", "Next Steps")}
        </MenuCategory>
        <MenuCategory title="Guitar Lessons">
          <NavLink to="/learn-guitar-notes-in-10-steps" onClick={event => App.instance.onNavLinkClick()} className="menu-link">Learn the Notes on Guitar in 10 Easy Steps</NavLink>
          <NavLink to="/learn-guitar-scales" onClick={event => App.instance.onNavLinkClick()} className="menu-link">Learn Guitar Scale Shapes</NavLink>
        </MenuCategory>
      </div>
      <div className="column">
        <MenuCategory title="Tools">
          <NavLink to="/interval-chord-scale-finder" onClick={event => App.instance.onNavLinkClick()} className="menu-link">Interval/Chord/Scale Finder</NavLink>
          <NavLink to="/scale-viewer" onClick={event => App.instance.onNavLinkClick()} className="menu-link">Scale Viewer</NavLink>
          <NavLink to="/chord-viewer" onClick={event => App.instance.onNavLinkClick()} className="menu-link">Chord Viewer</NavLink>
          <NavLink to="/diatonic-chord-player" onClick={event => App.instance.onNavLinkClick()} className="menu-link">Diatonic Chord Player</NavLink>
          <NavLink to="/metronome" onClick={event => App.instance.onNavLinkClick()} className="menu-link">Metronome</NavLink>
          {App.instance.renderFlashCardGroupLink(RandomChordGenerator.createFlashCardGroup())}
        </MenuCategory>
        <MenuCategory title="Note Exercises">
          {App.instance.renderFlashCardGroupLink(PianoNotes.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(GuitarNotes.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(ViolinNotes.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(NoteDurations.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(SheetMusicNotes.createFlashCardGroup())}
        </MenuCategory>
      </div>
      <div className="column">
        <MenuCategory title="Interval Exercises">
          {App.instance.renderFlashCardGroupLink(IntervalQualitySymbolsToQualities.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(IntervalNamesToHalfSteps.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(IntervalsToConsonanceDissonance.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(Interval2ndNotes.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(IntervalNotes.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(SheetMusicIntervalRecognition.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(PianoIntervals.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(GuitarIntervals.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(IntervalEarTraining.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(Interval2ndNoteEarTraining.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(Interval2ndNoteEarTrainingPiano.createFlashCardGroup())}
        </MenuCategory>
      </div>
      <div className="column">
        <MenuCategory title="Scale Exercises">
          {App.instance.renderFlashCardGroupLink(ScaleDegreeNames.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(ScaleNotes.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(PianoScales.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(GuitarScales.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(ScaleDegreeModes.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(ScaleChords.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(ScaleEarTraining.createFlashCardGroup())}
        </MenuCategory>
        <MenuCategory title="Key Exercises">
          {App.instance.renderFlashCardGroupLink(KeyAccidentalCounts.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(KeyAccidentalNotes.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(KeySignatureIdentification.createFlashCardGroup())}
        </MenuCategory>
      </div>
      <div className="column">
        <MenuCategory title="Chord Exercises">
          {App.instance.renderFlashCardGroupLink(ChordFamilies.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(ChordNotes.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(AvailableChordTensions.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(DiatonicTriads.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(DiatonicSeventhChords.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(SheetMusicChordRecognition.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(PianoChords.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(GuitarChords.createFlashCardGroup())}
          {App.instance.renderFlashCardGroupLink(ChordEarTraining.createFlashCardGroup())}
        </MenuCategory>
      </div>
    </div>
  </div>
);