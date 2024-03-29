import * as React from "react";

import { areArraysEqual } from "../../lib/Core/ArrayUtils";
import { FlashCard, FlashCardId } from "../../FlashCard";
import { renderFlashCardSide } from "../../ui/FlashCard";
import { DefaultFlashCardMultiSelect } from "../../ui/Utils/DefaultFlashCardMultiSelect";
import { FlashCardSet, FlashCardLevel } from '../../FlashCardSet';
import { Size2D } from '../../lib/Core/Size2D';
import { NavLinkView } from '../NavLinkView';
import { StudyFlashCardsModel, getPercentToNextLevel } from '../../StudyFlashCards/Model';
import { unwrapValueOrUndefined } from '../../lib/Core/Utils';
import { LevelProgressBarView } from "../../ui/Utils/LevelProgressBarView";
import { QuizStudyAlgorithm } from '../../Study/StudyAlgorithm';
import { Card } from "../Card/Card";
import { Button } from "../Button/Button";

export function createStudyFlashCardSetComponent(
  flashCardSet: FlashCardSet, hideMoreInfoUri: boolean,
  title?: string, style?: any, enableSettings?: boolean, renderCard?: boolean
): JSX.Element {
  return (
    <StudyFlashCardsView
      key={flashCardSet.route}
      title={title ? title : flashCardSet.name}
      flashCardSet={flashCardSet}
      hideMoreInfoUri={hideMoreInfoUri}
      enableSettings={enableSettings}
      style={style}
      renderCard={renderCard}
    />
  );
}

// TODO: make flash card studying work without a view (use model & actions)
// TODO: optimize levels?
// TODO: cache local answers & try to upload them to the DB if you're logged in

export interface IStudyFlashCardsViewProps {
  title: string;
  hideMoreInfoUri: boolean;
  renderCard?: boolean;
  quizMode?: boolean;
  flashCardSet: FlashCardSet;
  enableSettings?: boolean;
  style?: any;
  onQuizFinished?: () => void;
}

export class StudyFlashCardsView extends React.Component<IStudyFlashCardsViewProps, {}> {
  private model: StudyFlashCardsModel;

  public constructor(props: IStudyFlashCardsViewProps) {
    super(props);

    const { flashCardSet } = this.props;

    const studyAlgorithm = this.getIsQuizMode()
      ? new QuizStudyAlgorithm()
      : undefined;
    this.model = new StudyFlashCardsModel(flashCardSet, studyAlgorithm);

    this.onModelUpdate = () => {
      if (this.props.onQuizFinished && this.getIsDoneWithQuiz()) {
        this.props.onQuizFinished();
      }

      this.forceUpdate();
    };
    this.model.subscribeToUpdates(this.onModelUpdate);

    this.model.initAsync(); // purposely not awaiting
  }
  
  // #region Lifecycle Methods

  private onModelUpdate: () => void;

  public componentWillUnmount() {
    this.model.unsubscribeFromUpdates(this.onModelUpdate);
  }

  // #endregion

  // #region Render

