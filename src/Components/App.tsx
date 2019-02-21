import * as React from "react";
import { Router, Route, NavLink } from "react-router-dom";
import { Paper, AppBar, Typography, Toolbar } from "@material-ui/core";
import { History, createBrowserHistory, Location, Action, UnregisterCallback } from "history";

import * as Utils from "../Utils";

import "./App.css";

import * as IntervalNamesToHalfSteps from "./Quizzes/IntervalNamesToHalfSteps";
import * as IntervalQualitySymbolsToQualities from "./Quizzes/IntervalQualitySymbolsToQualities";
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
import * as PianoScales from "./Quizzes/PianoScales";
import * as PianoChords from "./Quizzes/PianoChords";
import * as GuitarScales from "./Quizzes/GuitarScales";
import * as GuitarChords from "./Quizzes/GuitarChords";
import * as SheetMusicNotes from "./Quizzes/SheetMusicNotes";
import * as NoteDurations from "./Quizzes/NoteDurations";
import * as KeyAccidentalCounts from "./Quizzes/KeyAccidentalCounts";
import * as KeyAccidentalNotes from "./Quizzes/KeyAccidentalNotes";
import * as KeySignatureIdentification from "./Quizzes/KeySignatureIdentification";
import * as Interval2ndNotes from "./Quizzes/Interval2ndNotes";
import * as IntervalNotes from "./Quizzes/IntervalNotes";
import * as IntervalEarTraining from "./Quizzes/IntervalEarTraining";
import * as Interval2ndNoteEarTraining from "./Quizzes/Interval2ndNoteEarTraining";
import * as Interval2ndNoteEarTrainingPiano from "./Quizzes/Interval2ndNoteEarTrainingPiano";
import * as SheetMusicIntervalRecognition from "./Quizzes/SheetMusicIntervalRecognition";
import * as PianoIntervals from "./Quizzes/PianoIntervals";
import * as GuitarIntervals from "./Quizzes/GuitarIntervals";
import * as SheetMusicChordRecognition from "./Quizzes/SheetMusicChordRecognition";
import * as ChordEarTraining from "./Quizzes/ChordEarTraining";
import * as ScaleEarTraining from "./Quizzes/ScaleEarTraining";
import { ScaleViewer } from "./ScaleViewer";
import { ChordViewer } from "./ChordViewer";
import { RhythymTapper } from "./RhythymTapper";
import { FlashCardGroup } from "../FlashCardGroup";
import { StudyFlashCards } from "./StudyFlashCards";
import * as Overview from "./Quizzes/TheJazzPianoSite/TheBasics/Overview"
import { AboutPage } from "./AboutPage";
import DocumentTitle from "react-document-title";
import { HomePage } from "./HomePage";
import { isProduction } from "../Config";

const googleAnalyticsTrackingId = "UA-72494315-5";

