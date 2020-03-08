import { IAction } from '../IAction';

export class TemplateAction implements IAction {
  public static readonly Id = "template/action";

  public constructor(public to: string) {}
  public getId() {
    return TemplateAction.Id;
  }
}