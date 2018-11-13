import * as React from 'react';

import "./App.css";

import { Quiz } from "../Quiz";
import { IntervalNamesToHalfSteps } from './Quizzes/IntervalNamesToHalfSteps';
import { IntervalHalfStepsToNames } from './Quizzes/IntervalHalfStepsToNames';
import { IntervalQualitySymbolsToQualities } from './Quizzes/IntervalQualitySymbolsToQualities';
import { GenericIntervalsToIntervalQualities } from "./Quizzes/GenericIntervalsToIntervalQualities";
import { IntervalsToConsonanceDissonance } from "./Quizzes/IntervalsToConsonanceDissonance";
import { MajorDiatonicTriads } from "./Quizzes/MajorDiatonicTriads";
import { NaturalMinorDiatonicTriads } from "./Quizzes/NaturalMinorDiatonicTriads";
import { MelodicMinorDiatonicTriads } from "./Quizzes/MelodicMinorDiatonicTriads";
import { HarmonicMinorDiatonicTriads } from "./Quizzes/HarmonicMinorDiatonicTriads";
import { HarmonicMajorDiatonicTriads } from "./Quizzes/HarmonicMajorDiatonicTriads";
import { DoubleHarmonicMajorDiatonicTriads } from "./Quizzes/DoubleHarmonicMajorDiatonicTriads";
import { MajorDiatonicSeventhChords } from "./Quizzes/MajorDiatonicSeventhChords";
import { NaturalMinorDiatonicSeventhChords } from "./Quizzes/NaturalMinorDiatonicSeventhChords";
import { MelodicMinorDiatonicSeventhChords } from "./Quizzes/MelodicMinorDiatonicSeventhChords";
import { HarmonicMinorDiatonicSeventhChords } from "./Quizzes/HarmonicMinorDiatonicSeventhChords";
import { HarmonicMajorDiatonicSeventhChords } from "./Quizzes/HarmonicMajorDiatonicSeventhChords";
import { DoubleHarmonicMajorDiatonicSeventhChords } from "./Quizzes/DoubleHarmonicMajorDiatonicSeventhChords";
import { MajorScaleDegreeModes } from "./Quizzes/MajorScaleDegreeModes";
import { ChordNotes } from "./Quizzes/ChordNotes";
import { ScaleNotes } from "./Quizzes/ScaleNotes";
import { ScaleChords } from "./Quizzes/ScaleChords";
import { ScaleCharacteristics } from "./Quizzes/ScaleCharacteristics";
import { ScaleFamilies } from "./Quizzes/ScaleFamilies";
import { ScaleDegreeNames } from "./Quizzes/ScaleDegreeNames";
import { ChordFamilies } from "./Quizzes/ChordFamilies";
import { ChordFamilyDefinitions } from "./Quizzes/ChordFamilyDefinitions";

export interface IAppState {
  currentQuizIndex: number;
}
class App extends React.Component<{}, IAppState> {
  public constructor(props: {}) {
    super(props);

    this.quizzes = this.quizComponents.map(qc => qc.createQuiz());
    this.state = {
      currentQuizIndex: 0
    };
  }

  public render(): JSX.Element {
    const quizLinks = this.quizzes
      .map(
        (quiz, i) => <a key={i} href="" onClick={event => { event.preventDefault(); this.changeQuiz(i); }} className="nav-link">{quiz.name}</a>,
        this
      );
    const quizComponent = this.quizComponents[this.state.currentQuizIndex];
    const renderedQuiz = React.createElement(quizComponent);

    return (
      <div className="app">
        <div className="left-pane">
          <div className="left-nav">
            {quizLinks}
          </div>
        </div>
        <div className="right-pane">
          {renderedQuiz}
        </div>
      </div>
    );
  }

  private quizComponents = [
    IntervalNamesToHalfSteps,
    IntervalHalfStepsToNames,
    IntervalQualitySymbolsToQualities,
    GenericIntervalsToIntervalQualities,
    IntervalsToConsonanceDissonance,
    MajorDiatonicTriads,
    NaturalMinorDiatonicTriads,
    MelodicMinorDiatonicTriads,
    HarmonicMinorDiatonicTriads,
    HarmonicMajorDiatonicTriads,
    DoubleHarmonicMajorDiatonicTriads,
    MajorDiatonicSeventhChords,
    NaturalMinorDiatonicSeventhChords,
    MelodicMinorDiatonicSeventhChords,
    HarmonicMinorDiatonicSeventhChords,
    HarmonicMajorDiatonicSeventhChords,
    DoubleHarmonicMajorDiatonicSeventhChords,
    MajorScaleDegreeModes,
    ChordNotes,
    ScaleNotes,
    ScaleChords,
    ScaleCharacteristics,
    ScaleFamilies,
    ScaleDegreeNames,
    ChordFamilies,
    ChordFamilyDefinitions
  ];
  private quizzes: Array<Quiz>;

  private changeQuiz(quizIndex: number) {
    this.setState({ currentQuizIndex: quizIndex });
  }
}

export default App;
