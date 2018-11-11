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

    const quizStats = new QuizStats<string>(
      this.props.quiz.questionRenderFuncs.map(x => new QuestionStats<string>(0, 0))
    );

    this.state = {
      currentQuestionIndex: this.getNextQuestionIndex(this.props.quiz, quizStats, -1),
      quizStats: quizStats
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
  
  private getNextQuestionIndex(quiz: QuizModel, quizStats: QuizStats<string>, currentQuestionIndex: number): number {
    if (quiz.questionRenderFuncs.length <= 1) {
      return 0;
    }

    const minQuestionAskedCount = Utils.min(
      quizStats.questionStats,
      qs => qs.numCorrectGuesses + qs.numIncorrectGuesses
    );
    const leastCorrectQuestionIndices = quizStats.questionStats
      .map((qs, i) => (qs.numCorrectGuesses === minQuestionAskedCount)
        ? i
        : -1
      )
      .filter(x => x >= 0);
    
    let nextQuestionIndex: number;

    do {
      const nextQuestionIndexIndex = Utils.randomInt(0, leastCorrectQuestionIndices.length - 1);
      nextQuestionIndex = leastCorrectQuestionIndices[nextQuestionIndexIndex];
    } while(nextQuestionIndex === currentQuestionIndex);

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
      currentQuestionIndex: this.getNextQuestionIndex(
        this.props.quiz, newQuizStats, this.state.currentQuestionIndex
      )
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