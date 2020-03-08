import { IAction } from "./IAction";
import { isProduction } from './Config';
import { removeElement } from "./lib/Core/ArrayUtils";

export type ActionHandler = (action: IAction) => void;

export class ActionBus {
  public static get instance(): ActionBus {
    if (!ActionBus._instance) {
      ActionBus._instance = new ActionBus();
    }

    return ActionBus._instance;
  }
  private static _instance: ActionBus;

  private static isProduction = isProduction(); // TODO: use dependency injection for logging

  public subscribe(actionHandler: ActionHandler) {
    this.actionHandlers.push(actionHandler);
  }
  public unsubscribe(actionHandler: ActionHandler) {
    removeElement(this.actionHandlers, actionHandler);
  }

  public dispatch(action: IAction) {
    if (!ActionBus.isProduction) {
      console.log("Action:", action.getId(), action); // TODO: use dependency injection for logging
    }

    for (const actionHandler of this.actionHandlers) {
      actionHandler(action);
    }
  }

  private actionHandlers = new Array<ActionHandler>();
}