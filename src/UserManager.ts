import { UserProfile } from './UserProfile';
import { Auth0InjectorView } from './Auth0Injector/Auth0InjectorView';

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

  /*public getCurrentUser(): UserProfile | null {
    const { user } = (Auth0InjectorView.instance.context as any);
    if (!user) { return null; }

    return new UserProfile(
      user.sub,
      user.nickname,
      user.email
    );
  }
  public loginWithRedirect(): void {
    const { loginWithRedirect } = (Auth0InjectorView.instance.context as any);
    loginWithRedirect({});
  }
  public logout(): void {
    const { logout } = (Auth0InjectorView.instance.context as any);
    logout();
  }*/
}