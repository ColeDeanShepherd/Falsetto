import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("Major 1 Chord Type", "major"),
    new FlashCard("Major 2 Chord Type", "minor"),
    new FlashCard("Major 3 Chord Type", "minor"),
    new FlashCard("Major 4 Chord Type", "major"),
    new FlashCard("Major 5 Chord Type", "major"),
    new FlashCard("Major 6 Chord Type", "minor"),
    new FlashCard("Major 7 Chord Type", "diminished"),
  ];
}