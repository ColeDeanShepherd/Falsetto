import * as React from "react";
import { Router, Route, NavLink } from "react-router-dom";
import { Paper } from "@material-ui/core";
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
  ChordProgressionsSection,
  NextStepsSection
} from "./EssentialMusicTheory";
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
import * as RandomChordGenerator from "./RandomChordGenerator";
import * as GuitarNotes from "./Quizzes/Notes/GuitarNotes";
import * as PianoNotes from "./Quizzes/Notes/PianoNotes";
import * as PianoScales from "./Quizzes/Scales/PianoScales";
import * as PianoChords from "./Quizzes/Chords/PianoChords";
import * as GuitarScales from "./Quizzes/Scales/GuitarScales";
import * as GuitarChords from "./Quizzes/Chords/GuitarChords";
import * as SheetMusicNotes from "./Quizzes/Sheet Music/SheetMusicNotes";
import * as NoteDurations from "./Quizzes/Sheet Music/SheetMusicNoteDurations";
import * as KeyAccidentalCounts from "./Quizzes/KeyAccidentalCounts";
import * as KeyAccidentalNotes from "./Quizzes/KeyAccidentalNotes";
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
import { GuitarNotesLesson } from "./GuitarNotesLesson";
import { GuitarScalesLesson } from "./GuitarScalesLesson";
import { ScaleViewer } from "./ScaleViewer";
import { ChordViewer } from "./ChordViewer";
import { IntervalChordScaleFinder } from "./IntervalChordScaleFinder";
import { RhythmTapper } from "./RhythmTapper";
import { FlashCardGroup } from "../FlashCardGroup";
import { createStudyFlashCardGroupComponent } from "./StudyFlashCards";
import { AboutPage } from "./AboutPage";
import { SupportUsPage } from "./SupportUs";
import DocumentTitle from "react-document-title";
import { HomePage } from "./HomePage";
import ScrollToTop from './ScrollToTop';
import { MAX_MAIN_CARD_WIDTH } from './Style';

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

const NavSectionTitle: React.FunctionComponent<{ style?: any }> = props => <p style={Object.assign({ fontSize: "1.2em", fontWeight: "bold", textDecoration: "underline" }, props.style)}>{props.children}</p>;
const NavSectionSubTitle: React.FunctionComponent<{ style?: any }> = props => <p style={Object.assign({ textDecoration: "underline" }, props.style)}>{props.children}</p>;

const MenuCategory: React.FunctionComponent<{ title: string }> = props => (
  <div className="menu-category">
    <NavSectionSubTitle>{props.title}</NavSectionSubTitle>
    {props.children}
  </div>
);

