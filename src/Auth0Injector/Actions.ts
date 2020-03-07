import { IAction } from '../IAction';

export class Auth0UpdateAction implements IAction {
  public static readonly Id = "auth0/update";

  public constructor() {}
  public getId() {
    return Auth0UpdateAction.Id;
  }
}