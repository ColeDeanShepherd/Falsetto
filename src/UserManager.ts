export type UserId = number;

export interface IUserManager {
  getCurrentUserId(): UserId;
}

export class UserManager implements IUserManager {
  public getCurrentUserId(): UserId {
    return -1; // TODO: implement
  }
}