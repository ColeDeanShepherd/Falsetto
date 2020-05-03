import * as React from "react";
import {
  Button, Card, CardContent, Typography, Paper
} from "@material-ui/core";

import { areArraysEqual } from "../lib/Core/ArrayUtils";
import { FlashCard, FlashCardId } from "../FlashCard";
import { renderFlashCardSide } from "../Components/FlashCard";
import { DefaultFlashCardMultiSelect } from "../Components/Utils/DefaultFlashCardMultiSelect";
import { FlashCardSet, FlashCardLevel } from '../FlashCardSet';
import { Size2D } from '../lib/Core/Size2D';
import { NavLinkView } from '../NavLinkView';
import { StudyFlashCardsModel, getPercentToNextLevel } from './Model';
import { unwrapValueOrUndefined } from '../lib/Core/Utils';

export function createStudyFlashCardSetComponent(
  flashCardSet: FlashCardSet, isEmbedded: boolean, hideMoreInfoUri: boolean,
  title?: string, style?: any, enableSettings?: boolean, showRelatedExercises?: boolean
): JSX.Element {
  return (
    <StudyFlashCardsView
      key={flashCardSet.route}
      title={title ? title : flashCardSet.name}
      flashCardSet={flashCardSet}
      hideMoreInfoUri={hideMoreInfoUri}
      enableSettings={enableSettings}
      isEmbedded={isEmbedded} // TODO: remove
      showRelatedExercises={showRelatedExercises}
      style={style}
    />
  );
}

export interface ILevelProgressBarViewProps {
  percentToNextLevel: number;
}
export class LevelProgressBarView extends React.Component<ILevelProgressBarViewProps, {}> {
  public render(): JSX.Element {
    const { percentToNextLevel } = this.props;

    return (
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
    );
  }
}

export interface IWatermarkViewProps {
  isEmbedded: boolean;
}
export class WatermarkView extends React.Component<IWatermarkViewProps, {}> {
  public render(): JSX.Element {
    const { isEmbedded } = this.props;

    const watermarkStyle: any = {
      display: isEmbedded ? "block" : "none",
      position: "absolute",
      bottom: 0,
      right: 0,
      margin: "0.25em",
      fontWeight: "bold",
      opacity: 0.25
    };

    return <p style={watermarkStyle} className="watermark">https://falsetto.app</p>;
  }
}

// TODO: make flash card studying work without a view (use model & actions)
// TODO: optimize levels?
// TODO: cache local answers & try to upload them to the DB if you're logged in

export interface IStudyFlashCardsViewProps {
  title: string;
  hideMoreInfoUri: boolean;
  flashCardSet: FlashCardSet;
  enableSettings?: boolean;
  isEmbedded?: boolean;
  style?: any;
  showRelatedExercises?: boolean;
}
export class StudyFlashCardsView extends React.Component<IStudyFlashCardsViewProps, {}> {
  private model: StudyFlashCardsModel;

