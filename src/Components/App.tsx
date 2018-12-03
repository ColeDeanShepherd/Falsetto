import * as React from 'react';
import { Paper, AppBar, Typography, Toolbar } from '@material-ui/core';
import * as Utils from "../Utils";

import "./App.css";

import { Quiz as QuizComponent } from "./Quiz";
import * as IntervalNamesToHalfSteps from './Quizzes/IntervalNamesToHalfSteps';
import * as IntervalHalfStepsToNames from './Quizzes/IntervalHalfStepsToNames';
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
      new FlashCardGroup("IntervalNamesToHalfSteps", IntervalNamesToHalfSteps.createFlashCards()),
      new FlashCardGroup("IntervalHalfStepsToNames", IntervalHalfStepsToNames.createFlashCards()),
      new FlashCardGroup("IntervalQualitySymbolsToQualities", IntervalQualitySymbolsToQualities.createFlashCards()),
      new FlashCardGroup("GenericIntervalsToIntervalQualities", GenericIntervalsToIntervalQualities.createFlashCards()),
      new FlashCardGroup("IntervalQualitiesToGenericIntervals", IntervalQualitiesToGenericIntervals.createFlashCards()),
      new FlashCardGroup("IntervalsToConsonanceDissonance", IntervalsToConsonanceDissonance.createFlashCards()),
      new FlashCardGroup("MajorDiatonicTriads", MajorDiatonicTriads.createFlashCards()),
      new FlashCardGroup("NaturalMinorDiatonicTriads", NaturalMinorDiatonicTriads.createFlashCards()),
      new FlashCardGroup("MelodicMinorDiatonicTriads", MelodicMinorDiatonicTriads.createFlashCards()),
      new FlashCardGroup("HarmonicMinorDiatonicTriads", HarmonicMinorDiatonicTriads.createFlashCards()),
      new FlashCardGroup("HarmonicMajorDiatonicTriads", HarmonicMajorDiatonicTriads.createFlashCards()),
      new FlashCardGroup("DoubleHarmonicMajorDiatonicTriads", DoubleHarmonicMajorDiatonicTriads.createFlashCards()),
      new FlashCardGroup("MajorDiatonicSeventhChords", MajorDiatonicSeventhChords.createFlashCards()),
      new FlashCardGroup("NaturalMinorDiatonicSeventhChords", NaturalMinorDiatonicSeventhChords.createFlashCards()),
      new FlashCardGroup("MelodicMinorDiatonicSeventhChords", MelodicMinorDiatonicSeventhChords.createFlashCards()),
      new FlashCardGroup("HarmonicMinorDiatonicSeventhChords", HarmonicMinorDiatonicSeventhChords.createFlashCards()),
      new FlashCardGroup("HarmonicMajorDiatonicSeventhChords", HarmonicMajorDiatonicSeventhChords.createFlashCards()),
      new FlashCardGroup("DoubleHarmonicMajorDiatonicSeventhChords", DoubleHarmonicMajorDiatonicSeventhChords.createFlashCards()),
      new FlashCardGroup("MajorScaleDegreeModes", MajorScaleDegreeModes.createFlashCards()),
      new FlashCardGroup("ChordNotes", ChordNotes.createFlashCards()),
      new FlashCardGroup("ScaleNotes", ScaleNotes.createFlashCards()),
      new FlashCardGroup("ScaleChords", ScaleChords.createFlashCards()),
      new FlashCardGroup("ScaleCharacteristics", ScaleCharacteristics.createFlashCards()),
      new FlashCardGroup("ScaleFamilies", ScaleFamilies.createFlashCards()),
      new FlashCardGroup("ScaleDegreeNames", ScaleDegreeNames.createFlashCards()),
      new FlashCardGroup("ChordFamilies", ChordFamilies.createFlashCards()),
      new FlashCardGroup("ChordFamilyDefinitions", ChordFamilyDefinitions.createFlashCards()),
      new FlashCardGroup("AvailableChordTensions", AvailableChordTensions.createFlashCards())
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
            {!this.state.currentComponentOverride ? <StudyFlashCards key={this.state.currentFlashCardGroupIndex} flashCardGroup={currentFlashCardGroup} /> : null}
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
