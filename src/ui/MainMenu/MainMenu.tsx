/** This is the one with the ExpansionPanels. */
import * as React from "react";

//import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import "./Stylesheet.css";

import * as IntervalNamesToHalfSteps from "../Quizzes/Intervals/IntervalNamesToHalfSteps";
import * as IntervalQualitySymbolsToQualities from "../Quizzes/Intervals/IntervalQualitySymbolsToQualities";
import * as GenericIntervalsToIntervalQualities from "../Quizzes/Intervals/GenericIntervalsToIntervalQualities";
import * as IntervalsToConsonanceDissonance from "../Quizzes/Intervals/IntervalsToConsonanceDissonance";
import * as ChordNotes from "../Quizzes/Chords/ChordNotes";
import * as ScaleCharacteristics from "../Quizzes/Scales/ScaleCharacteristics";
import * as ScaleFamilies from "../Quizzes/Scales/ScaleFamilies";
import * as ChordFamilies from "../Quizzes/Chords/ChordFamilies";
import * as ChordFamilyDefinitions from "../Quizzes/Chords/ChordFamilyDefinitions";
import * as AvailableChordTensions from "../Quizzes/Chords/AvailableChordTensions";
import * as DiatonicTriads from "../Quizzes/Chords/DiatonicTriads";
import * as DiatonicSeventhChords from "../Quizzes/Chords/DiatonicSeventhChords";
import * as RandomChordGenerator from "../Tools/RandomChordGenerator";
import * as GuitarNotes from "../Quizzes/Notes/GuitarNotes";
import * as GuitarPerfectPitchTrainer from "../Quizzes/Notes/GuitarPerfectPitchTrainer";
import * as ViolinNotes from "../Quizzes/Notes/ViolinNotes";
import * as PianoNotes from "../Quizzes/Notes/PianoNotes";
import * as PianoChords from "../Quizzes/Chords/PianoChords";
import * as GuitarChords from "../Quizzes/Chords/GuitarChords";
import * as SheetMusicNotes from "../Quizzes/Sheet Music/SheetMusicNotes";
import * as NoteDurations from "../Quizzes/Sheet Music/SheetMusicNoteDurations";
import * as KeyAccidentalCounts from "../Quizzes/Keys/KeyAccidentalCounts";
import * as KeyAccidentalNotes from "../Quizzes/Keys/KeyAccidentalNotes";
import * as KeySignatureIdentification from "../Quizzes/Keys/KeySignatureIdentification";
import * as Interval2ndNotes from "../Quizzes/Intervals/Interval2ndNotes";
import * as IntervalNotes from "../Quizzes/Intervals/IntervalNotes";
import * as IntervalEarTraining from "../Quizzes/Intervals/IntervalEarTraining";
import * as Interval2ndNoteEarTraining from "../Quizzes/Intervals/Interval2ndNoteEarTraining";
import * as Interval2ndNoteEarTrainingPiano from "../Quizzes/Intervals/Interval2ndNoteEarTrainingPiano";
import * as IntervalSinging from "../Quizzes/Intervals/IntervalSinging";
import * as SheetMusicIntervalRecognition from "../Quizzes/Sheet Music/SheetMusicIntervalRecognition";
import * as PianoIntervals from "../Quizzes/Intervals/PianoIntervals";
import * as GuitarIntervals from "../Quizzes/Intervals/GuitarIntervals";
import * as SheetMusicChordRecognition from "../Quizzes/Sheet Music/SheetMusicChordRecognition";
import * as ChordEarTraining from "../Quizzes/Chords/ChordEarTraining";

import * as ScaleDegreeNames from "../Quizzes/Scales/ScaleDegreeNames";
import * as ScaleNotes from "../Quizzes/Scales/ScaleFormulas";
import * as PianoScales from "../Quizzes/Scales/PianoScales";
import * as GuitarScales from "../Quizzes/Scales/GuitarScales";
import * as ScaleDegreeModes from "../Quizzes/Scales/ScaleDegreeModes";
import * as ScaleChords from "../Quizzes/Chords/ScaleChords";
import * as ScaleEarTraining from "../Quizzes/Scales/ScaleEarTraining";

