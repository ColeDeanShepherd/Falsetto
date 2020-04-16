import { IAction } from '../IAction';

export class NavigateAction implements IAction {
  public static readonly Id = "app/navigate";

  public constructor(public to: string) {}
  public getId() {
    return NavigateAction.Id;
  }
}

export class WebMidiInitializedAction implements IAction {
  public static readonly Id = "app/webMidiInitializedAction";

  public constructor() {}
  public getId() {
    return WebMidiInitializedAction.Id;
  }
}

export class MidiDeviceConnectedAction implements IAction {
  public static readonly Id = "app/midiDeviceConnected";

  public constructor(public deviceId: string) {}
  public getId() {
    return MidiDeviceConnectedAction.Id;
  }
}

export class MidiDeviceDisconnectedAction implements IAction {
  public static readonly Id = "app/midiDeviceDisconnected";

  public constructor(public deviceId: string) {}
  public getId() {
    return MidiDeviceDisconnectedAction.Id;
  }
}

export class MidiInputDeviceChangedAction implements IAction {
  public static readonly Id = "app/midiInputDeviceChanged";

  public constructor() {}
  public getId() {
    return MidiInputDeviceChangedAction.Id;
  }
}