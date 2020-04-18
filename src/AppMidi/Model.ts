import WebMidi, { Input as MidiInput, WebMidiEventConnected, WebMidiEventDisconnected } from "webmidi";

import { DependencyInjector } from "../DependencyInjector";
import { ActionBus } from "../ActionBus";
import { MidiDeviceDisconnectedAction, MidiDeviceConnectedAction, MidiInputDeviceChangedAction, WebMidiInitializedAction, MidiInputDevicePitchRangeChangedAction } from './Actions';
import { IDisposable } from "../lib/Core/IDisposable";
import { unwrapValueOrUndefined } from "../lib/Core/Utils";
import { arrayContains } from "../lib/Core/ArrayUtils";
import { ILogger } from "../Logger";
import { Pitch } from "../lib/TheoryLib/Pitch";
import { saveMidiInputDeviceSettings, MidiInputDeviceSettings, loadMidiInputDeviceSettings } from '../Persistence';

export class AppMidiModel implements IDisposable {
  public constructor() {
    this.logger = DependencyInjector.instance.getRequiredService<ILogger>("ILogger");

    this.initializeMidi();
  }

  public dispose() {
    this.uninitializeMidi();
  }

  public get initializeMidiPromise(): Promise<void> {
    return unwrapValueOrUndefined(this._initializeMidiPromise);
  }

  public getMidiInput(): MidiInput | undefined {
    return this.midiInput;
  }

  public setMidiInput(value: MidiInput | undefined) {
    this.setMidiInputInternal(value);
    ActionBus.instance.dispatch(new MidiInputDeviceChangedAction());
  }

  public getMidiInputPitchRange(): [Pitch, Pitch] | undefined {
    return this.midiInputPitchRange;
  }

  public setMidiInputPitchRange(value: [Pitch, Pitch] | undefined) {
    this.setMidiInputPitchRangeInternal(value);
    ActionBus.instance.dispatch(new MidiInputDevicePitchRangeChangedAction());
  }

  private logger: ILogger;

  private _initializeMidiPromise: Promise<void> | undefined;
  private midiInput: MidiInput | undefined;
  private midiInputPitchRange: [Pitch, Pitch] | undefined;

  private initializeMidi() {
    this._initializeMidiPromise = new Promise<void>((resolve, reject) => {
      WebMidi.enable(error => {
        if (!error) {
          if (!this.midiInput && (WebMidi.inputs.length > 0)) {
            this.setMidiInputInternal(WebMidi.inputs[0]);
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
      this.setMidiInputInternal(undefined);
      WebMidi.disable();
    }
  }

  private setMidiInputInternal(value: MidiInput | undefined) {
    this.midiInput = value;
    this.midiInputPitchRange = undefined;

    if (this.midiInput) {
      // If the new MIDI input is defined, try to load the pitch range for it.
      const loadedSettings = loadMidiInputDeviceSettings();
  
      if (loadedSettings && (loadedSettings.activeInputDeviceName === this.midiInput.name)) {
        this.midiInputPitchRange = loadedSettings.activeInputDevicePitchRange;
      }

      // If we selected a different MIDI input than the one we loaded, save the new active MIDI device settings.
      if (!loadedSettings || (loadedSettings.activeInputDeviceName !== this.midiInput.name)) {
        this.saveMidiInputDeviceSettings();
      }
    }
  }

  private setMidiInputPitchRangeInternal(value: [Pitch, Pitch] | undefined) {
    this.midiInputPitchRange = value;

    if (this.midiInput && this.midiInputPitchRange) {
      this.saveMidiInputDeviceSettings();
    }
  }

  private onMidiDeviceConnected(event: WebMidiEventConnected) {
    if (!this.midiInput && (WebMidi.inputs.length > 0)) {
      this.setMidiInputInternal(WebMidi.inputs[0]);
    }

    ActionBus.instance.dispatch(new MidiDeviceConnectedAction(event.port.id));
  }

  private onMidiDeviceDisconnected(event: WebMidiEventDisconnected) {
    if (!arrayContains(WebMidi.inputs, this.midiInput)) {
      this.setMidiInputInternal(undefined);
    }

    if (!this.midiInput && (WebMidi.inputs.length > 0)) {
      this.setMidiInputInternal(WebMidi.inputs[0]);
    }

    ActionBus.instance.dispatch(new MidiDeviceDisconnectedAction(event.port.id));
  }

  private saveMidiInputDeviceSettings() {
    saveMidiInputDeviceSettings(new MidiInputDeviceSettings(
      this.midiInput ? this.midiInput.name : undefined,
      this.midiInputPitchRange ? this.midiInputPitchRange : undefined));
  }
}