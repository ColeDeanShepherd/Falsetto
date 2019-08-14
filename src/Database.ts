import * as Utils from "./Utils";
import { FlashCardId } from './FlashCard';
import { UserId } from './UserManager';

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
  addAnswer(answer: FlashCardAnswer): Promise<void>;
  getAnswers(flashCardIds: Array<FlashCardId>, userId: number): Promise<Array<FlashCardAnswer>>;
}

export class InMemoryDatabase implements IDatabase {
  public async addAnswer(answer: FlashCardAnswer): Promise<void> {
    this.flashCardAnswers.push(answer);
  }
  public async getAnswers(flashCardIds: Array<FlashCardId>, userId: number): Promise<Array<FlashCardAnswer>> {
    return this.flashCardAnswers
      .filter(fca => Utils.arrayContains(flashCardIds, fca.flashCardId))
      .filter(fca => fca.userId === userId);
  }

  private flashCardAnswers: Array<FlashCardAnswer> = [];
}

// TODO: use the DB in the app whenever the user answers
// TODO: add actual DB implementation, which makes RESTful calls