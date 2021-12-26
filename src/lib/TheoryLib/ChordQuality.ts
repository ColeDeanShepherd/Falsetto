
export enum ChordQuality {
  Major,
  Dominant,

  Minor,
  MinorMajor,

  Diminished,
  HalfDiminished,
  DiminishedMajor,
  
  Augmented,
  AugmentedMajor,

  Power,
  Quartal
}

export function chordQualityToString(chordQuality: ChordQuality): string {
  switch (chordQuality) {
    case ChordQuality.Major:
      return "Major"
    case ChordQuality.Dominant:
      return "Dominant";

    case ChordQuality.Minor:
        return "Minor";
    case ChordQuality.MinorMajor:
        return "Minor-Major";

    case ChordQuality.Diminished:
        return "Diminished";
    case ChordQuality.HalfDiminished:
        return "Half-Diminished";
    case ChordQuality.DiminishedMajor:
        return "Diminished Major";
    
    case ChordQuality.Augmented:
        return "Augmented";
    case ChordQuality.AugmentedMajor:
        return "Augmented Major";

    case ChordQuality.Power:
        return "Power";
    case ChordQuality.Quartal:
        return "Quartal";
    default:
      throw new Error(`Unknown chord quality: ${chordQuality}`);
  }
}

export function isAugmentedChordQuality(chordQuality: ChordQuality) {
  switch (chordQuality) {
    case ChordQuality.Augmented:
    case ChordQuality.AugmentedMajor:
      return true;
    default:
      return false;
  }
}

export function isDiminishedChordQuality(chordQuality: ChordQuality) {
  switch (chordQuality) {
    case ChordQuality.Diminished:
    case ChordQuality.HalfDiminished:
    case ChordQuality.DiminishedMajor:
      return true;
    default:
      return false;
  }
}