import { History } from "history";
import WebMidi, { Input as MidiInput, WebMidiEventConnected, WebMidiEventDisconnected } from "webmidi";

import { DependencyInjector } from '../DependencyInjector';
import { ActionBus, ActionHandler } from '../ActionBus';
import { IAction } from '../IAction';
import { NavigateAction, MidiDeviceDisconnectedAction, MidiDeviceConnectedAction, MidiInputDeviceChangedAction, WebMidiInitializedAction } from './Actions';
import { IDisposable } from '../lib/Core/IDisposable';
import { IAnalytics } from '../Analytics';
import { precondition } from '../lib/Core/Dbc';
import { unwrapValueOrUndefined } from '../lib/Core/Utils';
import { arrayContains } from '../lib/Core/ArrayUtils';
import { ILogger } from '../Logger';

export class AppState {}
export class AppModel implements IDisposable {
  public static instance: AppModel;

  public state = new AppState();

  public constructor() {
    precondition(!AppModel.instance);
    AppModel.instance = this;

    this.analytics = DependencyInjector.instance.getRequiredService<IAnalytics>("IAnalytics");
    this.history = DependencyInjector.instance.getRequiredService<History<any>>("History");
    this.logger = DependencyInjector.instance.getRequiredService<ILogger>("ILogger");
    this.boundHandleAction = this.handleAction.bind(this);

    ActionBus.instance.subscribe(this.boundHandleAction);
    this.initializeMidi();
  }
  public dispose() {
    this.uninitializeMidi();
    ActionBus.instance.unsubscribe(this.boundHandleAction);
  }

  private analytics: IAnalytics;
  private history: History<any>;
  private logger: ILogger;
  private boundHandleAction: ActionHandler;

  private handleAction(action: IAction) {
    switch (action.getId()) {
      case NavigateAction.Id:
        this.history.push((action as NavigateAction).to);
        this.analytics.trackPageView();
        break;
    }
  }
  
  // #region MIDI

  public get initializeMidiPromise(): Promise<void> {
    return unwrapValueOrUndefined(this._initializeMidiPromise);
  }

  public getMidiInput(): MidiInput | undefined {
    return this.midiInput;
  }

  public setMidiInput(value: MidiInput | undefined) {
    this.midiInput = value;
    ActionBus.instance.dispatch(new MidiInputDeviceChangedAction());
  }

  private _initializeMidiPromise: Promise<void> | undefined;
  private midiInput: MidiInput | undefined;

  private initializeMidi() {
    this._initializeMidiPromise = new Promise<void>((resolve, reject) => {
      WebMidi.enable(error => {
        if (!error) {
          if (!this.midiInput && (WebMidi.inputs.length > 0)) {
            this.midiInput = WebMidi.inputs[0];
          }
          
          WebMidi.addListener("connected", event => this.onMidiDeviceConnected(event));
          WebMidi.addListener("disconnected", event => this.onMidiDeviceDisconnected(event));
          
    ActionBus.instance.dispatch(new WebMidiInitializedAction());
        } else {
          this.logger.logError(error);
        }
        
        resolve();
      });
    });
  }

  private uninitializeMidi() {
    if (WebMidi.enabled) {
      this.midiInput = undefined;
      WebMidi.disable();
    }
  }

  private onMidiDeviceConnected(event: WebMidiEventConnected) {
    if (!this.midiInput && (WebMidi.inputs.length > 0)) {
      this.midiInput = WebMidi.inputs[0];
    }

    ActionBus.instance.dispatch(new MidiDeviceConnectedAction(event.port.id));
  }

  private onMidiDeviceDisconnected(event: WebMidiEventDisconnected) {
    if (!arrayContains(WebMidi.inputs, this.midiInput)) {
      this.midiInput = undefined;
    }

    if (!this.midiInput && (WebMidi.inputs.length > 0)) {
      this.midiInput = WebMidi.inputs[0];
    }

    ActionBus.instance.dispatch(new MidiDeviceDisconnectedAction(event.port.id));
  }

  // #endregion MIDI
}