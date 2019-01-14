import * as React from 'react';
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import { Paper, AppBar, Typography, Toolbar, Button } from '@material-ui/core';
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
import { AboutPage } from './AboutPage';

class App extends React.Component<{}, {}> {
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
          IntervalQualitySymbolsToQualities.createFlashCardGroup(),
          GenericIntervalsToIntervalQualities.createFlashCardGroup(),
          IntervalNamesToHalfSteps.createFlashCardGroup(),
          IntervalsToConsonanceDissonance.createFlashCardGroup(),
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
          ScaleDegreeNames.createFlashCardGroup(),
          ScaleNotes.createFlashCardGroup(),
          ScaleDegreeModes.createFlashCardGroup(),
          ScaleChords.createFlashCardGroup(),
          ScaleFamilies.createFlashCardGroup(),
          ScaleCharacteristics.createFlashCardGroup(),
          ScaleEarTraining.createFlashCardGroup()
        ]
      },
      {
        title: "Keys",
        flashCardGroups: [
          KeyAccidentalCounts.createFlashCardGroup(),
          KeyAccidentalNotes.createFlashCardGroup()
        ]
      },
      {
        title: "Chords",
        flashCardGroups: [
          ChordFamilyDefinitions.createFlashCardGroup(),
          ChordFamilies.createFlashCardGroup(),
          ChordNotes.createFlashCardGroup(),
          AvailableChordTensions.createFlashCardGroup(),
          DiatonicTriads.createFlashCardGroup(),
          DiatonicSeventhChords.createFlashCardGroup(),
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
  }

  public render(): JSX.Element {
    const renderFlashCardGroupLink = (flashCardGroup: FlashCardGroup) => (
      <NavLink to={flashCardGroup.route} className="nav-link">{flashCardGroup.name}</NavLink>
    );

    return (
      <Router>
        <div>
          <div className="app">
            <AppBar position="static" className="top-pane">
              <Toolbar className="nav top-nav">
                <Typography variant="h6" color="inherit">
                  <NavLink to="/" className="nav-link" activeClassName="">Ritornello</NavLink>
                </Typography>
                <NavLink to="/about" className="nav-link">About</NavLink>
              </Toolbar>
            </AppBar>
            <div className="bottom-pane horizontal-panes">
              <Paper className="left-pane">
                <div className="nav left-nav">
                  <div>
                    <p>Notes</p>
                    {renderFlashCardGroupLink(PianoNotes.createFlashCardGroup())}
                    {renderFlashCardGroupLink(GuitarNotes.createFlashCardGroup())}
                    {renderFlashCardGroupLink(NoteDurations.createFlashCardGroup())}
                    {renderFlashCardGroupLink(SheetMusicNotes.createFlashCardGroup())}
                  </div>
                  <div>
                    <p>Intervals</p>
                    {renderFlashCardGroupLink(IntervalQualitySymbolsToQualities.createFlashCardGroup())}
                    {renderFlashCardGroupLink(GenericIntervalsToIntervalQualities.createFlashCardGroup())}
                    {renderFlashCardGroupLink(IntervalNamesToHalfSteps.createFlashCardGroup())}
                    {renderFlashCardGroupLink(IntervalsToConsonanceDissonance.createFlashCardGroup())}
                    {renderFlashCardGroupLink(Interval2ndNotes.createFlashCardGroup())}
                    {renderFlashCardGroupLink(IntervalNotes.createFlashCardGroup())}
                    {renderFlashCardGroupLink(SheetMusicIntervalRecognition.createFlashCardGroup())}
                    {renderFlashCardGroupLink(IntervalEarTraining.createFlashCardGroup())}
                    {renderFlashCardGroupLink(Interval2ndNoteEarTraining.createFlashCardGroup())}
                  </div>
                  <div>
                    <p>Scales</p>
                    {renderFlashCardGroupLink(ScaleDegreeNames.createFlashCardGroup())}
                    {renderFlashCardGroupLink(ScaleNotes.createFlashCardGroup())}
                    {renderFlashCardGroupLink(ScaleDegreeModes.createFlashCardGroup())}
                    {renderFlashCardGroupLink(ScaleChords.createFlashCardGroup())}
                    {renderFlashCardGroupLink(ScaleFamilies.createFlashCardGroup())}
                    {renderFlashCardGroupLink(ScaleCharacteristics.createFlashCardGroup())}
                    {renderFlashCardGroupLink(ScaleEarTraining.createFlashCardGroup())}
                  </div>
                  <div>
                    <p>Keys</p>
                    {renderFlashCardGroupLink(KeyAccidentalCounts.createFlashCardGroup())}
                    {renderFlashCardGroupLink(KeyAccidentalNotes.createFlashCardGroup())}
                  </div>
                  <div>
                    <p>Chords</p>
                    {renderFlashCardGroupLink(ChordFamilyDefinitions.createFlashCardGroup())}
                    {renderFlashCardGroupLink(ChordFamilies.createFlashCardGroup())}
                    {renderFlashCardGroupLink(ChordNotes.createFlashCardGroup())}
                    {renderFlashCardGroupLink(AvailableChordTensions.createFlashCardGroup())}
                    {renderFlashCardGroupLink(DiatonicTriads.createFlashCardGroup())}
                    {renderFlashCardGroupLink(DiatonicSeventhChords.createFlashCardGroup())}
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
                <Route path="/about" component={AboutPage} />
                {this.flashCardGroups.map(fcg => <Route key={fcg.route} path={fcg.route} component={this.createStudyFlashCardGroupComponent(fcg)} />)}
              </div>
            </div>
          </div>
        </div>
      </Router>
    );
  }

  private groupedFlashCardGroups: { title: string; flashCardGroups: FlashCardGroup[]; }[];
  private flashCardGroups: FlashCardGroup[];
  
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
