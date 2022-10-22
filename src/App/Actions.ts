import { IAction } from '../IAction';

export class NavigateAction implements IAction {
  public static readonly Id = "app/navigate";

  public constructor(public to: string) {}
  public getId() {
    return NavigateAction.Id;
  }
}