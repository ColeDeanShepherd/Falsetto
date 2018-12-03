import * as React from 'react';
import * as clone from 'clone';
import { Button, Card, CardContent, Typography, Checkbox } from '@material-ui/core';

import * as Utils from '../Utils';
import { FlashCard, FlashCardSide } from "../FlashCard";
import { FlashCardGroup } from "../FlashCardGroup";
import { QuizStats } from "../QuizStats";
import { QuestionStats } from "../QuestionStats";

export interface IStudyFlashCardsProps {
  flashCardGroup: FlashCardGroup;
}
export interface IStudyFlashCardsState {
  currentFlashCardIndex: number;
  quizStats: QuizStats<string>;
  enabledFlashCardIndices: number[];
  showDetailedStats: boolean;
  isShowingAnswer: boolean;
}
export class StudyFlashCards extends React.Component<IStudyFlashCardsProps, IStudyFlashCardsState> {
  constructor(props: IStudyFlashCardsProps) {
    super(props);

    const quizStats = new QuizStats<string>(
      this.props.flashCardGroup.flashCards.map(_ => new QuestionStats<string>(0, 0))
    );
    const enabledFlashCardIndices = this.props.flashCardGroup.flashCards.map((_, i) => i);

    this.state = {
      currentFlashCardIndex: this.getNextFlashCardIndex(this.props.flashCardGroup, quizStats, enabledFlashCardIndices, -1),
      quizStats: quizStats,
      enabledFlashCardIndices: enabledFlashCardIndices,
      showDetailedStats: false,
      isShowingAnswer: false
    };
  }

  public render(): JSX.Element {
    const renderFlashCardSide = (flashCardSide: FlashCardSide): JSX.Element => {
      if (typeof(flashCardSide) === 'string') {
        return <span>{flashCardSide}</span>;
      } else {
        return flashCardSide();
      }
    }

    const flashCardCheckboxes = this.props.flashCardGroup.flashCards
      .map((fc, i) => {
        const isChecked = this.state.enabledFlashCardIndices.indexOf(i) >= 0;
        const isEnabled = !isChecked || (this.state.enabledFlashCardIndices.length > 1);

        return (
          <div key={i}>
            <Checkbox checked={isChecked} onChange={event => this.toggleFlashCardEnabled(i)} disabled={!isEnabled} />{renderFlashCardSide(fc.frontSide)}
          </div>
        );
      }, this);
    const questionStats = this.state.quizStats.questionStats
      .map((qs, i) => {
        const renderedFlashCard = renderFlashCardSide(this.props.flashCardGroup.flashCards[i].frontSide);
        return <p key={i}>{renderedFlashCard} {qs.numCorrectGuesses} / {qs.numIncorrectGuesses}</p>;
      }, this);
    
    const renderedCurrentFlashCard = renderFlashCardSide(this.props.flashCardGroup.flashCards[this.state.currentFlashCardIndex].frontSide);
    const renderedCurrentAnswer = renderFlashCardSide(this.props.flashCardGroup.flashCards[this.state.currentFlashCardIndex].backSide);

    const numGuesses = this.state.quizStats.numCorrectGuesses + this.state.quizStats.numIncorrectGuesses;
    const percentCorrect = (this.state.quizStats.numIncorrectGuesses !== 0)
      ? (this.state.quizStats.numCorrectGuesses / numGuesses)
      : 1;

    return (
      <Card>
        <CardContent>
          <Typography gutterBottom={true} variant="h5" component="h2">
            {this.props.flashCardGroup.name}
          </Typography>

          <div>{flashCardCheckboxes}</div>

          <p>
            <span style={{paddingRight: "2em"}}>{this.state.quizStats.numCorrectGuesses} / {this.state.quizStats.numIncorrectGuesses}</span>
            <span style={{paddingRight: "2em"}}>{(100 * percentCorrect).toFixed(2)}%</span>
          </p>

          {this.state.showDetailedStats ? questionStats : null}

          <div style={{fontSize: "2em", textAlign: "center", padding: "1em 0"}}>{!this.state.isShowingAnswer ? renderedCurrentFlashCard : renderedCurrentAnswer}</div>

          <Button onClick={event => this.flipFlashCard()}>Flip</Button>
          <Button onClick={event => this.moveToNextFlashCard()}>Next</Button>
        </CardContent>
      </Card>
    );
  }
  
