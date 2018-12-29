import { FlashCard } from "./FlashCard";
import { AnswerDifficulty } from './StudyAlgorithm';

export class FlashCardGroup {
  public renderFlashCardMultiSelect?: (selectedFlashCardIndices: number[], onChange: (newValue: number[]) => void) => JSX.Element;
  public renderAnswerSelect?: (flashCard: FlashCard, onAnswer: (answerDifficulty: AnswerDifficulty) => void) => JSX.Element;
  public enableInvertFlashCards: boolean = true;
  
  public constructor(
    public name: string,
    public flashCards: FlashCard[]
  ) {}
}