import { Quiz } from "../../Quiz";
import { createTextMultipleChoiceQuiz } from "../Quiz";

export function createQuiz(): Quiz {
  const chordNotes = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7 (in major)",
    "7 (in minor)"
  ];
  const chordTypes = [
    "Tonic",
    "Supertonic",
    "Mediant",
    "Subdominant",
    "Dominant",
    "Submediant",
    "Leading Tone",
    "Subtonic"
  ];
  
  return createTextMultipleChoiceQuiz(
    "Scale Degree Names",
    chordNotes,
    chordTypes,
    chordTypes,
    false
  );
}