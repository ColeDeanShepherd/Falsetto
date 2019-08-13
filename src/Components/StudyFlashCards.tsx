import * as React from "react";
import {
  Button, Card, CardContent, Typography, Checkbox, Paper
} from "@material-ui/core";
import ResizeObserver from "resize-observer-polyfill";

import * as Utils from "../Utils";
import * as Analytics from "../Analytics";
import { FlashCard, invertFlashCards } from "../FlashCard";
import { renderFlashCardSide } from "./FlashCard";
import { DefaultFlashCardMultiSelect } from "./Utils/DefaultFlashCardMultiSelect";
import { StudyAlgorithm, AnswerDifficulty, isAnswerDifficultyCorrect, LeitnerStudyAlgorithm } from "../StudyAlgorithm";
import { RenderAnswerSelectFunc, RenderFlashCardMultiSelectFunc, CustomNextFlashCardIdFilter, FlashCardSet, RenderAnswerSelectArgs, FlashCardLevel } from '../FlashCardSet';
import { MAX_MAIN_CARD_WIDTH } from './Style';
import { QuizStats } from '../QuizStats';

export function createStudyFlashCardSetComponent(
  flashCardSet: FlashCardSet, isEmbedded: boolean, hideMoreInfoUri: boolean,
  title?: string, style?: any, enableSettings?: boolean
): JSX.Element {
  const flashCards = flashCardSet.createFlashCards();
  const flashCardLevels = (flashCardSet.createFlashCardLevels !== undefined)
    ? flashCardSet.createFlashCardLevels(flashCardSet, flashCards)
    : [];

  return (
    <StudyFlashCards
      key={flashCardSet.route}
      title={title ? title : flashCardSet.name}
      flashCards={flashCards}
      containerHeight={flashCardSet.containerHeight}
      initialSelectedFlashCardIndices={flashCardSet.initialSelectedFlashCardIndices}
      initialConfigData={flashCardSet.initialConfigData}
      renderFlashCardMultiSelect={flashCardSet.renderFlashCardMultiSelect}
      renderAnswerSelect={flashCardSet.renderAnswerSelect}
      moreInfoUri={!hideMoreInfoUri ? flashCardSet.moreInfoUri : ""}
      enableSettings={enableSettings}
      enableInvertFlashCards={flashCardSet.enableInvertFlashCards}
      customNextFlashCardIdFilter={flashCardSet.customNextFlashCardIdFilter}
      flashCardLevels={flashCardLevels}
      isEmbedded={isEmbedded}
      style={style}
    />
  );
}

export function getPercentToNextLevel(currentFlashCardLevel: FlashCardLevel, quizStats: QuizStats): number {
  const percentCorrects = quizStats.questionStats
    .filter(qs => Utils.arrayContains(currentFlashCardLevel.flashCardIds, qs.questionId))
    .map(qs => qs.percentCorrect);
  return Utils.sum(percentCorrects, p => Math.min(p, 0.85) / percentCorrects.length) / 0.849;
}

