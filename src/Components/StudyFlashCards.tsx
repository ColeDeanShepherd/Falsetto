import * as React from 'react';
import * as clone from 'clone';
import {
  Button, Card, CardContent, Typography, Checkbox, Table,
  TableHead, TableBody, TableRow, TableCell
} from '@material-ui/core';

import * as Utils from '../Utils';
import { FlashCard, FlashCardSide, invertFlashCards } from "../FlashCard";
import { renderFlashCardSide } from "./FlashCard";
import { QuizStats } from "../QuizStats";
import { QuestionStats } from "../QuestionStats";
import { DefaultFlashCardMultiSelect } from './DefaultFlashCardMultiSelect';

export interface IStudyFlashCardsProps {
  title: string;
  flashCards: FlashCard[];
  renderFlashCardMultiSelect?: (selectedFlashCardIndices: number[], onChange: (newValue: number[]) => void) => JSX.Element;
  enableInvertFlashCards?: boolean;
}
export interface IStudyFlashCardsState {
  currentFlashCardIndex: number;
  quizStats: QuizStats<string>;
  enabledFlashCardIndices: number[];
  showConfiguration: boolean;
  showDetailedStats: boolean;
  isShowingBackSide: boolean;
  invertFlashCards: boolean;
  invertedFlashCards: FlashCard[];
}
export class StudyFlashCards extends React.Component<IStudyFlashCardsProps, IStudyFlashCardsState> {
  constructor(props: IStudyFlashCardsProps) {
    super(props);

    this.state = Object.assign(
      {
        showConfiguration: false,
        showDetailedStats: false,
        isShowingBackSide: false,
        invertFlashCards: false,
        invertedFlashCards: []
      },
      this.getInitialStateForFlashCards(this.props.flashCards)
    );
  }

  public render(): JSX.Element {
    const flashCards = !this.state.invertFlashCards ? this.props.flashCards : this.state.invertedFlashCards;
    const questionStats = this.state.quizStats.questionStats
      .map((qs, i) => {
        const renderedFlashCard = renderFlashCardSide(flashCards[i].frontSide);
        return <p key={i}>{renderedFlashCard} {qs.numCorrectGuesses} / {qs.numIncorrectGuesses}</p>;
      }, this);
    
    const renderedFlashCardFrontSide = renderFlashCardSide(flashCards[this.state.currentFlashCardIndex].frontSide);
    const renderedFlashCardBackSide = renderFlashCardSide(flashCards[this.state.currentFlashCardIndex].backSide);

    const numGuesses = this.state.quizStats.numCorrectGuesses + this.state.quizStats.numIncorrectGuesses;
    const percentCorrect = (this.state.quizStats.numIncorrectGuesses !== 0)
      ? (this.state.quizStats.numCorrectGuesses / numGuesses)
      : 1;

    return (
      <Card>
        <CardContent>
          <Typography gutterBottom={true} variant="h5" component="h2">
            {this.props.title}{this.state.invertFlashCards ? " (Inverted)" : ""}
          </Typography>

          <Button onClick={event => this.toggleConfiguration()}>Configuration</Button>
          {this.state.showConfiguration ? (
            <div>
              {this.props.enableInvertFlashCards ? <div><Checkbox checked={this.state.invertFlashCards} onChange={event => this.toggleInvertFlashCards()} /> Invert Flash Cards</div> : null}
              <p>{flashCards.length} Flash Cards</p>
              {this.renderFlashCardMultiSelect(flashCards)}
            </div>
          ) : null}

          <p>
            <span style={{paddingRight: "2em"}}>{this.state.quizStats.numCorrectGuesses} / {this.state.quizStats.numIncorrectGuesses}</span>
            <span style={{paddingRight: "2em"}}>{(100 * percentCorrect).toFixed(2)}%</span>
          </p>

          {this.state.showDetailedStats ? questionStats : null}

          <div style={{fontSize: "2em", textAlign: "center", padding: "1em 0"}}>{!this.state.isShowingBackSide ? renderedFlashCardFrontSide : renderedFlashCardBackSide}</div>

          <Button onClick={event => this.flipFlashCard()}>Flip to {this.state.isShowingBackSide ? "Front" : "Back"}</Button>
          <Button onClick={event => this.moveToNextFlashCard()}>Next</Button>
        </CardContent>
      </Card>
    );
  }
  private renderFlashCardMultiSelect(flashCards: FlashCard[]): JSX.Element {
    const onEnabledFlashCardIndicesChange = this.onEnabledFlashCardIndicesChange.bind(this);

    return this.props.renderFlashCardMultiSelect
      ? this.props.renderFlashCardMultiSelect(this.state.enabledFlashCardIndices, onEnabledFlashCardIndicesChange)
      : <DefaultFlashCardMultiSelect
          flashCards={flashCards}
          selectedFlashCardIndices={this.state.enabledFlashCardIndices}
          onChange={onEnabledFlashCardIndicesChange}
        />;
  }
  
