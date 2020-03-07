import * as React from "react";
import {
  Button, Card, CardContent, Typography, Paper
} from "@material-ui/core";

import * as Utils from "../Utils";
import { IAnalytics } from "../Analytics";
import { FlashCard, FlashCardId } from "../FlashCard";
import { renderFlashCardSide } from "./FlashCard";
import { DefaultFlashCardMultiSelect } from "./Utils/DefaultFlashCardMultiSelect";
import { StudyAlgorithm, LeitnerStudyAlgorithm } from "../StudyAlgorithm";
import { AnswerDifficulty, answerDifficultyToPercentCorrect, isAnswerDifficultyCorrect } from "../AnswerDifficulty";
import { FlashCardSet, FlashCardStudySessionInfo, FlashCardLevel } from '../FlashCardSet';
import { MAX_MAIN_CARD_WIDTH } from './Style';
import { FlashCardSetStats } from '../FlashCardSetStats';
import { IDatabase, FlashCardAnswer } from '../Database';
import { IUserManager } from '../UserManager';
import App from './App';
import { FlashCardStats } from '../FlashCardStats';
import { Size2D } from '../Size2D';
import { DependencyInjector } from '../DependencyInjector';

export async function getFlashCardSetStatsFromDatabase(
  database: IDatabase, userManager: IUserManager,
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>
): Promise<FlashCardSetStats> {
  const userId = userManager.getCurrentUserId(); // TODO remove
  const flashCardIds = flashCards.map(fc => fc.id);
  const answers = await database.getAnswers(flashCardIds, /*userId*/null); // TODO:
  const minPctCorrect = answerDifficultyToPercentCorrect(AnswerDifficulty.Easy);
  const flashCardStats = flashCards
    .map(fc => {
      const numCorrectGuesses = Utils.arrayCountPassing(
        answers, a => (a.flashCardId === fc.id) && (a.percentCorrect >= minPctCorrect)
      );
      const numIncorrectGuesses = Utils.arrayCountPassing(
        answers, a => (a.flashCardId === fc.id) && (a.percentCorrect < minPctCorrect)
      );
      return new FlashCardStats(fc.id, numCorrectGuesses, numIncorrectGuesses);
    });
    return new FlashCardSetStats(flashCardSet.id, flashCardStats);
}
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
      database={App.instance.database}
      userManager={App.instance.userManager}
      title={title ? title : flashCardSet.name}
      flashCardSet={flashCardSet}
      flashCards={flashCards}
      hideMoreInfoUri={hideMoreInfoUri}
      enableSettings={enableSettings}
      flashCardLevels={flashCardLevels}
      isEmbedded={isEmbedded}
      style={style}
    />
  );
}

export function getPercentToNextLevel(currentFlashCardLevel: FlashCardLevel, flashCardSetStats: FlashCardSetStats): number {
  const percentCorrects = flashCardSetStats.flashCardStats
    .filter(qs => Utils.arrayContains(currentFlashCardLevel.flashCardIds, qs.flashCardId))
    .map(qs => qs.percentCorrect);
  return Utils.sum(percentCorrects, p => Math.min(p, 0.85) / percentCorrects.length) / 0.849;
}

export interface IStudyFlashCardsProps {
  database: IDatabase;
  userManager: IUserManager;
  title: string;
  flashCardSet: FlashCardSet;
  flashCards: FlashCard[];
  hideMoreInfoUri: boolean;
  enableSettings?: boolean;
  flashCardLevels: Array<FlashCardLevel>;
  isEmbedded?: boolean;
  style?: any;
}
export interface IStudyFlashCardsState {
  currentFlashCardId: FlashCardId;
  sessionFlashCardNumber: number;
  haveGottenCurrentFlashCardWrong: boolean;
  lastCorrectAnswer: any;
  wasCorrect: boolean;
  incorrectAnswers: Array<any>;
  configData: any;
  enabledFlashCardIds: Array<FlashCardId>;
  showConfiguration: boolean;
  showDetailedStats: boolean;
  isShowingBackSide: boolean;
}
export class StudyFlashCards extends React.Component<IStudyFlashCardsProps, IStudyFlashCardsState> {
  private analytics: IAnalytics;