export interface IStudyFlashCardsProps {
  title: string;
  flashCards: FlashCard[];
  containerHeight: string;
  initialSelectedFlashCardIndices?: number[];
  initialConfigData: any;
  renderFlashCardMultiSelect?: RenderFlashCardMultiSelectFunc;
  renderAnswerSelect?: RenderAnswerSelectFunc;
  enableSettings?: boolean;
  enableInvertFlashCards?: boolean;
  moreInfoUri?: string;
  customNextFlashCardIdFilter?: CustomNextFlashCardIdFilter;
  flashCardLevels: Array<FlashCardLevel>;
  isEmbedded?: boolean;
  style?: any;
}
export interface IStudyFlashCardsState {
  currentFlashCardId: number;
  sessionFlashCardNumber: number;
  haveGottenCurrentFlashCardWrong: boolean;
  lastCorrectAnswer: any;
  wasCorrect: boolean;
  incorrectAnswers: Array<any>;
  configData: any;
  enabledFlashCardIds: number[];
  showConfiguration: boolean;
  showDetailedStats: boolean;
  isShowingBackSide: boolean;
  invertFlashCards: boolean;
  invertedFlashCards: FlashCard[];
}
export class StudyFlashCards extends React.Component<IStudyFlashCardsProps, IStudyFlashCardsState> {
  public constructor(props: IStudyFlashCardsProps) {
    super(props);

    this.flashCardContainerRef = React.createRef();
    this.flashCardContainerResizeObserver = null;

    if (this.props.initialConfigData && !this.props.initialSelectedFlashCardIndices) {
      Utils.assert(false);
    }

    this.studyAlgorithm.customNextQuestionIdFilter = this.props.customNextFlashCardIdFilter;

    this.state = Object.assign(
      {
        sessionFlashCardNumber: 0,
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
        // TODO: calculate width & height
        const width = 300;
        const height = 300;
        const renderedFlashCard = renderFlashCardSide(width, height, flashCards[i].frontSide);
        return <p key={i}>{renderedFlashCard} {qs.numCorrectGuesses} / {qs.numIncorrectGuesses}</p>;
      }, this);
    
    const currentFlashCard = flashCards[this.state.currentFlashCardId];

    let renderedFlashCardSide: JSX.Element | null;
    let containerWidth = 0;
    let containerHeight = 0;
    if (!this.flashCardContainerRef || !((this.flashCardContainerRef as any).current)) {
      renderedFlashCardSide = null;
    } else {
      const containerElement = (this.flashCardContainerRef as any).current;
      containerWidth = containerElement.offsetWidth;
      containerHeight = containerElement.offsetHeight;

      renderedFlashCardSide = !this.state.isShowingBackSide
        ? renderFlashCardSide(containerWidth, containerHeight, currentFlashCard.frontSide)
        : renderFlashCardSide(containerWidth, containerHeight, currentFlashCard.backSide);
    }

    const numGuesses = this.studyAlgorithm.quizStats.numCorrectGuesses + this.studyAlgorithm.quizStats.numIncorrectGuesses;
    const percentCorrect = (this.studyAlgorithm.quizStats.numIncorrectGuesses !== 0)
      ? (this.studyAlgorithm.quizStats.numCorrectGuesses / numGuesses)
      : 1;
    
    const boundOnAnswer = this.onAnswer.bind(this);
    
    const flashCardContainerStyle: any = {
      fontSize: "1.5em",
      textAlign: "center",
      padding: "0.5em 0",
      height: this.props.containerHeight,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    };

    const watermarkStyle: any = {
      display: this.props.isEmbedded ? "block" : "none",
      position: "absolute",
      bottom: 0,
      right: 0,
      margin: "0.25em",
      fontWeight: "bold",
      opacity: 0.25
    };

    const cardStyle: any = Object.assign(this.props.isEmbedded
      ? { minHeight: "100vh", boxShadow: "none" }
      : { maxWidth: MAX_MAIN_CARD_WIDTH }, this.props.style);

    const enableSettings = (this.props.enableSettings === undefined) || this.props.enableSettings;

    const activeFlashCardLevel = this.getCurrentLevel();
    const nextFlashCardLevel = this.getNextLevel();

    const percentToNextLevel = (activeFlashCardLevel !== undefined)
      ? getPercentToNextLevel(activeFlashCardLevel, this.studyAlgorithm.quizStats)
      : undefined;

    const currentFlashCardKey = `${this.state.sessionFlashCardNumber}.${this.state.currentFlashCardId}`;

    return (
      <Card style={cardStyle}>
        <CardContent style={{position: "relative"}}>
          <div style={{display: "flex"}}>
            <Typography gutterBottom={true} variant="h5" component="h2" style={{flexGrow: 1}}>
              {this.props.title}{this.state.invertFlashCards ? " (Inverted)" : ""}
            </Typography>
            
            {enableSettings ? (
              <Button variant="contained" onClick={event => this.toggleConfiguration()} style={{width: "48px", height: "41px"}}>
                <i
                  className="cursor-pointer material-icons"
                  style={{ verticalAlign: "sub", display: "inline-block" }}
                >
                  settings
                </i>
              </Button>
            ) : null}
          </div>

          {this.state.showConfiguration ? (
            <Paper style={{padding: "1em", margin: "1em 0"}}>
              {(this.props.enableInvertFlashCards && false) ? <div><Checkbox checked={this.state.invertFlashCards} onChange={event => this.toggleInvertFlashCards()} /> Invert Flash Cards</div> : null}
              {false ? <p>{flashCards.length} Flash Cards</p> : null}
              {this.renderFlashCardMultiSelect(flashCards)}
            </Paper>
          ) : null}

          {(!this.props.isEmbedded && this.props.moreInfoUri) ? <p style={{ margin: "0.5em 0" }}><a href={this.props.moreInfoUri} className="moreInfoLink" target="_blank">To learn more, click here.</a></p> : null}

          {this.props.renderAnswerSelect
            ? (
              <p style={{marginBottom: "0", marginTop: "0", lineHeight: "1.5"}}>
                <span style={{paddingRight: "1em"}}>{this.studyAlgorithm.quizStats.numCorrectGuesses} / {this.studyAlgorithm.quizStats.numIncorrectGuesses} correct ({(100 * percentCorrect).toFixed(2)}%)</span>
                <span key={currentFlashCardKey}>
                  <i
                    className="material-icons fade-out"
                    style={{
                      color: "green",
                      verticalAlign: "bottom",
                      display: (this.state.wasCorrect && !this.state.haveGottenCurrentFlashCardWrong) ? "inline-block" : "none"
                    }}>
                    check_circle
                  </i>
                </span>
                <span key={this.state.incorrectAnswers.length}>
                  <i
                    className="material-icons fade-out"
                    style={{
                      color: "red",
                      verticalAlign: "bottom",
                      display: this.state.haveGottenCurrentFlashCardWrong ? "inline-block" : "none"
                    }}>
                    cancel
                  </i>
                </span>
              </p>
            )
            : null
          }
          {(activeFlashCardLevel !== undefined)
            ? (
              <p style={{marginBottom: "0", marginTop: "0", lineHeight: "1.5"}}>
                <span style={{paddingRight: "1em"}}>Level: {activeFlashCardLevel.name}</span>
              </p>
            )
            : null
          }
          
          {(nextFlashCardLevel !== undefined)
            ? (
              <p style={{marginBottom: "0", marginTop: "0", lineHeight: "1.5"}}>
                <span style={{paddingRight: "1em"}}>Next level: {nextFlashCardLevel.name}</span>
              </p>
            )
            : null
          }

          {((percentToNextLevel !== undefined) && (nextFlashCardLevel !== undefined))
            ? (
              <div style={{ width: "100%", height: "0.25em", backgroundColor: "gray" }}>
                <div style={{ width: `${Math.round(100 * percentToNextLevel)}%`, height: "100%", backgroundColor: "green" }} />
              </div>
            )
            : null
          }

          {this.state.showDetailedStats ? questionStats : null}

          <div
            ref={this.flashCardContainerRef}
            key={currentFlashCardKey}
            style={flashCardContainerStyle}
          >
            {renderedFlashCardSide}
          </div>

          <div style={{textAlign: "center"}}>
            {this.props.renderAnswerSelect ? (
              this.props.renderAnswerSelect(
                new RenderAnswerSelectArgs(
                  containerWidth, containerHeight, flashCards,
                  this.state.enabledFlashCardIds, this.state.configData,
                  this.state.invertFlashCards, this.state.currentFlashCardId,
                  currentFlashCard, boundOnAnswer, this.state.lastCorrectAnswer,
                  this.state.incorrectAnswers
                )
              )
             ) : null}

            <div style={{marginTop: "1em"}}>
              <Button
                onClick={event => this.flipFlashCard()}
                variant="contained"
              >
                Show {this.state.isShowingBackSide ? "Question" : "Answer"}
              </Button>
              <Button
                onClick={event => this.moveToNextFlashCard(null, false)}
                variant="contained"
              >
                {!this.props.renderAnswerSelect ? "Next" : "Skip"}
              </Button>
            </div>
          </div>
        </CardContent>
        
        <p style={watermarkStyle} className="watermark">https://falsetto.app</p>
      </Card>
    );
  }
  public componentDidMount() {
    this.flashCardContainerResizeObserver = new ResizeObserver((entries, observer) => {
      this.forceUpdate();
    });
    
    this.flashCardContainerResizeObserver.observe((this.flashCardContainerRef as any).current);

    this.forceUpdate();
  }
  public componentWillUnmount() {
    if (this.flashCardContainerResizeObserver) {
      this.flashCardContainerResizeObserver.disconnect();
    }
  }

