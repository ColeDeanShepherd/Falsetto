import * as React from "react";
import { Router, Route, NavLink } from "react-router-dom";
import { Paper, AppBar, Typography, Toolbar } from "@material-ui/core";
import { History, createBrowserHistory, Location, Action, UnregisterCallback } from "history";
import StackTrace from "stacktrace-js";

import "./App.css";

import * as Utils from "../Utils";
import * as Analytics from "../Analytics";

import {
  SectionContainer,
  IntroSection,
  RhythmSection,
  NotesSection,
  IntervalsSection,
  ScalesAndModesSection,
  ChordsSection,
  ChordProgressionsSection
} from "./EssentialMusicTheory";
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
import { GuitarNotesLesson } from "./GuitarNotesLesson";
import { ScaleViewer } from "./ScaleViewer";
import { ChordViewer } from "./ChordViewer";
import { RhythmTapper } from "./RhythmTapper";
import { FlashCardGroup } from "../FlashCardGroup";
import { createStudyFlashCardGroupComponent } from "./StudyFlashCards";
import * as TheJazzPianoSiteOverview from "./Quizzes/TheJazzPianoSite/TheBasics/Overview"
import { AboutPage } from "./AboutPage";
import DocumentTitle from "react-document-title";
import { HomePage } from "./HomePage";

async function getErrorDescription(msg: string | Event, file: string | undefined, line: number | undefined, col: number | undefined, error: Error | undefined): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const fallbackErrorDescription = `${file}: ${msg} (${line}:${col})`;

    if (error !== undefined) {
      StackTrace.fromError(error)
        .then(stackFrames => {
          var stringifiedStack = stackFrames.map(sf => {
            return sf.toString();
          }).join('\n');
          resolve(stringifiedStack);
        })
        .catch(err => {
          resolve(fallbackErrorDescription + "\n\n" + err);
        });
    } else {
      resolve(fallbackErrorDescription);
    }
  });
}

const NavSectionTitle: React.FunctionComponent<{ style?: any }> = props => <p style={Object.assign({ fontWeight: "bold" }, props.style)}>{props.children}</p>;

interface IAppProps {
  isEmbedded: boolean;
}
interface IAppState {
  isMenuVisibleOnMobile: boolean;
}
class App extends React.Component<IAppProps, IAppState> {
  public static instance: App;
  
