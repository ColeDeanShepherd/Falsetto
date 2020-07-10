/** This is the one with the ExpansionPanels. */
import * as React from "react";

//import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import * as IntervalNamesToHalfSteps from "./Quizzes/Intervals/IntervalNamesToHalfSteps";
import * as IntervalQualitySymbolsToQualities from "./Quizzes/Intervals/IntervalQualitySymbolsToQualities";
import * as GenericIntervalsToIntervalQualities from "./Quizzes/Intervals/GenericIntervalsToIntervalQualities";
import * as IntervalsToConsonanceDissonance from "./Quizzes/Intervals/IntervalsToConsonanceDissonance";
import * as ChordNotes from "./Quizzes/Chords/ChordNotes";
import * as ScaleCharacteristics from "./Quizzes/Scales/ScaleCharacteristics";
import * as ScaleFamilies from "./Quizzes/Scales/ScaleFamilies";
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
import * as PianoChords from "./Quizzes/Chords/PianoChords";
import * as GuitarChords from "./Quizzes/Chords/GuitarChords";
import * as SheetMusicNotes from "./Quizzes/Sheet Music/SheetMusicNotes";
import * as NoteDurations from "./Quizzes/Sheet Music/SheetMusicNoteDurations";
import * as KeyAccidentalCounts from "./Quizzes/Keys/KeyAccidentalCounts";
import * as KeyAccidentalNotes from "./Quizzes/Keys/KeyAccidentalNotes";
import * as KeySignatureIdentification from "./Quizzes/Keys/KeySignatureIdentification";
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

import * as ScaleDegreeNames from "./Quizzes/Scales/ScaleDegreeNames";
import * as ScaleNotes from "./Quizzes/Scales/ScaleFormulas";
import * as PianoScales from "./Quizzes/Scales/PianoScales";
import * as GuitarScales from "./Quizzes/Scales/GuitarScales";
import * as ScaleDegreeModes from "./Quizzes/Scales/ScaleDegreeModes";
import * as ScaleChords from "./Quizzes/Chords/ScaleChords";
import * as ScaleEarTraining from "./Quizzes/Scales/ScaleEarTraining";

import { RhythmTapper } from "./Tools/RhythmTapper";
import { NavLinkView } from "../ui/NavLinkView";

const NavSectionTitle: React.FunctionComponent<{ style?: any }> = props => <p style={Object.assign({ fontSize: "1.2em", fontWeight: "bold", textDecoration: "underline" }, props.style)}>{props.children}</p>;
const NavSectionSubTitle: React.FunctionComponent<{ style?: any }> = props => <p style={Object.assign({ textDecoration: "underline" }, props.style)}>{props.children}</p>;