interface IAppState {
  isMenuVisibleOnMobile: boolean;
}
class App extends React.Component<{}, IAppState> {
  public constructor(props: {}) {
    super(props);

    this.history = createBrowserHistory();
    this.unregisterHistoryListener = this.history.listen(this.historyListener.bind(this));

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
          PianoIntervals.createFlashCardGroup(),
          GuitarIntervals.createFlashCardGroup(),
          IntervalEarTraining.createFlashCardGroup(),
          Interval2ndNoteEarTraining.createFlashCardGroup(),
          Interval2ndNoteEarTrainingPiano.createFlashCardGroup()
        ]
      },
      {
        title: "Scales",
        flashCardGroups: [
          ScaleDegreeNames.createFlashCardGroup(),
          ScaleNotes.createFlashCardGroup(),
          PianoScales.createFlashCardGroup(),
          GuitarScales.createFlashCardGroup(),
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
          KeyAccidentalNotes.createFlashCardGroup(),
          KeySignatureIdentification.createFlashCardGroup()
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
          PianoChords.createFlashCardGroup(),
          GuitarChords.createFlashCardGroup(),
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
      isMenuVisibleOnMobile: false
    };
  }

  public componentWillUnmount() {
    if (this.unregisterHistoryListener) {
      this.unregisterHistoryListener();
    }
  }
  public render(): JSX.Element {
    const renderFlashCardGroupLink = (flashCardGroup: FlashCardGroup) => (
      <NavLink to={flashCardGroup.route} onClick={event => this.onNavLinkClick()} className="nav-link">{flashCardGroup.name}</NavLink>
    );

    /*
    <div>
      <p style={{marginTop: 0}}>Rhythyms</p>
      <NavLink to="rhythym-tapper" className="nav-link">Rhythym Tapper</NavLink>
    </div>
    */
   
    return (
      <Router history={this.history}>
        <div>
          <div className="app">
            <AppBar position="static" className="top-pane">
              <Toolbar className="nav top-nav">
                <Typography variant="h6" color="inherit">
                  <NavLink to="/" onClick={event => this.onNavLinkClick()} className="nav-link" activeClassName="">Falsetto</NavLink>
                  <i onClick={event => this.toggleMenu()} className="cursor-pointer material-icons hide-on-desktop" style={{verticalAlign: "sub"}}>menu</i>
                </Typography>
              </Toolbar>
            </AppBar>
            <div className="bottom-pane horizontal-panes">
              <Paper className={"left-pane" + (!this.state.isMenuVisibleOnMobile ? " hide-on-mobile" : "")}>
                <div className="nav left-nav">
                  <div>
                    <p style={{marginTop: 0}}>Notes</p>
                    {renderFlashCardGroupLink(PianoNotes.createFlashCardGroup())}
                    {renderFlashCardGroupLink(GuitarNotes.createFlashCardGroup())}
                    {renderFlashCardGroupLink(NoteDurations.createFlashCardGroup())}
                    {renderFlashCardGroupLink(SheetMusicNotes.createFlashCardGroup())}
                  </div>
                  <div>
                    <p>Intervals</p>
                    {renderFlashCardGroupLink(IntervalQualitySymbolsToQualities.createFlashCardGroup())}
                    {renderFlashCardGroupLink(IntervalNamesToHalfSteps.createFlashCardGroup())}
                    {renderFlashCardGroupLink(IntervalsToConsonanceDissonance.createFlashCardGroup())}
                    {renderFlashCardGroupLink(Interval2ndNotes.createFlashCardGroup())}
                    {renderFlashCardGroupLink(IntervalNotes.createFlashCardGroup())}
                    {renderFlashCardGroupLink(SheetMusicIntervalRecognition.createFlashCardGroup())}
                    {renderFlashCardGroupLink(PianoIntervals.createFlashCardGroup())}
                    {renderFlashCardGroupLink(GuitarIntervals.createFlashCardGroup())}
                    {renderFlashCardGroupLink(IntervalEarTraining.createFlashCardGroup())}
                    {renderFlashCardGroupLink(Interval2ndNoteEarTraining.createFlashCardGroup())}
                    {renderFlashCardGroupLink(Interval2ndNoteEarTrainingPiano.createFlashCardGroup())}
                  </div>
                  <div>
                    <p>Scales</p>
                    {renderFlashCardGroupLink(ScaleDegreeNames.createFlashCardGroup())}
                    {renderFlashCardGroupLink(ScaleNotes.createFlashCardGroup())}
                    {renderFlashCardGroupLink(PianoScales.createFlashCardGroup())}
                    {renderFlashCardGroupLink(GuitarScales.createFlashCardGroup())}
                    {renderFlashCardGroupLink(ScaleDegreeModes.createFlashCardGroup())}
                    {renderFlashCardGroupLink(ScaleChords.createFlashCardGroup())}
                    {renderFlashCardGroupLink(ScaleEarTraining.createFlashCardGroup())}
                    <NavLink to="scale-viewer" className="nav-link">Scale Viewer</NavLink>
                  </div>
                  <div>
                    <p>Keys</p>
                    {renderFlashCardGroupLink(KeyAccidentalCounts.createFlashCardGroup())}
                    {renderFlashCardGroupLink(KeyAccidentalNotes.createFlashCardGroup())}
                    {renderFlashCardGroupLink(KeySignatureIdentification.createFlashCardGroup())}
                  </div>
                  <div>
                    <p>Chords</p>
                    {renderFlashCardGroupLink(ChordFamilies.createFlashCardGroup())}
                    {renderFlashCardGroupLink(ChordNotes.createFlashCardGroup())}
                    {renderFlashCardGroupLink(AvailableChordTensions.createFlashCardGroup())}
                    {renderFlashCardGroupLink(DiatonicTriads.createFlashCardGroup())}
                    {renderFlashCardGroupLink(DiatonicSeventhChords.createFlashCardGroup())}
                    {renderFlashCardGroupLink(SheetMusicChordRecognition.createFlashCardGroup())}
                    {renderFlashCardGroupLink(PianoChords.createFlashCardGroup())}
                    {renderFlashCardGroupLink(GuitarChords.createFlashCardGroup())}
                    {renderFlashCardGroupLink(ChordEarTraining.createFlashCardGroup())}
                    {renderFlashCardGroupLink(RandomChordGenerator.createFlashCardGroup())}
                    <NavLink to="chord-viewer" className="nav-link">Chord Viewer</NavLink>
                  </div>
                </div>
              </Paper>
              <div className="right-pane">
                <Route exact path="/" component={() => <DocumentTitle title="Falsetto"><HomePage /></DocumentTitle>} />
                <Route path="/about" component={() => <DocumentTitle title="About - Falsetto"><AboutPage /></DocumentTitle>} />
                {this.flashCardGroups.map(fcg => <Route key={fcg.route} path={fcg.route} component={this.createStudyFlashCardGroupComponent(fcg)} />)}
                <Route path="/scale-viewer" component={() => <DocumentTitle title={"Scale Viewer - Falsetto"}><ScaleViewer /></DocumentTitle>} />
                <Route path="/chord-viewer" component={() => <DocumentTitle title={"Chord Viewer - Falsetto"}><ChordViewer /></DocumentTitle>} />
                <Route path="/rhythym-tapper" component={() => <DocumentTitle title={"Rhythym Tapper - Falsetto"}><RhythymTapper /></DocumentTitle>} />
              </div>
            </div>
          </div>
        </div>
      </Router>
    );
  }

  private history: History<any>;
  private unregisterHistoryListener: UnregisterCallback;
  private groupedFlashCardGroups: { title: string; flashCardGroups: FlashCardGroup[]; }[];
  private flashCardGroups: FlashCardGroup[];
  
  private historyListener(location: Location<any>, action: Action) {
    if (isProduction()) {
      const gtag: any = (window as any).gtag;
      gtag("config", googleAnalyticsTrackingId, {
        "page_title" : document.title,
        "page_path": location.pathname + location.search
      });
    }
  }
  private createStudyFlashCardGroupComponent(currentFlashCardGroup: FlashCardGroup): () => JSX.Element {
    return () => (
      <DocumentTitle title={currentFlashCardGroup.name + " - Falsetto"}>
        <StudyFlashCards
          key={currentFlashCardGroup.route}
          title={currentFlashCardGroup.name}
          flashCards={currentFlashCardGroup.flashCards}
          initialSelectedFlashCardIndices={currentFlashCardGroup.initialSelectedFlashCardIndices}
          initialConfigData={currentFlashCardGroup.initialConfigData}
          renderFlashCardMultiSelect={currentFlashCardGroup.renderFlashCardMultiSelect}
          renderAnswerSelect={currentFlashCardGroup.renderAnswerSelect}
          moreInfoUri={currentFlashCardGroup.moreInfoUri}
          enableInvertFlashCards={currentFlashCardGroup.enableInvertFlashCards}
          customNextFlashCardIdFilter={currentFlashCardGroup.customNextFlashCardIdFilter}
        />
      </DocumentTitle>
    );
  }
  private toggleMenu() {
    this.setState({ isMenuVisibleOnMobile: !this.state.isMenuVisibleOnMobile });
  }
  private onNavLinkClick() {
    this.setState({ isMenuVisibleOnMobile: false });
  }
}

export default App;
