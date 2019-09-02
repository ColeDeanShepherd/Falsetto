import * as React from "react";
import { NavLink } from "react-router-dom";
import App from './App';

import * as IntervalNamesToHalfSteps from "./Quizzes/Intervals/IntervalNamesToHalfSteps";
import * as IntervalQualitySymbolsToQualities from "./Quizzes/Intervals/IntervalQualitySymbolsToQualities";
import * as GenericIntervalsToIntervalQualities from "./Quizzes/Intervals/GenericIntervalsToIntervalQualities";
import * as IntervalsToConsonanceDissonance from "./Quizzes/Intervals/IntervalsToConsonanceDissonance";
import * as ScaleDegreeModes from "./Quizzes/Scales/ScaleDegreeModes";
import * as ChordNotes from "./Quizzes/Chords/ChordNotes";
import * as ScaleNotes from "./Quizzes/Scales/ScaleFormulas";
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
import * as GuitarPerfectPitchTrainer from "./Quizzes/Notes/GuitarPerfectPitchTrainer";
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
import * as IntervalSinging from "./Quizzes/Intervals/IntervalSinging";
import * as SheetMusicIntervalRecognition from "./Quizzes/Sheet Music/SheetMusicIntervalRecognition";
import * as PianoIntervals from "./Quizzes/Intervals/PianoIntervals";
import * as GuitarIntervals from "./Quizzes/Intervals/GuitarIntervals";
import * as SheetMusicChordRecognition from "./Quizzes/Sheet Music/SheetMusicChordRecognition";
import * as ChordEarTraining from "./Quizzes/Chords/ChordEarTraining";
import * as ScaleEarTraining from "./Quizzes/Scales/ScaleEarTraining";
import { RhythmTapper } from "./Tools/RhythmTapper";

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
          <NavLink to="/tuner" onClick={event => App.instance.onNavLinkClick()} className="menu-link">Tuner</NavLink>
          {App.instance.renderFlashCardSetLink(RandomChordGenerator.flashCardSet)}
        </MenuCategory>
        <MenuCategory title="Note Exercises">
          {App.instance.renderFlashCardSetLink(PianoNotes.flashCardSet)}
          {App.instance.renderFlashCardSetLink(GuitarNotes.flashCardSet)}
          {App.instance.renderFlashCardSetLink(ViolinNotes.flashCardSet)}
          {App.instance.renderFlashCardSetLink(SheetMusicNotes.flashCardSet)}
          {App.instance.renderFlashCardSetLink(NoteDurations.flashCardSet)}
          {App.instance.renderFlashCardSetLink(GuitarPerfectPitchTrainer.flashCardSet)}
        </MenuCategory>
      </div>
      <div className="column">
        <MenuCategory title="Interval Exercises">
          {App.instance.renderFlashCardSetLink(IntervalQualitySymbolsToQualities.flashCardSet)}
          {App.instance.renderFlashCardSetLink(IntervalNamesToHalfSteps.flashCardSet)}
          {App.instance.renderFlashCardSetLink(IntervalsToConsonanceDissonance.flashCardSet)}
          {App.instance.renderFlashCardSetLink(Interval2ndNotes.flashCardSet)}
          {App.instance.renderFlashCardSetLink(IntervalNotes.flashCardSet)}
          {App.instance.renderFlashCardSetLink(SheetMusicIntervalRecognition.flashCardSet)}
          {App.instance.renderFlashCardSetLink(PianoIntervals.flashCardSet)}
          {App.instance.renderFlashCardSetLink(GuitarIntervals.flashCardSet)}
          {App.instance.renderFlashCardSetLink(IntervalEarTraining.flashCardSet)}
          {App.instance.renderFlashCardSetLink(Interval2ndNoteEarTraining.flashCardSet)}
          {App.instance.renderFlashCardSetLink(Interval2ndNoteEarTrainingPiano.flashCardSet)}
          {App.instance.renderFlashCardSetLink(IntervalSinging.flashCardSet)}
        </MenuCategory>
      </div>
      <div className="column">
        <MenuCategory title="Scale Exercises">
          {App.instance.renderFlashCardSetLink(ScaleDegreeNames.flashCardSet)}
          {App.instance.renderFlashCardSetLink(ScaleNotes.flashCardSet)}
          {App.instance.renderFlashCardSetLink(PianoScales.flashCardSet)}
          {App.instance.renderFlashCardSetLink(GuitarScales.flashCardSet)}
          {App.instance.renderFlashCardSetLink(ScaleDegreeModes.flashCardSet)}
          {App.instance.renderFlashCardSetLink(ScaleChords.flashCardSet)}
          {App.instance.renderFlashCardSetLink(ScaleEarTraining.flashCardSet)}
        </MenuCategory>
        <MenuCategory title="Key Exercises">
          {App.instance.renderFlashCardSetLink(KeyAccidentalCounts.flashCardSet)}
          {App.instance.renderFlashCardSetLink(KeyAccidentalNotes.flashCardSet)}
          {App.instance.renderFlashCardSetLink(KeySignatureIdentification.flashCardSet)}
        </MenuCategory>
      </div>
      <div className="column">
        <MenuCategory title="Chord Exercises">
          {App.instance.renderFlashCardSetLink(ChordFamilies.flashCardSet)}
          {App.instance.renderFlashCardSetLink(ChordNotes.flashCardSet)}
          {App.instance.renderFlashCardSetLink(AvailableChordTensions.flashCardSet)}
          {App.instance.renderFlashCardSetLink(DiatonicTriads.flashCardSet)}
          {App.instance.renderFlashCardSetLink(DiatonicSeventhChords.flashCardSet)}
          {App.instance.renderFlashCardSetLink(SheetMusicChordRecognition.flashCardSet)}
          {App.instance.renderFlashCardSetLink(PianoChords.flashCardSet)}
          {App.instance.renderFlashCardSetLink(GuitarChords.flashCardSet)}
          {App.instance.renderFlashCardSetLink(ChordEarTraining.flashCardSet)}
        </MenuCategory>
      </div>
    </div>
  </div>
);