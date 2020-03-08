import { UserProfile } from './UserProfile';

export interface IUserManager {
  getCurrentUser(): UserProfile | null;
  loginWithRedirect(): void;
  logout(): void;
}

export class UserManager implements IUserManager {
  public getCurrentUser(): UserProfile | null {
    return null;
  }
  public loginWithRedirect(): void {}
  public logout(): void {}
}