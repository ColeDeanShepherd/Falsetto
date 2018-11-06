import * as React from 'react';
import './App.css';

import * as Vex from 'vexflow';

class App extends React.Component {
  private sheetMusicRef: React.Ref<HTMLDivElement>;
  
  constructor(props: {}) {
    super(props);
    this.sheetMusicRef = React.createRef();
  }

  public componentDidMount() {
    // Create an SVG renderer and attach it to the DIV element named "boo".
    const div = (this.sheetMusicRef as any).current;
    if (!div) {
      return;
    }

    const renderer = new Vex.Flow.Renderer(div, Vex.Flow.Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(500, 500);
    const context = renderer.getContext();
    context.setFont("Arial", 10).setBackgroundFillStyle("#eed");

    // Create a stave of width 400 at position 10, 40 on the canvas.
    const stave = new Vex.Flow.Stave(10, 40, 400);

    // Add a clef and time signature.
    stave.addClef("treble").addTimeSignature("4/4");

    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();
  }
  public render() {
    return (
      <div className="App">
        <div ref={this.sheetMusicRef} />
      </div>
    );
  }
}

export default App;
