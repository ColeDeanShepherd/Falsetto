import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("Major Degree 1 Mode", "Ionian"),
    new FlashCard("Major Degree 2 Mode", "Dorian"),
    new FlashCard("Major Degree 3 Mode", "Phrygian"),
    new FlashCard("Major Degree 4 Mode", "Lydian"),
    new FlashCard("Major Degree 5 Mode", "Mixolydian"),
    new FlashCard("Major Degree 6 Mode", "Aeolian"),
    new FlashCard("Major Degree 7 Mode", "Locrian"),
    new FlashCard("Melodic Minor Degree 1 Mode", "Melodic Minor"),
    new FlashCard("Melodic Minor Degree 2 Mode", "Phrygian ♯6 or Dorian ♭2"),
    new FlashCard("Melodic Minor Degree 3 Mode", "Lydian Augmented"),
    new FlashCard("Melodic Minor Degree 4 Mode", "Lydian Dominant"),
    new FlashCard("Melodic Minor Degree 5 Mode", "Mixolydian ♭6"),
    new FlashCard("Melodic Minor Degree 6 Mode", "Half-Diminished"),
    new FlashCard("Melodic Minor Degree 7 Mode", "Altered dominant"),
    new FlashCard("Harmonic Minor Degree 1 Mode", "Harmonic Minor"),
    new FlashCard("Harmonic Minor Degree 2 Mode", "Locrian ♯6"),
    new FlashCard("Harmonic Minor Degree 3 Mode", "Ionian ♯5"),
    new FlashCard("Harmonic Minor Degree 4 Mode", "Ukrainian Dorian"),
    new FlashCard("Harmonic Minor Degree 5 Mode", "Phrygian Dominant"),
    new FlashCard("Harmonic Minor Degree 6 Mode", "Lydian ♯2"),
    new FlashCard("Harmonic Minor Degree 7 Mode", "Altered Diminished"),
    new FlashCard("Double Harmonic Major Degree 1 Mode", "Double Harmonic Major"),
    new FlashCard("Double Harmonic Major Degree 2 Mode", "Lydian ♯2 ♯6"),
    new FlashCard("Double Harmonic Major Degree 3 Mode", "Phrygian ♭♭7 ♭4"),
    new FlashCard("Double Harmonic Major Degree 4 Mode", "Hungarian Minor"),
    new FlashCard("Double Harmonic Major Degree 5 Mode", "Locrian ♮6 ♮3 or Mixolydian ♭5 ♭2"),
    new FlashCard("Double Harmonic Major Degree 6 Mode", "Ionian ♯5 ♯2"),
    new FlashCard("Double Harmonic Major Degree 7 Mode", "Locrian ♭♭3 ♭♭7 "),
  ];
}
export function createQuiz(): Quiz {
  const scaleDegrees = ["1", "2", "3", "4", "5", "6", "7"];
  const scaleDegreeModes = [
    "Ionian",
    "Dorian",
    "Phrygian",
    "Lydian",
    "Mixolydian",
    "Aeolian",
    "Locrian"
  ];
  const answers = [
    "Ionian",
    "Dorian",
    "Phrygian",
    "Lydian",
    "Mixolydian",
    "Aeolian",
    "Locrian"
  ];
  
  return createTextMultipleChoiceQuiz(
    "Major Scale Degree Modes",
    scaleDegrees,
    scaleDegreeModes,
    answers,
    false
  );
}