import { RhythmTapper } from "../Tools/RhythmTapper";
import { NavLinkView } from "../NavLinkView";
import { Button } from '../Button/Button';

export interface MainMenuCategory {
  title: string;
  items: Array<MainMenuItem>;
}

export interface MainMenuItem {
  title: string;
  uri: string;
}

const mainMenuCategories: Array<MainMenuCategory> = [
  {
    title: "Understanding the Piano Keyboard",
    items: [
      {
        uri: "/understanding-the-piano-keyboard?slide=introduction",
        title: "Introduction"
      },
      {
        uri: "/understanding-the-piano-keyboard?slide=notes-introduction",
        title: "Notes"
      },
      {
        uri: "/understanding-the-piano-keyboard?slide=scales-introduction",
        title: "Scales"
      },
      {
        uri: "/understanding-the-piano-keyboard?slide=chords-introduction",
        title: "Chords"
      },
      {
        uri: "/understanding-the-piano-keyboard?slide=chord-progressions-introduction",
        title: "Chord Progressions"
      }
    ]
  },
  // {
  //   title: "(Old) Essential Music Theory Course",
  //   items: [
  //     {
  //       uri: "/essential-music-theory",
  //       title: "Introduction"
  //     },
  //     {
  //       uri: "/essential-music-theory/rhythm",
  //       title: "Rhythm"
  //     },
  //     {
  //       uri: "/essential-music-theory/notes",
  //       title: "Notes"
  //     },
  //     {
  //       uri: "/essential-music-theory/intervals",
  //       title: "Intervals"
  //     },
  //     {
  //       uri: "/essential-music-theory/scales-and-modes",
  //       title: "Scales & Modes"
  //     },
  //     {
  //       uri: "/essential-music-theory/chords",
  //       title: "Chords"
  //     },
  //     {
  //       uri: "/essential-music-theory/chord-progressions",
  //       title: "Chord Progressions"
  //     },
  //     {
  //       uri: "/essential-music-theory/next-steps",
  //       title: "Next Steps"
  //     }
  //   ]
  // },
  {
    title: "Guitar Lessons",
    items: [
      {
        uri: "/learn-guitar-notes-in-10-steps",
        title: "Learn the Notes on Guitar in 10 Easy Steps"
      },
      {
        uri: "/learn-guitar-scales",
        title: "Learn Guitar Scale Shapes"
      }
    ]
  },
  {
    title: "Tools",
    items: [
      {
        uri: "/interval-chord-scale-finder",
        title: "Interval/Chord/Scale Finder"
      },
      {
        uri: "/scale-viewer",
        title: "Scale Viewer"
      },
      {
        uri: "/chord-viewer",
        title: "Chord Viewer"
      },
      {
        uri: "/diatonic-chord-player",
        title: "Diatonic Chord Player"
      },
      {
        uri: "/metronome",
        title: "Metronome"
      },
      {
        uri: "/tuner",
        title: "Tuner"
      },
      {
        uri: RandomChordGenerator.flashCardSet.route,
        title: RandomChordGenerator.flashCardSet.name
      }
    ]
  },
  {
    title: "Note Exercises",
    items: [
      {
        uri: PianoNotes.flashCardSet.route,
        title: PianoNotes.flashCardSet.name
      },
      {
        uri: GuitarNotes.flashCardSet.route,
        title: GuitarNotes.flashCardSet.name
      },
      {
        uri: ViolinNotes.flashCardSet.route,
        title: ViolinNotes.flashCardSet.name
      },
      {
        uri: SheetMusicNotes.flashCardSet.route,
        title: SheetMusicNotes.flashCardSet.name
      },
      {
        uri: NoteDurations.flashCardSet.route,
        title: NoteDurations.flashCardSet.name
      },
      {
        uri: GuitarPerfectPitchTrainer.flashCardSet.route,
        title: GuitarPerfectPitchTrainer.flashCardSet.name
      }
    ]
  },
  {
    title: "Interval Exercises",
    items: [
      {
        uri: IntervalQualitySymbolsToQualities.flashCardSet.route,
        title: IntervalQualitySymbolsToQualities.flashCardSet.name
      },
      {
        uri: IntervalNamesToHalfSteps.flashCardSet.route,
        title: IntervalNamesToHalfSteps.flashCardSet.name
      },
      {
        uri: IntervalsToConsonanceDissonance.flashCardSet.route,
        title: IntervalsToConsonanceDissonance.flashCardSet.name
      },
      {
        uri: Interval2ndNotes.flashCardSet.route,
        title: Interval2ndNotes.flashCardSet.name
      },
      {
        uri: IntervalNotes.flashCardSet.route,
        title: IntervalNotes.flashCardSet.name
      },
      {
        uri: SheetMusicIntervalRecognition.flashCardSet.route,
        title: SheetMusicIntervalRecognition.flashCardSet.name
      },
      {
        uri: PianoIntervals.flashCardSet.route,
        title: PianoIntervals.flashCardSet.name
      },
      {
        uri: GuitarIntervals.flashCardSet.route,
        title: GuitarIntervals.flashCardSet.name
      },
      {
        uri: IntervalEarTraining.flashCardSet.route,
        title: IntervalEarTraining.flashCardSet.name
      },
      {
        uri: Interval2ndNoteEarTraining.flashCardSet.route,
        title: Interval2ndNoteEarTraining.flashCardSet.name
      },
      {
        uri: Interval2ndNoteEarTrainingPiano.flashCardSet.route,
        title: Interval2ndNoteEarTrainingPiano.flashCardSet.name
      },
      {
        uri: IntervalSinging.flashCardSet.route,
        title: IntervalSinging.flashCardSet.name
      }
    ]
  },
  {
    title: "Scale Exercises",
    items: [
      {
        uri: ScaleDegreeNames.flashCardSet.route,
        title: ScaleDegreeNames.flashCardSet.name
      },
      {
        uri: ScaleNotes.flashCardSet.route,
        title: ScaleNotes.flashCardSet.name
      },
      {
        uri: PianoScales.flashCardSet.route,
        title: PianoScales.flashCardSet.name
      },
      {
        uri: GuitarScales.flashCardSet.route,
        title: GuitarScales.flashCardSet.name
      },
      {
        uri: ScaleDegreeModes.flashCardSet.route,
        title: ScaleDegreeModes.flashCardSet.name
      },
      {
        uri: ScaleChords.flashCardSet.route,
        title: ScaleChords.flashCardSet.name
      },
      {
        uri: ScaleEarTraining.flashCardSet.route,
        title: ScaleEarTraining.flashCardSet.name
      },
      {
        uri: "/scale-exercises",
        title: "More"
      }
    ]
  },
  {
    title: "Key Exercises",
    items: [
      {
        uri: KeyAccidentalCounts.flashCardSet.route,
        title: KeyAccidentalCounts.flashCardSet.name
      },
      {
        uri: KeyAccidentalNotes.flashCardSet.route,
        title: KeyAccidentalNotes.flashCardSet.name
      },
      {
        uri: KeySignatureIdentification.flashCardSet.route,
        title: KeySignatureIdentification.flashCardSet.name
      }
    ]
  },
  {
    title: "Chord Exercises",
    items: [
      {
        uri: ChordFamilies.flashCardSet.route,
        title: ChordFamilies.flashCardSet.name
      },
      {
        uri: ChordNotes.flashCardSet.route,
        title: ChordNotes.flashCardSet.name
      },
      {
        uri: AvailableChordTensions.flashCardSet.route,
        title: AvailableChordTensions.flashCardSet.name
      },
      {
        uri: DiatonicTriads.flashCardSet.route,
        title: DiatonicTriads.flashCardSet.name
      },
      {
        uri: DiatonicSeventhChords.flashCardSet.route,
        title: DiatonicSeventhChords.flashCardSet.name
      },
      {
        uri: SheetMusicChordRecognition.flashCardSet.route,
        title: SheetMusicChordRecognition.flashCardSet.name
      },
      {
        uri: PianoChords.flashCardSet.route,
        title: PianoChords.flashCardSet.name
      },
      {
        uri: GuitarChords.flashCardSet.route,
        title: GuitarChords.flashCardSet.name
      },
      {
        uri: ChordEarTraining.flashCardSet.route,
        title: ChordEarTraining.flashCardSet.name
      }
    ]
  },
  {
    title: "Other",
    items: [
      {
        uri: "/glossary",
        title: "Glossary"
      },
      {
        uri: "/contribute",
        title: "Contribute"
      }
    ]
  }
];

