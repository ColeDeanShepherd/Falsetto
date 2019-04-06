export type Scale = {
  type: string,
  formulaString: string
};

export const scales = [
  {
    type: "Ionian (Major)",
    formulaString: "1 2 3 4 5 6 7"
  },
  {
    type: "Dorian",
    formulaString: "1 2 b3 4 5 6 b7"
  },
  {
    type: "Phrygian",
    formulaString: "1 b2 b3 4 5 b6 b7"
  },
  {
    type: "Lydian",
    formulaString: "1 2 3 #4 5 6 7"
  },
  {
    type: "Mixolydian",
    formulaString: "1 2 3 4 5 6 b7"
  },
  {
    type: "Aeolian (Natural Minor)",
    formulaString: "1 2 b3 4 5 b6 b7"
  },
  {
    type: "Locrian",
    formulaString: "1 b2 b3 4 b5 b6 b7"
  },
  {
    type: "Melodic Minor",
    formulaString: "1 2 b3 4 5 6 7"
  },
  {
    type: "Harmonic Minor",
    formulaString: "1 2 b3 4 5 b6 7"
  },

  {
    type: "Tonic Diminished",
    formulaString: "1 2 b3 4 b5 b6 bb7 7"
  },
  {
    type: "Dominant Diminished",
    formulaString: "1 b2 b3 b4 b5 5 6 b7"
  },
  {
    type: "Whole Tone",
    formulaString: "1 2 3 #4 #5 b7"
  },
  {
    type: "Augmented",
    formulaString: "1 #2 3 5 #5 7"
  },
  {
    type: "Major Pentatonic",
    formulaString: "1 2 3 5 6"
  },
  {
    type: "Minor Pentatonic",
    formulaString: "1 b3 4 5 b7"
  },
  {
    type: "Major Blues",
    formulaString: "1 2 b3 3 5 6"
  },
  {
    type: "Minor Blues",
    formulaString: "1 b3 4 b5 5 b7"
  },

  {
    type: "Dorian b2",
    formulaString: "1 b2 b3 4 5 6 b7"
  },
  {
    type: "Lydian Aug.",
    formulaString: "1 2 3 #4 #5 6 7"
  },
  {
    type: "Mixolydian #11",
    formulaString: "1 2 3 #4 5 6 b7"
  },
  {
    type: "Mixolydian b6",
    formulaString: "1 2 3 4 5 b6 b7"
  },
  {
    type: "Locrian Nat. 9",
    formulaString: "1 2 b3 4 b5 b6 b7"
  },
  {
    type: "Altered Dominant",
    formulaString: "1 b2 b3 b4 b5 b6 b7"
  },
  {
    type: "Locrian Nat. 6",
    formulaString: "1 b2 b3 4 b5 6 b7"
  },
  {
    type: "Ionian Aug.",
    formulaString: "1 2 3 4 #5 6 7"
  },
  {
    type: "Dorian #11",
    formulaString: "1 2 b3 #4 5 6 b7"
  },
  {
    type: "Phrygian Major",
    formulaString: "1 b2 3 4 5 b6 b7"
  },
  {
    type: "Lydian #9",
    formulaString: "1 #2 3 #4 5 6 7"
  },
  {
    type: "Altered Dominant bb7",
    formulaString: "1 b2 b3 b4 b5 b6 bb7"
  }
];