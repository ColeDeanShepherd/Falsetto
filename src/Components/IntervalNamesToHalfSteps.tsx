import * as React from 'react';
import * as Vex from 'vexflow';

import { Quiz } from "../Quiz";
import { Quiz as QuizComponent } from "./Quiz";

export class IntervalNamesToHalfSteps extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);

    this.sheetMusicRef = React.createRef();

    const intervalNames = [
      "Unison",
      "m2",
      "M2",
      "m3",
      "M3",
      "P4",
      "A4/d5",
      "P5",
      "m6",
      "M6",
      "m7",
      "M7",
      "P8"
    ];
    this.quiz = new Quiz(
      intervalNames.map(intervalName => (() => <span style={{ fontSize: "2em" }}>{intervalName}</span>)),
      selectAnswerIndex => {
        const intervalButtons = intervalNames.map((interval, i) => {
          const text = i;
          return <button key={i} onClick={event => selectAnswerIndex(i)}>{text}</button>;
        }, this);
        return <div>{intervalButtons}</div>;
      }
    );
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
  public render(): JSX.Element {
    return (
      <div>
        <QuizComponent quiz={this.quiz} />
        <div ref={this.sheetMusicRef} />
      </div>
    );
  }

  private sheetMusicRef: React.Ref<HTMLDivElement>;
  private quiz: Quiz;
}