  public constructor(props: IStudyFlashCardsViewProps) {
    super(props);

    const { flashCardSet } = this.props;

    this.model = new StudyFlashCardsModel(flashCardSet);

    this.onModelUpdate = () => this.forceUpdate();
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
    const { flashCardSet, flashCards, flashCardLevels, studyAlgorithm } = model;
    const { isEmbedded } = this.props;

    // TODO: move consts out of here
    const flashCardContainerStyle: any = {
      fontSize: "1.5em",
      textAlign: "center",
      padding: "0.5em 0",
      height: flashCardSet.containerHeight,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    };

    const cardStyle: any = Object.assign(this.props.isEmbedded
      ? { minHeight: "100vh", boxShadow: "none" }
      : { marginBottom: "1em" }, this.props.style);

    let cardContents: JSX.Element;

    if (model.isInitialized) {
      const flashCardStats = studyAlgorithm.flashCardSetStats.flashCardStats
        .map((fcs, i) => {
          // TODO: calculate width & height
          const size = new Size2D(300, 300);
          const renderedFlashCard = renderFlashCardSide(size, flashCards[i].frontSide);
          return <p key={i}>{renderedFlashCard} {fcs.numCorrectGuesses} / {fcs.numIncorrectGuesses}</p>;
        }, this);
      
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
        : new FlashCardLevel(flashCardSet.name, model.enabledFlashCardIds, () => null);

      const percentToNextLevel = (currentLevel !== undefined)
        ? getPercentToNextLevel(currentLevel, studyAlgorithm.flashCardSetStats)
        : undefined;

      const currentFlashCardKey = `${model.sessionFlashCardNumber}.${model.currentFlashCardId}`;
      const moreInfoUri = !this.props.hideMoreInfoUri ? flashCardSet.moreInfoUri : "";

      const renderAnswerSelect = currentFlashCard.renderAnswerSelectFn
        ? currentFlashCard.renderAnswerSelectFn
        : flashCardSet.renderAnswerSelect;

      cardContents = (
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
  
          {model.showConfiguration ? (
            <Paper style={{padding: "1em", margin: "1em 0"}}>
              <Typography component="h6" variant="h6" gutterBottom={true}>Settings</Typography>
              {this.renderFlashCardMultiSelect(containerSize, flashCards)}
            </Paper>
          ) : null}
  
          {(!this.props.isEmbedded && moreInfoUri) ? <p style={{ margin: "0.5em 0" }}><a href={moreInfoUri} className="moreInfoLink" target="_blank">To learn more, click here.</a></p> : null}
  
          {flashCardSet.renderAnswerSelect
            ? (
              <p style={{marginBottom: "0", marginTop: "0", lineHeight: "1.5"}}>
                <span style={{paddingRight: "1em"}}>{studyAlgorithm.flashCardSetStats.numCorrectGuesses} / {studyAlgorithm.flashCardSetStats.numIncorrectGuesses} correct ({(100 * percentCorrect).toFixed(2)}%)</span>
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
          }
          
          {(percentToNextLevel !== undefined)
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
                      variant="contained"
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
                      variant="contained"
                      style={{ textTransform: "none" }}
                    >
                      Level {model.getLevelDisplayName(nextLevelIndex)}
                    </Button>
                  ) : null}
                </div>
              </p>
            )
            : null
          }
  
          {(percentToNextLevel !== undefined)
            ? <LevelProgressBarView percentToNextLevel={percentToNextLevel} />
            : null
          }
  
          {model.showDetailedStats ? flashCardStats : null}
  
          <div
            key={currentFlashCardKey}
            style={flashCardContainerStyle}
          >
            <div style={model.isShowingBackSide ? { display: "none" } : { width: "100%" }}>{renderedFlashCardFrontSide}</div>
            <div style={!model.isShowingBackSide ? { display: "none" } : { width: "100%" }}>{renderedFlashCardBackSide}</div>
          </div>
  
          <div style={{textAlign: "center"}}>
            <div style={{ visibility: !model.isShowingBackSide ? "visible" : "hidden" }}>
              {renderAnswerSelect
                ? renderAnswerSelect(model.getStudySessionInfo(containerSize))
                : null}
            </div>
  
            <div style={{marginTop: "1em"}}>
              <Button
                onClick={event => this.flipFlashCard()}
                variant="contained"
              >
                Show {model.isShowingBackSide ? "Question" : "Answer"}
              </Button>
              <Button
                onClick={event => this.moveToNextFlashCard(null)}
                variant="contained"
              >
                {!flashCardSet.renderAnswerSelect ? "Next" : "Skip"}
              </Button>
            </div>
          </div>
        </div>
      );
    } else {
      cardContents = <p>Loading...</p>;
    }

    const showRelatedExercises = (this.props.showRelatedExercises !== undefined)
      ? this.props.showRelatedExercises
      : true;

    return (
      <div style={{ textAlign: "left" }}>
        <Card style={cardStyle}>
          <CardContent style={{position: "relative"}}>
            {cardContents}
          </CardContent>
          
          <WatermarkView isEmbedded={isEmbedded ? isEmbedded : false} />
        </Card>
        {(!this.props.isEmbedded && showRelatedExercises && (flashCardSet.relatedSets.length > 0)) ? (
          <Card style={cardStyle}>
            <CardContent style={{position: "relative"}}>
              <Typography gutterBottom={true} variant="h5" component="h2" style={{flexGrow: 1}}>
                Related Exercises
              </Typography>

              <ul>
                {flashCardSet.relatedSets
                  .map(relatedSet => (
                    <li key={relatedSet.id}>
                      <NavLinkView to={relatedSet.route}>{relatedSet.name}</NavLinkView>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}
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
              <Button key={levelIndex} variant="contained" onClick={event => this.changeLevel(levelIndex)} style={style}>
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
}
