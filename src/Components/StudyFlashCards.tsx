import * as React from 'react';
import {
  Button, Card, CardContent, Typography, Checkbox
} from '@material-ui/core';

import * as Utils from '../Utils';
import { FlashCard, invertFlashCards } from "../FlashCard";
import { renderFlashCardSide } from "./FlashCard";
import { DefaultFlashCardMultiSelect } from './DefaultFlashCardMultiSelect';
import { StudyAlgorithm, RandomStudyAlgorithm, AnswerDifficulty, isAnswerDifficultyCorrect, LeitnerStudyAlgorithm } from 'src/StudyAlgorithm';
import { CSSProperties } from 'jss/css';

export interface IStudyFlashCardsProps {
  title: string;
  flashCards: FlashCard[];
  renderFlashCardMultiSelect?: (selectedFlashCardIndices: number[], onChange: (newValue: number[]) => void) => JSX.Element;
  renderAnswerSelect?: (flashCards: FlashCard[], flashCard: FlashCard, onAnswer: (answerDifficulty: AnswerDifficulty) => void) => JSX.Element;
  enableInvertFlashCards?: boolean;
}
export interface IStudyFlashCardsState {
  currentFlashCardIndex: number;
  haveGottenCurrentFlashCardWrong: boolean;
  enabledFlashCardIndices: number[];
  showConfiguration: boolean;
  showDetailedStats: boolean;
  isShowingBackSide: boolean;
  invertFlashCards: boolean;
  invertedFlashCards: FlashCard[];
}
export class StudyFlashCards extends React.Component<IStudyFlashCardsProps, IStudyFlashCardsState> {
  public constructor(props: IStudyFlashCardsProps) {
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
    const questionStats = this.studyAlgorithm.quizStats.questionStats
      .map((qs, i) => {
        const renderedFlashCard = renderFlashCardSide(flashCards[i].frontSide);
        return <p key={i}>{renderedFlashCard} {qs.numCorrectGuesses} / {qs.numIncorrectGuesses}</p>;
      }, this);
    
    const currentFlashCard = flashCards[this.state.currentFlashCardIndex];
    const renderedFlashCardFrontSide = renderFlashCardSide(currentFlashCard.frontSide);
    const renderedFlashCardBackSide = renderFlashCardSide(currentFlashCard.backSide);

    const numGuesses = this.studyAlgorithm.quizStats.numCorrectGuesses + this.studyAlgorithm.quizStats.numIncorrectGuesses;
    const percentCorrect = (this.studyAlgorithm.quizStats.numIncorrectGuesses !== 0)
      ? (this.studyAlgorithm.quizStats.numCorrectGuesses / numGuesses)
      : 1;
    
    const boundOnAnswer = this.onAnswer.bind(this);
    const renderAnswerSelect = (this.props.renderAnswerSelect)
      ? this.props.renderAnswerSelect
      : this.defaultRenderAnswerSelect.bind(this);
    
    const flashCardContainerStyle: any = {
      fontSize: "2em",
      textAlign: "center",
      padding: "1em 0",
      height: "240px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    };

    return (
      <Card>
        <CardContent>
          <Typography gutterBottom={true} variant="h5" component="h2">
            {this.props.title}{this.state.invertFlashCards ? " (Inverted)" : ""}
          </Typography>

          <Button variant="contained" onClick={event => this.toggleConfiguration()}>Configuration</Button>
          {this.state.showConfiguration ? (
            <div>
              {this.props.enableInvertFlashCards ? <div><Checkbox checked={this.state.invertFlashCards} onChange={event => this.toggleInvertFlashCards()} /> Invert Flash Cards</div> : null}
              {false ? <p>{flashCards.length} Flash Cards</p> : null}
              {this.renderFlashCardMultiSelect(flashCards)}
            </div>
          ) : null}

          <p>
            <span style={{paddingRight: "2em"}}>{this.studyAlgorithm.quizStats.numCorrectGuesses} / {this.studyAlgorithm.quizStats.numIncorrectGuesses}</span>
            <span style={{paddingRight: "2em"}}>{(100 * percentCorrect).toFixed(2)}%</span>
          </p>

          {this.state.showDetailedStats ? questionStats : null}

          <div
            style={flashCardContainerStyle}
          >
            {!this.state.isShowingBackSide ? renderedFlashCardFrontSide : renderedFlashCardBackSide}
          </div>

          <div style={{marginBottom: "1em"}}>
            <Button
              onClick={event => this.flipFlashCard()}
              variant="contained"
            >
              Flip to {this.state.isShowingBackSide ? "Front" : "Back"}
            </Button>
            <Button
              onClick={event => this.moveToNextFlashCard()}
              variant="contained"
            >
              Skip
            </Button>
          </div>

          {renderAnswerSelect(flashCards, currentFlashCard, boundOnAnswer)}
        </CardContent>
      </Card>
    );
  }

  private studyAlgorithm: StudyAlgorithm = new LeitnerStudyAlgorithm(5);

  private defaultRenderAnswerSelect (flashCards: FlashCard[], flashCard: FlashCard, onAnswer: (answerDifficulty: AnswerDifficulty) => void): JSX.Element | null {
    return null;
  };
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
    this.studyAlgorithm.reset(this.props.flashCards);

    return {
      currentFlashCardIndex: this.studyAlgorithm.getNextFlashCardIndex(),
      haveGottenCurrentFlashCardWrong: false,
      enabledFlashCardIndices: this.studyAlgorithm.enabledFlashCardIndices
    };
  }

  private onAnswer(answerDifficulty: AnswerDifficulty) {
    if (!this.state.haveGottenCurrentFlashCardWrong) {
      this.studyAlgorithm.onAnswer(answerDifficulty);
    }

    if (isAnswerDifficultyCorrect(answerDifficulty)) {
      this.moveToNextFlashCard();
    } else {
      this.setState({ haveGottenCurrentFlashCardWrong: true });
    }
  }

  private toggleConfiguration() {
    this.setState({ showConfiguration: !this.state.showConfiguration });
  }
  private onEnabledFlashCardIndicesChange(newValue: number[]) {
    this.studyAlgorithm.enabledFlashCardIndices = newValue;

    const stateDelta: any = { enabledFlashCardIndices: newValue };
    const onStateChanged = !Utils.arrayContains(newValue, this.state.currentFlashCardIndex)
      ? () => this.moveToNextFlashCard()
      : undefined;

    this.setState(stateDelta, onStateChanged);
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
    this.onAnswer(AnswerDifficulty.Incorrect);
    this.setState({ isShowingBackSide: !this.state.isShowingBackSide });
  }
  private moveToNextFlashCard() {
    this.setState({
      currentFlashCardIndex: this.studyAlgorithm.getNextFlashCardIndex(),
      haveGottenCurrentFlashCardWrong: false,
      isShowingBackSide: false
    });
  }
}