const MenuCategory: React.FunctionComponent<{ title: string, collapseCategories: boolean }> = props =>
  props.collapseCategories
  ? (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        >
        <span>{props.title}</span>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <span>{props.children}</span>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
  : (
    <div className="menu-category">
      <NavSectionSubTitle>{props.title}</NavSectionSubTitle>
      {props.children}
    </div>
  );

export const MainMenu : React.FunctionComponent<{ collapseCategories: boolean }> = props => {
  const understandingThePianoKeyboardCategory = (
    <MenuCategory title="Understanding the Piano Keyboard" collapseCategories={props.collapseCategories}>
      {<NavLinkView to="/understanding-the-piano-keyboard/introduction">Introduction</NavLinkView>}
      {<NavLinkView to="/understanding-the-piano-keyboard/notes/introduction">Notes</NavLinkView>}
      {<NavLinkView to="/understanding-the-piano-keyboard/scales/introduction">Scales</NavLinkView>}
      {<NavLinkView to="/understanding-the-piano-keyboard/chords/introduction">Chords</NavLinkView>}
      {<NavLinkView to="/understanding-the-piano-keyboard/chord-progressions/introduction">Chord Progressions</NavLinkView>}
    </MenuCategory>
  );

  const essentialTheoryCategory = (
    <MenuCategory title="(Old) Essential Music Theory Course" collapseCategories={props.collapseCategories}>
      {<NavLinkView to="/essential-music-theory">Introduction</NavLinkView>}
      {<NavLinkView to="/essential-music-theory/rhythm">Rhythm</NavLinkView>}
      {<NavLinkView to="/essential-music-theory/notes">Notes</NavLinkView>}
      {<NavLinkView to="/essential-music-theory/intervals">Intervals</NavLinkView>}
      {<NavLinkView to="/essential-music-theory/scales-and-modes">Scales &amp; Modes</NavLinkView>}
      {<NavLinkView to="/essential-music-theory/chords">Chords</NavLinkView>}
      {<NavLinkView to="/essential-music-theory/chord-progressions">Chord Progressions</NavLinkView>}
      {<NavLinkView to="/essential-music-theory/next-steps">Next Steps</NavLinkView>}
    </MenuCategory>
  );

  const guitarLessonsCategory = (
    <MenuCategory title="Guitar Lessons" collapseCategories={props.collapseCategories}>
      <NavLinkView to="/learn-guitar-notes-in-10-steps">Learn the Notes on Guitar in 10 Easy Steps</NavLinkView>
      <NavLinkView to="/learn-guitar-scales">Learn Guitar Scale Shapes</NavLinkView>
    </MenuCategory>
  );

  const toolsCategory = (
    <MenuCategory title="Tools" collapseCategories={props.collapseCategories}>
      <NavLinkView to="/interval-chord-scale-finder">Interval/Chord/Scale Finder</NavLinkView>
      <NavLinkView to="/scale-viewer">Scale Viewer</NavLinkView>
      <NavLinkView to="/chord-viewer">Chord Viewer</NavLinkView>
      <NavLinkView to="/diatonic-chord-player">Diatonic Chord Player</NavLinkView>
      <NavLinkView to="/metronome">Metronome</NavLinkView>
      <NavLinkView to="/tuner">Tuner</NavLinkView>
      <NavLinkView to={RandomChordGenerator.flashCardSet.route}>{RandomChordGenerator.flashCardSet.name}</NavLinkView>
    </MenuCategory>
  );

  const noteExercisesCategory = (
    <MenuCategory title="Note Exercises" collapseCategories={props.collapseCategories}>
      <NavLinkView to={PianoNotes.flashCardSet.route}>{PianoNotes.flashCardSet.name}</NavLinkView>
      <NavLinkView to={GuitarNotes.flashCardSet.route}>{GuitarNotes.flashCardSet.name}</NavLinkView>
      <NavLinkView to={ViolinNotes.flashCardSet.route}>{ViolinNotes.flashCardSet.name}</NavLinkView>
      <NavLinkView to={SheetMusicNotes.flashCardSet.route}>{SheetMusicNotes.flashCardSet.name}</NavLinkView>
      <NavLinkView to={NoteDurations.flashCardSet.route}>{NoteDurations.flashCardSet.name}</NavLinkView>
      <NavLinkView to={GuitarPerfectPitchTrainer.flashCardSet.route}>{GuitarPerfectPitchTrainer.flashCardSet.name}</NavLinkView>
    </MenuCategory>
  );

  const intervalExercisesCategory = (
    <MenuCategory title="Interval Exercises" collapseCategories={props.collapseCategories}>
      <NavLinkView to={IntervalQualitySymbolsToQualities.flashCardSet.route}>{IntervalQualitySymbolsToQualities.flashCardSet.name}</NavLinkView>
      <NavLinkView to={IntervalNamesToHalfSteps.flashCardSet.route}>{IntervalNamesToHalfSteps.flashCardSet.name}</NavLinkView>
      <NavLinkView to={IntervalsToConsonanceDissonance.flashCardSet.route}>{IntervalsToConsonanceDissonance.flashCardSet.name}</NavLinkView>
      <NavLinkView to={Interval2ndNotes.flashCardSet.route}>{Interval2ndNotes.flashCardSet.name}</NavLinkView>
      <NavLinkView to={IntervalNotes.flashCardSet.route}>{IntervalNotes.flashCardSet.name}</NavLinkView>
      <NavLinkView to={SheetMusicIntervalRecognition.flashCardSet.route}>{SheetMusicIntervalRecognition.flashCardSet.name}</NavLinkView>
      <NavLinkView to={PianoIntervals.flashCardSet.route}>{PianoIntervals.flashCardSet.name}</NavLinkView>
      <NavLinkView to={GuitarIntervals.flashCardSet.route}>{GuitarIntervals.flashCardSet.name}</NavLinkView>
      <NavLinkView to={IntervalEarTraining.flashCardSet.route}>{IntervalEarTraining.flashCardSet.name}</NavLinkView>
      <NavLinkView to={Interval2ndNoteEarTraining.flashCardSet.route}>{Interval2ndNoteEarTraining.flashCardSet.name}</NavLinkView>
      <NavLinkView to={Interval2ndNoteEarTrainingPiano.flashCardSet.route}>{Interval2ndNoteEarTrainingPiano.flashCardSet.name}</NavLinkView>
      <NavLinkView to={IntervalSinging.flashCardSet.route}>{IntervalSinging.flashCardSet.name}</NavLinkView>
    </MenuCategory>
  );

  const scaleExercisesCategory = (
    <MenuCategory title="Scale Exercises" collapseCategories={props.collapseCategories}>
      <NavLinkView to={ScaleDegreeNames.flashCardSet.route}>{ScaleDegreeNames.flashCardSet.name}</NavLinkView>
      <NavLinkView to={ScaleNotes.flashCardSet.route}>{ScaleNotes.flashCardSet.name}</NavLinkView>
      <NavLinkView to={PianoScales.flashCardSet.route}>{PianoScales.flashCardSet.name}</NavLinkView>
      <NavLinkView to={GuitarScales.flashCardSet.route}>{GuitarScales.flashCardSet.name}</NavLinkView>
      <NavLinkView to={ScaleDegreeModes.flashCardSet.route}>{ScaleDegreeModes.flashCardSet.name}</NavLinkView>
      <NavLinkView to={ScaleChords.flashCardSet.route}>{ScaleChords.flashCardSet.name}</NavLinkView>
      <NavLinkView to={ScaleEarTraining.flashCardSet.route}>{ScaleEarTraining.flashCardSet.name}</NavLinkView>
      <NavLinkView to="/scale-exercises">More</NavLinkView>
    </MenuCategory>
  );

  const keyExercisesCategory = (
    <MenuCategory title="Key Exercises" collapseCategories={props.collapseCategories}>
      <NavLinkView to={KeyAccidentalCounts.flashCardSet.route}>{KeyAccidentalCounts.flashCardSet.name}</NavLinkView>
      <NavLinkView to={KeyAccidentalNotes.flashCardSet.route}>{KeyAccidentalNotes.flashCardSet.name}</NavLinkView>
      <NavLinkView to={KeySignatureIdentification.flashCardSet.route}>{KeySignatureIdentification.flashCardSet.name}</NavLinkView>
    </MenuCategory>
  );

  const chordExercisesCategory = (
    <MenuCategory title="Chord Exercises" collapseCategories={props.collapseCategories}>
      <NavLinkView to={ChordFamilies.flashCardSet.route}>{ChordFamilies.flashCardSet.name}</NavLinkView>
      <NavLinkView to={ChordNotes.flashCardSet.route}>{ChordNotes.flashCardSet.name}</NavLinkView>
      <NavLinkView to={AvailableChordTensions.flashCardSet.route}>{AvailableChordTensions.flashCardSet.name}</NavLinkView>
      <NavLinkView to={DiatonicTriads.flashCardSet.route}>{DiatonicTriads.flashCardSet.name}</NavLinkView>
      <NavLinkView to={DiatonicSeventhChords.flashCardSet.route}>{DiatonicSeventhChords.flashCardSet.name}</NavLinkView>
      <NavLinkView to={SheetMusicChordRecognition.flashCardSet.route}>{SheetMusicChordRecognition.flashCardSet.name}</NavLinkView>
      <NavLinkView to={PianoChords.flashCardSet.route}>{PianoChords.flashCardSet.name}</NavLinkView>
      <NavLinkView to={GuitarChords.flashCardSet.route}>{GuitarChords.flashCardSet.name}</NavLinkView>
      <NavLinkView to={ChordEarTraining.flashCardSet.route}>{ChordEarTraining.flashCardSet.name}</NavLinkView>
    </MenuCategory>
  );

  const otherCategory = (
    <MenuCategory title="Other" collapseCategories={props.collapseCategories}>
      <NavLinkView to={"/glossary"}>Glossary</NavLinkView>
      <NavLinkView to="/contribute" style={{ fontWeight: "normal" }}>
        Contribute
      </NavLinkView>
    </MenuCategory>
  );

  return !props.collapseCategories
  ? (
    <div className="menu">
      <div className="row no-gutters">
        <div className="col-sm">
          {understandingThePianoKeyboardCategory}
          {guitarLessonsCategory}
        </div>
        <div className="col-sm">
          {toolsCategory}
          {noteExercisesCategory}
        </div>
        <div className="col-sm">
          {intervalExercisesCategory}
        </div>
        <div className="col-sm">
          {scaleExercisesCategory}
          {keyExercisesCategory}
        </div>
        <div className="col-sm">
          {chordExercisesCategory}
          {otherCategory}
        </div>
      </div>
    </div>
  )
  : (
    <div className="menu">
      <div className="row no-gutters">
        <div className="col-sm">
          {understandingThePianoKeyboardCategory}
          {guitarLessonsCategory}
          {toolsCategory}
        </div>
        <div className="col-sm">
          {noteExercisesCategory}
          {intervalExercisesCategory}
          {scaleExercisesCategory}
        </div>
        <div className="col-sm">
          {keyExercisesCategory}
          {chordExercisesCategory}
          {otherCategory}
        </div>
      </div>
    </div>
  );
};