const NavSectionTitle: React.FunctionComponent<{ style?: any }> = props => <p style={Object.assign({ fontSize: "1.2em", fontWeight: "bold", textDecoration: "underline" }, props.style)}>{props.children}</p>;
const NavSectionSubTitle: React.FunctionComponent<{ style?: any }> = props => <p style={Object.assign({ textDecoration: "underline" }, props.style)}>{props.children}</p>;

const MenuCategoryView: React.FunctionComponent<{ menuCategory: MainMenuCategory, collapseCategories: boolean }> = props =>
  props.collapseCategories
  ? (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header">
        <span>{props.menuCategory.title}</span>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <span>{props.children}</span>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
  : (
    <div className="menu-category">
      <NavSectionSubTitle>{props.menuCategory.title}</NavSectionSubTitle>
      {props.menuCategory.items.map(i => <NavLinkView to={i.uri}>{i.title}</NavLinkView>)}
    </div>
  );

export interface IMainMenuProps {
  collapseCategories: boolean;
}

export interface IMainMenuState {
  expandedCategoryIndex: number | undefined;
}

export class MainMenu extends React.Component<IMainMenuProps, IMainMenuState> {
  public constructor(props: IMainMenuProps) {
    super(props);
    
    this.state = {
      expandedCategoryIndex: undefined
    };
  }

  public render(): JSX.Element {
    const { collapseCategories } = this.props;
    const { expandedCategoryIndex } = this.state;
    
    return !collapseCategories
      ? (
        <div className="menu">
          <div className="row no-gutters">
            <div className="col-sm">
              {<MenuCategoryView menuCategory={mainMenuCategories[0]} collapseCategories={false} />}
              {<MenuCategoryView menuCategory={mainMenuCategories[1]} collapseCategories={false} />}
            </div>
            <div className="col-sm">
              {<MenuCategoryView menuCategory={mainMenuCategories[2]} collapseCategories={false} />}
              {<MenuCategoryView menuCategory={mainMenuCategories[3]} collapseCategories={false} />}
            </div>
            <div className="col-sm">
              {<MenuCategoryView menuCategory={mainMenuCategories[4]} collapseCategories={false} />}
            </div>
            <div className="col-sm">
              {<MenuCategoryView menuCategory={mainMenuCategories[5]} collapseCategories={false} />}
              {<MenuCategoryView menuCategory={mainMenuCategories[6]} collapseCategories={false} />}
            </div>
            <div className="col-sm">
              {<MenuCategoryView menuCategory={mainMenuCategories[7]} collapseCategories={false} />}
              {<MenuCategoryView menuCategory={mainMenuCategories[8]} collapseCategories={false} />}
            </div>
          </div>
        </div>
      )
      : (
        <div className="menu expandable">
          <div className="row no-gutters">
            <div className="col-sm">
              {mainMenuCategories.map((c, i) => (
                <Button
                  onClick={e => this.expandCategory(i)}
                  className="menu-category-button">
                  {c.title}
                </Button>
              ))}
            </div>
            <div className="col-sm" style={{ padding: "0 1em" }}>
              {(expandedCategoryIndex !== undefined)
                ? mainMenuCategories[expandedCategoryIndex].items.map(item => <NavLinkView to={item.uri}>{item.title}</NavLinkView>)
                : null}
            </div>
          </div>
        </div>
      );
  }

  private expandCategory(categoryIndex: number) {
    this.setState({ expandedCategoryIndex: categoryIndex });
  }
};