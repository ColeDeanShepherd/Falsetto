import * as React from 'react';

import { IntervalNamesToHalfSteps } from './IntervalNamesToHalfSteps';
import { IntervalHalfStepsToNames } from './IntervalHalfStepsToNames';

import './App.css';

class App extends React.Component {
  public render(): JSX.Element {
    return (
      <div className="App">
        <IntervalNamesToHalfSteps />
        <IntervalHalfStepsToNames />
      </div>
    );
  }
}

export default App;
