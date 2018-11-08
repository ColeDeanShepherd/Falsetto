import * as React from 'react';
import * as clone from 'clone';

import * as Utils from '../Utils';
import { Quiz as QuizModel } from "../Quiz";
import { QuizStats } from "../QuizStats";
import { QuestionStats } from "../QuestionStats";

export interface IQuizProps {
  quiz: QuizModel;
}
export interface IQuizState {
  currentQuestionIndex: number;
  quizStats: QuizStats<string>
}
export class Quiz extends React.Component<IQuizProps, IQuizState> {
  constructor(props: IQuizProps) {
    super(props);

    this.state = {
      currentQuestionIndex: this.getNextQuestionIndex(),
      quizStats: new QuizStats<string>(
        this.props.quiz.questionRenderFuncs.map(x => new QuestionStats<string>(0, 0))
      )
    };
  }

  public render(): JSX.Element {
    const questionStats = this.state.quizStats.questionStats
      .map((qs, i) => {
        const renderedQuestion = this.props.quiz.questionRenderFuncs[i]();
        return <p key={i}>{renderedQuestion} {qs.numCorrectGuesses} / {qs.numIncorrectGuesses}</p>;
      });

    const renderedCurrentQuestion = this.props.quiz.questionRenderFuncs[this.state.currentQuestionIndex]();
    const renderedAnswers = this.props.quiz.answersRenderFunc(this.guessAnswer.bind(this));

    const numGuesses = this.state.quizStats.numCorrectGuesses + this.state.quizStats.numIncorrectGuesses;
    const percentCorrect = (this.state.quizStats.numIncorrectGuesses !== 0)
      ? (this.state.quizStats.numCorrectGuesses / numGuesses)
      : 1;

    return (
      <div>
        <p>Correct: {this.state.quizStats.numCorrectGuesses}</p>
        <p>Incorrect: {this.state.quizStats.numIncorrectGuesses}</p>
        <p>% Correct: {(100 * percentCorrect).toFixed(2)}%</p>
        {questionStats}

        <div>{renderedCurrentQuestion}</div>
        {renderedAnswers}
      </div>
    );
  }
  
  private getNextQuestionIndex(): number {
    if (this.props.quiz.questionRenderFuncs.length <= 1) {
      return 0;
    }

    let nextQuestionIndex: number;

    do {
      nextQuestionIndex = Utils.randomInt(0, this.props.quiz.questionRenderFuncs.length - 1);
    } while(this.state && (nextQuestionIndex === this.state.currentQuestionIndex));

    return nextQuestionIndex;
  }

  private guessAnswer(answerIndex: number) {
    const correctAnswerIndex = this.props.quiz.questionAnswerIndices[this.state.currentQuestionIndex];
    const isAnswerCorrect = answerIndex === correctAnswerIndex;
    if (isAnswerCorrect) {
      this.onAnswerCorrect();
    } else {
      this.onAnswerIncorrect();
    }
  }
  private onAnswerCorrect() {
    const newQuizStats = clone(this.state.quizStats);

    const questionStats = newQuizStats.questionStats[this.state.currentQuestionIndex];
    questionStats.numCorrectGuesses++;

    this.setState({
      quizStats: newQuizStats,
      currentQuestionIndex: this.getNextQuestionIndex()
    });
  }
  private onAnswerIncorrect() {
    const newQuizStats = clone(this.state.quizStats);

    const questionStats = newQuizStats.questionStats[this.state.currentQuestionIndex];
    questionStats.numIncorrectGuesses++;

    this.setState({
      quizStats: newQuizStats
    });
  }
}