import * as React from "react";
import { Typography } from "@material-ui/core";

import { FlashCardAnswer, IDatabase } from '../Database';
import { FlashCardSet, FlashCardLevel } from '../FlashCardSet';
import { flashCardSets, groupedFlashCardSets } from '../FlashCardGraph';
import { FlashCardId, FlashCard } from '../FlashCard';
import { FlashCardSetStats } from '../Study/FlashCardSetStats';
import { CircleProgressBar } from './CircleProgressBar';
import { authDomain, authClientId } from '../Config';
import { NavLinkView } from '../NavLinkView';
import { DependencyInjector } from '../DependencyInjector';
import { IUserManager } from '../UserManager';
import { ActionBus } from '../ActionBus';
import { NavigateAction } from '../App/Actions';
import { getFlashCardSetStatsFromAnswers, getPercentToNextLevel, getCurrentFlashCardLevel } from '../StudyFlashCards/Model';
import { mean } from '../lib/Core/ArrayUtils';
import { Card } from "../ui/Card/Card";

class FlashCardSetWithAnswers {
  public constructor(
    public flashCardSet: FlashCardSet,
    public flashCards: Array<FlashCard>,
    public flashCardAnswers: Array<FlashCardAnswer>
  ) {
    this.stats = getFlashCardSetStatsFromAnswers(flashCardSet, flashCards, flashCardAnswers);
    this.levels = (flashCardSet.createFlashCardLevels !== undefined)
      ? flashCardSet.createFlashCardLevels(flashCardSet, flashCards)
      : undefined;
  }

  public stats: FlashCardSetStats;
  public levels: Array<FlashCardLevel> | undefined;
}

type FlashCardSetsWithAnswersGroup = { name: string, sets: Array<FlashCardSetWithAnswers> };

export interface IProfilePageState {
  isLoading: boolean;
  error: string | null;
  groupedSetsWithAnswers: Array<FlashCardSetsWithAnswersGroup> | null;
}
export class ProfilePage extends React.Component<{}, IProfilePageState> {
  public constructor(props: {}) {
    super(props);

    this.userManager = DependencyInjector.instance.getRequiredService<IUserManager>("IUserManager");
    this.database = DependencyInjector.instance.getRequiredService<IDatabase>("IDatabase");

    this.state = {
      isLoading: true,
      error: null,
      groupedSetsWithAnswers: null
    };
  }

  public componentDidMount() {
    const userId = null;
    this.database.getAnswers(null, userId)
      .then(answers => {
        const groupedSetsWithAnswers : Array<FlashCardSetsWithAnswersGroup> = groupedFlashCardSets
          .map(g => {
            return {
              name: g.title,
              sets: g.flashCardSets.map(fcs => {
                const flashCards = fcs.createFlashCards();
                const flashCardIds = new Set<FlashCardId>(flashCards.map(fc => fc.id));
                const setAnswers = answers
                  .filter(a => flashCardIds.has(a.flashCardId));
                return new FlashCardSetWithAnswers(fcs, flashCards, setAnswers)
              })
            };
          });
        this.setState({ isLoading: false, groupedSetsWithAnswers: groupedSetsWithAnswers });
      })
      .catch(error => this.setState({ isLoading: false, error: error }));
  }

  public render(): JSX.Element | null {
    const user = this.userManager.getCurrentUser();
    if (!user) {
      return null;
    }

    return (
      <Card>
        <Typography gutterBottom={true} variant="h5" component="h2" style={{ textAlign: "center" }}>
          {user.fullName}'s Profile
        </Typography>
        <p style={{ textAlign: "center" }}>{user.emailAddress}</p>
        <ul style={{ textAlign: "center", listStyleType: "none", padding: 0, margin: 0 }}>
          <li style={{ display: "inline" }}><a href="#" onClick={event => { this.initiatePasswordReset(); event.stopPropagation(); event.preventDefault(); }}>Reset Password</a></li>
          <li style={{ display: "inline" }}> | </li>
          <li style={{ display: "inline" }}><a href="#" onClick={event => { this.userManager.logout(); event.stopPropagation(); event.preventDefault(); }}>Log Out</a></li>
        </ul>
        {this.renderProgress()}
      </Card>
    );
  }
  
  private userManager: IUserManager;
  private database: IDatabase;

  private renderProgress(): JSX.Element | null {
    if (this.state.isLoading) {
      return <p>Loading...</p>; // TODO: loading spinner
    } else if (this.state.error !== null) {
      return <p>{this.state.error}</p>;
    } else if (this.state.groupedSetsWithAnswers !== null) {
      const circleProgressBarWidth = 60;

      return (
        <div>
          {this.state.groupedSetsWithAnswers.map(g => (
            <div>
              <h3 style={{ textAlign: "center", textDecoration: "underline" }}>{g.name}</h3>
              <ul style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", listStyleType: "none", padding: 0, margin: 0 }}>
                {g.sets.map(swa => {
                  let progressPercent: number;
                  let setNameElem: JSX.Element;

                  if (!swa.levels) {
                    progressPercent = mean(swa.flashCardAnswers, fca => fca.percentCorrect);
                    setNameElem = <span><NavLinkView to={swa.flashCardSet.route}>{swa.flashCardSet.name}</NavLinkView></span>;
                  } else {
                    const [currentLevelIndex, currentLevel] = getCurrentFlashCardLevel(swa.flashCardSet, swa.levels, swa.stats);
                    progressPercent = getPercentToNextLevel(currentLevel, swa.stats);
                    setNameElem = <span><NavLinkView to={swa.flashCardSet.route}>{swa.flashCardSet.name}</NavLinkView><br />(Level {1 + currentLevelIndex}/{swa.levels.length})</span>;
                  }
                  
                  return (
                    <li style={{ width: "140px", padding: 0, marginBottom: "2em", marginRight: "1em" }}>
                      <div style={{ textAlign: "center" }}><CircleProgressBar progress={progressPercent} width={circleProgressBarWidth} /></div>
                      <div style={{ textAlign: "center" }}>{setNameElem}</div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      );
    } else {
      return null;
    }
  }
  private async initiatePasswordReset(): Promise<void> {
    const user = this.userManager.getCurrentUser();
    if (!user) {
      return Promise.reject("Could not get the current user.");
    }

    const requestBody = {
      client_id: authClientId,
      email: user.emailAddress,
      connection: "Username-Password-Authentication"
    };
    const requestInit: RequestInit = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    };
    const response = await fetch(`https://${authDomain}/dbconnections/change_password`, requestInit);
    if (!response.ok) {
      return Promise.reject(`Failed initiating password reset. ${response.statusText}`);
    }

    ActionBus.instance.dispatch(new NavigateAction("/reset-password"));
  }
}