  private flashCardContainerRef: React.Ref<HTMLDivElement>;
  private flashCardContainerResizeObserver: ResizeObserver | null;
  private studyAlgorithm: StudyAlgorithm = new LeitnerStudyAlgorithm(5);

  private getCurrentLevel(): FlashCardLevel | undefined {
    if (this.props.flashCardLevels.length === 0) {
      return undefined;
    }

    if (this.state.enabledFlashCardIds.length === this.props.flashCards.length) {
      return new FlashCardLevel(DefaultFlashCardMultiSelect.FINAL_FLASH_CARD_LEVEL_NAME, this.state.enabledFlashCardIds);
    }

    return this.props.flashCardLevels
      .find(level => Utils.areArraysEqual(this.state.enabledFlashCardIds, level.flashCardIds));
  }
  private getNextLevel(): FlashCardLevel | undefined {
    const currentLevel = this.getCurrentLevel();
    if (currentLevel === undefined) {
      return undefined;
    }
    
    if (currentLevel.flashCardIds.length === this.props.flashCards.length) {
      return undefined;
    }
    
    const currentLevelIndex = this.props.flashCardLevels
      .findIndex(level => level === currentLevel);
    if (currentLevelIndex < 0) {
      return undefined;
    } else if (currentLevelIndex === (this.props.flashCardLevels.length - 1)) {
      return new FlashCardLevel(DefaultFlashCardMultiSelect.FINAL_FLASH_CARD_LEVEL_NAME, this.state.enabledFlashCardIds);
    }

    return this.props.flashCardLevels[currentLevelIndex + 1];
  }

