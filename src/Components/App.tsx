import * as React from 'react';
import { Paper, AppBar, Typography, Toolbar } from '@material-ui/core';
import * as Utils from "../Utils";

import "./App.css";

import { Quiz as QuizComponent } from "./Quiz";
import * as IntervalNamesToHalfSteps from './Quizzes/IntervalNamesToHalfSteps';
import * as IntervalQualitySymbolsToQualities from './Quizzes/IntervalQualitySymbolsToQualities';
import * as GenericIntervalsToIntervalQualities from "./Quizzes/GenericIntervalsToIntervalQualities";
import * as IntervalQualitiesToGenericIntervals from "./Quizzes/IntervalQualitiesToGenericIntervals";
import * as IntervalsToConsonanceDissonance from "./Quizzes/IntervalsToConsonanceDissonance";
import * as MajorDiatonicTriads from "./Quizzes/MajorDiatonicTriads";
import * as NaturalMinorDiatonicTriads from "./Quizzes/NaturalMinorDiatonicTriads";
import * as MelodicMinorDiatonicTriads from "./Quizzes/MelodicMinorDiatonicTriads";
import * as HarmonicMinorDiatonicTriads from "./Quizzes/HarmonicMinorDiatonicTriads";
import * as HarmonicMajorDiatonicTriads from "./Quizzes/HarmonicMajorDiatonicTriads";
import * as DoubleHarmonicMajorDiatonicTriads from "./Quizzes/DoubleHarmonicMajorDiatonicTriads";
import * as MajorDiatonicSeventhChords from "./Quizzes/MajorDiatonicSeventhChords";
import * as NaturalMinorDiatonicSeventhChords from "./Quizzes/NaturalMinorDiatonicSeventhChords";
import * as MelodicMinorDiatonicSeventhChords from "./Quizzes/MelodicMinorDiatonicSeventhChords";
import * as HarmonicMinorDiatonicSeventhChords from "./Quizzes/HarmonicMinorDiatonicSeventhChords";
import * as HarmonicMajorDiatonicSeventhChords from "./Quizzes/HarmonicMajorDiatonicSeventhChords";
import * as DoubleHarmonicMajorDiatonicSeventhChords from "./Quizzes/DoubleHarmonicMajorDiatonicSeventhChords";
import * as MajorScaleDegreeModes from "./Quizzes/MajorScaleDegreeModes";
import * as ChordNotes from "./Quizzes/ChordNotes";
import * as ScaleNotes from "./Quizzes/ScaleNotes";
import * as ScaleChords from "./Quizzes/ScaleChords";
import * as ScaleCharacteristics from "./Quizzes/ScaleCharacteristics";
import * as ScaleFamilies from "./Quizzes/ScaleFamilies";
import * as ScaleDegreeNames from "./Quizzes/ScaleDegreeNames";
import * as ChordFamilies from "./Quizzes/ChordFamilies";
import * as ChordFamilyDefinitions from "./Quizzes/ChordFamilyDefinitions";
import * as AvailableChordTensions from "./Quizzes/AvailableChordTensions";
import { RandomChordGenerator } from "./RandomChordGenerator";
import { GuitarNotes } from "./GuitarNotes";
import { PianoNotes } from "./PianoNotes";
import { FlashCard } from 'src/FlashCard';
import { FlashCardGroup } from 'src/FlashCardGroup';
import { StudyFlashCards } from './StudyFlashCards';

