import * as React from 'react';
import {
  Button, Card, CardContent, Typography, Checkbox
} from '@material-ui/core';

import * as Utils from '../Utils';
import { FlashCard, invertFlashCards } from "../FlashCard";
import { renderFlashCardSide } from "./FlashCard";
import { DefaultFlashCardMultiSelect } from './DefaultFlashCardMultiSelect';
import { StudyAlgorithm, AnswerDifficulty, isAnswerDifficultyCorrect, LeitnerStudyAlgorithm } from 'src/StudyAlgorithm';

export interface IStudyFlashCardsProps {
  title: string;
  flashCards: FlashCard[];
  initialSelectedFlashCardIndices?: number[];
  initialConfigData: any;
  renderFlashCardMultiSelect?: (
    selectedFlashCardIndices: number[],
    configData: any,
    onChange: (newValue: number[], newConfigData: any) => void
  ) => JSX.Element;
  renderAnswerSelect?: (
    flashCards: FlashCard[],
    enabledFlashCardIndices: number[],
    areFlashCardsInverted: boolean,
    flashCard: FlashCard,
    onAnswer: (answerDifficulty: AnswerDifficulty) => void
  ) => JSX.Element;
  enableInvertFlashCards?: boolean;
}
export interface IStudyFlashCardsState {
  currentFlashCardIndex: number;
  haveGottenCurrentFlashCardWrong: boolean;
  configData: any;
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

    if (this.props.initialConfigData && !this.props.initialSelectedFlashCardIndices) {
      Utils.assert(false);
    }

    this.state = Object.assign(
      {
        showConfiguration: false,
        showDetailedStats: false,
        isShowingBackSide: false,
        invertFlashCards: false,
        invertedFlashCards: [],
        configData: props.initialConfigData
      },
      this.getInitialStateForFlashCards(
        this.props.flashCards,
        this.props.initialSelectedFlashCardIndices
      )
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
          <div style={{display: "flex"}}>
            <Typography gutterBottom={true} variant="h5" component="h2" style={{flexGrow: 1}}>
              {this.props.title}{this.state.invertFlashCards ? " (Inverted)" : ""}
            </Typography>
            
            <Button variant="contained" onClick={event => this.toggleConfiguration()}>{!this.state.showConfiguration ? "Show" : "Hide"} Configuration</Button>
          </div>

          {this.state.showConfiguration ? (
            <div>
              {this.props.enableInvertFlashCards ? <div><Checkbox checked={this.state.invertFlashCards} onChange={event => this.toggleInvertFlashCards()} /> Invert Flash Cards</div> : null}
              {false ? <p>{flashCards.length} Flash Cards</p> : null}
              {this.renderFlashCardMultiSelect(flashCards)}
            </div>
          ) : null}

          {this.props.renderAnswerSelect
            ? (
              <p>
                <span style={{paddingRight: "2em"}}>{this.studyAlgorithm.quizStats.numCorrectGuesses} / {this.studyAlgorithm.quizStats.numIncorrectGuesses}</span>
                <span style={{paddingRight: "2em"}}>{(100 * percentCorrect).toFixed(2)}%</span>
              </p>
            )
            : null
          }

          {this.state.showDetailedStats ? questionStats : null}

          <div
            style={flashCardContainerStyle}
          >
            {!this.state.isShowingBackSide ? renderedFlashCardFrontSide : renderedFlashCardBackSide}
          </div>

          <div style={{textAlign: "center"}}>
            {this.props.renderAnswerSelect ? this.props.renderAnswerSelect(flashCards, this.state.enabledFlashCardIndices, this.state.invertFlashCards, currentFlashCard, boundOnAnswer) : null}

            <div style={{marginTop: "1em"}}>
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
                {!this.props.renderAnswerSelect ? "Next" : "Skip"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  private studyAlgorithm: StudyAlgorithm = new LeitnerStudyAlgorithm(5);

  private renderFlashCardMultiSelect(flashCards: FlashCard[]): JSX.Element {
    const onEnabledFlashCardIndicesChange = this.onEnabledFlashCardIndicesChange.bind(this);

    return this.props.renderFlashCardMultiSelect
      ? this.props.renderFlashCardMultiSelect(
        this.state.enabledFlashCardIndices, this.state.configData, onEnabledFlashCardIndicesChange
      )
      : <DefaultFlashCardMultiSelect
          flashCards={flashCards}
          configData={this.state.configData}
          selectedFlashCardIndices={this.state.enabledFlashCardIndices}
          onChange={onEnabledFlashCardIndicesChange}
        />;
  }
  
  private getInitialStateForFlashCards(
    flashCards: FlashCard[],
    enabledQuestionIds: Array<number> | undefined
  ) {
    this.studyAlgorithm.reset(flashCards.map((_, i) => i));

    if (enabledQuestionIds) {
      this.studyAlgorithm.enabledQuestionIds = enabledQuestionIds;
    }
    
    return {
      currentFlashCardIndex: this.studyAlgorithm.getNextQuestionId(),
      haveGottenCurrentFlashCardWrong: false,
      enabledFlashCardIndices: this.studyAlgorithm.enabledQuestionIds
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
  private onEnabledFlashCardIndicesChange(newValue: number[], newConfigData: any) {
    this.studyAlgorithm.enabledQuestionIds = newValue;

    const stateDelta: any = { enabledFlashCardIndices: newValue, configData: newConfigData };
    const onStateChanged = !Utils.arrayContains(newValue, this.state.currentFlashCardIndex)
      ? () => this.moveToNextFlashCard()
      : undefined;

    this.setState(stateDelta, onStateChanged);
  }
  private toggleInvertFlashCards() {
    const newInvertFlashCards = !this.state.invertFlashCards;
    let newFlashCards: Array<FlashCard>;
    let newEnabledQuestionIds: Array<number> | undefined;

    if (!newInvertFlashCards) {
      newFlashCards = this.props.flashCards;
      newEnabledQuestionIds = this.props.initialSelectedFlashCardIndices;
    } else {
      const inversion = invertFlashCards(this.props.flashCards, this.state.enabledFlashCardIndices);
      newFlashCards = inversion.invertedFlashCards;
      newEnabledQuestionIds = inversion.invertedEnabledFlashCardIndices;
    }

    this.setState(Object.assign(
      {
        invertFlashCards: newInvertFlashCards,
        invertedFlashCards: newFlashCards
      },
      this.getInitialStateForFlashCards(newFlashCards, newEnabledQuestionIds)
    ));
  }

  private flipFlashCard() {
    this.onAnswer(AnswerDifficulty.Incorrect);
    this.setState({ isShowingBackSide: !this.state.isShowingBackSide });
  }
  private moveToNextFlashCard() {
    this.setState({
      currentFlashCardIndex: this.studyAlgorithm.getNextQuestionId(),
      haveGottenCurrentFlashCardWrong: false,
      isShowingBackSide: false
    });
  }
}