  public constructor(props: IStudyFlashCardsProps) {
    super(props);

    this.analytics = DependencyInjector.instance.getRequiredService<IAnalytics>("IAnalytics");

    if (
      this.props.flashCardSet.initialConfigData &&
      !this.props.flashCardSet.configDataToEnabledFlashCardIds
    ) {
      Utils.assert(false);
    }

    this.studyAlgorithm.onAnswer
    this.studyAlgorithm.customNextFlashCardIdFilter = this.props.flashCardSet.customNextFlashCardIdFilter;

    this.getInitialStateForFlashCards(
      this.props.flashCards,
      this.getInitialEnabledFlashCardIds()
    )
      .then(partialState => {
        const newState = Object.assign(
          {
            sessionFlashCardNumber: 0,
            showConfiguration: false,
            showDetailedStats: false,
            isShowingBackSide: false,
            configData: this.getInitialConfigData()
          },
          partialState
        );
        this.setState(newState);
      })
      .catch(e => {
        // TODO: handle error
        console.error(e);
      });
  }

  public render(): JSX.Element {
    const flashCardContainerStyle: any = {
      fontSize: "1.5em",
      textAlign: "center",
      padding: "0.5em 0",
      height: this.props.flashCardSet.containerHeight,
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
      : { maxWidth: MAX_MAIN_CARD_WIDTH, marginBottom: "1em" }, this.props.style);

    let cardContents: JSX.Element;

    if (this.state) {
      const { flashCards, flashCardLevels } = this.props;
      const flashCardStats = this.studyAlgorithm.flashCardSetStats.flashCardStats
        .map((fcs, i) => {
          // TODO: calculate width & height
          const size = new Size2D(300, 300);
          const renderedFlashCard = renderFlashCardSide(size, flashCards[i].frontSide);
          return <p key={i}>{renderedFlashCard} {fcs.numCorrectGuesses} / {fcs.numIncorrectGuesses}</p>;
        }, this);
      
      const currentFlashCard = Utils.unwrapValueOrUndefined(
        flashCards.find(fc => fc.id === this.state.currentFlashCardId)
      );

      let containerSize = new Size2D(0, 0); // TODO: use size-aware container
      let renderedFlashCardFrontSide =
        renderFlashCardSide(containerSize, currentFlashCard.frontSide);
      let renderedFlashCardBackSide =
        renderFlashCardSide(containerSize, currentFlashCard.backSide);

      const numGuesses = this.studyAlgorithm.flashCardSetStats.numCorrectGuesses + this.studyAlgorithm.flashCardSetStats.numIncorrectGuesses;
      const percentCorrect = (this.studyAlgorithm.flashCardSetStats.numIncorrectGuesses !== 0)
        ? (this.studyAlgorithm.flashCardSetStats.numCorrectGuesses / numGuesses)
        : 1;
      
      const enableSettings = (this.props.enableSettings === undefined) || this.props.enableSettings;

      const prevLevelIndex = this.getPrevLevelIndex();
      const currentLevelIndex = this.getCurrentLevelIndex();
      const nextLevelIndex = this.getNextLevelIndex();

      const percentToNextLevel = (currentLevelIndex !== undefined)
        ? getPercentToNextLevel(flashCardLevels[currentLevelIndex], this.studyAlgorithm.flashCardSetStats)
        : undefined;

      const currentFlashCardKey = `${this.state.sessionFlashCardNumber}.${this.state.currentFlashCardId}`;
      const moreInfoUri = !this.props.hideMoreInfoUri ? this.props.flashCardSet.moreInfoUri : "";

      cardContents =  (
        <div>
          <div style={{display: "flex"}}>
            <Typography gutterBottom={true} variant="h5" component="h2" style={{flexGrow: 1}}>
              {this.props.title}
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
              <Typography component="h6" variant="h6" gutterBottom={true}>Settings</Typography>
              {this.renderFlashCardMultiSelect(containerSize, flashCards)}
            </Paper>
          ) : null}
  
          {(!this.props.isEmbedded && moreInfoUri) ? <p style={{ margin: "0.5em 0" }}><a href={moreInfoUri} className="moreInfoLink" target="_blank">To learn more, click here.</a></p> : null}
  
          {this.props.flashCardSet.renderAnswerSelect
            ? (
              <p style={{marginBottom: "0", marginTop: "0", lineHeight: "1.5"}}>
                <span style={{paddingRight: "1em"}}>{this.studyAlgorithm.flashCardSetStats.numCorrectGuesses} / {this.studyAlgorithm.flashCardSetStats.numIncorrectGuesses} correct ({(100 * percentCorrect).toFixed(2)}%)</span>
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
          
          {((currentLevelIndex !== undefined) && (percentToNextLevel !== undefined))
            ? (
              <p
                style={{
                  display: "flex",
                  lineHeight: "1.5",
                  margin: "0.5em 0"
                }}>
                <div style={{ flex: 1 }}>
                  {(prevLevelIndex !== undefined) ? (
                    <Button
                      onClick={event => this.moveToPrevLevel()}
                      variant="contained"
                      style={{ textTransform: "none" }}
                    >
                      Level {this.getLevelDisplayName(prevLevelIndex)}
                    </Button>
                  ) : null}
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <span style={{ paddingRight: "1em" }}>
                    <span>Level {this.getLevelDisplayName(currentLevelIndex)}</span>
                    {(percentToNextLevel !== undefined) ? <span> &mdash; {Math.round(100 * percentToNextLevel)}%</span> : null}
                  </span>
                </div>
                <div style={{ flex: 1, textAlign: "right" }}>
                  {(nextLevelIndex !== undefined) ? (
                    <Button
                      onClick={event => this.moveToNextLevel()}
                      variant="contained"
                      style={{ textTransform: "none" }}
                    >
                      Level {this.getLevelDisplayName(nextLevelIndex)}
                    </Button>
                  ) : null}
                </div>
              </p>
            )
            : null
          }
  
          {(percentToNextLevel !== undefined)
            ? (
              <div
                style={{
                  width: "100%",
                  height: "0.25em",
                  backgroundColor: "lightgray",
                  border: "1px solid grey"
                }}>
                <div
                  style={{
                    width: `${Math.round(100 * percentToNextLevel)}%`,
                    height: "100%",
                    backgroundColor: "#0A0"
                  }}
                />
              </div>
            )
            : null
          }
  
          {this.state.showDetailedStats ? flashCardStats : null}
  
          <div
            key={currentFlashCardKey}
            style={flashCardContainerStyle}
          >
            <div style={this.state.isShowingBackSide ? { display: "none" } : {}}>{renderedFlashCardFrontSide}</div>
            <div style={!this.state.isShowingBackSide ? { display: "none" } : {}}>{renderedFlashCardBackSide}</div>
          </div>
  
          <div style={{textAlign: "center"}}>
            {this.props.flashCardSet.renderAnswerSelect ? (
              this.props.flashCardSet.renderAnswerSelect(
                this.getStudySessionInfo(containerSize)
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
                {!this.props.flashCardSet.renderAnswerSelect ? "Next" : "Skip"}
              </Button>
            </div>
          </div>
        </div>
      );
    } else {
      cardContents = <p>Loading...</p>;
    }

    return (
      <div>
        <Card style={cardStyle}>
          <CardContent style={{position: "relative"}}>
            {cardContents}
          </CardContent>
          
          <p style={watermarkStyle} className="watermark">https://falsetto.app</p>
        </Card>
        {(!this.props.isEmbedded && (this.props.flashCardSet.relatedSets.length > 0)) ? (
          <Card style={cardStyle}>
            <CardContent style={{position: "relative"}}>
              <Typography gutterBottom={true} variant="h5" component="h2" style={{flexGrow: 1}}>
                Related Exercises
              </Typography>

              <ul>
                {this.props.flashCardSet.relatedSets
                  .map(relatedSet => (
                    <li key={relatedSet.id}>
                      {App.instance.renderFlashCardSetLink(relatedSet)}
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}
      </div>
    );
  }

  private studyAlgorithm: StudyAlgorithm = new LeitnerStudyAlgorithm(5);

  private getCurrentLevelIndex(): number | undefined {
    if (this.props.flashCardLevels.length === 0) {
      return undefined;
    }

    const result = this.props.flashCardLevels
      .findIndex(level => Utils.areArraysEqual(this.state.enabledFlashCardIds, level.flashCardIds));
    return (result >= 0)
      ? result
      : undefined;
  }
  private getPrevLevelIndex(): number | undefined {
    const currentLevelIndex = this.getCurrentLevelIndex();
    if ((currentLevelIndex === undefined) || (currentLevelIndex === 0)) {
      return undefined;
    }

    return currentLevelIndex - 1;
  }
  private getNextLevelIndex(): number | undefined {
    const currentLevelIndex = this.getCurrentLevelIndex();
    if ((currentLevelIndex === undefined) || (currentLevelIndex >= (this.props.flashCardLevels.length - 1))) {
      return undefined;
    }

    return currentLevelIndex + 1;
  }

  private renderFlashCardMultiSelect(
    containerSize: Size2D, flashCards: FlashCard[]
  ): JSX.Element {
    const onEnabledFlashCardIndicesChange = this.onEnabledFlashCardIdsChange.bind(this);
    const levelButtons = (this.props.flashCardLevels.length > 0)
      ? (this.props.flashCardLevels
          .map((level, levelIndex) => {
            const style: any = { textTransform: "none" };
                    
            const isPressed = Utils.areArraysEqual(this.state.enabledFlashCardIds, level.flashCardIds);
            if (isPressed) {
              style.backgroundColor = "#959595";
            }

            return (
              <Button key={levelIndex} variant="contained" onClick={event => this.activateLevel(levelIndex)} style={style}>
                {this.getLevelDisplayName(levelIndex)}
              </Button>
            );
          })
      ) : null;

    return (
      <div>
        {(this.props.flashCardLevels.length > 0) ? (
            <div>
              <span style={{ paddingRight: "1em" }}>Levels:</span>
              {levelButtons}
            </div>
        ) : null}
        {this.props.flashCardSet.renderFlashCardMultiSelect
          ? this.props.flashCardSet.renderFlashCardMultiSelect(
            this.getStudySessionInfo(containerSize), onEnabledFlashCardIndicesChange
          )
          : (
            <DefaultFlashCardMultiSelect
              flashCards={flashCards}
              configData={this.state.configData}
              selectedFlashCardIds={this.state.enabledFlashCardIds}
              onChange={onEnabledFlashCardIndicesChange}
            />
          )}
      </div>
    );
  }
  
  private async getInitialStateForFlashCards(
    flashCards: FlashCard[],
    enabledFlashCardIds: Array<FlashCardId> | undefined
  ) {
    const flashCardSetStats = await getFlashCardSetStatsFromDatabase(
      this.props.database, this.props.userManager,
      this.props.flashCardSet, this.props.flashCards
    );
    this.studyAlgorithm.reset(
      flashCards.map(fc => fc.id), flashCards, flashCardSetStats
    );

    if (enabledFlashCardIds) {
      this.studyAlgorithm.enabledFlashCardIds = enabledFlashCardIds;
    }
    
    return {
      currentFlashCardId: this.studyAlgorithm.getNextFlashCardId(),
      haveGottenCurrentFlashCardWrong: false,
      lastCorrectAnswer: null,
      wasCorrect: false,
      incorrectAnswers: [],
      enabledFlashCardIds: this.studyAlgorithm.enabledFlashCardIds
    };
  }

  private getInitialConfigData(): any {
    return (this.props.flashCardLevels && (this.props.flashCardLevels.length > 0))
      ? this.props.flashCardLevels[0].createConfigData(this.props.flashCardSet.initialConfigData)
      : this.props.flashCardSet.initialConfigData;
  }
  private getInitialEnabledFlashCardIds(): Array<FlashCardId> {
    if (this.props.flashCardLevels && (this.props.flashCardLevels.length > 0)) {
      return this.props.flashCardLevels[0].flashCardIds.slice();
    } else {
      return this.props.flashCardSet.configDataToEnabledFlashCardIds
        ? this.props.flashCardSet.configDataToEnabledFlashCardIds(
          this.props.flashCardSet, this.props.flashCards, this.getInitialConfigData()
        )
        : this.props.flashCards.map(fc => fc.id)
    }
  }
  private getStudySessionInfo(
    containerSize: Size2D,
  ): FlashCardStudySessionInfo {
    const currentFlashCard = Utils.unwrapValueOrUndefined(
      this.props.flashCards.find(fc => fc.id === this.state.currentFlashCardId)
    );
    const boundOnAnswer = this.onAnswer.bind(this);
    const boundMoveToNextFlashCard = () => this.moveToNextFlashCard(null, false);

    return new FlashCardStudySessionInfo(
      containerSize, this.props.flashCardSet, this.props.flashCards,
      this.state.enabledFlashCardIds, this.state.configData, this.state.currentFlashCardId,
      currentFlashCard, boundOnAnswer, boundMoveToNextFlashCard, this.state.lastCorrectAnswer,
      this.state.incorrectAnswers, this.studyAlgorithm
    );
  }

  private onAnswer(answerDifficulty: AnswerDifficulty, answer: any) {
    if (!this.state.haveGottenCurrentFlashCardWrong) {
      this.studyAlgorithm.onAnswer(answerDifficulty);

      const eventId = isAnswerDifficultyCorrect(answerDifficulty)
        ? "answer_correct"
        : "answer_incorrect";
      const eventLabel = this.state.currentFlashCardId;
      const eventValue = undefined;
      const eventCategory = this.props.flashCardSet.id;

      const userId = this.props.userManager.getCurrentUserId(); // TODO: fix
      const answeredAt = new Date();

      this.props.database.addAnswers([
        new FlashCardAnswer(
          this.state.currentFlashCardId, /*userId*/"", // TODO:
          answerDifficultyToPercentCorrect(answerDifficulty), answeredAt
        )
      ]);
      this.analytics.trackCustomEvent(
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
  private onEnabledFlashCardIdsChange(newValue: Array<FlashCardId>, newConfigData: any) {
    this.studyAlgorithm.enabledFlashCardIds = newValue;

    const stateDelta: any = { enabledFlashCardIds: newValue, configData: newConfigData };
    const onStateChanged = !Utils.arrayContains(newValue, this.state.currentFlashCardId)
      ? () => this.moveToNextFlashCard(null, false)
      : undefined;

    this.setState(stateDelta, onStateChanged);
  }

  private flipFlashCard() {
    this.onAnswer(AnswerDifficulty.Incorrect, null);
    this.setState({ isShowingBackSide: !this.state.isShowingBackSide });
  }
  private moveToNextFlashCard(lastCorrectAnswer: any, wasCorrect: boolean) {
    this.setState({
      currentFlashCardId: this.studyAlgorithm.getNextFlashCardId(
        this.getStudySessionInfo(new Size2D(0, 0))
      ),
      sessionFlashCardNumber: this.state.sessionFlashCardNumber + 1,
      haveGottenCurrentFlashCardWrong: false,
      isShowingBackSide: false,
      lastCorrectAnswer: lastCorrectAnswer,
      incorrectAnswers: [],
      wasCorrect: wasCorrect
    });
  }
  private moveToNextLevel() {
    const nextLevelIndex = this.getNextLevelIndex();
    if (nextLevelIndex === undefined) { return; }

    this.activateLevel(nextLevelIndex);
  }
  private moveToPrevLevel() {
    const prevLevelIndex = this.getPrevLevelIndex();
    if (prevLevelIndex === undefined) { return; }

    this.activateLevel(prevLevelIndex);
  }

  private activateLevel(levelIndex: number) {
    const level = this.props.flashCardLevels[levelIndex];
    const newEnabledFlashCardIds = level.flashCardIds.slice();
    this.onEnabledFlashCardIdsChange(newEnabledFlashCardIds, level.createConfigData(this.state.configData));
  }

  private getLevelDisplayName(levelIndex: number): string {
    const level = this.props.flashCardLevels[levelIndex];
    return (level.name.length > 0)
      ? `${1 + levelIndex}: ${level.name}`
      : (1 + levelIndex).toString();
  }
}