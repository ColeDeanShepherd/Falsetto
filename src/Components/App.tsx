import * as React from 'react';

import { IntervalNamesToHalfSteps } from './IntervalNamesToHalfSteps';
import { IntervalHalfStepsToNames } from './IntervalHalfStepsToNames';
import { IntervalQualitySymbolsToQualities } from './IntervalQualitySymbolsToQualities';
import { GenericIntervalsToIntervalQualities } from "./GenericIntervalsToIntervalQualities";
import { IntervalsToConsonanceDissonance } from "./IntervalsToConsonanceDissonance";
import { MajorDiatonicTriads } from "./MajorDiatonicTriads";
import { NaturalMinorDiatonicTriads } from "./NaturalMinorDiatonicTriads";
import { MajorDiatonicSeventhChords } from "./MajorDiatonicSeventhChords";
import { NaturalMinorDiatonicSeventhChords } from "./NaturalMinorDiatonicSeventhChords";
import { MelodicMinorDiatonicSeventhChords } from "./MelodicMinorDiatonicSeventhChords";
import { HarmonicMinorDiatonicSeventhChords } from "./HarmonicMinorDiatonicSeventhChords";
import { MajorScaleDegreeModes } from "./MajorScaleDegreeModes";

import './App.css';

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
    const quizLinks = this.quizNames
      .map(
        (quizName, i) => <div key={i}><a href="" onClick={event => { event.preventDefault(); this.changeQuiz(i); }}>{quizName}</a></div>,
        this
      );
    const currentQuizName = this.quizNames[this.state.currentQuizIndex];
    const quizComponent = this.quizComponents[this.state.currentQuizIndex];
    const renderedQuiz = React.createElement(quizComponent);

    return (
      <div className="App">
        {quizLinks}

        <h1>{currentQuizName}</h1>
        {renderedQuiz}
      </div>
    );
  }

  private quizNames = [
    "IntervalNamesToHalfSteps",
    "IntervalHalfStepsToNames",
    "IntervalQualitySymbolsToQualities",
    "GenericIntervalsToIntervalQualities",
    "IntervalsToConsonanceDissonance",
    "MajorDiatonicTriads",
    "NaturalMinorDiatonicTriads",
    "MajorDiatonicSeventhChords",
    "NaturalMinorDiatonicSeventhChords",
    "MelodicMinorDiatonicSeventhChords",
    "HarmonicMinorDiatonicSeventhChords",
    "MajorScaleDegreeModes"
  ];
  private quizComponents = [
    IntervalNamesToHalfSteps,
    IntervalHalfStepsToNames,
    IntervalQualitySymbolsToQualities,
    GenericIntervalsToIntervalQualities,
    IntervalsToConsonanceDissonance,
    MajorDiatonicTriads,
    NaturalMinorDiatonicTriads,
    MajorDiatonicSeventhChords,
    NaturalMinorDiatonicSeventhChords,
    MelodicMinorDiatonicSeventhChords,
    HarmonicMinorDiatonicSeventhChords,
    MajorScaleDegreeModes
  ];

  private changeQuiz(quizIndex: number) {
    this.setState({ currentQuizIndex: quizIndex });
  }
}

export default App;
