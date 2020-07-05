import { IAction } from '../IAction';

export class NavigateAction implements IAction {
  public static readonly Id = "app/navigate";

  public constructor(public to: string) {}
  public getId() {
    return NavigateAction.Id;
  }
}

export class SignUpAction implements IAction {
  public static readonly Id = "app/signUp";

  public constructor(public sessionToken: string) {}

  public getId() {
    return SignUpAction.Id;
  }
}

export class LoginAction implements IAction {
  public static readonly Id = "app/login";

  public constructor(public sessionToken: string) {}

  public getId() {
    return LoginAction.Id;
  }
}

export class LogoutAction implements IAction {
  public static readonly Id = "app/logout";

  public constructor() {}

  public getId() {
    return LogoutAction.Id;
  }
}