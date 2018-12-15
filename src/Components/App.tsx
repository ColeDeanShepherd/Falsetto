import * as React from 'react';
import { Paper, AppBar, Typography, Toolbar } from '@material-ui/core';
import * as Utils from "../Utils";

import "./App.css";

import { Quiz as QuizComponent } from "./Quiz";
import * as IntervalNamesToHalfSteps from './Quizzes/IntervalNamesToHalfSteps';
import * as IntervalQualitySymbolsToQualities from './Quizzes/IntervalQualitySymbolsToQualities';
import * as GenericIntervalsToIntervalQualities from "./Quizzes/GenericIntervalsToIntervalQualities";
import * as IntervalsToConsonanceDissonance from "./Quizzes/IntervalsToConsonanceDissonance";
import * as ScaleDegreeModes from "./Quizzes/ScaleDegreeModes";
import * as ChordNotes from "./Quizzes/ChordNotes";
import * as ScaleNotes from "./Quizzes/ScaleNotes";
import * as ScaleChords from "./Quizzes/ScaleChords";
import * as ScaleCharacteristics from "./Quizzes/ScaleCharacteristics";
import * as ScaleFamilies from "./Quizzes/ScaleFamilies";
import * as ScaleDegreeNames from "./Quizzes/ScaleDegreeNames";
import * as ChordFamilies from "./Quizzes/ChordFamilies";
import * as ChordFamilyDefinitions from "./Quizzes/ChordFamilyDefinitions";
import * as AvailableChordTensions from "./Quizzes/AvailableChordTensions";
import * as DiatonicTriads from "./Quizzes/DiatonicTriads";
import * as DiatonicSeventhChords from "./Quizzes/DiatonicSeventhChords";
import * as RandomChordGenerator from "./RandomChordGenerator";
import * as GuitarNotes from "./GuitarNotes";
import * as PianoNotes from "./PianoNotes";
import * as SheetMusicNotes from "./SheetMusicNotes";
import * as NoteDurations from "./Quizzes/NoteDurations";
import * as KeyAccidentalCounts from "./Quizzes/KeyAccidentalCounts";
import * as KeyAccidentalNotes from "./Quizzes/KeyAccidentalNotes";
import { FlashCard } from 'src/FlashCard';
import { FlashCardGroup } from 'src/FlashCardGroup';
import { StudyFlashCards } from './StudyFlashCards';
import * as Overview from "./Quizzes/TheJazzPianoSite/TheBasics/Overview"