  private renderFlashCardMultiSelect(flashCards: FlashCard[]): JSX.Element {
    const onEnabledFlashCardIndicesChange = this.onEnabledFlashCardIndicesChange.bind(this);

    return this.props.renderFlashCardMultiSelect
      ? this.props.renderFlashCardMultiSelect(
        flashCards, this.state.enabledFlashCardIds, this.state.configData, onEnabledFlashCardIndicesChange
      )
      : <DefaultFlashCardMultiSelect
          flashCards={flashCards}
          configData={this.state.configData}
          flashCardLevels={this.props.flashCardLevels}
          selectedFlashCardIndices={this.state.enabledFlashCardIds}
          onChange={onEnabledFlashCardIndicesChange}
        />;
  }
  
  private getInitialStateForFlashCards(
    flashCards: FlashCard[],
    enabledQuestionIds: Array<number> | undefined
  ) {
    this.studyAlgorithm.reset(flashCards.map((_, i) => i), flashCards);

    if (enabledQuestionIds) {
      this.studyAlgorithm.enabledQuestionIds = enabledQuestionIds;
    }
    
    return {
      currentFlashCardId: this.studyAlgorithm.getNextQuestionId(),
      haveGottenCurrentFlashCardWrong: false,
      lastCorrectAnswer: null,
      wasCorrect: false,
      incorrectAnswers: [],
      enabledFlashCardIds: this.studyAlgorithm.enabledQuestionIds
    };
  }

  private onAnswer(answerDifficulty: AnswerDifficulty, answer: any) {
    if (!this.state.haveGottenCurrentFlashCardWrong) {
      this.studyAlgorithm.onAnswer(answerDifficulty);

      const eventId = isAnswerDifficultyCorrect(answerDifficulty) ? "answer_correct" : "answer_incorrect";
      const eventLabel = this.state.currentFlashCardId.toString();
      const eventValue = undefined;
      const eventCategory = this.props.title;
      Analytics.trackCustomEvent(
        eventId, eventLabel, eventValue, eventCategory
      );
    }

    if (isAnswerDifficultyCorrect(answerDifficulty)) {
      this.moveToNextFlashCard(answer, !this.state.haveGottenCurrentFlashCardWrong);
    } else {
      this.setState({
        haveGottenCurrentFlashCardWrong: true,
        incorrectAnswers: Utils.uniq(this.state.incorrectAnswers.concat(answer))
      });
    }
  }

  private toggleConfiguration() {
    this.setState({ showConfiguration: !this.state.showConfiguration });
  }
  private onEnabledFlashCardIndicesChange(newValue: number[], newConfigData: any) {
    this.studyAlgorithm.enabledQuestionIds = newValue;

    const stateDelta: any = { enabledFlashCardIds: newValue, configData: newConfigData };
    const onStateChanged = !Utils.arrayContains(newValue, this.state.currentFlashCardId)
      ? () => this.moveToNextFlashCard(null, false)
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
      const inversion = invertFlashCards(this.props.flashCards, this.state.enabledFlashCardIds);
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
    this.onAnswer(AnswerDifficulty.Incorrect, null);
    this.setState({ isShowingBackSide: !this.state.isShowingBackSide });
  }
  private moveToNextFlashCard(lastCorrectAnswer: any, wasCorrect: boolean) {
    this.setState({
      currentFlashCardId: this.studyAlgorithm.getNextQuestionId(),
      sessionFlashCardNumber: this.state.sessionFlashCardNumber + 1,
      haveGottenCurrentFlashCardWrong: false,
      isShowingBackSide: false,
      lastCorrectAnswer: lastCorrectAnswer,
      incorrectAnswers: [],
      wasCorrect: wasCorrect
    });
  }
}