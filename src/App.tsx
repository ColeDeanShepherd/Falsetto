import * as React from 'react';

import { IntervalNamesToHalfSteps } from './IntervalNamesToHalfSteps';

import './App.css';

class App extends React.Component {
  public render(): JSX.Element {
    return (
      <div className="App">
        <IntervalNamesToHalfSteps />
      </div>
    );
  }
}

export default App;
