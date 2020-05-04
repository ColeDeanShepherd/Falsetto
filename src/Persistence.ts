import { Pitch } from "./lib/TheoryLib/Pitch";

export function createFromPersistedData(
  persistedData: IMidiInputDeviceSettingsPersistedData
): MidiInputDeviceSettings {
  return new MidiInputDeviceSettings(
    persistedData.activeInputDeviceName,
    persistedData.activeInputDeviceMidiNumberRange
      ? [
        Pitch.createFromMidiNumber(persistedData.activeInputDeviceMidiNumberRange[0]),
        Pitch.createFromMidiNumber(persistedData.activeInputDeviceMidiNumberRange[1])
      ]
      : undefined
  );
}

export function toPersistedData(settings: MidiInputDeviceSettings): IMidiInputDeviceSettingsPersistedData {
  return {
    activeInputDeviceName: settings.activeInputDeviceName,
    activeInputDeviceMidiNumberRange: settings.activeInputDevicePitchRange
      ? [
        settings.activeInputDevicePitchRange[0].midiNumber,
        settings.activeInputDevicePitchRange[1].midiNumber
      ]
      : undefined
  };
}

export class MidiInputDeviceSettings {
  public constructor(
    public activeInputDeviceName: string | undefined,
    public activeInputDevicePitchRange: [Pitch, Pitch] | undefined
  ) {}
}

export interface IMidiInputDeviceSettingsPersistedData {
  activeInputDeviceName?: string,
  activeInputDeviceMidiNumberRange?: [number, number]
}

export function serializeMidiInputDeviceSettings(settings: MidiInputDeviceSettings): string {
  return JSON.stringify(toPersistedData(settings));
}

// TODO: validation?
export function deserializeMidiInputDeviceSettings(serializedSettings: string): MidiInputDeviceSettings | undefined {
  const persistedData = JSON.parse(serializedSettings) as IMidiInputDeviceSettingsPersistedData;
  if (!persistedData) { return undefined; }

  return createFromPersistedData(persistedData);
}

export const midiInputDeviceSettingsStorageKey = "midiInputDeviceSettings";

export function loadMidiInputDeviceSettings(): MidiInputDeviceSettings | undefined {
  const serializedSettings = localStorage.getItem(midiInputDeviceSettingsStorageKey);

  // If we found serialized settings, deserialize & return them.
  if (serializedSettings) {
    return deserializeMidiInputDeviceSettings(serializedSettings);
  }
  // If we didn't find serialized settings, return undefined.
  else {
    return undefined;
  }
}

export function saveMidiInputDeviceSettings(settings: MidiInputDeviceSettings | undefined) {
  // If settings is defined, serialize & store it in localStorage.
  if (settings) {
    localStorage.setItem(midiInputDeviceSettingsStorageKey, serializeMidiInputDeviceSettings(settings));
  }
  // If settings is undefined, clear the setting in localStorage.
  else {
    localStorage.removeItem(midiInputDeviceSettingsStorageKey);
  }
}