interface IAppProps {
  isEmbedded: boolean;
}
interface IAppState {
  isMenuVisible: boolean;
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
      }
    ];

    this.flashCardGroups = Utils.flattenArrays<FlashCardGroup>(this.groupedFlashCardGroups.map(g => g.flashCardGroups));

    this.rightPaneRef = React.createRef();

    this.state = {
      isMenuVisible: false
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
      <Route exact path="/about" component={() => <DocumentTitle title="About - Falsetto"><AboutPage /></DocumentTitle>} />,
      <Route exact path="/support-us" component={() => <DocumentTitle title="Support Us - Falsetto"><SupportUsPage /></DocumentTitle>} />,
      <Route exact path="/essential-music-theory" component={() => <DocumentTitle title="Essential Music Theory - Falsetto"><SectionContainer section={IntroSection}></SectionContainer></DocumentTitle>} />,
      <Route exact path="/essential-music-theory/rhythm" component={() => <DocumentTitle title="Rhythm - Essential Music Theory - Falsetto"><SectionContainer section={RhythmSection}></SectionContainer></DocumentTitle>} />,
      <Route exact path="/essential-music-theory/notes" component={() => <DocumentTitle title="Notes - Essential Music Theory - Falsetto"><SectionContainer section={NotesSection}></SectionContainer></DocumentTitle>} />,
      <Route exact path="/essential-music-theory/intervals" component={() => <DocumentTitle title="Intervals - Essential Music Theory - Falsetto"><SectionContainer section={IntervalsSection}></SectionContainer></DocumentTitle>} />,
      <Route exact path="/essential-music-theory/scales-and-modes" component={() => <DocumentTitle title="Scales And Modes - Essential Music Theory - Falsetto"><SectionContainer section={ScalesAndModesSection}></SectionContainer></DocumentTitle>} />,
      <Route exact path="/essential-music-theory/chords" component={() => <DocumentTitle title="Chords - Essential Music Theory - Falsetto"><SectionContainer section={ChordsSection}></SectionContainer></DocumentTitle>} />,
      <Route exact path="/essential-music-theory/chord-progressions" component={() => <DocumentTitle title="Chord Progressions - Essential Music Theory - Falsetto"><SectionContainer section={ChordProgressionsSection}></SectionContainer></DocumentTitle>} />,
      <Route exact path="/essential-music-theory/next-steps" component={() => <DocumentTitle title="Next Steps - Essential Music Theory - Falsetto"><SectionContainer section={NextStepsSection}></SectionContainer></DocumentTitle>} />,
      <Route exact path="/scale-viewer" component={() => <DocumentTitle title={"Scale Viewer - Falsetto"}><ScaleViewer renderAllScaleShapes={false} /></DocumentTitle>} />,
      <Route exact path="/chord-viewer" component={() => <DocumentTitle title={"Chord Viewer - Falsetto"}><ChordViewer /></DocumentTitle>} />,
      <Route exact path="/interval-chord-scale-finder" component={() => <DocumentTitle title={"Interval/Chord/Scale Finder - Falsetto"}><IntervalChordScaleFinder /></DocumentTitle>} />,
      <Route exact path="/rhythm-tapper" component={() => <DocumentTitle title={"Rhythm Tapper - Falsetto"}><RhythmTapper /></DocumentTitle>} />,
      <Route exact path="/learn-guitar-notes-in-10-steps" component={() => <DocumentTitle title={"Learn the Guitar Notes in 10 Easy Steps - Falsetto"}><GuitarNotesLesson /></DocumentTitle>} />,
      <Route exact path="/learn-guitar-scales" component={() => <DocumentTitle title={"Learn the Guitar Scales - Falsetto"}><GuitarScalesLesson /></DocumentTitle>} />
    ].concat(
      this.flashCardGroups.map(fcg => <Route key={fcg.route} exact path={fcg.route} component={this.createStudyFlashCardGroupComponent(fcg)} />)
    );
  }
  public render(): JSX.Element {
    const renderFlashCardGroupLink = this.renderFlashCardGroupLink.bind(this);

    /*
    <div>
      <p style={{marginTop: 0}}>Rhythms</p>
      <NavLink to="rhythm-tapper" onClick={event => this.onNavLinkClick()} className="menu-link">Rhythm Tapper</NavLink>
    </div>
    */
   
    const menu = this.state.isMenuVisible ? (
      <Paper className={"menu-container"}>
        <div className="menu">
          <div className="row">
            <div className="column">
              <MenuCategory title="Essential Music Theory Course">
                {this.renderNavLink("/essential-music-theory", "Introduction")}
                {this.renderNavLink("/essential-music-theory/rhythm", "Rhythm")}
                {this.renderNavLink("/essential-music-theory/notes", "Notes")}
                {this.renderNavLink("/essential-music-theory/intervals", "Intervals")}
                {this.renderNavLink("/essential-music-theory/scales-and-modes", "Scales & Modes")}
                {this.renderNavLink("/essential-music-theory/chords", "Chords")}
                {this.renderNavLink("/essential-music-theory/chord-progressions", "Chord Progressions")}
                {this.renderNavLink("/essential-music-theory/next-steps", "Next Steps")}
              </MenuCategory>
              <MenuCategory title="Guitar Lessons">
                <NavLink to="/learn-guitar-notes-in-10-steps" onClick={event => this.onNavLinkClick()} className="menu-link">Learn the Notes on Guitar in 10 Easy Steps</NavLink>
                <NavLink to="/learn-guitar-scales" onClick={event => this.onNavLinkClick()} className="menu-link">Learn Guitar Scale Shapes</NavLink>
              </MenuCategory>
            </div>
            <div className="column">
              <MenuCategory title="Tools">
                <NavLink to="/interval-chord-scale-finder" onClick={event => this.onNavLinkClick()} className="menu-link">Interval/Chord/Scale Finder</NavLink>
                <NavLink to="/scale-viewer" onClick={event => this.onNavLinkClick()} className="menu-link">Scale Viewer</NavLink>
                <NavLink to="/chord-viewer" onClick={event => this.onNavLinkClick()} className="menu-link">Chord Viewer</NavLink>
                {renderFlashCardGroupLink(RandomChordGenerator.createFlashCardGroup())}
              </MenuCategory>
              <MenuCategory title="Note Exercises">
                {renderFlashCardGroupLink(PianoNotes.createFlashCardGroup())}
                {renderFlashCardGroupLink(GuitarNotes.createFlashCardGroup())}
                {renderFlashCardGroupLink(NoteDurations.createFlashCardGroup())}
                {renderFlashCardGroupLink(SheetMusicNotes.createFlashCardGroup())}
              </MenuCategory>
            </div>
            <div className="column">
              <MenuCategory title="Interval Exercises">
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
              </MenuCategory>
            </div>
            <div className="column">
              <MenuCategory title="Scale Exercises">
                {renderFlashCardGroupLink(ScaleDegreeNames.createFlashCardGroup())}
                {renderFlashCardGroupLink(ScaleNotes.createFlashCardGroup())}
                {renderFlashCardGroupLink(PianoScales.createFlashCardGroup())}
                {renderFlashCardGroupLink(GuitarScales.createFlashCardGroup())}
                {renderFlashCardGroupLink(ScaleDegreeModes.createFlashCardGroup())}
                {renderFlashCardGroupLink(ScaleChords.createFlashCardGroup())}
                {renderFlashCardGroupLink(ScaleEarTraining.createFlashCardGroup())}
              </MenuCategory>
              <MenuCategory title="Key Exercises">
                {renderFlashCardGroupLink(KeyAccidentalCounts.createFlashCardGroup())}
                {renderFlashCardGroupLink(KeyAccidentalNotes.createFlashCardGroup())}
                {renderFlashCardGroupLink(KeySignatureIdentification.createFlashCardGroup())}
              </MenuCategory>
            </div>
            <div className="column">
              <MenuCategory title="Chord Exercises">
                {renderFlashCardGroupLink(ChordFamilies.createFlashCardGroup())}
                {renderFlashCardGroupLink(ChordNotes.createFlashCardGroup())}
                {renderFlashCardGroupLink(AvailableChordTensions.createFlashCardGroup())}
                {renderFlashCardGroupLink(DiatonicTriads.createFlashCardGroup())}
                {renderFlashCardGroupLink(DiatonicSeventhChords.createFlashCardGroup())}
                {renderFlashCardGroupLink(SheetMusicChordRecognition.createFlashCardGroup())}
                {renderFlashCardGroupLink(PianoChords.createFlashCardGroup())}
                {renderFlashCardGroupLink(GuitarChords.createFlashCardGroup())}
                {renderFlashCardGroupLink(ChordEarTraining.createFlashCardGroup())}
              </MenuCategory>
            </div>
          </div>
        </div>
      </Paper>
    ) : null;

    const mainContent = (
      <div ref={this.rightPaneRef} className={!this.isEmbedded ? "main" : "main embedded"}>
        <div style={{ maxWidth: MAX_MAIN_CARD_WIDTH, margin: "0 auto" }}>
          {this.renderRoutes()}
        </div>
      </div>
    );
    const app = !this.isEmbedded
      ? (
        <div className="app">
          <div className="nav-container">
            <div className="nav-bar">
              <NavLink to="/" onClick={event => this.onNavLinkClick()} activeClassName="">
                <img src="/logo-white.svg" style={{height: "24px", verticalAlign: "sub"}} />
                <span style={{paddingLeft: "0.5em"}} className="hide-on-mobile">Falsetto</span>
              </NavLink>
              <NavLink to="/support-us" onClick={event => this.onNavLinkClick()} activeClassName="" style={{ fontWeight: "normal" }}>
                Support Us
              </NavLink>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfHT8tJTdmW_hCjxMPUf14wchM6GBPQAaq8PSMW05C01gBW4g/viewform"
                target="_blank"
                className="menu-link"
                style={{ fontWeight: "normal" }}
              >
                Contact
              </a>
              <i onClick={event => this.toggleMenu()} className="cursor-pointer material-icons no-select">menu</i>
            </div>
            {menu}
          </div>

          <div className="main-container">
            {mainContent}
          </div>
        </div>
      )
      : <div className="app">{mainContent}</div>;
   
    return (
      <Router history={this.history}>
        <ScrollToTop>
          {app}
        </ScrollToTop>
      </Router>
    );
  }

  public renderNavLink(route: string, text: string): JSX.Element {
    return <NavLink exact to={route} onClick={event => this.onNavLinkClick()} className="menu-link">{text}</NavLink>;
  }
  public renderFlashCardGroupLink(flashCardGroup: FlashCardGroup): JSX.Element {
    return <NavLink exact to={flashCardGroup.route} onClick={event => this.onNavLinkClick()} className="menu-link">{flashCardGroup.name}</NavLink>;
  }
  public toggleMenu() {
    this.setState({ isMenuVisible: !this.state.isMenuVisible });
  }
  public setMenuIsVisibleOnMobile(value: boolean) {
    this.setState({ isMenuVisible: value });
  }
  public scrollBodyToTop() {
    (this.rightPaneRef as any).current.scrollTo(0, 0);
    window.scrollTo(0, 0); // Needed for mobile devices.
  }

  private history: History<any>;
  private unregisterHistoryListener: UnregisterCallback;
  private groupedFlashCardGroups: { title: string; flashCardGroups: FlashCardGroup[]; }[];
  private flashCardGroups: FlashCardGroup[];
  private rightPaneRef: React.Ref<HTMLDivElement>;

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
    this.setState({ isMenuVisible: false });
  }
}

export default App;
