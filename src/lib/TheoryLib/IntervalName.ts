import { Pitch } from './Pitch';
import { mod } from '../Core/MathUtils';
import { precondition, invariant } from '../Core/Dbc';

export interface IntervalName {
  type: number;
  quality: number;
}

export function createIntervalName(type: number, quality: number): IntervalName {
  invariant(Number.isInteger(type) && (type > 0));
  invariant(Number.isInteger(quality));

  return {
    type,
    quality
  };
}

export function intervalNameFromPitches(
  pitch1: Pitch,
  pitch2: Pitch
): IntervalName {
  let lowerPitch: Pitch;
  let higherPitch: Pitch;

  if (
    (pitch1.midiNumber < pitch2.midiNumber) ||
    (pitch1.lineOrSpaceOnStaffNumber < pitch2.lineOrSpaceOnStaffNumber)
  ) {
    lowerPitch = pitch1;
    higherPitch = pitch2;
  } else {
    lowerPitch = pitch2;
    higherPitch = pitch1;
  }

  const intervalType = higherPitch.lineOrSpaceOnStaffNumber - lowerPitch.lineOrSpaceOnStaffNumber + 1;
  const intervalName: IntervalName = {
    type: intervalType,
    quality: 0
  };

  const halfSteps = (higherPitch.midiNumber - lowerPitch.midiNumber);
  intervalName.quality = halfSteps - getHalfSteps(intervalName);
  
  return intervalName;
}

export function fromHalfSteps(halfSteps: number): IntervalName {
  const numOctaves = Math.floor(halfSteps / 12);
  const baseType = 1 + (7 * numOctaves);
  const simpleIntervalHalfSteps = halfSteps % 12;

  switch (simpleIntervalHalfSteps) {
    case 0:
      return { type: baseType, quality: 0 };
    case 1:
      return { type: baseType + 1, quality: -1 };
    case 2:
      return { type: baseType + 1, quality: 0 };
    case 3:
      return { type: baseType + 2, quality: -1 };
    case 4:
      return { type: baseType + 2, quality: 0 };
    case 5:
      return { type: baseType + 3, quality: 0 };
    case 6:
      return { type: baseType + 4, quality: -1 };
    case 7:
      return { type: baseType + 4, quality: 0 };
    case 8:
      return { type: baseType + 5, quality: -1 };
    case 9:
      return { type: baseType + 5, quality: 0 };
    case 10:
      return { type: baseType + 6, quality: -1 };
    case 11:
      return { type: baseType + 6, quality: 0 };
    default:
      throw new Error();
  }
}

export function getSimpleIntervalType(intervalType: number): number {
  return 1 + mod((intervalType - 1), 7);
}

export function getSimpleIntervalTypeHalfSteps(simpleIntervalType: number): number {
  precondition((simpleIntervalType >= 1) && (simpleIntervalType <= 8));

  switch (simpleIntervalType) {
    case 1:
      return 0;
    case 2:
      return 2;
    case 3:
      return 4;
    case 4:
      return 5;
    case 5:
      return 7;
    case 6:
      return 9;
    case 7:
      return 11;
    case 8:
      return 12;
    default:
      throw new Error(`Invalid simple interval type: ${simpleIntervalType}`);
  }
}

export function getHalfSteps(intervalName: IntervalName): number {
  const octaveCount = Math.floor(intervalName.type / 8);
  const simpleIntervalHalfSteps = getSimpleIntervalTypeHalfSteps(getSimpleIntervalType(intervalName.type));

  return (12 * octaveCount) + simpleIntervalHalfSteps + intervalName.quality;
}

// TODO: add tests
export function getQualityString(intervalName: IntervalName): string {
  switch (getSimpleIntervalType(intervalName.type)) {
    case 1:
    case 4:
    case 5:
    case 8:
      if (intervalName.quality === 0) {
          return "P";
      } else if (intervalName.quality > 0) {
          return "A".repeat(intervalName.quality);
      } else { // intervalName.quality < 0
          return "d".repeat(-intervalName.quality);
      }
    default:
      if (intervalName.quality === 0) {
          return "M";
      } else if (intervalName.quality >= 1) {
          return "A".repeat(intervalName.quality - 1);
      } else if (intervalName.quality === -1) {
          return "m";
      } else { // intervalName.quality <= -2
          return "d".repeat(-(intervalName.quality + 1));
      }
  }
}

// TODO: add tests
export function getInvertedSimple(intervalName: IntervalName): IntervalName {
  const simpleIntervalType = getSimpleIntervalType(intervalName.type);
  if ((simpleIntervalType === 1) || (simpleIntervalType === 8)) {
      return { type: intervalName.type, quality: intervalName.quality };
  }

  const invertedSimpleIntervalType = 9 - simpleIntervalType;
  const invertedIntervalHalfSteps = 12 - getHalfSteps(intervalName);
  const invertedQuality = invertedIntervalHalfSteps - getSimpleIntervalTypeHalfSteps(invertedSimpleIntervalType);
  return { type: invertedSimpleIntervalType, quality: invertedQuality };
}

export function equals(intervalName: IntervalName, i: IntervalName): boolean {
  return (intervalName.type === i.type) && (intervalName.quality === i.quality);
}

export function toString(intervalName: IntervalName): string {
  return `${getQualityString(intervalName)}${intervalName.type}`;
}

export function intervalQualityStringToNumber(intervalQualityString: string): number {
  switch (intervalQualityString) {
    case "P":
    case "M":
      return 0;
    case "m":
    case "d":
      return -1;
    case "A":
      return 1;
    default:
      throw new Error(`Unknown interval quality: ${intervalQualityString}`);
  }
}

export function createIntervalLevels(includeUnison: boolean, separateA4D5: boolean) {
  const unisonIntervalStrings = includeUnison ? ["P1"] : [];
  const tritoneIntervalStrings = separateA4D5 ? ["A4", "d5"] : ["A4/d5"];

  return [
    {
      name: "Perfect Intervals",
      intervalStrings: unisonIntervalStrings
        .concat(["P4", "P5", "P8"])
    },
    {
      name: "m2, A4/d5, M7",
      intervalStrings: unisonIntervalStrings
        .concat(["m2", "P4"])
        .concat(tritoneIntervalStrings)
        .concat(["P5", "M7", "P8"])
    },
    {
      name: "M2, m7",
      intervalStrings: unisonIntervalStrings
        .concat(["m2", "M2", "P4"])
        .concat(tritoneIntervalStrings)
        .concat(["P5", "m7", "M7", "P8"])
    },
    {
      name: "3rds",
      intervalStrings: unisonIntervalStrings
        .concat(["m2", "M2", "m3", "M3", "P4"])
        .concat(tritoneIntervalStrings)
        .concat(["P5", "m7", "M7", "P8"])
    },
    {
      name: "6ths (All Intervals)",
      intervalStrings: unisonIntervalStrings
      .concat(["m2", "M2", "m3", "M3", "P4"])
      .concat(tritoneIntervalStrings)
      .concat(["P5", "m6", "M6", "m7", "M7", "P8"])
    }
  ];
}

export function intervalQualityToNumber(intervalQuality: string): number {
  switch (intervalQuality) {
    case "P":
    case "M":
      return 0;
    case "m":
    case "d":
      return -1;
    case "A":
      return 1;
    default:
      throw new Error(`Unknown interval quality: ${intervalQuality}`);
  }
}