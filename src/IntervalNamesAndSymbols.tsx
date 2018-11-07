import * as React from 'react';
import * as Vex from 'vexflow';
import * as clone from 'clone';

import * as Utils from './Utils';

enum Mode {
  GuessNames,
  GuessNumHalfSteps
}

class AnswerStats<T> {
  public constructor(
    public answer: T,
    public numCorrectGuesses: number,
    public numIncorrectGuesses: number
  ) {}
}
class QuizStats<T> {
  public constructor(
    public answersStats: Array<AnswerStats<T>>
  ) {}
  
  public get numCorrectGuesses(): number {
    return Utils.sumNumbers(this.answersStats.map(x => x.numCorrectGuesses));
  }
  public get numIncorrectGuesses(): number {
    return Utils.sumNumbers(this.answersStats.map(x => x.numIncorrectGuesses));
  }
}

export interface IntervalNamesAndSymbolsState {
  currentMode: Mode;
  currentIntervalHalfSteps: number;
  quizStats: QuizStats<number>
}
export class IntervalNamesAndSymbols extends React.Component<{}, IntervalNamesAndSymbolsState> {
  constructor(props: {}) {
    super(props);

    this.sheetMusicRef = React.createRef();

    this.state = {
      currentMode: Mode.GuessNumHalfSteps,
      currentIntervalHalfSteps: this.generateNewRandomIntervalHalfSteps(),
      quizStats: new QuizStats<number>(
        this.intervalNames
          .map((name, i) => new AnswerStats<number>(i, 0, 0))
      )
    };
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
    const modeButtons = Utils.getNonConstEnumValues(Mode).map(mode =>
      <span key={mode}><input type="radio" name="mode" value={mode} checked={this.state.currentMode === mode} onClick={event => this.changeMode(mode)} /> {Mode[mode]}</span>
    , this);

    const answerStats = this.state.quizStats.answersStats
      .map(a => <p key={a.answer}>{a.answer} {a.numCorrectGuesses} / {a.numIncorrectGuesses}</p>);

    const questionText = (this.state.currentMode === Mode.GuessNames)
      ? this.state.currentIntervalHalfSteps
      : this.intervalNames[this.state.currentIntervalHalfSteps];
    const intervalButtons = this.intervalNames.map((interval, i) => {
      const text = (this.state.currentMode === Mode.GuessNames) ? interval : i;
      return <button key={i} onClick={event => this.guessInterval(i)}>{text}</button>;
    }, this);

    const numGuesses = this.state.quizStats.numCorrectGuesses + this.state.quizStats.numIncorrectGuesses;
    const percentCorrect = (this.state.quizStats.numIncorrectGuesses !== 0)
      ? (this.state.quizStats.numCorrectGuesses / numGuesses)
      : 1;

    return (
      <div>
        {modeButtons}
        <p>Correct: {this.state.quizStats.numCorrectGuesses}</p>
        <p>Incorrect: {this.state.quizStats.numIncorrectGuesses}</p>
        <p>% Correct: {(100 * percentCorrect).toFixed(2)}%</p>
        {answerStats}

        <p style={{ fontSize: "2em" }}>{questionText}</p>
        {intervalButtons}
        <div ref={this.sheetMusicRef} />
      </div>
    );
  }
  
  private generateNewRandomIntervalHalfSteps(): number {
    let halfSteps: number;

    do {
      halfSteps = Utils.randomInt(0, this.intervalNames.length - 1);
    } while(this.state && (halfSteps === this.state.currentIntervalHalfSteps));

    return halfSteps;
  }

  private changeMode(value: Mode) {
    this.setState({ currentMode: value });
  }
  private guessInterval(halfSteps: number) {
    if (halfSteps === this.state.currentIntervalHalfSteps) {
      this.onAnswerCorrect(halfSteps);
    } else {
      this.onAnswerIncorrect(halfSteps);
    }
  }
  private onAnswerCorrect(answer: number) {
    const newQuizStats = clone(this.state.quizStats);

    const answerStats = newQuizStats.answersStats
      .find(a => a.answer === answer);
    if (!answerStats) { return; }
    answerStats.numCorrectGuesses++;

    this.setState({
      quizStats: newQuizStats,
      currentIntervalHalfSteps: this.generateNewRandomIntervalHalfSteps()
    });
  }
  private onAnswerIncorrect(answer: number) {
    const newQuizStats = clone(this.state.quizStats);

    const answerStats = newQuizStats.answersStats
      .find(a => a.answer === answer);
    if (!answerStats) { return; }
    answerStats.numIncorrectGuesses++;

    this.setState({
      quizStats: newQuizStats
    });
  }

  private sheetMusicRef: React.Ref<HTMLDivElement>;
  private intervalNames = [
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
}