  private getInitialStateForFlashCards(flashCards: FlashCard[]) {
    const quizStats = new QuizStats<string>(
      flashCards.map(_ => new QuestionStats<string>(0, 0))
    );
    const enabledFlashCardIndices = flashCards.map((_, i) => i);

    return {
      currentFlashCardIndex: this.getNextFlashCardIndex(quizStats, enabledFlashCardIndices, -1),
      quizStats: quizStats,
      enabledFlashCardIndices: enabledFlashCardIndices
    };
  }
  private getNextFlashCardIndex(
    quizStats: QuizStats<string>,
    enabledFlashCardIndices: number[],
    currentFlashCardIndex: number
  ): number {
    if (enabledFlashCardIndices.length <= 1) {
      return 0;
    }

    const enabledFlashCardStats = quizStats.questionStats
      .filter((_, i) => Utils.arrayContains(enabledFlashCardIndices, i));
    const minFlashCardAskedCount = Utils.min(
      enabledFlashCardStats,
      qs => qs.numCorrectGuesses + qs.numIncorrectGuesses
    );
    let leastCorrectFlashCardIndices = quizStats.questionStats
      .map((qs, i) => (qs.numCorrectGuesses === minFlashCardAskedCount) && Utils.arrayContains(enabledFlashCardIndices, i)
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
        newQuizStats, this.state.enabledFlashCardIndices, this.state.currentFlashCardIndex
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

  private toggleConfiguration() {
    this.setState({ showConfiguration: !this.state.showConfiguration });
  }
  private onEnabledFlashCardIndicesChange(newValue: number[]) {
    const stateDelta: any = { enabledFlashCardIndices: newValue };

    if (newValue.indexOf(this.state.currentFlashCardIndex) < 0) {
      stateDelta.currentFlashCardIndex = this.getNextFlashCardIndex(
        this.state.quizStats, newValue, this.state.currentFlashCardIndex
      );
    }

    this.setState(stateDelta);
  }
  private toggleInvertFlashCards() {
    const newInvertFlashCards = !this.state.invertFlashCards;
    const newInvertedFlashCards = newInvertFlashCards
      ? invertFlashCards(this.props.flashCards)
      : [];
    const newFlashCards = !newInvertFlashCards
      ? this.props.flashCards
      : newInvertedFlashCards;
    this.setState(Object.assign(
      {
        invertFlashCards: newInvertFlashCards,
        invertedFlashCards: newInvertedFlashCards
      },
      this.getInitialStateForFlashCards(newFlashCards)
    ));
  }

  private flipFlashCard() {
    this.setState({ isShowingBackSide: !this.state.isShowingBackSide });
  }
  private moveToNextFlashCard() {
    this.setState({
      currentFlashCardIndex: this.getNextFlashCardIndex(
        this.state.quizStats, this.state.enabledFlashCardIndices, this.state.currentFlashCardIndex
      ),
      isShowingBackSide: false
    });
  }
}