export interface IAppState {
  currentFlashCardGroupIndex: number;
  currentComponentOverride: any;
}
class App extends React.Component<{}, IAppState> {
  public constructor(props: {}) {
    super(props);

    this.flashCardGroups = [
      new FlashCardGroup("Interval Names To Half Steps", IntervalNamesToHalfSteps.createFlashCards()),
      new FlashCardGroup("Interval Quality Symbols To Qualities", IntervalQualitySymbolsToQualities.createFlashCards()),
      new FlashCardGroup("Generic Intervals To Interval Qualities", GenericIntervalsToIntervalQualities.createFlashCards()),
      new FlashCardGroup("Interval Qualities To Generic Intervals", IntervalQualitiesToGenericIntervals.createFlashCards()),
      new FlashCardGroup("Intervals To Consonance Dissonance", IntervalsToConsonanceDissonance.createFlashCards()),
      new FlashCardGroup("Major Diatonic Triads", MajorDiatonicTriads.createFlashCards()),
      new FlashCardGroup("Natural Minor Diatonic Triads", NaturalMinorDiatonicTriads.createFlashCards()),
      new FlashCardGroup("Melodic Minor Diatonic Triads", MelodicMinorDiatonicTriads.createFlashCards()),
      new FlashCardGroup("Harmonic Minor Diatonic Triads", HarmonicMinorDiatonicTriads.createFlashCards()),
      new FlashCardGroup("Harmonic Major Diatonic Triads", HarmonicMajorDiatonicTriads.createFlashCards()),
      new FlashCardGroup("Double Harmonic Major Diatonic Triads", DoubleHarmonicMajorDiatonicTriads.createFlashCards()),
      new FlashCardGroup("Major Diatonic Seventh Chords", MajorDiatonicSeventhChords.createFlashCards()),
      new FlashCardGroup("Natural Minor Diatonic Seventh Chords", NaturalMinorDiatonicSeventhChords.createFlashCards()),
      new FlashCardGroup("Melodic Minor Diatonic Seventh Chords", MelodicMinorDiatonicSeventhChords.createFlashCards()),
      new FlashCardGroup("Harmonic Minor Diatonic Seventh Chords", HarmonicMinorDiatonicSeventhChords.createFlashCards()),
      new FlashCardGroup("Harmonic Major Diatonic Seventh Chords", HarmonicMajorDiatonicSeventhChords.createFlashCards()),
      new FlashCardGroup("Double Harmonic Major Diatonic Seventh Chords", DoubleHarmonicMajorDiatonicSeventhChords.createFlashCards()),
      new FlashCardGroup("Major Scale Degree Modes", MajorScaleDegreeModes.createFlashCards()),
      new FlashCardGroup("Chord Notes", ChordNotes.createFlashCards()),
      new FlashCardGroup("Scale Notes", ScaleNotes.createFlashCards()),
      new FlashCardGroup("Scale Chords", ScaleChords.createFlashCards()),
      new FlashCardGroup("Scale Characteristics", ScaleCharacteristics.createFlashCards()),
      new FlashCardGroup("Scale Families", ScaleFamilies.createFlashCards()),
      new FlashCardGroup("Scale Degree Names", ScaleDegreeNames.createFlashCards()),
      new FlashCardGroup("Chord Families", ChordFamilies.createFlashCards()),
      new FlashCardGroup("Chord Family Definitions", ChordFamilyDefinitions.createFlashCards()),
      new FlashCardGroup("Available Chord Tensions", AvailableChordTensions.createFlashCards())
    ];

    this.flashCards = Utils.flattenArrays<FlashCard>(this.flashCardGroups.map(g => g.flashCards));

    this.state = {
      currentFlashCardGroupIndex: 0,
      currentComponentOverride: null
    };
  }

  public render(): JSX.Element {
    const flashCardGroupLinks = this.flashCardGroups
      .map(
        (flashCardGroup, i) => {
          let className = "nav-link";
          if ((!this.state.currentComponentOverride) && (i === this.state.currentFlashCardGroupIndex)) {
            className += " active";
          }

          return <a key={i} href="" onClick={event => { event.preventDefault(); this.changeQuiz(i); }} className={className}>{flashCardGroup.name}</a>
        },
        this
      );
    const componentOverrideLinks = this.componentOverrides
      .map(
        (componentOverride, i) => {
          let className = "nav-link";
          if (this.state.currentComponentOverride === componentOverride.component) {
            className += " active";
          }

          return <a key={i} href="" onClick={event => { event.preventDefault(); this.setComponentOverride(componentOverride.component); }} className={className}>{componentOverride.name}</a>
        },
        this
      );
    const currentFlashCardGroup = this.flashCardGroups[this.state.currentFlashCardGroupIndex];

    return (
      <div className="app">
        <AppBar position="static" className="top-pane">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Header
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="bottom-pane horizontal-panes">
          <Paper className="left-pane">
            <div className="left-nav">
              {flashCardGroupLinks}
              {componentOverrideLinks}
            </div>
          </Paper>
          <div className="right-pane">
            {!this.state.currentComponentOverride ? <StudyFlashCards key={this.state.currentFlashCardGroupIndex} title={currentFlashCardGroup.name} flashCards={currentFlashCardGroup.flashCards} /> : null}
            {this.state.currentComponentOverride ? React.createElement(this.state.currentComponentOverride) : null}
          </div>
        </div>
      </div>
    );
  }

  private flashCards: FlashCard[];
  private flashCardGroups: FlashCardGroup[];
  private componentOverrides = [
    {
      name: "Random Chord Generator",
      component: RandomChordGenerator
    },
    {
      name: "Guitar Notes",
      component: GuitarNotes
    },
    {
      name: "Piano Notes",
      component: PianoNotes
    }
  ];

  private changeQuiz(quizIndex: number) {
    this.setState({ currentFlashCardGroupIndex: quizIndex, currentComponentOverride: null });
  }
  private setComponentOverride(component: any) {
    this.setState({ currentComponentOverride: component });
  }
}

export default App;
