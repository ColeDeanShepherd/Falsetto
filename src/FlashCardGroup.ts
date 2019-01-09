import { FlashCard } from "./FlashCard";
import { AnswerDifficulty } from './StudyAlgorithm';

export class FlashCardGroup {
  public initialConfigData: any;
  public renderFlashCardMultiSelect?: (
    selectedFlashCardIndices: number[],
    configData: any,
    onChange: (newValue: number[], newConfigData: any) => void
  ) => JSX.Element;
  public renderAnswerSelect?: (
    flashCards: FlashCard[],
    flashCard: FlashCard,
    onAnswer: (answerDifficulty: AnswerDifficulty) => void
  ) => JSX.Element;
  public enableInvertFlashCards: boolean = true;

  public get route(): string {
    return "/" + this.name.toLowerCase().replace(/ /g, "-");
  }
  
  public constructor(
    public name: string,
    public flashCards: FlashCard[]
  ) {}
}