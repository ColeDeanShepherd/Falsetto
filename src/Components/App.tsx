import * as React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Paper, AppBar, Typography, Toolbar } from '@material-ui/core';
import * as Utils from "../Utils";

import "./App.css";

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
import * as GuitarNotes from "./Quizzes/GuitarNotes";
import * as PianoNotes from "./Quizzes/PianoNotes";
import * as SheetMusicNotes from "./Quizzes/SheetMusicNotes";
import * as NoteDurations from "./Quizzes/NoteDurations";
import * as KeyAccidentalCounts from "./Quizzes/KeyAccidentalCounts";
import * as KeyAccidentalNotes from "./Quizzes/KeyAccidentalNotes";
import * as Interval2ndNotes from "./Quizzes/Interval2ndNotes";
import * as IntervalNotes from "./Quizzes/IntervalNotes";
import * as IntervalEarTraining from "./Quizzes/IntervalEarTraining";
import * as Interval2ndNoteEarTraining from "./Quizzes/Interval2ndNoteEarTraining";
import * as SheetMusicIntervalRecognition from "./Quizzes/SheetMusicIntervalRecognition";
import * as SheetMusicChordRecognition from "./Quizzes/SheetMusicChordRecognition";
import * as ChordEarTraining from "./Quizzes/ChordEarTraining";
import * as ScaleEarTraining from "./Quizzes/ScaleEarTraining";
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
          PianoNotes.createFlashCardGroup(),
          GuitarNotes.createFlashCardGroup(),
          NoteDurations.createFlashCardGroup(),
          SheetMusicNotes.createFlashCardGroup()
        ]
      },
      {
        title: "Intervals",
        flashCardGroups: [
          new FlashCardGroup("Interval Quality Symbols To Qualities", IntervalQualitySymbolsToQualities.createFlashCards()),
          new FlashCardGroup("Generic Intervals To Interval Qualities", GenericIntervalsToIntervalQualities.createFlashCards()),
          new FlashCardGroup("Interval Names To Half Steps", IntervalNamesToHalfSteps.createFlashCards()),
          new FlashCardGroup("Intervals To Consonance Dissonance", IntervalsToConsonanceDissonance.createFlashCards()),
          Interval2ndNotes.createFlashCardGroup(),
          IntervalNotes.createFlashCardGroup(),
          SheetMusicIntervalRecognition.createFlashCardGroup(),
          IntervalEarTraining.createFlashCardGroup(),
          Interval2ndNoteEarTraining.createFlashCardGroup(),
        ]
      },
      {
        title: "Scales",
        flashCardGroups: [
          new FlashCardGroup("Scale Degree Names", ScaleDegreeNames.createFlashCards()),
          new FlashCardGroup("Scale Notes", ScaleNotes.createFlashCards()),
          new FlashCardGroup("Scale Degree Modes", ScaleDegreeModes.createFlashCards()),
          new FlashCardGroup("Scale Chords", ScaleChords.createFlashCards()),
          new FlashCardGroup("Scale Families", ScaleFamilies.createFlashCards()),
          new FlashCardGroup("Scale Characteristics", ScaleCharacteristics.createFlashCards()),
          ScaleEarTraining.createFlashCardGroup()
        ]
      },
      {
        title: "Keys",
        flashCardGroups: [
          new FlashCardGroup("Key Accidental Counts", KeyAccidentalCounts.createFlashCards()),
          new FlashCardGroup("Key Accidental Notes", KeyAccidentalNotes.createFlashCards())
        ]
      },
      {
        title: "Chords",
        flashCardGroups: [
          new FlashCardGroup("Chord Family Definitions", ChordFamilyDefinitions.createFlashCards()),
          new FlashCardGroup("Chord Families", ChordFamilies.createFlashCards()),
          new FlashCardGroup("Chord Notes", ChordNotes.createFlashCards()),
          new FlashCardGroup("Available Chord Tensions", AvailableChordTensions.createFlashCards()),
          new FlashCardGroup("Diatonic Triads", DiatonicTriads.createFlashCards()),
          new FlashCardGroup("Diatonic Seventh Chords", DiatonicSeventhChords.createFlashCards()),
          SheetMusicChordRecognition.createFlashCardGroup(),
          ChordEarTraining.createFlashCardGroup(),
          RandomChordGenerator.createFlashCardGroup()
        ]
      },
      {
        title: "The Jazz Piano Site",
        flashCardGroups: [
          new FlashCardGroup("Overview", Overview.createFlashCards())
        ]
      }
    ];

    this.flashCardGroups = Utils.flattenArrays<FlashCardGroup>(this.groupedFlashCardGroups.map(g => g.flashCardGroups));

    this.state = {
      currentFlashCardGroupIndex: 0,
      currentComponentOverride: null
    };
  }

  public render(): JSX.Element {
    const renderFlashCardGroupLink = (flashCardGroup: FlashCardGroup) => (
      <Link to={flashCardGroup.route}>{flashCardGroup.name}</Link>
    );

    return (
      <Router>
        <div>
          <div className="app">
            <AppBar position="static" className="top-pane">
              <Toolbar>
                <Typography variant="h6" color="inherit">
                  Ritornello
                </Typography>
              </Toolbar>
            </AppBar>
            <div className="bottom-pane horizontal-panes">
              <Paper className="left-pane">
                <div className="left-nav">
                  <div>
                    <p>Notes</p>
                    {renderFlashCardGroupLink(PianoNotes.createFlashCardGroup())}
                    {renderFlashCardGroupLink(GuitarNotes.createFlashCardGroup())}
                    {renderFlashCardGroupLink(NoteDurations.createFlashCardGroup())}
                    {renderFlashCardGroupLink(new FlashCardGroup("Sheet Music Notes", SheetMusicNotes.createFlashCards()))}
                  </div>
                  <div>
                    <p>Intervals</p>
                    {renderFlashCardGroupLink(new FlashCardGroup("Interval Quality Symbols To Qualities", IntervalQualitySymbolsToQualities.createFlashCards()))}
                    {renderFlashCardGroupLink(new FlashCardGroup("Generic Intervals To Interval Qualities", GenericIntervalsToIntervalQualities.createFlashCards()))}
                    {renderFlashCardGroupLink(new FlashCardGroup("Interval Names To Half Steps", IntervalNamesToHalfSteps.createFlashCards()))}
                    {renderFlashCardGroupLink(new FlashCardGroup("Intervals To Consonance Dissonance", IntervalsToConsonanceDissonance.createFlashCards()))}
                    {renderFlashCardGroupLink(Interval2ndNotes.createFlashCardGroup())}
                    {renderFlashCardGroupLink(IntervalNotes.createFlashCardGroup())}
                    {renderFlashCardGroupLink(SheetMusicIntervalRecognition.createFlashCardGroup())}
                    {renderFlashCardGroupLink(IntervalEarTraining.createFlashCardGroup())}
                    {renderFlashCardGroupLink(Interval2ndNoteEarTraining.createFlashCardGroup())}
                  </div>
                  <div>
                    <p>Scales</p>
                    {renderFlashCardGroupLink(new FlashCardGroup("Scale Degree Names", ScaleDegreeNames.createFlashCards()))}
                    {renderFlashCardGroupLink(new FlashCardGroup("Scale Notes", ScaleNotes.createFlashCards()))}
                    {renderFlashCardGroupLink(new FlashCardGroup("Scale Degree Modes", ScaleDegreeModes.createFlashCards()))}
                    {renderFlashCardGroupLink(new FlashCardGroup("Scale Chords", ScaleChords.createFlashCards()))}
                    {renderFlashCardGroupLink(new FlashCardGroup("Scale Families", ScaleFamilies.createFlashCards()))}
                    {renderFlashCardGroupLink(new FlashCardGroup("Scale Characteristics", ScaleCharacteristics.createFlashCards()))}
                    {renderFlashCardGroupLink(ScaleEarTraining.createFlashCardGroup())}
                  </div>
                  <div>
                    <p>Keys</p>
                    {renderFlashCardGroupLink(new FlashCardGroup("Key Accidental Counts", KeyAccidentalCounts.createFlashCards()))}
                    {renderFlashCardGroupLink(new FlashCardGroup("Key Accidental Notes", KeyAccidentalNotes.createFlashCards()))}
                  </div>
                  <div>
                    <p>Chords</p>
                    {renderFlashCardGroupLink(new FlashCardGroup("Chord Family Definitions", ChordFamilyDefinitions.createFlashCards()))}
                    {renderFlashCardGroupLink(new FlashCardGroup("Chord Families", ChordFamilies.createFlashCards()))}
                    {renderFlashCardGroupLink(new FlashCardGroup("Chord Notes", ChordNotes.createFlashCards()))}
                    {renderFlashCardGroupLink(new FlashCardGroup("Available Chord Tensions", AvailableChordTensions.createFlashCards()))}
                    {renderFlashCardGroupLink(new FlashCardGroup("Diatonic Triads", DiatonicTriads.createFlashCards()))}
                    {renderFlashCardGroupLink(new FlashCardGroup("Diatonic Seventh Chords", DiatonicSeventhChords.createFlashCards()))}
                    {renderFlashCardGroupLink(SheetMusicChordRecognition.createFlashCardGroup())}
                    {renderFlashCardGroupLink(ChordEarTraining.createFlashCardGroup())}
                    {renderFlashCardGroupLink(RandomChordGenerator.createFlashCardGroup())}
                  </div>
                  <div>
                    <p>The Jazz Piano Site</p>
                    {renderFlashCardGroupLink(new FlashCardGroup("Overview", Overview.createFlashCards()))}
                  </div>
                </div>
              </Paper>
              <div className="right-pane">
                <Route exact path="/" component={() => null} />
                {this.flashCardGroups.map(fcg => <Route key={fcg.route} path={fcg.route} component={this.createStudyFlashCardGroupComponent(fcg)} />)}
                {this.state.currentComponentOverride ? React.createElement(this.state.currentComponentOverride) : null}
              </div>
            </div>
          </div>
        </div>
      </Router>
    );
  }

  private groupedFlashCardGroups: { title: string; flashCardGroups: FlashCardGroup[]; }[];
  private flashCardGroups: FlashCardGroup[];

  private changeQuiz(quizIndex: number) {
    this.setState({ currentFlashCardGroupIndex: quizIndex, currentComponentOverride: null });
  }
  private setComponentOverride(component: any) {
    this.setState({ currentComponentOverride: component });
  }
  
  private createStudyFlashCardGroupComponent(currentFlashCardGroup: FlashCardGroup): () => JSX.Element {
    return () => <StudyFlashCards
      key={currentFlashCardGroup.route}
      title={currentFlashCardGroup.name}
      flashCards={currentFlashCardGroup.flashCards}
      initialSelectedFlashCardIndices={currentFlashCardGroup.initialSelectedFlashCardIndices}
      initialConfigData={currentFlashCardGroup.initialConfigData}
      renderFlashCardMultiSelect={currentFlashCardGroup.renderFlashCardMultiSelect}
      renderAnswerSelect={currentFlashCardGroup.renderAnswerSelect}
      enableInvertFlashCards={currentFlashCardGroup.enableInvertFlashCards} />;
  }
}

export default App;