export interface IAppState {
  currentFlashCardGroupIndex: number;
  currentComponentOverride: any;
}
class App extends React.Component<{}, IAppState> {
  public constructor(props: {}) {
    super(props);

    this.groupedFlashCardGroups = [
      {
        title: "Notes",
        flashCardGroups: [
          new FlashCardGroup("Piano Notes", PianoNotes.createFlashCards(), undefined),
          new FlashCardGroup("Guitar Notes", GuitarNotes.createFlashCards(), undefined),
          new FlashCardGroup("Note Durations", NoteDurations.createFlashCards(), undefined),
          new FlashCardGroup("Sheet Music Notes", SheetMusicNotes.createFlashCards(), undefined)
        ]
      },
      {
        title: "Intervals",
        flashCardGroups: [
          new FlashCardGroup("Interval Quality Symbols To Qualities", IntervalQualitySymbolsToQualities.createFlashCards(), undefined),
          new FlashCardGroup("Generic Intervals To Interval Qualities", GenericIntervalsToIntervalQualities.createFlashCards(), undefined),
          new FlashCardGroup("Interval Names To Half Steps", IntervalNamesToHalfSteps.createFlashCards(), undefined),
          new FlashCardGroup("Intervals To Consonance Dissonance", IntervalsToConsonanceDissonance.createFlashCards(), undefined)
        ]
      },
      {
        title: "Scales",
        flashCardGroups: [
          new FlashCardGroup("Scale Degree Names", ScaleDegreeNames.createFlashCards(), undefined),
          new FlashCardGroup("Scale Notes", ScaleNotes.createFlashCards(), undefined),
          new FlashCardGroup("Scale Degree Modes", ScaleDegreeModes.createFlashCards(), undefined),
          new FlashCardGroup("Scale Chords", ScaleChords.createFlashCards(), undefined),
          new FlashCardGroup("Scale Families", ScaleFamilies.createFlashCards(), undefined),
          new FlashCardGroup("Scale Characteristics", ScaleCharacteristics.createFlashCards(), undefined),
        ]
      },
      {
        title: "Keys",
        flashCardGroups: [
          new FlashCardGroup("Key Accidental Counts", KeyAccidentalCounts.createFlashCards(), undefined),
          new FlashCardGroup("Key Accidental Notes", KeyAccidentalNotes.createFlashCards(), undefined)
        ]
      },
      {
        title: "Chords",
        flashCardGroups: [
          new FlashCardGroup("Chord Family Definitions", ChordFamilyDefinitions.createFlashCards(), undefined),
          new FlashCardGroup("Chord Families", ChordFamilies.createFlashCards(), undefined),
          new FlashCardGroup("Chord Notes", ChordNotes.createFlashCards(), undefined),
          new FlashCardGroup("Available Chord Tensions", AvailableChordTensions.createFlashCards(), undefined),
          new FlashCardGroup("Diatonic Triads", DiatonicTriads.createFlashCards(), undefined),
          new FlashCardGroup("Diatonic Seventh Chords", DiatonicSeventhChords.createFlashCards(), undefined),
          RandomChordGenerator.createFlashCardGroup()
        ]
      },
      {
        title: "The Jazz Piano Site",
        flashCardGroups: [
          new FlashCardGroup("Overview", Overview.createFlashCards(), undefined)
        ]
      }
    ];

    this.flashCards = Utils.flattenArrays<FlashCard>(this.groupedFlashCardGroups.map(g => g.flashCardGroups.map(g2 => g2.flashCards)));
    this.flashCardGroups = Utils.flattenArrays<FlashCardGroup>(this.groupedFlashCardGroups.map(g => g.flashCardGroups));

    this.state = {
      currentFlashCardGroupIndex: 0,
      currentComponentOverride: null
    };
  }

  public render(): JSX.Element {
    const flashCardSetLinks = this.groupedFlashCardGroups
      .map(g => {
        const links = g.flashCardGroups
          .map(
            flashCardGroup => {
              const flashCardGroupIndex = this.flashCardGroups.indexOf(flashCardGroup);

              let className = "nav-link";
              if ((!this.state.currentComponentOverride) && (flashCardGroupIndex === this.state.currentFlashCardGroupIndex)) {
                className += " active";
              }
    
              return <a key={flashCardGroupIndex} href="" onClick={event => { event.preventDefault(); this.changeQuiz(flashCardGroupIndex); }} className={className}>{flashCardGroup.name}</a>
            },
            this
          );
        return (
          <div key={g.title}>
            <p>{g.title}</p>
            {links}
          </div>
        );
      });
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
              {flashCardSetLinks}
              {componentOverrideLinks}
            </div>
          </Paper>
          <div className="right-pane">
            {!this.state.currentComponentOverride ? (
              <StudyFlashCards
                key={this.state.currentFlashCardGroupIndex}
                title={currentFlashCardGroup.name}
                flashCards={currentFlashCardGroup.flashCards}
                renderFlashCardMultiSelect={currentFlashCardGroup.renderFlashCardMultiSelect} />
            ) : null}
            {this.state.currentComponentOverride ? React.createElement(this.state.currentComponentOverride) : null}
          </div>
        </div>
      </div>
    );
  }

  private groupedFlashCardGroups: { title: string; flashCardGroups: FlashCardGroup[]; }[];
  private flashCardGroups: FlashCardGroup[];
  private flashCards: FlashCard[];
  private componentOverrides: Array<{name: string, component: any}> = [];

  private changeQuiz(quizIndex: number) {
    this.setState({ currentFlashCardGroupIndex: quizIndex, currentComponentOverride: null });
  }
  private setComponentOverride(component: any) {
    this.setState({ currentComponentOverride: component });
  }
}

export default App;
