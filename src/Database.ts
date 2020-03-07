import * as Utils from "./Utils";
import { FlashCardId } from './FlashCard';
import { UserId } from './UserProfile';
import { apiBaseUri } from './Config';

export class FlashCardAnswer {
  public constructor(
    public flashCardId: FlashCardId,
    public userId: UserId,
    // public answer: string; ???
    public percentCorrect: number,
    public createdAt: Date
  ) {}
}

export interface IDatabase {
  getAnswers(flashCardIds: Array<FlashCardId> | null, userId: UserId | null): Promise<Array<FlashCardAnswer>>;
  addAnswers(answers: Array<FlashCardAnswer>): Promise<void>;
}

export class TwoTierDatabase implements IDatabase {
  public async getAnswers(flashCardIds: Array<FlashCardId> | null, userId: UserId | null): Promise<Array<FlashCardAnswer>> {
    // load remote answers if logged in
    if (userId !== null) {
      const remoteAnswers = await this.remoteDatabase.getAnswers(flashCardIds, userId);
      return remoteAnswers;
    } else {
      const localAnswers = await this.inMemoryDatabase.getAnswers(flashCardIds, userId);
      return localAnswers;
    }
  }
  public async addAnswers(answers: Array<FlashCardAnswer>): Promise<void> {
    throw new Error("Not implemented");
  }

  private inMemoryDatabase = new InMemoryDatabase();
  private remoteDatabase = new RemoteDatabase();
}

export class InMemoryDatabase implements IDatabase {
  public async getAnswers(flashCardIds: Array<FlashCardId> | null, userId: UserId | null): Promise<Array<FlashCardAnswer>> {
    let result = this.flashCardAnswers;

    if (flashCardIds !== null) {
      result = result.filter(fca => Utils.arrayContains(flashCardIds, fca.flashCardId));
    }

    if (userId !== null) {
      result = result.filter(fca => fca.userId === userId);
    }

    return result;
  }
  public async addAnswers(answers: Array<FlashCardAnswer>): Promise<void> {
    for (const answer of answers) {
      this.flashCardAnswers.push(answer);
    }
  }

  private flashCardAnswers: Array<FlashCardAnswer> = [];
}

export class RemoteDatabase implements IDatabase {
  public async getAnswers(flashCardIds: Array<FlashCardId> | null, userId: UserId | null): Promise<Array<FlashCardAnswer>> {
    const requestBody = {
      flashCardIds: flashCardIds
    };
    const requestInit: RequestInit = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    };
    const response = await fetch(`${apiBaseUri}/useranswers`, requestInit);
    if (!response.ok) {
      return Promise.reject(`Failed loading answers (${response.statusText})`);
    }

    return response.json();
  }
  public async addAnswers(answers: Array<FlashCardAnswer>): Promise<void> {
    const requestBody = {
      answers: answers
    };
    const requestInit: RequestInit = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    };
    const response = await fetch(`${apiBaseUri}/useranswers/create`, requestInit);
    if (!response.ok) {
      return Promise.reject(`Failed adding answers (${response.statusText})`);
    }
  }
}