  // TODO: break up
  public render(): JSX.Element {
    const { model } = this;
    const { flashCardSet, flashCards, flashCardLevels, studyAlgorithm, isShowingBackSide } = model;

    // TODO: move consts out of here
    const flashCardContainerStyle: any = {
      width: "100%",
      fontSize: "1.5em",
      textAlign: "center",
      marginBottom: "1em"
    };

    const cardStyle: any = Object.assign(
      { height: "100%", marginBottom: "1em", position: "relative", overflowY: "auto" },
      this.props.style
    );

    let cardContents: JSX.Element;

    if (model.isInitialized) {
      const currentFlashCard = unwrapValueOrUndefined(
        flashCards.find(fc => fc.id === model.currentFlashCardId)
      );

      let containerSize = new Size2D(0, 0); // TODO: use size-aware container
      let renderedFlashCardFrontSide =
        renderFlashCardSide(containerSize, currentFlashCard.frontSide);
      let renderedFlashCardBackSide =
        renderFlashCardSide(containerSize, currentFlashCard.backSide);

      const numGuesses = studyAlgorithm.flashCardSetStats.numCorrectGuesses + studyAlgorithm.flashCardSetStats.numIncorrectGuesses;
      const percentCorrect = (studyAlgorithm.flashCardSetStats.numIncorrectGuesses !== 0)
        ? (studyAlgorithm.flashCardSetStats.numCorrectGuesses / numGuesses)
        : 1;
      
      const enableSettings = (this.props.enableSettings === undefined) || this.props.enableSettings;

      const prevLevelIndex = model.getPrevLevelIndex();
      const currentLevelIndex = model.getCurrentLevelIndex();
      const nextLevelIndex = model.getNextLevelIndex();

      const currentLevel = (currentLevelIndex !== undefined)
        ? flashCardLevels[currentLevelIndex]
        : undefined;

      const percentToNextLevel = (currentLevel !== undefined)
        ? getPercentToNextLevel(currentLevel, studyAlgorithm.flashCardSetStats)
        : undefined;

      const currentFlashCardKey = `${model.sessionFlashCardNumber}.${model.currentFlashCardId}`;
      const moreInfoUri = !this.props.hideMoreInfoUri ? flashCardSet.moreInfoUri : "";

      const renderAnswerSelect = currentFlashCard.renderAnswerSelectFn
        ? currentFlashCard.renderAnswerSelectFn
        : flashCardSet.renderAnswerSelect;
      
      const isAnswerSelectVisible = (!currentFlashCard.doesUserDetermineCorrectness || isShowingBackSide) &&
        !model.haveGottenCurrentFlashCardWrong;

      const isFrontSideVisible = (!isShowingBackSide || model.haveGottenCurrentFlashCardWrong);
      const isBackSideVisible = (isShowingBackSide || model.haveGottenCurrentFlashCardWrong);

      const isQuizMode = this.getIsQuizMode();

      const isDoneWithQuiz = this.getIsDoneWithQuiz();

      const renderHeader = () => (
        <div>
          <div style={{display: "flex"}}>
            <h2 className="h3" style={{flexGrow: 1}}>
              {this.props.title}
            </h2>
            
            {enableSettings ? (
              <Button onClick={event => this.toggleConfiguration()} style={{width: "48px", height: "41px"}}>
                <i
                  className="cursor-pointer material-icons"
                  style={{ verticalAlign: "sub", display: "inline-block" }}
                >
                  settings
                </i>
              </Button>
            ) : null}
          </div>
  
          {model.showConfiguration ? (
            <Card style={{ margin: "1em 0" }}>
              <h6 className="margin-bottom">Settings</h6>
              {this.renderFlashCardMultiSelect(containerSize, flashCards)}
            </Card>
          ) : null}
  
          {moreInfoUri
            ? <p style={{ margin: "0.5em 0" }}><a href={moreInfoUri} className="moreInfoLink" target="_blank">To learn more, click here.</a></p>
            : null}
          {renderCorrectIncorrectIcon()}
          {renderLevelProgressAndControls()}
        </div>
      );

      const renderCorrectIncorrectIcon = () => (
        renderAnswerSelect
          ? (
            <p style={{marginBottom: "0", marginTop: "0", lineHeight: "1.5"}}>
              <span style={{paddingRight: "1em"}}>{studyAlgorithm.flashCardSetStats.numCorrectGuesses} / {studyAlgorithm.flashCardSetStats.numCorrectGuesses + studyAlgorithm.flashCardSetStats.numIncorrectGuesses} correct ({(100 * percentCorrect).toFixed(2)}%)</span>
              <span key={`ca.${model.correctAnswerIconKeySuffix}`}>
                <i
                  className="material-icons fade-out"
                  style={{
                    color: "green",
                    verticalAlign: "bottom",
                    display: model.startShowingCorrectAnswerIcon ? "inline-block" : "none"
                  }}>
                  check_circle
                </i>
              </span>
              <span key={`ia.${model.incorrectAnswerIconKeySuffix}`}>
                <i
                  className="material-icons fade-out"
                  style={{
                    color: "red",
                    verticalAlign: "bottom",
                    display: model.startShowingIncorrectAnswerIcon ? "inline-block" : "none"
                  }}>
                  cancel
                </i>
              </span>
            </p>
          )
          : null
      );

      const renderLevelProgressAndControls = () => ([
        (percentToNextLevel !== undefined)
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
                    onClick={event => model.moveToPrevLevel()}
                    style={{ textTransform: "none" }}
                  >
                    Level {model.getLevelDisplayName(prevLevelIndex)}
                  </Button>
                ) : null}
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <span style={{ paddingRight: "1em" }}>
                  {(currentLevelIndex !== undefined) ? (
                    <span>Level {model.getLevelDisplayName(currentLevelIndex)} &mdash; </span>
                  ) : null}
                  {(percentToNextLevel !== undefined) ? <span>{Math.round(100 * percentToNextLevel)}%</span> : null}
                </span>
              </div>
              <div style={{ flex: 1, textAlign: "right" }}>
                {(nextLevelIndex !== undefined) ? (
                  <Button
                    onClick={event => model.moveToNextLevel()}
                    style={{ textTransform: "none" }}
                  >
                    Level {model.getLevelDisplayName(nextLevelIndex)}
                  </Button>
                ) : null}
              </div>
            </p>
          )
          : null,
        
        (percentToNextLevel !== undefined)
          ? <LevelProgressBarView percentToNextLevel={percentToNextLevel} />
          : null
      ]);

      const renderFlashCardControls = () => (
        <div style={{ textAlign: "center" }}>
          {!model.haveGottenCurrentFlashCardWrong
            ? (
              <Button
                onClick={event => this.flipFlashCard()}
              >
                Show {isShowingBackSide ? "Question" : "Answer"}
              </Button>
            )
            : null}

          {(flashCards.length > 1)
            ? (
              <Button
                onClick={event => this.moveToNextFlashCard(null)}
              >
                {(!renderAnswerSelect || model.haveGottenCurrentFlashCardWrong) ? "Next" : "Skip"}
              </Button>
            )
            : null}
        </div>
      );

      const renderAnswerableFlashCard = () => (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1 }}>
          {isFrontSideVisible ? (
            <div
              key={`${currentFlashCardKey}.front`}
              style={flashCardContainerStyle}>
              {renderedFlashCardFrontSide}
            </div>
          ) : null}
          {isBackSideVisible ? (
            <div
              key={`${currentFlashCardKey}.back`}
              style={flashCardContainerStyle}
            >
              {model.haveGottenCurrentFlashCardWrong
                ? (
                  <p>
                    <i
                      className="material-icons"
                      style={{
                        color: "red",
                        display: "inline-block",
                        fontSize: "1.3em",
                        verticalAlign: "bottom"
                      }}>
                      cancel
                    </i>

                    <span> Incorrect</span>
                  </p>
                )
                : null}
              <p style={{ textDecoration: "underline" }}>Correct Answer</p>
              {renderedFlashCardBackSide}
            </div>
          ) : null}
          
          {(renderAnswerSelect && isAnswerSelectVisible)
            ? <div style={{ textAlign: "center" }}>{renderAnswerSelect(model.getStudySessionInfo(containerSize))}</div>
            : null}
        </div>
      );

      const renderQuizResults = () => (
        <p>
          <i
            className="material-icons"
            style={{
              color: "green",
              display: "inline-block",
              fontSize: "1.3em",
              verticalAlign: "bottom"
            }}>
            check_circle
          </i>

          <span> Correct!</span>
        </p>
      );

      cardContents = !isDoneWithQuiz
        ? (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {!isQuizMode ? renderHeader() : null}
            {renderAnswerableFlashCard()}
            {renderFlashCardControls()}
          </div>
        )
        : (
          <div style={{ display: "flex", flexDirection: "column", textAlign: "center", fontSize: "1.5em", height: "100%", justifyContent: "center" }}>
            {renderQuizResults()}
          </div>
        );
    } else {
      cardContents = <p>Loading...</p>;
    }

    const renderCard = (this.props.renderCard !== undefined)
      ? this.props.renderCard
      : true;

    return (
      <div style={{ textAlign: "left", height: "100%" }}>
        {renderCard
          ? (
            <Card style={cardStyle}>
              {cardContents}
            </Card>
          )
          : cardContents}
      </div>
    );
  }
  
  private renderFlashCardMultiSelect(
    containerSize: Size2D, flashCards: FlashCard[]
  ): JSX.Element {
    const { model } = this;

    const onEnabledFlashCardIndicesChange = this.onEnabledFlashCardIdsChange.bind(this);
    const levelButtons = (model.flashCardLevels.length > 0)
      ? (model.flashCardLevels
          .map((level, levelIndex) => {
            const style: any = { textTransform: "none" };
                    
            const isPressed = areArraysEqual(model.enabledFlashCardIds, level.flashCardIds);
            if (isPressed) {
              style.backgroundColor = "#959595";
            }

            return (
              <Button key={levelIndex} onClick={event => this.changeLevel(levelIndex)} style={style}>
                {model.getLevelDisplayName(levelIndex)}
              </Button>
            );
          })
      ) : null;

    return (
      <div>
        {(model.flashCardLevels.length > 0) ? (
          <div>
            <span style={{ paddingRight: "1em" }}>Levels:</span>
            {levelButtons}
          </div>
        ) : null}
        {model.flashCardSet.renderFlashCardMultiSelect
          ? model.flashCardSet.renderFlashCardMultiSelect(
            model.getStudySessionInfo(containerSize), onEnabledFlashCardIndicesChange
          )
          : (
            <DefaultFlashCardMultiSelect
              flashCards={flashCards}
              configData={model.configData}
              selectedFlashCardIds={model.enabledFlashCardIds}
              onChange={onEnabledFlashCardIndicesChange}
            />
          )}
      </div>
    );
  }

  // #endregion Render

  // #region UI Events

  private flipFlashCard() {
    this.model.flipFlashCard();
  }

  private moveToNextFlashCard(lastCorrectAnswer: any) {
    this.model.skipFlashCard();
  }

  private changeLevel(levelIndex: number) {
    this.model.changeLevel(levelIndex);
  }

  private toggleConfiguration() {
    this.model.toggleShowConfiguration();
  }

  private onEnabledFlashCardIdsChange(newValue: Array<FlashCardId>, newConfigData: any) {
    this.model.changeEnabledFlashCards(newValue, newConfigData);
  }

  // #endregion UI Events

  public getIsQuizMode(): boolean {
    return (this.props.quizMode !== undefined)
      ? this.props.quizMode
      : false;
  }

  public getIsDoneWithQuiz(): boolean {
    const isQuizMode = this.getIsQuizMode();

    return isQuizMode
      && (this.model.studyAlgorithm as QuizStudyAlgorithm).isDone;
  }
}
