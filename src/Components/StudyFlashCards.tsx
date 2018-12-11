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

export interface IStudyFlashCardsProps {
  title: string;
  flashCards: FlashCard[];
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
    const flashCardCheckboxTableRows = flashCards
      .map((fc, i) => {
        const isChecked = this.state.enabledFlashCardIndices.indexOf(i) >= 0;
        const isEnabled = !isChecked || (this.state.enabledFlashCardIndices.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleFlashCardEnabled(i)} disabled={!isEnabled} /></TableCell>
            <TableCell>{renderFlashCardSide(fc.frontSide)}</TableCell>
            <TableCell>{renderFlashCardSide(fc.backSide)}</TableCell>
          </TableRow >
        );
      }, this);
    const flashCardCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Front</TableCell>
            <TableCell>Back</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {flashCardCheckboxTableRows}
        </TableBody>
      </Table>
    );
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
          {this.state.showConfiguration ? <div><div><Checkbox checked={this.state.invertFlashCards} onChange={event => this.toggleInvertFlashCards()} /> Invert Flash Cards</div>{flashCardCheckboxes}</div> : null}

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
        this.state.quizStats, newEnabledFlashCardIndices, this.state.currentFlashCardIndex
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