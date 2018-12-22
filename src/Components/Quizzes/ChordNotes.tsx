import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";
import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("major", "1 3 5"),
    new FlashCard("minor", "1 b3 5"),
    new FlashCard("diminished", "1 b3 b5"),
    new FlashCard("augmented", "1 3 #5"),
    new FlashCard("sus2", "1 2 5"),
    new FlashCard("sus4", "1 4 5"),
    new FlashCard("lydian", "1 #4 5"),
    new FlashCard("sus4b5", "1 4 5b"),
    new FlashCard("phryg", "1 b2 5"),
    new FlashCard("maj7", "1 3 5 7"),
    new FlashCard("7", "1 3 5 b7"),
    new FlashCard("-7", "1 b3 5 b7"),
    new FlashCard("-7b5", "1 b3 b5 b7"),
    new FlashCard("dim7", "1 b3 b5 bb7"),
    new FlashCard("+Ma7", "1 3 #5 7"),
    new FlashCard("-Ma7", "1 b3 5 7"),
    new FlashCard("+7", "1 3 #5 b7"),
    new FlashCard("dimMa7", "1 b3 b5 7"),
    new FlashCard("-7#5", "1 b3 #5 b7"),
    new FlashCard("quartal", "1 4 b7"),
    new FlashCard("quartal aug.", "1 4 7"),
    new FlashCard("G+4Q", "1 #4 7")
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