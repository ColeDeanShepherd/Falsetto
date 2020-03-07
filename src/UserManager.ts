import { UserProfile } from './UserProfile';

export interface IUserManager {
  getCurrentUserId(): number;
  getCurrentUser(): UserProfile | null;
  loginWithRedirect(): void;
  logout(): void;
}

export class UserManager implements IUserManager {
  // TODO: remove
  public getCurrentUserId(): number {
    return -1;
  }

  public getCurrentUser(): UserProfile | null {
    return null;
  }
  public loginWithRedirect(): void {}
  public logout(): void {}
}