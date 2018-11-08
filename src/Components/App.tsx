import * as React from 'react';

import { IntervalNamesToHalfSteps } from './IntervalNamesToHalfSteps';
import { IntervalHalfStepsToNames } from './IntervalHalfStepsToNames';
import { IntervalQualitySymbolsToQualities } from './IntervalQualitySymbolsToQualities';
import { GenericIntervalsToIntervalQualities } from "./GenericIntervalsToIntervalQualities";

import './App.css';

class App extends React.Component {
  public render(): JSX.Element {
    return (
      <div className="App">
        <IntervalNamesToHalfSteps />
        <IntervalHalfStepsToNames />
        <IntervalQualitySymbolsToQualities />
        <GenericIntervalsToIntervalQualities />
      </div>
    );
  }
}

export default App;
