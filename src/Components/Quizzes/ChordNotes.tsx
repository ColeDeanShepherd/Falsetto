import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("1 3 5", "major"),
    new FlashCard("1 b3 5", "minor"),
    new FlashCard("1 b3 b5", "diminished"),
    new FlashCard("1 3 #5", "augmented"),
    new FlashCard("1 2 5", "sus2"),
    new FlashCard("1 4 5", "sus4"),
    new FlashCard("1 #4 5", "lydian"),
    new FlashCard("1 4 5b", "sus4b5"),
    new FlashCard("1 b2 5", "phryg"),
    new FlashCard("1 3 5 7", "maj7"),
    new FlashCard("1 3 5 b7", "7"),
    new FlashCard("1 b3 5 b7", "-7"),
    new FlashCard("1 b3 b5 b7", "-7b5"),
    new FlashCard("1 b3 b5 bb7", "dim7"),
    new FlashCard("1 3 #5 7", "+Ma7"),
    new FlashCard("1 b3 5 7", "-Ma7"),
    new FlashCard("1 3 #5 b7", "+7"),
    new FlashCard("1 b3 b5 7", "dimMa7"),
    new FlashCard("1 b3 #5 b7", "-7#5"),
    new FlashCard("1 4 b7", "quartal"),
    new FlashCard("1 4 7", "quartal aug."),
    new FlashCard("1 #4 7", "G+4Q"),
  ];
}
export function createQuiz(): Quiz {
  const chordNotes = [
    "1 3 5",
    "1 b3 5",
    "1 b3 b5",
    "1 3 #5",
    "1 2 5",
    "1 4 5",
    "1 #4 5",
    "1 4 5b",
    "1 b2 5",
    "1 3 5 7",
    "1 3 5 b7",
    "1 b3 5 b7",
    "1 b3 b5 b7",
    "1 b3 b5 bb7",
    "1 3 #5 7",
    "1 b3 5 7",
    "1 3 #5 b7",
    "1 b3 b5 7",
    "1 b3 #5 b7",
    "1 4 b7",
    "1 4 7",
    "1 #4 7"
  ];
  const chordTypes = [
    "major",
    "minor",
    "diminished",
    "augmented",
    "sus2",
    "sus4",
    "lydian",
    "sus4b5",
    "phryg",
    "maj7",
    "7",
    "-7",
    "-7b5",
    "dim7",
    "+Ma7",
    "-Ma7",
    "+7",
    "dimMa7",
    "-7#5",
    "quartal",
    "quartal aug.",
    "G+4Q"
  ];
  
  return createTextMultipleChoiceQuiz(
    "Chord Notes",
    chordNotes,
    chordTypes,
    chordTypes,
    false
  );
}