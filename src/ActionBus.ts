import { IAction } from "./IAction";
import { isProduction } from './Config';
import { removeElement } from "./lib/Core/ArrayUtils";
import { ILogger, ConsoleLogger } from './Logger';
import { DependencyInjector } from './DependencyInjector';

export type ActionHandler = (action: IAction) => void;

export class ActionBus {
  public static get instance(): ActionBus {
    if (!ActionBus._instance) {
      ActionBus._instance = new ActionBus(
        DependencyInjector.instance.getRequiredService<ILogger>("ILogger")
      );
    }

    return ActionBus._instance;
  }
  private static _instance: ActionBus;

  private static isProduction = isProduction();

  public constructor(private logger: ILogger) {
  }
  public subscribe(actionHandler: ActionHandler) {
    this.actionHandlers.push(actionHandler);
  }
  public unsubscribe(actionHandler: ActionHandler) {
    removeElement(this.actionHandlers, actionHandler);
  }

  public dispatch(action: IAction) {
    if (!ActionBus.isProduction) {
      this.logger.logInfo("Action:", action.getId(), action);
    }

    for (const actionHandler of this.actionHandlers) {
      actionHandler(action);
    }
  }

  private actionHandlers = new Array<ActionHandler>();
}