  private getNextFlashCardIndex(
    flashCardGroup: FlashCardGroup,
    quizStats: QuizStats<string>,
    enabledFlashCardIndices: number[],
    currentFlashCardIndex: number
  ): number {
    if (enabledFlashCardIndices.length <= 1) {
      return 0;
    }

    const enabledFlashCardStats = quizStats.questionStats
      .filter((_, i) => enabledFlashCardIndices.indexOf(i) >= 0);
    const minFlashCardAskedCount = Utils.min(
      enabledFlashCardStats,
      qs => qs.numCorrectGuesses + qs.numIncorrectGuesses
    );
    let leastCorrectFlashCardIndices = enabledFlashCardStats
      .map((qs, i) => (qs.numCorrectGuesses === minFlashCardAskedCount)
        ? i
        : -1
      )
      .filter(x => x >= 0);
    
    if ((leastCorrectFlashCardIndices.length === 1) && (leastCorrectFlashCardIndices[0] === currentFlashCardIndex)) {
      leastCorrectFlashCardIndices = enabledFlashCardStats.map((_, i) => i);
    }
    
    let nextFlashCardIndex: number;

    do {
      const nextFlashCardIndexIndex = Utils.randomInt(0, leastCorrectFlashCardIndices.length - 1);
      nextFlashCardIndex = leastCorrectFlashCardIndices[nextFlashCardIndexIndex];
    } while(nextFlashCardIndex === currentFlashCardIndex);

    return nextFlashCardIndex;
  }

  private onAnswerCorrect() {
    const newQuizStats = clone(this.state.quizStats);

    const questionStats = newQuizStats.questionStats[this.state.currentFlashCardIndex];
    questionStats.numCorrectGuesses++;

    this.setState({
      quizStats: newQuizStats,
      currentFlashCardIndex: this.getNextFlashCardIndex(
        this.props.flashCardGroup, newQuizStats, this.state.enabledFlashCardIndices, this.state.currentFlashCardIndex
      )
    });
  }
  private onAnswerIncorrect() {
    const newQuizStats = clone(this.state.quizStats);

    const questionStats = newQuizStats.questionStats[this.state.currentFlashCardIndex];
    questionStats.numIncorrectGuesses++;

    this.setState({
      quizStats: newQuizStats
    });
  }

  private toggleFlashCardEnabled(questionIndex: number) {
    const newEnabledFlashCardIndices = this.state.enabledFlashCardIndices.slice();
    const i = newEnabledFlashCardIndices.indexOf(questionIndex);
    const wasFlashCardEnabled = i >= 0;

    if (!wasFlashCardEnabled) {
      newEnabledFlashCardIndices.push(questionIndex);
    } else if (this.state.enabledFlashCardIndices.length > 1) {
      newEnabledFlashCardIndices.splice(i, 1);
    }

    const stateDelta: any = { enabledFlashCardIndices: newEnabledFlashCardIndices };
    if (wasFlashCardEnabled && (this.state.currentFlashCardIndex === questionIndex)) {
      stateDelta.currentFlashCardIndex = this.getNextFlashCardIndex(
        this.props.flashCardGroup, this.state.quizStats, newEnabledFlashCardIndices, this.state.currentFlashCardIndex
      );
    }

    this.setState(stateDelta);
  }

  private flipFlashCard() {
    this.setState({ isShowingAnswer: !this.state.isShowingAnswer });
  }
  private moveToNextFlashCard() {
    this.setState({
      currentFlashCardIndex: this.getNextFlashCardIndex(
        this.props.flashCardGroup, this.state.quizStats, this.state.enabledFlashCardIndices, this.state.currentFlashCardIndex
      ),
      isShowingAnswer: false
    });
  }
}