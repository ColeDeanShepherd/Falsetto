import * as React from 'react';

import { IntervalNamesAndSymbols } from './IntervalNamesAndSymbols';

import './App.css';

class App extends React.Component {
  public render(): JSX.Element {
    return (
      <div className="App">
        <IntervalNamesAndSymbols />
      </div>
    );
  }
}

export default App;
