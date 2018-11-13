import * as React from 'react';

import "./App.css";

import { Quiz as QuizComponent } from "./Quiz";
import * as IntervalNamesToHalfSteps from './Quizzes/IntervalNamesToHalfSteps';
import * as IntervalHalfStepsToNames from './Quizzes/IntervalHalfStepsToNames';
import * as IntervalQualitySymbolsToQualities from './Quizzes/IntervalQualitySymbolsToQualities';
import * as GenericIntervalsToIntervalQualities from "./Quizzes/GenericIntervalsToIntervalQualities";
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

export interface IAppState {
  currentQuizIndex: number;
}
class App extends React.Component<{}, IAppState> {
  public constructor(props: {}) {
    super(props);

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
    const currentQuiz = this.quizzes[this.state.currentQuizIndex];

    return (
      <div className="app">
        <div className="left-pane">
          <div className="left-nav">
            {quizLinks}
          </div>
        </div>
        <div className="right-pane">
          <QuizComponent key={this.state.currentQuizIndex} quiz={currentQuiz} />
        </div>
      </div>
    );
  }

  private quizzes = [
    IntervalNamesToHalfSteps.createQuiz(),
    IntervalHalfStepsToNames.createQuiz(),
    IntervalQualitySymbolsToQualities.createQuiz(),
    GenericIntervalsToIntervalQualities.createQuiz(),
    IntervalsToConsonanceDissonance.createQuiz(),
    MajorDiatonicTriads.createQuiz(),
    NaturalMinorDiatonicTriads.createQuiz(),
    MelodicMinorDiatonicTriads.createQuiz(),
    HarmonicMinorDiatonicTriads.createQuiz(),
    HarmonicMajorDiatonicTriads.createQuiz(),
    DoubleHarmonicMajorDiatonicTriads.createQuiz(),
    MajorDiatonicSeventhChords.createQuiz(),
    NaturalMinorDiatonicSeventhChords.createQuiz(),
    MelodicMinorDiatonicSeventhChords.createQuiz(),
    HarmonicMinorDiatonicSeventhChords.createQuiz(),
    HarmonicMajorDiatonicSeventhChords.createQuiz(),
    DoubleHarmonicMajorDiatonicSeventhChords.createQuiz(),
    MajorScaleDegreeModes.createQuiz(),
    ChordNotes.createQuiz(),
    ScaleNotes.createQuiz(),
    ScaleChords.createQuiz(),
    ScaleCharacteristics.createQuiz(),
    ScaleFamilies.createQuiz(),
    ScaleDegreeNames.createQuiz(),
    ChordFamilies.createQuiz(),
    ChordFamilyDefinitions.createQuiz()
  ]

  private changeQuiz(quizIndex: number) {
    this.setState({ currentQuizIndex: quizIndex });
  }
}

export default App;