  public constructor(props: IAppProps) {
    super(props);

    window.onerror = (msg, file, line, col, error) => {
      const fatal = true;
      getErrorDescription(msg, file, line, col, error)
        .then(errorDescription => Analytics.trackException(errorDescription, fatal));
    };

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
          new FlashCardGroup("The Jazz Piano Site Overview", TheJazzPianoSiteOverview.createFlashCards)
        ]
      }
    ];

    this.flashCardGroups = Utils.flattenArrays<FlashCardGroup>(this.groupedFlashCardGroups.map(g => g.flashCardGroups));

    this.state = {
      isMenuVisibleOnMobile: false
    };

    App.instance = this;
  }

  public componentWillMount() {
    if (!this.isEmbedded) {
      Analytics.trackPageView();
    }
  }
  public componentWillUnmount() {
    if (this.unregisterHistoryListener) {
      this.unregisterHistoryListener();
    }
  }
  public renderRoutes(): Array<JSX.Element> {
    return [
      <Route exact path="/" component={() => <DocumentTitle title="Falsetto"><HomePage /></DocumentTitle>} />,
      <Route path="/about" component={() => <DocumentTitle title="About - Falsetto"><AboutPage /></DocumentTitle>} />,
      <Route exact path="/essential-music-theory" component={() => <DocumentTitle title="Essential Music Theory - Falsetto"><SectionContainer section={IntroSection}></SectionContainer></DocumentTitle>} />,
      <Route exact path="/essential-music-theory/rhythm" component={() => <DocumentTitle title="Rhythm - Essential Music Theory - Falsetto"><SectionContainer section={RhythmSection}></SectionContainer></DocumentTitle>} />,
      <Route exact path="/essential-music-theory/notes" component={() => <DocumentTitle title="Notes - Essential Music Theory - Falsetto"><SectionContainer section={NotesSection}></SectionContainer></DocumentTitle>} />,
      <Route exact path="/essential-music-theory/intervals" component={() => <DocumentTitle title="Intervals - Essential Music Theory - Falsetto"><SectionContainer section={IntervalsSection}></SectionContainer></DocumentTitle>} />,
      <Route exact path="/essential-music-theory/scales-and-modes" component={() => <DocumentTitle title="Scales And Modes - Essential Music Theory - Falsetto"><SectionContainer section={ScalesAndModesSection}></SectionContainer></DocumentTitle>} />,
      <Route exact path="/essential-music-theory/chords" component={() => <DocumentTitle title="Chords - Essential Music Theory - Falsetto"><SectionContainer section={ChordsSection}></SectionContainer></DocumentTitle>} />,
      <Route exact path="/essential-music-theory/chord-progressions" component={() => <DocumentTitle title="Chord Progressions - Essential Music Theory - Falsetto"><SectionContainer section={ChordProgressionsSection}></SectionContainer></DocumentTitle>} />,
      <Route path="/scale-viewer" component={() => <DocumentTitle title={"Scale Viewer - Falsetto"}><ScaleViewer /></DocumentTitle>} />,
      <Route path="/chord-viewer" component={() => <DocumentTitle title={"Chord Viewer - Falsetto"}><ChordViewer /></DocumentTitle>} />,
      <Route path="/rhythm-tapper" component={() => <DocumentTitle title={"Rhythm Tapper - Falsetto"}><RhythmTapper /></DocumentTitle>} />,
      <Route path="/learn-guitar-notes-in-10-steps" component={() => <DocumentTitle title={"Learn the Guitar Notes in 10 Easy Steps - Falsetto"}><GuitarNotesLesson /></DocumentTitle>} />,
    ].concat(
      this.flashCardGroups.map(fcg => <Route key={fcg.route} path={fcg.route} component={this.createStudyFlashCardGroupComponent(fcg)} />)
    );
  }
  public render(): JSX.Element {
    const renderFlashCardGroupLink = this.renderFlashCardGroupLink.bind(this);

    /*
    <div>
      <p style={{marginTop: 0}}>Rhythms</p>
      <NavLink to="rhythm-tapper" className="nav-link">Rhythm Tapper</NavLink>
    </div>
    */

    const navSectionStyle = { fontWeight: "bold" };
    const nav = (
      <div className="nav left-nav">
        <div>
          <NavSectionTitle style={{marginTop: 0}}>Essential Music Theory</NavSectionTitle>
          {this.renderNavLink("/essential-music-theory", "Introduction")}
          {this.renderNavLink("/essential-music-theory/rhythm", "Rhythm")}
          {this.renderNavLink("/essential-music-theory/notes", "Notes")}
          <p><em>More coming soon...</em></p>

          <NavSectionTitle>Notes</NavSectionTitle>
          {renderFlashCardGroupLink(PianoNotes.createFlashCardGroup())}
          {renderFlashCardGroupLink(GuitarNotes.createFlashCardGroup())}
          <NavLink to="learn-guitar-notes-in-10-steps" className="nav-link">Learn the Notes on Guitar in 10 Easy Steps</NavLink>
          {renderFlashCardGroupLink(NoteDurations.createFlashCardGroup())}
          {renderFlashCardGroupLink(SheetMusicNotes.createFlashCardGroup())}
        </div>
        <div>
          <NavSectionTitle>Intervals</NavSectionTitle>
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
          <NavSectionTitle>Scales</NavSectionTitle>
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
          <NavSectionTitle>Keys</NavSectionTitle>
          {renderFlashCardGroupLink(KeyAccidentalCounts.createFlashCardGroup())}
          {renderFlashCardGroupLink(KeyAccidentalNotes.createFlashCardGroup())}
          {renderFlashCardGroupLink(KeySignatureIdentification.createFlashCardGroup())}
        </div>
        <div>
          <NavSectionTitle>Chords</NavSectionTitle>
          {renderFlashCardGroupLink(ChordFamilies.createFlashCardGroup())}
          {renderFlashCardGroupLink(ChordNotes.createFlashCardGroup())}
          {renderFlashCardGroupLink(AvailableChordTensions.createFlashCardGroup())}
          {renderFlashCardGroupLink(DiatonicTriads.createFlashCardGroup())}
          {renderFlashCardGroupLink(DiatonicSeventhChords.createFlashCardGroup())}
          {renderFlashCardGroupLink(SheetMusicChordRecognition.createFlashCardGroup())}
          {renderFlashCardGroupLink(PianoChords.createFlashCardGroup())}
          {renderFlashCardGroupLink(GuitarChords.createFlashCardGroup())}
          {renderFlashCardGroupLink(ChordEarTraining.createFlashCardGroup())}
          <NavLink to="chord-viewer" className="nav-link">Chord Viewer</NavLink>
          {renderFlashCardGroupLink(RandomChordGenerator.createFlashCardGroup())}
        </div>
      </div>
    );

    const rightPane = (
      <div className={!this.isEmbedded ? "right-pane" : "right-pane embedded"}>
        {this.renderRoutes()}
      </div>
    );
    const app = !this.isEmbedded
      ? (
        <div className="app">
          <AppBar position="static" className="top-pane">
            <Toolbar className="nav top-nav">
              <Typography variant="h6" color="inherit">
                <NavLink to="/" onClick={event => this.onNavLinkClick()} className="nav-link" activeClassName="" style={{ display: "inline-block" }}>Falsetto</NavLink>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfHT8tJTdmW_hCjxMPUf14wchM6GBPQAaq8PSMW05C01gBW4g/viewform"
                  target="_blank"
                  className="nav-link"
                  style={{ fontSize: "1.1rem", fontWeight: "normal", display: "inline-block" }}
                >
                  Contact
                </a>
                <i onClick={event => this.toggleMenu()} className="cursor-pointer material-icons hide-on-desktop" style={{ verticalAlign: "sub", display: "inline-block"}}>menu</i>
              </Typography>
            </Toolbar>
          </AppBar>
          <div className="bottom-pane horizontal-panes">
            <Paper className={"left-pane" + (!this.state.isMenuVisibleOnMobile ? " hide-on-mobile" : "")}>
              {nav}
            </Paper>
            {rightPane}
          </div>
        </div>
      )
      : <div className="app">{rightPane}</div>;
   
    return (
      <Router history={this.history}>
        {app}
      </Router>
    );
  }

  public renderNavLink(route: string, text: string): JSX.Element {
    return <NavLink exact to={route} onClick={event => this.onNavLinkClick()} className="nav-link">{text}</NavLink>;
  }
  public renderFlashCardGroupLink(flashCardGroup: FlashCardGroup): JSX.Element {
    return <NavLink exact to={flashCardGroup.route} onClick={event => this.onNavLinkClick()} className="nav-link">{flashCardGroup.name}</NavLink>;
  }
  public toggleMenu() {
    this.setState({ isMenuVisibleOnMobile: !this.state.isMenuVisibleOnMobile });
  }
  public setMenuIsVisibleOnMobile(value: boolean) {
    this.setState({ isMenuVisibleOnMobile: value });
  }

  private history: History<any>;
  private unregisterHistoryListener: UnregisterCallback;
  private groupedFlashCardGroups: { title: string; flashCardGroups: FlashCardGroup[]; }[];
  private flashCardGroups: FlashCardGroup[];

  private get isEmbedded(): boolean {
    return this.props.isEmbedded || this.history.location.search.includes("isEmbedded=true");
  }
  
  private historyListener(location: Location<any>, action: Action) {
    if (!this.isEmbedded) {
      Analytics.trackPageView();
    }
  }
  private createStudyFlashCardGroupComponent(currentFlashCardGroup: FlashCardGroup): () => JSX.Element {
    return () => (
      <DocumentTitle title={currentFlashCardGroup.name + " - Falsetto"}>
        {createStudyFlashCardGroupComponent(currentFlashCardGroup, this.isEmbedded, false)}
      </DocumentTitle>
    );
  }
  private onNavLinkClick() {
    this.setState({ isMenuVisibleOnMobile: false });
  }
}

export default App;
